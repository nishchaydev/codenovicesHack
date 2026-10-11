'use client';

import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Zap, Building2, TrendingUp, DollarSign, Ship, Landmark, Factory } from 'lucide-react';

export type ClayNodeType = 'commodity' | 'geopolitical' | 'macro' | 'supply_chain' | 'financial_asset';

export interface ClayNodeData extends Record<string, unknown> {
  label: string;
  category: string;
  nodeType: ClayNodeType;
  ticker?: string;
  impactScore?: number;
  systemicImportance?: 'Chokepoint Hub' | 'Systemic Bellwether' | 'Peripheral Asset';
  description?: string;
  evidence?: string;
  reasoning?: string[];
  factType?: 'Verified Regulatory Filing / Fact' | 'LLM Probabilistic Inference';
  confidence?: number;
  sources?: Array<{ name: string; url: string; excerpt: string }>;
  timeLag?: string;
}

const nodeStyles: Record<
  ClayNodeType,
  {
    bg: string;
    border: string;
    badgeBg: string;
    text: string;
    icon: any;
    glow: string;
    categoryLabel: string;
  }
> = {
  // 🚢 Physical Chokepoints / Commodities (Amber)
  commodity: {
    bg: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white',
    border: 'border-amber-300/40',
    badgeBg: 'bg-amber-900/40 text-amber-100',
    text: 'text-white',
    icon: Ship,
    glow: 'rgba(245, 158, 11, 0.4)',
    categoryLabel: 'Chokepoint / Commodity',
  },
  // 🏛️ Regulatory / Geopolitical Sanctions (Red)
  geopolitical: {
    bg: 'bg-gradient-to-br from-rose-600 to-red-700 text-white',
    border: 'border-red-300/40',
    badgeBg: 'bg-red-950/40 text-red-100',
    text: 'text-white',
    icon: Landmark,
    glow: 'rgba(239, 68, 68, 0.4)',
    categoryLabel: 'Sanction / Geopolitical',
  },
  // 📊 Macro Indicators & FX (Cyan)
  macro: {
    bg: 'bg-gradient-to-br from-cyan-600 to-teal-700 text-white',
    border: 'border-cyan-300/40',
    badgeBg: 'bg-cyan-950/40 text-cyan-100',
    text: 'text-white',
    icon: TrendingUp,
    glow: 'rgba(6, 182, 212, 0.4)',
    categoryLabel: 'Macro & FX Rate',
  },
  // 🏭 Critical Supply Chain Nodes (Violet)
  supply_chain: {
    bg: 'bg-gradient-to-br from-purple-600 to-indigo-800 text-white',
    border: 'border-purple-300/40',
    badgeBg: 'bg-purple-950/40 text-purple-100',
    text: 'text-white',
    icon: Factory,
    glow: 'rgba(147, 51, 234, 0.4)',
    categoryLabel: 'Supply Chain Hub',
  },
  // 🏦 Credit, Sovereign Bonds & Liquid Assets (Emerald)
  financial_asset: {
    bg: 'bg-gradient-to-br from-emerald-600 to-teal-800 text-white',
    border: 'border-emerald-300/40',
    badgeBg: 'bg-emerald-950/40 text-emerald-100',
    text: 'text-white',
    icon: Landmark,
    glow: 'rgba(16, 185, 129, 0.4)',
    categoryLabel: 'Credit / Sovereign Bond',
  },
};

export const ClayNodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as unknown as ClayNodeData;
  const style = nodeStyles[nodeData.nodeType || 'commodity'] || nodeStyles.commodity;
  const Icon = style.icon;

  const isHub = nodeData.systemicImportance === 'Chokepoint Hub';
  const isBellwether = nodeData.systemicImportance === 'Systemic Bellwether';

  return (
    <div
      className={`relative rounded-3xl border transition-all duration-300 cursor-pointer ${
        isHub ? 'p-4 min-w-[220px]' : isBellwether ? 'p-3.5 min-w-[190px]' : 'p-3 min-w-[165px]'
      } ${style.bg} ${style.border} ${
        props.selected ? 'ring-4 ring-white/60 scale-105 shadow-2xl' : 'hover:scale-[1.02]'
      }`}
      style={{
        boxShadow: props.selected
          ? `0 14px 28px rgba(0,0,0,0.45), 0 0 20px ${style.glow}, inset 1.5px 1.5px 3px rgba(255,255,255,0.5)`
          : isHub
          ? `0 10px 22px rgba(0,0,0,0.35), 0 0 16px ${style.glow}, inset 1px 1px 2px rgba(255,255,255,0.4)`
          : '4px 6px 14px rgba(0,0,0,0.25), inset 1px 1px 2px rgba(255,255,255,0.35)',
      }}
    >
      {/* Dynamic Pulsing Status Beacon for Chokepoint Hubs */}
      {isHub && (
        <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white ring-2 ring-amber-400" />
        </div>
      )}

      {/* React Flow Handles for Horizontal DAG Flow: Left (Target) -> Right (Source) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-white !border-2 !border-slate-800 !-left-1.5"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-white !border-2 !border-slate-800 !-right-1.5"
      />

      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-2xl ${style.badgeBg} shadow-inner shrink-0 flex items-center justify-center`}>
          <Icon className={isHub ? 'w-5 h-5' : 'w-4 h-4'} />
        </div>

        <div className="flex flex-col text-left overflow-hidden">
          <span className={`font-black tracking-tight leading-tight drop-shadow-sm ${isHub ? 'text-sm' : 'text-xs'}`}>
            {nodeData.label}
          </span>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className="text-[9px] opacity-90 uppercase tracking-wider font-extrabold">
              {style.categoryLabel}
            </span>
            {nodeData.ticker && (
              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-black/35 text-white font-mono font-bold">
                {nodeData.ticker}
              </span>
            )}
          </div>
          {nodeData.impactScore !== undefined && (
            <div className="flex items-center gap-1.5 mt-1 text-[10px] opacity-90">
              <span className="font-mono font-bold">Impact: {nodeData.impactScore}/10</span>
              {nodeData.factType && (
                <span className="text-[8px] px-1 rounded bg-white/20 font-black">
                  {nodeData.factType.includes('Verified') ? 'FACT' : 'INFERRED'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ClayNodeComponent.displayName = 'ClayNodeComponent';
