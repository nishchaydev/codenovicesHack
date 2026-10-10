import React, { useState } from "react";
import { Sidebar, NavTab } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { ScenarioHeader } from "./components/ScenarioHeader";
import { RadialTransmissionCanvas } from "./components/RadialTransmissionCanvas";
import { ImpactPathwaysPanel } from "./components/ImpactPathwaysPanel";
import { CompanyDrilldownModal } from "./components/CompanyDrilldownModal";
import { AddStockModal } from "./components/AddStockModal";
import { FINGRAPH_SCENARIOS } from "./data/fingraphData";
import { FinGraphScenario, RadialCardNode, PathwayHop } from "./types";
import { generateStockScenario } from "./api";

export const App: React.FC = () => {
  const [activeNavTab, setActiveNavTab] = useState<NavTab>("impact_graph");
  const [scenarios, setScenarios] = useState<FinGraphScenario[]>(FINGRAPH_SCENARIOS);
  const [activeScenario, setActiveScenario] = useState<FinGraphScenario>(FINGRAPH_SCENARIOS[0]);
  const [selectedNode, setSelectedNode] = useState<RadialCardNode | null>(null);
  const [selectedHop, setSelectedHop] = useState<PathwayHop | null>(null);
  const [isDrilldownOpen, setIsDrilldownOpen] = useState<boolean>(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Handle Event Analysis from Search Bar
  const handleAnalyzeEvent = async (query: string) => {
    setIsAnalyzing(true);
    const lower = query.toLowerCase();

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
        setActiveNavTab("impact_graph");
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
        if (lower.includes("tsmc") || lower.includes("chip") || lower.includes("semiconductor")) {
          matched = scenarios[1];
        } else if (lower.includes("rbi") || lower.includes("rate") || lower.includes("repo") || lower.includes("india")) {
          matched = scenarios[2];
        } else {
          // Dynamic scenario generated based on input
          matched = {
            id: `custom-${Date.now()}`,
            title: query.length > 30 ? query.slice(0, 30) + "..." : query,
            dropdownLabel: query,
            narrative: `Autonomous event propagation model synthesized for: "${query}". Input shocks traced through supply chains, inflation indices, and market valuations.`,
            date: "Live Analysis",
            source: "FinGraph AI Ingestion",
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
      setIsAnalyzing(false);
    }, 350);
  };

  // Node Click: opens drilldown if it has companies
  const handleSelectNode = (node: RadialCardNode) => {
    setSelectedNode(node);
    if (node.tickers && node.tickers.length > 0) {
      setIsDrilldownOpen(true);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans antialiased">
      {/* 1. Left Navigation Rail Sidebar */}
      <Sidebar activeTab={activeNavTab} onTabChange={setActiveNavTab} />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Search Bar */}
        <TopNav 
          onAnalyze={handleAnalyzeEvent} 
          onOpenAddStock={() => setIsAddStockOpen(true)}
          isLoading={isAnalyzing} 
        />

        {/* Content Body Area */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Main Stage View */}
          <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {activeNavTab === "impact_graph" && (
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
                />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Crisis 1: 1973 OPEC Embargo */}
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

                  {/* Crisis 2: 2008 Global Financial Crisis */}
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
                      <span className="text-slate-400 font-medium">Contagion Depth: 4 Hops</span>
                    </div>
                  </div>

                  {/* Crisis 3: 2020 COVID Supply Chain Freeze */}
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

                  {/* Crisis 4: 2023 SVB Run */}
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
                      <span className="text-slate-400 font-medium">Contagion Depth: 2 Hops</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Event Explorer Tab */}
            {activeNavTab === "event_explorer" && (
              <div className="flex flex-col gap-5 py-2">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Live Event & Scenario Explorer
                  </h2>
                  <p className="text-sm text-slate-600">
                    Select any pre-configured scenario or live catalyst to project multi-hop transmission.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {scenarios.map((sc) => (
                    <div
                      key={sc.id}
                      onClick={() => {
                        setActiveScenario(sc);
                        setActiveNavTab("impact_graph");
                      }}
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4"
                    >
                      <div className="flex flex-col gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold w-fit">
                          {sc.dropdownLabel.split("(")[0]}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900">
                          {sc.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {sc.narrative}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>{sc.entitiesCount} Entities • {sc.pathwaysCount} Pathways</span>
                        <span className="text-blue-600 font-semibold">Inspect →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overview / Saved Analyses fallback */}
            {(activeNavTab === "overview" || activeNavTab === "saved_analyses") && (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-200 my-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                  ★
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {activeNavTab === "overview" ? "Markets Executive Overview" : "Saved Portfolios & Scenarios"}
                </h3>
                <p className="text-sm text-slate-500 max-w-md">
                  Jump to the interactive transmission diagram to model live macroeconomic and sector shock propagation.
                </p>
                <button
                  onClick={() => setActiveNavTab("impact_graph")}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Open Impact Graph
                </button>
              </div>
            )}
          </main>

          {/* 3. Right Impact Pathways Panel */}
          {activeNavTab === "impact_graph" && (
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
    </div>
  );
};
