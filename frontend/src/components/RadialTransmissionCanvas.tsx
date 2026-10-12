import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { FinGraphScenario, RadialCardNode, ReferenceLink } from "../types";
import {
  PlusCircle,
  MinusCircle,
  ExternalLink,
  Calculator,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  ChevronRight,
  ShieldCheck,
  Building2,
  Flame,
  ArrowRight,
  X
} from "lucide-react";

interface RadialTransmissionCanvasProps {
  scenario: FinGraphScenario;
  selectedNodeId: string | null;
  onSelectNode: (node: RadialCardNode | null) => void;
  onOpenRegressionModal?: () => void;
  onOpenStockDrilldown?: (node: RadialCardNode) => void;
  extendedNodeIds?: string[];
  onToggleExtendNode?: (nodeId: string) => void;
}

// Graph node model for 2D topology simulation
interface TopologyNode {
  id: string;
  data: RadialCardNode;
  level: 0 | 1 | 2; // 0: Root, 1: Radial 1st-order, 2: Extended satellite
  parentId?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  angle?: number;
  edgeLabel?: string;
}

interface TopologyEdge {
  id: string;
  source: TopologyNode;
  target: TopologyNode;
  lineType?: "positive" | "negative" | "indirect";
  timeHorizon?: string;
  isExtendedEdge?: boolean;
}

export const RadialTransmissionCanvas: React.FC<RadialTransmissionCanvasProps> = ({
  scenario,
  selectedNodeId,
  onSelectNode,
  onOpenRegressionModal,
  onOpenStockDrilldown,
  extendedNodeIds: externalExtendedIds,
  onToggleExtendNode: externalToggleExtend,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan and Zoom Transformation state
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragDistanceRef = useRef<number>(0);
  const pointerDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [priorityFilter, setPriorityFilter] = useState<"all" | "p1_critical">("all");
  const [hoveredNode, setHoveredNode] = useState<RadialCardNode | null>(null);

  // Dynamic relation toggle handler (switches or clears active relation)
  const handleToggleExtend = (nodeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedNodeId === nodeId) {
      onSelectNode(null);
    } else {
      const targetNode =
        scenario.radialNodes.find((n) => n.id === nodeId) ||
        (scenario.centerNode.id === nodeId ? scenario.centerNode : null);
      if (targetNode) {
        onSelectNode(targetNode);
      }
    }
  };

  // Center the view
  const handleResetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  const isNativeFullscreenRef = useRef(false);

  // Fullscreen toggle handler (Native Fullscreen + React Portal)
  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement
            .requestFullscreen()
            .then(() => {
              isNativeFullscreenRef.current = true;
            })
            .catch(() => {
              isNativeFullscreenRef.current = false;
            });
        }
      } catch {
        isNativeFullscreenRef.current = false;
      }
    } else {
      setIsFullscreen(false);
      isNativeFullscreenRef.current = false;
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      } catch {
        // Fallback
      }
    }
  };

  // Listen for escape and fullscreenchange
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        isNativeFullscreenRef.current = false;
        try {
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
        } catch {}
      }
    };
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isNativeFullscreenRef.current) {
        setIsFullscreen(false);
        isNativeFullscreenRef.current = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isFullscreen]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey || isFullscreen) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.4), 2.8));
    }
  };

  // Background drag to pan / click to dismiss
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    dragDistanceRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - pointerDownPosRef.current.x;
    const dy = e.clientY - pointerDownPosRef.current.y;
    dragDistanceRef.current = Math.sqrt(dx * dx + dy * dy);
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // If pointer moved less than 5px, treat as intentional background click to dismiss relation
    if (dragDistanceRef.current < 5) {
      onSelectNode(null);
    }
  };

  // Fallback extended child nodes generator for nodes lacking static children
  const getExtendedChildren = (node: RadialCardNode): RadialCardNode[] => {
    if (node.extendedChildren && node.extendedChildren.length > 0) {
      return node.extendedChildren;
    }

    if (node.tickers && node.tickers.length > 0) {
      return node.tickers.slice(0, 3).map((ticker, idx) => ({
        id: `${node.id}-ticker-${idx}`,
        title: ticker.replace(".NS", ""),
        metric: idx === 0 ? "-4.8%" : idx === 1 ? "-3.2%" : "+1.4%",
        metricColor: idx === 2 ? "green" : "red",
        subtitle: `Direct supply chain exposure to ${node.title}`,
        badge: "Direct Equity",
        badgeType: "red",
        category: "company",
        icon: "factory",
        position: "custom",
        priority: "P2 High",
        causalReason: `Downstream revenue and input margin sensitivity to ${node.title}`,
      }));
    }

    return [
      {
        id: `${node.id}-sub-1`,
        title: `${node.title} Spot Elasticity`,
        metric: "+6.4%",
        metricColor: "red",
        subtitle: "High correlation pass-through",
        badge: "2nd Order",
        badgeType: "red",
        category: "economic_variable",
        icon: "chart",
        position: "custom",
        priority: "P1 Critical",
      },
      {
        id: `${node.id}-sub-2`,
        title: `Margin Dislocation Risk`,
        metric: "-180 bps",
        metricColor: "red",
        subtitle: "EBITDA margin compression",
        badge: "2nd Order",
        badgeType: "amber",
        category: "sector",
        icon: "factory",
        position: "custom",
        priority: "P2 High",
      },
    ];
  };

  // Compute graph geometry (Hub-and-Spoke + Dynamic Satellite Clusters like Image 2)
  const { nodes, edges } = useMemo(() => {
    const nodeList: TopologyNode[] = [];
    const edgeList: TopologyEdge[] = [];

    // 1. Root Central Node (Level 0)
    const rootNode: TopologyNode = {
      id: scenario.centerNode.id || "root-center",
      data: scenario.centerNode,
      level: 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: isFullscreen ? 48 : 42,
      color: "#ef4444",
    };
    nodeList.push(rootNode);

    // If root central node is selected, spawn its dynamic downstream relations!
    if (selectedNodeId === rootNode.id) {
      const rootChildren = rootNode.data.extendedChildren || [
        {
          id: "crude-brent-wti",
          title: "Brent-WTI Arb",
          metric: "+$5.20/bbl",
          metricColor: "red",
          subtitle: "Export route dislocation",
          badge: "Secondary Hop",
          badgeType: "red",
          category: "commodity",
          icon: "oil",
          position: "custom",
          priority: "P1 Critical",
          causalReason: "Physical tanker rerouting widens prompt North Sea vs US Gulf Coast spreads.",
        },
        {
          id: "tanker-rates",
          title: "Tanker Day Rates",
          metric: "+34.5%",
          metricColor: "red",
          subtitle: "Black Sea & Red Sea freight surge",
          badge: "Secondary Hop",
          badgeType: "amber",
          category: "commodity",
          icon: "ship",
          position: "custom",
          priority: "P1 Critical",
          causalReason: "War insurance premiums and vessel re-flagging elevate VLCC day rates.",
        },
      ];

      const rootR = isFullscreen ? 140 : 110;
      rootChildren.forEach((child, idx) => {
        const rootAngle = idx === 0 ? -Math.PI * 0.75 : -Math.PI * 0.25;
        const rx = Math.round(rootR * Math.cos(rootAngle));
        const ry = Math.round(rootR * Math.sin(rootAngle));

        const rootChildTopo: TopologyNode = {
          id: child.id,
          data: child,
          level: 2,
          parentId: rootNode.id,
          x: rx,
          y: ry,
          vx: 0,
          vy: 0,
          radius: isFullscreen ? 28 : 24,
          color: child.priority === "P1 Critical" ? "#ef4444" : "#f59e0b",
          edgeLabel: "Catalyst Link",
        };
        nodeList.push(rootChildTopo);

        edgeList.push({
          id: `edge-${rootNode.id}-${rootChildTopo.id}`,
          source: rootNode,
          target: rootChildTopo,
          lineType: child.lineType || "indirect",
          isExtendedEdge: true,
        });
      });
    }

    // Filter radial nodes based on priority
    const visibleRadialNodes = scenario.radialNodes.filter((n) => {
      if (priorityFilter === "p1_critical") {
        return n.priority === "P1 Critical";
      }
      return true;
    });

    const R1 = isFullscreen ? 260 : 190; // Balanced radial orbit radius

    // Partition nodes into P1 Critical (Upper Arc) and P2 High (Lower Arc)
    const p1Nodes = visibleRadialNodes.filter((n) => n.priority === "P1 Critical");
    const p2Nodes = visibleRadialNodes.filter((n) => n.priority !== "P1 Critical");

    // Helper to position a subset of nodes along an arc
    const layoutNodeArc = (nodesToLayout: RadialCardNode[], isUpperArc: boolean) => {
      const count = nodesToLayout.length;
      if (count === 0) return;

      nodesToLayout.forEach((node, idx) => {
        let angle: number;
        if (priorityFilter === "p1_critical" || p2Nodes.length === 0) {
          // If only P1 is shown, distribute across full top semi-circle
          const span = Math.PI * 0.75;
          angle = count === 1 ? -Math.PI / 2 : -Math.PI / 2 - span / 2 + (span * idx) / (count - 1);
        } else if (isUpperArc) {
          // Upper Arc (centered around -PI/2) for P1 Critical Shocks
          const span = Math.PI * 0.7;
          angle = count === 1 ? -Math.PI / 2 : -Math.PI / 2 - span / 2 + (span * idx) / (count - 1);
        } else {
          // Lower Arc (centered around +PI/2) for P2 High / Secondary Shocks
          const span = Math.PI * 0.65;
          angle = count === 1 ? Math.PI / 2 : Math.PI / 2 - span / 2 + (span * idx) / (count - 1);
        }

        const x = Math.round(R1 * Math.cos(angle));
        const y = Math.round(R1 * Math.sin(angle));

        const radialTopoNode: TopologyNode = {
          id: node.id,
          data: node,
          level: 1,
          parentId: rootNode.id,
          x,
          y,
          vx: 0,
          vy: 0,
          radius: isFullscreen ? 34 : (node.priority === "P1 Critical" ? 32 : 28),
          color:
            node.badge === "Positive"
              ? "#16a34a"
              : node.priority === "P1 Critical"
              ? "#ef4444"
              : "#f59e0b",
          angle,
          edgeLabel: node.timeHorizon || "1-3 mo",
        };
        nodeList.push(radialTopoNode);

        // Edge from Root Shock to Radial Node
        edgeList.push({
          id: `edge-${rootNode.id}-${radialTopoNode.id}`,
          source: rootNode,
          target: radialTopoNode,
          lineType: node.lineType,
          timeHorizon: node.timeHorizon,
        });

        // 3. Dynamic Relation Child Nodes (Form ONLY for the active clicked node!)
        // As soon as user clicks another node, previous relations vanish and newly clicked node's relations appear
        const isSelectedOrChildSelected =
          selectedNodeId === node.id ||
          (node.extendedChildren && node.extendedChildren.some((c) => c.id === selectedNodeId));

        if (isSelectedOrChildSelected) {
          const children = getExtendedChildren(node);
          const childCount = children.length;
          const R2 = isFullscreen ? 165 : 135; // Distance of satellite cluster from parent
          const spreadArc = Math.PI * 0.45; // Fan spread angle

          children.forEach((child, cIdx) => {
            const offsetAngle =
              childCount > 1
                ? -spreadArc / 2 + (spreadArc * cIdx) / (childCount - 1)
                : 0;
            const childAngle = angle + offsetAngle;

            const childX = Math.round(x + R2 * Math.cos(childAngle));
            const childY = Math.round(y + R2 * Math.sin(childAngle));

            const childTopoNode: TopologyNode = {
              id: child.id,
              data: child,
              level: 2,
              parentId: radialTopoNode.id,
              x: childX,
              y: childY,
              vx: 0,
              vy: 0,
              radius: isFullscreen ? 26 : 23,
              color: child.priority === "P1 Critical" ? "#ef4444" : "#3b82f6",
              edgeLabel: "2nd Order",
            };
            nodeList.push(childTopoNode);

            // Edge from 1st-level parent to 2nd-level child node
            edgeList.push({
              id: `edge-${radialTopoNode.id}-${childTopoNode.id}`,
              source: radialTopoNode,
              target: childTopoNode,
              lineType: child.lineType || "indirect",
              isExtendedEdge: true,
            });
          });
        }
      });
    };

    // Layout P1 on Upper Arc and P2 on Lower Arc
    layoutNodeArc(p1Nodes, true);
    if (priorityFilter !== "p1_critical") {
      layoutNodeArc(p2Nodes, false);
    }

    return { nodes: nodeList, edges: edgeList };
  }, [scenario, selectedNodeId, priorityFilter, isFullscreen]);

  // Category Icon Renderer
  const renderNodeIcon = (node: RadialCardNode, size: "sm" | "md" | "lg" = "md") => {
    const iconClass = size === "lg" ? "w-6 h-6 text-white" : size === "md" ? "w-4 h-4" : "w-3 h-3";
    switch (node.icon) {
      case "oil":
        return <Flame className={iconClass} />;
      case "chart":
        return <TrendingUp className={iconClass} />;
      case "currency":
        return <span className={`font-mono font-bold ${size === "lg" ? "text-xl text-white" : "text-xs"}`}>₹</span>;
      case "plane":
        return <span className={size === "lg" ? "text-xl" : "text-sm"}>✈️</span>;
      case "ship":
        return <span className={size === "lg" ? "text-xl" : "text-sm"}>🚢</span>;
      case "factory":
        return <Building2 className={iconClass} />;
      default:
        return <Layers className={iconClass} />;
    }
  };

  // Canvas Content Renderer (used both inline and in portal fullscreen)
  const renderCanvasContent = () => (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-full select-none overflow-hidden ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* Precision Micro-Dot Matrix Background Canvas */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(#94a3b8 1.1px, transparent 1.1px)",
          backgroundSize: "24px 24px",
          transform: `translate(${pan.x % 24}px, ${pan.y % 24}px)`,
        }}
      />
         {/* ─── CORNER 1: TOP-LEFT (Filter Switch & Optional Fullscreen Title) ─── */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-auto">
        {isFullscreen && (
          <div className="px-2.5 py-1 rounded-xl apple-glass border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-800 tracking-wide truncate max-w-xs">
              {scenario.title}
            </span>
          </div>
        )}

        {/* Priority Filter Pill Button */}
        <div className="flex items-center apple-glass rounded-xl p-0.5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-xs border border-white/80">
          <button
            onClick={() => setPriorityFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              priorityFilter === "all"
                ? "bg-slate-900 text-white font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Relations ({scenario.radialNodes.length})
          </button>
          <button
            onClick={() => setPriorityFilter("p1_critical")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              priorityFilter === "p1_critical"
                ? "bg-[#FF3B30] text-white font-bold shadow-xs"
                : "text-red-700 hover:text-red-900"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span>P1 Critical</span>
          </button>
        </div>
      </div>

      {/* ─── CORNER 2: TOP-RIGHT (Context Actions: Calibrate Regression, Inspect Equities, Dismiss) ─── */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Dismiss Active Relation Button */}
        {selectedNodeId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectNode(null);
            }}
            className="px-2.5 py-1 rounded-xl apple-glass hover:bg-white text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-white/80 text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:border-blue-300"
            title="Dismiss active relation and return to primary radial graph"
          >
            <RotateCcw className="w-3 h-3 text-blue-600" />
            <span>Dismiss Relation</span>
          </button>
        )}

        {/* Inspect Exposed Equities Button */}
        {(() => {
          const selectedNodeData = scenario.radialNodes.find((n) => n.id === selectedNodeId) ||
            (scenario.centerNode?.id === selectedNodeId ? scenario.centerNode : null);
          if (selectedNodeData?.tickers && selectedNodeData.tickers.length > 0 && onOpenStockDrilldown) {
            return (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenStockDrilldown(selectedNodeData);
                }}
                className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_16px_rgba(37,99,235,0.25)] border border-blue-500 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Inspect live company pricing and transmission sensitivity"
              >
                <Building2 className="w-3 h-3 text-white" />
                <span>Inspect {selectedNodeData.title}</span>
              </button>
            );
          }
          return null;
        })()}

        {/* Calibrate Regression Modal Button */}
        {onOpenRegressionModal && (
          <button
            onClick={onOpenRegressionModal}
            className="px-2.5 py-1 rounded-xl apple-glass hover:bg-white text-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-white/80 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:border-blue-300"
            title="Calibrate econometric regression equation"
          >
            <Calculator className="w-3.5 h-3.5 text-[#007AFF]" />
            <span>Calibrate Regression</span>
          </button>
        )}
      </div>

      {/* ─── CORNER 3: BOTTOM-LEFT (Subtle Topology Arc Legend) ─── */}
      <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl apple-glass text-[10.5px] font-medium text-slate-600 border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] pointer-events-auto">
        <span className="flex items-center gap-1 text-red-600 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>P1 Critical (Top Arc)</span>
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1 text-amber-700 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>P2 High (Bottom Arc)</span>
        </span>
      </div>

      {/* ─── CORNER 4: BOTTOM-RIGHT (Docked Zoom & Fullscreen Controls) ─── */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-0.5 apple-glass rounded-xl p-0.5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-white/80">
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.4))}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>

          <span className="px-1 text-[11px] font-bold text-slate-700 min-w-[36px] text-center select-none font-mono">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={() => setZoom((z) => Math.min(z + 0.15, 2.8))}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-3 h-3" />
          </button>

          <button
            onClick={handleResetView}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Reset View to Center"
          >
            <RotateCcw className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Fullscreen Action Button */}
        {isFullscreen ? (
          <button
            onClick={handleToggleFullscreen}
            className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg border border-slate-700 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Exit Fullscreen Mode (Esc)"
          >
            <Minimize2 className="w-3 h-3" />
            <span>Exit Fullscreen</span>
            <kbd className="px-1 py-0.2 bg-slate-800 border border-slate-700 rounded text-[9px] text-slate-300 font-mono">
              Esc
            </kbd>
          </button>
        ) : (
          <button
            onClick={handleToggleFullscreen}
            className="px-2.5 py-1 rounded-xl apple-glass hover:bg-white text-slate-700 hover:text-slate-900 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-white/80 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Open Fullscreen Topology Canvas"
          >
            <Maximize2 className="w-3 h-3 text-[#007AFF]" />
            <span>Fullscreen</span>
          </button>
        )}
      </div>


      {/* Dynamic Interaction Status Pill in Bottom-Center */}
      <div className="absolute bottom-4 inset-x-0 mx-auto w-fit z-20 flex items-center gap-2 pointer-events-auto">
        {selectedNodeId ? (
          <div className="px-3.5 py-1.5 rounded-2xl apple-glass border border-blue-200/90 shadow-[0_4px_16px_rgba(0,122,255,0.1)] text-xs text-slate-700 flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>
              Relation active for{" "}
              <strong className="text-blue-700">
                {nodes.find((n) => n.id === selectedNodeId)?.data.title || "Selected Node"}
              </strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] text-slate-500 font-medium">Click another node to switch • Click canvas to dismiss</span>
            <button
              onClick={() => onSelectNode(null)}
              className="p-1 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              title="Dismiss relation"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="px-3.5 py-1.5 rounded-2xl apple-glass border border-white/80 text-[11px] text-slate-500 flex items-center gap-2 shadow-xs pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Click any node to form dynamic relations • Click canvas or another node to dismiss</span>
          </div>
        )}
      </div>

      {/* ─── SVG TOPOLOGY GRAPH CANVAS ─── */}
      <svg
        className="w-full h-full absolute inset-0 select-none overflow-hidden"
        viewBox={isFullscreen ? "-900 -500 1800 1000" : "-620 -350 1240 700"}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle Radial Glow filter for selected node */}
          <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <linearGradient id="edge-red-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f87171" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="edge-blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="root-halo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Global Pan & Zoom Transformation Group */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* 1. EDGES / CONNECTING TRANSMISSION PATHS */}
          <g className="edges-layer">
            {edges.map((edge) => {
              const isExtended = edge.isExtendedEdge;
              const isSelected =
                selectedNodeId === edge.source.id || selectedNodeId === edge.target.id;

              return (
                <g key={edge.id} className="transition-all duration-300">
                  {/* Background Edge Line */}
                  <line
                    x1={edge.source.x}
                    y1={edge.source.y}
                    x2={edge.target.x}
                    y2={edge.target.y}
                    stroke={isSelected ? "#007AFF" : isExtended ? "#94a3b8" : "#cbd5e1"}
                    strokeWidth={isSelected ? 3.5 : isExtended ? 1.8 : 2.2}
                    strokeDasharray={isExtended ? "4,4" : undefined}
                    strokeOpacity={isSelected ? 0.95 : 0.65}
                  />

                  {/* Flow Particle indicator in middle of primary edge */}
                  {!isExtended && (
                    <circle
                      cx={(edge.source.x + edge.target.x) / 2}
                      cy={(edge.source.y + edge.target.y) / 2}
                      r={3.5}
                      fill={edge.target.data.badge === "Positive" ? "#16a34a" : "#ef4444"}
                      className="animate-pulse opacity-85"
                    />
                  )}

                  {/* Edge horizon label badge */}
                  {edge.timeHorizon && (
                    <g transform={`translate(${(edge.source.x + edge.target.x) / 2}, ${(edge.source.y + edge.target.y) / 2})`}>
                      <rect
                        x="-28"
                        y="-9"
                        width="56"
                        height="18"
                        rx="6"
                        fill="rgba(255, 255, 255, 0.94)"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        className="shadow-2xs"
                      />
                      <text
                        x="0"
                        y="3.5"
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="600"
                        fill="#64748b"
                        className="font-sans select-none"
                      >
                        {edge.timeHorizon}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* 2. NODES LAYER */}
          <g className="nodes-layer">
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isRoot = node.level === 0;
              const isRadial = node.level === 1;
              const isChild = node.level === 2;
              const isNodeExtended =
                selectedNodeId === node.id ||
                Boolean(
                  node.data.extendedChildren &&
                    node.data.extendedChildren.some((c) => c.id === selectedNodeId)
                );

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="transition-transform duration-200 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedNodeId === node.id) {
                      onSelectNode(null);
                    } else {
                      onSelectNode(node.data);
                    }
                  }}
                  onMouseEnter={() => setHoveredNode(node.data)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* ROOT CENTRAL NODE (LEVEL 0) */}
                  {isRoot && (
                    <g className="root-node-group">
                      <circle r="56" fill="url(#root-halo)" className="animate-ping opacity-35" />
                      <circle r="48" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1.5" strokeOpacity="0.6" />

                      <circle
                        r={node.radius}
                        fill="url(#edge-red-gradient)"
                        stroke="#b91c1c"
                        strokeWidth="3"
                        filter="url(#node-glow)"
                      />

                      <foreignObject x="-18" y="-18" width="36" height="36" className="pointer-events-none">
                        <div className="w-full h-full flex items-center justify-center">
                          {renderNodeIcon(node.data, "lg")}
                        </div>
                      </foreignObject>

                      {/* Shock Metric & Title Pill Below Node */}
                      <g transform="translate(0, 50)">
                        <rect
                          x="-80"
                          y="0"
                          width="160"
                          height="42"
                          rx="12"
                          fill="rgba(255, 255, 255, 0.96)"
                          stroke="#ef4444"
                          strokeWidth="1.5"
                          className="shadow-lg"
                        />
                        <text
                          x="0"
                          y="17"
                          textAnchor="middle"
                          fontSize="12.5"
                          fontWeight="700"
                          fill="#0f172a"
                          className="font-sans"
                        >
                          {node.data.title}
                        </text>
                        <text
                          x="0"
                          y="32"
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="800"
                          fill="#dc2626"
                          className="font-sans"
                        >
                          {node.data.metric} • Root Shock
                        </text>
                      </g>
                    </g>
                  )}

                  {/* 1ST-LEVEL RADIAL NODES (LEVEL 1) */}
                  {isRadial && (
                    <g className="radial-node-group">
                      {isSelected && (
                        <circle
                          r={node.radius + 7}
                          fill="none"
                          stroke="#007AFF"
                          strokeWidth="2.5"
                          strokeDasharray="4,4"
                          className="animate-spin"
                          style={{ animationDuration: "12s" }}
                        />
                      )}

                      <circle
                        r={node.radius}
                        fill="rgba(255, 255, 255, 0.95)"
                        stroke={isSelected ? "#007AFF" : node.color}
                        strokeWidth={isSelected ? 3 : 2}
                        className="shadow-md"
                      />

                      <foreignObject x="-13" y="-13" width="26" height="26" className="pointer-events-none">
                        <div className="w-full h-full flex items-center justify-center text-slate-800">
                          {renderNodeIcon(node.data, "md")}
                        </div>
                      </foreignObject>

                      {/* Floating Info Pill Below Node */}
                      <g transform="translate(0, 36)">
                        <rect
                          x="-72"
                          y="0"
                          width="144"
                          height="36"
                          rx="11"
                          fill="rgba(255, 255, 255, 0.94)"
                          stroke={isSelected ? "#007AFF" : "#e2e8f0"}
                          strokeWidth="1"
                          className="shadow-xs"
                        />
                        <text
                          x="0"
                          y="15"
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="700"
                          fill="#1e293b"
                          className="font-sans"
                        >
                          {node.data.title.length > 18 ? `${node.data.title.slice(0, 16)}...` : node.data.title}
                        </text>
                        <text
                          x="0"
                          y="29"
                          textAnchor="middle"
                          fontSize="10.5"
                          fontWeight="700"
                          fill={node.data.metricColor === "green" ? "#16a34a" : "#dc2626"}
                          className="font-sans"
                        >
                          {node.data.metric}
                        </text>
                      </g>

                      {/* Interactive "+" / "-" EXTEND NODE RELATION BUTTON */}
                      <g
                        transform="translate(22, -22)"
                        onClick={(e) => handleToggleExtend(node.id, e)}
                        className="hover:scale-115 transition-transform cursor-pointer"
                      >
                        <circle
                          r="11"
                          fill={isNodeExtended ? "#3b82f6" : "#ffffff"}
                          stroke={isNodeExtended ? "#1d4ed8" : "#94a3b8"}
                          strokeWidth="1.5"
                          className="shadow-xs"
                        />
                        {isNodeExtended ? (
                          <line x1="-4.5" y1="0" x2="4.5" y2="0" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                        ) : (
                          <>
                            <line x1="-4.5" y1="0" x2="4.5" y2="0" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                            <line x1="0" y1="-4.5" x2="0" y2="4.5" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                          </>
                        )}
                      </g>

                      {/* Priority Badge on top left of node */}
                      <g transform="translate(-22, -22)">
                        <rect
                          x="-13"
                          y="-7"
                          width="26"
                          height="15"
                          rx="4"
                          fill={node.data.priority === "P1 Critical" ? "#fee2e2" : "#fef3c7"}
                          stroke={node.data.priority === "P1 Critical" ? "#fca5a5" : "#fde68a"}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="3.5"
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="800"
                          fill={node.data.priority === "P1 Critical" ? "#b91c1c" : "#b45309"}
                          className="font-mono"
                        >
                          {node.data.priority === "P1 Critical" ? "P1" : "P2"}
                        </text>
                      </g>
                    </g>
                  )}

                  {/* 2ND-LEVEL EXTENDED SATELLITE NODES (LEVEL 2 - RELATIONS LIKE IMAGE 2) */}
                  {isChild && (
                    <g className="child-node-group animate-in fade-in zoom-in-75 duration-300">
                      <circle
                        r={node.radius}
                        fill="rgba(255, 255, 255, 0.95)"
                        stroke={isSelected ? "#007AFF" : "#3b82f6"}
                        strokeWidth="1.8"
                        className="shadow-xs"
                      />

                      <foreignObject x="-9" y="-9" width="18" height="18" className="pointer-events-none">
                        <div className="w-full h-full flex items-center justify-center text-blue-600">
                          {renderNodeIcon(node.data, "sm")}
                        </div>
                      </foreignObject>

                      {/* Satellite Name & Metric Tag */}
                      <g transform="translate(0, 30)">
                        <rect
                          x="-60"
                          y="0"
                          width="120"
                          height="30"
                          rx="9"
                          fill="rgba(255, 255, 255, 0.95)"
                          stroke="#cbd5e1"
                          strokeWidth="1"
                          className="shadow-2xs"
                        />
                        <text
                          x="0"
                          y="13"
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight="700"
                          fill="#334155"
                          className="font-sans"
                        >
                          {node.data.title.length > 16 ? `${node.data.title.slice(0, 14)}...` : node.data.title}
                        </text>
                        <text
                          x="0"
                          y="24"
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="800"
                          fill={node.data.metricColor === "green" ? "#16a34a" : "#ef4444"}
                          className="font-mono"
                        >
                          {node.data.metric}
                        </text>
                      </g>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* ─── HOVER INSPECTION CARD (Apple Glass Modal on node hover) ─── */}
      {hoveredNode && (
        <div className="absolute bottom-4 right-4 z-30 max-w-sm p-4 rounded-3xl apple-glass-card border border-white/85 shadow-xl animate-in fade-in zoom-in-95 duration-150 pointer-events-auto">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {hoveredNode.priority || "Causal Entity"}
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {hoveredNode.category.replace("_", " ")}
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900 leading-tight">
            {hoveredNode.title}
          </h4>
          <div
            className={`text-lg font-extrabold my-0.5 ${
              hoveredNode.metricColor === "green"
                ? "text-emerald-600"
                : hoveredNode.metricColor === "blue"
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            {hoveredNode.metric}
          </div>

          {hoveredNode.causalReason && (
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/70">
              {hoveredNode.causalReason}
            </p>
          )}

          {hoveredNode.tickers && hoveredNode.tickers.length > 0 && onOpenStockDrilldown && (
            <button
              onClick={() => onOpenStockDrilldown(hoveredNode)}
              className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 border border-blue-200 transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Inspect {hoveredNode.tickers.length} Exposed Equities</span>
            </button>
          )}

          {hoveredNode.refLinks && hoveredNode.refLinks.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>{hoveredNode.refLinks.length} External Filings</span>
              <span className="text-blue-600 font-semibold flex items-center gap-1">
                View Sources <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ─── STANDARD INLINE CANVAS CONTAINER ─── */}
      <div className="relative w-full rounded-[24px] apple-mesh-bg border border-slate-200/80 overflow-hidden select-none transition-all duration-300 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] flex-1 min-h-[440px] h-full">
        {renderCanvasContent()}
      </div>

      {/* ─── TRUE FULLSCREEN OVERLAY VIA REACT PORTAL ─── */}
      {isFullscreen &&
        createPortal(
          <div className="fixed inset-0 z-[999999] w-screen h-screen bg-[#f8fafc] flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
            {renderCanvasContent()}
          </div>,
          document.body
        )}
    </>
  );
};
