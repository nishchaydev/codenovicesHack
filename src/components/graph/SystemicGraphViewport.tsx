'use client';

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  NodeMouseHandler,
  EdgeMouseHandler,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ClayNodeComponent } from './ClayNodeComponent';

const nodeTypes = {
  clayNode: ClayNodeComponent,
};

interface SystemicGraphViewportProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  onNodeClick: NodeMouseHandler;
  onEdgeClick?: EdgeMouseHandler;
  currentDayOffset?: number; // e.g. 0, 15, 45, 90
}

/**
 * Arranges nodes into 4 clear horizontal propagation tiers:
 * Tier 0 (x: 60):  [Trigger Event / Chokepoint (Left)]
 * Tier 1 (x: 360): [Direct Supply / Indicator Shock]
 * Tier 2 (x: 680): [Transmission Channel / Intermediate Node]
 * Tier 3 (x: 1000): [Systemic Impact / Downstream Equities (Right)]
 */
export function layoutHorizontalTiers(rawNodes: Node[], timeFilterDays: number = 90): Node[] {
  // Group nodes into tiers based on systemicImportance or nodeType
  const tier0: Node[] = [];
  const tier1: Node[] = [];
  const tier2: Node[] = [];
  const tier3: Node[] = [];

  rawNodes.forEach((node) => {
    const data = node.data as any;
    const importance = data?.systemicImportance;
    const nodeType = data?.nodeType;

    if (importance === 'Chokepoint Hub' || nodeType === 'commodity' || nodeType === 'geopolitical') {
      if (node.id.includes('trigger') || node.id.includes('center') || tier0.length === 0) {
        tier0.push(node);
      } else {
        tier1.push(node);
      }
    } else if (nodeType === 'macro' || nodeType === 'economic_variable') {
      tier1.push(node);
    } else if (nodeType === 'supply_chain' || importance === 'Systemic Bellwether') {
      tier2.push(node);
    } else {
      tier3.push(node);
    }
  });

  const tiers = [tier0, tier1, tier2, tier3];
  const xOffsets = [60, 360, 680, 1000];

  const positionedNodes: Node[] = [];

  tiers.forEach((tierGroup, tierIdx) => {
    const x = xOffsets[tierIdx];
    const totalInTier = tierGroup.length;
    const spacingY = 160;
    const startY = Math.max(40, 260 - (totalInTier * spacingY) / 2);

    tierGroup.forEach((node, itemIdx) => {
      const nodeTimeDays = (node.data as any)?.minTimeDays ?? 0;
      const isVisibleByTime = nodeTimeDays <= timeFilterDays;

      positionedNodes.push({
        ...node,
        position: {
          x,
          y: startY + itemIdx * spacingY,
        },
        style: {
          ...node.style,
          opacity: isVisibleByTime ? 1 : 0.25,
          filter: isVisibleByTime ? 'none' : 'grayscale(80%)',
          transition: 'all 0.4s ease-in-out',
        },
      });
    });
  });

  return positionedNodes;
}

export default function SystemicGraphViewport({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onEdgeClick,
  currentDayOffset = 90,
}: SystemicGraphViewportProps) {
  // Apply hierarchical tier layout & time-lag filter
  const tierLaidOutNodes = useMemo(() => {
    return layoutHorizontalTiers(nodes, currentDayOffset);
  }, [nodes, currentDayOffset]);

  // Refine edges with impact stroke width and velocity pulses
  const styledEdges = useMemo(() => {
    return edges.map((edge) => {
      const weight = (edge.data as any)?.weight ?? 0.8;
      const velocity = (edge.data as any)?.velocity ?? 'fast';
      const edgeDays = (edge.data as any)?.timeHorizonDays ?? 0;
      const isLit = edgeDays <= currentDayOffset;

      return {
        ...edge,
        animated: isLit, // Animated pulse indicating propagation velocity
        style: {
          stroke: isLit ? '#F59E0B' : '#334155',
          strokeWidth: Math.max(1.5, Math.min(5, weight * 4.5)),
          strokeDasharray: isLit ? undefined : '5,5',
          opacity: isLit ? 1 : 0.2,
          transition: 'stroke 0.4s, opacity 0.4s',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isLit ? '#F59E0B' : '#475569',
          width: 14,
          height: 14,
        },
      };
    });
  }, [edges, currentDayOffset]);

  return (
    <div className="flex-1 w-full h-full min-h-[580px] relative rounded-3xl overflow-hidden bg-[#0C1017] border border-[#1E293B] shadow-2xl">
      {/* Propagation Tiers Header Ribbon */}
      <div className="absolute top-3 left-4 right-4 z-10 flex items-center justify-between pointer-events-none px-4 py-2 rounded-2xl bg-[#111722]/80 backdrop-blur-md border border-[#1E293B]/60 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <span>[TIER 0] Trigger Event</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <span>[TIER 1] Direct Supply Shock</span>
        </div>
        <div className="flex items-center gap-1.5 text-purple-400 font-bold">
          <span>[TIER 2] Transmission Channel</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <span>[TIER 3] Systemic Asset Impact</span>
        </div>
      </div>

      <ReactFlow
        nodes={tierLaidOutNodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        fitView
        fitViewOptions={{ padding: 0.25 }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#1E293B" />
        <Controls className="!bg-[#151C28] !border !border-slate-800 !rounded-2xl !shadow-2xl overflow-hidden [&>button]:!bg-[#151C28] [&>button]:!border-b [&>button]:!border-slate-800 [&>button:hover]:!bg-[#1F2937] [&>button>svg]:!fill-slate-300 [&>button>svg]:!stroke-slate-300" />
      </ReactFlow>
    </div>
  );
}
