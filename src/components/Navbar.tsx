import React from 'react'
import {
  Activity,
  Radio,
  Compass,
} from 'lucide-react'
import { cn } from '../lib/utils'

export type MarketPersona = 'IN' | 'US'
export type MarketCategory = 'Commodities' | 'Energy' | 'Tech' | 'Banking' | 'Agriculture'

interface NavbarProps {
  currentPersona: MarketPersona
  onSelectPersona: (persona: MarketPersona) => void
  currentCategory: MarketCategory
  onSelectCategory: (cat: MarketCategory) => void
  onStartTour?: () => void
}

const CATEGORIES: MarketCategory[] = [
  'Commodities',
  'Energy',
  'Tech',
  'Banking',
  'Agriculture',
]

export const Navbar: React.FC<NavbarProps> = ({
  currentPersona,
  onSelectPersona,
  currentCategory,
  onSelectCategory,
  onStartTour,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1E293B] bg-[#0B0F17]/90 backdrop-blur-md px-4 py-2.5 transition-all">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-4 max-w-[1920px]">
        {/* App Logo & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-blue-600/30 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                FinGraph: Event Impact Engine
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                v1.0
              </span>
            </div>
            <p className="text-[11px] font-medium tracking-wide text-slate-400">
              Autonomous Financial Event Market Impact Graph
            </p>
          </div>
        </div>

        {/* Center: Market Switcher & Category Selector */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Quick Persona / Market Switcher chip */}
          <div className="flex items-center p-1 rounded-lg bg-[#111726] border border-[#1E293B] shadow-inner">
            <button
              type="button"
              onClick={() => onSelectPersona('IN')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer',
                currentPersona === 'IN'
                  ? 'bg-gradient-to-r from-orange-500/20 to-emerald-500/20 text-white border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              )}
            >
              <span>🇮🇳</span>
              <span>India (NSE/BSE)</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectPersona('US')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer',
                currentPersona === 'US'
                  ? 'bg-gradient-to-r from-blue-600/20 to-indigo-500/20 text-white border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              )}
            >
              <span>🇺🇸</span>
              <span>US (Global/S&P 500)</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden md:block" />

          {/* Category Selector */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#111726] border border-[#1E293B]">
            {CATEGORIES.map((cat) => {
              const active = currentCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap',
                    active
                      ? 'bg-slate-800 text-cyan-400 font-semibold border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  )}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Live Status Badge, Tour & Diagnostics */}
        <div className="flex items-center gap-2.5">
          {/* Start Guided Tour Button */}
          {onStartTour && (
            <button
              type="button"
              onClick={onStartTour}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-semibold transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:scale-105"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span className="hidden sm:inline">Start Guided Tour</span>
              <span className="sm:hidden">Tour</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#111726] border border-[#1E293B] text-[11px] text-slate-400 font-mono">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>LATENCY: 12ms</span>
          </div>

          {/* Live Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide uppercase font-mono">
              Graph Engine Online
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
