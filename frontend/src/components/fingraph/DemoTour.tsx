import React, { useState } from 'react'
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  ShieldCheck,
  Zap,
  TrendingUp,
  BrainCircuit,
  SlidersHorizontal,
} from 'lucide-react'
import { cn } from '../../lib/utils'

export interface TourStep {
  title: string
  subtitle: string
  description: string
  highlightTarget: string
  icon: React.ComponentType<{ className?: string }>
  badgeText: string
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Market Persona Customization.',
    subtitle: 'Step 1 of 6 • Regional & Sectoral Lens',
    description:
      'Instantly toggle between Indian Retail / DII (NSE/BSE & RBI policy), Global Macro Fund (Wall Street & US Fed), and Agri/Commodity perspectives. Each preset calibrates macroeconomic assumptions and loads tailored shock topologies.',
    highlightTarget: 'persona-bar',
    icon: SlidersHorizontal,
    badgeText: 'Institutional Lens',
  },
  {
    title: 'Backward Causes (Verified Facts).',
    subtitle: 'Step 2 of 6 • Upstream Preconditions',
    description:
      'Located on Tier -1 (Left), these nodes represent observed historical facts, trade deficits, and physical supply constraints that catalyzed the shock. Every fact contains ground-truth citations to verified public data.',
    highlightTarget: 'backward-causes',
    icon: ShieldCheck,
    badgeText: 'Upstream Drivers',
  },
  {
    title: 'Root Breaking Event Node.',
    subtitle: 'Step 3 of 6 • Shock Catalyst',
    description:
      'Located on Tier 0 (Center), the primary catalyst represents the breaking event (regulatory mandate, geopolitical shipping disruption, or sudden rate decision) with 100% confidence grounding.',
    highlightTarget: 'root-event',
    icon: Zap,
    badgeText: 'Epicenter Event',
  },
  {
    title: 'Forward Transmission & Asset Dislocation.',
    subtitle: 'Step 4 of 6 • Multi-Hop Propagation',
    description:
      'Located on Tiers +1 and +2 (Right), nodes trace supply chain pass-through and equity price changes. Green tags indicate bullish beneficiaries while red tags highlight margin compressions.',
    highlightTarget: 'forward-impacts',
    icon: TrendingUp,
    badgeText: 'Downstream Impacts',
  },
  {
    title: 'Telemetry Inspector & Yahoo Finance Data.',
    subtitle: 'Step 5 of 6 • Real-Time Price Series',
    description:
      'Clicking any node isolates the active transmission chain and opens the Inspector sidebar with real-time 30-day Yahoo Finance price charts, verified media citations, and historical precedents.',
    highlightTarget: 'node-inspector',
    icon: BrainCircuit,
    badgeText: 'Grounding Telemetry',
  },
  {
    title: 'AI Scenario Simulation.',
    subtitle: 'Step 6 of 6 • LLM Graph Synthesis',
    description:
      'Type any breaking financial headline, shock event, or click one of the suggested scenarios. FinGraph engine extracts entities, traces precedents, and synthesizes an interactive bidirectional graph.',
    highlightTarget: 'simulation-bar',
    icon: Sparkles,
    badgeText: 'Synthesis Engine',
  },
]

interface DemoTourProps {
  isOpen: boolean
  onClose: () => void
  onJumpToStep?: (stepIdx: number) => void
}

export const DemoTour: React.FC<DemoTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)

  if (!isOpen) return null

  const step = TOUR_STEPS[currentStep]
  const Icon = step.icon
  const isFirst = currentStep === 0
  const isLast = currentStep === TOUR_STEPS.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-[24px] bg-[#ffffff] border border-[#e0e0e0] p-6 text-[#141414] flex flex-col gap-4 shadow-2xl">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[30%] bg-[#141414] text-white flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#707070] block">
                FinGraph Walkthrough
              </span>
              <span className="text-[11px] text-[#adadad]">
                {step.subtitle}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#f3f3f3] text-[#707070] hover:text-[#141414] hover:bg-[#ebebeb] transition-colors cursor-pointer"
            aria-label="Close tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-[#f3f3f3] text-[#141414] text-[11px] font-semibold flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 text-[#707070]" />
              <span>{step.badgeText}</span>
            </span>

            {/* Step Progress Indicators */}
            <div className="flex items-center gap-1.5">
              {TOUR_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentStep(idx)}
                  className={cn(
                    'h-1.5 rounded-full transition-all cursor-pointer',
                    idx === currentStep
                      ? 'w-6 bg-[#141414]'
                      : 'w-1.5 bg-[#e0e0e0] hover:bg-[#adadad]'
                  )}
                  aria-label={`Jump to step ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <h3 className="text-xl font-semibold text-[#141414] tracking-tight leading-snug">
            {step.title}
          </h3>

          <p className="text-sm text-[#707070] leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3.5 border-t border-[#f0f0f0]">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={isFirst}
            className={cn(
              'px-4 py-2 rounded-full border border-[#e0e0e0] bg-[#ffffff] text-xs font-semibold text-[#141414] transition-all flex items-center gap-1',
              isFirst ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#f3f3f3] cursor-pointer'
            )}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (isLast) {
                onClose()
              } else {
                setCurrentStep((prev) => Math.min(TOUR_STEPS.length - 1, prev + 1))
              }
            }}
            className="px-5 py-2 rounded-full bg-[#141414] hover:bg-[#262626] text-[#ffffff] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>{isLast ? 'Complete Tour' : 'Next Step'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
