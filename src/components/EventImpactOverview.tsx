import React from 'react'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldAlert,
  Zap,
} from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'

interface SparklineData {
  time: string
  val: number
}

const SAMPLE_SPARKLINE: SparklineData[] = [
  { time: '09:15', val: 100 },
  { time: '10:00', val: 104 },
  { time: '11:00', val: 98 },
  { time: '12:00', val: 107 },
  { time: '13:00', val: 112 },
  { time: '14:00', val: 115 },
  { time: '15:30', val: 119 },
]

export const EventImpactOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Metric Card 1 */}
      <div className="p-4 rounded-xl bg-[#111726]/80 border border-[#1E293B] shadow-lg backdrop-blur">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            CRITICAL CATALYST
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
            HIGH CONFIDENCE
          </span>
        </div>
        <div className="text-lg font-bold text-white tracking-tight">
          OPEC+ Surprise 1.2M bpd Output Cut
        </div>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
          Global supply disruption reverberating through downstream transport, refining margins & fertilizer costs.
        </p>
        <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#1E293B] text-xs">
          <span className="text-slate-400">Predicted Market Delta:</span>
          <span className="font-mono font-semibold text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +4.82% Energy Index
          </span>
        </div>
      </div>

      {/* Metric Card 2 */}
      <div className="p-4 rounded-xl bg-[#111726]/80 border border-[#1E293B] shadow-lg backdrop-blur">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            SYSTEMIC VULNERABILITY
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20">
            SPREAD RISK
          </span>
        </div>
        <div className="text-lg font-bold text-white tracking-tight">
          Semiconductor Export Sanctions
        </div>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
          Tier-2 equipment manufacturers face component supply bottlenecks across automotive & defense electronics.
        </p>
        <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#1E293B] text-xs">
          <span className="text-slate-400">Transmission Speed:</span>
          <span className="font-mono font-semibold text-rose-400 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> T+2 Cascading Impact
          </span>
        </div>
      </div>

      {/* Metric Card 3: Sparkline preview */}
      <div className="p-4 rounded-xl bg-[#111726]/80 border border-[#1E293B] shadow-lg backdrop-blur flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
            VOLATILITY SPARKLINE
          </span>
          <span className="text-emerald-400 font-mono font-semibold text-xs">
            +19.0% 24H
          </span>
        </div>
        <div className="h-16 w-full my-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SAMPLE_SPARKLINE}>
              <defs>
                <linearGradient id="impactGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="val"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#impactGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#1E293B]">
          <span>Real-time Multi-Hop Depth: 4 Nodes</span>
          <span className="text-cyan-400 font-mono">99.4% Accuracy</span>
        </div>
      </div>
    </div>
  )
}
