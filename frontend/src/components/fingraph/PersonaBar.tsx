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
  currentCategory?: CategoryFilterType
  onSelectCategory?: (category: CategoryFilterType) => void
}

export const PersonaBar: React.FC<PersonaBarProps> = ({
  currentPersona,
  onSelectPersona,
  currentCategory = 'All Categories',
  onSelectCategory,
}) => {
  return (
    <div className="w-full rounded-2xl bg-white/95 border border-[#e0e0e0] p-3 shadow-md flex flex-col gap-2.5 backdrop-blur-md">
      {/* Upper row: 1-Click Persona Presets */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            Market Persona & Lens
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Click to load tailored shock topology
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                  'flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer relative group',
                  isSelected
                    ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                )}
              >
                <span className="text-lg shrink-0 p-1 rounded-lg bg-slate-100 border border-slate-200 leading-none">
                  {preset.flag}
                </span>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-xs font-bold tracking-tight',
                        isSelected ? 'text-blue-900' : 'text-slate-800 group-hover:text-slate-900'
                      )}
                    >
                      {preset.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-medium leading-relaxed">
                    {preset.subtext}
                  </p>
                </div>

                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {onSelectCategory && (
        <>
          <div className="h-px bg-slate-100" />
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-wider">
                Sector Filter:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {CATEGORY_FILTERS.map((cat) => {
                const isActive = currentCategory === cat

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onSelectCategory(cat)}
                    className={cn(
                      'px-2.5 py-0.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap font-mono',
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    )}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
