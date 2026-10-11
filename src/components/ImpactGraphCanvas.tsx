import React, { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  BackgroundVariant,
  Handle,
  Position,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  TrendingUp,
  TrendingDown,
  Layers,
  Zap,
} from 'lucide-react'
import type { MarketPersona, MarketCategory } from './Navbar'

// Custom Node for Financial Events
const EventNode = ({ data }: { data: any }) => {
  return (
    <div className="min-w-[240px] rounded-xl bg-[#111726]/95 border-2 border-emerald-500/70 p-3 shadow-[0_0_20px_rgba(16,185,129,0.25)] backdrop-blur-md">
      <Handle type="source" position={Position.Right} className="!bg-emerald-400 !w-2.5 !h-2.5 !border-none" />
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/60">
        <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
          <Zap className="w-3.5 h-3.5" />
          Primary Catalyst
        </span>
        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
          {data.severity || 'HIGH'}
        </span>
      </div>
      <div className="text-sm font-bold text-white leading-tight">
        {data.label}
      </div>
      <div className="text-[11px] text-slate-400 mt-1">
        {data.description}
      </div>
    </div>
  )
}

// Custom Node for Transmitted Asset Impact
const AssetNode = ({ data }: { data: any }) => {
  const isPositive = data.delta?.startsWith('+')
  return (
    <div className="min-w-[210px] rounded-xl bg-[#0D131F]/90 border border-slate-800 p-3 shadow-md hover:border-slate-700 transition-all">
      <Handle type="target" position={Position.Left} className="!bg-cyan-400 !w-2.5 !h-2.5 !border-none" />
      <Handle type="source" position={Position.Right} className="!bg-cyan-400 !w-2.5 !h-2.5 !border-none" />
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono text-slate-400 tracking-wider">
          {data.ticker}
        </span>
        <span
          className={`flex items-center gap-0.5 text-xs font-mono font-bold ${
            isPositive ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {data.delta}
        </span>
      </div>
      <div className="text-xs font-semibold text-slate-100">{data.label}</div>
      <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
        <span>Hop {data.hop || '1'}</span>
        <span className="font-mono text-cyan-400">P-Score: {data.score}</span>
      </div>
    </div>
  )
}

const nodeTypes = {
  eventNode: EventNode,
  assetNode: AssetNode,
}

interface ImpactGraphCanvasProps {
  persona: MarketPersona
  category: MarketCategory
}

export const ImpactGraphCanvas: React.FC<ImpactGraphCanvasProps> = ({
  persona,
  category,
}) => {
  const { nodes, edges } = useMemo(() => {
    // Generate context-aware graph based on Persona & Category
    const isIndia = persona === 'IN'

    const rootEvent = isIndia
      ? {
          title: 'Monsoon Deficit & Crude Oil Spike',
          desc: 'RBI considers policy tightening while agri yields compress',
          severity: 'CRITICAL',
        }
      : {
          title: 'Federal Reserve Rate Pivot & Tech Tariffs',
          desc: 'Bond yields jump 18bps, shifting capital flows into defensive assets',
          severity: 'HIGH IMPACT',
        }

    const n: Node[] = [
      {
        id: '1',
        type: 'eventNode',
        position: { x: 50, y: 150 },
        data: {
          label: rootEvent.title,
          description: rootEvent.desc,
          severity: rootEvent.severity,
        },
      },
      // First Hop direct impact
      {
        id: '2',
        type: 'assetNode',
        position: { x: 380, y: 60 },
        data: {
          ticker: isIndia ? 'NSE: ONGC' : 'NYSE: XOM',
          label: isIndia ? 'Oil & Natural Gas Corp' : 'Exxon Mobil Corp',
          delta: '+5.4%',
          hop: '1',
          score: '0.94',
        },
      },
      {
        id: '3',
        type: 'assetNode',
        position: { x: 380, y: 240 },
        data: {
          ticker: isIndia ? 'NSE: RELIANCE' : 'NASDAQ: NVDA',
          label: isIndia ? 'Reliance Petrochem' : 'NVIDIA Semiconductor',
          delta: isIndia ? '+2.8%' : '-3.2%',
          hop: '1',
          score: '0.88',
        },
      },
      // Second Hop cascading impact
      {
        id: '4',
        type: 'assetNode',
        position: { x: 680, y: 20 },
        data: {
          ticker: isIndia ? 'NSE: MARUTI' : 'NASDAQ: TSLA',
          label: isIndia ? 'Maruti Suzuki Auto' : 'Tesla Motors',
          delta: '-2.1%',
          hop: '2 (Cascading)',
          score: '0.76',
        },
      },
      {
        id: '5',
        type: 'assetNode',
        position: { x: 680, y: 150 },
        data: {
          ticker: isIndia ? 'NSE: HDFCBANK' : 'NYSE: JPM',
          label: isIndia ? 'HDFC Bank Lending' : 'JPMorgan Chase & Co',
          delta: '+1.3%',
          hop: '2 (Credit Trans)',
          score: '0.81',
        },
      },
      {
        id: '6',
        type: 'assetNode',
        position: { x: 680, y: 280 },
        data: {
          ticker: isIndia ? 'MCX: GOLD' : 'COMEX: GC',
          label: 'Sovereign Gold Hedge',
          delta: '+3.9%',
          hop: '2 (Safe Haven)',
          score: '0.91',
        },
      },
    ]

    const e: Edge[] = [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: true,
        style: { stroke: '#10B981', strokeWidth: 2 },
      },
      {
        id: 'e1-3',
        source: '1',
        target: '3',
        animated: true,
        style: { stroke: '#06B6D4', strokeWidth: 2 },
      },
      {
        id: 'e2-4',
        source: '2',
        target: '4',
        animated: true,
        style: { stroke: '#F43F5E', strokeWidth: 1.5, strokeDasharray: '5,5' },
      },
      {
        id: 'e2-5',
        source: '2',
        target: '5',
        style: { stroke: '#64748B', strokeWidth: 1.5 },
      },
      {
        id: 'e3-6',
        source: '3',
        target: '6',
        animated: true,
        style: { stroke: '#F59E0B', strokeWidth: 2 },
      },
    ]

    return { nodes: n, edges: e }
  }, [persona, category])

  return (
    <div className="relative w-full h-[540px] rounded-2xl bg-[#0B0F17] border border-[#1E293B] shadow-2xl overflow-hidden">
      {/* Canvas top telemetry toolbar */}
      <div className="absolute top-3 left-4 z-10 flex items-center gap-3 bg-[#111726]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#1E293B] text-xs text-slate-300">
        <span className="flex items-center gap-1.5 font-mono text-cyan-400">
          <Layers className="w-3.5 h-3.5" />
          ACTIVE GRAPH: {persona === 'IN' ? 'NSE/BSE (DALAL ST)' : 'GLOBAL (WALL ST)'} • {category.toUpperCase()}
        </span>
        <span className="text-slate-600">|</span>
        <span className="font-mono text-slate-400">Transmissions: 5 Edges</span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1.5}
          color="#1E293B"
        />
        <Controls className="!bg-[#111726] !border-[#1E293B] !rounded-lg !fill-slate-300 shadow-xl" />
        <MiniMap
          nodeStrokeColor="#10B981"
          nodeColor="#111726"
          maskColor="rgba(11, 15, 23, 0.7)"
          className="!bg-[#0D131F] !border !border-[#1E293B] !rounded-lg"
        />
      </ReactFlow>
    </div>
  )
}
