import React, { useState } from "react";
import { Activity, RefreshCw, Zap, ShieldAlert, Search } from "lucide-react";

interface HeaderProps {
  nodeCount: number;
  linkCount: number;
  activeShockEvent: string | null;
  onReset: () => void;
  onSimulateCustom: (text: string) => void;
  isLoading: boolean;
  devilsAdvocate: boolean;
  onToggleDevilsAdvocate: () => void;
  viewMode: "all" | "single";
  onChangeViewMode: (mode: "all" | "single") => void;
}

export const Header: React.FC<HeaderProps> = ({
  nodeCount,
  linkCount,
  activeShockEvent,
  onReset,
  onSimulateCustom,
  isLoading,
  devilsAdvocate,
  onToggleDevilsAdvocate,
  viewMode,
  onChangeViewMode,
}) => {
  const [headlineInput, setHeadlineInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headlineInput.trim()) return;
    onSimulateCustom(headlineInput.trim());
  };

  return (
    <header className="w-full bg-[#ffffff] border-b border-[#e0e0e0] px-5 py-3 flex flex-col md:flex-row items-center justify-between gap-3 sticky top-0 z-30 select-none">
      {/* Brand & Mode Toggle */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2.5">
          {/* Logo icon pill */}
          <div className="w-8 h-8 rounded-lg bg-[#111111] text-[#f5f1ec] flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
            FD
          </div>
          <div>
            <h1 className="font-sans font-bold text-base tracking-tight text-[#111111] leading-none">
              Fin.D
            </h1>
            <span className="text-[11px] text-[#7b7b78] font-sans font-normal">
              Market Impact & Transmission
            </span>
          </div>
        </div>

        {/* Segmented Mode Control Pill */}
        <div className="bg-[#f3f3f3] p-1 rounded-full flex items-center gap-1 border border-[#e0e0e0]">
          <button
            type="button"
            onClick={() => onChangeViewMode("all")}
            className={`text-xs px-3 py-1 rounded-full transition-all cursor-pointer font-medium ${
              viewMode === "all"
                ? "bg-white text-[#141414] shadow-sm font-semibold"
                : "text-[#707070] hover:text-[#141414]"
            }`}
          >
            All Markets
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode("single")}
            className={`text-xs px-3 py-1 rounded-full transition-all cursor-pointer font-medium ${
              viewMode === "single"
                ? "bg-white text-[#141414] shadow-sm font-semibold"
                : "text-[#707070] hover:text-[#141414]"
            }`}
          >
            Single App Focus
          </button>
        </div>

        {/* Metrics Counter Badge */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-sans text-[#707070]">
          <span className="bg-[#f3f3f3] px-2.5 py-1 rounded-full text-[11px] border border-[#e0e0e0]">
            <strong className="text-[#141414]">{nodeCount}</strong> Assets
          </span>
          <span className="bg-[#f3f3f3] px-2.5 py-1 rounded-full text-[11px] border border-[#e0e0e0]">
            <strong className="text-[#141414]">{linkCount}</strong> Channels
          </span>
          {activeShockEvent && (
            <span className="bg-[#f3f3f3] text-[#ef4444] border border-[#e0e0e0] px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-ping" />
              Active Shock
            </span>
          )}
        </div>
      </div>

      {/* Center Search / Catalyst Stadium Input */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-xl w-full flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707070]">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={headlineInput}
            onChange={(e) => setHeadlineInput(e.target.value)}
            placeholder="Simulate event: e.g. Crude oil rises 12% on surprise OPEC+ cuts..."
            disabled={isLoading}
            className="w-full bg-[#f0f0f0] border-none text-xs text-[#141414] placeholder:text-[#adadad] pl-9 pr-4 py-2.5 rounded-full font-sans focus:outline-none focus:ring-2 focus:ring-[#141414] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !headlineInput.trim()}
          className="bg-[#141414] hover:bg-[#262626] disabled:opacity-40 text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm active:scale-98"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>{isLoading ? "Tracing..." : "Propagate"}</span>
        </button>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        {/* Devil's Advocate Toggle */}
        <button
          type="button"
          onClick={onToggleDevilsAdvocate}
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border transition-all cursor-pointer font-medium ${
            devilsAdvocate
              ? "bg-[#141414] text-white border-[#141414]"
              : "bg-white text-[#707070] border-[#e0e0e0] hover:text-[#141414] hover:bg-[#f3f3f3]"
          }`}
          title="Toggle Devil's Advocate counter-theses and uncertainty analysis"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Devil's Advocate</span>
        </button>

        {/* Reset Button */}
        <button
          type="button"
          onClick={onReset}
          className="bg-white hover:bg-[#f3f3f3] border border-[#e0e0e0] text-[#141414] px-3.5 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Reset Graph to clean state"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
};
