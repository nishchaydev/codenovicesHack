import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Cpu,
  HeartPulse,
  Car,
  Landmark,
  ShoppingBag,
  Pickaxe,
  Zap,
  Building2,
  Globe,
  Flame,
  Equal,
  Layers,
  BarChart3,
} from "lucide-react";

interface IndexCardData {
  name: string;
  symbol: string;
  value: string;
  changePoints: string;
  changePercent: number;
  isPositive: boolean;
  dayHigh: string;
  dayLow: string;
  bars: number[]; // 12 values between 20-100 for mini CSS bars sparkline
}

interface SectorPerformanceData {
  name: string;
  code: string;
  changePercent: number;
  isPositive: boolean;
  topGainer: string;
  weight: string;
  icon: React.ReactNode;
}

interface MarketEventItem {
  id: string;
  title: string;
  timestamp: string;
  category: "Monetary Policy" | "Commodities" | "Corporate Earnings" | "Institutional Flows" | "Global Macro";
  categoryColor: "blue" | "amber" | "emerald" | "purple" | "indigo";
  impact: "Bullish" | "Bearish" | "Neutral";
  detail: string;
  icon: React.ReactNode;
}

const INDEX_CARDS: IndexCardData[] = [
  {
    name: "Nifty 50",
    symbol: "NSE: NIFTY50",
    value: "22,456.80",
    changePoints: "+269.45",
    changePercent: 1.2,
    isPositive: true,
    dayHigh: "22,492.30",
    dayLow: "22,210.10",
    bars: [35, 42, 38, 55, 60, 52, 68, 75, 82, 79, 91, 96],
  },
  {
    name: "Sensex",
    symbol: "BSE: SENSEX",
    value: "73,891.50",
    changePoints: "+660.20",
    changePercent: 0.9,
    isPositive: true,
    dayHigh: "73,980.10",
    dayLow: "73,240.50",
    bars: [40, 45, 50, 48, 62, 59, 70, 72, 80, 85, 88, 92],
  },
  {
    name: "Bank Nifty",
    symbol: "NSE: BANKNIFTY",
    value: "47,230.15",
    changePoints: "-142.10",
    changePercent: -0.3,
    isPositive: false,
    dayHigh: "47,480.00",
    dayLow: "47,150.25",
    bars: [85, 80, 75, 78, 65, 70, 60, 58, 52, 55, 48, 44],
  },
  {
    name: "India VIX",
    symbol: "NSE: INDIAVIX",
    value: "13.42",
    changePoints: "-0.72",
    changePercent: -5.1,
    isPositive: false,
    dayHigh: "14.20",
    dayLow: "13.25",
    bars: [92, 88, 82, 75, 68, 64, 58, 52, 45, 42, 38, 30],
  },
];

const SECTORS: SectorPerformanceData[] = [
  {
    name: "Metal",
    code: "NIFTY_METAL",
    changePercent: 3.1,
    isPositive: true,
    topGainer: "Tata Steel (+4.2%)",
    weight: "3.8% Nifty",
    icon: <Pickaxe className="w-4 h-4 text-emerald-600" />,
  },
  {
    name: "IT",
    code: "NIFTY_IT",
    changePercent: 2.1,
    isPositive: true,
    topGainer: "TCS (+3.4%)",
    weight: "13.5% Nifty",
    icon: <Cpu className="w-4 h-4 text-emerald-600" />,
  },
  {
    name: "Energy",
    code: "NIFTY_ENERGY",
    changePercent: 1.8,
    isPositive: true,
    topGainer: "Reliance (+2.2%)",
    weight: "11.9% Nifty",
    icon: <Zap className="w-4 h-4 text-emerald-600" />,
  },
  {
    name: "Pharma",
    code: "NIFTY_PHARMA",
    changePercent: 1.4,
    isPositive: true,
    topGainer: "Sun Pharma (+2.0%)",
    weight: "4.1% Nifty",
    icon: <HeartPulse className="w-4 h-4 text-emerald-600" />,
  },
  {
    name: "Banking",
    code: "NIFTY_BANK",
    changePercent: 0.6,
    isPositive: true,
    topGainer: "ICICI Bank (+1.1%)",
    weight: "33.2% Nifty",
    icon: <Landmark className="w-4 h-4 text-emerald-600" />,
  },
  {
    name: "FMCG",
    code: "NIFTY_FMCG",
    changePercent: -0.2,
    isPositive: false,
    topGainer: "ITC (+0.4%)",
    weight: "8.6% Nifty",
    icon: <ShoppingBag className="w-4 h-4 text-rose-600" />,
  },
  {
    name: "Auto",
    code: "NIFTY_AUTO",
    changePercent: -0.8,
    isPositive: false,
    topGainer: "M&M (+0.5%)",
    weight: "6.2% Nifty",
    icon: <Car className="w-4 h-4 text-rose-600" />,
  },
  {
    name: "Realty",
    code: "NIFTY_REALTY",
    changePercent: -1.5,
    isPositive: false,
    topGainer: "DLF (-0.8%)",
    weight: "1.2% Nifty",
    icon: <Building2 className="w-4 h-4 text-rose-600" />,
  },
];

const RECENT_EVENTS: MarketEventItem[] = [
  {
    id: "evt-1",
    title: "RBI holds repo rate at 6.5%",
    timestamp: "14:15 IST • 15 mins ago",
    category: "Monetary Policy",
    categoryColor: "blue",
    impact: "Neutral",
    detail: "Monetary Policy Committee maintains stance of 'withdrawal of accommodation' while reiterating retail inflation projection at 4.5%.",
    icon: <Landmark className="w-4 h-4 text-blue-600" />,
  },
  {
    id: "evt-2",
    title: "Crude oil rises to $82/bbl",
    timestamp: "13:42 IST • 48 mins ago",
    category: "Commodities",
    categoryColor: "amber",
    impact: "Bearish",
    detail: "Brent crude advances on Red Sea maritime transit alerts, creating short-term input cost headwinds for paint manufacturers and airlines.",
    icon: <Flame className="w-4 h-4 text-amber-600" />,
  },
  {
    id: "evt-3",
    title: "TCS reports Q2 results - beat estimates",
    timestamp: "12:55 IST • 1.5 hrs ago",
    category: "Corporate Earnings",
    categoryColor: "emerald",
    impact: "Bullish",
    detail: "Net profit climbs 5.0% QoQ to ₹12,040 Cr with $10B order book intake, triggering sector-wide upward re-rating across tier-1 Indian tech.",
    icon: <Cpu className="w-4 h-4 text-emerald-600" />,
  },
  {
    id: "evt-4",
    title: "FII outflows ₹2,340 Cr today",
    timestamp: "11:30 IST • 3 hrs ago",
    category: "Institutional Flows",
    categoryColor: "purple",
    impact: "Bearish",
    detail: "Foreign portfolio investors offload financial heavyweights; domestic mutual funds absorb selling with ₹2,890 Cr net equity purchases.",
    icon: <Layers className="w-4 h-4 text-purple-600" />,
  },
  {
    id: "evt-5",
    title: "US Fed signals December rate pause",
    timestamp: "09:45 IST • 5 hrs ago",
    category: "Global Macro",
    categoryColor: "indigo",
    impact: "Bullish",
    detail: "FOMC dot plot cooling eases US 10-year Treasury yields to 4.12%, reducing emerging market capital flight pressure.",
    icon: <Globe className="w-4 h-4 text-indigo-600" />,
  },
];

export const MarketOverviewView: React.FC = () => {
  const [activeTimeframe, setActiveTimeframe] = useState<"1D" | "1W" | "1M" | "YTD">("1D");
  const [sectorFilter, setSectorFilter] = useState<"all" | "gainers" | "losers">("all");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>("14:30:15 IST");

  // Breadth constants
  const advances = 1245;
  const declines = 892;
  const unchanged = 156;
  const totalTracked = advances + declines + unchanged; // 2,293
  const advPercent = ((advances / totalTracked) * 100).toFixed(1); // 54.3%
  const decPercent = ((declines / totalTracked) * 100).toFixed(1); // 38.9%
  const uncPercent = ((unchanged / totalTracked) * 100).toFixed(1); // 6.8%
  const adRatio = (advances / declines).toFixed(2); // 1.40

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")} IST`;
      setLastRefreshed(timeStr);
      setIsRefreshing(false);
    }, 600);
  };

  const filteredSectors = SECTORS.filter((s) => {
    if (sectorFilter === "gainers") return s.changePercent > 0;
    if (sectorFilter === "losers") return s.changePercent < 0;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl clay-surface border border-[var(--clay-border)]/90 shadow-2xs">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Market Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live NSE / BSE Feed
            </span>
            <span className="text-xs font-mono text-slate-400 border border-[var(--clay-border)] clay-surface px-2 py-0.5 rounded-md">
              Session: Regular Trading
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
            Real-time Indian indices, sectoral momentum distribution, advance-decline breadth, and market-moving macroeconomic catalysts.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {/* Timeframe Selector */}
          <div className="flex items-center clay-inset p-1 rounded-xl border border-[var(--clay-border)] text-xs font-semibold">
            {(["1D", "1W", "1M", "YTD"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTimeframe === tf
                    ? "clay-surface text-[var(--text-primary)] shadow-2xs font-bold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            title="Refresh Quotes"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--clay-border)] clay-surface hover:clay-surface text-xs font-mono text-[var(--text-secondary)] transition-all cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[var(--text-secondary)] ${
                isRefreshing ? "animate-spin text-blue-600" : ""
              }`}
            />
            <span>{lastRefreshed}</span>
          </button>
        </div>
      </div>

      {/* 1. Top Row: 4 Index Cards */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
              Key Benchmark Indices
            </h2>
            <span className="text-xs text-slate-400 font-normal">
              (Live Tick Interval: 1s)
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Market Sentiment: <strong className="text-emerald-600 font-semibold">Mildly Bullish (+1.2%)</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INDEX_CARDS.map((card) => {
            const isChangePos = card.changePercent >= 0;
            return (
              <div
                key={card.name}
                className="p-5 rounded-2xl clay-surface border border-[var(--clay-border)]/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between gap-4"
              >
                {/* Header: Title and Ticker */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                      {card.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {card.symbol}
                    </span>
                  </div>

                  {/* Change % Badge */}
                  <div
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
                      isChangePos
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {isChangePos ? (
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                    <span>
                      {isChangePos ? `+${card.changePercent}%` : `${card.changePercent}%`}
                    </span>
                  </div>
                </div>

                {/* Primary Figure & Points */}
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-2xl font-bold font-mono tracking-tight text-[var(--text-primary)]">
                    {card.value}
                  </div>
                  <div
                    className={`text-xs font-mono font-medium ${
                      isChangePos ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {card.changePoints}
                  </div>
                </div>

                {/* Sparkline & Intraday CSS Bar visual */}
                <div className="pt-2 border-t border-[var(--clay-border)] flex items-end justify-between gap-3">
                  <div className="flex flex-col text-[11px] text-slate-400 font-mono">
                    <span>H: {card.dayHigh}</span>
                    <span>L: {card.dayLow}</span>
                  </div>

                  {/* Tiny Sparkline-like CSS Bars */}
                  <div className="flex items-end gap-1 h-7 px-1.5 py-0.5 rounded-md clay-surface border border-[var(--clay-border)]">
                    {card.bars.map((barHeight, idx) => (
                      <div
                        key={idx}
                        title={`Tick ${idx + 1}: ${barHeight}%`}
                        className={`w-1 rounded-2xs transition-all ${
                          isChangePos
                            ? "bg-emerald-500/80 hover:bg-emerald-600"
                            : "bg-rose-500/80 hover:bg-rose-600"
                        }`}
                        style={{ height: `${Math.max(15, (barHeight / 100) * 22)}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Sector Performance Grid (3 Columns) */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">
              Sector Performance
            </h2>
            <span className="text-xs text-slate-400">
              (8 Key NSE Sectoral Indices)
            </span>
          </div>

          {/* Quick filter pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSectorFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                sectorFilter === "all"
                  ? "bg-slate-900 text-white"
                  : "clay-surface text-[var(--text-secondary)] border border-[var(--clay-border)] hover:clay-surface"
              }`}
            >
              All (8)
            </button>
            <button
              onClick={() => setSectorFilter("gainers")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                sectorFilter === "gainers"
                  ? "bg-emerald-600 text-white"
                  : "clay-surface text-emerald-700 border border-[var(--clay-border)] hover:bg-emerald-50"
              }`}
            >
              Advancing (5)
            </button>
            <button
              onClick={() => setSectorFilter("losers")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                sectorFilter === "losers"
                  ? "bg-rose-600 text-white"
                  : "clay-surface text-rose-700 border border-[var(--clay-border)] hover:bg-rose-50"
              }`}
            >
              Declining (3)
            </button>
          </div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSectors.map((sector) => {
            const isPos = sector.changePercent >= 0;
            // Normalize change % for visual bar width (relative to max 3.5% range)
            const absMagnitude = Math.min(100, Math.round((Math.abs(sector.changePercent) / 3.5) * 100));

            return (
              <div
                key={sector.name}
                className="p-4.5 rounded-2xl clay-surface border border-[var(--clay-border)]/90 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between gap-3.5"
              >
                {/* Sector header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl clay-surface border border-[var(--clay-border)] flex items-center justify-center">
                      {sector.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        {sector.name}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {sector.code}
                      </span>
                    </div>
                  </div>

                  {/* Percentage label */}
                  <div
                    className={`text-sm font-bold font-mono px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      isPos
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {isPos ? (
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                    <span>
                      {isPos ? `+${sector.changePercent}%` : `${sector.changePercent}%`}
                    </span>
                  </div>
                </div>

                {/* Colored Progress Bar (Green for positive, Red for negative) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Performance Intensity</span>
                    <span className={isPos ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>
                      {absMagnitude}% of Sector Limit
                    </span>
                  </div>

                  {/* Visual Bar Track */}
                  <div className="w-full clay-inset rounded-full h-2.5 overflow-hidden p-0.5 border border-[var(--clay-border)]/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPos
                          ? "bg-emerald-500 shadow-xs shadow-emerald-500/30"
                          : "bg-rose-500 shadow-xs shadow-rose-500/30"
                      }`}
                      style={{ width: `${absMagnitude}%` }}
                    />
                  </div>
                </div>

                {/* Footer details */}
                <div className="pt-2 border-t border-[var(--clay-border)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                  <span>
                    Lead: <strong className="text-[var(--text-primary)] font-medium">{sector.topGainer}</strong>
                  </span>
                  <span className="font-mono text-slate-400">
                    {sector.weight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Row 3: Market Breadth + Recent Events Feed (2-Column Responsive Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3. Market Breadth Section (5 Columns on desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-4 p-6 rounded-2xl clay-surface border border-[var(--clay-border)]/90 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--clay-border)]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Market Breadth
              </h2>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md clay-inset text-[var(--text-secondary)] border border-[var(--clay-border)]">
              A/D Ratio: {adRatio}
            </span>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Market participation across <strong>{totalTracked.toLocaleString()}</strong> listed equities on the National Stock Exchange. Advancing stocks maintain clear control of session liquidity.
          </p>

          {/* Key Metric Blocks: Advances, Declines, Unchanged */}
          <div className="grid grid-cols-3 gap-3">
            {/* Advances */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Advances</span>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-900">
                {advances.toLocaleString()}
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-medium">
                {advPercent}% of Total
              </span>
            </div>

            {/* Declines */}
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-rose-800 font-semibold">
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                <span>Declines</span>
              </div>
              <div className="text-xl font-bold font-mono text-rose-900">
                {declines.toLocaleString()}
              </div>
              <span className="text-[11px] font-mono text-rose-700 font-medium">
                {decPercent}% of Total
              </span>
            </div>

            {/* Unchanged */}
            <div className="p-3.5 rounded-xl clay-surface border border-[var(--clay-border)] flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-primary)] font-semibold">
                <Equal className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                <span>Unchanged</span>
              </div>
              <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
                {unchanged.toLocaleString()}
              </div>
              <span className="text-[11px] font-mono text-[var(--text-secondary)] font-medium">
                {uncPercent}% of Total
              </span>
            </div>
          </div>

          {/* Horizontal Stacked Bar */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
              <span className="text-emerald-700 font-semibold">
                Advances ({advPercent}%)
              </span>
              <span className="text-[var(--text-secondary)]">
                Unch ({uncPercent}%)
              </span>
              <span className="text-rose-700 font-semibold">
                Declines ({decPercent}%)
              </span>
            </div>

            {/* The Stacked Bar */}
            <div
              className="w-full h-4 rounded-full clay-inset flex overflow-hidden border border-[var(--clay-border)] shadow-inner"
              title={`Advances: ${advPercent}% | Unchanged: ${uncPercent}% | Declines: ${decPercent}%`}
            >
              <div
                style={{ width: `${advPercent}%` }}
                className="bg-emerald-500 hover:bg-emerald-600 transition-all cursor-pointer"
                title={`Advances: ${advances} stocks (${advPercent}%)`}
              />
              <div
                style={{ width: `${uncPercent}%` }}
                className="bg-slate-300 hover:bg-slate-400 transition-all cursor-pointer"
                title={`Unchanged: ${unchanged} stocks (${uncPercent}%)`}
              />
              <div
                style={{ width: `${decPercent}%` }}
                className="bg-rose-500 hover:bg-rose-600 transition-all cursor-pointer"
                title={`Declines: ${declines} stocks (${decPercent}%)`}
              />
            </div>
          </div>

          {/* Secondary Breadth Indicators */}
          <div className="pt-3 border-t border-[var(--clay-border)] flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="text-[var(--text-secondary)]">52-Week Highs vs. Lows:</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  84 Highs
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  12 Lows
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="text-[var(--text-secondary)]">Circuit Limits (Upper / Lower):</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[var(--text-primary)] font-medium">62 Upper</span>
                <span className="text-slate-300">•</span>
                <span className="text-[var(--text-primary)] font-medium">19 Lower</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Recent Events Feed (7 Columns on desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-4 p-6 rounded-2xl clay-surface border border-[var(--clay-border)]/90 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--clay-border)]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                Recent Events Feed
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              5 Catalysts Logged Today
            </span>
          </div>

          {/* Feed List */}
          <div className="flex flex-col gap-3">
            {RECENT_EVENTS.map((event) => {
              const isSelected = selectedEventId === event.id;

              return (
                <div
                  key={event.id}
                  onClick={() =>
                    setSelectedEventId(isSelected ? null : event.id)
                  }
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                    isSelected
                      ? "clay-surface/90 border-blue-400 shadow-xs"
                      : "clay-surface border-[var(--clay-border)] hover:border-slate-300 hover:clay-surface/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-1">
                      <div className="p-2 rounded-lg clay-inset border border-[var(--clay-border)]/80 flex-shrink-0">
                        {event.icon}
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-[var(--text-primary)] hover:text-blue-600 transition-colors">
                            {event.title}
                          </h4>
                          <span
                            className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase border ${
                              event.categoryColor === "blue"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : event.categoryColor === "amber"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : event.categoryColor === "emerald"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : event.categoryColor === "purple"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-indigo-50 text-indigo-700 border-indigo-200"
                            }`}
                          >
                            {event.category}
                          </span>
                        </div>

                        <span className="text-xs font-mono text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {event.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Impact badge */}
                    <div
                      className={`text-[11px] font-bold font-mono px-2.5 py-1 rounded-lg border flex-shrink-0 ${
                        event.impact === "Bullish"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : event.impact === "Bearish"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "clay-surface text-[var(--text-secondary)] border-[var(--clay-border)]"
                      }`}
                    >
                      {event.impact}
                    </div>
                  </div>

                  {/* Context and Detail */}
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-10">
                    {event.detail}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[var(--clay-border)] flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Aggregated from RBI, SEBI, Bloomberg & NSE Filings</span>
            <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
              Historical Catalysts Archive →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

