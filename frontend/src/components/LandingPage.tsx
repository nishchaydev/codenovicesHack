import React, { useEffect, useState } from "react";
import { 
  Activity,
  ArrowRight, 
  Zap, 
  Globe2, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  Network, 
  BarChart3, 
  Cpu, 
  Layers, 
  Search, 
  Radio, 
  CheckCircle2, 
  ChevronRight,
  Database,
  LineChart,
  ShieldCheck,
  Flame,
  Binary
} from "lucide-react";
import { LiveMarketTicker } from "./LiveMarketTicker";

interface LandingPageProps {
  onEnter: () => void;
  onSelectScenario?: (id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onSelectScenario }) => {
  const [riskIndex, setRiskIndex] = useState(0);
  const [activeShocks, setActiveShocks] = useState(0);
  const [sectorsAffected, setSectorsAffected] = useState(0);

  // Animate counters on mount
  useEffect(() => {
    const riskTarget = 74;
    const shockTarget = 3;
    const sectorTarget = 7;
    let frame = 0;
    const total = 45;
    const timer = setInterval(() => {
      frame++;
      setRiskIndex(Math.round((riskTarget * frame) / total));
      setActiveShocks(Math.round((shockTarget * frame) / total));
      setSectorsAffected(Math.round((sectorTarget * frame) / total));
      if (frame >= total) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, []);

  // Gauge calculations
  const r = 80;
  const cx = 120;
  const cy = 100;
  const semiCircumference = Math.PI * r;
  const strokeDashoffset = semiCircumference - (riskIndex / 100) * semiCircumference;
  const riskColor = riskIndex > 70 ? "#ef4444" : riskIndex > 40 ? "#f59e0b" : "#22c55e";
  const riskLabel = riskIndex > 70 ? "Elevated Contagion Risk" : riskIndex > 40 ? "Moderate Risk" : "Low Risk";

  const breakingCatalysts = [
    {
      id: "oil-supply-shock",
      title: "Black Sea Drone Strike on Russian Crude Infrastructure",
      category: "Commodity Disruption",
      transmission: "Crude Spikes +14.2% → Indian CAD Widens → Paint & Aviation Margins Compressed",
      impactLevel: "Critical",
      impactColor: "text-rose-600 bg-rose-50 border-rose-200",
      propagationSteps: "4 Degrees of Separation",
      affectedAssets: ["Brent Crude", "Asian Paints", "InterGlobe Aviation", "USD/INR"],
    },
    {
      id: "tsmc-supply-chain",
      title: "TSMC Hsinchu Advanced Sub-5nm Fab Line Unscheduled Outage",
      category: "Hardware Supply Bottleneck",
      transmission: "Wafer Lead Times Double → Auto MCU Scarcity → Consumer Hardware Capex Frozen",
      impactLevel: "Severe",
      impactColor: "text-amber-600 bg-amber-50 border-amber-200",
      propagationSteps: "3 Degrees of Separation",
      affectedAssets: ["NVIDIA", "Apple", "Tata Motors", "Infineon"],
    },
    {
      id: "rbi-rate-decision",
      title: "Red Sea Maritime Diversions + Escalated Freight Rate Index",
      category: "Macro & Geopolitical",
      transmission: "Asia-Europe Shipping +320% → Core Imported Inflation → MPC Rate Cuts Deferred",
      impactLevel: "High",
      impactColor: "text-orange-600 bg-orange-50 border-orange-200",
      propagationSteps: "3 Degrees of Separation",
      affectedAssets: ["10Y G-Sec", "HDFC Bank", "Container Corp", "Nifty 50"],
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-full gap-8 px-4 sm:px-8 py-3 text-center max-w-6xl mx-auto w-full pb-16">
      {/* ─── ELEGANT LANDING TOP BAR ─── */}
      <header className="w-full flex items-center justify-between py-3 border-b border-slate-200/70">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-sm">FinGraph</span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-orange-50 text-orange-600 border border-orange-200">
                v1.2
              </span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline">Autonomous Financial Event Impact Graph</span>
          </div>
        </div>

        {/* Clean right side of header */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 font-medium">FinGraph Causal Engine</span>
        </div>
      </header>

      {/* ─── LIVE STREAMING YFINANCE TICKER ─── */}
      <LiveMarketTicker />

      {/* ─── HERO HEADER SECTION ─── */}
      <div className="flex flex-col items-center gap-5 max-w-4xl pt-2">
        {/* Top Status Pill: Sleek Black */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black text-white text-xs font-semibold shadow-md tracking-wide border border-slate-800">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-200">Autonomous Financial Causal Engine</span>
          <span className="text-slate-500">·</span>
          <span className="text-emerald-400 font-mono text-[11px]">Real-time Telemetry Active</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
          Map Financial Shockwaves <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
            Before Markets React.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          FinGraph transforms unstructured global news into high-resolution causal dependency graphs.
          Trace how commodity price shocks, geopolitical tensions, and monetary policy decisions cascade across supply networks, balance sheets, and asset valuations.
        </p>

        {/* PRIMARY CTA: GET STARTED (ORANGE) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full justify-center">
          <button
            onClick={onEnter}
            className="group flex items-center justify-center gap-3 px-10 py-4.5 rounded-2xl bg-orange-500 text-white text-base sm:text-lg font-bold hover:bg-orange-600 transition-all duration-200 shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/35 hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 text-white/90 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ─── REAL-TIME SYSTEMIC GAUGE & METRICS ROW ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-stretch">
        {/* Left: Gauge Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between w-full pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              Systemic Stress Gauge
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
              LIVE INDEX
            </span>
          </div>

          <div className="flex flex-col items-center py-2 shrink-0">
            <svg width="240" height="130" viewBox="0 0 240 130">
              <path
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill="none"
                stroke={riskColor}
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={semiCircumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.4s ease" }}
              />
              <text x={cx} y={cy - 12} textAnchor="middle" fontSize="32" fontWeight="800" fill={riskColor} fontFamily="monospace">
                {riskIndex}
              </text>
              <text x={cx} y={cy + 8} textAnchor="middle" fontSize="9.5" fill="#475569" fontWeight="700" letterSpacing="0.05em">
                {riskLabel.toUpperCase()}
              </text>
              <text x={cx - r} y={cy + 22} textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="600">0</text>
              <text x={cx + r} y={cy + 22} textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="600">100</text>
            </svg>
            <span className="text-[11px] text-slate-400 font-mono tracking-wider mt-1">REAL-TIME SYSTEMIC STRESS GAUGE</span>
          </div>

          <div className="w-full pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Primary Contagion: <strong>Energy & Logistics</strong></span>
            <span className="text-rose-500 font-semibold font-mono">High Velocity</span>
          </div>
        </div>

        {/* Right: 3 Key Metrics */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between text-left gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">{activeShocks} Active</div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">Macro Contagions</div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Disruptions propagating across global trade corridors.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between text-left gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">{sectorsAffected} Sectors</div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">Transmitted Reach</div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Petrochemicals, Aviation, Automotive, and Real Estate.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between text-left gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">25+ Nodes</div>
              <div className="text-xs font-bold text-slate-700 mt-0.5">Causal Graph Model</div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                First, second, and third-order network paths modeled in memory.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FEATURED BREAKING CATALYSTS SECTION ─── */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-left gap-1">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Featured Breaking Catalysts
            </h2>
            <p className="text-xs text-slate-500">
              Select any live shock to open the full causal propagation graph or click Open Event Explorer Feed below.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Click any card to load causal model</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {breakingCatalysts.map((c) => (
            <div
              key={c.id}
              onClick={() => {
                if (onSelectScenario) onSelectScenario(c.id);
                else onEnter();
              }}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-orange-400 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 group"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${c.impactColor}`}>
                    {c.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{c.propagationSteps}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition leading-snug">
                  {c.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {c.transmission}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {c.affectedAssets.slice(0, 2).map((a, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                      {a}
                    </span>
                  ))}
                  {c.affectedAssets.length > 2 && (
                    <span className="text-[10px] text-slate-400 font-mono">+{c.affectedAssets.length - 2} more</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-orange-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Synthesize</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── THREE-PILLAR CAPABILITIES ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-left">
        <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-orange-400">
            <Network className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Multi-Order Causal BFS</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Breadth-First decay propagation tracks 1st, 2nd, and 3rd order impacts across supply networks, isolating second-derivative market vulnerabilities.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
            <LineChart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Live Yahoo Finance Telemetry</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time equity quotes, FX cross-rates, and commodity indices streamed straight into dynamic nodes with historical regression calibration.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Institutional Grade Explainability</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every edge carries explicit evidence citations, confidence calibration scores, and directionality indicators—no black-box hallucinations.
          </p>
        </div>
      </div>

      {/* ─── BOTTOM CTA FOOTER ─── */}
      <div className="w-full flex flex-col items-center gap-3 p-8 rounded-3xl bg-gradient-to-br from-orange-50/80 via-amber-50/50 to-slate-50 border border-orange-200/70 text-center">
        <h3 className="text-xl font-bold text-slate-900">
          Ready to explore live market catalysts?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">
          Enter the full interactive dashboard to filter news categories, synthesize custom event graphs, or run what-if simulations.
        </p>
        <button
          onClick={onEnter}
          className="mt-2 flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-orange-500 text-white text-sm sm:text-base font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20 cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
