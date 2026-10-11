import React, { useState } from "react";
import { FinGraphScenario, PathwayHop, EvidenceSource, RadialCardNode } from "../types";
import { 
  PanelRightClose, 
  PanelRightOpen, 
  Pin, 
  PinOff, 
  EyeOff, 
  GitFork, 
  ShieldCheck, 
  FileText, 
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Flame,
  Activity,
  Building2
} from "lucide-react";
import { motion } from "framer-motion";

interface ImpactPathwaysPanelProps {
  scenario: FinGraphScenario;
  selectedHop: PathwayHop | null;
  onSelectHop: (hop: PathwayHop) => void;
  onOpenStockDrilldown?: (node: RadialCardNode) => void;
}

export const ImpactPathwaysPanel: React.FC<ImpactPathwaysPanelProps> = ({
  scenario,
  selectedHop,
  onSelectHop,
  onOpenStockDrilldown,
}) => {
  const [open, setOpen] = useState(true);
  const [isPinned, setIsPinned] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [activeTab, setActiveTab] = useState<"pathways" | "evidence" | "citations">("pathways");

  // Aggregate all reference links from center node and radial nodes
  const allReferences: Array<{ nodeTitle: string; link: { title: string; url: string; publisher: string; date?: string } }> = [];
  if (scenario.centerNode?.refLinks) {
    scenario.centerNode.refLinks.forEach((link) => {
      allReferences.push({ nodeTitle: scenario.centerNode.title, link });
    });
  }
  scenario.radialNodes?.forEach((node) => {
    if (node.refLinks) {
      node.refLinks.forEach((link) => {
        allReferences.push({ nodeTitle: node.title, link });
      });
    }
  });

  const handleMouseEnter = () => {
    if (!isPinned && !isHidden) setOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isPinned && !isHidden) setOpen(false);
  };

  // State 1: Completely Hidden Mode (Restored via floating pill button)
  if (isHidden) {
    return (
      <button
        onClick={() => {
          setIsHidden(false);
          setOpen(true);
          setIsPinned(true);
        }}
        title="Show Impact Pathways Sidebar"
        className="fixed top-20 right-4 z-40 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 hover:bg-white shadow-lg transition-all active:scale-95 flex items-center gap-2 border border-slate-200/90 cursor-pointer group"
      >
        <PanelRightOpen className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-bold tracking-tight">Impact Pathways</span>
        <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-mono text-[10px] font-bold border border-blue-200">
          {scenario.pathways.length}
        </span>
      </button>
    );
  }

  return (
    <motion.aside
      className="h-full flex-shrink-0 bg-white/85 backdrop-blur-2xl border-l border-slate-200/80 select-none z-20 flex flex-col justify-between overflow-x-hidden shadow-[-4px_0_24px_-4px_rgba(15,23,42,0.03)]"
      animate={{ width: open ? "380px" : "64px" }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ─── FULL EXPANDED VIEW (WHEN OPEN) ─── */}
      {open ? (
        <div className="flex flex-col h-full p-4.5 overflow-y-auto overflow-x-hidden">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 min-h-[40px]">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 font-sans truncate">
                Impact pathways
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-mono text-[10px] font-bold border border-blue-200 shrink-0">
                {scenario.pathways.length}
              </span>
            </div>

            {/* Action Buttons: Pin, Collapse to Rail, and Hide */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsPinned(!isPinned)}
                title={isPinned ? "Unpin (Auto-collapse on mouse leave)" : "Pin Open"}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isPinned
                    ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                {isPinned ? <Pin className="w-4 h-4 fill-blue-600" /> : <PinOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  setIsPinned(false);
                  setOpen(false);
                }}
                title="Collapse to Right Rail"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <PanelRightClose className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsHidden(true);
                }}
                title="Hide Completely"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Alert Banner: Potentially High Transmission */}
          <div className="mb-3.5 p-3 rounded-2xl bg-red-50/80 border border-red-200/90 flex items-start gap-2.5">
            <div className="text-red-500 shrink-0 mt-0.5">
              <AlertTriangle className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12.5px] font-bold text-red-900 leading-tight">
                {scenario.transmissionRisk}
              </span>
              <span className="text-[11.5px] text-red-800 leading-snug">
                {scenario.transmissionRiskDetail}
              </span>
            </div>
          </div>

          {/* Evidence Strength Row */}
          <div className="mb-3 pb-3 border-b border-slate-100 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[12.5px] font-semibold text-slate-800 flex items-center gap-1">
                <span>Evidence strength</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10.5px] font-semibold font-mono">
                {scenario.evidenceStrength}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 leading-relaxed">
              {scenario.evidenceStrengthDetail}
            </span>
          </div>

          {/* Sub-Tabs: Pathways vs Evidence vs Citations */}
          <div className="flex items-center gap-3 border-b border-slate-200 mb-3.5 text-[12.5px] font-semibold">
            <button
              onClick={() => setActiveTab("pathways")}
              className={`pb-2 transition-colors relative cursor-pointer ${
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
              className={`pb-2 transition-colors relative cursor-pointer ${
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

            <button
              onClick={() => setActiveTab("citations")}
              className={`pb-2 transition-colors relative flex items-center gap-1 cursor-pointer ${
                activeTab === "citations"
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>Citations ({allReferences.length})</span>
              {activeTab === "citations" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          </div>

          {/* Tab Content: Pathways List */}
          {activeTab === "pathways" && (
            <div className="flex flex-col gap-2.5">
              {scenario.pathways.map((hop) => {
                const isSelected = selectedHop?.hopNumber === hop.hopNumber;
                return (
                  <div
                    key={hop.hopNumber}
                    onClick={() => onSelectHop(hop)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/40 shadow-xs"
                        : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        Hop {hop.hopNumber}
                      </span>
                      <span className="text-slate-400 text-xs">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                    <div className="text-[12.5px] font-bold text-slate-900 leading-snug">
                      <span>{hop.source}</span>
                      <span className="text-slate-400 mx-1.5">→</span>
                      <span>{hop.target}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        hop.impactType === "Increases"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {hop.impactType === "Increases" ? "↑ Increases" : "↓ Decreases"}
                      </span>
                      <span className="text-[10.5px] text-slate-500 font-mono">
                        {hop.timeframe}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                      {hop.explanation}
                    </p>

                    {(() => {
                      const targetNode = scenario.radialNodes.find(
                        (n) => n.title.toLowerCase() === hop.target.toLowerCase() || n.id === hop.target
                      );
                      if (targetNode?.tickers && targetNode.tickers.length > 0 && onOpenStockDrilldown) {
                        return (
                          <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenStockDrilldown(targetNode);
                              }}
                              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            >
                              <Building2 className="w-3 h-3 text-blue-600" />
                              <span>Inspect {targetNode.title} Equities (yfinance Live) →</span>
                            </button>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab Content: Evidence Sources */}
          {activeTab === "evidence" && (
            <div className="flex flex-col gap-2.5">
              {scenario.evidenceSources.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-900">
                      {ev.source}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[9.5px] font-bold border border-emerald-200">
                      {ev.relevanceScore}% Relevance
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {ev.summary}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                    <span>{ev.date}</span>
                    <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                      Verified Telemetry
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content: Citations */}
          {activeTab === "citations" && (
            <div className="flex flex-col gap-2.5">
              {allReferences.map((ref, idx) => (
                <div
                  key={`${ref.link.title}-${idx}`}
                  className="p-3 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex flex-col gap-1.5 hover:border-blue-400 transition-all"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-100">
                      {ref.link.publisher}
                    </span>
                    <span>Node: {ref.nodeTitle}</span>
                  </div>
                  <a
                    href={ref.link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-slate-900 hover:text-blue-600 leading-snug flex items-center gap-1"
                  >
                    <span>{ref.link.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ─── COMPACT RIGHT RAIL MODE (64PX WIDTH) ─── */
        <div className="flex flex-col items-center justify-between h-full py-4 px-1">
          {/* Top Expand Button */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => {
                setOpen(true);
                setIsPinned(true);
              }}
              title="Expand Impact Pathways Panel"
              className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 shadow-xs transition-colors cursor-pointer"
            >
              <PanelRightOpen className="w-4.5 h-4.5" />
            </button>

            {/* Quick Rail Shortcut Icons */}
            <div className="flex flex-col items-center gap-2 pt-2 border-t border-slate-200/80 w-full">
              {/* Pathways Tab Shortcut */}
              <button
                onClick={() => {
                  setActiveTab("pathways");
                  setOpen(true);
                  setIsPinned(true);
                }}
                title={`Pathways (${scenario.pathways.length})`}
                className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  activeTab === "pathways"
                    ? "bg-blue-50 text-blue-600 border border-blue-200 font-bold"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <GitFork className="w-4 h-4" />
                <span className="text-[9px] font-mono font-bold leading-none mt-0.5">
                  {scenario.pathways.length}
                </span>
              </button>

              {/* Evidence Tab Shortcut */}
              <button
                onClick={() => {
                  setActiveTab("evidence");
                  setOpen(true);
                  setIsPinned(true);
                }}
                title={`Evidence Sources (${scenario.evidenceSources.length})`}
                className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  activeTab === "evidence"
                    ? "bg-blue-50 text-blue-600 border border-blue-200 font-bold"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[9px] font-mono font-bold leading-none mt-0.5">
                  {scenario.evidenceSources.length}
                </span>
              </button>

              {/* Citations Tab Shortcut */}
              <button
                onClick={() => {
                  setActiveTab("citations");
                  setOpen(true);
                  setIsPinned(true);
                }}
                title={`Verified Citations (${allReferences.length})`}
                className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  activeTab === "citations"
                    ? "bg-blue-50 text-blue-600 border border-blue-200 font-bold"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="text-[9px] font-mono font-bold leading-none mt-0.5">
                  {allReferences.length}
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Risk Indicator Dot */}
          <div
            title="High Systemic Transmission Risk"
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => {
              setOpen(true);
              setIsPinned(true);
            }}
          >
            <div className="w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-100 animate-pulse" />
            <span className="text-[8px] font-mono font-bold text-rose-600 uppercase">
              RISK
            </span>
          </div>
        </div>
      )}
    </motion.aside>
  );
};
