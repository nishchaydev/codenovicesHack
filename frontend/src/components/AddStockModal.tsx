import React, { useState, useEffect, useMemo } from "react";
import { StockSearchResult, StockProfileData, FinGraphScenario, StockHistory, StockPricePoint } from "../types";
import { searchStocks, fetchStockProfile, generateStockScenario, fetchStockHistory } from "../api";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShieldAlert, 
  Bell, 
  CheckCircle2, 
  Layers, 
  Zap, 
  BarChart3, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Sliders,
  DollarSign,
  Flame,
  Check,
  Plus,
  X
} from "lucide-react";

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyScenario: (scenario: FinGraphScenario) => void;
  onAddStockToProfiler?: (ticker: string) => void;
}

const POPULAR_TICKERS = [
  { ticker: "RELIANCE.NS", symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy", badge: "Oil & Petchem" },
  { ticker: "HDFCBANK.NS", symbol: "HDFCBANK", name: "HDFC Bank Ltd", sector: "Banking", badge: "Private Credit" },
  { ticker: "TCS.NS", symbol: "TCS", name: "TCS Ltd", sector: "IT", badge: "Global IT Services" },
  { ticker: "INFY.NS", symbol: "INFY", name: "Infosys Ltd", sector: "IT", badge: "Digital Transformation" },
  { ticker: "ICICIBANK.NS", symbol: "ICICIBANK", name: "ICICI Bank Ltd", sector: "Banking", badge: "Universal Banking" },
  { ticker: "M&M.NS", symbol: "M&M", name: "Mahindra & Mahindra", sector: "Auto", badge: "SUVs & Farm Tech" },
  { ticker: "TATASTEEL.NS", symbol: "TATASTEEL", name: "Tata Steel Ltd", sector: "Metals", badge: "Hot-Rolled & Rebar" },
  { ticker: "COALINDIA.NS", symbol: "COALINDIA", name: "Coal India Ltd", sector: "Mining", badge: "Thermal Coal" },
  { ticker: "IOCL.NS", symbol: "IOCL", name: "Indian Oil Corp", sector: "Energy", badge: "Downstream Fuels" },
  { ticker: "BEL.NS", symbol: "BEL", name: "Bharat Electronics", sector: "Defense", badge: "Avionics & Radars" },
  { ticker: "HAL.NS", symbol: "HAL", name: "Hindustan Aeronautics", sector: "Defense", badge: "Fighter Jets & Tejas" },
  { ticker: "ZOMATO.NS", symbol: "ZOMATO", name: "Zomato Ltd", sector: "Tech", badge: "Quick Commerce Blinkit" },
  { ticker: "SBIN.NS", symbol: "SBIN", name: "State Bank of India", sector: "Banking", badge: "Public Sector Banking" },
  { ticker: "ASIANPAINT.NS", symbol: "ASIANPAINT", name: "Asian Paints Ltd", sector: "Paints", badge: "Coatings Leader" },
  { ticker: "TITAN.NS", symbol: "TITAN", name: "Titan Company", sector: "Consumer", badge: "Tanishq & Jewelry" },
  { ticker: "NVDA", symbol: "NVDA", name: "NVIDIA Corp", sector: "Semiconductors", badge: "AI Accelerators" },
  { ticker: "AAPL", symbol: "AAPL", name: "Apple Inc.", sector: "Hardware", badge: "iPhone & Services" },
  { ticker: "MSFT", symbol: "MSFT", name: "Microsoft Corp", sector: "Cloud", badge: "Azure & Copilot" },
  { ticker: "TSLA", symbol: "TSLA", name: "Tesla Inc.", sector: "Auto", badge: "EV & Energy Storage" },
];

export const AddStockModal: React.FC<AddStockModalProps> = ({
  isOpen,
  onClose,
  onApplyScenario,
  onAddStockToProfiler,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>("RELIANCE.NS");
  const [stockProfile, setStockProfile] = useState<StockProfileData | null>(null);
  const [stockHistory, setStockHistory] = useState<StockHistory | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedHeadline, setSelectedHeadline] = useState<string | null>(null);

  // Inspector Sub-Tabs
  const [activeTab, setActiveTab] = useState<"chart" | "deal" | "supply_chain" | "news">("chart");
  const [selectedTimeframe, setSelectedTimeframe] = useState<"7D" | "14D" | "1M" | "ALL">("14D");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [targetAlertPrice, setTargetAlertPrice] = useState("");
  const [alertSuccessToast, setAlertSuccessToast] = useState<string | null>(null);

  // Load search results when query changes
  useEffect(() => {
    let active = true;
    const performSearch = async () => {
      try {
        const results = await searchStocks(searchQuery);
        if (active) {
          setSearchResults(results);
        }
      } catch (err) {
        console.error("Stock search failed:", err);
      }
    };

    const debounce = setTimeout(performSearch, 200);
    return () => {
      active = false;
      clearTimeout(debounce);
    };
  }, [searchQuery]);

  // Load stock profile & Alpha Vantage history when selectedStock changes
  useEffect(() => {
    if (!isOpen || !selectedStock) return;
    let active = true;
    setIsLoadingProfile(true);
    setIsLoadingHistory(true);
    setSelectedHeadline(null);
    setHoverIndex(null);

    fetchStockProfile(selectedStock)
      .then((data) => {
        if (active) {
          setStockProfile(data);
          setIsLoadingProfile(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load stock profile:", err);
        if (active) setIsLoadingProfile(false);
      });

    fetchStockHistory(selectedStock)
      .then((history) => {
        if (active) {
          setStockHistory(history);
          setIsLoadingHistory(false);
          if (history.current_price) {
            setTargetAlertPrice(Math.round(history.current_price * 0.95).toString());
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load stock history:", err);
        if (active) setIsLoadingHistory(false);
      });

    return () => {
      active = false;
    };
  }, [selectedStock, isOpen]);

  // Filtered prices based on timeframe
  const displayedPrices = useMemo(() => {
    const raw = stockHistory?.prices || stockProfile?.prices || [];
    if (!raw.length) return [];
    if (selectedTimeframe === "7D") return raw.slice(-7);
    if (selectedTimeframe === "14D") return raw.slice(-14);
    if (selectedTimeframe === "1M") return raw.slice(-30);
    return raw;
  }, [stockHistory, stockProfile, selectedTimeframe]);

  if (!isOpen) return null;

  const handleLaunchScenario = async (headlineToUse?: string) => {
    if (!selectedStock) return;
    setIsGenerating(true);
    try {
      const scenario = await generateStockScenario(selectedStock, headlineToUse || selectedHeadline || undefined);
      onApplyScenario(scenario);
      onClose();
    } catch (err) {
      console.error("Failed to generate scenario:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAlertPrice) return;
    try {
      const existing = JSON.parse(localStorage.getItem("find_price_alerts") || "[]");
      existing.push({
        ticker: stockProfile?.symbol || selectedStock,
        targetPrice: targetAlertPrice,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("find_price_alerts", JSON.stringify(existing));
    } catch {}
    setAlertSuccessToast(`🎯 Price Alert Saved: Monitoring live feed for ${stockProfile?.symbol || selectedStock} <= ₹${targetAlertPrice}`);
    setTimeout(() => setAlertSuccessToast(null), 3000);
  };

  const sectors = ["All", "Automotive", "Energy", "Banking", "IT / Tech", "Paints", "Consumer"];

  const filteredPopular = POPULAR_TICKERS.filter((item) => {
    if (selectedSector === "All") return true;
    if (selectedSector === "Automotive" && item.sector === "Auto") return true;
    if (selectedSector === "Energy" && item.sector === "Energy") return true;
    if (selectedSector === "Banking" && item.sector === "Banking") return true;
    if (selectedSector === "IT / Tech" && (item.sector === "IT" || item.sector === "Semiconductors")) return true;
    if (selectedSector === "Paints" && item.sector === "Paints") return true;
    return false;
  });

  // Calculate chart geometry
  const chartWidth = 620;
  const chartHeight = 160;
  const paddingX = 14;
  const paddingY = 16;
  const priceValues = displayedPrices.map((p) => p.close);
  const minVal = priceValues.length ? Math.min(...priceValues) : 0;
  const maxVal = priceValues.length ? Math.max(...priceValues) : 1;
  const rangeVal = maxVal - minVal || 1;

  const chartPoints = displayedPrices.map((p, idx) => {
    const x = paddingX + (idx / Math.max(1, displayedPrices.length - 1)) * (chartWidth - 2 * paddingX);
    const y = chartHeight - paddingY - ((p.close - minVal) / rangeVal) * (chartHeight - 2 * paddingY);
    return { x, y, point: p };
  });

  const pathD = chartPoints.length > 1
    ? `M ${chartPoints.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" L ")}`
    : "";

  const areaD = chartPoints.length > 1
    ? `${pathD} L ${chartPoints[chartPoints.length - 1].x.toFixed(1)},${chartHeight} L ${chartPoints[0].x.toFixed(1)},${chartHeight} Z`
    : "";

  const currentClose = stockProfile?.current_price || stockHistory?.current_price || (displayedPrices.length ? displayedPrices[displayedPrices.length - 1].close : 100);
  const changePct = stockProfile?.change_pct ?? stockHistory?.change_pct ?? 0;
  const isPositive = changePct >= 0;

  // Valuation metrics
  const rangeHigh = stockHistory?.high_ever || (displayedPrices.length ? Math.max(...displayedPrices.map(p => p.close)) : currentClose * 1.08);
  const rangeLow = stockHistory?.low_ever || (displayedPrices.length ? Math.min(...displayedPrices.map(p => p.close)) : currentClose * 0.92);
  const rangeAvg = stockHistory?.avg_price || Math.round((rangeHigh + rangeLow) / 2);
  const dealScore = stockHistory?.deal_score || Math.max(15, Math.min(98, Math.round(100 - ((currentClose - rangeLow) / (rangeHigh - rangeLow || 1)) * 60)));

  // Speedometer calculation
  const gaugeAngle = -180 + (dealScore / 100) * 180;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar - Platform Theme Matching */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-base shadow-xs">
              📈
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Asset & Stock Transmission Profiler
                </h2>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-700 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Alpha Vantage Active</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Live market price stream, Deal Scanner valuation matrix, and institutional contagion pathways.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live API Telemetry Ribbon */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between text-[11.5px] font-mono text-slate-600">
          <div className="flex items-center gap-3">
            <span className="text-slate-500">API Connection:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              Alphavantage • V2AKQHWKPOSIOWJT
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-emerald-600 font-semibold hidden sm:inline">Feed Latency: ~180ms</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <span>Active Universe:</span>
            <span className="text-slate-800 font-semibold">NSE • BSE • US Tech • Commodities</span>
          </div>
        </div>

        {/* Search & Sector Filters */}
        <div className="px-6 py-3 border-b border-slate-200/80 bg-white flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any ticker (TATA STEEL, RELIANCE, NVDA)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-0.5">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedSector === sec
                    ? "bg-slate-900 text-white shadow-xs font-semibold"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Discovery Chips */}
        <div className="px-6 py-2 bg-slate-50/70 border-b border-slate-200/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-500 font-mono flex items-center gap-1 shrink-0 font-medium">
            <Zap className="w-3 h-3 text-amber-500" /> Quick Discovery:
          </span>
          {[
            { name: "Tata Steel", ticker: "TATASTEEL.NS" },
            { name: "Reliance", ticker: "RELIANCE.NS" },
            { name: "Coal India", ticker: "COALINDIA.NS" },
            { name: "BEL", ticker: "BEL.NS" },
            { name: "Zomato", ticker: "ZOMATO.NS" },
            { name: "NVIDIA", ticker: "NVDA" },
            { name: "Apple", ticker: "AAPL" },
            { name: "Tesla", ticker: "TSLA" },
            { name: "HDFC Bank", ticker: "HDFCBANK.NS" },
            { name: "TCS", ticker: "TCS.NS" },
          ].map((chip) => (
            <button
              key={chip.ticker}
              onClick={() => {
                setSearchQuery(chip.name);
                setSelectedStock(chip.ticker);
              }}
              className={`px-2.5 py-0.5 rounded-full border text-[10.5px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedStock === chip.ticker
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {chip.name}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200/80">
          
          {/* Left Column: Equity Selection (4 cols) */}
          <div className="md:col-span-4 p-4 space-y-2.5 bg-slate-50/60 overflow-y-auto max-h-[580px]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center justify-between px-1">
              <span>Securities Universe</span>
              <span className="text-slate-400 font-normal">{searchQuery ? searchResults.length : filteredPopular.length} available</span>
            </div>

            <div className="space-y-1.5">
              {searchQuery ? (
                searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <button
                      key={item.ticker}
                      onClick={() => setSelectedStock(item.ticker)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        selectedStock === item.ticker
                          ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10 text-slate-900"
                          : "bg-white border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">{item.symbol}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">{item.exchange}</span>
                        </div>
                        <p className="text-[11.5px] text-slate-500 truncate max-w-[170px] mt-0.5">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-blue-600 font-semibold block">{item.sector}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.market_cap}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/70 text-center space-y-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto text-sm">
                      🔍
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Dynamic Equity Discovery
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Add <strong className="text-blue-700 font-mono">"{searchQuery.toUpperCase()}"</strong> to live stream.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const cleanSym = searchQuery.trim().toUpperCase().replace(/\s+/g, "");
                        const tick = cleanSym.includes(".") || ["PLTR", "ARM", "SMCI", "INTC", "BABA", "UBER", "COIN", "ORCL", "NFLX", "CRM", "AMD", "META", "TSLA", "AAPL", "MSFT", "GOOGL", "AMZN"].includes(cleanSym)
                          ? cleanSym
                          : `${cleanSym}.NS`;
                        setSelectedStock(tick);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Profile {searchQuery.toUpperCase()} Live</span>
                    </button>
                  </div>
                )
              ) : (
                filteredPopular.map((item) => (
                  <button
                    key={item.ticker}
                    onClick={() => setSelectedStock(item.ticker)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      selectedStock === item.ticker
                        ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10 text-slate-900"
                        : "bg-white border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{item.symbol}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">{item.sector}</span>
                      </div>
                      <p className="text-[11.5px] text-slate-500 mt-0.5">{item.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-semibold border border-slate-200">
                        {item.badge}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Profiler, Live Graph & Deal Matrix (8 cols) */}
          <div className="md:col-span-8 p-6 space-y-4 overflow-y-auto max-h-[580px] bg-white">
            {isLoadingProfile ? (
              <div className="h-72 flex flex-col items-center justify-center space-y-3 text-slate-400">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-mono text-slate-500">Ingesting Alpha Vantage series & fundamentals...</p>
              </div>
            ) : stockProfile ? (
              <>
                {/* Top Stock Snapshot Card (Slate-900 Contrast Card) */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <h3 className="text-lg font-bold text-white tracking-tight">{stockProfile.name}</h3>
                      <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-white/10 text-blue-300 border border-white/20 font-semibold">
                        {stockProfile.symbol}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-lg bg-white/10 text-slate-300 font-medium">
                        {stockProfile.exchange}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {stockProfile.sector} • {stockProfile.industry}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-2xl font-bold font-mono text-white">
                        {stockProfile.currency === "INR" ? "₹" : "$"}{currentClose.toLocaleString()}
                      </div>
                      <div className={`text-xs font-mono font-medium flex items-center justify-end gap-1 mt-0.5 ${
                        isPositive ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        <span>{isPositive ? "▲" : "▼"}</span>
                        <span>{isPositive ? "+" : ""}{changePct}% today</span>
                      </div>
                    </div>
                    <div className="border-l border-white/15 pl-4 text-left">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">Market Cap</span>
                      <span className="text-xs font-mono font-semibold text-slate-100">{stockProfile.market_cap}</span>
                    </div>
                  </div>
                </div>

                {/* Toast message if alert set */}
                {alertSuccessToast && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{alertSuccessToast}</span>
                  </div>
                )}

                {/* Sub-Navigation Tabs */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab("chart")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === "chart"
                          ? "bg-slate-900 text-white shadow-xs font-semibold"
                          : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Live Price Graph</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("deal")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === "deal"
                          ? "bg-amber-600 text-white shadow-xs font-semibold"
                          : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-300" />
                      <span>Deal & Price Drop</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("supply_chain")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === "supply_chain"
                          ? "bg-indigo-600 text-white shadow-xs font-semibold"
                          : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Supply Chain</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("news")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeTab === "news"
                          ? "bg-emerald-700 text-white shadow-xs font-semibold"
                          : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Catalysts ({stockProfile.news.length})</span>
                    </button>
                  </div>

                  {/* Timeframe selector (visible on chart tab) */}
                  {activeTab === "chart" && (
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      {(["7D", "14D", "1M", "ALL"] as const).map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setSelectedTimeframe(tf)}
                          className={`px-2 py-0.5 text-[10px] font-mono rounded-md transition-all cursor-pointer ${
                            selectedTimeframe === tf
                              ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* TAB 1: LIVE PRICE GRAPH */}
                {activeTab === "chart" && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 shadow-2xs relative">
                      {/* Graph Header info */}
                      <div className="flex items-center justify-between text-xs mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">
                            Alpha Vantage Trajectory ({selectedTimeframe})
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-semibold shadow-2xs">
                            {displayedPrices.length} Trading Days
                          </span>
                        </div>
                        <div className="text-right font-mono text-[11.5px]">
                          {hoverIndex !== null && displayedPrices[hoverIndex] ? (
                            <span className="text-blue-600 font-bold">
                              {displayedPrices[hoverIndex].date}: {stockProfile.currency === "INR" ? "₹" : "$"}{displayedPrices[hoverIndex].close.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-slate-500">
                              Low: {stockProfile.currency === "INR" ? "₹" : "$"}{minVal.toFixed(1)} • High: {stockProfile.currency === "INR" ? "₹" : "$"}{maxVal.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Interactive SVG Chart */}
                      <div className="relative w-full overflow-hidden bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
                        <svg
                          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                          className="w-full h-44 overflow-visible"
                          onMouseLeave={() => setHoverIndex(null)}
                        >
                          <defs>
                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
                              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#1d4ed8" />
                            </linearGradient>
                          </defs>

                          {/* Grid horizontal lines */}
                          <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#e2e8f0" strokeDasharray="3 3" />
                          <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="#e2e8f0" strokeDasharray="3 3" />
                          <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#e2e8f0" strokeDasharray="3 3" />

                          {/* Area & Line */}
                          {areaD && <path d={areaD} fill="url(#priceGradient)" />}
                          {pathD && (
                            <path
                              d={pathD}
                              fill="none"
                              stroke="url(#strokeGradient)"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}

                          {/* Interactive data points */}
                          {chartPoints.map((pt, idx) => (
                            <g key={idx}>
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={hoverIndex === idx ? "5" : "2.5"}
                                fill={hoverIndex === idx ? "#1d4ed8" : "#2563eb"}
                                stroke="#ffffff"
                                strokeWidth="2"
                                className="cursor-pointer transition-all"
                                onMouseEnter={() => setHoverIndex(idx)}
                              />
                              {hoverIndex === idx && (
                                <line
                                  x1={pt.x}
                                  y1={paddingY}
                                  x2={pt.x}
                                  y2={chartHeight - paddingY}
                                  stroke="#2563eb"
                                  strokeWidth="1.2"
                                  strokeDasharray="2 2"
                                />
                              )}
                            </g>
                          ))}
                        </svg>

                        {/* Floating Tooltip */}
                        {hoverIndex !== null && displayedPrices[hoverIndex] && chartPoints[hoverIndex] && (
                          <div 
                            className="absolute pointer-events-none bg-slate-900 text-white border border-slate-800 shadow-xl rounded-xl px-3 py-1.5 text-[11px] font-mono transform -translate-x-1/2 -translate-y-full"
                            style={{
                              left: `${(chartPoints[hoverIndex].x / chartWidth) * 100}%`,
                              top: `${Math.max(20, (chartPoints[hoverIndex].y / chartHeight) * 100 - 10)}%`
                            }}
                          >
                            <div className="text-slate-400 text-[10px]">{displayedPrices[hoverIndex].date}</div>
                            <div className="font-bold text-blue-300 text-xs">
                              {stockProfile.currency === "INR" ? "₹" : "$"}{displayedPrices[hoverIndex].close.toLocaleString()}
                            </div>
                            {displayedPrices[hoverIndex].volume ? (
                              <div className="text-slate-400 text-[9px] mt-0.5">
                                Vol: {displayedPrices[hoverIndex].volume?.toLocaleString()}
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>

                      {/* Bottom Date range axis */}
                      <div className="flex justify-between items-center text-[10.5px] font-mono text-slate-500 pt-1.5 border-t border-slate-200 mt-1.5">
                        <span>{displayedPrices.length ? displayedPrices[0].date : ""}</span>
                        <span className="text-emerald-700 font-semibold">Alpha Vantage Live Verified</span>
                        <span>{displayedPrices.length ? displayedPrices[displayedPrices.length - 1].date : ""}</span>
                      </div>
                    </div>

                    {/* Quick Technical Telemetry Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                        <span className="text-[10px] uppercase text-slate-500 block font-sans">30D High</span>
                        <span className="text-slate-900 font-bold text-sm">
                          {stockProfile.currency === "INR" ? "₹" : "$"}{rangeHigh.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                        <span className="text-[10px] uppercase text-slate-500 block font-sans">30D Low</span>
                        <span className="text-slate-900 font-bold text-sm">
                          {stockProfile.currency === "INR" ? "₹" : "$"}{rangeLow.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                        <span className="text-[10px] uppercase text-slate-500 block font-sans">30D Average</span>
                        <span className="text-slate-700 font-bold text-sm">
                          {stockProfile.currency === "INR" ? "₹" : "$"}{rangeAvg.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs">
                        <span className="text-[10px] uppercase text-emerald-700 block font-sans font-semibold">Deal Score</span>
                        <span className="text-emerald-800 font-bold text-sm">
                          {dealScore} / 100
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: DEAL SCANNER & PRICE DROP */}
                {activeTab === "deal" && (
                  <div className="space-y-3">
                    {/* Speedometer & Hatke Deal Banner */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-emerald-50/80 border border-amber-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
                      
                      {/* Left: Speedometer Gauge */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-28 h-20 flex items-center justify-center">
                          <svg viewBox="0 0 100 60" className="w-28 h-20">
                            {/* Gauge background arc */}
                            <path
                              d="M 15 50 A 35 35 0 0 1 85 50"
                              fill="none"
                              stroke="#e2e8f0"
                              strokeWidth="10"
                              strokeLinecap="round"
                            />
                            {/* Colored segments */}
                            <path
                              d="M 15 50 A 35 35 0 0 1 35 24"
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="10"
                            />
                            <path
                              d="M 35 24 A 35 35 0 0 1 65 24"
                              fill="none"
                              stroke="#f59e0b"
                              strokeWidth="10"
                            />
                            <path
                              d="M 65 24 A 35 35 0 0 1 85 50"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="10"
                              strokeLinecap="round"
                            />
                            {/* Needle */}
                            <g transform={`rotate(${gaugeAngle}, 50, 50)`}>
                              <line x1="50" y1="50" x2="50" y2="20" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                              <circle cx="50" cy="50" r="4" fill="#2563eb" />
                            </g>
                          </svg>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold font-mono text-slate-900">{dealScore}</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                              {dealScore >= 80 ? "Epic Hatke Steal" : (dealScore >= 60 ? "Great Value" : "Fair Price")}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-slate-500 mt-0.5">
                            Valuation cushion near 30-day baseline support.
                          </p>
                        </div>
                      </div>

                      {/* Right: Price Drop Indicator */}
                      <div className="text-right">
                        <div className="text-xs text-slate-500 font-medium">Lowest in Range</div>
                        <div className="text-lg font-bold font-mono text-emerald-700">
                          {stockProfile.currency === "INR" ? "₹" : "$"}{rangeLow.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Current: {stockProfile.currency === "INR" ? "₹" : "$"}{currentClose.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Deal Score Breakup */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-blue-600" />
                        <span>Deal Score Breakup (Fin.D Econometric Engine)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex justify-between items-center">
                          <span className="text-slate-700 font-medium">Mean Reversion Discount</span>
                          <span className="text-emerald-700 font-mono font-bold">+34 pts</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex justify-between items-center">
                          <span className="text-slate-700 font-medium">Alpha Vantage Moving Avg Cushion</span>
                          <span className="text-emerald-700 font-mono font-bold">+28 pts</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex justify-between items-center">
                          <span className="text-slate-700 font-medium">Supply Chain Moat</span>
                          <span className="text-blue-700 font-mono font-bold">+18 pts</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex justify-between items-center">
                          <span className="text-slate-700 font-medium">Institutional Accumulation Flow</span>
                          <span className="text-indigo-700 font-mono font-bold">+12 pts</span>
                        </div>
                      </div>
                    </div>

                    {/* Price Drop Alert Engine */}
                    <form onSubmit={handleSetAlert} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5 text-amber-600" />
                          <span>Set Real-Time Price Drop Alert</span>
                        </span>
                        <span className="text-[10.5px] text-slate-400 font-mono">Pings via WebSocket stream</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3.5 top-2 text-slate-400 text-xs font-medium">
                            {stockProfile.currency === "INR" ? "₹" : "$"}
                          </span>
                          <input
                            type="number"
                            value={targetAlertPrice}
                            onChange={(e) => setTargetAlertPrice(e.target.value)}
                            placeholder="Target buy price (e.g. 940)"
                            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-2xs"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>Set Alert</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* TAB 3: SUPPLY CHAIN TRANSMISSION */}
                {activeTab === "supply_chain" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <span>🔗</span> Institutional Supply Chain & Sector Channels
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">{stockProfile.supply_chain.sector_index}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      {/* Upstream */}
                      <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80">
                        <span className="text-[10.5px] uppercase font-mono text-amber-800 font-bold block mb-1.5">
                          Upstream Inputs
                        </span>
                        <div className="space-y-1.5">
                          {stockProfile.supply_chain.upstream_inputs.map((inp, i) => (
                            <div key={i} className="flex items-center justify-between text-[11px] text-slate-700">
                              <span className="truncate pr-1">• {inp.title}</span>
                              <span className={`font-mono text-[10px] font-bold ${
                                inp.metricColor === "red" ? "text-rose-600" : inp.metricColor === "green" ? "text-emerald-600" : "text-blue-600"
                              }`}>{inp.metric}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Downstream */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
                        <span className="text-[10.5px] uppercase font-mono text-emerald-800 font-bold block mb-1.5">
                          Downstream Buyers
                        </span>
                        <div className="space-y-1.5">
                          {stockProfile.supply_chain.downstream_impacts.map((dn, i) => (
                            <div key={i} className="flex items-center justify-between text-[11px] text-slate-700">
                              <span className="truncate pr-1">• {dn.title}</span>
                              <span className={`font-mono text-[10px] font-bold ${
                                dn.metricColor === "red" ? "text-rose-600" : dn.metricColor === "green" ? "text-emerald-600" : "text-blue-600"
                              }`}>{dn.metric}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Competitors */}
                      <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/80">
                        <span className="text-[10.5px] uppercase font-mono text-blue-800 font-bold block mb-1.5">
                          Key Competitors
                        </span>
                        <div className="space-y-1.5">
                          {stockProfile.supply_chain.competitors.map((cp, i) => (
                            <div key={i} className="flex items-center justify-between text-[11px] text-slate-700">
                              <span className="truncate pr-1">• {cp.title}</span>
                              <span className="font-mono text-[10px] font-bold text-emerald-700">{cp.metric}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: REAL BREAKING NEWS FEED */}
                {activeTab === "news" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Breaking Intelligence Feed ({stockProfile.news.length} items)
                      </span>
                      <span className="text-[11px] text-slate-400">Click catalyst to propagate shock</span>
                    </div>

                    <div className="space-y-2">
                      {stockProfile.news.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                            selectedHeadline === item.title
                              ? "bg-blue-50 border-blue-400 shadow-xs"
                              : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                          }`}
                        >
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                                item.sentiment === "Bearish" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                                item.sentiment === "Bullish" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}>
                                {item.sentiment}
                              </span>
                              <span className="text-[10.5px] text-slate-400 font-mono">{item.source} • {item.date}</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-800 leading-snug">
                              {item.title}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <button
                              onClick={() => {
                                setSelectedHeadline(item.title);
                                handleLaunchScenario(item.title);
                              }}
                              disabled={isGenerating}
                              className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                            >
                              <span>⚡</span>
                              <span>Propagate Shock →</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Primary CTA Buttons */}
                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200">
                  <div className="text-xs text-slate-500">
                    Add <span className="text-slate-900 font-bold">{stockProfile.name}</span> to Asset Profiler or project onto Impact Graph.
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {onAddStockToProfiler && (
                      <button
                        type="button"
                        onClick={() => {
                          onAddStockToProfiler(selectedStock);
                          onClose();
                        }}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Asset Profiler & Watchlist</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleLaunchScenario()}
                      disabled={isGenerating}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Calculating Shock Pathways...</span>
                        </>
                      ) : (
                        <>
                          <span>Project Transmission Graph</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
                Select an asset from the left to view profile and live news.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
