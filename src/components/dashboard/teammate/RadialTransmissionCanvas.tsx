import React, { useState } from "react";
import { FinGraphScenario, RadialCardNode, ReferenceLink } from "@/types/fingraph/types";
import {
  PlusCircle,
  ExternalLink,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Sparkles,
  Link,
  Layers,
  ChevronRight,
  Info,
  X,
  Calculator,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface RadialTransmissionCanvasProps {
  scenario: FinGraphScenario;
  selectedNodeId: string | null;
  onSelectNode: (node: RadialCardNode) => void;
  onOpenRegressionModal?: () => void;
  extendedNodeIds?: string[];
  onToggleExtendNode?: (nodeId: string) => void;
}

export const RadialTransmissionCanvas: React.FC<RadialTransmissionCanvasProps> = ({
  scenario,
  selectedNodeId,
  onSelectNode,
  onOpenRegressionModal,
  extendedNodeIds: externalExtendedIds,
  onToggleExtendNode: externalToggleExtend,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [localExtendedIds, setLocalExtendedIds] = useState<string[]>([]);
  const [activeRefNode, setActiveRefNode] = useState<RadialCardNode | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<"all" | "p1_critical">("all");

  const extendedIds = externalExtendedIds || localExtendedIds;

  const handleToggleExtend = (nodeId: string) => {
    if (externalToggleExtend) {
      externalToggleExtend(nodeId);
    } else {
      setLocalExtendedIds((prev) =>
        prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
      );
    }
  };

  // Helper to render icon based on category/type
  const renderIcon = (iconName: string, category: string) => {
    switch (iconName) {
      case "oil":
        return (
          <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
            <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
          </svg>
        );
      case "chart":
        return (
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "ship":
        return (
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20M4 16l2-8h12l2 8H4zM12 4v4m-4 0h8" />
          </svg>
        );
      case "currency":
        return (
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M9 8h6M9 12h4m-4 4h6" />
          </svg>
        );
      case "plane":
        return (
          <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
      case "factory":
        return (
          <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case "chip":
        return (
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="5" width="14" height="14" rx="2" />
            <path d="M9 1v4m6-4v4M9 19v4m6-4v4M1 9h4m-4 6h4M19 9h4m-4 6h4" />
          </svg>
        );
      case "bank":
        return (
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 10v8m4-8v8m6-8v8m4-8v8M12 3l9 5H3l9-5z" />
          </svg>
        );
      default:
        return <div className="w-3 h-3 rounded-full bg-blue-500" />;
    }
  };

  const center = scenario.centerNode;
  const topNode = scenario.radialNodes.find((n) => n.position === "top") || scenario.radialNodes[0];
  const leftNode = scenario.radialNodes.find((n) => n.position === "left") || scenario.radialNodes[1];
  const rightNode = scenario.radialNodes.find((n) => n.position === "right") || scenario.radialNodes[2];
  const bLeftNode = scenario.radialNodes.find((n) => n.position === "bottom-left") || scenario.radialNodes[3];
  const bRightNode = scenario.radialNodes.find((n) => n.position === "bottom-right") || scenario.radialNodes[4];

  // Helper to test if a node passes priority filter
  const isNodeDimmed = (node?: RadialCardNode) => {
    if (!node) return false;
    if (priorityFilter === "p1_critical") {
      return node.priority !== "P1 Critical";
    }
    return false;
  };

  return (
    <div
      className={`relative w-full rounded-3xl clay-surface border border-[var(--clay-border)] overflow-hidden select-none transition-all duration-300 shadow-xl ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none clay-surface" : "h-[620px]"
      }`}
    >
      {/* Precision Micro-Dot Matrix Background Canvas */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(var(--text-secondary) 1.1px, transparent 1.1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top Left Toolbar: Priority Filter & Econometric Regression Gate */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        {/* Priority Filter Toggle */}
        <div className="flex items-center clay-surface border border-[var(--clay-border)] rounded-2xl p-1 shadow-sm text-xs">
          <button
            onClick={() => setPriorityFilter("all")}
            className={`px-3 py-1 rounded-xl font-bold transition-all ${
              priorityFilter === "all"
                ? "clay-button-primary text-white shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            All Nodes ({scenario.radialNodes.length + 1})
          </button>
          <button
            onClick={() => setPriorityFilter("p1_critical")}
            className={`px-3 py-1 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              priorityFilter === "p1_critical"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-rose-500 hover:text-rose-600"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>P1 Critical Priority First</span>
          </button>
        </div>

        {/* Calibrate Regression CTA Button */}
        {onOpenRegressionModal && (
          <button
            onClick={onOpenRegressionModal}
            className="px-3.5 py-1.5 rounded-2xl clay-surface text-[var(--text-primary)] border border-[var(--clay-border)] shadow-sm text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer hover:scale-102 active:scale-98"
            title="Formulate Causal Thesis & Run Econometric Regression"
          >
            <Calculator className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Calibrate Regression</span>
          </button>
        )}
      </div>

      {/* Top Right Controls (Zoom & Fullscreen) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 clay-surface border border-[var(--clay-border)] rounded-2xl p-1 shadow-sm">
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 10, 60))}
          className="w-7 h-7 flex items-center justify-center rounded-xl clay-surface text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
          title="Zoom out"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>

        <span className="px-1.5 text-[12px] font-bold font-mono text-[var(--text-primary)] min-w-[42px] text-center select-none">
          {zoomLevel}%
        </span>

        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
          className="w-7 h-7 flex items-center justify-center rounded-xl clay-surface text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
          title="Zoom in"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <div className="w-[1px] h-4 bg-[var(--clay-border)] mx-0.5" />

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-7 h-7 flex items-center justify-center rounded-xl clay-surface text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            {isFullscreen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M10 4v6m0 0H4m6 0L3 3m10 7h6m-6 0V4m0 6l7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            )}
          </svg>
        </button>
      </div>

      {/* Interactive Scaling Stage */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden transition-transform duration-150"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "center center" }}
      >
        {/* SVG Bezier Vector Connectors Layer */}
        <svg viewBox="0 0 1000 600" className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M1,1 L7,4 L1,7 Z" fill="#EF4444" />
            </marker>
            <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M1,1 L7,4 L1,7 Z" fill="#10B981" />
            </marker>
            <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M1,1 L7,4 L1,7 Z" fill="#3B82F6" />
            </marker>
            <marker id="arrow-dashed" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M1,1 L5,3 L1,5 Z" fill="#64748B" />
            </marker>
          </defs>

          {/* Primary Transmission Paths */}
          {/* Path 1: Center to Top */}
          <path d="M 500 255 L 500 135" stroke="#EF4444" strokeWidth="2.2" fill="none" markerEnd="url(#arrow-red)" />

          {/* Path 2: Center to Left */}
          <path d="M 405 318 L 290 318" stroke="#EF4444" strokeWidth="2.2" fill="none" markerEnd="url(#arrow-red)" />

          {/* Path 3: Center to Right */}
          <path d="M 595 318 L 710 318" stroke="#EF4444" strokeWidth="2.2" fill="none" markerEnd="url(#arrow-red)" />

          {/* Path 4: Center to Bottom-Left */}
          <path d="M 440 375 Q 360 415 285 465" stroke="#10B981" strokeWidth="2.2" fill="none" markerEnd="url(#arrow-green)" />

          {/* Path 5: Center to Bottom-Right */}
          <path d="M 560 375 Q 640 415 715 465" stroke="#10B981" strokeWidth="2.2" fill="none" markerEnd="url(#arrow-green)" />

          {/* Secondary Extended Lines (Dashed) when nodes are extended */}
          {topNode && extendedIds.includes(topNode.id) && (
            <>
              <path d="M 500 80 Q 500 40 430 35" stroke="#64748B" strokeWidth="1.8" strokeDasharray="4 3" fill="none" markerEnd="url(#arrow-dashed)" />
              <path d="M 500 80 Q 500 40 570 35" stroke="#64748B" strokeWidth="1.8" strokeDasharray="4 3" fill="none" markerEnd="url(#arrow-dashed)" />
            </>
          )}

          {bLeftNode && extendedIds.includes(bLeftNode.id) && (
            <path d="M 230 520 Q 180 540 130 540" stroke="#64748B" strokeWidth="1.8" strokeDasharray="4 3" fill="none" markerEnd="url(#arrow-dashed)" />
          )}

          {bRightNode && extendedIds.includes(bRightNode.id) && (
            <path d="M 770 520 Q 820 540 870 540" stroke="#64748B" strokeWidth="1.8" strokeDasharray="4 3" fill="none" markerEnd="url(#arrow-dashed)" />
          )}

          {leftNode && extendedIds.includes(leftNode.id) && (
            <path d="M 180 318 L 95 318" stroke="#64748B" strokeWidth="1.8" strokeDasharray="4 3" fill="none" markerEnd="url(#arrow-dashed)" />
          )}

          {rightNode && extendedIds.includes(rightNode.id) && (
            <path d="M 820 318 L 905 318" stroke="#64748B" strokeWidth="1.8" strokeDasharray="4 3" fill="none" markerEnd="url(#arrow-dashed)" />
          )}
        </svg>

        {/* Transmission Time Capsules Placed on Connectors */}
        {topNode?.timeHorizon && (
          <div className="absolute left-1/2 -translate-x-1/2 top-[34%] z-10">
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[11px] font-medium text-[var(--text-secondary)] whitespace-nowrap">
              {topNode.timeHorizon}
            </span>
          </div>
        )}

        {leftNode?.timeHorizon && (
          <div className="absolute left-[33%] -translate-x-1/2 top-[55%] z-10">
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[11px] font-medium text-[var(--text-secondary)] whitespace-nowrap">
              {leftNode.timeHorizon}
            </span>
          </div>
        )}

        {rightNode?.timeHorizon && (
          <div className="absolute left-[66%] -translate-x-1/2 top-[55%] z-10">
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[11px] font-medium text-[var(--text-secondary)] whitespace-nowrap">
              {rightNode.timeHorizon}
            </span>
          </div>
        )}

        {bLeftNode?.timeHorizon && (
          <div className="absolute left-[37%] top-[69%] -translate-x-1/2 z-10">
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[11px] font-medium text-[var(--text-secondary)] whitespace-nowrap">
              {bLeftNode.timeHorizon}
            </span>
          </div>
        )}

        {bRightNode?.timeHorizon && (
          <div className="absolute left-[62%] top-[69%] -translate-x-1/2 z-10">
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[11px] font-medium text-[var(--text-secondary)] whitespace-nowrap">
              {bRightNode.timeHorizon}
            </span>
          </div>
        )}

        {/* ─── NODE CARDS ─── */}

        {/* 1. CENTER ROOT EVENT CARD */}
        {center && (
          <div
            onClick={() => onSelectNode(center)}
            className="absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-transform hover:scale-105"
          >
            <div className="relative p-4 rounded-2xl clay-surface border-2 border-rose-500 shadow-2xl flex flex-col items-center gap-2 min-w-[190px]">
              {/* Pulsing halo ring */}
              <div className="absolute inset-0 rounded-2xl ring-4 ring-red-400/20 pointer-events-none animate-pulse" />

              {/* Priority badge on root */}
              <div className="flex items-center justify-between w-full">
                <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-mono text-[9.5px] font-bold">
                  P1 CRITICAL • ROOT
                </span>
                {center.refLinks && center.refLinks.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRefNode(center);
                    }}
                    className="p-1 rounded-md clay-surface hover:border-[var(--accent-primary)] text-[var(--text-secondary)] text-[10px] font-bold flex items-center gap-0.5"
                    title="View Reference Links"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span>Refs</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  {renderIcon(center.icon, center.category)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[14.5px] font-bold text-[var(--text-primary)] leading-tight">
                    {center.title}
                  </span>
                  <span className="text-xl font-extrabold text-red-600 leading-tight">
                    {center.metric}
                  </span>
                </div>
              </div>

              {/* Bottom Badge */}
              <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200/90 text-red-600 text-[11px] font-semibold tracking-wide">
                {center.badge}
              </span>
            </div>
          </div>
        )}

        {/* 2. TOP CARD (Inflation Expectations) */}
        {topNode && (
          <div
            onClick={() => onSelectNode(topNode)}
            className={`absolute left-1/2 top-[13%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all hover:scale-105 ${
              selectedNodeId === topNode.id ? "ring-2 ring-blue-500 ring-offset-2" : ""
            } ${isNodeDimmed(topNode) ? "opacity-35" : "opacity-100"}`}
          >
            <div className="p-3.5 rounded-2xl clay-surface border border-[var(--clay-border)] shadow-md flex flex-col gap-2 min-w-[200px]">
              {/* Card Header: Priority & Ref Links */}
              <div className="flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                  {topNode.priority || "P1 Critical"}
                </span>

                {topNode.refLinks && topNode.refLinks.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRefNode(topNode);
                    }}
                    className="p-1 rounded clay-surface hover:border-[var(--accent-primary)] text-[var(--text-secondary)] text-[10px] font-semibold flex items-center gap-1"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span>Refs ({topNode.refLinks.length})</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  {renderIcon(topNode.icon, topNode.category)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[var(--text-primary)] leading-tight">
                      {topNode.title}
                    </span>
                    <span className="text-[14px] font-bold text-red-600">
                      {topNode.metric}
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)] leading-tight mt-0.5">
                    {topNode.subtitle}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Badge & Extend Node Button */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200/80 text-red-600 text-[10.5px] font-semibold">
                  {topNode.badge}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleExtend(topNode.id);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                    extendedIds.includes(topNode.id)
                      ? "bg-blue-600 text-white shadow-xs"
                      : "clay-surface hover:border-[var(--accent-primary)] text-[var(--text-primary)]"
                  }`}
                >
                  <PlusCircle className="w-3 h-3" />
                  {extendedIds.includes(topNode.id) ? "Extended" : "+ Extend Node"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Extended Sub-Nodes for TOP NODE */}
        {topNode && extendedIds.includes(topNode.id) && (
          <>
            <div className="absolute left-[40%] top-[4%] -translate-x-1/2 -translate-y-1/2 z-20 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-2.5 rounded-xl clay-surface border border-[var(--clay-border)] shadow-md text-xs min-w-[150px]">
                <span className="text-[9px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                  2ND ORDER HOP
                </span>
                <div className="font-bold text-[var(--text-primary)] mt-1">WPI Fuel & Power</div>
                <div className="font-extrabold text-red-600">+8.4% Surge</div>
              </div>
            </div>

            <div className="absolute left-[60%] top-[4%] -translate-x-1/2 -translate-y-1/2 z-20 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-2.5 rounded-xl clay-surface border border-[var(--clay-border)] shadow-md text-xs min-w-[150px]">
                <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                  2ND ORDER HOP
                </span>
                <div className="font-bold text-[var(--text-primary)] mt-1">RBI Terminal Rate</div>
                <div className="font-extrabold text-red-600">+25 bps Deferral</div>
              </div>
            </div>
          </>
        )}

        {/* 3. LEFT CARD (Import bill) */}
        {leftNode && (
          <div
            onClick={() => onSelectNode(leftNode)}
            className={`absolute left-[18%] top-[53%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all hover:scale-105 ${
              selectedNodeId === leftNode.id ? "ring-2 ring-blue-500 ring-offset-2" : ""
            } ${isNodeDimmed(leftNode) ? "opacity-35" : "opacity-100"}`}
          >
            <div className="p-3.5 rounded-2xl clay-surface border border-[var(--clay-border)] shadow-md flex flex-col gap-2 min-w-[200px]">
              <div className="flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                  {leftNode.priority || "P1 Critical"}
                </span>
                {leftNode.refLinks && leftNode.refLinks.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRefNode(leftNode);
                    }}
                    className="p-1 rounded clay-surface hover:border-[var(--accent-primary)] text-[var(--text-secondary)] text-[10px] font-semibold flex items-center gap-1"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span>Refs ({leftNode.refLinks.length})</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  {renderIcon(leftNode.icon, leftNode.category)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[var(--text-primary)] leading-tight">
                      {leftNode.title}
                    </span>
                    <span className="text-[14px] font-bold text-red-600">
                      {leftNode.metric}
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)] leading-tight mt-0.5">
                    {leftNode.subtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200/80 text-red-600 text-[10.5px] font-semibold">
                  {leftNode.badge}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleExtend(leftNode.id);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                    extendedIds.includes(leftNode.id)
                      ? "bg-blue-600 text-white shadow-xs"
                      : "clay-surface hover:border-[var(--accent-primary)] text-[var(--text-primary)]"
                  }`}
                >
                  <PlusCircle className="w-3 h-3" />
                  {extendedIds.includes(leftNode.id) ? "Extended" : "+ Extend Node"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Extended Sub-Nodes for LEFT NODE */}
        {leftNode && extendedIds.includes(leftNode.id) && (
          <div className="absolute left-[6%] top-[53%] -translate-x-1/2 -translate-y-1/2 z-20 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2.5 rounded-xl clay-surface border border-[var(--clay-border)] shadow-md text-xs min-w-[140px]">
              <span className="text-[9px] font-mono font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                2ND ORDER
              </span>
              <div className="font-bold text-[var(--text-primary)] mt-1">Current Account Deficit</div>
              <div className="font-extrabold text-red-600">2.1% of GDP</div>
            </div>
          </div>
        )}

        {/* 4. RIGHT CARD (INR USD/INR) */}
        {rightNode && (
          <div
            onClick={() => onSelectNode(rightNode)}
            className={`absolute left-[82%] top-[53%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all hover:scale-105 ${
              selectedNodeId === rightNode.id ? "ring-2 ring-blue-500 ring-offset-2" : ""
            } ${isNodeDimmed(rightNode) ? "opacity-35" : "opacity-100"}`}
          >
            <div className="p-3.5 rounded-2xl clay-surface border border-[var(--clay-border)] shadow-md flex flex-col gap-2 min-w-[200px]">
              <div className="flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {rightNode.priority || "P2 High"}
                </span>
                {rightNode.refLinks && rightNode.refLinks.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRefNode(rightNode);
                    }}
                    className="p-1 rounded clay-surface hover:border-[var(--accent-primary)] text-[var(--text-secondary)] text-[10px] font-semibold flex items-center gap-1"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span>Refs ({rightNode.refLinks.length})</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  {renderIcon(rightNode.icon, rightNode.category)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[var(--text-primary)] leading-tight">
                      {rightNode.title}
                    </span>
                    <span className="text-[14px] font-bold text-red-600">
                      {rightNode.metric}
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)] leading-tight mt-0.5">
                    {rightNode.subtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200/80 text-red-600 text-[10.5px] font-semibold">
                  {rightNode.badge}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleExtend(rightNode.id);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                    extendedIds.includes(rightNode.id)
                      ? "bg-blue-600 text-white shadow-xs"
                      : "clay-surface hover:border-[var(--accent-primary)] text-[var(--text-primary)]"
                  }`}
                >
                  <PlusCircle className="w-3 h-3" />
                  {extendedIds.includes(rightNode.id) ? "Extended" : "+ Extend Node"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Extended Sub-Nodes for RIGHT NODE */}
        {rightNode && extendedIds.includes(rightNode.id) && (
          <div className="absolute left-[94%] top-[53%] -translate-x-1/2 -translate-y-1/2 z-20 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2.5 rounded-xl clay-surface border border-[var(--clay-border)] shadow-md text-xs min-w-[140px]">
              <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                2ND ORDER
              </span>
              <div className="font-bold text-[var(--text-primary)] mt-1">FII Debt Outflows</div>
              <div className="font-extrabold text-red-600">-₹3,400 Cr</div>
            </div>
          </div>
        )}

        {/* 5. BOTTOM-LEFT CARD (Airlines) */}
        {bLeftNode && (
          <div
            onClick={() => onSelectNode(bLeftNode)}
            className={`absolute left-[23%] top-[86%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all hover:scale-105 ${
              selectedNodeId === bLeftNode.id ? "ring-2 ring-blue-500 ring-offset-2" : ""
            } ${isNodeDimmed(bLeftNode) ? "opacity-35" : "opacity-100"}`}
          >
            <div className="p-3.5 rounded-2xl clay-surface border border-[var(--clay-border)] shadow-md flex flex-col gap-2 min-w-[205px]">
              <div className="flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                  {bLeftNode.priority || "P1 Critical"}
                </span>
                {bLeftNode.refLinks && bLeftNode.refLinks.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRefNode(bLeftNode);
                    }}
                    className="p-1 rounded clay-surface hover:border-[var(--accent-primary)] text-[var(--text-secondary)] text-[10px] font-semibold flex items-center gap-1"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span>Refs ({bLeftNode.refLinks.length})</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  {renderIcon(bLeftNode.icon, bLeftNode.category)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[var(--text-primary)] leading-tight">
                      {bLeftNode.title}
                    </span>
                    <span className="text-[14px] font-bold text-emerald-600">
                      {bLeftNode.metric}
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)] leading-tight mt-0.5">
                    {bLeftNode.subtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10.5px] font-semibold">
                  {bLeftNode.badge}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleExtend(bLeftNode.id);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                    extendedIds.includes(bLeftNode.id)
                      ? "bg-blue-600 text-white shadow-xs"
                      : "clay-surface hover:border-[var(--accent-primary)] text-[var(--text-primary)]"
                  }`}
                >
                  <PlusCircle className="w-3 h-3" />
                  {extendedIds.includes(bLeftNode.id) ? "Extended" : "+ Extend Node"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Extended Sub-Nodes for BOTTOM-LEFT NODE */}
        {bLeftNode && extendedIds.includes(bLeftNode.id) && (
          <div className="absolute left-[10%] top-[93%] -translate-x-1/2 -translate-y-1/2 z-20 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2.5 rounded-xl clay-surface border border-[var(--clay-border)] shadow-md text-xs min-w-[145px]">
              <span className="text-[9px] font-mono font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                2ND ORDER
              </span>
              <div className="font-bold text-[var(--text-primary)] mt-1">Domestic ATF Spot</div>
              <div className="font-extrabold text-red-600">+₹14,200/kL</div>
            </div>
          </div>
        )}

        {/* 6. BOTTOM-RIGHT CARD (Paint & Chemicals) */}
        {bRightNode && (
          <div
            onClick={() => onSelectNode(bRightNode)}
            className={`absolute left-[77%] top-[86%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all hover:scale-105 ${
              selectedNodeId === bRightNode.id ? "ring-2 ring-blue-500 ring-offset-2" : ""
            } ${isNodeDimmed(bRightNode) ? "opacity-35" : "opacity-100"}`}
          >
            <div className="p-3.5 rounded-2xl clay-surface border border-[var(--clay-border)] shadow-md flex flex-col gap-2 min-w-[210px]">
              <div className="flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {bRightNode.priority || "P2 High"}
                </span>
                {bRightNode.refLinks && bRightNode.refLinks.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRefNode(bRightNode);
                    }}
                    className="p-1 rounded clay-surface hover:border-[var(--accent-primary)] text-[var(--text-secondary)] text-[10px] font-semibold flex items-center gap-1"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span>Refs ({bRightNode.refLinks.length})</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                  {renderIcon(bRightNode.icon, bRightNode.category)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[var(--text-primary)] leading-tight">
                      {bRightNode.title}
                    </span>
                    <span className="text-[14px] font-bold text-red-600">
                      {bRightNode.metric}
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--text-secondary)] leading-tight mt-0.5">
                    {bRightNode.subtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10.5px] font-semibold">
                  {bRightNode.badge}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleExtend(bRightNode.id);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                    extendedIds.includes(bRightNode.id)
                      ? "bg-blue-600 text-white shadow-xs"
                      : "clay-surface hover:border-[var(--accent-primary)] text-[var(--text-primary)]"
                  }`}
                >
                  <PlusCircle className="w-3 h-3" />
                  {extendedIds.includes(bRightNode.id) ? "Extended" : "+ Extend Node"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Extended Sub-Nodes for BOTTOM-RIGHT NODE */}
        {bRightNode && extendedIds.includes(bRightNode.id) && (
          <div className="absolute left-[90%] top-[93%] -translate-x-1/2 -translate-y-1/2 z-20 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2.5 rounded-xl clay-surface border border-[var(--clay-border)] shadow-md text-xs min-w-[145px]">
              <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                2ND ORDER
              </span>
              <div className="font-bold text-[var(--text-primary)] mt-1">TiO2 Feedstock</div>
              <div className="font-extrabold text-red-600">+$240/MT</div>
            </div>
          </div>
        )}
      </div>

      {/* ─── REFERENCE LINKS & CITATION POPOVER MODAL ─── */}
      {activeRefNode && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Link className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-[var(--text-primary)]">
                  Verified Reference Links: {activeRefNode.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveRefNode(null)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-3">
              {/* Causal Thesis Explainer */}
              {activeRefNode.causalReason && (
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 leading-relaxed">
                  <strong>Causal Thesis: </strong>
                  {activeRefNode.causalReason}
                </div>
              )}

              <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                External Citations & Market Disclosures
              </span>

              <div className="flex flex-col gap-2">
                {activeRefNode.refLinks?.map((ref, idx) => (
                  <a
                    key={idx}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-start justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-blue-600 block leading-snug">
                        {ref.title}
                      </span>
                      <span className="text-[10px] text-[var(--text-secondary)] mt-0.5 block font-medium">
                        Publisher: <strong>{ref.publisher}</strong>
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 ml-2 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveRefNode(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

