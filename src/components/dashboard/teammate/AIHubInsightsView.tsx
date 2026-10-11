import React, { useState } from "react";
import { FinGraphScenario } from "@/types/fingraph/types";

interface AIHubInsightsViewProps {
  scenarios: FinGraphScenario[];
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
  onSelectScenario,
  onNavigateToGraph,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
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

  const filteredInsights = AI_INSIGHTS.filter((ins) => {
    if (selectedFilter === "All") return true;
    return ins.category === selectedFilter;
  });

  const handleRunAiQuery = (promptText?: string) => {
    const q = promptText || userQuery;
    if (!q.trim()) return;

    setIsSynthesizing(true);
    setAiAnswer(null);

    setTimeout(() => {
      if (q.toLowerCase().includes("tata") || q.toLowerCase().includes("steel")) {
        setAiAnswer(
          "Autonomous Synthesis: A 10% surge in hot-rolled steel prices directly inflates raw material costs for Tata Motors by ~1.2% of net revenues. Commercial vehicle margins absorb this with an approximate 60-day lag due to fixed-price fleet supply contracts, whereas passenger vehicle pricing can be adjusted within 30 days."
        );
      } else if (q.toLowerCase().includes("crude") || q.toLowerCase().includes("paint")) {
        setAiAnswer(
          "Autonomous Synthesis: Solvents and derivatives derived from crude oil represent approximately 50% of the cost of goods sold for decorative paint manufacturers. The empirical correlation is 0.88 with a 45–60 day pass-through lag. Asian Paints and Berger historically experience 140–180 bps EBITDA margin dilution if crude remains above $82/bbl."
        );
      } else if (q.toLowerCase().includes("rbi") || q.toLowerCase().includes("rate")) {
        setAiAnswer(
          "Autonomous Synthesis: A 25 bps RBI monetary shift influences short-term call money rates and commercial paper spreads within 48 hours. Retail home loans through HDFC Bank reprice automatically via the External Benchmark Lending Rate (EBLR), while CASA deposit rates adjust over 2–4 quarters."
        );
      } else {
        setAiAnswer(
          `Autonomous Synthesis for "${q}": Multi-hop causal transmission traces primary shock vectors through upstream procurement contracts, foreign exchange hedges, and benchmark sectoral index fund allocations. Systemic contagion probability is estimated at 74% with primary transmission observed across 3 hops.`
        );
      }
      setIsSynthesizing(false);
    }, 400);
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
          <span>13 Active Causal Models • 120ms Latency</span>
        </div>
      </div>

      {/* 2. Three Metric KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl clay-surface border border-[var(--clay-border)]/90 shadow-2xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-semibold">Systemic Contagion Risk</span>
            <span className="text-rose-600 font-mono font-bold">78.4% • High</span>
          </div>
          <div className="w-full clay-inset rounded-full h-2 overflow-hidden mt-1">
            <div className="bg-rose-500 h-2 rounded-full" style={{ width: "78.4%" }}></div>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] pt-1">
            Driven by energy import bills and currency pass-through to domestic manufacturers.
          </p>
        </div>

        <div className="p-4 rounded-xl clay-surface border border-[var(--clay-border)]/90 shadow-2xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-semibold">Active Catalyst Clusters</span>
            <span className="text-blue-600 font-mono font-bold">4 Systemic Clusters</span>
          </div>
          <div className="text-lg font-bold font-mono text-[var(--text-primary)]">
            Energy • Chips • FX • NBFC
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            Cross-market propagation nodes actively monitored in real time.
          </p>
        </div>

        <div className="p-4 rounded-xl clay-surface border border-[var(--clay-border)]/90 shadow-2xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span className="font-semibold">Model Validation Confidence</span>
            <span className="text-emerald-600 font-mono font-bold">94.1% Backtested</span>
          </div>
          <div className="text-lg font-bold font-mono text-[var(--text-primary)]">
            2,400+ Crisis Precedents
          </div>
          <p className="text-[11px] text-[var(--text-secondary)]">
            Calibrated against historical rate cycles, supply disruptions, and geopolitical shocks.
          </p>
        </div>
      </div>

      {/* 3. Interactive "Ask AI Market Analyst" Bar */}
      <div className="p-4 rounded-2xl clay-surface border border-[var(--clay-border)] shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[var(--text-primary)]">Ask AI Market Transmission Analyst</span>
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
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-[var(--clay-border)] clay-surface text-xs text-[var(--text-primary)] placeholder:text-slate-400 focus:outline-none focus:clay-surface focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
          <button
            onClick={() => {
              setUserQuery("How does a 10% surge in steel affect Tata Motors?");
              handleRunAiQuery("How does a 10% surge in steel affect Tata Motors?");
            }}
            className="px-2.5 py-1 rounded-lg clay-inset hover:bg-slate-200 text-[var(--text-primary)] whitespace-nowrap"
          >
            Tata Motors + Steel Surge
          </button>
          <button
            onClick={() => {
              setUserQuery("What is the transmission lag from crude oil to Asian Paints?");
              handleRunAiQuery("What is the transmission lag from crude oil to Asian Paints?");
            }}
            className="px-2.5 py-1 rounded-lg clay-inset hover:bg-slate-200 text-[var(--text-primary)] whitespace-nowrap"
          >
            Crude → Asian Paints Margin Lag
          </button>
          <button
            onClick={() => {
              setUserQuery("How does RBI repo rate change affect HDFC Bank retail credit?");
              handleRunAiQuery("How does RBI repo rate change affect HDFC Bank retail credit?");
            }}
            className="px-2.5 py-1 rounded-lg clay-inset hover:bg-slate-200 text-[var(--text-primary)] whitespace-nowrap"
          >
            RBI Rate → HDFC Bank Credit
          </button>
        </div>

        {/* AI Answer Box */}
        {aiAnswer && (
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-[var(--text-primary)] leading-relaxed animate-fade-in flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <span>✦</span> Generative Transmission Projection
              </span>
              <button
                onClick={() => handleLaunchInsightScenario("scenario_tatamotors")}
                className="text-[11px] text-blue-700 font-semibold hover:underline"
              >
                Inspect on Graph →
              </button>
            </div>
            <p>{aiAnswer}</p>
          </div>
        )}
      </div>

      {/* 4. Filter Tabs for AI Insights */}
      <div className="flex items-center justify-between border-b border-[var(--clay-border)] pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-[var(--text-primary)]">Featured Systemic Intelligence Briefs</h2>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full clay-inset text-[var(--text-secondary)] font-medium">
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
                  : "clay-inset text-[var(--text-secondary)] hover:bg-slate-200"
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
            className="p-5 rounded-2xl clay-surface border border-[var(--clay-border)]/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              {/* Category & Urgency Badges */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md clay-inset text-[var(--text-primary)] font-semibold font-mono text-[11px]">
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
              <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug">
                {ins.title}
              </h3>

              {/* Narrative Summary */}
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
                {ins.summary}
              </p>

              {/* Multi-Hop Causal Chain Vector */}
              <div className="p-2.5 rounded-xl clay-surface border border-[var(--clay-border)] space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Transmission Sequence
                </span>
                <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                  {ins.causalChain.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="px-2 py-0.5 rounded clay-surface border border-[var(--clay-border)] text-[var(--text-primary)] font-medium shadow-2xs">
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
                      className="px-2 py-0.5 rounded-md clay-inset border border-[var(--clay-border)]/80 text-[11px] flex items-center gap-1.5"
                    >
                      <span className="font-bold font-mono text-[var(--text-primary)]">{tick.name}</span>
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
            <div className="pt-3 border-t border-[var(--clay-border)] flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px] font-mono">
                Model Confidence: <strong className="text-[var(--text-primary)]">{ins.confidenceScore}%</strong>
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

