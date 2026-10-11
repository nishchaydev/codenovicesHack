import React, { useEffect, useState } from "react";
import { Activity, ArrowRight, Zap, Globe2, TrendingUp, ShieldAlert, Sparkles, Flame, Network } from "lucide-react";
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

  // Gauge arc metrics
  const gaugePercent = riskIndex / 100;
  const cx = 130, cy = 120, r = 85;
  const circumference = Math.PI * r;
  const strokeDashoffset = circumference * (1 - gaugePercent);

  // Tip indicator point
  const tipAngle = Math.PI * (1 - gaugePercent);
  const tipX = cx + r * Math.cos(tipAngle);
  const tipY = cy - r * Math.sin(tipAngle);

  const riskColor = riskIndex > 70 ? "#ef4444" : riskIndex > 40 ? "#f59e0b" : "#10b981";
  const riskLabel = riskIndex > 70 ? "Elevated Contagion Risk" : riskIndex > 40 ? "Moderate Stress" : "Normal Baseline";

  return (
    <div className="flex flex-col items-center justify-start min-h-full gap-8 px-4 sm:px-8 pt-4 pb-12 text-center max-w-7xl mx-auto w-full">
      {/* ─── LIVE STREAMING YFINANCE TICKER ─── */}
      <LiveMarketTicker />

      {/* Live status badge */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Fin.D · Autonomous Market Impact Engine · Institutional Grade</span>
      </div>

      {/* Hero headline */}
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Financial Events Don't<br />
          <span className="text-blue-600">Happen in Isolation</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Convert unstructured financial news into an interactive causal dependency graph. Trace how a single
          geopolitical shock, commodity spike, or rate decision propagates across supply chains, sectors, and assets.
        </p>
      </div>

      {/* 4 High-Density Institutional Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full text-left">
        {/* ─── CARD 1: SYSTEMIC STRESS GAUGE ─── */}
        <div className="flex flex-col justify-between p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 gap-3 group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-rose-500 font-mono text-[11px] font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>Systemic Stress Gauge</span>
              </div>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200/60 text-[9.5px] font-bold text-rose-700 font-mono tracking-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                LIVE INDEX
              </span>
            </div>

            {/* Gauge Graphic */}
            <div className="flex flex-col items-center justify-center my-0.5">
              <svg width="220" height="120" viewBox="0 0 260 145" className="overflow-visible">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="35%" stopColor="#f59e0b" />
                    <stop offset="65%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                  <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={riskColor} floodOpacity="0.7" />
                  </filter>
                </defs>

                <path
                  d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="14"
                  strokeLinecap="round"
                />

                {riskIndex > 0 && (
                  <path
                    d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
                  />
                )}

                {riskIndex > 0 && (
                  <g filter="url(#needleGlow)">
                    <circle cx={tipX} cy={tipY} r="7" fill="#ffffff" stroke={riskColor} strokeWidth="3" />
                    <circle cx={tipX} cy={tipY} r="3" fill={riskColor} />
                  </g>
                )}

                <text
                  x={cx}
                  y={cy - 14}
                  textAnchor="middle"
                  fontSize="38"
                  fontWeight="900"
                  fill={riskColor}
                  fontFamily="monospace"
                  className="tracking-tight"
                >
                  {riskIndex}
                </text>

                <text
                  x={cx}
                  y={cy + 8}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill={riskIndex > 70 ? "#dc2626" : "#64748b"}
                  fontWeight="800"
                  letterSpacing="0.06em"
                >
                  {riskLabel.toUpperCase()}
                </text>

                <text x={cx - r} y={cy + 22} textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="600">
                  0
                </text>
                <text x={cx + r} y={cy + 22} textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="600">
                  100
                </text>
              </svg>

              <span className="text-[9.5px] font-bold text-slate-400 font-mono tracking-wider uppercase">
                Real-Time Systemic Stress Gauge
              </span>
            </div>

            {/* Micro Stress Metric Pills */}
            <div className="grid grid-cols-2 gap-2 mt-2 p-2 rounded-2xl bg-slate-50/90 border border-slate-100 text-[10.5px]">
              <div className="flex flex-col">
                <span className="text-slate-400 font-medium text-[10px]">Stress Drift</span>
                <span className="font-bold text-rose-600 font-mono text-[11px]">▲ +4.8% / 1hr</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 font-medium text-[10px]">Confidence Int.</span>
                <span className="font-bold text-slate-700 font-mono text-[11px]">95% [68 - 80]</span>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-medium">
            <span className="text-slate-500 truncate">
              Primary: <strong className="text-slate-800">Energy & Logistics</strong>
            </span>
            <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[9.5px] font-bold font-mono">
              High Velocity
            </span>
          </div>
        </div>

        {/* ─── CARD 2: MACRO CONTAGIONS ─── */}
        <div className="flex flex-col justify-between p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 gap-3 group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 shadow-2xs">
                <Zap className="w-4 h-4" />
              </div>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-mono text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                2 CRITICAL · 1 ELEVATED
              </span>
            </div>

            <div className="mb-2">
              <div className="text-2xl font-black text-slate-900 font-mono tracking-tight flex items-baseline gap-2">
                <span>{activeShocks} Active</span>
                <span className="text-[10px] text-rose-600 font-bold px-1.5 py-0.5 rounded bg-rose-50 font-mono">ACTIVE SHOCKS</span>
              </div>
              <h3 className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider mt-0.5">
                Macro Contagions
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Disruptions propagating across global trade corridors.
              </p>
            </div>

            {/* Live Catalyst Mini Feeds */}
            <div className="space-y-1.5 mt-2.5">
              {[
                { title: "Crude Brent Spike", change: "+14.2%", tag: "Energy Corridor", color: "bg-rose-500", percent: 85 },
                { title: "TSMC Fab 18", change: "+100% Lag", tag: "Semiconductor", color: "bg-amber-500", percent: 70 },
                { title: "Red Sea Freight", change: "+320%", tag: "Maritime Cargo", color: "bg-blue-500", percent: 62 },
              ].map((shock, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-50/90 border border-slate-100 text-[11px] flex flex-col gap-1 hover:bg-slate-100/70 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 text-[11px] truncate">{shock.title}</span>
                    <span className="font-mono font-bold text-[10.5px] text-rose-600">{shock.change}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-medium">{shock.tag}</span>
                    <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className={`h-full rounded-full ${shock.color}`} style={{ width: `${shock.percent}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>14 Corridors</span>
            <span className="font-semibold text-slate-700">Drawdown: -$42.8B</span>
          </div>
        </div>

        {/* ─── CARD 3: TRANSMITTED REACH ─── */}
        <div className="flex flex-col justify-between p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 gap-3 group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 shadow-2xs">
                <Globe2 className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-mono text-[10px] font-bold">
                CROSS-ASSET REACH
              </span>
            </div>

            <div className="mb-2">
              <div className="text-2xl font-black text-slate-900 font-mono tracking-tight flex items-baseline gap-2">
                <span>{sectorsAffected} Sectors</span>
                <span className="text-[10px] text-amber-700 font-bold px-1.5 py-0.5 rounded bg-amber-50 font-mono">IMPACT DEPTH</span>
              </div>
              <h3 className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider mt-0.5">
                Transmitted Reach
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Petrochemicals, Aviation, Automotive, and Real Estate.
              </p>
            </div>

            {/* Sector Sensitivity Bars */}
            <div className="space-y-1.5 mt-2.5">
              {[
                { sector: "Paints & Chemicals", effect: "-4.8%", exp: "High Sensitivity", bar: 88, color: "bg-rose-500" },
                { sector: "Aviation & Logistics", effect: "-3.9%", exp: "Jet Fuel Lag", bar: 76, color: "bg-rose-400" },
                { sector: "Automotive / OEMs", effect: "-2.1%", exp: "Margin Squeeze", bar: 54, color: "bg-amber-400" },
                { sector: "Upstream Oil & Gas", effect: "+6.4%", exp: "Windfall Lift", bar: 92, color: "bg-emerald-500" },
              ].map((s, idx) => (
                <div key={idx} className="space-y-0.5 p-1.5 rounded-xl bg-slate-50/60 border border-slate-100/80">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700 truncate">{s.sector}</span>
                    <span className={`font-mono font-bold text-[10.5px] ${s.effect.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {s.effect}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.bar}%` }} />
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono whitespace-nowrap">{s.exp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Velocity: 0.84 BFS/s</span>
            <span className="font-semibold text-slate-700">Decay α = 0.65</span>
          </div>
        </div>

        {/* ─── CARD 4: CAUSAL GRAPH MODEL ─── */}
        <div className="flex flex-col justify-between p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 gap-3 group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-2xs">
                <Network className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
                DAG TOPOLOGY
              </span>
            </div>

            <div className="mb-2">
              <div className="text-2xl font-black text-slate-900 font-mono tracking-tight flex items-baseline gap-2">
                <span>25+ Nodes</span>
                <span className="text-[10px] text-emerald-700 font-bold px-1.5 py-0.5 rounded bg-emerald-50 font-mono">IN-MEMORY</span>
              </div>
              <h3 className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider mt-0.5">
                Causal Graph Model
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                First, second, and third-order network paths modeled in memory.
              </p>
            </div>

            {/* Mini SVG Directed Causal Network Graphic */}
            <div className="relative h-18 w-full rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center p-2 my-2 border border-slate-800 shadow-inner">
              <svg viewBox="0 0 240 70" className="w-full h-full">
                {/* Directed Edges */}
                <line x1="30" y1="35" x2="90" y2="20" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="30" y1="35" x2="90" y2="50" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="90" y1="20" x2="160" y2="20" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="90" y1="50" x2="160" y2="35" stroke="#fbbf24" strokeWidth="1.5" />
                <line x1="90" y1="50" x2="160" y2="55" stroke="#fbbf24" strokeWidth="1.5" />
                <line x1="160" y1="20" x2="215" y2="35" stroke="#34d399" strokeWidth="1.5" />
                <line x1="160" y1="35" x2="215" y2="35" stroke="#34d399" strokeWidth="1.5" />
                <line x1="160" y1="55" x2="215" y2="55" stroke="#34d399" strokeWidth="1.5" />

                {/* Root Shock */}
                <circle cx="30" cy="35" r="9" fill="#f43f5e" />
                <circle cx="30" cy="35" r="14" fill="#f43f5e" opacity="0.3" className="animate-pulse" />
                <text x="30" y="38" fontSize="8" fill="#fff" fontWeight="bold" textAnchor="middle">S0</text>

                {/* 1st Order */}
                <circle cx="90" cy="20" r="7" fill="#fb7185" />
                <text x="90" y="23" fontSize="7" fill="#fff" fontWeight="bold" textAnchor="middle">O1</text>
                <circle cx="90" cy="50" r="7" fill="#fb7185" />
                <text x="90" y="53" fontSize="7" fill="#fff" fontWeight="bold" textAnchor="middle">O1</text>

                {/* 2nd Order */}
                <circle cx="160" cy="20" r="6" fill="#38bdf8" />
                <circle cx="160" cy="35" r="6" fill="#fbbf24" />
                <circle cx="160" cy="55" r="6" fill="#fbbf24" />

                {/* 3rd Order */}
                <circle cx="215" cy="35" r="7" fill="#34d399" />
                <circle cx="215" cy="55" r="5" fill="#34d399" />
              </svg>
              <div className="absolute bottom-1 right-2 text-[8.5px] font-mono text-emerald-400 font-bold">
                3-HOP CASCADE
              </div>
            </div>

            {/* Order Depth Chips */}
            <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[9px]">
              <div className="p-1 rounded-lg bg-rose-50 text-rose-700 font-bold border border-rose-100">
                1st: 6 Nodes
              </div>
              <div className="p-1 rounded-lg bg-amber-50 text-amber-700 font-bold border border-amber-100">
                2nd: 11 Nodes
              </div>
              <div className="p-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                3rd: 8+ Nodes
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>34 Directed Edges</span>
            <span className="font-semibold text-emerald-600">Zero Cycles</span>
          </div>
        </div>
      </div>

      {/* Featured Breaking Catalysts Box */}
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between text-left">
          <span className="text-xs font-bold text-slate-700 font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Breaking Market Catalysts Ready For Synthesis
          </span>
          <span className="text-xs text-slate-400 font-mono">Select any shock to trace impact</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
          {[
            { id: "oil-supply-shock", title: "Black Sea Drone Attacks on Russian Crude", tag: "Commodity Shock", impact: "Oil +14.2% · Indian CAD Expands", border: "hover:border-amber-400" },
            { id: "tsmc-supply-chain", title: "TSMC Fab 18 Sub-5nm Wafer Outage", tag: "Hardware Contagion", impact: "Lead Times +100% · Auto MCUs Down", border: "hover:border-blue-400" },
            { id: "rbi-rate-decision", title: "Red Sea Rerouting + Central Bank Rates", tag: "Macro Policy", impact: "Shipping +320% · Rate Cut Deferred", border: "hover:border-rose-400" },
          ].map((c) => (
            <div
              key={c.id}
              onClick={() => {
                if (onSelectScenario) onSelectScenario(c.id);
                else onEnter();
              }}
              className={`p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs ${c.border} hover:shadow-md transition cursor-pointer flex flex-col justify-between gap-2 group`}
            >
              <div>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                  {c.tag}
                </span>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition mt-1.5 leading-snug">
                  {c.title}
                </h4>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">{c.impact}</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-center w-full pt-2">
        <button
          onClick={onEnter}
          className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white text-sm sm:text-base font-bold hover:bg-slate-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
        >
          <span>Open Event Explorer Feed</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <p className="text-xs text-slate-400 font-mono pb-6">
        NLP Extraction · NetworkX Knowledge Graph · BFS Shock Propagation · yfinance Live Verified
      </p>
    </div>
  );
};
