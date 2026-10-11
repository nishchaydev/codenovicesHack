'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Zap, Building2, TrendingUp, DollarSign } from 'lucide-react';

export type ClayNodeType = 'shockSource' | 'sector' | 'macro' | 'downstream';

export interface ClayNodeData extends Record<string, unknown> {
  label: string;
  category: string;
  nodeType: ClayNodeType;
  ticker?: string;
  impactScore?: number;
  description?: string;
  evidence?: string;
  reasoning?: string[];
}

const nodeStyles: Record<ClayNodeType, { bg: string; border: string; badgeBg: string; text: string; icon: any }> = {
  shockSource: {
    bg: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white',
    border: 'border-amber-300/40',
    badgeBg: 'bg-amber-900/40 text-amber-100',
    text: 'text-white',
    icon: Zap,
  },
  macro: {
    bg: 'bg-gradient-to-br from-cyan-600 to-teal-700 text-white',
    border: 'border-cyan-300/40',
    badgeBg: 'bg-cyan-900/40 text-cyan-100',
    text: 'text-white',
    icon: TrendingUp,
  },
  sector: {
    bg: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white',
    border: 'border-blue-300/40',
    badgeBg: 'bg-blue-900/40 text-blue-100',
    text: 'text-white',
    icon: Building2,
  },
  downstream: {
    bg: 'bg-gradient-to-br from-purple-600 to-indigo-800 text-white',
    border: 'border-purple-300/40',
    badgeBg: 'bg-purple-900/40 text-purple-100',
    text: 'text-white',
    icon: DollarSign,
  },
};

export const ClayNodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as unknown as ClayNodeData;
  const style = nodeStyles[nodeData.nodeType || 'downstream'];
  const Icon = style.icon;

  return (
    <div
      className={`relative px-4 py-3 rounded-full min-w-[170px] shadow-xl border backdrop-blur-md transition-all duration-200 ${
        style.bg
      } ${style.border} ${
        props.selected ? 'ring-4 ring-white/50 scale-105 shadow-2xl' : 'hover:scale-[1.02]'
      }`}
      style={{
        boxShadow: props.selected
          ? '0 12px 24px rgba(0,0,0,0.35), inset 1.5px 1.5px 3px rgba(255,255,255,0.5), inset -2px -2px 4px rgba(0,0,0,0.3)'
          : '6px 8px 16px rgba(0,0,0,0.25), inset 1px 1px 2px rgba(255,255,255,0.4), inset -2px -2px 4px rgba(0,0,0,0.25)',
      }}
    >
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-white !border-2 !border-slate-800" />
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-white !border-2 !border-slate-800" />

      <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-full ${style.badgeBg} shadow-inner`}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-tight leading-none drop-shadow-sm">
            {nodeData.label}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] opacity-90 uppercase tracking-wider font-bold">
              {nodeData.category}
            </span>
            {nodeData.ticker && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-black/30 text-white font-mono font-bold">
                {nodeData.ticker}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ClayNodeComponent.displayName = 'ClayNodeComponent';
