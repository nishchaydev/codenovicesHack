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
  Globe2,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface ScenarioHeaderProps {
  scenario: FinGraphScenario;
  scenariosList: FinGraphScenario[];
  onSelectScenario: (scenario: FinGraphScenario) => void;
}

export const ScenarioHeader: React.FC<ScenarioHeaderProps> = ({
  scenario,
  scenariosList,
  onSelectScenario,
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
          <a
            href={scenario.sourceUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#707070] hover:text-[#0066ff] flex items-center gap-1 transition-colors"
          >
            <span>Source: {scenario.source}</span>
            <ExternalLink className="w-3 h-3 text-[#adadad] hover:text-[#0066ff]" />
          </a>
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
                <span className="text-red-600 font-bold font-mono shrink-0">Crude {scenario.centerNode.metric}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCollisionExpanded(!isCollisionExpanded)}
              className="px-2.5 py-1 rounded-full bg-white/90 hover:bg-white border border-amber-300 text-amber-900 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              <span>{isCollisionExpanded ? "Hide Genesis Details" : "Why This Happened"}</span>
              {isCollisionExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Expanded Genesis Breakdown */}
          {isCollisionExpanded && (
            <div className="mt-3 pt-3 border-t border-amber-200/60 grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in duration-150">
              {/* Catalyst A Card */}
              <div className="p-3 rounded-[14px] bg-white/90 border border-amber-100 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                    <span>{collision.catalystA.flag}</span>
                    <span>Catalyst 1: Physical Supply Choke</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{collision.catalystA.source}</span>
                </div>
                <p className="text-[11.5px] text-slate-700 leading-relaxed">
                  {collision.catalystA.summary}
                </p>
              </div>

              {/* Catalyst B Card */}
              <div className="p-3 rounded-[14px] bg-white/90 border border-blue-100 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-800 flex items-center gap-1">
                    <span>{collision.catalystB.flag}</span>
                    <span>Catalyst 2: US Secondary Sanctions</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{collision.catalystB.source}</span>
                </div>
                <p className="text-[11.5px] text-slate-700 leading-relaxed">
                  {collision.catalystB.summary}
                </p>
              </div>

              {/* Collision Mechanism */}
              <div className="md:col-span-2 p-2.5 rounded-[14px] bg-rose-50/80 border border-rose-200/80 flex flex-col gap-1.5">
                <div className="text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-600" />
                  <span>Causal Collision Intersection: {collision.collisionPoint}</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  {collision.collisionMechanism}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10.5px] text-slate-600 font-medium">
                  {collision.causalFlow.map((step, idx) => (
                    <span key={idx} className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-md border border-rose-100">
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

      {/* ─── ROW 3: COMPACT AESTHETIC 3 KPI METRICS (STRICT DESIGN.MD: 24PX GEOMETRY, NO WASTED SPACE) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Metric 1: Entities Identified */}
        <div className="flex items-center justify-between px-3.5 py-1.5 rounded-[20px] bg-white border border-[#e5e7eb] hover:border-[#141414]/30 hover:bg-[#fafafa] transition-all">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[14px] bg-[#f0f4ff] border border-[#dbeafe] flex items-center justify-center text-[#0066ff] shrink-0">
              <Network className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="text-base font-bold text-[#141414] font-sans tracking-tight">
                {scenario.entitiesCount}
              </span>
              <span className="text-[11.5px] font-semibold text-[#141414]">
                Entities Identified
              </span>
              <span className="text-[10px] text-[#707070] font-normal hidden xl:inline">
                ({sectorCount} Sectors · {macroCount} Macro · {companyTickersCount || 6} Equities)
              </span>
            </div>
          </div>
          <span className="px-2 py-0.2 rounded-full bg-[#f0f4ff] text-[#0066ff] border border-[#dbeafe] font-mono text-[9px] font-semibold shrink-0">
            GRAPH
          </span>
        </div>

        {/* Metric 2: Propagation Pathways */}
        <div className="flex items-center justify-between px-3.5 py-1.5 rounded-[20px] bg-white border border-[#e5e7eb] hover:border-[#141414]/30 hover:bg-[#fafafa] transition-all">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[14px] bg-[#f5f3ff] border border-[#ede9fe] flex items-center justify-center text-[#6366f1] shrink-0">
              <GitFork className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="text-base font-bold text-[#141414] font-sans tracking-tight">
                {scenario.pathwaysCount}
              </span>
              <span className="text-[11.5px] font-semibold text-[#141414]">
                Propagation Pathways
              </span>
              <span className="text-[10px] text-[#707070] font-normal hidden xl:inline">
                (Direct & 2nd Order · 3-Hop BFS)
              </span>
            </div>
          </div>
          <span className="px-2 py-0.2 rounded-full bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] font-mono text-[9px] font-semibold flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-pulse" />
            ACTIVE
          </span>
        </div>

        {/* Metric 3: Evidence Sources */}
        <div className="flex items-center justify-between px-3.5 py-1.5 rounded-[20px] bg-white border border-[#e5e7eb] hover:border-[#141414]/30 hover:bg-[#fafafa] transition-all">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[14px] bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center text-[#16a34a] shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="text-base font-bold text-[#141414] font-sans tracking-tight">
                {scenario.evidenceCount}
              </span>
              <span className="text-[11.5px] font-semibold text-[#141414]">
                Evidence Sources
              </span>
              <span className="text-[10px] text-[#707070] font-normal hidden xl:inline">
                (Terminal Telemetry · 12 Citations)
              </span>
            </div>
          </div>
          <span className="px-2 py-0.2 rounded-full bg-[#f0fdf4] text-[#16a34a] border border-[#dcfce7] font-mono text-[9px] font-semibold shrink-0">
            94% CONF
          </span>
        </div>
      </div>
    </div>
  );
};
