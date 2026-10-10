import React from "react";
import { SimulationResponse } from "../types";
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
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#707070] border-l border-[#e0e0e0] bg-[#ffffff]">
        <div className="w-10 h-10 rounded-full bg-[#f3f3f3] flex items-center justify-center text-[#141414] mb-3">
          <Zap className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-[#141414]">No Active Propagation</h3>
        <p className="text-xs text-[#707070] mt-1.5 max-w-xs leading-relaxed">
          Select an app or benchmark scenario above, or type an event to trace how financial shocks cascade across markets.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#ffffff] border-l border-[#e0e0e0] text-[#141414] overflow-hidden w-full lg:w-96 select-none">
      {/* Event Header Banner */}
      <div className="p-5 border-b border-[#e0e0e0] bg-[#ffffff]">
        <div className="flex items-center justify-between text-xs font-sans mb-1.5">
          <span className="font-semibold text-[#0066ff] uppercase tracking-wider text-[11px]">
            {simulation.event_type}
          </span>
          <span className="bg-[#141414] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
            Severity {simulation.severity}/10
          </span>
        </div>

        <h3 className="text-base font-bold text-[#141414] leading-snug">
          {simulation.headline}
        </h3>

        <p className="text-xs text-[#707070] mt-2.5 leading-relaxed bg-[#f3f3f3] p-3 rounded-[16px]">
          {simulation.summary}
        </p>

        {devilsAdvocate && (
          <div className="mt-3 bg-[#f3f3f3] border border-[#e0e0e0] p-3 rounded-[16px] text-xs text-[#262626]">
            <div className="flex items-center gap-1.5 font-bold text-[#141414] text-xs mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-[#0066ff]" />
              <span>Devil's Advocate Analysis</span>
            </div>
            <p className="text-[11px] text-[#707070] leading-relaxed">
              Companies maintain 30-90 days of inventory buffers, foreign exchange forward contracts, and commodity hedging hedges that often delay or dampen secondary transmission impacts.
            </p>
          </div>
        )}
      </div>

      {/* Ordered Transmission Path List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-sans text-[#707070] pb-1 border-b border-[#f0f0f0]">
          <span className="font-semibold text-[#141414]">Propagation Chain</span>
          <span>{simulation.propagation_paths.length} Steps</span>
        </div>

        {simulation.propagation_paths.map((step, idx) => {
          const isNegative = step.sentiment < 0;

          return (
            <div
              key={idx}
              className="bg-[#ffffff] border border-[#e0e0e0] hover:border-[#adadad] p-3.5 rounded-[16px] transition-all"
            >
              {/* Hop Badge & Route */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[10px] font-sans font-bold bg-[#f3f3f3] text-[#141414] px-2 py-0.5 rounded-full border border-[#e0e0e0]">
                  Hop {step.hop}
                </span>

                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <button
                    onClick={() => onSelectNodeById(step.source_id)}
                    className="hover:underline hover:text-[#0066ff] text-[#262626] truncate max-w-[100px] cursor-pointer"
                  >
                    {step.source_name}
                  </button>
                  <ArrowRight className="w-3 h-3 text-[#adadad] shrink-0" />
                  <button
                    onClick={() => onSelectNodeById(step.target_id)}
                    className="hover:underline hover:text-[#0066ff] text-[#141414] font-bold truncate max-w-[110px] cursor-pointer"
                  >
                    {step.target_name}
                  </button>
                </div>
              </div>

              {/* Impact Magnitude Bar */}
              <div className="my-2">
                <div className="flex justify-between text-[11px] font-sans mb-1">
                  <span className="text-[#707070]">Shock Magnitude:</span>
                  <span className={isNegative ? "text-[#ef4444] font-bold" : "text-[#10b981] font-bold"}>
                    {step.impact}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isNegative ? "bg-[#ef4444]" : "bg-[#10b981]"
                    }`}
                    style={{ width: `${Math.min(100, step.impact)}%` }}
                  />
                </div>
              </div>

              {/* Transmission Mechanism Explanation */}
              <p className="text-[11px] text-[#262626] leading-relaxed mt-2 pt-2 border-t border-[#f0f0f0]">
                {step.explanation}
              </p>

              {/* Confidence & Channel details */}
              <div className="flex items-center justify-between text-[10px] font-sans text-[#707070] mt-2">
                <span>Channel: {step.relation}</span>
                <span className="font-semibold text-[#141414]">
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
