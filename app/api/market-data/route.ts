export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ticker = searchParams.get('ticker') || 'SPY'
  const range = searchParams.get('range') || '1mo'

  try {
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      ticker
    )}?range=${range}&interval=1d`

    const response = await fetch(yahooUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`Yahoo Finance responded with status ${response.status}`)
    }

    const payload = (await response.json()) as any
    const result = payload?.chart?.result?.[0]
    const timestamps: number[] = result?.timestamp || []
    const quotes: (number | null)[] = result?.indicators?.quote?.[0]?.close || []

    const points: { date: string; price: number }[] = []
    timestamps.forEach((ts, idx) => {
      const price = quotes[idx]
      if (price !== null && price !== undefined) {
        const date = new Date(ts * 1000).toISOString().split('T')[0]
        points.push({ date, price: Number(price.toFixed(2)) })
      }
    })

    if (points.length === 0) {
      throw new Error('No historical price points returned')
    }

    const prices = points.map((p) => p.price)
    const firstPrice = prices[0]
    const currentPrice = prices[prices.length - 1]
    const netChangePercent = Number(
      (((currentPrice - firstPrice) / firstPrice) * 100).toFixed(2)
    )

    const isRupee = ticker.endsWith('.NS') || ticker.endsWith('.BO') || ticker.includes('INR')

    return new Response(
      JSON.stringify({
        ticker,
        currency: isRupee ? '₹' : '$',
        currentPrice,
        netChangePercent,
        high30d: Math.max(...prices),
        low30d: Math.min(...prices),
        data: points,
        isSimulated: false,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err: any) {
    // Return deterministic 30-day volatility fallback
    const days = 30
    const points: { date: string; price: number }[] = []
    let basePrice = 150
    const today = new Date()

    // deterministic seed
    let hash = 0
    for (let i = 0; i < ticker.length; i++) {
      hash = (hash << 5) - hash + ticker.charCodeAt(i)
      hash |= 0
    }
    basePrice += Math.abs(hash % 200)

    for (let i = days; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const noise = Math.sin((i + hash) * 0.45) * 0.018 + 0.002
      basePrice = Number((basePrice * (1 + noise)).toFixed(2))
      points.push({
        date: d.toISOString().split('T')[0],
        price: basePrice,
      })
    }

    const prices = points.map((p) => p.price)
    const firstPrice = prices[0]
    const currentPrice = prices[prices.length - 1]
    const netChangePercent = Number(
      (((currentPrice - firstPrice) / firstPrice) * 100).toFixed(2)
    )
    const isRupee = ticker.endsWith('.NS') || ticker.endsWith('.BO') || ticker.includes('INR')

    return new Response(
      JSON.stringify({
        ticker,
        currency: isRupee ? '₹' : '$',
        currentPrice,
        netChangePercent,
        high30d: Math.max(...prices),
        low30d: Math.min(...prices),
        data: points,
        isSimulated: true,
        error: err.message,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
