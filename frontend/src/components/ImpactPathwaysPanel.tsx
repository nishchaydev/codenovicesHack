import React, { useState } from "react";
import { FinGraphScenario, PathwayHop, EvidenceSource } from "../types";

interface ImpactPathwaysPanelProps {
  scenario: FinGraphScenario;
  selectedHop: PathwayHop | null;
  onSelectHop: (hop: PathwayHop) => void;
}

export const ImpactPathwaysPanel: React.FC<ImpactPathwaysPanelProps> = ({
  scenario,
  selectedHop,
  onSelectHop,
}) => {
  const [activeTab, setActiveTab] = useState<"pathways" | "evidence">("pathways");

  return (
    <aside className="w-96 shrink-0 bg-white border-l border-slate-200 h-full flex flex-col p-5 select-none z-10 overflow-y-auto">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          Impact pathways
        </h2>
        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>

      {/* Alert Banner: Potentially High Transmission */}
      <div className="mb-4 p-3.5 rounded-2xl bg-red-50/80 border border-red-200/90 flex items-start gap-3">
        <div className="text-red-500 shrink-0 mt-0.5">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-bold text-red-900 leading-tight">
            {scenario.transmissionRisk}
          </span>
          <span className="text-[12px] text-red-800 leading-snug">
            {scenario.transmissionRiskDetail}
          </span>
        </div>
      </div>

      {/* Evidence Strength Row */}
      <div className="mb-4 pb-4 border-b border-slate-100 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-slate-800 flex items-center gap-1">
            <span>Evidence strength</span>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
            {scenario.evidenceStrength}
          </span>
        </div>
        <span className="text-[11.5px] text-slate-500">
          {scenario.evidenceStrengthDetail}
        </span>
      </div>

      {/* Sub-Tabs: Pathways (Count) vs Evidence (Count) */}
      <div className="flex items-center gap-6 border-b border-slate-200 mb-4 text-[13.5px] font-semibold">
        <button
          onClick={() => setActiveTab("pathways")}
          className={`pb-2 transition-colors relative ${
            activeTab === "pathways"
              ? "text-blue-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Pathways ({scenario.pathways.length})</span>
          {activeTab === "pathways" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("evidence")}
          className={`pb-2 transition-colors relative ${
            activeTab === "evidence"
              ? "text-blue-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Evidence ({scenario.evidenceSources.length})</span>
          {activeTab === "evidence" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Content: Pathways List */}
      {activeTab === "pathways" && (
        <div className="flex flex-col gap-3">
          {scenario.pathways.map((hop) => {
            const isSelected = selectedHop?.hopNumber === hop.hopNumber;
            return (
              <div
                key={hop.hopNumber}
                onClick={() => onSelectHop(hop)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                  isSelected
                    ? "bg-blue-50/40 border-blue-400 shadow-xs ring-1 ring-blue-300"
                    : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
                }`}
              >
                {/* Header: Hop Title & Chevron */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-slate-900">
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      Hop {hop.hopNumber}
                    </span>
                    <span>{hop.source}</span>
                    <span className="text-slate-400">→</span>
                    <span>{hop.target}</span>
                  </div>
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Metric Pill & Timeframe */}
                <div className="flex items-center justify-between text-[11.5px]">
                  <span
                    className={`px-2 py-0.5 rounded-md font-semibold ${
                      hop.impactType === "Increases"
                        ? "bg-red-50 text-red-600 border border-red-200/80"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                    }`}
                  >
                    {hop.impactLabel}
                  </span>

                  <span className="flex items-center gap-1 text-slate-500 font-medium">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{hop.timeframe}</span>
                  </span>
                </div>

                {/* Explanation narrative */}
                <p className="text-[12px] text-slate-600 leading-relaxed font-normal">
                  {hop.explanation}
                </p>

                {/* Category & Evidence Grade Badges */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                    {hop.sector}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                      hop.badgeGradeType === "green"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                        : hop.badgeGradeType === "yellow"
                        ? "bg-amber-50 text-amber-800 border border-amber-200/70"
                        : "bg-blue-50 text-blue-700 border border-blue-200/70"
                    }`}
                  >
                    {hop.evidenceGrade}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content: Evidence Sources */}
      {activeTab === "evidence" && (
        <div className="flex flex-col gap-3">
          {scenario.evidenceSources.map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex flex-col gap-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold">
                  {ev.category}
                </span>
                <span>{ev.date}</span>
              </div>

              <h4 className="text-[12.5px] font-bold text-slate-900 leading-snug">
                {ev.title}
              </h4>

              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                {ev.summary}
              </p>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                <span className="text-slate-500 font-medium">
                  Source: <strong className="text-slate-700">{ev.source}</strong>
                </span>
                <span className="text-blue-600 font-semibold">
                  Relevance: {ev.relevanceScore}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};
