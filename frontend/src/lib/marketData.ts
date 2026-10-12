export interface PricePoint {
  date: string
  price: number
}

export interface MarketDataResponse {
  ticker: string
  currency: string
  currentPrice: number
  netChangePercent: number
  high30d: number
  low30d: number
  data: PricePoint[]
  isSimulated?: boolean
}

// Convert common ticker notations to Yahoo Finance format
export function normalizeTicker(ticker: string): string {
  let clean = ticker.trim()
  if (clean.startsWith('NSE:')) {
    clean = clean.replace('NSE:', '') + '.NS'
  } else if (clean.startsWith('BSE:')) {
    clean = clean.replace('BSE:', '') + '.BO'
  } else if (clean.startsWith('NYSE:') || clean.startsWith('NASDAQ:')) {
    clean = clean.split(':')[1]
  } else if (clean.startsWith('MCX:')) {
    const symbol = clean.split(':')[1]
    if (symbol === 'GOLD') return 'GC=F'
    if (symbol === 'CRUDE') return 'CL=F'
    return symbol
  }
  return clean
}

// Generate realistic deterministic 30-day volatility points if external API fails or is throttled
export function generateDeterministicSeries(
  ticker: string,
  basePrice = 120,
  drift = 0.05
): MarketDataResponse {
  let hash = 0
  for (let i = 0; i < ticker.length; i++) {
    hash = (hash << 5) - hash + ticker.charCodeAt(i)
    hash |= 0
  }

  const days = 30
  const data: PricePoint[] = []
  let price = Math.abs(hash % 300) + basePrice
  const today = new Date()

  for (let i = days; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]

    const noise = Math.sin((i + hash) * 0.45) * 0.018 + (drift / days)
    price = Number((price * (1 + noise)).toFixed(2))
    data.push({ date: dateStr, price })
  }

  const prices = data.map((d) => d.price)
  const firstPrice = prices[0]
  const lastPrice = prices[prices.length - 1]
  const netChangePercent = Number((((lastPrice - firstPrice) / firstPrice) * 100).toFixed(2))
  const high30d = Math.max(...prices)
  const low30d = Math.min(...prices)

  const isRupee = ticker.includes('.NS') || ticker.includes('.BO') || ticker.includes('INR')

  return {
    ticker,
    currency: isRupee ? '₹' : '$',
    currentPrice: lastPrice,
    netChangePercent,
    high30d,
    low30d,
    data,
    isSimulated: true,
  }
}

// Fetch historical market data with robust local and external fallbacks
export async function fetchMarketData(ticker: string): Promise<MarketDataResponse> {
  const normTicker = normalizeTicker(ticker)

  // 1. Check local backend endpoint if available
  try {
    const localRes = await fetch(`/api/stock/${encodeURIComponent(normTicker)}`)
    if (localRes.ok) {
      const json = await localRes.json()
      if (json && json.prices && json.prices.length > 0) {
        const points: PricePoint[] = json.prices.map((p: any) => ({
          date: p.date,
          price: p.close,
        }))
        const prices = points.map((p) => p.price)
        const isRupee = normTicker.includes('.NS') || normTicker.includes('.BO') || normTicker.includes('INR')
        return {
          ticker: json.ticker || normTicker,
          currency: isRupee ? '₹' : '$',
          currentPrice: json.current_price || prices[prices.length - 1],
          netChangePercent: json.change_pct || 0,
          high30d: Math.max(...prices),
          low30d: Math.min(...prices),
          data: points,
          isSimulated: json.data_source?.includes('fallback') || false,
        }
      }
    }
  } catch (err) {
    // continue to next provider
  }

  // 2. Direct Yahoo Finance API query
  try {
    const yahooRes = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
        normTicker
      )}?range=1mo&interval=1d`
    )
    if (yahooRes.ok) {
      const data = await yahooRes.json()
      const result = data?.chart?.result?.[0]
      const timestamps = result?.timestamp || []
      const quotes = result?.indicators?.quote?.[0]?.close || []

      const points: PricePoint[] = []
      timestamps.forEach((ts: number, idx: number) => {
        const val = quotes[idx]
        if (val !== null && val !== undefined) {
          const date = new Date(ts * 1000).toISOString().split('T')[0]
          points.push({ date, price: Number(val.toFixed(2)) })
        }
      })

      if (points.length > 0) {
        const prices = points.map((d) => d.price)
        const firstPrice = prices[0]
        const lastPrice = prices[prices.length - 1]
        const isRupee = normTicker.includes('.NS') || normTicker.includes('.BO') || normTicker.includes('INR')
        return {
          ticker: normTicker,
          currency: isRupee ? '₹' : '$',
          currentPrice: lastPrice,
          netChangePercent: Number((((lastPrice - firstPrice) / firstPrice) * 100).toFixed(2)),
          high30d: Math.max(...prices),
          low30d: Math.min(...prices),
          data: points,
          isSimulated: false,
        }
      }
    }
  } catch (err) {
    // continue to deterministic fallback
  }

  // 3. Deterministic high-fidelity series fallback
  return generateDeterministicSeries(normTicker)
}
