import React, { useState } from "react";
import { FinGraphScenario } from "../types";
import { 
  Network, 
  GitFork, 
  ShieldCheck, 
  ChevronDown, 
  ExternalLink 
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

  // Compute dynamic category breakdown for identified entities
  const sectorCount = scenario.radialNodes.filter((n) => n.category === "sector").length;
  const macroCount = scenario.radialNodes.filter(
    (n) => n.category === "economic_variable" || n.category === "commodity"
  ).length + 1; // including center node
  const companyTickersCount = scenario.radialNodes.reduce(
    (acc, n) => acc + (n.tickers?.length || 0),
    0
  );

  return (
    <div className="flex flex-col gap-2.5 pt-0">
      {/* ─── SCENARIO HERO TITLE & SELECTOR ROW (DESIGN.MD SPEC) ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[#141414] font-sans">
            {scenario.title}
          </h1>

          {/* Stadium Pill Scenario Indicator */}
          <span className="px-3 py-1 rounded-full bg-[#f0f4ff] text-[#0066ff] border border-[#dbeafe] text-[11px] font-semibold tracking-wide uppercase font-mono">
            Live Scenario
          </span>

          {/* Catalyst Switcher Dropdown (Stadium Pill) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
              className="h-8 px-3.5 rounded-full border border-[#e0e0e0] bg-white hover:bg-[#f3f3f3] flex items-center gap-2 text-[12.5px] font-medium text-[#141414] transition-all cursor-pointer shadow-2xs"
            >
              <span className="max-w-[260px] truncate">{scenario.dropdownLabel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#707070]" />
            </button>

            {isScenarioDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 rounded-[20px] bg-white border border-[#e0e0e0] shadow-xl py-2 z-50 text-[13px] animate-in fade-in zoom-in-95 duration-150">
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
        <div className="flex items-center gap-2 text-[12px] text-[#707070] font-medium">
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

      {/* Narrative Subtitle */}
      <p className="text-[13px] text-[#707070] font-normal leading-relaxed truncate" title={scenario.narrative}>
        {scenario.narrative}
      </p>

      {/* ─── 3 KPI CARDS (STRICT DESIGN.MD SPEC: 24PX GEOMETRY, 1PX HAIRLINES, STADIUM PILLS) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Entities Identified */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-[24px] bg-white border border-[#e5e7eb] hover:border-[#141414]/30 hover:bg-[#fafafa] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 rounded-[16px] bg-[#f0f4ff] border border-[#dbeafe] flex items-center justify-center text-[#0066ff] shrink-0">
              <Network className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5 leading-none">
                <span className="text-lg font-bold text-[#141414] font-sans tracking-tight">
                  {scenario.entitiesCount}
                </span>
                <span className="text-[12px] font-semibold text-[#141414]">
                  Entities Identified
                </span>
              </div>
              <span className="text-[10px] text-[#707070] font-normal mt-0.5">
                {sectorCount} Sectors · {macroCount} Macro · {companyTickersCount || 6} Equities
              </span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#f0f4ff] text-[#0066ff] border border-[#dbeafe] font-mono text-[9.5px] font-semibold shrink-0">
            GRAPH
          </span>
        </div>

        {/* Metric 2: Propagation Pathways */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-[24px] bg-white border border-[#e5e7eb] hover:border-[#141414]/30 hover:bg-[#fafafa] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 rounded-[16px] bg-[#f5f3ff] border border-[#ede9fe] flex items-center justify-center text-[#6366f1] shrink-0">
              <GitFork className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5 leading-none">
                <span className="text-lg font-bold text-[#141414] font-sans tracking-tight">
                  {scenario.pathwaysCount}
                </span>
                <span className="text-[12px] font-semibold text-[#141414]">
                  Propagation Pathways
                </span>
              </div>
              <span className="text-[10px] text-[#707070] font-normal mt-0.5">
                Direct & 2nd Order · 3-Hop BFS
              </span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] font-mono text-[9.5px] font-semibold flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dc2626] animate-pulse" />
            ACTIVE
          </span>
        </div>

        {/* Metric 3: Evidence Sources */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-[24px] bg-white border border-[#e5e7eb] hover:border-[#141414]/30 hover:bg-[#fafafa] transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 rounded-[16px] bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center text-[#16a34a] shrink-0">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5 leading-none">
                <span className="text-lg font-bold text-[#141414] font-sans tracking-tight">
                  {scenario.evidenceCount}
                </span>
                <span className="text-[12.5px] font-semibold text-[#141414]">
                  Evidence Sources
                </span>
              </div>
              <span className="text-[10px] text-[#707070] font-normal mt-0.5">
                Reuters Telemetry · 12 Empirical Citations
              </span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#f0fdf4] text-[#16a34a] border border-[#dcfce7] font-mono text-[9.5px] font-semibold shrink-0">
            94% CONF
          </span>
        </div>
      </div>
    </div>
  );
};
