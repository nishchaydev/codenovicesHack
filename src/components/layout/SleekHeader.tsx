import React, { useState, useRef, useEffect } from 'react'
import {
  Activity,
  Compass,
  Sparkles,
  Loader2,
  Zap,
  ChevronDown,
  Check,
  ArrowRight,
} from 'lucide-react'
import type { EventDataset, GraphNode } from '../../types/graph'
import { PERSONA_PRESETS, type PersonaType } from '../persona/PersonaBar'
import { cn } from '../../lib/utils'

interface SleekHeaderProps {
  currentPersona: PersonaType
  onSelectPersona: (persona: PersonaType, datasetId: string, toastMessage: string) => void
  onGraphGenerated: (dataset: EventDataset, rootNode: GraphNode | null) => void
  onStartTour?: () => void
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
  'Evaluating Channels...',
  'Synthesizing Topology...',
]

export const SleekHeader: React.FC<SleekHeaderProps> = ({
  currentPersona,
  onSelectPersona,
  onGraphGenerated,
  onStartTour,
}) => {
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [stageIndex, setStageIndex] = useState(0)
  const [isPersonaOpen, setIsPersonaOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const personaRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const activePreset = PERSONA_PRESETS.find((p) => p.id === currentPersona) || PERSONA_PRESETS[0]

  // Global Keyboard Shortcut: ⌘K or Ctrl+K to focus simulation search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) {
        setIsPersonaOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Multi-stage loader ticker
  useEffect(() => {
    let interval: any
    if (isLoading) {
      interval = setInterval(() => {
        setStageIndex((prev) => (prev + 1) % GENERATION_STAGES.length)
      }, 900)
    } else {
      setStageIndex(0)
    }
    return () => clearInterval(interval)
  }, [isLoading])

  const handleSimulate = async (textToSimulate?: string, marketOverride?: 'india' | 'us' | 'global') => {
    const text = (textToSimulate || inputText).trim()
    if (!text || isLoading) return

    setIsLoading(true)
    setIsSearchFocused(false)

    try {
      const response = await fetch('/api/generate-impact-graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsText: text,
          market: marketOverride || (currentPersona === 'india' ? 'india' : currentPersona === 'us' ? 'us' : 'global'),
        }),
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const dataset: EventDataset = await response.json()
      const rootNode =
        dataset.nodes.find((n) => n.id === dataset.rootNodeId || n.nodeType === 'root_event') ||
        dataset.nodes[0] ||
        null

      onGraphGenerated(dataset, rootNode)
      setInputText('')
    } catch (err: any) {
      console.error('[Simulation] Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-[#ffffff] border-b border-[#f0f0f0] px-4 md:px-8 flex items-center justify-between gap-4 transition-all">
      {/* 1. Left: Mobbin 30% squircle app icon + brand lockup with terminal period */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-[30%] bg-[#141414] text-white">
          <Activity className="w-4 h-4 text-white" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base font-semibold tracking-tight text-[#141414]">
            FinGraph.
          </span>
          <span className="hidden md:inline text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#f3f3f3] text-[#707070]">
            Market Engine
          </span>
        </div>
      </div>

      {/* 2. Center: Stadium Pill Search Input (DESIGN.md text-input in #f0f0f0 field, borderless at rest) */}
      <div className="relative flex-1 max-w-xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSimulate()
          }}
          className="relative flex items-center"
        >
          <div className="absolute left-3.5 text-[#707070] pointer-events-none">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#141414]" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            disabled={isLoading}
            placeholder={
              isLoading
                ? GENERATION_STAGES[stageIndex]
                : 'Simulate financial event, rate decision, or commodity shock...'
            }
            className={cn(
              'w-full h-10 bg-[#f0f0f0] text-[#141414] placeholder-[#adadad] rounded-full pl-10 pr-24 text-xs font-normal transition-all focus:outline-none',
              isSearchFocused
                ? 'ring-2 ring-[#141414] bg-[#ffffff] border border-[#e0e0e0]'
                : 'hover:bg-[#ebebeb] border-none'
            )}
          />

          {/* Right Action Button / Shortcut inside Search Bar */}
          <div className="absolute right-1.5 flex items-center gap-1">
            {inputText.trim() ? (
              <button
                type="submit"
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-full bg-[#141414] hover:bg-[#262626] text-[#ffffff] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#ffffff]" />
                <span>Simulate</span>
              </button>
            ) : (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-[#e8e8e8] text-[11px] font-medium text-[#707070]">
                ⌘K
              </span>
            )}
          </div>
        </form>

        {/* Suggestions Dropdown (Gallery Card: #ffffff canvas, #e0e0e0 hairline, rounded-2xl, no shadow) */}
        {isSearchFocused && !isLoading && (
          <div
            onMouseDown={(e) => e.preventDefault()}
            className="absolute top-12 left-0 right-0 z-50 rounded-[20px] bg-[#ffffff] border border-[#e0e0e0] p-3 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
          >
            <div className="flex items-center justify-between px-2 pb-1.5 border-b border-[#f0f0f0] text-xs text-[#707070] font-medium">
              <span className="flex items-center gap-1.5 text-[#141414] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#0066ff]" />
                Shock Scenarios
              </span>
              <button
                type="button"
                onClick={() => setIsSearchFocused(false)}
                className="text-[#adadad] hover:text-[#141414] cursor-pointer"
              >
                Esc to close
              </button>
            </div>

            <div className="space-y-1">
              {HACKATHON_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    handleSimulate(item.text, item.market)
                  }}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-full hover:bg-[#f3f3f3] text-left text-xs text-[#262626] hover:text-[#141414] transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <span>{item.icon}</span>
                    <span className="truncate">{item.text}</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#adadad] group-hover:text-[#141414] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Right: Persona Dropdown & Guided Tour in Mobbin pill buttons */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Persona Dropdown Menu */}
        <div ref={personaRef} className="relative">
          <button
            type="button"
            onClick={() => setIsPersonaOpen(!isPersonaOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#f3f3f3] hover:bg-[#ebebeb] text-xs font-semibold text-[#141414] transition-colors cursor-pointer"
          >
            <span>{activePreset.flag}</span>
            <span className="hidden sm:inline">{activePreset.label.split('/')[0].trim()}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#707070]" />
          </button>

          {isPersonaOpen && (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-[20px] bg-[#ffffff] border border-[#e0e0e0] p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="text-[11px] font-semibold text-[#707070] px-3 py-1.5">
                Market Persona
              </div>

              {PERSONA_PRESETS.map((preset) => {
                const isSelected = currentPersona === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onSelectPersona(preset.id, preset.datasetId, preset.toastMessage)
                      setIsPersonaOpen(false)
                    }}
                    className={cn(
                      'flex items-start gap-3 p-2.5 rounded-[16px] text-left transition-colors cursor-pointer',
                      isSelected
                        ? 'bg-[#f3f3f3] text-[#141414]'
                        : 'hover:bg-[#fafafa] text-[#707070]'
                    )}
                  >
                    <span className="text-lg shrink-0">{preset.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#141414] flex items-center justify-between">
                        <span>{preset.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#141414]" />}
                      </div>
                      <p className="text-[11px] text-[#707070] line-clamp-1 mt-0.5">
                        {preset.subtext}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Guided Tour Walkthrough Button (button-outline: canvas fill, hairline border, rounded-full) */}
        {onStartTour && (
          <button
            type="button"
            onClick={onStartTour}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#ffffff] hover:bg-[#f3f3f3] border border-[#e0e0e0] text-[#141414] text-xs font-semibold transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#707070]" />
            <span className="hidden md:inline">Tour</span>
          </button>
        )}
      </div>
    </header>
  )

}
