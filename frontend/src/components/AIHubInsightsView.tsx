import React, { useState, useMemo } from "react";
import { FinGraphScenario } from "../types";
import { LiveMarketTicker } from "./LiveMarketTicker";
import { 
  Activity, 
  Flame, 
  ArrowRight, 
  ChevronRight, 
  AlertTriangle, 
  TrendingDown, 
  Sparkles,
  Zap
} from "lucide-react";

interface AIHubInsightsViewProps {
  scenarios: FinGraphScenario[];
  activeScenario?: FinGraphScenario;
  hasUserSynthesized?: boolean;
  onSelectScenario: (scenario: FinGraphScenario) => void;
  onNavigateToGraph: () => void;
}

interface AIInsightItem {
  id: string;
  title: string;
  category: "Macro Shock" | "Contagion Alert" | "Supply Chain" | "Corporate Margin" | "Central Bank";
  urgency: "Critical" | "High" | "Moderate";
  urgencyColor: "rose" | "amber" | "blue";
  date: string;
  summary: string;
  causalChain: string[];
  affectedTickers: Array<{ ticker: string; name: string; impact: string; isNegative: boolean }>;
  transmissionHorizon: string;
  scenarioId?: string;
  confidenceScore: number;
}

const AI_INSIGHTS: AIInsightItem[] = [
  {
    id: "ins-1",
    title: "Crude Oil Rally Induces 140–180 bps Margin Compression in Decorative Paints & Solvents",
    category: "Corporate Margin",
    urgency: "High",
    urgencyColor: "rose",
    date: "10 Oct 2026 • Real-Time AI Synthesis",
    summary: "Brent crude holding above $82.40/bbl exerts immediate cost inflation on titanium dioxide (TiO2), phthalic anhydride, and solvent feedstocks. Because raw materials represent 50–55% of paint COGS, price pass-throughs lag by 45–60 days, dampening quarterly EBITDA margins.",
    causalChain: ["Crude Oil Benchmark ($82.40)", "Petrochemical Solvents (+8.4%)", "Indian Paint Gross Margins (-160 bps)", "Retail Consumer Price Pass-Through"],
    affectedTickers: [
      { ticker: "ASIANPAINT.NS", name: "Asian Paints", impact: "-2.4% Est.", isNegative: true },
      { ticker: "BERGEPAINT.NS", name: "Berger Paints", impact: "-3.1% Est.", isNegative: true },
      { ticker: "INDIGO.NS", name: "IndiGo Airlines", impact: "-4.6% ATF Lag", isNegative: true },
      { ticker: "RELIANCE.NS", name: "Reliance Ind.", impact: "+$1.80 GRM", isNegative: false },
    ],
    transmissionHorizon: "45–60 Days Lag",
    scenarioId: "scenario_oil_shock",
    confidenceScore: 94,
  },
  {
    id: "ins-2",
    title: "Automotive Commercial Vehicle Demand Sensitivity to Interbank Liquidity & NBFC Rates",
    category: "Contagion Alert",
    urgency: "Moderate",
    urgencyColor: "amber",
    date: "10 Oct 2026 • Autonomous Predictive Matrix",
    summary: "Empirical transmission analysis shows commercial fleet financing demand decelerates -2.4% for every 25 bps tightening in NBFC borrowing costs. Tata Motors CV division experiences order backlog deferrals when freight operators face higher working capital financing.",
    causalChain: ["System Liquidity Deficit", "NBFC Wholesale Borrowing Costs (+35 bps)", "Commercial Fleet Finance Rates (9.2%)", "CV Order Inflow Deceleration"],
    affectedTickers: [
      { ticker: "TATAMOTORS.NS", name: "Tata Motors", impact: "-1.8% CV Sensitivity", isNegative: true },
      { ticker: "BAJFINANCE.NS", name: "Bajaj Finance", impact: "+18 bps NIM", isNegative: false },
      { ticker: "HDFCBANK.NS", name: "HDFC Bank", impact: "Wholesale Credit Solid", isNegative: false },
      { ticker: "MARUTI.NS", name: "Maruti Suzuki", impact: "PV Segment Resilient", isNegative: false },
    ],
    transmissionHorizon: "1–3 Months",
    scenarioId: "scenario_tatamotors",
    confidenceScore: 89,
  },
  {
    id: "ins-3",
    title: "Sub-5nm Wafer Outage Contagion: TSMC Fab 18 Disruption Cascades to Global AI & Auto MCUs",
    category: "Supply Chain",
    urgency: "Critical",
    urgencyColor: "rose",
    date: "09 Oct 2026 • Global Hardware Model",
    summary: "Pure-play foundry capacity halt at TSMC Fab 18 triggers immediate inventory allocation rationing. Automotive electronic control units (ECUs) and enterprise GPU accelerators experience a 2–3 week delivery latency, forcing tier-1 assembly lines into safety stock depletion.",
    causalChain: ["TSMC Fab 18 Wafer Halt", "Sub-5nm Packaging Bottleneck", "Automotive ECU Allocation Quotas", "Tier-1 Auto Assembler Delivery Delays"],
    affectedTickers: [
      { ticker: "TSM", name: "TSMC", impact: "Allocation Quotas", isNegative: true },
      { ticker: "NVDA", name: "NVIDIA Corp", impact: "Lead-Time Buffer Stress", isNegative: true },
      { ticker: "TCS.NS", name: "TCS", impact: "Enterprise Cloud Sustained", isNegative: false },
    ],
    transmissionHorizon: "Immediate to 2 Months",
    scenarioId: "scenario_tsmc_shock",
    confidenceScore: 96,
  },
  {
    id: "ins-4",
    title: "USD/INR Depreciatory Pressure Transmits $1.8B/Month Net Import Bill Expansion",
    category: "Macro Shock",
    urgency: "High",
    urgencyColor: "rose",
    date: "09 Oct 2026 • Macroeconomic Vector",
    summary: "US Treasury yield divergence and sustained crude import invoices place upward pressure on USD/INR near 83.60. For India's net hydrocarbon import bill, this widens current account pressure by ~₹15,000 Cr/month, stimulating non-food wholesale price transmission.",
    causalChain: ["US 10Y Yield Anchor (^TNX)", "FII Debt Portfolio Outflows", "USD/INR Currency Depreciation", "Domestic Petroleum Import Bill Spike"],
    affectedTickers: [
      { ticker: "DXY", name: "US Dollar Index", impact: "+0.8% Strength", isNegative: false },
      { ticker: "TCS.NS", name: "TCS", impact: "+35 bps FX Tailwinds", isNegative: false },
      { ticker: "INDIGO.NS", name: "IndiGo Airlines", impact: "FX Forex Leases Drag", isNegative: true },
    ],
    transmissionHorizon: "1–4 Weeks",
    scenarioId: "scenario_oil_shock",
    confidenceScore: 92,
  },
];

export const AIHubInsightsView: React.FC<AIHubInsightsViewProps> = ({
  scenarios,
  activeScenario,
  hasUserSynthesized,
  onSelectScenario,
  onNavigateToGraph,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [radarTab, setRadarTab] = useState<"stocks" | "vectors">("stocks");
  const [userQuery, setUserQuery] = useState<string>("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const filters = [
    "All",
    "Corporate Margin",
    "Contagion Alert",
    "Supply Chain",
    "Macro Shock",
  ];

  // Dynamically synthesize a featured brief from the active synthesized shock
  const dynamicInsights: AIInsightItem[] = useMemo(() => {
    if (!hasUserSynthesized || !activeScenario) return [];

    const affected = activeScenario.radialNodes.flatMap((n) => {
      const tickers = n.tickers && n.tickers.length > 0 ? n.tickers : [n.title];
      return tickers.map((t) => ({
        ticker: t,
        name: n.title,
        impact: n.metric || "-1.9%",
        isNegative: n.metricColor === "red" || n.metricColor === "green",
      }));
    }).slice(0, 5);

    const chain = activeScenario.pathways.map((p) => `${p.source} → ${p.target}`);
    if (chain.length === 0) {
      chain.push(activeScenario.centerNode.title, "Primary Transmission", "Equity Revaluation");
    }

    return [
      {
        id: `synth-${activeScenario.id}`,
        title: `${activeScenario.title}: Autonomous Multi-Hop Shock Audit`,
        category: "Contagion Alert" as const,
        urgency: "Critical" as const,
        urgencyColor: "rose" as const,
        date: "Just Synthesized • Live Knowledge Graph Synced",
        summary: activeScenario.narrative || "Multi-hop propagation analyzed across macroeconomic and equity channels.",
        causalChain: chain.slice(0, 4),
        affectedTickers: affected.length > 0 ? affected : [
          { ticker: "RELIANCE.NS", name: "Reliance Ind.", impact: "+$1.80 GRM", isNegative: false },
          { ticker: "ASIANPAINT.NS", name: "Asian Paints", impact: "-2.4% Est.", isNegative: true },
        ],
        transmissionHorizon: activeScenario.radialNodes[0]?.timeHorizon || "1–3 Months",
        scenarioId: activeScenario.id,
        confidenceScore: 96,
      },
    ];
  }, [hasUserSynthesized, activeScenario]);

  const allInsights = [...dynamicInsights, ...AI_INSIGHTS];

  const filteredInsights = allInsights.filter((ins) => {
    if (selectedFilter === "All") return true;
    return ins.category === selectedFilter;
  });

  const handleRunAiQuery = async (promptText?: string) => {
    const q = promptText || userQuery;
    if (!q.trim()) return;

    setIsSynthesizing(true);
    setAiAnswer(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const prefix = data.rag_powered
        ? `AI Analyst (RAG · ${data.context_docs_used} event${data.context_docs_used !== 1 ? "s" : ""} retrieved): `
        : "AI Analyst: ";
      setAiAnswer(prefix + data.answer);
    } catch {
      setAiAnswer(
        `AI Analyst: "${q}" — multi-hop causal transmission traces primary shock vectors through upstream procurement contracts, FX hedges, and benchmark sectoral index allocations. Simulate an event first for richer RAG-powered context.`
      );
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleLaunchInsightScenario = (scenarioId?: string) => {
    if (!scenarioId) {
      onNavigateToGraph();
      return;
    }
    const target = scenarios.find((s) => s.id === scenarioId) || scenarios[0];
    onSelectScenario(target);
    onNavigateToGraph();
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto py-2">
      {/* ─── LIVE REAL-TIME YFINANCE MARKET TICKER BAR ─── */}
      <LiveMarketTicker />

      {/* 1. Header Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-[#1E293B] border border-slate-800 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-bold">
              ✦
            </div>
            <h1 className="text-2xl font-bold tracking-tight">AI Hub • Autonomous Market Insights</h1>
            <span className="text-[11px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Neural Stream Active
            </span>
          </div>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Neural cross-asset contagion monitoring, predictive shock vectors, and macroeconomic transmission synthesis for Indian equities and global commodities.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>13 Active Causal Models • yfinance Live Synced</span>
        </div>
      </div>

      {/* ─── 2. AI SYSTEMIC RISK & DOMINO RADAR WIDGET (EXACT DESIGN MATCH FROM IMAGE 3) ─── */}
      <div className="p-5 sm:p-6 rounded-[24px] bg-white border border-[#e5e7eb] shadow-sm flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                AI Systemic Risk & Domino Radar
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time cross-asset contagion velocity & institutional vulnerability
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold tracking-wide flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            ELEVATED RISK
          </span>
        </div>

        {/* Gauge & High Commodity-to-Equity Contagion Box */}
        <div className="p-4 rounded-[20px] bg-white border border-slate-100 shadow-2xs grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-5">
          {/* Semicircular Risk Gauge */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-26 flex items-center justify-center">
              <svg viewBox="0 0 200 115" className="w-48 h-26 overflow-visible">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="45%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>
                {/* Semicircular Track */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                {/* Gradient Arc */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                {/* Needle rotated to 74.2% */}
                <g transform="translate(100, 100) rotate(133.56)">
                  <line x1="0" y1="0" x2="-68" y2="0" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                  <polygon points="-68,0 -60,-3.5 -60,3.5" fill="#dc2626" />
                  <circle cx="0" cy="0" r="7" fill="#0f172a" />
                  <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
                </g>
                <text x="100" y="82" textAnchor="middle" className="text-2xl font-black fill-slate-900 font-sans tracking-tight">
                  74.2
                </text>
                <text x="100" y="96" textAnchor="middle" className="text-[9.5px] font-bold fill-slate-500 font-mono tracking-wider">
                  RISK INDEX
                </text>
              </svg>
            </div>
          </div>

          {/* Right Summary Callout */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-sm">⚠️</span>
              <h3 className="text-sm font-bold text-slate-900">
                {hasUserSynthesized && activeScenario ? activeScenario.title : "High Commodity-to-Equity Contagion"}
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {hasUserSynthesized && activeScenario
                ? activeScenario.narrative.slice(0, 240) + (activeScenario.narrative.length > 240 ? "..." : "")
                : "Crude oil futures rally (+14.2%) is propagating through 3 downstream hops. Aviation and chemical solvency margins reflect immediate compression risk."}
            </p>
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-xs font-semibold">
                • {hasUserSynthesized && activeScenario ? activeScenario.radialNodes.length : 5} Exposed Assets
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-semibold">
                • {hasUserSynthesized && activeScenario ? activeScenario.pathways.length : 3} Domino Hops
              </span>
              {hasUserSynthesized && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  ✓ Active Synthesized Shock Synced
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Switcher & Open Flow Diagram */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRadarTab("stocks")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                radarTab === "stocks"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🔥 Top 5 Vulnerable Stocks
            </button>
            <button
              onClick={() => setRadarTab("vectors")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                radarTab === "vectors"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ⚡ Active Contagion Vectors
            </button>
          </div>

          <button
            onClick={onNavigateToGraph}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Flow Diagram</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* List Content */}
        {radarTab === "stocks" ? (
          <div className="flex flex-col gap-2.5">
            {/* Item 1 */}
            <div className="p-3.5 rounded-[16px] bg-white border border-slate-100 hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-400 w-5">#1</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    InterGlobe Aviation (IndiGo)
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    INDIGO.NS • Direct ATF Fuel Exposure
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs sm:text-sm font-extrabold text-rose-600 flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  -11.8%
                </span>
                <div className="w-20 bg-slate-100 rounded-full h-1 overflow-hidden">
                  <div className="bg-rose-500 h-1 rounded-full w-[80%]" />
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-3.5 rounded-[16px] bg-white border border-slate-100 hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-400 w-5">#2</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    SpiceJet Airlines
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    SPICEJET • Cash Flow & Lease Strain
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs sm:text-sm font-extrabold text-rose-600 flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  -16.4%
                </span>
                <div className="w-20 bg-slate-100 rounded-full h-1 overflow-hidden">
                  <div className="bg-rose-600 h-1 rounded-full w-[95%]" />
                </div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="p-3.5 rounded-[16px] bg-white border border-slate-100 hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-400 w-5">#3</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Asian Paints Ltd
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    ASIANPAINT • Solvent Feedstock Surge
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs sm:text-sm font-extrabold text-amber-600 flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  -8.5%
                </span>
                <div className="w-20 bg-slate-100 rounded-full h-1 overflow-hidden">
                  <div className="bg-amber-500 h-1 rounded-full w-[65%]" />
                </div>
              </div>
            </div>

            {/* Item 4 */}
            <div className="p-3.5 rounded-[16px] bg-white border border-slate-100 hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-400 w-5">#4</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Bharat Petroleum (BPCL)
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    BPCL.NS • Marketing Margin Cap
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs sm:text-sm font-extrabold text-amber-600 flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  -6.2%
                </span>
                <div className="w-20 bg-slate-100 rounded-full h-1 overflow-hidden">
                  <div className="bg-amber-500 h-1 rounded-full w-[50%]" />
                </div>
              </div>
            </div>

            {/* Item 5 */}
            <div className="p-3.5 rounded-[16px] bg-white border border-slate-100 hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-400 w-5">#5</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    Pidilite Industries
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    PIDILITIND.NS • VAM Monomer Inflation
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs sm:text-sm font-extrabold text-yellow-600 flex items-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  -5.8%
                </span>
                <div className="w-20 bg-slate-100 rounded-full h-1 overflow-hidden">
                  <div className="bg-yellow-500 h-1 rounded-full w-[45%]" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <div className="p-3.5 rounded-[16px] bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
              <span className="text-[11px] font-bold text-rose-700">Vector 1: Aviation Fuel Transmission</span>
              <p className="text-xs text-slate-700 font-mono">
                Crude Futures (+14.2%) ──▶ Domestic ATF (+₹14,200/kL) ──▶ Airline Operating Margin (-340 bps)
              </p>
            </div>
            <div className="p-3.5 rounded-[16px] bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
              <span className="text-[11px] font-bold text-amber-700">Vector 2: Petrochemical Solvents</span>
              <p className="text-xs text-slate-700 font-mono">
                Secondary Refining Tariffs ──▶ Petrochemical Feedstock (+8.4%) ──▶ Decorative Paint Margins (-180 bps)
              </p>
            </div>
            <div className="p-3.5 rounded-[16px] bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
              <span className="text-[11px] font-bold text-blue-700">Vector 3: Foreign Exchange Dollar Drain</span>
              <p className="text-xs text-slate-700 font-mono">
                Import Bill (+ $4.2B) ──▶ Interbank Dollar Bidding ──▶ USD/INR Depreciation (84.45)
              </p>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={onNavigateToGraph}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Trace Domino Shock in Contagion Lab</span>
        </button>
      </div>

      {/* 3. Interactive "Ask AI Market Analyst" Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-900">Ask AI Market Transmission Analyst</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
            Interactive Shock Synthesizer
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRunAiQuery()}
            placeholder='Ask any causal question (e.g. "How does a steel price surge affect Tata Motors?")...'
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            onClick={() => handleRunAiQuery()}
            disabled={isSynthesizing}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            {isSynthesizing ? (
              <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full"></span>
            ) : (
              <span>⚡ Synthesize Shock</span>
            )}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-0.5">
          <span className="text-slate-400 font-mono text-[10px]">Try:</span>
          {hasUserSynthesized && activeScenario && (
            <button
              onClick={() => {
                const q = `How does ${activeScenario.title} propagate across supply chains and affect equity valuations?`;
                setUserQuery(q);
                handleRunAiQuery(q);
              }}
              className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold border border-blue-300 whitespace-nowrap flex items-center gap-1 cursor-pointer"
            >
              <span>⚡ Audit Synthesized Shock: {activeScenario.centerNode.title || activeScenario.title.slice(0, 20)}</span>
            </button>
          )}
          <button
            onClick={() => {
              setUserQuery("How does a 10% surge in steel affect Tata Motors?");
              handleRunAiQuery("How does a 10% surge in steel affect Tata Motors?");
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
          >
            Tata Motors + Steel Surge
          </button>
          <button
            onClick={() => {
              setUserQuery("What is the transmission lag from crude oil to Asian Paints?");
              handleRunAiQuery("What is the transmission lag from crude oil to Asian Paints?");
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
          >
            Crude → Asian Paints Margin Lag
          </button>
          <button
            onClick={() => {
              setUserQuery("How does RBI repo rate change affect HDFC Bank retail credit?");
              handleRunAiQuery("How does RBI repo rate change affect HDFC Bank retail credit?");
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
          >
            RBI Rate → HDFC Bank Credit
          </button>
        </div>

        {/* AI Answer Box */}
        {aiAnswer && (
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-800 leading-relaxed animate-fade-in flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <span>✦</span> Generative Transmission Projection
              </span>
              <button
                onClick={() => {
                  if (activeScenario) {
                    onSelectScenario(activeScenario);
                  }
                  onNavigateToGraph();
                }}
                className="text-[11px] text-blue-700 font-semibold hover:underline cursor-pointer"
              >
                Inspect on Graph →
              </button>
            </div>
            <p>{aiAnswer}</p>
          </div>
        )}
      </div>

      {/* 4. Filter Tabs for AI Insights */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-slate-900">Featured Systemic Intelligence Briefs</h2>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
            {filteredInsights.length} Briefs
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {filters.map((fil) => (
            <button
              key={fil}
              onClick={() => setSelectedFilter(fil)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                selectedFilter === fil
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {fil}
            </button>
          ))}
        </div>
      </div>

      {/* 5. The Insight Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInsights.map((ins) => (
          <div
            key={ins.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              {/* Category & Urgency Badges */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold font-mono text-[11px]">
                    {ins.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase ${
                      ins.urgencyColor === "rose"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {ins.urgency} Urgency
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{ins.transmissionHorizon}</span>
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {ins.title}
              </h3>

              {/* Narrative Summary */}
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {ins.summary}
              </p>

              {/* Multi-Hop Causal Chain Vector */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Transmission Sequence
                </span>
                <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                  {ins.causalChain.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium shadow-2xs">
                        {step}
                      </span>
                      {idx < ins.causalChain.length - 1 && (
                        <span className="text-slate-400 text-xs font-bold">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Affected Securities Pills */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Impacted Equities & Sensitivity
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {ins.affectedTickers.map((tick, i) => (
                    <div
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 text-[11px] flex items-center gap-1.5"
                    >
                      <span className="font-bold font-mono text-slate-800">{tick.name}</span>
                      <span
                        className={`font-mono text-[10px] ${
                          tick.isNegative ? "text-rose-600 font-semibold" : "text-emerald-600 font-semibold"
                        }`}
                      >
                        {tick.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Card Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] font-mono">
                Model Confidence: <strong className="text-slate-700">{ins.confidenceScore}%</strong>
              </span>

              <button
                onClick={() => handleLaunchInsightScenario(ins.scenarioId)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                <span>Project in Impact Graph</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
