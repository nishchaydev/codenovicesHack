import React, { useEffect, useRef, useState } from "react";
import { GraphNode, GraphLink } from "@/types/fingraph/types";

interface InteractiveGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
  onSelectNode: (node: GraphNode | null) => void;
  onSelectLink: (link: GraphLink | null) => void;
  selectedNodeId: string | null;
  selectedAppId: string | null;
}

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Particle {
  sourceId: string;
  targetId: string;
  progress: number;
  speed: number;
  color: string;
}

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({
  nodes,
  links,
  onSelectNode,
  onSelectLink,
  selectedNodeId,
  selectedAppId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Camera Pan and Zoom
  const [zoom, setZoom] = useState<number>(0.95);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingCanvas = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const draggedNode = useRef<SimNode | null>(null);

  const simNodesRef = useRef<Map<string, SimNode>>(new Map());
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Compute connected node IDs if an app is selected
  const connectedNodeIds = React.useMemo(() => {
    if (!selectedAppId) return null;
    const set = new Set<string>([selectedAppId]);
    links.forEach((l) => {
      const srcId = typeof l.source === "object" ? l.source.id : l.source;
      const tgtId = typeof l.target === "object" ? l.target.id : l.target;
      if (srcId === selectedAppId) set.add(tgtId);
      if (tgtId === selectedAppId) set.add(srcId);
    });
    return set;
  }, [selectedAppId, links]);

  // Sync physics simulation nodes
  useEffect(() => {
    const existing = simNodesRef.current;
    const width = containerRef.current?.clientWidth || 900;
    const height = containerRef.current?.clientHeight || 650;
    if (canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }
    const centerX = width / 2;
    const centerY = height / 2;

    const newMap = new Map<string, SimNode>();
    nodes.forEach((n, idx) => {
      const radius = Math.max(12, Math.min(24, n.val * 0.7));
      if (existing.has(n.id)) {
        const prev = existing.get(n.id)!;
        newMap.set(n.id, {
          ...n,
          x: prev.x,
          y: prev.y,
          vx: prev.vx,
          vy: prev.vy,
          radius,
        });
      } else {
        const angle = (idx / nodes.length) * 2 * Math.PI;
        const dist = 180 + (idx % 3) * 80;
        newMap.set(n.id, {
          ...n,
          x: centerX + Math.cos(angle) * dist,
          y: centerY + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius,
        });
      }
    });

    simNodesRef.current = newMap;
  }, [nodes]);

  // Particles for active shocks
  useEffect(() => {
    const activeLinks = links.filter((l) => l.is_active_shock);
    const newParticles: Particle[] = [];
    activeLinks.forEach((l) => {
      const srcId = typeof l.source === "object" ? l.source.id : l.source;
      const tgtId = typeof l.target === "object" ? l.target.id : l.target;
      for (let i = 0; i < 2; i++) {
        newParticles.push({
          sourceId: srcId,
          targetId: tgtId,
          progress: Math.random(),
          speed: 0.007 + Math.random() * 0.005,
          color: "#0066ff",
        });
      }
    });
    particlesRef.current = newParticles;
  }, [links]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const tick = () => {
      time += 0.03;
      const simNodes = Array.from(simNodesRef.current.values());
      const nodeMap = simNodesRef.current;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Center gravity
      simNodes.forEach((n) => {
        if (draggedNode.current?.id === n.id) return;
        const dx = centerX - n.x;
        const dy = centerY - n.y;
        n.vx += dx * 0.0008;
        n.vy += dy * 0.0008;
      });

      // 2. Repulsion with safe minimum distance
      for (let i = 0; i < simNodes.length; i++) {
        for (let j = i + 1; j < simNodes.length; j++) {
          const n1 = simNodes[i];
          const n2 = simNodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const safeDist = Math.max(35, dist);

          if (dist < 380) {
            const force = (1600 / (safeDist * safeDist)) * 4.5;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (draggedNode.current?.id !== n1.id) {
              n1.vx -= fx;
              n1.vy -= fy;
            }
            if (draggedNode.current?.id !== n2.id) {
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }
      }

      // 3. Link Spring Attraction
      links.forEach((l) => {
        const srcId = typeof l.source === "object" ? l.source.id : l.source;
        const tgtId = typeof l.target === "object" ? l.target.id : l.target;
        const n1 = nodeMap.get(srcId);
        const n2 = nodeMap.get(tgtId);
        if (!n1 || !n2) return;

        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 95 + (1 - l.weight) * 45;
        const force = (dist - targetDist) * 0.006 * l.weight;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (draggedNode.current?.id !== n1.id) {
          n1.vx += fx;
          n1.vy += fy;
        }
        if (draggedNode.current?.id !== n2.id) {
          n2.vx += fx;
          n2.vy += fy;
        }
      });

      // 4. Integration with strict velocity clamping
      simNodes.forEach((n) => {
        if (draggedNode.current?.id === n.id) return;
        n.vx = Math.max(-6, Math.min(6, n.vx * 0.85));
        n.vy = Math.max(-6, Math.min(6, n.vy * 0.85));
        n.x += n.vx;
        n.y += n.vy;
      });

      // --- Draw Canvas ---
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Faint Gallery Grid Lines
      ctx.strokeStyle = "#f3f3f3";
      ctx.lineWidth = 1;
      const gridSize = 48;
      const startX = -1200;
      const endX = width + 1200;
      const startY = -1200;
      const endY = height + 1200;

      ctx.beginPath();
      for (let x = startX; x <= endX; x += gridSize) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
      }
      for (let y = startY; y <= endY; y += gridSize) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
      }
      ctx.stroke();

      // Draw Links
      links.forEach((l) => {
        const srcId = typeof l.source === "object" ? l.source.id : l.source;
        const tgtId = typeof l.target === "object" ? l.target.id : l.target;
        const n1 = nodeMap.get(srcId);
        const n2 = nodeMap.get(tgtId);
        if (!n1 || !n2) return;

        const isFiltered =
          connectedNodeIds !== null &&
          (!connectedNodeIds.has(srcId) || !connectedNodeIds.has(tgtId));

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);

        if (isFiltered) {
          ctx.strokeStyle = "#f0f0f0";
          ctx.lineWidth = 0.8;
        } else if (l.is_active_shock) {
          ctx.strokeStyle = "#141414";
          ctx.lineWidth = 2.4;
        } else {
          ctx.strokeStyle = "#e0e0e0";
          ctx.lineWidth = 1;
          if (l.confidence < 0.8) {
            ctx.setLineDash([4, 4]);
          }
        }
        ctx.stroke();
        ctx.restore();
      });

      // Draw Particles along active shocks
      particlesRef.current.forEach((p) => {
        const n1 = nodeMap.get(p.sourceId);
        const n2 = nodeMap.get(p.targetId);
        if (!n1 || !n2) return;

        p.progress = (p.progress + p.speed) % 1;
        const px = n1.x + (n2.x - n1.x) * p.progress;
        const py = n1.y + (n2.y - n1.y) * p.progress;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#0066ff";
        ctx.fill();
        ctx.restore();
      });

      // Draw Nodes
      simNodes.forEach((n) => {
        const isSelected = n.id === selectedNodeId || n.id === selectedAppId;
        const isConnected =
          connectedNodeIds === null || connectedNodeIds.has(n.id);

        ctx.save();
        ctx.globalAlpha = isConnected ? 1.0 : 0.2;

        // Selected halo
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = "#0066ff";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Active shock ring
        if (n.risk_score > 30) {
          const pulseR = n.radius + (Math.sin(time * 3 + n.risk_score) + 1) * 6;
          ctx.beginPath();
          ctx.arc(n.x, n.y, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(239, 68, 68, 0.35)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Node Circle / Squircle Fill
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? "#141414" : n.risk_score > 60 ? "#ffffff" : "#ffffff";
        ctx.fill();

        // Node Border (Hairline)
        ctx.strokeStyle = isSelected
          ? "#141414"
          : n.risk_score > 40
          ? "#ef4444"
          : "#e0e0e0";
        ctx.lineWidth = isSelected ? 2 : 1.5;
        ctx.stroke();

        // Inner icon / initial dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? "#ffffff" : n.risk_score > 40 ? "#ef4444" : "#141414";
        ctx.fill();

        // Label
        ctx.font = isSelected ? "bold 12px -apple-system, sans-serif" : "11px -apple-system, sans-serif";
        ctx.fillStyle = isSelected ? "#0066ff" : "#141414";
        ctx.textAlign = "center";
        ctx.fillText(n.name, n.x, n.y + n.radius + 14);

        // Subtitle / Indicator
        if (n.risk_score > 0) {
          ctx.font = "bold 10px monospace";
          ctx.fillStyle = "#ef4444";
          ctx.fillText(`⚡ ${n.risk_score}`, n.x, n.y + n.radius + 25);
        } else if (n.ticker) {
          ctx.font = "10px monospace";
          ctx.fillStyle = "#707070";
          ctx.fillText(n.ticker, n.x, n.y + n.radius + 25);
        }

        ctx.restore();
      });

      ctx.restore();
      animationFrameId.current = requestAnimationFrame(tick);
    };

    animationFrameId.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [links, zoom, pan, selectedNodeId, selectedAppId, connectedNodeIds]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle Wheel Zoom with non-passive listener to prevent browser warnings
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoom((prev) => Math.min(2.5, Math.max(0.35, prev * zoomFactor)));
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;

    const simNodes = Array.from(simNodesRef.current.values());
    let hitNode: SimNode | null = null;
    for (let i = simNodes.length - 1; i >= 0; i--) {
      const n = simNodes[i];
      const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
      if (dist <= n.radius + 6) {
        hitNode = n;
        break;
      }
    }

    if (hitNode) {
      draggedNode.current = hitNode;
      onSelectNode(hitNode);
      onSelectLink(null);
    } else {
      let hitLink: GraphLink | null = null;
      for (const l of links) {
        const srcId = typeof l.source === "object" ? l.source.id : l.source;
        const tgtId = typeof l.target === "object" ? l.target.id : l.target;
        const n1 = simNodesRef.current.get(srcId);
        const n2 = simNodesRef.current.get(tgtId);
        if (!n1 || !n2) continue;

        const d = distToSegment({ x: mouseX, y: mouseY }, { x: n1.x, y: n1.y }, { x: n2.x, y: n2.y });
        if (d < 8) {
          hitLink = l;
          break;
        }
      }

      if (hitLink) {
        onSelectLink(hitLink);
        onSelectNode(null);
      } else {
        isDraggingCanvas.current = true;
        dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
        onSelectNode(null);
        onSelectLink(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode.current && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      draggedNode.current.x = (e.clientX - rect.left - pan.x) / zoom;
      draggedNode.current.y = (e.clientY - rect.top - pan.y) / zoom;
      draggedNode.current.vx = 0;
      draggedNode.current.vy = 0;
    } else if (isDraggingCanvas.current) {
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    draggedNode.current = null;
    isDraggingCanvas.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[560px] bg-[var(--clay-surface)] overflow-hidden select-none cursor-grab active:cursor-grabbing border border-[var(--clay-border)] rounded-3xl shadow-lg"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full block"
      />

      {/* Floating Stadium Pill Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 clay-surface px-3 py-1.5 rounded-full text-xs text-[var(--text-primary)] shadow-md border border-[var(--clay-border)]">
        <button
          onClick={() => setZoom((z) => Math.min(2.5, z * 1.2))}
          className="clay-inset w-7 h-7 flex items-center justify-center rounded-full font-mono cursor-pointer hover:scale-105 active:scale-95 text-[var(--text-primary)] font-black"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.35, z * 0.8))}
          className="clay-inset w-7 h-7 flex items-center justify-center rounded-full font-mono cursor-pointer hover:scale-105 active:scale-95 text-[var(--text-primary)] font-black"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={() => {
            setZoom(0.95);
            setPan({ x: 0, y: 0 });
          }}
          className="clay-button-primary px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer"
          title="Reset View"
        >
          Reset
        </button>
        <span className="text-[10px] text-[var(--text-secondary)] font-mono pl-1 font-bold">
          {Math.round(zoom * 100)}%
        </span>
      </div>
    </div>
  );
};

function distToSegment(
  p: { x: number; y: number },
  v: { x: number; y: number },
  w: { x: number; y: number }
) {
  const l2 = (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}
