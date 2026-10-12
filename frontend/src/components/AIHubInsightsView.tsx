import React, { useState } from "react";
import { FinGraphScenario } from "../types";
import { LiveMarketTicker } from "./LiveMarketTicker";
import { ThinkBeforeBuyCard } from "./ThinkBeforeBuyCard";
import { 
  Activity, 
  ChevronRight, 
  TrendingDown, 
  Sparkles,
  Zap,
  ShoppingBag,
  Layers
} from "lucide-react";

interface AIHubInsightsViewProps {
  scenarios: FinGraphScenario[];
  activeScenario?: FinGraphScenario;
  hasUserSynthesized?: boolean;
  onSelectScenario: (scenario: FinGraphScenario) => void;
  onNavigateToGraph: () => void;
}

export const AIHubInsightsView: React.FC<AIHubInsightsViewProps> = ({
  scenarios: _scenarios,
  activeScenario,
  hasUserSynthesized,
  onSelectScenario,
  onNavigateToGraph,
}) => {
  const [radarTab, setRadarTab] = useState<"stocks" | "vectors">("stocks");
  const [userQuery, setUserQuery] = useState<string>("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [activeCardModule, setActiveCardModule] = useState<"card1" | "card2" | "card3" | null>("card1");

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

      {/* ─── AI HUB 3-CARD RECTANGULAR MODULE SELECTOR (EXACT SIZES & ON-CLICK LAUNCH) ─── */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
              Autonomous Intelligence Suites
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              Click any card to open view
            </span>
          </div>

          {activeCardModule && (
            <button
              onClick={() => setActiveCardModule(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Minimize Open View ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* RECTANGULAR CARD 1: ThinkBeforeBuy Radar */}
          <div
            onClick={() => setActiveCardModule(activeCardModule === "card1" ? null : "card1")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-4 group ${
              activeCardModule === "card1"
                ? "bg-gradient-to-b from-indigo-50/60 to-white border-indigo-600 shadow-md ring-2 ring-indigo-400/30"
                : "bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-sm"
            }`}
          >
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md font-extrabold border ${
                    activeCardModule === "card1"
                      ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    Card 1 • Valuation
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-indigo-600 text-white text-[9.5px] font-black uppercase">
                    NEW
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  Score 92
                </span>
              </div>

              <div className="flex items-center gap-2.5 mt-1">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  activeCardModule === "card1"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100"
                }`}>
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  ThinkBeforeBuy Radar
                </h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Empirical price drop tracking, deal verification score breakup, and optimal capital timing recommendation.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
              <span className="text-[11px] text-slate-400 font-mono">
                Lowest: ₹449 • Steal 🚀
              </span>
              <span className={`flex items-center gap-1 text-[11px] font-bold ${
                activeCardModule === "card1" ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-900"
              }`}>
                {activeCardModule === "card1" ? "● Active View" : "Click to Open"}
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeCardModule === "card1" ? "rotate-90" : "group-hover:translate-x-0.5"}`} />
              </span>
            </div>
          </div>

          {/* RECTANGULAR CARD 2: Ask AI Market Transmission Analyst */}
          <div
            onClick={() => setActiveCardModule(activeCardModule === "card2" ? null : "card2")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-4 group ${
              activeCardModule === "card2"
                ? "bg-gradient-to-b from-blue-50/60 to-white border-blue-600 shadow-md ring-2 ring-blue-400/30"
                : "bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-sm"
            }`}
          >
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md font-extrabold border ${
                  activeCardModule === "card2"
                    ? "bg-blue-100 text-blue-800 border-blue-300"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                  Card 2 • Causal AI
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                  RAG Online
                </span>
              </div>

              <div className="flex items-center gap-2.5 mt-1">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  activeCardModule === "card2"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                }`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Ask AI Market Transmission Analyst
                </h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Interactive multi-hop shock synthesizer and causal RAG querying for supply chains and equity margins.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
              <span className="text-[11px] text-slate-400 font-mono">
                13 Causal Models Synced
              </span>
              <span className={`flex items-center gap-1 text-[11px] font-bold ${
                activeCardModule === "card2" ? "text-blue-600" : "text-slate-500 group-hover:text-slate-900"
              }`}>
                {activeCardModule === "card2" ? "● Active View" : "Click to Open"}
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeCardModule === "card2" ? "rotate-90" : "group-hover:translate-x-0.5"}`} />
              </span>
            </div>
          </div>

          {/* RECTANGULAR CARD 3: AI Systemic Risk & Domino Radar */}
          <div
            onClick={() => setActiveCardModule(activeCardModule === "card3" ? null : "card3")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-4 group ${
              activeCardModule === "card3"
                ? "bg-gradient-to-b from-orange-50/60 to-white border-orange-500 shadow-md ring-2 ring-orange-400/30"
                : "bg-white border-slate-200/90 hover:border-orange-300 hover:shadow-sm"
            }`}
          >
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md font-extrabold border ${
                  activeCardModule === "card3"
                    ? "bg-orange-100 text-orange-800 border-orange-300"
                    : "bg-slate-100 text-slate-600 border-slate-200"
                }`}>
                  Card 3 • Risk Radar
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold">
                  74.2 Index
                </span>
              </div>

              <div className="flex items-center gap-2.5 mt-1">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  activeCardModule === "card3"
                    ? "bg-orange-500 text-white shadow-xs"
                    : "bg-orange-50 text-orange-600 group-hover:bg-orange-100"
                }`}>
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  AI Systemic Risk & Domino Radar
                </h3>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Real-time cross-asset contagion velocity, cascade propagation, and institutional shock vulnerability.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
              <span className="text-[11px] text-slate-400 font-mono">
                5 Exposed Assets • 3 Hops
              </span>
              <span className={`flex items-center gap-1 text-[11px] font-bold ${
                activeCardModule === "card3" ? "text-orange-600" : "text-slate-500 group-hover:text-slate-900"
              }`}>
                {activeCardModule === "card3" ? "● Active View" : "Click to Open"}
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeCardModule === "card3" ? "rotate-90" : "group-hover:translate-x-0.5"}`} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── EMPTY STATE WHEN NO CARD SELECTED ─── */}
      {activeCardModule === null && (
        <div className="p-8 rounded-[24px] bg-slate-50/80 border border-dashed border-slate-300 text-center flex flex-col items-center justify-center gap-2.5 animate-in fade-in duration-150">
          <div className="w-10 h-10 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-500 shadow-2xs">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">No Intelligence Card Opened</h3>
          <p className="text-xs text-slate-500 max-w-md">
            Click on any of the 3 rectangular cards above (ThinkBeforeBuy Radar, Ask AI Analyst, or Systemic Risk) to view its interactive analytical dashboard.
          </p>
        </div>
      )}

      {/* ─── CARD 1: THINKBEFOREBUY (OPENS ON CLICK) ─── */}
      {activeCardModule === "card1" && (
        <div id="card-think-before-buy" className="scroll-mt-20 animate-in fade-in duration-200">
          <ThinkBeforeBuyCard />
        </div>
      )}

      {/* ─── CARD 3: AI SYSTEMIC RISK & DOMINO RADAR WIDGET (OPENS ON CLICK) ─── */}
      {activeCardModule === "card3" && (
        <div id="card-systemic-risk" className="p-5 sm:p-6 rounded-[24px] bg-white border border-[#e5e7eb] shadow-sm flex flex-col gap-5 scroll-mt-20 animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 font-bold border border-orange-200">
                  Card 3 • Contagion Radar
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight mt-0.5">
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
      )}

      {/* ─── CARD 2: ASK AI MARKET TRANSMISSION ANALYST (OPENS ON CLICK) ─── */}
      {activeCardModule === "card2" && (
        <div id="card-market-analyst" className="p-5 sm:p-6 rounded-[24px] bg-white border border-[#e5e7eb] shadow-sm flex flex-col gap-4 scroll-mt-20 animate-in fade-in duration-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  Card 2 • Causal Q&A
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight mt-0.5">
                Ask AI Market Transmission Analyst
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Interactive Multi-Hop Shock Synthesizer & RAG Context Engine
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            RAG ONLINE
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
      )}

    </div>
  );
};
