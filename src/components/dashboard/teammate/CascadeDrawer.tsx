import React from "react";
import { SimulationResponse } from "@/types/fingraph/types";
import { ArrowRight, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";

interface CascadeDrawerProps {
  simulation: SimulationResponse | null;
  devilsAdvocate: boolean;
  onSelectNodeById: (id: string) => void;
}

export const CascadeDrawer: React.FC<CascadeDrawerProps> = ({
  simulation,
  devilsAdvocate,
  onSelectNodeById,
}) => {
  if (!simulation) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[var(--text-secondary)] border-l border-[var(--clay-border)] clay-surface">
        <div className="w-10 h-10 rounded-full clay-inset flex items-center justify-center text-[var(--text-primary)] mb-3">
          <Zap className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">No Active Propagation</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-1.5 max-w-xs leading-relaxed">
          Select an app or benchmark scenario above, or type an event to trace how financial shocks cascade across markets.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col clay-surface border-l border-[var(--clay-border)] text-[var(--text-primary)] overflow-hidden w-full lg:w-96 select-none">
      {/* Event Header Banner */}
      <div className="p-5 border-b border-[var(--clay-border)] clay-surface">
        <div className="flex items-center justify-between text-xs font-sans mb-1.5">
          <span className="font-semibold text-[var(--accent-primary)] uppercase tracking-wider text-[11px]">
            {simulation.event_type}
          </span>
          <span className="clay-button-primary text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
            Severity {simulation.severity}/10
          </span>
        </div>

        <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug">
          {simulation.headline}
        </h3>

        <p className="text-xs text-[var(--text-secondary)] mt-2.5 leading-relaxed clay-inset p-3 rounded-[16px]">
          {simulation.summary}
        </p>

        {devilsAdvocate && (
          <div className="mt-3 clay-inset border border-[var(--clay-border)] p-3 rounded-[16px] text-xs text-[var(--text-primary)]">
            <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)] text-xs mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Devil's Advocate Analysis</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Companies maintain 30-90 days of inventory buffers, foreign exchange forward contracts, and commodity hedging hedges that often delay or dampen secondary transmission impacts.
            </p>
          </div>
        )}
      </div>

      {/* Ordered Transmission Path List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-sans text-[var(--text-secondary)] pb-1 border-b border-[var(--clay-border)]">
          <span className="font-semibold text-[var(--text-primary)]">Propagation Chain</span>
          <span>{simulation.propagation_paths.length} Steps</span>
        </div>

        {simulation.propagation_paths.map((step, idx) => {
          const isNegative = step.sentiment < 0;

          return (
            <div
              key={idx}
              className="clay-surface border border-[var(--clay-border)] hover:border-[#adadad] p-3.5 rounded-[16px] transition-all"
            >
              {/* Hop Badge & Route */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[10px] font-sans font-bold clay-inset text-[var(--text-primary)] px-2 py-0.5 rounded-full border border-[var(--clay-border)]">
                  Hop {step.hop}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <button
                    onClick={() => onSelectNodeById(step.source_id)}
                    className="hover:underline hover:text-[var(--accent-primary)] text-[var(--text-primary)] truncate max-w-[100px] cursor-pointer"
                  >
                    {step.source_name}
                  </button>
                  <ArrowRight className="w-3 h-3 text-[#adadad] shrink-0" />
                  <button
                    onClick={() => onSelectNodeById(step.target_id)}
                    className="hover:underline hover:text-[var(--accent-primary)] text-[var(--text-primary)] font-bold truncate max-w-[110px] cursor-pointer"
                  >
                    {step.target_name}
                  </button>
                </div>
              </div>

              {/* Impact Magnitude Bar */}
              <div className="my-2">
                <div className="flex justify-between text-[11px] font-sans mb-1">
                  <span className="text-[var(--text-secondary)]">Shock Magnitude:</span>
                  <span className={isNegative ? "text-[#ef4444] font-bold" : "text-[#10b981] font-bold"}>
                    {step.impact}
                  </span>
                </div>
                <div className="w-full h-1.5 clay-inset rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isNegative ? "bg-[#ef4444]" : "bg-[#10b981]"
                    }`}
                    style={{ width: `${Math.min(100, step.impact)}%` }}
                  />
                </div>
              </div>

              {/* Transmission Mechanism Explanation */}
              <p className="text-[11px] text-[var(--text-primary)] leading-relaxed mt-2 pt-2 border-t border-[var(--clay-border)]">
                {step.explanation}
              </p>

              {/* Confidence & Channel details */}
              <div className="flex items-center justify-between text-[10px] font-sans text-[var(--text-secondary)] mt-2">
                <span>Channel: {step.relation}</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {Math.round(step.confidence * 100)}% Confidence
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

