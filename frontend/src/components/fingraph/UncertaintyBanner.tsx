import React from 'react'
import {
  ShieldCheck,
  BrainCircuit,
  BarChart3,
  GitFork,
  SlidersHorizontal,
  Info,
} from 'lucide-react'
import type { EventDataset } from '../../types/fingraph'
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

  const backwardCount = nodes.filter((n) => n.nodeType === 'backward_cause').length
  const forwardCount = nodes.filter((n) => n.nodeType === 'forward_impact').length

  return (
    <div className="w-full rounded-2xl bg-white/95 border border-[#e0e0e0] p-3 shadow-md flex flex-col gap-2.5 backdrop-blur-md">
      {/* 1. Summary Metrics Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Metric 1: Total Entities Mapped */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#f8f9fa] border border-[#e9ecef]">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Total Entities
            </div>
            <div className="text-xs font-bold font-mono text-slate-900 flex items-baseline gap-1">
              <span>{totalCount} Nodes</span>
              <span className="text-[10px] text-slate-400 font-normal">
                ({dataset.edges.length} Edges)
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Fact vs. Inference Ratio */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#f8f9fa] border border-[#e9ecef]">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Fact / Inference Ratio
            </div>
            <div className="text-xs font-bold font-mono text-slate-800 truncate">
              <span className="text-emerald-700">{factRatio}% Facts</span>
              <span className="text-slate-300 mx-1">|</span>
              <span className="text-amber-700">{inferenceRatio}% Inferred</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Average Confidence Score */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#f8f9fa] border border-[#e9ecef]">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <BrainCircuit className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Model Confidence
            </div>
            <div className="text-xs font-bold font-mono text-indigo-700">
              {avgConfidence}%
            </div>
          </div>
        </div>

        {/* Metric 4: Propagation Reach */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#f8f9fa] border border-[#e9ecef]">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
            <GitFork className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Propagation Reach
            </div>
            <div className="text-[11px] font-bold font-mono text-slate-700 flex items-center gap-1">
              <span className="text-blue-600">{backwardCount} Bkwd</span>
              <span className="text-slate-300">←</span>
              <span className="text-slate-900 font-bold">Root</span>
              <span className="text-slate-300">→</span>
              <span className="text-emerald-600">{forwardCount} Fwd</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Truth Status Filters & 3. Methodology Disclaimer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-1 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1 font-semibold">
            <SlidersHorizontal className="w-3 h-3 text-blue-600" />
            Filter:
          </span>

          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={cn(
              'px-2.5 py-0.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer',
              currentFilter === 'all'
                ? 'bg-slate-900 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            )}
          >
            Show All
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('facts_only')}
            className={cn(
              'px-2.5 py-0.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1',
              currentFilter === 'facts_only'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Facts Only</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('high_confidence')}
            className={cn(
              'px-2.5 py-0.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1',
              currentFilter === 'high_confidence'
                ? 'bg-amber-100 text-amber-800 border border-amber-300 font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-amber-700 hover:bg-amber-50'
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>High Confidence (&gt;75%)</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-500">
          <Info className="w-3 h-3 text-blue-500 shrink-0" />
          <span className="line-clamp-1">
            Inferred paths are probabilistic market projections based on supply-chain elasticity models.
          </span>
        </div>
      </div>
    </div>
  )
}
