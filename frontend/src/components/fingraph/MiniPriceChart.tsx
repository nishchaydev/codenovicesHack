import React, { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react'
import { fetchMarketData, generateDeterministicSeries, type MarketDataResponse } from '../../lib/marketData'
import { cn } from '../../lib/utils'

interface MiniPriceChartProps {
  ticker?: string
  fallbackTitle?: string
}

const CustomTooltip = ({ active, payload, label, currency }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value
    return (
      <div className="rounded-[12px] bg-[#ffffff] border border-[#e0e0e0] px-3 py-2 text-xs shadow-xs">
        <p className="text-[#707070] text-[10px]">{label}</p>
        <p className="text-[#141414] font-semibold">
          {currency}
          {typeof val === 'number' ? val.toFixed(2) : val}
        </p>
      </div>
    )
  }
  return null
}

export const MiniPriceChart: React.FC<MiniPriceChartProps> = ({
  ticker,
  fallbackTitle,
}) => {
  const [marketData, setMarketData] = useState<MarketDataResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    if (ticker) {
      fetchMarketData(ticker)
        .then((data) => {
          if (isMounted) {
            setMarketData(data)
            setLoading(false)
          }
        })
        .catch(() => {
          if (isMounted) {
            setMarketData(generateDeterministicSeries(ticker))
            setLoading(false)
          }
        })
    } else if (fallbackTitle) {
      const synthetic = generateDeterministicSeries(fallbackTitle, 104.5, 0.03)
      setMarketData({
        ...synthetic,
        ticker: fallbackTitle.length > 24 ? fallbackTitle.slice(0, 24) + '...' : fallbackTitle,
        currency: 'Index pts ',
      })
      setLoading(false)
    } else {
      setLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [ticker, fallbackTitle])

  if (loading) {
    return (
      <div className="h-36 w-full flex flex-col items-center justify-center text-xs text-[#707070] gap-2">
        <Loader2 className="w-4 h-4 text-[#141414] animate-spin" />
        <span>Loading Market Data...</span>
      </div>
    )
  }

  if (!marketData || marketData.data.length === 0) {
    return (
      <div className="h-36 w-full flex items-center justify-center text-xs text-[#707070]">
        Market series unavailable
      </div>
    )
  }

  const isNetPositive = marketData.netChangePercent >= 0
  const strokeColor = isNetPositive ? '#1b5e20' : '#c62828'
  const fillColor = isNetPositive ? '#1b5e20' : '#c62828'

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Metrics Row */}
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[#707070] font-medium">
            30-Day Benchmark
          </div>
          <div className="text-sm font-bold text-[#141414] font-mono flex items-center gap-1.5">
            <span>
              {marketData.currency}
              {marketData.currentPrice.toLocaleString()}
            </span>
            <span
              className={cn(
                'text-[11px] font-semibold flex items-center',
                isNetPositive ? 'text-[#1b5e20]' : 'text-[#c62828]'
              )}
            >
              {isNetPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {marketData.netChangePercent > 0 ? '+' : ''}
              {marketData.netChangePercent}%
            </span>
          </div>
        </div>

        <div className="text-right text-[10px] text-[#707070] font-mono">
          <div>
            H: {marketData.currency}
            {marketData.high30d.toFixed(1)}
          </div>
          <div>
            L: {marketData.currency}
            {marketData.low30d.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Area Chart Container */}
      <div className="h-28 w-full mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={marketData.data}
            margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`gradient-${marketData.ticker}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillColor} stopOpacity={0.16} />
                <stop offset="100%" stopColor={fillColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip
              content={<CustomTooltip currency={marketData.currency} />}
              cursor={{ stroke: '#e0e0e0', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={1.5}
              fillOpacity={1}
              fill={`url(#gradient-${marketData.ticker})`}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer attribution */}
      <div className="flex items-center justify-between text-[10px] text-[#707070] pt-1 border-t border-[#f0f0f0]">
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-[#707070]" />
          <span>{marketData.isSimulated ? 'Calibrated Model' : 'Live Yahoo Finance'}</span>
        </span>
        <span className="font-mono">Daily Close Series</span>
      </div>
    </div>
  )
}
