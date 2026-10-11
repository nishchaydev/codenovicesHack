import React from 'react'
import {
  ShieldCheck,
  BrainCircuit,
  BarChart3,
  GitFork,
  SlidersHorizontal,
  Info,
} from 'lucide-react'
import type { EventDataset } from '../../types/graph'
import { cn } from '../../lib/utils'

export type VerificationFilter = 'all' | 'facts_only' | 'high_confidence'

interface UncertaintyBannerProps {
  dataset: EventDataset
  currentFilter: VerificationFilter
  onFilterChange: (filter: VerificationFilter) => void
}

export const UncertaintyBanner: React.FC<UncertaintyBannerProps> = ({
  dataset,
  currentFilter,
  onFilterChange,
}) => {
  const nodes = dataset.nodes
  const totalCount = nodes.length

  // Calculate Verification Metrics
  const factCount = nodes.filter((n) => n.truthStatus === 'observed_fact').length
  const factRatio = totalCount > 0 ? Math.round((factCount / totalCount) * 100) : 0
  const inferenceRatio = 100 - factRatio

  const totalConfidence = nodes.reduce((sum, n) => sum + (n.confidenceScore || 0), 0)
  const avgConfidence = totalCount > 0 ? (totalConfidence / totalCount).toFixed(1) : '0'

  // Backward vs forward hop count
  const backwardCount = nodes.filter((n) => n.nodeType === 'backward_cause').length
  const forwardCount = nodes.filter((n) => n.nodeType === 'forward_impact').length

  return (
    <div className="w-full rounded-2xl bg-[#0D1424]/90 border border-[#1E293B] p-3.5 shadow-xl flex flex-col gap-3 backdrop-blur-md">
      {/* 1. Summary Metrics Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Metric 1: Total Entities Mapped */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#080D18] border border-[#1E293B]">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Total Entities Mapped
            </div>
            <div className="text-sm font-bold font-mono text-white flex items-baseline gap-1.5">
              <span>{totalCount} Nodes</span>
              <span className="text-[10px] text-slate-500 font-normal">
                ({dataset.edges.length} Edges)
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Fact vs. Inference Ratio */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#080D18] border border-[#1E293B]">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Fact vs. Inference Ratio
            </div>
            <div className="text-xs font-bold font-mono text-slate-200 truncate">
              <span className="text-emerald-400">{factRatio}% Facts</span>
              <span className="text-slate-600 mx-1">|</span>
              <span className="text-amber-400">{inferenceRatio}% Inferences</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Average Confidence Score */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#080D18] border border-[#1E293B]">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Avg Model Confidence
            </div>
            <div className="text-sm font-bold font-mono text-cyan-300">
              {avgConfidence}%
            </div>
          </div>
        </div>

        {/* Metric 4: Propagation Reach */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#080D18] border border-[#1E293B]">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Propagation Reach
            </div>
            <div className="text-xs font-bold font-mono text-slate-300 flex items-center gap-1">
              <span className="text-cyan-400">{backwardCount} Hop Bkwd</span>
              <span className="text-slate-600">←</span>
              <span className="text-amber-400 font-bold">Root</span>
              <span className="text-slate-600">→</span>
              <span className="text-emerald-400">{forwardCount} Hop Fwd</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Truth Status Filters & 3. Methodology Disclaimer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-[#1E293B]/70">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1 font-semibold">
            <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
            Truth Filter:
          </span>

          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer',
              currentFilter === 'all'
                ? 'bg-slate-700/80 text-white border border-slate-500 shadow-sm'
                : 'bg-[#080D18] text-slate-400 hover:text-slate-200 border border-[#1E293B]'
            )}
          >
            Show All
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('facts_only')}
            className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1',
              currentFilter === 'facts_only'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)] font-semibold'
                : 'bg-[#080D18] text-slate-400 hover:text-emerald-400 border border-[#1E293B]'
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Verified Facts Only 🟢</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('high_confidence')}
            className={cn(
              'px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1',
              currentFilter === 'high_confidence'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)] font-semibold'
                : 'bg-[#080D18] text-slate-400 hover:text-amber-400 border border-[#1E293B]'
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>High Confidence Only (&gt;75%) 🟡</span>
          </button>
        </div>

        {/* 3. Compliance & Methodology Disclaimer Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#080D18] border border-[#1E293B] text-[10px] font-mono text-slate-400">
          <Info className="w-3 h-3 text-cyan-400 shrink-0" />
          <span className="line-clamp-1">
            Inferred paths are probabilistic market projections based on supply-chain elasticity models, not financial advice.
          </span>
        </div>
      </div>
    </div>
  )
}
