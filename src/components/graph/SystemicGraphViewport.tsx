'use client';

import React from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ClayNodeComponent } from './ClayNodeComponent';

const nodeTypes = {
  clayNode: ClayNodeComponent,
};

interface SystemicGraphViewportProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onNodeClick: NodeMouseHandler;
  onEdgeClick: EdgeMouseHandler;
}

export default function SystemicGraphViewport({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onEdgeClick,
}: SystemicGraphViewportProps) {
  return (
    <div className="flex-1 w-full h-full relative rounded-b-2xl overflow-hidden bg-clay-bg/30">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="var(--clay-text-muted)" />
        <Controls className="!bg-[#181D27] !border !border-white/10 !rounded-xl !shadow-2xl overflow-hidden [&>button]:!bg-[#181D27] [&>button]:!border-b [&>button]:!border-white/10 [&>button:hover]:!bg-[#242B38] [&>button>svg]:!fill-slate-200 [&>button>svg]:!stroke-slate-200" />
      </ReactFlow>
    </div>
  );
}
