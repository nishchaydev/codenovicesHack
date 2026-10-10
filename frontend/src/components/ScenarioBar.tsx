import React from "react";
import { Scenario } from "../types";
import { Sparkles, Play, Flame } from "lucide-react";

interface ScenarioBarProps {
  scenarios: Scenario[];
  selectedScenarioId: string | null;
  onSelectScenario: (scenario: Scenario) => void;
  isLoading: boolean;
}

export const ScenarioBar: React.FC<ScenarioBarProps> = ({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  isLoading,
}) => {
  return (
    <div className="w-full bg-[#ffffff] border-b border-[#e0e0e0] px-4 py-2 flex items-center gap-2 overflow-x-auto select-none">
      <div className="flex items-center gap-1.5 text-xs text-[#707070] font-medium whitespace-nowrap pr-2 border-r border-[#e0e0e0]">
        <Sparkles className="w-3.5 h-3.5 text-[#141414]" />
        <span>Scenarios:</span>
      </div>

      <div className="flex items-center gap-2 flex-nowrap">
        {scenarios.map((s) => {
          const isSelected = s.id === selectedScenarioId;
          const isBenchmark = s.badge === "PS Benchmark";

          return (
            <button
              key={s.id}
              disabled={isLoading}
              onClick={() => onSelectScenario(s)}
              className={`group flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? "bg-[#141414] text-white border-[#141414] font-semibold"
                  : isBenchmark
                  ? "bg-[#ffffff] text-[#141414] border-[#0066ff] hover:bg-[#f3f3f3]"
                  : "bg-[#f3f3f3] text-[#262626] border-[#e0e0e0] hover:bg-[#e0e0e0] hover:text-[#141414]"
              }`}
            >
              <div className="flex items-center gap-1.5">
                {isBenchmark && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff]" />
                )}
                <span>{s.title}</span>
              </div>

              {isBenchmark && (
                <span className="text-[10px] font-sans font-semibold bg-[#0066ff] text-white px-2 py-0.2 rounded-full">
                  Benchmark
                </span>
              )}

              <Play className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
