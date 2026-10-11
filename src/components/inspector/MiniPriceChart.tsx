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
  LineChart,
} from 'lucide-react'
import { fetchMarketData, generateDeterministicSeries, type MarketDataResponse } from '../../lib/marketData'
import { cn } from '../../lib/utils'

interface MiniPriceChartProps {
  ticker?: string
  fallbackTitle?: string
}

// Mobbin Gallery Tooltip: #ffffff canvas, #e0e0e0 hairline, rounded-[12px], no drop shadow
const CustomTooltip = ({ active, payload, label, currency }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value
    return (
      <div className="rounded-[12px] bg-[#ffffff] border border-[#e0e0e0] px-3 py-2 text-xs">
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

  const isPositive = marketData.netChangePercent >= 0
  const uniqueKey = ticker || fallbackTitle || 'macro'
  const gradientId = `chart-gradient-${uniqueKey.replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Metrics Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#f0f0f0]">
        <div>
          <div className="text-[11px] text-[#707070] flex items-center gap-1.5 font-medium">
            {ticker ? (
              <Activity className="w-3.5 h-3.5 text-[#141414]" />
            ) : (
              <LineChart className="w-3.5 h-3.5 text-[#707070]" />
            )}
            <span className="truncate max-w-[180px]">
              {ticker ? `30D Trend • ${marketData.ticker}` : `Indicator • ${marketData.ticker}`}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-semibold text-[#141414]">
              {marketData.currency}
              {marketData.currentPrice.toFixed(2)}
            </span>
            <span
              className={cn(
                'inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full',
                isPositive ? 'bg-[#edf7ed] text-[#1e4620]' : 'bg-[#fdeeed] text-[#5f2120]'
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {isPositive ? '+' : ''}
              {marketData.netChangePercent}%
            </span>
          </div>
        </div>

        {/* 30D High / Low */}
        <div className="text-right text-[11px] text-[#707070] space-y-0.5">
          <div>
            30D High: <strong className="text-[#141414]">{marketData.currency}{marketData.high30d.toFixed(2)}</strong>
          </div>
          <div>
            30D Low: <strong className="text-[#141414]">{marketData.currency}{marketData.low30d.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Interactive Area Chart */}
      <div className="h-28 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={marketData.data} margin={{ top: 5, right: 2, left: 2, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#141414" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#141414" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              content={<CustomTooltip currency={marketData.currency} />}
              cursor={{ stroke: '#e0e0e0', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#141414"
              strokeWidth={1.5}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
