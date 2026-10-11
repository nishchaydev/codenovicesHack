import React, { useEffect, useState } from "react";
import { Activity, ArrowRight, Zap, Globe2, TrendingUp, ShieldAlert, Sparkles } from "lucide-react";
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
    <div className="flex flex-col items-center justify-start min-h-full gap-8 px-4 sm:px-8 pt-4 pb-12 text-center max-w-5xl mx-auto w-full">
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

      {/* Risk Gauge + Stats row */}
      <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        {/* Gauge Card */}
        <div className="flex flex-col items-center shrink-0">
          <svg width="260" height="150" viewBox="0 0 260 150" className="overflow-visible">
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

            {/* Background Track */}
            <path
              d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="15"
              strokeLinecap="round"
            />

            {/* Colored Active Progress Arc */}
            {riskIndex > 0 && (
              <path
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="15"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
              />
            )}

            {/* Glowing Tip Indicator Dot */}
            {riskIndex > 0 && (
              <g filter="url(#needleGlow)">
                <circle cx={tipX} cy={tipY} r="8" fill="#ffffff" stroke={riskColor} strokeWidth="3" />
                <circle cx={tipX} cy={tipY} r="3.5" fill={riskColor} />
              </g>
            )}

            {/* Center Value */}
            <text
              x={cx}
              y={cy - 16}
              textAnchor="middle"
              fontSize="40"
              fontWeight="900"
              fill={riskColor}
              fontFamily="monospace"
              className="tracking-tight"
            >
              {riskIndex}
            </text>

            {/* Risk Subtitle */}
            <text
              x={cx}
              y={cy + 8}
              textAnchor="middle"
              fontSize="10"
              fill={riskIndex > 70 ? "#dc2626" : "#64748b"}
              fontWeight="800"
              letterSpacing="0.06em"
            >
              {riskLabel.toUpperCase()}
            </text>

            {/* Scale Endpoints */}
            <text x={cx - r} y={cy + 22} textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="600">
              0
            </text>
            <text x={cx + r} y={cy + 22} textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="600">
              100
            </text>
          </svg>

          {/* Stress Meter Badge Underneath (No Overlap) */}
          <div className="flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200/60 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span>Real-Time Systemic Stress Gauge</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {[
            { icon: <Zap className="w-4 h-4 text-rose-500" />, value: `${activeShocks} Shocks`, label: "Active Contagions", desc: "Energy & Supply Chains" },
            { icon: <Globe2 className="w-4 h-4 text-blue-500" />, value: `${sectorsAffected} Sectors`, label: "Impacted Sectors", desc: "Chemicals, Auto, Airlines" },
            { icon: <Activity className="w-4 h-4 text-emerald-500" />, value: "25 Nodes", label: "Causal Graph Entities", desc: "30+ Interdependent Edges" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col p-4 rounded-2xl bg-slate-50/70 border border-slate-100 text-left gap-1">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                {s.icon}
                <span className="text-[11px] font-bold text-slate-600 uppercase font-mono">{s.label}</span>
              </div>
              <div className="text-xl font-bold text-slate-900 font-mono">{s.value}</div>
              <div className="text-[11px] text-slate-500 leading-tight">{s.desc}</div>
            </div>
          ))}
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
