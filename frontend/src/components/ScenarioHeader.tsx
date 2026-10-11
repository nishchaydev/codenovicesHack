import React, { useState } from "react";
import { FinGraphScenario } from "../types";

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

  return (
    <div className="flex flex-col gap-5 pt-2">
      {/* Title, Dropdown, Narrative & Source */}
      <div className="flex flex-col gap-2">
        {/* Row 1: Title, Scenario Badge & Dropdown Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">
              {scenario.title}
            </h1>

            {/* Scenario Badge Pill */}
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/80 text-[12px] font-semibold">
              Scenario
            </span>

            {/* Scenario Dropdown Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsScenarioDropdownOpen(!isScenarioDropdownOpen)}
                className="h-8 px-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5 text-[12.5px] font-medium text-slate-700 shadow-2xs transition-colors"
              >
                <span className="max-w-[260px] truncate">{scenario.dropdownLabel}</span>
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isScenarioDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-40 text-[13px]">
                  <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Active Catalyst
                  </div>
                  {scenariosList.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => {
                        onSelectScenario(sc);
                        setIsScenarioDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-slate-50 flex flex-col gap-0.5 transition-colors ${
                        sc.id === scenario.id ? "bg-blue-50/70 text-blue-700 font-semibold" : "text-slate-800"
                      }`}
                    >
                      <span className="text-[13px]">{sc.title}</span>
                      <span className="text-[11px] text-slate-500 font-normal truncate">{sc.dropdownLabel}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Meta Date & Source */}
          <div className="flex items-center gap-2 text-[12px] text-slate-500 font-medium">
            <span>{scenario.date}</span>
            <span>•</span>
            <a
              href={scenario.sourceUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              <span>Source: {scenario.source}</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* Narrative Subtitle */}
        <p className="text-[14px] text-slate-600 font-normal leading-relaxed">
          {scenario.narrative}
        </p>
      </div>

      {/* Row 2: Three Stat KPI Cards - Apple Glass Styling */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Card 1: Entities identified */}
        <div className="p-4 rounded-3xl apple-glass-card border border-white/85 flex items-center gap-3.5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:border-blue-200 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#007AFF] shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
              {scenario.entitiesCount}
            </span>
            <span className="text-[12.5px] font-semibold text-slate-800 leading-tight">
              Entities identified
            </span>
            <span className="text-[11px] text-slate-500 leading-tight mt-0.5">
              Commodities, sectors, companies
            </span>
          </div>
        </div>

        {/* Card 2: Propagation pathways */}
        <div className="p-4 rounded-3xl apple-glass-card border border-white/85 flex items-center gap-3.5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:border-indigo-200 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <circle cx="6" cy="6" r="3" />
              <circle cx="18" cy="8" r="3" />
              <circle cx="12" cy="18" r="3" />
              <path d="M8.5 7.5L15.5 7.5" />
              <path d="M7.5 8.5L10.5 15.5" />
              <path d="M16.5 8.5L13.5 15.5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
              {scenario.pathwaysCount}
            </span>
            <span className="text-[12.5px] font-semibold text-slate-800 leading-tight">
              Propagation pathways
            </span>
            <span className="text-[11px] text-slate-500 leading-tight mt-0.5">
              Direct and indirect
            </span>
          </div>
        </div>

        {/* Card 3: Evidence sources */}
        <div className="p-4 rounded-3xl apple-glass-card border border-white/85 flex items-center gap-3.5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:border-emerald-200 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
              {scenario.evidenceCount}
            </span>
            <span className="text-[12.5px] font-semibold text-slate-800 leading-tight">
              Evidence sources
            </span>
            <span className="text-[11px] text-slate-500 leading-tight mt-0.5">
              News, reports, historical data
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
