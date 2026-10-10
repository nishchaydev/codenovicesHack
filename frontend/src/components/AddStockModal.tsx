import React, { useState, useEffect } from "react";
import { StockSearchResult, StockProfileData, FinGraphScenario } from "../types";
import { searchStocks, fetchStockProfile, generateStockScenario } from "../api";

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyScenario: (scenario: FinGraphScenario) => void;
}

const POPULAR_TICKERS = [
  { ticker: "TATAMOTORS.NS", symbol: "TATAMOTORS", name: "Tata Motors", sector: "Auto", badge: "Commercial & PV" },
  { ticker: "RELIANCE.NS", symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy", badge: "Oil & Petchem" },
  { ticker: "HDFCBANK.NS", symbol: "HDFCBANK", name: "HDFC Bank", sector: "Banking", badge: "Private Credit" },
  { ticker: "ASIANPAINT.NS", symbol: "ASIANPAINT", name: "Asian Paints", sector: "Paints", badge: "Coatings Leader" },
  { ticker: "TCS.NS", symbol: "TCS", name: "TCS", sector: "IT", badge: "Global IT Services" },
  { ticker: "ICICIBANK.NS", symbol: "ICICIBANK", name: "ICICI Bank", sector: "Banking", badge: "Universal Banking" },
  { ticker: "MARUTI.NS", symbol: "MARUTI", name: "Maruti Suzuki", sector: "Auto", badge: "Passenger Cars" },
  { ticker: "BHARTIARTL.NS", symbol: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom", badge: "5G & Telecom" },
  { ticker: "NVDA", symbol: "NVDA", name: "NVIDIA Corp", sector: "Semiconductors", badge: "AI Accelerators" },
];

export const AddStockModal: React.FC<AddStockModalProps> = ({
  isOpen,
  onClose,
  onApplyScenario,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>("TATAMOTORS.NS");
  const [stockProfile, setStockProfile] = useState<StockProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedHeadline, setSelectedHeadline] = useState<string | null>(null);

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

  // Load stock profile when selectedStock changes
  useEffect(() => {
    if (!isOpen || !selectedStock) return;
    let active = true;
    setIsLoadingProfile(true);
    setSelectedHeadline(null);

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

    return () => {
      active = false;
    };
  }, [selectedStock, isOpen]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#0B101B] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0F172A]/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
              📈
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">Asset & Stock Transmission Profiler</h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  NSE • BSE • Global
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Track any equity asset, ingest breaking news in real-time, and project radial multi-tier market shocks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Search & Sector Filters */}
        <div className="px-6 py-3.5 border-b border-slate-800/80 bg-[#0c1222] flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticker or company (e.g. TATAMOTORS, RELIANCE, HDFC)..."
              className="w-full pl-9 pr-4 py-2 bg-[#080D18] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sector Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition ${
                  selectedSector === sec
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body: Left column (Asset selector list), Right column (Live profile & news) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800/80">
          
          {/* Left Column: Equity Selection (4 cols) */}
          <div className="md:col-span-4 p-4 space-y-3 bg-[#090E1A]/40 overflow-y-auto max-h-[580px]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Verified Market Securities</span>
              <span className="text-slate-500">{searchQuery ? searchResults.length : filteredPopular.length} available</span>
            </div>

            <div className="space-y-1.5">
              {searchQuery ? (
                searchResults.map((item) => (
                  <button
                    key={item.ticker}
                    onClick={() => setSelectedStock(item.ticker)}
                    className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between ${
                      selectedStock === item.ticker
                        ? "bg-blue-500/10 border-blue-500/50 text-white"
                        : "bg-slate-900/40 border-slate-800/60 text-slate-300 hover:bg-slate-800/40 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{item.symbol}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">{item.exchange}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-[170px]">{item.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-blue-400 block">{item.sector}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.market_cap}</span>
                    </div>
                  </button>
                ))
              ) : (
                filteredPopular.map((item) => (
                  <button
                    key={item.ticker}
                    onClick={() => setSelectedStock(item.ticker)}
                    className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between ${
                      selectedStock === item.ticker
                        ? "bg-blue-500/10 border-blue-500/50 text-white"
                        : "bg-slate-900/40 border-slate-800/60 text-slate-300 hover:bg-slate-800/40 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{item.symbol}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">{item.sector}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 font-mono">
                        {item.badge}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Live Stock Profiler & News Cascade (8 cols) */}
          <div className="md:col-span-8 p-6 space-y-5 overflow-y-auto max-h-[580px] bg-[#0B101B]">
            {isLoadingProfile ? (
              <div className="h-64 flex flex-col items-center justify-center space-y-3 text-slate-400">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-mono">Ingesting market metrics & live news stream...</p>
              </div>
            ) : stockProfile ? (
              <>
                {/* Top Stock Snapshot Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#0F172A] to-[#131D33] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <h3 className="text-lg font-bold text-white tracking-tight">{stockProfile.name}</h3>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                        {stockProfile.symbol}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {stockProfile.exchange}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {stockProfile.sector} • {stockProfile.industry}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-xl font-bold font-mono text-white">
                        {stockProfile.currency === "INR" ? "₹" : "$"}{stockProfile.current_price.toLocaleString()}
                      </div>
                      <div className={`text-xs font-mono font-medium flex items-center justify-end gap-1 ${
                        stockProfile.change_pct >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        <span>{stockProfile.change_pct >= 0 ? "▲" : "▼"}</span>
                        <span>{stockProfile.change_pct >= 0 ? "+" : ""}{stockProfile.change_pct}% today</span>
                      </div>
                    </div>
                    <div className="border-l border-slate-800 pl-4 text-left">
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">Market Cap</span>
                      <span className="text-xs font-mono font-semibold text-slate-200">{stockProfile.market_cap}</span>
                    </div>
                  </div>
                </div>

                {/* Supply Chain Transmission Blueprint */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span>🔗</span> Institutional Supply Chain & Sector Channels
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{stockProfile.supply_chain.sector_index}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {/* Upstream */}
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] uppercase font-mono text-amber-400/90 font-bold block mb-1">
                        Upstream Inputs
                      </span>
                      <div className="space-y-1">
                        {stockProfile.supply_chain.upstream_inputs.map((inp, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] text-slate-300">
                            <span className="truncate pr-1">• {inp.title}</span>
                            <span className={`font-mono text-[10px] ${
                              inp.metricColor === "red" ? "text-rose-400" : inp.metricColor === "green" ? "text-emerald-400" : "text-blue-400"
                            }`}>{inp.metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Downstream */}
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] uppercase font-mono text-emerald-400/90 font-bold block mb-1">
                        Downstream Buyers
                      </span>
                      <div className="space-y-1">
                        {stockProfile.supply_chain.downstream_impacts.map((dn, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] text-slate-300">
                            <span className="truncate pr-1">• {dn.title}</span>
                            <span className={`font-mono text-[10px] ${
                              dn.metricColor === "red" ? "text-rose-400" : dn.metricColor === "green" ? "text-emerald-400" : "text-blue-400"
                            }`}>{dn.metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Competitors */}
                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] uppercase font-mono text-blue-400/90 font-bold block mb-1">
                        Key Competitors
                      </span>
                      <div className="space-y-1">
                        {stockProfile.supply_chain.competitors.map((cp, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] text-slate-300">
                            <span className="truncate pr-1">• {cp.title}</span>
                            <span className="font-mono text-[10px] text-emerald-400">{cp.metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real Breaking News Feed */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live Breaking Intelligence Feed ({stockProfile.news.length} items)
                    </span>
                    <span className="text-[10px] text-slate-500">Click a catalyst to propagate shock</span>
                  </div>

                  <div className="space-y-2">
                    {stockProfile.news.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          selectedHeadline === item.title
                            ? "bg-blue-600/10 border-blue-500/60 shadow-sm"
                            : "bg-[#090F1C] border-slate-800/80 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
                              item.sentiment === "Bearish" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                              item.sentiment === "Bullish" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                              "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}>
                              {item.sentiment}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">{item.source} • {item.date}</span>
                          </div>
                          <p className="text-xs font-medium text-slate-200 leading-snug">
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
                            className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/40 rounded-lg text-xs font-medium transition flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <span>⚡</span>
                            <span>Propagate Shock →</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <div className="text-xs text-slate-400">
                    Projects <span className="text-white font-semibold">{stockProfile.name}</span> across supply chain & sector channels.
                  </div>
                  <button
                    onClick={() => handleLaunchScenario()}
                    disabled={isGenerating}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Calculating Shock Pathways...</span>
                      </>
                    ) : (
                      <>
                        <span>Project Transmission Graph on Canvas</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
                Select an asset from the left to view profile and live news.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
