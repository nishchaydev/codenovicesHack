import React, { useState } from "react";
import { FinGraphScenario } from "../types";
import { 
  Network, 
  GitFork, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  Flame,
  Sparkles,
  ArrowRight,
  Compass
} from "lucide-react";

interface ScenarioHeaderProps {
  scenario: FinGraphScenario;
  scenariosList: FinGraphScenario[];
  onSelectScenario: (scenario: FinGraphScenario) => void;
  canvasViewMode?: "radial" | "fingraph_dag";
  onCanvasViewModeChange?: (mode: "radial" | "fingraph_dag") => void;
}

export const ScenarioHeader: React.FC<ScenarioHeaderProps> = ({
  scenario,
  scenariosList,
  onSelectScenario,
  canvasViewMode = "radial",
  onCanvasViewModeChange,
}) => {
  const [isScenarioDropdownOpen, setIsScenarioDropdownOpen] = useState(false);
  const [isCollisionExpanded, setIsCollisionExpanded] = useState(false);

  // Compute dynamic category breakdown for identified entities
  const sectorCount = scenario.radialNodes.filter((n) => n.category === "sector").length;
  const macroCount = scenario.radialNodes.filter(
    (n) => n.category === "economic_variable" || n.category === "commodity"
  ).length + 1; // including center node
  const companyTickersCount = scenario.radialNodes.reduce(
    (acc, n) => acc + (n.tickers?.length || 0),
    0
  );

  const collision = scenario.collidingEvent;

  return (
    <div className="flex flex-col gap-2 pt-0 shrink-0">
      {/* ─── ROW 1: TITLE, CATALYST SWITCHER & METADATA ─── */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141414] font-sans">
            {scenario.title}
          </h1>

          {/* Stadium Pill Live Scenario Badge */}
          <span className="px-2.5 py-0.5 rounded-full bg-[#f0f4ff] text-[#0066ff] border border-[#dbeafe] text-[10.5px] font-semibold tracking-wide uppercase font-mono">
            Live Scenario
          </span>

          {/* Catalyst Switcher Dropdown (Stadium Pill) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
              className="h-7.5 px-3 rounded-full border border-[#e0e0e0] bg-white hover:bg-[#f3f3f3] flex items-center gap-1.5 text-[12px] font-medium text-[#141414] transition-all cursor-pointer shadow-2xs"
            >
              <span className="max-w-[240px] truncate">{scenario.dropdownLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#707070]" />
            </button>

            {isScenarioDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-80 rounded-[20px] bg-white border border-[#e0e0e0] shadow-xl py-2 z-50 text-[13px] animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#adadad]">
                  Switch Active Catalyst
                </div>
                {scenariosList.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      onSelectScenario(sc);
                      setIsScenarioDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left hover:bg-[#f3f3f3] flex flex-col gap-0.5 transition-colors cursor-pointer ${
                      sc.id === scenario.id
                        ? "bg-[#f0f4ff] text-[#0066ff] font-semibold"
                        : "text-[#141414]"
                    }`}
                  >
                    <span className="text-[12.5px] font-semibold">{sc.title}</span>
                    <span className="text-[11px] text-[#707070] font-normal truncate">
                      {sc.dropdownLabel}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Meta Date & Source */}
        <div className="flex items-center gap-2 text-[11.5px] text-[#707070] font-medium">
          <span className="font-mono text-[#adadad]">{scenario.date}</span>
          <span>•</span>
          {scenario.sourceUrl ? (
            <a
              href={scenario.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#707070] hover:text-[#0066ff] flex items-center gap-1 transition-colors"
            >
              <span>Source: {scenario.source}</span>
              <ExternalLink className="w-3 h-3 text-[#adadad] hover:text-[#0066ff]" />
            </a>
          ) : (
            <span className="text-[#707070] flex items-center gap-1">
              <span>Source: {scenario.source}</span>
            </span>
          )}
        </div>
      </div>

      {/* ─── ROW 2: COLLIDING EVENTS & GENESIS ENGINE (WHY THIS HAPPENED) ─── */}
      {collision ? (
        <div className="rounded-[18px] bg-gradient-to-r from-amber-50/70 via-rose-50/60 to-blue-50/70 border border-amber-200/80 p-2.5 transition-all shadow-2xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-mono text-[10px] font-bold tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                COLLIDING CATALYSTS
              </span>
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#141414] truncate">
                <span className="truncate">{collision.catalystA.flag} {collision.catalystA.title}</span>
                <span className="text-amber-600 font-extrabold text-sm">×</span>
                <span className="truncate">{collision.catalystB.flag} {collision.catalystB.title}</span>
                <span className="text-slate-400">──▶</span>
                <span className={`px-2 py-0.5 rounded-md font-bold font-mono text-[10.5px] border shrink-0 ${
                  scenario.centerNode.metricColor === "green" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}>
                  {scenario.centerNode.title} • {scenario.centerNode.metric}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCollisionExpanded(!isCollisionExpanded)}
              className="px-3 py-1 rounded-full bg-white hover:bg-amber-50/80 border border-amber-300/90 text-amber-900 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              <span>{isCollisionExpanded ? "Hide Genesis Analysis" : "Why This Happened"}</span>
              {isCollisionExpanded ? <ChevronUp className="w-3.5 h-3.5 text-amber-700" /> : <ChevronDown className="w-3.5 h-3.5 text-amber-700" />}
            </button>
          </div>

          {/* Expanded Genesis Breakdown */}
          {isCollisionExpanded && (
            <div className="mt-3 pt-3 border-t border-amber-200/60 grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in duration-150">
              {/* Catalyst A Card */}
              <div className="p-3 rounded-[14px] bg-white/90 border border-amber-100 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                    <span>{collision.catalystA.flag}</span>
                    <span>Catalyst A: {collision.catalystA.title}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{collision.catalystA.source}</span>
                </div>
                <p className="text-[11.5px] text-slate-700 leading-relaxed">
                  {collision.catalystA.summary}
                </p>
              </div>

              {/* Catalyst B Card */}
              <div className="p-3 rounded-[14px] bg-white/90 border border-blue-100 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-800 flex items-center gap-1">
                    <span>{collision.catalystB.flag}</span>
                    <span>Catalyst B: {collision.catalystB.title}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{collision.catalystB.source}</span>
                </div>
                <p className="text-[11.5px] text-slate-700 leading-relaxed">
                  {collision.catalystB.summary}
                </p>
              </div>

              {/* Collision Mechanism */}
              <div className="md:col-span-2 p-3 rounded-[14px] bg-rose-50/80 border border-rose-200/80 flex flex-col gap-1.5">
                <div className="text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-600" />
                  <span>Causal Collision Intersection: {collision.collisionPoint}</span>
                </div>
                <p className="text-[11.5px] text-slate-700 leading-relaxed">
                  {collision.collisionMechanism}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10.5px] text-slate-600 font-medium">
                  {collision.causalFlow.map((step, idx) => (
                    <span key={idx} className="flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-md border border-rose-100 font-sans">
                      {step}
                      {idx < collision.causalFlow.length - 1 && <ArrowRight className="w-2.5 h-2.5 text-rose-400" />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-[12.5px] text-[#707070] font-normal leading-relaxed truncate" title={scenario.narrative}>
          {scenario.narrative}
        </p>
      )}

      {/* ─── ROW 3: COMPACT KPI BUTTON PILLS & VIEW MODE SWITCHER ─── */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric 1: Entities */}
          <div 
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-default"
            title={`${scenario.entitiesCount} Entities Identified (${sectorCount} Sectors · ${macroCount} Macro · ${companyTickersCount || 6} Equities)`}
          >
            <div className="w-5 h-5 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Network className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-slate-900 font-mono text-xs">{scenario.entitiesCount}</span>
              <span className="font-semibold text-slate-700 text-[11px]">Entities</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[9px] font-bold shrink-0">
              GRAPH
            </span>
          </div>

          {/* Metric 2: Pathways */}
          <div 
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-default"
            title={`${scenario.pathwaysCount} Propagation Pathways (Direct & 2nd Order · 3-Hop BFS)`}
          >
            <div className="w-5 h-5 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <GitFork className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-slate-900 font-mono text-xs">{scenario.pathwaysCount}</span>
              <span className="font-semibold text-slate-700 text-[11px]">Pathways</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[9px] font-bold flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              ACTIVE
            </span>
          </div>

          {/* Metric 3: Evidence */}
          <div 
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-default"
            title={`${scenario.evidenceCount} Evidence Sources (Terminal Telemetry · 12 Citations)`}
          >
            <div className="w-5 h-5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-slate-900 font-mono text-xs">{scenario.evidenceCount}</span>
              <span className="font-semibold text-slate-700 text-[11px]">Sources</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[9px] font-bold shrink-0">
              94% CONF
            </span>
          </div>
        </div>

        {/* View Switcher in Row 3 directly above the canvas */}
        {onCanvasViewModeChange && (
          <div className="flex items-center rounded-xl bg-slate-900/5 p-1 border border-slate-300 shadow-2xs">
            <button
              type="button"
              onClick={() => onCanvasViewModeChange("radial")}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                canvasViewMode === "radial"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="View 360° Radial Transmission Topology"
            >
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Radial 360° Topology</span>
            </button>
            <button
              type="button"
              onClick={() => onCanvasViewModeChange("fingraph_dag")}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                canvasViewMode === "fingraph_dag"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-blue-700 hover:text-blue-900 hover:bg-blue-50"
              }`}
              title="View FinGraph Multi-Tier DAG Engine (Satyam)"
            >
              <GitFork className="w-3.5 h-3.5 text-cyan-400" />
              <span>FinGraph Flow Engine (DAG)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[9px] font-mono font-bold">
                NEW
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
