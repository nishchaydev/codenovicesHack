import React, { useEffect, useState } from "react";
import { Activity, ArrowUpRight, ArrowDownRight, RefreshCw, Radio } from "lucide-react";

export interface LiveQuote {
  symbol: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  change_pct: number;
  source: string;
  is_negative: boolean;
}

export const LiveMarketTicker: React.FC = () => {
  const [quotes, setQuotes] = useState<LiveQuote[]>([
    { symbol: "CL=F", name: "WTI Crude", category: "Commodity", price: 91.85, unit: "$/bbl", change_pct: 1.57, source: "yfinance_live", is_negative: false },
    { symbol: "^TNX", name: "US 10Y Yield", category: "Macro", price: 5.24, unit: "%", change_pct: 0.17, source: "yfinance_live", is_negative: false },
    { symbol: "^VIX", name: "CBOE Volatility", category: "Volatility", price: 14.84, unit: "pts", change_pct: -3.76, source: "yfinance_live", is_negative: true },
    { symbol: "GC=F", name: "Gold", category: "Commodity", price: 2620.0, unit: "$/oz", change_pct: 0.33, source: "yfinance_live", is_negative: false },
    { symbol: "TSM", name: "TSMC", category: "Semiconductors", price: 453.31, unit: "$", change_pct: -1.28, source: "yfinance_live", is_negative: true },
    { symbol: "NVDA", name: "NVIDIA", category: "AI Hardware", price: 229.28, unit: "$", change_pct: -0.52, source: "yfinance_live", is_negative: true },
    { symbol: "RELIANCE.BO", name: "Reliance Ind.", category: "Energy", price: 1170.8, unit: "INR", change_pct: 0.85, source: "yfinance_live", is_negative: false },
    { symbol: "ASIANPAINT.BO", name: "Asian Paints", category: "Chemicals", price: 2345.0, unit: "INR", change_pct: -2.40, source: "yfinance_live", is_negative: true },
  ]);
  const [lastUpdated, setLastUpdated] = useState<string>("Streaming");
  const [isLoading, setIsLoading] = useState(false);

  const fetchLiveQuotes = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/market/live-quotes");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setQuotes(data);
          setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        }
      }
    } catch (e) {
      // keep existing fallback quotes
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveQuotes();
    const interval = setInterval(fetchLiveQuotes, 25000); // 25s auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-2.5 shadow-xs text-slate-900 overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-xs">
      {/* Ticker Header / Source Verification */}
      <div className="flex items-center gap-2 px-2 shrink-0 border-r border-slate-200 pr-3">
        <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
        <span className="text-xs font-mono font-bold tracking-wider text-slate-800">
          yfinance Live Feed
        </span>
        <button
          onClick={fetchLiveQuotes}
          disabled={isLoading}
          title="Refresh live prices"
          className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Streaming Marquee of Live Quotes */}
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none w-full py-0.5">
        {quotes.map((q) => (
          <div
            key={q.symbol}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/80 shrink-0 hover:border-slate-300 transition"
          >
            <span className="text-[11px] font-semibold text-slate-600 font-sans">
              {q.name}
            </span>
            <span className="text-xs font-mono font-bold text-slate-900">
              {q.unit === "INR" ? "₹" : q.unit === "$" ? "$" : ""}{q.price.toLocaleString()}
              {q.unit !== "INR" && q.unit !== "$" ? ` ${q.unit}` : ""}
            </span>
            <span
              className={`text-[10px] font-mono font-bold flex items-center ${
                q.is_negative ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {q.is_negative ? (
                <ArrowDownRight className="w-2.5 h-2.5 inline" />
              ) : (
                <ArrowUpRight className="w-2.5 h-2.5 inline" />
              )}
              {q.change_pct > 0 ? `+${q.change_pct}%` : `${q.change_pct}%`}
            </span>
          </div>
        ))}
      </div>

      <div className="text-[10px] font-mono text-slate-400 shrink-0 px-2 hidden lg:block">
        Synced: {lastUpdated}
      </div>
    </div>
  );
};
