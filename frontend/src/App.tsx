import React, { useState, useEffect } from "react";
import { Sidebar, NavTab } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { ScenarioHeader } from "./components/ScenarioHeader";
import { RadialTransmissionCanvas } from "./components/RadialTransmissionCanvas";
import { ImpactPathwaysPanel } from "./components/ImpactPathwaysPanel";
import { CompanyDrilldownModal } from "./components/CompanyDrilldownModal";
import { AddStockModal } from "./components/AddStockModal";
import { AIHubInsightsView } from "./components/AIHubInsightsView";
import { SectorHeatmapView } from "./components/SectorHeatmapView";
import { EngineSettingsView } from "./components/EngineSettingsView";
import { SavedWatchlistsView } from "./components/SavedWatchlistsView";
import { AuditReportsView } from "./components/AuditReportsView";
import { MethodologyDocsView } from "./components/MethodologyDocsView";
import { MarketOverviewView } from "./components/MarketOverviewView";
import { EventExplorerView } from "./components/EventExplorerView";
import { LandingPage } from "./components/LandingPage";
import { GlobalNewsRelationMap } from "./components/GlobalNewsRelationMap";
import AuthSectionOne from "@/components/ui/auth-section-1";
import { RbacLoginModal, PRESET_ROLES } from "./components/RbacLoginModal";
import { EventRegressionModal } from "./components/EventRegressionModal";
import { AivanaVoiceAssistant } from "./components/AivanaVoiceAssistant";
import { FINGRAPH_SCENARIOS } from "./data/fingraphData";
import { FinGraphScenario, RadialCardNode, PathwayHop, UserProfile, RegressionCalibration } from "./types";
import { generateStockScenario } from "./api";

const VALID_NAV_TABS: NavTab[] = [
  "landing",
  "event_explorer",
  "impact_graph",
  "ai_hub",
  "asset_profiler",
  "overview",
  "historical_replay",
  "contagion_matrix",
  "geo_map",
  "audit_reports",
  "saved_analyses",
  "settings",
  "help_docs",
];

const getInitialNavTab = (): NavTab => {
  if (typeof window === "undefined") return "landing";

  // 1. Check URL hash (e.g. #event_explorer or #/event_explorer)
  const hash = window.location.hash.replace(/^#[/]?/, "").trim() as NavTab;
  if (hash && VALID_NAV_TABS.includes(hash)) {
    return hash;
  }

  // 2. Check localStorage for last active tab
  try {
    const saved = localStorage.getItem("find_active_nav_tab") as NavTab | null;
    if (saved && VALID_NAV_TABS.includes(saved) && saved !== "landing") {
      return saved;
    }
  } catch (e) {
    console.warn("Could not read nav tab from localStorage", e);
  }

  return "landing";
};

const getInitialSynthesized = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const saved = localStorage.getItem("find_has_synthesized");
    if (saved !== null) return saved === "true";
    const hash = window.location.hash.replace(/^#[/]?/, "").trim();
    if (hash === "impact_graph") return true;
  } catch {}
  return false;
};

const getInitialScenario = (allScenarios: FinGraphScenario[]): FinGraphScenario => {
  if (typeof window === "undefined") return allScenarios[0];
  try {
    const savedId = localStorage.getItem("find_active_scenario_id");
    if (savedId) {
      const found = allScenarios.find((s) => s.id === savedId);
      if (found) return found;
    }
  } catch {}
  return allScenarios[0];
};

const getInitialUser = (): UserProfile => {
  if (typeof window === "undefined") return PRESET_ROLES[0];
  try {
    const saved = localStorage.getItem("find_current_user");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  return PRESET_ROLES[0];
};

export const App: React.FC = () => {
  const [activeNavTab, setActiveNavTab] = useState<NavTab>(getInitialNavTab);
  const [isAuthScreenOpen, setIsAuthScreenOpen] = useState<boolean>(false);
  const [scenarios, setScenarios] = useState<FinGraphScenario[]>(FINGRAPH_SCENARIOS);
  const [activeScenario, setActiveScenario] = useState<FinGraphScenario>(() => getInitialScenario(FINGRAPH_SCENARIOS));
  const [selectedNode, setSelectedNode] = useState<RadialCardNode | null>(null);
  const [selectedHop, setSelectedHop] = useState<PathwayHop | null>(null);
  const [isDrilldownOpen, setIsDrilldownOpen] = useState<boolean>(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // RBAS User Authentication & Regression Modals
  const [currentUser, setCurrentUser] = useState<UserProfile>(getInitialUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isRbacModalOpen, setIsRbacModalOpen] = useState<boolean>(false);
  const [isRegressionModalOpen, setIsRegressionModalOpen] = useState<boolean>(false);
  const [extendedNodeIds, setExtendedNodeIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);
  const [historicalEra, setHistoricalEra] = useState<"All" | "1970s" | "2000s" | "2020s">("All");
  const [hasUserSynthesized, setHasUserSynthesized] = useState<boolean>(getInitialSynthesized);

  // Persist activeNavTab & keep URL hash in sync for persistent page refreshes
  useEffect(() => {
    try {
      localStorage.setItem("find_active_nav_tab", activeNavTab);
      if (activeNavTab !== "landing") {
        if (window.location.hash !== `#${activeNavTab}`) {
          window.history.replaceState(null, "", `#${activeNavTab}`);
        }
      } else {
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      }
    } catch (e) {
      console.warn("Could not sync nav tab to localStorage", e);
    }
  }, [activeNavTab]);

  // Support browser Back/Forward navigation with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#[/]?/, "").trim() as NavTab;
      if (hash && VALID_NAV_TABS.includes(hash)) {
        setActiveNavTab(hash);
      } else if (!window.location.hash) {
        setActiveNavTab("landing");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Persist activeScenario
  useEffect(() => {
    try {
      if (activeScenario?.id) {
        localStorage.setItem("find_active_scenario_id", activeScenario.id);
      }
    } catch {}
  }, [activeScenario]);

  // Persist hasUserSynthesized
  useEffect(() => {
    try {
      localStorage.setItem("find_has_synthesized", String(hasUserSynthesized));
    } catch {}
  }, [hasUserSynthesized]);

  // Persist currentUser
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("find_current_user", JSON.stringify(currentUser));
      }
    } catch {}
  }, [currentUser]);

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleToggleExtendNode = (nodeId: string) => {
    setExtendedNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  // Handle Event Analysis from Search Bar
  const handleAnalyzeEvent = async (query: string) => {
    setIsAnalyzing(true);
    const lower = query.toLowerCase();

    // 0. Check if query matches the headline US PERM Visa Suspension / Tech Hiring catalyst
    if (
      lower.includes("visa") ||
      lower.includes("perm") ||
      lower.includes("microsoft") ||
      lower.includes("offshore") ||
      lower.includes("hiring") ||
      lower.includes("h-1b") ||
      lower.includes("h1b")
    ) {
      await new Promise((r) => setTimeout(r, 2800));
      const visaScenario =
        scenarios.find((s) => s.id === "us-perm-visa-suspension") || scenarios[0];
      setActiveScenario(visaScenario);
      setSelectedNode(null);
      setSelectedHop(null);
      setHasUserSynthesized(true);
      setActiveNavTab("impact_graph");
      showToast("✅ Synthesized impact graph: US PERM Visa Freeze × Indian IT Rally");
      setIsAnalyzing(false);
      return;
    }

    // 1. Check if query matches a known company or ticker
    const isTickerOrCompany = 
      lower.includes("tata") || lower.includes("reliance") || lower.includes("hdfc") || 
      lower.includes("asian") || lower.includes("paint") || lower.includes("maruti") ||
      lower.includes("tcs") || lower.includes("infy") || lower.includes(".ns") ||
      lower.includes("icici") || lower.includes("airtel") || lower.includes("nvda") ||
      lower.includes("apple") || lower.includes("stock");

    if (isTickerOrCompany) {
      try {
        const stockTicker = lower.includes("tata") ? "TATAMOTORS.NS" :
                            lower.includes("reliance") ? "RELIANCE.NS" :
                            lower.includes("hdfc") ? "HDFCBANK.NS" :
                            lower.includes("paint") || lower.includes("asian") ? "ASIANPAINT.NS" :
                            lower.includes("tcs") ? "TCS.NS" :
                            lower.includes("maruti") ? "MARUTI.NS" :
                            lower.includes("infy") ? "INFY.NS" :
                            query.trim().toUpperCase();

        const generated = await generateStockScenario(stockTicker, query);
        setScenarios((prev) => [generated, ...prev]);
        setActiveScenario(generated);
        setSelectedNode(null);
        setSelectedHop(null);
        setHasUserSynthesized(true);
        setActiveNavTab("impact_graph");
        showToast(`✅ Impact graph synthesized for ${stockTicker}`);
        setIsAnalyzing(false);
        return;
      } catch (err) {
        console.warn("Backend stock scenario fallback to preloaded:", err);
      }
    }

    // Check if query matches any known preloaded scenario keywords
    setTimeout(() => {
      let matched = scenarios.find(
        (s) =>
          s.title.toLowerCase().includes(lower) ||
          s.narrative.toLowerCase().includes(lower) ||
          s.dropdownLabel.toLowerCase().includes(lower)
      );

      if (!matched) {
        if (lower.includes("oil") || lower.includes("crude") || lower.includes("brent") || lower.includes("opec")) {
          matched = scenarios.find((s) => s.id === "oil-supply-shock") || scenarios[0];
        } else if (lower.includes("tsmc") || lower.includes("chip") || lower.includes("semiconductor")) {
          matched = scenarios.find((s) => s.id === "tsmc-chip-disruption") || scenarios[0];
        } else if (lower.includes("rbi") || lower.includes("rate") || lower.includes("repo")) {
          matched = scenarios.find((s) => s.id === "rbi-rate-easing") || scenarios[0];
        } else {
          // Dynamic scenario generated based on input
          matched = {
            id: `custom-${Date.now()}`,
            title: query.length > 30 ? query.slice(0, 30) + "..." : query,
            dropdownLabel: query,
            narrative: `Autonomous event propagation model synthesized for: "${query}". Input shocks traced through supply chains, inflation indices, and market valuations.`,
            date: "Live Analysis",
            source: "Fin.D AI Ingestion",
            entitiesCount: 14,
            pathwaysCount: 6,
            evidenceCount: 3,
            transmissionRisk: "Moderate to high transmission",
            transmissionRiskDetail: "Cross-sector transmission observed across primary input commodities and consumer demand.",
            evidenceStrength: "Moderate",
            evidenceStrengthDetail: "Synthesized via multimodal knowledge graph and real-time news telemetry.",
            centerNode: {
              id: "custom-trigger",
              title: query.split(" ")[0].toUpperCase() || "CATALYST",
              metric: "SHOCK",
              metricColor: "red",
              subtitle: "Primary Market Catalyst",
              badge: "Event • Custom Ingestion",
              badgeType: "red",
              category: "commodity",
              icon: "chart",
              position: "center",
            },
            radialNodes: [
              {
                id: "macro-sentiment",
                title: "Macro Sentiment",
                metric: "↓",
                metricColor: "green",
                subtitle: "Risk-off equity repricing",
                badge: "Negative",
                badgeType: "green",
                category: "economic_variable",
                icon: "chart",
                position: "top",
                timeHorizon: "1–2 weeks",
                lineType: "negative",
              },
              {
                id: "input-costs",
                title: "Input Costs",
                metric: "↑",
                metricColor: "red",
                subtitle: "Supply chain bottleneck stress",
                badge: "Increases",
                badgeType: "red",
                category: "sector",
                icon: "factory",
                position: "left",
                timeHorizon: "1–3 months",
                lineType: "positive",
              },
              {
                id: "currency-fx",
                title: "Currency (USD/INR)",
                metric: "↑",
                metricColor: "red",
                subtitle: "Capital flow volatility",
                badge: "Increases",
                badgeType: "red",
                category: "economic_variable",
                icon: "currency",
                position: "right",
                timeHorizon: "Short term",
                lineType: "positive",
              },
              {
                id: "consumer-demand",
                title: "Consumer Equities",
                metric: "↓",
                metricColor: "green",
                subtitle: "Margin compression",
                badge: "Negative",
                badgeType: "green",
                category: "sector",
                icon: "plane",
                position: "bottom-left",
                timeHorizon: "2–4 months",
                lineType: "negative",
                tickers: ["TATAMOTORS.NS", "ASIANPAINT.NS"],
              },
              {
                id: "defensive-sectors",
                title: "Defensive Assets",
                metric: "↑",
                metricColor: "blue",
                subtitle: "Safe haven rotation",
                badge: "Positive",
                badgeType: "blue",
                category: "sector",
                icon: "bank",
                position: "bottom-right",
                timeHorizon: "1–3 months",
                lineType: "positive",
                tickers: ["HDFCBANK.NS", "TCS.NS"],
              },
            ],
            pathways: [
              {
                hopNumber: 1,
                source: query.split(" ")[0].toUpperCase() || "Catalyst",
                target: "Input Costs",
                impactType: "Increases",
                impactLabel: "↑ Increases",
                timeframe: "1–3 months",
                explanation: `Direct transmission of ${query} into upstream producer price indices and input costs.`,
                sector: "Supply Chain",
                evidenceGrade: "Moderate evidence",
                badgeGradeType: "yellow",
              },
              {
                hopNumber: 2,
                source: "Input Costs",
                target: "Consumer Equities",
                impactType: "Decreases",
                impactLabel: "↓ Decreases",
                timeframe: "2–4 months",
                explanation: "Compressed gross margins pressure quarterly EBITDA expectations.",
                sector: "Corporate Earnings",
                evidenceGrade: "Well established",
                badgeGradeType: "green",
              },
              {
                hopNumber: 3,
                source: query.split(" ")[0].toUpperCase() || "Catalyst",
                target: "Macro Sentiment",
                impactType: "Decreases",
                impactLabel: "↓ Decreases",
                timeframe: "Immediate",
                explanation: "Headwinds trigger automated portfolio hedging and risk-off rotation.",
                sector: "Market Structure",
                evidenceGrade: "Well established",
                badgeGradeType: "green",
              },
            ],
            evidenceSources: [
              {
                id: "cust-ev-1",
                title: `Real-time Market Telemetry for ${query}`,
                source: "Global Financial Feeds",
                date: "Today",
                summary: "Automated event extraction matching transmission channels across historical precedents.",
                relevanceScore: 92,
                category: "Live Telemetry",
              },
            ],
          };
        }
      }

      setActiveScenario(matched);
      setSelectedNode(null);
      setSelectedHop(null);
      setHasUserSynthesized(true);
      setIsAnalyzing(false);
      showToast('✅ Event analysis complete — propagation paths traced');
    }, 1500);
  };

  // Node Click: sets selected node to dynamically branch out its relations on canvas
  const handleSelectNode = (node: RadialCardNode | null) => {
    setSelectedNode(node);
  };

  // If auth screen is open, display the exact AuthSectionOne login/signup screen with quick demo
  if (isAuthScreenOpen) {
    return (
      <AuthSectionOne
        onLogin={(email, name) => {
          if (name || email) {
            setCurrentUser((prev) => ({
              ...prev,
              name: name || prev.name,
              email: email || prev.email,
            }));
          }
          setIsAuthScreenOpen(false);
          setActiveNavTab("event_explorer");
          showToast(`✅ Welcome, ${name || "Analyst"} — Connected to FinGraph Engine`);
        }}
        onClose={() => setIsAuthScreenOpen(false)}
      />
    );
  }

  // If landing tab, render the landing page full-screen without dashboard sidebar/topnav
  if (activeNavTab === "landing") {
    return (
      <div className="flex h-screen w-screen overflow-y-auto apple-mesh-bg text-slate-900 font-sans antialiased">
        <LandingPage 
          onEnter={() => setIsAuthScreenOpen(true)} 
          onSelectScenario={(scenarioId) => {
            const target = scenarios.find((s) => s.id === scenarioId) || scenarios[0];
            setActiveScenario(target);
            setHasUserSynthesized(true);
            showToast(`✅ Loaded scenario: ${target.title}`);
            setActiveNavTab("impact_graph");
          }}
        />
      </div>
    );
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem("find_active_nav_tab");
      localStorage.removeItem("find_has_synthesized");
      localStorage.removeItem("find_active_scenario_id");
      localStorage.removeItem("find_current_user");
    } catch (e) {
      console.warn("Could not clear session storage", e);
    }
    setActiveNavTab("landing");
    setHasUserSynthesized(false);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    showToast("Logged out to portal", "info");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden apple-mesh-bg text-slate-900 font-sans antialiased">
      {/* 1. Left Navigation Rail Sidebar */}
      <Sidebar 
        activeTab={activeNavTab} 
        onTabChange={setActiveNavTab}
        onLogout={handleLogout}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Search Bar */}
        <TopNav 
          onAnalyze={handleAnalyzeEvent} 
          onOpenAddStock={() => setIsAddStockOpen(true)}
          isLoading={isAnalyzing}
          userProfile={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenRbacModal={() => setIsRbacModalOpen(true)}
        />

        {/* Content Body Area */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Main Stage View */}
          <main className={`flex-1 flex flex-col ${activeNavTab === "impact_graph" ? "h-full min-h-0 overflow-hidden p-3 sm:p-4 gap-2.5" : "overflow-y-auto p-6 gap-5"}`}>

            {activeNavTab === "impact_graph" && (
              <>
                {!hasUserSynthesized ? (
                  /* ── Empty State: no event selected yet ── */
                  <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center px-6">
                    <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-2">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 3"/>
                        <circle cx="20" cy="20" r="5" fill="#94A3B8"/>
                        <circle cx="8" cy="14" r="3" fill="#CBD5E1"/>
                        <circle cx="32" cy="14" r="3" fill="#CBD5E1"/>
                        <circle cx="12" cy="30" r="3" fill="#CBD5E1"/>
                        <circle cx="28" cy="30" r="3" fill="#CBD5E1"/>
                        <line x1="20" y1="20" x2="8" y2="14" stroke="#E2E8F0" strokeWidth="1.5"/>
                        <line x1="20" y1="20" x2="32" y2="14" stroke="#E2E8F0" strokeWidth="1.5"/>
                        <line x1="20" y1="20" x2="12" y2="30" stroke="#E2E8F0" strokeWidth="1.5"/>
                        <line x1="20" y1="20" x2="28" y2="30" stroke="#E2E8F0" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <div className="flex flex-col gap-2 max-w-sm">
                      <h2 className="text-xl font-bold text-slate-800">No Event Selected</h2>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Select a financial news event from the <strong>Event Explorer</strong> and click
                        {" "}<strong>Synthesize Collision Graph</strong> to build the impact propagation graph.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveNavTab("event_explorer")}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
                    >
                      <span>Go to Event Explorer</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <p className="text-xs text-slate-400 font-mono">
                      BFS propagation engine ready · {">"}25 nodes · 30+ edges pre-wired
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Header with Title, Switcher, and 3 KPI Cards */}
                    <ScenarioHeader
                      scenario={activeScenario}
                      scenariosList={scenarios}
                      onSelectScenario={(sc) => {
                        setActiveScenario(sc);
                        setSelectedNode(null);
                        setSelectedHop(null);
                      }}
                    />

                    {/* The Radial Transmission Canvas */}
                    <RadialTransmissionCanvas
                      scenario={activeScenario}
                      selectedNodeId={selectedNode?.id || null}
                      onSelectNode={handleSelectNode}
                      onOpenRegressionModal={() => setIsRegressionModalOpen(true)}
                      onOpenStockDrilldown={(node) => {
                        setSelectedNode(node);
                        setIsDrilldownOpen(true);
                      }}
                      extendedNodeIds={extendedNodeIds}
                      onToggleExtendNode={handleToggleExtendNode}
                    />
                  </>
                )}
              </>
            )}

            {/* Historical Replay Tab: Displays Historical Precedents (1973, 2008, 2020, 2023) */}
            {activeNavTab === "historical_replay" && (
              <div className="flex flex-col gap-6 py-2">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Historical Crisis Replay & Transmission Memory
                  </h2>
                  <p className="text-sm text-slate-600">
                    Empirical validation from historical market shocks, drawdown depths, and recovery timeframes.
                  </p>
                </div>

                {/* Time Period Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter by era:</span>
                  {(['All', '1970s', '2000s', '2020s'] as const).map((era) => (
                    <button
                      key={era}
                      onClick={() => setHistoricalEra(era)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        historicalEra === era
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {era}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Crisis 1: 1973 OPEC Embargo */}
                  {(historicalEra === 'All' || historicalEra === '1970s') && (
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                        Commodity Shock • 1973
                      </span>
                      <span className="text-xs font-mono text-slate-400">Peak VIX Equiv: 84.2</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      1973 OPEC Oil Embargo
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Crude oil prices quadrupled in 6 months. S&P 500 fell 48%, inflation touched 12.3%, and airline industry operating margins declined by 42%. Stagflation persisted for 24 months.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Transmission Lag: <strong>1–4 months</strong></span>
                      <button
                        onClick={() => {
                          setActiveScenario(scenarios[0]);
                          setActiveNavTab("impact_graph");
                        }}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Load Graph Replay →
                      </button>
                    </div>
                  </div>
                  )}

                  {/* Crisis 2: 2008 Global Financial Crisis */}
                  {(historicalEra === 'All' || historicalEra === '2000s') && (
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                        Banking Failure • 2008
                      </span>
                      <span className="text-xs font-mono text-slate-400">Peak VIX: 89.5</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      2008 Lehman Brothers Contagion
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Interbank credit freeze transmitted to commercial paper markets within 72 hours. Corporate capex stalled globally, causing double-digit contractions in industrial machinery and automotive sales.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Transmission Lag: <strong>Immediate</strong></span>
                      <button
                        onClick={() => {
                          setActiveScenario(scenarios[2] || scenarios[0]);
                          setActiveNavTab("impact_graph");
                        }}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Load Graph Replay →
                      </button>
                    </div>
                  </div>
                  )}

                  {/* Crisis 3: 2020 COVID Supply Chain Freeze */}
                  {(historicalEra === 'All' || historicalEra === '2020s') && (
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                        Supply Chain Shock • 2020
                      </span>
                      <span className="text-xs font-mono text-slate-400">Peak VIX: 82.7</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      2020 Global Logistics Shutdown
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Container freight rates spiked 500% as ports closed. Semiconductor wafer shortages cascaded to global auto manufacturers, stalling vehicle production lines for over 18 months.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Transmission Lag: <strong>3–6 months</strong></span>
                      <button
                        onClick={() => {
                          setActiveScenario(scenarios[1]);
                          setActiveNavTab("impact_graph");
                        }}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Load Hardware Shock →
                      </button>
                    </div>
                  </div>
                  )}

                  {/* Crisis 4: 2023 SVB Run */}
                  {(historicalEra === 'All' || historicalEra === '2020s') && (
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                        Liquidity Run • 2023
                      </span>
                      <span className="text-xs font-mono text-slate-400">Peak VIX: 26.5</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      2023 Silicon Valley Bank Run
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Unrealized HTM securities losses triggered $42B withdrawal in 24 hours. Contagion rapidly spread to Signature Bank and First Republic until emergency Fed BTFP facilities opened.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Transmission Lag: <strong>24–48 hours</strong></span>
                      <button
                        onClick={() => {
                          setActiveScenario(scenarios[3] || scenarios[0]);
                          setActiveNavTab("impact_graph");
                        }}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        Load Graph Replay →
                      </button>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Hub (AI Insights) Tab */}
            {activeNavTab === "ai_hub" && (
              <AIHubInsightsView
                scenarios={scenarios}
                activeScenario={activeScenario}
                hasUserSynthesized={hasUserSynthesized}
                onSelectScenario={(sc) => {
                  setActiveScenario(sc);
                  setSelectedNode(null);
                  setSelectedHop(null);
                }}
                onNavigateToGraph={() => {
                  setActiveNavTab("impact_graph");
                }}
              />
            )}

            {/* Event Explorer Tab */}
            {activeNavTab === "event_explorer" && (
              <EventExplorerView
                scenarios={scenarios}
                onSelectScenario={(sc) => {
                  setActiveScenario(sc);
                  setSelectedNode(null);
                  setSelectedHop(null);
                }}
                onNavigateToGraph={() => {
                  setHasUserSynthesized(true);
                  showToast("✅ Graph synthesized — tracing impact propagation paths");
                  setActiveNavTab("impact_graph");
                }}
              />
            )}

            {/* Contagion Matrix / Sector Heatmap Tab */}
            {activeNavTab === "contagion_matrix" && (
              <SectorHeatmapView
                onSimulateSectorShock={(sectorName) => {
                  handleAnalyzeEvent(`${sectorName} supply shock`);
                  setActiveNavTab("impact_graph");
                }}
                onNavigateToGraph={() => {
                  setActiveNavTab("impact_graph");
                }}
              />
            )}

            {/* Geo News Relation Map — Mappls powered */}
            {activeNavTab === "geo_map" && (
              <div className="w-full h-full min-h-[600px]">
                <GlobalNewsRelationMap />
              </div>
            )}

            {/* AI Engine Settings Tab */}
            {activeNavTab === "settings" && (
              <EngineSettingsView />
            )}

            {/* Audit Reports & System Logs Tab */}
            {activeNavTab === "audit_reports" && (
              <AuditReportsView />
            )}

            {/* Saved Watchlists Tab */}
            {activeNavTab === "saved_analyses" && (
              <SavedWatchlistsView
                onLoadScenario={(scenarioId) => {
                  const targetScenario = scenarios.find((s) => s.id === scenarioId) || 
                    (scenarioId === "oil-supply-shock" ? scenarios[0] :
                     scenarioId === "tsmc-supply-chain" ? scenarios[1] :
                     scenarioId === "rbi-rate-decision" ? scenarios[2] : scenarios[0]);
                  if (targetScenario) {
                    setActiveScenario(targetScenario);
                  }
                  setSelectedNode(null);
                  setSelectedHop(null);
                  setActiveNavTab("impact_graph");
                }}
              />
            )}

            {/* Methodology & Documentation Tab */}
            {activeNavTab === "help_docs" && (
              <MethodologyDocsView />
            )}

            {/* Market Overview Tab */}
            {activeNavTab === "overview" && (
              <MarketOverviewView />
            )}
          </main>

          {/* 3. Right Impact Pathways Panel — only when graph is synthesized */}
          {activeNavTab === "impact_graph" && hasUserSynthesized && (
            <ImpactPathwaysPanel
              scenario={activeScenario}
              selectedHop={selectedHop}
              onSelectHop={(hop) => {
                setSelectedHop(hop);
                const targetNode = activeScenario.radialNodes.find((n) => n.title === hop.target);
                if (targetNode) {
                  setSelectedNode(targetNode);
                }
              }}
              onOpenStockDrilldown={(node) => {
                setSelectedNode(node);
                setIsDrilldownOpen(true);
              }}
            />
          )}
        </div>
      </div>

      {/* 4. Company Breakdown Modal (for Indian equities drilldown) */}
      {isDrilldownOpen && (
        <CompanyDrilldownModal
          node={selectedNode}
          onClose={() => setIsDrilldownOpen(false)}
        />
      )}

      {/* 5. Add Stock & Transmission Profiler Modal */}
      <AddStockModal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        onApplyScenario={(newSc) => {
          setScenarios((prev) => [newSc, ...prev]);
          setActiveScenario(newSc);
          setSelectedNode(null);
          setSelectedHop(null);
          setActiveNavTab("impact_graph");
        }}
      />

      {/* 6. Econometric Regression & Causal Hypothesis Gate */}
      <EventRegressionModal
        isOpen={isRegressionModalOpen}
        scenario={activeScenario}
        onConfirm={(calibration) => {
          setIsRegressionModalOpen(false);
          setActiveNavTab("impact_graph");
        }}
        onCancel={() => setIsRegressionModalOpen(false)}
      />

      {/* 7. Institutional Role-Based Access Control Modal (RBAS) */}
      <RbacLoginModal
        isOpen={isRbacModalOpen}
        currentUser={currentUser}
        onLogin={(profile) => {
          setCurrentUser(profile);
          setIsRbacModalOpen(false);
        }}
        onClose={() => setIsRbacModalOpen(false)}
      />

      {/* 8. Full-Fidelity Auth Login Section Screen */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm">
          <AuthSectionOne
            onLogin={(email, name) => {
              setCurrentUser((prev) => ({
                ...prev,
                name: name || prev.name,
                email: email || prev.email,
              }));
              setIsAuthModalOpen(false);
            }}
            onClose={() => setIsAuthModalOpen(false)}
          />
        </div>
      )}

      {/* In-App Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-24 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="opacity-60 hover:opacity-100 ml-1 text-base leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* 9. Flora Voice & Multimodal AI Assistant (Corner Orb & Voice Modal) */}
      <AivanaVoiceAssistant />
    </div>
  );
};
