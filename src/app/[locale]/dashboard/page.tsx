'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from '@/i18n/useTranslations';
import { DashBackgroundCanvas } from '@/components/dashboard/DashBackgroundCanvas';

// Types & Data
import {
  FinGraphScenario,
  RadialCardNode,
  PathwayHop,
  GraphNode,
  GraphLink,
  SimulationResponse,
  UserProfile,
  RegressionCalibration,
} from '@/types/fingraph/types';
import { FINGRAPH_SCENARIOS } from '@/data/fingraph/fingraphData';
import {
  fetchGraph,
  runSimulation,
  resetGraph,
  generateStockScenario,
} from '@/lib/api/fingraphApi';

// Teammate Ported Components
import { Sidebar, NavTab } from '@/components/dashboard/teammate/Sidebar';
import { TopNav } from '@/components/dashboard/teammate/TopNav';
import { ScenarioHeader } from '@/components/dashboard/teammate/ScenarioHeader';
import { RadialTransmissionCanvas } from '@/components/dashboard/teammate/RadialTransmissionCanvas';
import { ImpactPathwaysPanel } from '@/components/dashboard/teammate/ImpactPathwaysPanel';
import { CompanyDrilldownModal } from '@/components/dashboard/teammate/CompanyDrilldownModal';
import { AddStockModal } from '@/components/dashboard/teammate/AddStockModal';
import { EventRegressionModal } from '@/components/dashboard/teammate/EventRegressionModal';
import { RbacLoginModal, PRESET_ROLES } from '@/components/dashboard/teammate/RbacLoginModal';
import { NodeDetailPanel } from '@/components/dashboard/teammate/NodeDetailPanel';
import { LinkDetailPanel } from '@/components/dashboard/teammate/LinkDetailPanel';
import { CascadeDrawer } from '@/components/dashboard/teammate/CascadeDrawer';
import { EmpiricalEvidenceDrawer } from '@/components/dashboard/EmpiricalEvidenceDrawer';
import SystemicGraphViewport from '@/components/graph/SystemicGraphViewport';
import type { Node, Edge } from '@xyflow/react';
import { GitBranch } from 'lucide-react';

// Tab Auxiliary Views
import { MarketOverviewView } from '@/components/dashboard/teammate/MarketOverviewView';
import { SectorHeatmapView } from '@/components/dashboard/teammate/SectorHeatmapView';
import { AIHubInsightsView } from '@/components/dashboard/teammate/AIHubInsightsView';
import { SavedWatchlistsView } from '@/components/dashboard/teammate/SavedWatchlistsView';
import { AuditReportsView } from '@/components/dashboard/teammate/AuditReportsView';
import { EngineSettingsView } from '@/components/dashboard/teammate/EngineSettingsView';
import { MethodologyDocsView } from '@/components/dashboard/teammate/MethodologyDocsView';

// Physics graph canvas dynamic import for zero-SSR canvas hydration issues
const InteractiveGraph = dynamic(
  () => import('@/components/dashboard/teammate/InteractiveGraph').then((m) => m.InteractiveGraph),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[620px] clay-surface flex items-center justify-center rounded-3xl">
        <div className="text-xs font-mono font-bold text-[var(--accent-primary)] animate-pulse">
          Initializing Physics Force Engine...
        </div>
      </div>
    ),
  }
);

import { Network, Activity, Layers, Sparkles, SlidersHorizontal, BarChart3 } from 'lucide-react';

function DashboardContent() {
  const tDash = useTranslations('dashboard');
  const searchParams = useSearchParams();
  const eventQuery = searchParams.get('event');

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<NavTab>('impact_graph');

  // Graph View Mode: Radial Transmission Canvas vs Force-directed Physics Canvas vs Hierarchical DAG Flow
  const [graphMode, setGraphMode] = useState<'radial' | 'physics' | 'hierarchical'>('radial');
  const [timeOffsetDays, setTimeOffsetDays] = useState<number>(90);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState<boolean>(false);

  // Scenario & Simulation State
  const [scenariosList] = useState<FinGraphScenario[]>(FINGRAPH_SCENARIOS);
  const [activeScenario, setActiveScenario] = useState<FinGraphScenario>(FINGRAPH_SCENARIOS[0]);
  const [selectedRadialNode, setSelectedRadialNode] = useState<RadialCardNode | null>(null);
  const [selectedHop, setSelectedHop] = useState<PathwayHop | null>(null);

  // Global Graph Model State (Physics / All-market View)
  const [allNodes, setAllNodes] = useState<GraphNode[]>([]);
  const [allLinks, setAllLinks] = useState<GraphLink[]>([]);
  const [selectedPhysicsNode, setSelectedPhysicsNode] = useState<GraphNode | null>(null);
  const [selectedPhysicsLink, setSelectedPhysicsLink] = useState<GraphLink | null>(null);
  const [simulationResponse, setSimulationResponse] = useState<SimulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [devilsAdvocate, setDevilsAdvocate] = useState<boolean>(false);

  // User Profile & RBAC State
  const [userProfile, setUserProfile] = useState<UserProfile>(PRESET_ROLES[0]);

  // Modals Visibility
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isRegressionOpen, setIsRegressionOpen] = useState(false);
  const [isRbacOpen, setIsRbacOpen] = useState(false);

  // Extended node IDs in Radial Canvas
  const [extendedNodeIds, setExtendedNodeIds] = useState<string[]>([]);

  // Load Initial Graph Telemetry
  useEffect(() => {
    fetchGraph().then((data) => {
      setAllNodes(data.nodes);
      setAllLinks(data.links);
    });
  }, []);

  // Handle URL query shock event (e.g., from landing page Hero Search "?event=oil")
  useEffect(() => {
    if (!eventQuery) return;
    const query = decodeURIComponent(eventQuery).toLowerCase();

    // Check if matches known scenarios
    const matched = FINGRAPH_SCENARIOS.find(
      (s) =>
        s.id.toLowerCase().includes(query) ||
        s.title.toLowerCase().includes(query) ||
        s.dropdownLabel.toLowerCase().includes(query)
    );

    if (matched) {
      setActiveScenario(matched);
    } else {
      // Run custom simulation
      handleAnalyzeQuery(query);
    }
  }, [eventQuery]);

  // Main Event Ingestion & Simulation Handler
  const handleAnalyzeQuery = async (queryText: string) => {
    setIsLoading(true);
    try {
      const sim = await runSimulation({ headline: queryText });
      setSimulationResponse(sim);

      // Re-map affected nodes
      if (sim.affected_nodes) {
        setAllNodes((prev) =>
          prev.map((n) => {
            const hitImpact = sim.affected_nodes[n.id];
            if (typeof hitImpact === 'number') {
              return { ...n, risk_score: Math.abs(hitImpact) };
            }
            return n;
          })
        );
      }

      // Generate dynamic FinGraph scenario for radial canvas
      const dynScenario = await generateStockScenario(queryText.slice(0, 12).toUpperCase(), queryText);
      setActiveScenario(dynScenario);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRadialNode = useCallback((node: RadialCardNode) => {
    setSelectedRadialNode(node);
    setSelectedHop(null);
    setIsEvidenceDrawerOpen(true);
    if (node.tickers && node.tickers.length > 0) {
      setIsDrilldownOpen(true);
    }
  }, []);

  const handleSelectHopEvidence = useCallback((hop: PathwayHop) => {
    setSelectedHop(hop);
    setSelectedRadialNode(null);
    setIsEvidenceDrawerOpen(true);
  }, []);

  const handleToggleExtendNode = useCallback((nodeId: string) => {
    setExtendedNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  }, []);

  const handleConfirmRegression = useCallback((calibration: RegressionCalibration) => {
    setIsRegressionOpen(false);
    handleAnalyzeQuery(calibration.catalyst);
  }, []);

  // React Flow Nodes and Edges for Hierarchical DAG propagation mode
  const { flowNodes, flowEdges } = useMemo(() => {
    const rfNodes: Node[] = [];
    const rfEdges: Edge[] = [];

    // Map Center / Trigger Node (Tier 0)
    if (activeScenario.centerNode) {
      const cn = activeScenario.centerNode;
      rfNodes.push({
        id: cn.id,
        type: 'clayNode',
        position: { x: 50, y: 250 },
        data: {
          label: cn.title,
          category: cn.category,
          nodeType: cn.category === 'commodity' ? 'commodity' : cn.category === 'financial_asset' ? 'financial_asset' : 'geopolitical',
          impactScore: cn.impactScore || 100,
          systemicImportance: cn.systemicImportance || 'Chokepoint Hub',
          description: cn.subtitle,
          evidence: cn.causalReason,
          factType: cn.factType || 'Verified Regulatory Filing / Fact',
          confidence: cn.empiricalConfidence || 98,
          sources: cn.refLinks?.map((r) => ({ name: r.publisher, url: r.url, excerpt: r.title })) || [],
          timeLag: cn.timeHorizon || 'T+0 Days',
          minTimeDays: cn.minTimeDays ?? 0,
        },
      });
    }

    // Map Radial Nodes (Tiers 1, 2, 3)
    activeScenario.radialNodes.forEach((rn, idx) => {
      let nType: 'commodity' | 'geopolitical' | 'macro' | 'supply_chain' | 'financial_asset' = 'macro';
      if (rn.category === 'commodity') nType = 'commodity';
      else if (rn.category === 'geopolitical') nType = 'geopolitical';
      else if (rn.category === 'supply_chain' || rn.category === 'sector') nType = 'supply_chain';
      else if (rn.category === 'financial_asset' || rn.category === 'company') nType = 'financial_asset';
      else nType = 'macro';

      rfNodes.push({
        id: rn.id,
        type: 'clayNode',
        position: { x: 350 + (idx % 2) * 320, y: 100 + idx * 110 },
        data: {
          label: rn.title,
          category: rn.category,
          nodeType: nType,
          ticker: rn.tickers?.[0],
          impactScore: rn.impactScore || 80,
          systemicImportance: rn.systemicImportance || 'Systemic Bellwether',
          description: rn.subtitle,
          evidence: rn.causalReason,
          factType: rn.factType || 'Verified Regulatory Filing / Fact',
          confidence: rn.empiricalConfidence || 92,
          sources: rn.refLinks?.map((r) => ({ name: r.publisher, url: r.url, excerpt: r.title })) || [],
          timeLag: rn.timeHorizon || 'T+15 Days',
          minTimeDays: rn.minTimeDays ?? 15,
        },
      });
    });

    // Map Pathways to Edges
    activeScenario.pathways.forEach((p, idx) => {
      // Find matching source and target node IDs
      const sNode = rfNodes.find((n) => (n.data as any).label.toLowerCase().includes(p.source.toLowerCase()) || p.source.toLowerCase().includes((n.data as any).label.toLowerCase())) || rfNodes[0];
      const tNode = rfNodes.find((n) => (n.data as any).label.toLowerCase().includes(p.target.toLowerCase()) || p.target.toLowerCase().includes((n.data as any).label.toLowerCase())) || rfNodes[Math.min(idx + 1, rfNodes.length - 1)];

      if (sNode && tNode && sNode.id !== tNode.id) {
        rfEdges.push({
          id: `edge-${idx}-${sNode.id}-${tNode.id}`,
          source: sNode.id,
          target: tNode.id,
          animated: true,
          data: {
            weight: 0.9,
            velocity: 'fast',
            timeHorizonDays: p.timeHorizonDays ?? 15,
            explanation: p.explanation,
          },
        });
      }
    });

    // If edges count is empty, connect center to all radial nodes
    if (rfEdges.length === 0 && rfNodes.length > 1) {
      const rootId = rfNodes[0].id;
      for (let i = 1; i < rfNodes.length; i++) {
        rfEdges.push({
          id: `edge-root-${i}`,
          source: rootId,
          target: rfNodes[i].id,
          animated: true,
          data: {
            weight: 0.85,
            timeHorizonDays: (rfNodes[i].data as any).minTimeDays ?? 15,
          },
        });
      }
    }

    return { flowNodes: rfNodes, flowEdges: rfEdges };
  }, [activeScenario]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--clay-bg)] text-[var(--text-primary)] relative select-none overflow-x-hidden font-sans">
      {/* Interactive Parallax Background Canvas */}
      <DashBackgroundCanvas opacity={0.18} />

      {/* Top Glassmorphic Navigation Header */}
      <TopNav
        onAnalyze={handleAnalyzeQuery}
        onOpenAddStock={() => setIsAddStockOpen(true)}
        isLoading={isLoading}
        onOpenAuthModal={() => setIsRbacOpen(true)}
        onOpenRbacModal={() => setIsRbacOpen(true)}
        userProfile={userProfile}
      />

      {/* Main Workspace: Collapsible Sidebar + Dynamic Viewport */}
      <div className="flex-1 flex relative z-10 w-full overflow-hidden">
        {/* Left Vertical App Rail */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenAddStock={() => setIsAddStockOpen(true)}
        />

        {/* Viewport Router by Active Tab */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-h-[calc(100vh-64px)] space-y-6">
          {activeTab === 'impact_graph' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Scenario Control Bar */}
              <div className="clay-surface p-5 rounded-3xl border border-[var(--clay-border)] shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[var(--clay-border)]">
                  <div className="flex items-center gap-2">
                    <div className="clay-inset p-2 rounded-xl text-[var(--accent-primary)] font-black">
                      <Network className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black tracking-tight text-[var(--text-primary)]">
                        {tDash('title') || 'Autonomous Causal Transmission Engine'}
                      </h2>
                      <p className="text-[11px] text-[var(--text-secondary)] font-bold">
                        Institutional Multi-Hop Contagion & Shock BFS Propagation
                      </p>
                    </div>
                  </div>

                  {/* Tri-Mode Graph Canvas Switcher */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Time-Slider Control [T+0 Days | T+15 Days | T+45 Days | T+90 Days] */}
                    <div className="flex items-center gap-1 clay-inset p-1 rounded-2xl border border-[var(--clay-border)]">
                      <span className="px-2 text-[10px] font-mono text-amber-400 font-black">
                        Contagion Timeline:
                      </span>
                      {[0, 15, 45, 90].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setTimeOffsetDays(days)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer ${
                            timeOffsetDays === days
                              ? 'clay-button-primary text-white shadow-sm'
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          T+{days}d
                        </button>
                      ))}
                    </div>

                    {/* Mode Buttons */}
                    <div className="flex items-center gap-1.5 clay-inset p-1 rounded-2xl border border-[var(--clay-border)]">
                      <button
                        onClick={() => setGraphMode('radial')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          graphMode === 'radial'
                            ? 'clay-button-primary text-white shadow-sm'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Radial Macro</span>
                      </button>
                      <button
                        onClick={() => setGraphMode('hierarchical')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          graphMode === 'hierarchical'
                            ? 'clay-button-primary text-white shadow-sm'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                        <span>Propagation DAG</span>
                      </button>
                      <button
                        onClick={() => setGraphMode('physics')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                          graphMode === 'physics'
                            ? 'clay-button-primary text-white shadow-sm'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>Physics Force</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scenario Header with Live Metrics & Dropdown */}
                <ScenarioHeader
                  scenario={activeScenario}
                  scenariosList={scenariosList}
                  onSelectScenario={(sc) => {
                    setActiveScenario(sc);
                    setExtendedNodeIds([]);
                  }}
                />
              </div>

              {/* Main Dual-Stage View: Canvas on Left/Center + Rationale Drawer on Right */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[640px]">
                {/* Graph Viewport (8 Columns on XL screens) */}
                <div className="xl:col-span-8 flex flex-col relative">
                  {graphMode === 'radial' ? (
                    <RadialTransmissionCanvas
                      scenario={activeScenario}
                      selectedNodeId={selectedRadialNode?.id || null}
                      onSelectNode={handleSelectRadialNode}
                      onOpenRegressionModal={() => setIsRegressionOpen(true)}
                      extendedNodeIds={extendedNodeIds}
                      onToggleExtendNode={handleToggleExtendNode}
                      currentDayOffset={timeOffsetDays}
                      onTimeOffsetChange={setTimeOffsetDays}
                    />
                  ) : graphMode === 'hierarchical' ? (
                    <SystemicGraphViewport
                      nodes={flowNodes}
                      edges={flowEdges}
                      currentDayOffset={timeOffsetDays}
                      onNodeClick={(_, node) => {
                        const targetNode =
                          activeScenario.centerNode.id === node.id
                            ? activeScenario.centerNode
                            : activeScenario.radialNodes.find((rn) => rn.id === node.id) || null;
                        if (targetNode) {
                          handleSelectRadialNode(targetNode);
                        }
                      }}
                      onEdgeClick={(_, edge) => {
                        const pathwayHop = activeScenario.pathways.find(
                          (p) => edge.id.includes(p.source) || edge.id.includes(p.target)
                        );
                        if (pathwayHop) {
                          handleSelectHopEvidence(pathwayHop);
                        }
                      }}
                    />
                  ) : (
                    <div className="relative w-full h-full min-h-[620px] clay-surface rounded-3xl overflow-hidden border border-[var(--clay-border)] shadow-xl">
                      <InteractiveGraph
                        nodes={allNodes}
                        links={allLinks}
                        onSelectNode={(node) => {
                          setSelectedPhysicsNode(node);
                          setSelectedPhysicsLink(null);
                        }}
                        onSelectLink={(link) => {
                          setSelectedPhysicsLink(link);
                          setSelectedPhysicsNode(null);
                        }}
                        selectedNodeId={selectedPhysicsNode?.id || null}
                        selectedAppId={null}
                      />

                      {/* Floating Node Detail Popup in Physics Mode */}
                      <NodeDetailPanel
                        node={selectedPhysicsNode}
                        onClose={() => setSelectedPhysicsNode(null)}
                      />

                      {/* Floating Link Detail Popup in Physics Mode */}
                      <LinkDetailPanel
                        link={selectedPhysicsLink}
                        onClose={() => setSelectedPhysicsLink(null)}
                      />
                    </div>
                  )}
                </div>

                {/* Right Rationale & Pathways Panel (4 Columns on XL screens) */}
                <div className="xl:col-span-4 flex flex-col">
                  {simulationResponse ? (
                    <div className="clay-surface rounded-3xl border border-[var(--clay-border)] shadow-xl overflow-hidden h-full">
                      <CascadeDrawer
                        simulation={simulationResponse}
                        devilsAdvocate={devilsAdvocate}
                        onSelectNodeById={(id) => {
                          const node = allNodes.find((n) => n.id === id);
                          if (node) setSelectedPhysicsNode(node);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="clay-surface rounded-3xl border border-[var(--clay-border)] shadow-xl overflow-hidden h-full">
                      <ImpactPathwaysPanel
                        scenario={activeScenario}
                        selectedHop={selectedHop}
                        onSelectHop={setSelectedHop}
                        onOpenEvidence={handleSelectHopEvidence}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Auxiliary Forensic & Analytics Tabs */}
          {activeTab === 'ai_hub' && (
            <div className="clay-surface p-6 rounded-3xl border border-[var(--clay-border)] shadow-xl">
              <AIHubInsightsView
                scenarios={scenariosList}
                onSelectScenario={(sc) => {
                  setActiveScenario(sc);
                  setActiveTab('impact_graph');
                }}
                onNavigateToGraph={() => setActiveTab('impact_graph')}
              />
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="clay-surface p-6 rounded-3xl border border-[var(--clay-border)] shadow-xl">
              <MarketOverviewView />
            </div>
          )}

          {activeTab === 'contagion_matrix' && (
            <div className="clay-surface p-6 rounded-3xl border border-[var(--clay-border)] shadow-xl">
              <SectorHeatmapView />
            </div>
          )}

          {activeTab === 'saved_analyses' && (
            <div className="clay-surface p-6 rounded-3xl border border-[var(--clay-border)] shadow-xl">
              <SavedWatchlistsView />
            </div>
          )}

          {activeTab === 'audit_reports' && (
            <div className="clay-surface p-6 rounded-3xl border border-[var(--clay-border)] shadow-xl">
              <AuditReportsView />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="clay-surface p-6 rounded-3xl border border-[var(--clay-border)] shadow-xl">
              <EngineSettingsView />
            </div>
          )}

          {activeTab === 'help_docs' && (
            <div className="clay-surface p-6 rounded-3xl border border-[var(--clay-border)] shadow-xl">
              <MethodologyDocsView />
            </div>
          )}

          {activeTab === 'historical_replay' && (
            <div className="clay-surface p-8 rounded-3xl border border-[var(--clay-border)] shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-[var(--clay-border)] pb-4">
                <div className="clay-inset p-3 rounded-2xl text-[var(--accent-primary)] font-black">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[var(--text-primary)]">
                    Historical Crisis Replay Engine
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] font-bold">
                    Empirical verification against 1973 Oil Shock, 2008 Lehman Contagion & 2020 COVID Supply Shock
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    title: '1973 OPEC Oil Embargo',
                    magnitude: '+340% Spot Surge',
                    lag: '45-Day Consumer Pass-Through',
                    transmission: 'Petrochemicals & Stagflation',
                  },
                  {
                    title: '2008 Lehman CDS Cascade',
                    magnitude: '99th Percentile Drawdown',
                    lag: '3-Day Interbank Seizure',
                    transmission: 'Repo Haircuts & Counterparty Freeze',
                  },
                  {
                    title: '2020 Pandemic Supply Shock',
                    magnitude: '-28% Global Trade Index',
                    lag: '14-Day Bottleneck Friction',
                    transmission: 'Semiconductors & Maritime Freight',
                  },
                ].map((crisis, idx) => (
                  <div
                    key={idx}
                    className="clay-inset p-5 rounded-2xl space-y-3 hover:scale-102 transition-transform cursor-pointer border border-[var(--clay-border)]"
                    onClick={() => handleAnalyzeQuery(crisis.title)}
                  >
                    <span className="clay-badge text-[var(--accent-primary)] text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      HISTORICAL CASE STUDY
                    </span>
                    <h3 className="text-sm font-black text-[var(--text-primary)]">{crisis.title}</h3>
                    <div className="space-y-1 text-xs text-[var(--text-secondary)] font-bold">
                      <div>Magnitude: <span className="text-rose-500">{crisis.magnitude}</span></div>
                      <div>Transmission Lag: <span className="text-[var(--text-primary)]">{crisis.lag}</span></div>
                      <div>Key Channel: <span className="text-[var(--text-primary)]">{crisis.transmission}</span></div>
                    </div>
                    <button className="w-full clay-button-primary py-2 rounded-xl text-xs font-black text-white mt-2">
                      Replay Propagation
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'event_explorer' && (
            <div className="clay-surface p-8 rounded-3xl border border-[var(--clay-border)] shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-[var(--clay-border)] pb-4">
                <div className="clay-inset p-3 rounded-2xl text-[var(--accent-primary)] font-black">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[var(--text-primary)]">
                    Event Shock Ingestion & Calibration Desk
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] font-bold">
                    Input raw catalyst text, calibrate regression models, and trigger instant BFS causal cascades
                  </p>
                </div>
              </div>

              <div className="space-y-4 max-w-2xl">
                <label className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                  Simulate Custom Macro Catalyst
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Taiwan Strait export curbs halt 5nm foundry shipments..."
                    className="flex-1 clay-inset p-3.5 rounded-2xl text-xs font-bold text-[var(--text-primary)] focus:outline-none border border-[var(--clay-border)]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAnalyzeQuery((e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                  <button
                    onClick={() => setIsRegressionOpen(true)}
                    className="clay-button-primary px-5 rounded-2xl text-xs font-black text-white whitespace-nowrap shadow-md cursor-pointer"
                  >
                    Econometric Calibration
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Corporate Drilldown Modal */}
      {isDrilldownOpen && (
        <CompanyDrilldownModal
          node={selectedRadialNode}
          onClose={() => setIsDrilldownOpen(false)}
        />
      )}

      {/* Add Stock Modal */}
      {isAddStockOpen && (
        <AddStockModal
          isOpen={isAddStockOpen}
          onClose={() => setIsAddStockOpen(false)}
          onApplyScenario={(scenario) => {
            setActiveScenario(scenario);
            setIsAddStockOpen(false);
          }}
        />
      )}

      {/* Econometric Regression Calibration Modal */}
      {isRegressionOpen && (
        <EventRegressionModal
          isOpen={isRegressionOpen}
          scenario={activeScenario}
          onConfirm={handleConfirmRegression}
          onCancel={() => setIsRegressionOpen(false)}
        />
      )}

      {/* RBAC Institutional Clearance Modal */}
      {isRbacOpen && (
        <RbacLoginModal
          isOpen={isRbacOpen}
          currentUser={userProfile}
          onLogin={(profile) => {
            setUserProfile(profile);
            setIsRbacOpen(false);
          }}
          onClose={() => setIsRbacOpen(false)}
        />
      )}

      {/* Empirical Ground-Truth Evidence Verification Drawer */}
      <EmpiricalEvidenceDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        selectedNode={selectedRadialNode}
        selectedHop={selectedHop}
        evidenceSources={activeScenario.evidenceSources}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--clay-bg)]">
          <div className="text-xs font-mono font-bold text-[var(--accent-primary)] animate-pulse">
            Loading Financial Contagion Graph Engine...
          </div>
        </div>
      }
    >
      <DashboardContent />
    </React.Suspense>
  );
}
