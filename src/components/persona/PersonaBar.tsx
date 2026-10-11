import React from 'react'
import {
  Briefcase,
  SlidersHorizontal,
  Check,
} from 'lucide-react'
import { cn } from '../../lib/utils'

export type PersonaType = 'india' | 'us' | 'agri'

export interface PersonaConfig {
  id: PersonaType
  label: string
  subtext: string
  flag: string
  datasetId: string
  toastMessage: string
}

export const PERSONA_PRESETS: PersonaConfig[] = [
  {
    id: 'india',
    label: 'Indian Retail / DII Perspective',
    subtext: 'NSE/BSE equities, RBI policy, Monsoon, Crude import impact',
    flag: '🇮🇳',
    datasetId: 'sugar-ethanol-policy-2024',
    toastMessage:
      'Switched to Indian Market Context: Loaded Sugar & Ethanol Policy Shock',
  },
  {
    id: 'us',
    label: 'Global Macro Fund',
    subtext: 'S&P 500, US Fed, Brent Crude, Dollar Index, Geopolitics',
    flag: '🇺🇸',
    datasetId: 'hormuz-crude-shock-2024',
    toastMessage:
      'Switched to Global Macro Context: Loaded Strait of Hormuz Crude Disruption',
  },
  {
    id: 'agri',
    label: 'Agri & Commodity Trader',
    subtext: 'Soft commodities, Biofuels, Weather cycles, Fertilizer tariffs',
    flag: '🌾',
    datasetId: 'fertilizer-grain-disruption-2024',
    toastMessage:
      'Switched to Commodity Context: Loaded Black Sea Grain & Potash Tariffs',
  },
]

export const CATEGORY_FILTERS = [
  'All Categories',
  'Energy & Petrochem',
  'Agriculture & Food',
  'Tech & Semis',
  'Banking & Rates',
] as const

export type CategoryFilterType = (typeof CATEGORY_FILTERS)[number]

interface PersonaBarProps {
  currentPersona: PersonaType
  onSelectPersona: (persona: PersonaType, datasetId: string, toastMessage: string) => void
  currentCategory: CategoryFilterType
  onSelectCategory: (category: CategoryFilterType) => void
}

export const PersonaBar: React.FC<PersonaBarProps> = ({
  currentPersona,
  onSelectPersona,
  currentCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full rounded-2xl bg-[#0E1524]/90 border border-[#1E293B] p-3.5 shadow-xl flex flex-col gap-3.5 backdrop-blur-md">
      {/* Upper row: 1-Click Persona Presets */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            Market Persona & Institutional Lens
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Click to auto-load targeted shock scenario
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {PERSONA_PRESETS.map((preset) => {
            const isSelected = currentPersona === preset.id

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  onSelectPersona(preset.id, preset.datasetId, preset.toastMessage)
                }
                className={cn(
                  'flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer relative group',
                  isSelected
                    ? 'bg-gradient-to-br from-[#131E35] to-[#0E1524] border-cyan-500/70 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                    : 'bg-[#0B101B]/80 border-[#1E293B] hover:border-slate-700 hover:bg-[#11192B]'
                )}
              >
                {/* Flag / Icon */}
                <span className="text-xl shrink-0 p-1 rounded-lg bg-slate-800/60 border border-slate-700/60 leading-none">
                  {preset.flag}
                </span>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-xs font-bold tracking-tight',
                        isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                      )}
                    >
                      {preset.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-medium leading-relaxed">
                    {preset.subtext}
                  </p>
                </div>

                {/* Selection Checkmark Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 flex items-center justify-center w-4 h-4 rounded-full bg-cyan-500 text-[#0B0F17]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1E293B]" />

      {/* Lower row: Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            Sector Filter:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORY_FILTERS.map((cat) => {
            const isActive = currentCategory === cat

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap font-mono',
                  isActive
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)] font-semibold'
                    : 'bg-[#0B101B] border border-[#1E293B] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                )}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
