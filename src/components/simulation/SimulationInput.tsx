import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Loader2,
  Zap,
  ArrowRight,
  BrainCircuit,
} from 'lucide-react'
import type { EventDataset, GraphNode } from '../../types/graph'
import { cn } from '../../lib/utils'

interface SimulationInputProps {
  currentMarket: 'india' | 'us' | 'global'
  onGraphGenerated: (dataset: EventDataset, rootNode: GraphNode | null) => void
}

const HACKATHON_SUGGESTIONS = [
  {
    icon: '🇮🇳',
    text: 'RBI unexpectedly raises Repo Rate by 25 bps to curb inflation',
    market: 'india' as const,
  },
  {
    icon: '🚢',
    text: 'Geopolitical conflict shuts down Strait of Hormuz oil shipments',
    market: 'us' as const,
  },
  {
    icon: '🌾',
    text: 'Severe El Niño weakens Indian monsoon; sugar output drops 15%',
    market: 'india' as const,
  },
  {
    icon: '🤖',
    text: 'US expands chip export restrictions on advanced AI hardware',
    market: 'us' as const,
  },
]

const GENERATION_STAGES = [
  'Extracting Entities...',
  'Tracing Precedents...',
  'Evaluating Transmission Channels...',
  'Generating Graph...',
]

export const SimulationInput: React.FC<SimulationInputProps> = ({
  currentMarket,
  onGraphGenerated,
}) => {
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [stageIndex, setStageIndex] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Cycle through multi-stage loader steps during generation
  useEffect(() => {
    let interval: any
    if (isLoading) {
      interval = setInterval(() => {
        setStageIndex((prev) => (prev + 1) % GENERATION_STAGES.length)
      }, 950)
    } else {
      setStageIndex(0)
    }
    return () => clearInterval(interval)
  }, [isLoading])

  const handleSimulate = async (textToSimulate?: string, marketOverride?: 'india' | 'us' | 'global') => {
    const text = (textToSimulate || inputText).trim()
    if (!text || isLoading) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/generate-impact-graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsText: text,
          market: marketOverride || currentMarket,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: Failed to generate graph`)
      }

      const dataset: EventDataset = await response.json()

      // Find root node to auto-select
      const rootNode =
        dataset.nodes.find((n) => n.id === dataset.rootNodeId || n.nodeType === 'root_event') ||
        dataset.nodes[0] ||
        null

      onGraphGenerated(dataset, rootNode)
      setInputText('')
    } catch (err: any) {
      console.error('[SimulationInput] Error:', err)
      setErrorMessage(err.message || 'Simulation pipeline error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-[#111A2E]/95 to-[#0B101D]/95 border border-cyan-500/30 p-4 shadow-[0_0_30px_rgba(6,182,212,0.12)] backdrop-blur-xl flex flex-col gap-3">
      {/* Search & Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSimulate()
        }}
        className="flex flex-col sm:flex-row items-center gap-2.5"
      >
        <div className="relative flex-1 w-full">
          <div className="absolute left-3.5 top-3 text-cyan-400">
            <Zap className="w-4 h-4 animate-pulse" />
          </div>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Simulate Any Financial Event, Headline, or Policy Shock..."
            className="w-full bg-[#080D18] border border-cyan-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 shadow-inner transition-all font-mono"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className={cn(
            'w-full sm:w-auto px-5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg shrink-0',
            isLoading || !inputText.trim()
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-[#070D18] border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02]'
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-cyan-200" />
              <span className="text-cyan-100">{GENERATION_STAGES[stageIndex]}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#070D18]" />
              <span>Analyze & Generate Graph</span>
            </>
          )}
        </button>
      </form>

      {/* Live Stage Progress Indicator Bar when loading */}
      {isLoading && (
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#070D18]/90 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 animate-pulse">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">{GENERATION_STAGES[stageIndex]}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className={cn('px-1.5 py-0.5 rounded', stageIndex >= 0 ? 'text-cyan-400 font-bold' : 'text-slate-600')}>1. Entities</span>
            <span>→</span>
            <span className={cn('px-1.5 py-0.5 rounded', stageIndex >= 1 ? 'text-cyan-400 font-bold' : 'text-slate-600')}>2. Precedents</span>
            <span>→</span>
            <span className={cn('px-1.5 py-0.5 rounded', stageIndex >= 2 ? 'text-cyan-400 font-bold' : 'text-slate-600')}>3. Transmission</span>
            <span>→</span>
            <span className={cn('px-1.5 py-0.5 rounded', stageIndex >= 3 ? 'text-cyan-400 font-bold' : 'text-slate-600')}>4. Synthesis</span>
          </div>
        </div>
      )}

      {/* Error Message Display */}
      {errorMessage && (
        <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
          {errorMessage}
        </div>
      )}

      {/* One-Click Hackathon Suggestion Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Test Shock Prompts:
        </span>

        {HACKATHON_SUGGESTIONS.map((suggestion, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => handleSimulate(suggestion.text, suggestion.market)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#080D18] hover:bg-slate-800/80 border border-[#1E293B] hover:border-cyan-500/50 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer font-medium shadow-sm hover:shadow-[0_0_10px_rgba(6,182,212,0.15)] group"
          >
            <span>{suggestion.icon}</span>
            <span className="line-clamp-1">{suggestion.text}</span>
            <ArrowRight className="w-2.5 h-2.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  )
}
