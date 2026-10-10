import React, { useState } from "react";
import { FinGraphScenario, RadialCardNode } from "../types";

interface RadialTransmissionCanvasProps {
  scenario: FinGraphScenario;
  selectedNodeId: string | null;
  onSelectNode: (node: RadialCardNode) => void;
}

export const RadialTransmissionCanvas: React.FC<RadialTransmissionCanvasProps> = ({
  scenario,
  selectedNodeId,
  onSelectNode,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

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
        return (
          <div className="w-3 h-3 rounded-full bg-blue-500" />
        );
    }
  };

  const center = scenario.centerNode;
  const topNode = scenario.radialNodes.find((n) => n.position === "top");
  const leftNode = scenario.radialNodes.find((n) => n.position === "left");
  const rightNode = scenario.radialNodes.find((n) => n.position === "right");
  const bLeftNode = scenario.radialNodes.find((n) => n.position === "bottom-left");
  const bRightNode = scenario.radialNodes.find((n) => n.position === "bottom-right");

  return (
    <div
      className={`relative w-full rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs flex flex-col transition-all ${
        isFullscreen ? "fixed inset-4 z-50 shadow-2xl" : "h-[580px]"
      }`}
    >
      {/* Dot Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.65]"
        style={{
          backgroundImage: "radial-gradient(#cbd5e1 1.2px, transparent 1.2px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Top Right Controls (Zoom & Fullscreen) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-1 shadow-xs">
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 10, 60))}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          title="Zoom out"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>

        <span className="px-1.5 text-[12px] font-semibold text-slate-700 min-w-[42px] text-center select-none">
          {zoomLevel}%
        </span>

        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          title="Zoom in"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
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
        {/* SVG Bezier Vector Connectors Layer with standard coordinate space */}
        <svg
          viewBox="0 0 1000 600"
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          <defs>
            {/* Arrowhead Markers */}
            <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M1,1 L7,4 L1,7 Z" fill="#EF4444" />
            </marker>
            <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M1,1 L7,4 L1,7 Z" fill="#10B981" />
            </marker>
            <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M1,1 L7,4 L1,7 Z" fill="#3B82F6" />
            </marker>
          </defs>

          {/* Path 1: Center to Top (Inflation) */}
          <path
            d="M 500 255 L 500 135"
            stroke="#EF4444"
            strokeWidth="2.2"
            fill="none"
            markerEnd="url(#arrow-red)"
          />

          {/* Path 2: Center to Left (Import bill) */}
          <path
            d="M 405 318 L 290 318"
            stroke="#EF4444"
            strokeWidth="2.2"
            fill="none"
            markerEnd="url(#arrow-red)"
          />

          {/* Path 3: Center to Right (INR) */}
          <path
            d="M 595 318 L 710 318"
            stroke="#EF4444"
            strokeWidth="2.2"
            fill="none"
            markerEnd="url(#arrow-red)"
          />

          {/* Path 4: Center to Bottom-Left (Airlines) */}
          <path
            d="M 440 375 Q 360 415 285 465"
            stroke="#10B981"
            strokeWidth="2.2"
            fill="none"
            markerEnd="url(#arrow-green)"
          />

          {/* Path 5: Center to Bottom-Right (Paint & Chemicals) */}
          <path
            d="M 560 375 Q 640 415 715 465"
            stroke="#10B981"
            strokeWidth="2.2"
            fill="none"
            markerEnd="url(#arrow-green)"
          />
        </svg>

        {/* Transmission Time Capsules Placed on Connectors */}
        {/* Top Connector Label */}
        {topNode?.timeHorizon && (
          <div className="absolute left-1/2 -translate-x-1/2 top-[34%] z-10">
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[11px] font-medium text-slate-600 whitespace-nowrap">
              {topNode.timeHorizon}
            </span>
          </div>
        )}

        {/* Left Connector Label */}
        {leftNode?.timeHorizon && (
          <div className="absolute left-[33%] -translate-x-1/2 top-[55%] z-10">
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[11px] font-medium text-slate-600 whitespace-nowrap">
              {leftNode.timeHorizon}
            </span>
          </div>
        )}

        {/* Right Connector Label */}
        {rightNode?.timeHorizon && (
          <div className="absolute left-[66%] -translate-x-1/2 top-[55%] z-10">
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[11px] font-medium text-slate-600 whitespace-nowrap">
              {rightNode.timeHorizon}
            </span>
          </div>
        )}

        {/* Bottom Left Connector Label */}
        {bLeftNode?.timeHorizon && (
          <div className="absolute left-[37%] top-[69%] -translate-x-1/2 z-10">
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[11px] font-medium text-slate-600 whitespace-nowrap">
              {bLeftNode.timeHorizon}
            </span>
          </div>
        )}

        {/* Bottom Right Connector Label */}
        {bRightNode?.timeHorizon && (
          <div className="absolute left-[62%] top-[69%] -translate-x-1/2 z-10">
            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs text-[11px] font-medium text-slate-600 whitespace-nowrap">
              {bRightNode.timeHorizon}
            </span>
          </div>
        )}

        {/* ─── NODE CARDS ─── */}

        {/* 1. CENTER ROOT EVENT CARD (Oil Shock) */}
        {center && (
          <div
            onClick={() => onSelectNode(center)}
            className="absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-transform hover:scale-105"
          >
            <div className="relative p-4 rounded-2xl bg-white border-2 border-red-500 shadow-[0_0_28px_rgba(239,68,68,0.28)] flex flex-col items-center gap-2 min-w-[170px]">
              {/* Pulsing halo ring */}
              <div className="absolute inset-0 rounded-2xl ring-4 ring-red-400/20 pointer-events-none animate-pulse" />

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  {renderIcon(center.icon, center.category)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[14.5px] font-bold text-slate-900 leading-tight">
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
            }`}
          >
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col gap-1.5 min-w-[185px]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  {renderIcon(topNode.icon, topNode.category)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-slate-900 leading-tight">
                      {topNode.title}
                    </span>
                    <span className="text-[14px] font-bold text-red-600">
                      {topNode.metric}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {topNode.subtitle}
                  </span>
                </div>
              </div>
              <div className="flex justify-start">
                <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200/80 text-red-600 text-[10.5px] font-semibold">
                  {topNode.badge}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. LEFT CARD (Import bill) */}
        {leftNode && (
          <div
            onClick={() => onSelectNode(leftNode)}
            className={`absolute left-[18%] top-[53%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all hover:scale-105 ${
              selectedNodeId === leftNode.id ? "ring-2 ring-blue-500 ring-offset-2" : ""
            }`}
          >
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col gap-1.5 min-w-[185px]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  {renderIcon(leftNode.icon, leftNode.category)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-slate-900 leading-tight">
                      {leftNode.title}
                    </span>
                    <span className="text-[14px] font-bold text-red-600">
                      {leftNode.metric}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {leftNode.subtitle}
                  </span>
                </div>
              </div>
              <div className="flex justify-start">
                <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200/80 text-red-600 text-[10.5px] font-semibold">
                  {leftNode.badge}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 4. RIGHT CARD (INR (USD/INR)) */}
        {rightNode && (
          <div
            onClick={() => onSelectNode(rightNode)}
            className={`absolute left-[82%] top-[53%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all hover:scale-105 ${
              selectedNodeId === rightNode.id ? "ring-2 ring-blue-500 ring-offset-2" : ""
            }`}
          >
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col gap-1.5 min-w-[185px]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  {renderIcon(rightNode.icon, rightNode.category)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-slate-900 leading-tight">
                      {rightNode.title}
                    </span>
                    <span className="text-[14px] font-bold text-red-600">
                      {rightNode.metric}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {rightNode.subtitle}
                  </span>
                </div>
              </div>
              <div className="flex justify-start">
                <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200/80 text-red-600 text-[10.5px] font-semibold">
                  {rightNode.badge}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 5. BOTTOM-LEFT CARD (Airlines) */}
        {bLeftNode && (
          <div
            onClick={() => onSelectNode(bLeftNode)}
            className={`absolute left-[23%] top-[86%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all hover:scale-105 ${
              selectedNodeId === bLeftNode.id ? "ring-2 ring-blue-500 ring-offset-2" : ""
            }`}
          >
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col gap-1.5 min-w-[190px]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  {renderIcon(bLeftNode.icon, bLeftNode.category)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-slate-900 leading-tight">
                      {bLeftNode.title}
                    </span>
                    <span className="text-[14px] font-bold text-emerald-600">
                      {bLeftNode.metric}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {bLeftNode.subtitle}
                  </span>
                </div>
              </div>
              <div className="flex justify-start">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10.5px] font-semibold">
                  {bLeftNode.badge}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 6. BOTTOM-RIGHT CARD (Paint & Chemicals) */}
        {bRightNode && (
          <div
            onClick={() => onSelectNode(bRightNode)}
            className={`absolute left-[77%] top-[86%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all hover:scale-105 ${
              selectedNodeId === bRightNode.id ? "ring-2 ring-blue-500 ring-offset-2" : ""
            }`}
          >
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col gap-1.5 min-w-[200px]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                  {renderIcon(bRightNode.icon, bRightNode.category)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-slate-900 leading-tight">
                      {bRightNode.title}
                    </span>
                    <span className="text-[14px] font-bold text-red-600">
                      {bRightNode.metric}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {bRightNode.subtitle}
                  </span>
                </div>
              </div>
              <div className="flex justify-start">
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10.5px] font-semibold">
                  {bRightNode.badge}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom-Left Canvas Legend */}
      <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl px-2.5 py-1.5 shadow-xs text-[10.5px] flex flex-col gap-0.5 select-none max-w-[210px]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-900 shrink-0" />
            <span className="text-slate-600 font-medium">Commodity (Event)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-500 font-bold leading-none">→</span>
            <span className="text-slate-600 font-medium">Increases</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span className="text-slate-600 font-medium">Economic Variable</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-emerald-500 font-bold leading-none">→</span>
            <span className="text-slate-600 font-medium">Negative</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
            <span className="text-slate-600 font-medium">Sector / Stock</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-bold leading-none">⇢</span>
            <span className="text-slate-500">Indirect</span>
          </div>
        </div>
      </div>
    </div>
  );
};
