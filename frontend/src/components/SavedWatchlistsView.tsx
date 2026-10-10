import React, { useState } from "react";
import { 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  Plus, 
  Clock, 
  Network, 
  GitFork, 
  Search, 
  RotateCcw,
  Sparkles,
  TrendingUp,
  AlertCircle,
  X
} from "lucide-react";

export interface SavedScenarioItem {
  id: string;
  title: string;
  savedDate: string;
  entitiesCount: number;
  pathwaysCount: number;
  tag: "Commodity" | "Technology" | "Monetary Policy" | "Equity" | "Global Macro" | "Agriculture";
  summary: string;
  keyTickers: string[];
  impactLevel: "High" | "Medium" | "Critical";
  primaryDriver: string;
}

const DEFAULT_SAVED_SCENARIOS: SavedScenarioItem[] = [
  {
    id: "oil-supply-shock",
    title: "Oil Supply Shock",
    savedDate: "Saved 2 days ago",
    entitiesCount: 12,
    pathwaysCount: 7,
    tag: "Commodity",
    summary: "Brent crude +12% rally triggers input cost inflation across petrochemicals, aviation fuel, and paint margins.",
    keyTickers: ["ASIANPAINT.NS", "INDIGO.NS", "RELIANCE.NS", "BPCL.NS"],
    impactLevel: "Critical",
    primaryDriver: "OPEC+ Supply Quota Reductions",
  },
  {
    id: "tsmc-supply-chain",
    title: "TSMC Supply Chain",
    savedDate: "Saved 1 week ago",
    entitiesCount: 9,
    pathwaysCount: 5,
    tag: "Technology",
    summary: "Taiwan sub-3nm wafer fabrication outage delays enterprise AI accelerators and consumer semiconductor inventory.",
    keyTickers: ["TSM", "NVDA", "AAPL", "TCS.NS"],
    impactLevel: "Critical",
    primaryDriver: "Hsinchu Fab 18 Disruption",
  },
  {
    id: "rbi-rate-decision",
    title: "RBI Rate Decision",
    savedDate: "Saved 3 days ago",
    entitiesCount: 11,
    pathwaysCount: 6,
    tag: "Monetary Policy",
    summary: "25 bps repo rate calibration shifts interbank liquidity, retail EBLR mortgages, and NBFC borrowing spreads.",
    keyTickers: ["HDFCBANK.NS", "BAJFINANCE.NS", "ICICIBANK.NS", "SBIN.NS"],
    impactLevel: "High",
    primaryDriver: "MPC Benchmark Rate Easing",
  },
  {
    id: "tata-motors-earnings",
    title: "Tata Motors Earnings",
    savedDate: "Saved today",
    entitiesCount: 8,
    pathwaysCount: 4,
    tag: "Equity",
    summary: "Q2 consolidated EBITDA expansion with JLR commercial volume surge and EV division margin improvements.",
    keyTickers: ["TATAMOTORS.NS", "BHARATFORG.NS", "MRF.NS", "MOTHERSON.NS"],
    impactLevel: "Medium",
    primaryDriver: "Q2 Operational Cash Flow Surprise",
  },
  {
    id: "us-fed-pivot",
    title: "US Fed Pivot",
    savedDate: "Saved 5 days ago",
    entitiesCount: 15,
    pathwaysCount: 9,
    tag: "Global Macro",
    summary: "FOMC 50 bps pivot weakens the US Dollar Index (DXY), sparking emerging market inflows and rupee stabilization.",
    keyTickers: ["USDINR", "NIFTY50", "INFY.NS", "WIPRO.NS"],
    impactLevel: "Critical",
    primaryDriver: "Fed Funds Benchmark Cut",
  },
  {
    id: "wheat-export-ban",
    title: "Wheat Export Ban",
    savedDate: "Saved 1 week ago",
    entitiesCount: 10,
    pathwaysCount: 6,
    tag: "Agriculture",
    summary: "Government export embargo curbs domestic food CPI while pressuring packaged food margins and agrochemical demand.",
    keyTickers: ["BRITANNIA.NS", "ITC.NS", "UPL.NS", "NESTLEIND.NS"],
    impactLevel: "High",
    primaryDriver: "Domestic Grain Security Mandate",
  },
];

export interface SavedWatchlistsViewProps {
  onLoadScenario?: (id: string) => void;
}

export const SavedWatchlistsView: React.FC<SavedWatchlistsViewProps> = ({ onLoadScenario }) => {
  const [scenarios, setScenarios] = useState<SavedScenarioItem[]>(DEFAULT_SAVED_SCENARIOS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [recentlyDeleted, setRecentlyDeleted] = useState<SavedScenarioItem | null>(null);
  const [loadingScenarioId, setLoadingScenarioId] = useState<string | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newScenarioTitle, setNewScenarioTitle] = useState("");
  const [newScenarioTag, setNewScenarioTag] = useState<SavedScenarioItem["tag"]>("Global Macro");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const itemToDelete = scenarios.find((s) => s.id === id);
    if (itemToDelete) {
      setScenarios((prev) => prev.filter((s) => s.id !== id));
      setRecentlyDeleted(itemToDelete);
      showToast(`Removed "${itemToDelete.title}" from saved watchlists`);
    }
  };

  const handleUndoDelete = () => {
    if (recentlyDeleted) {
      setScenarios((prev) => [recentlyDeleted, ...prev]);
      showToast(`Restored "${recentlyDeleted.title}"`);
      setRecentlyDeleted(null);
    }
  };

  const handleLoadScenario = (id: string) => {
    setLoadingScenarioId(id);
    const item = scenarios.find((s) => s.id === id);
    if (item) {
      showToast(`Loading scenario: ${item.title}...`);
    }
    setTimeout(() => {
      setLoadingScenarioId(null);
      if (onLoadScenario) {
        onLoadScenario(id);
      }
    }, 400);
  };

  const handleSaveCurrentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScenarioTitle.trim()) return;

    const newScenario: SavedScenarioItem = {
      id: `saved-${Date.now()}`,
      title: newScenarioTitle.trim(),
      savedDate: "Saved just now",
      entitiesCount: 14,
      pathwaysCount: 8,
      tag: newScenarioTag,
      summary: "Custom multi-hop contagion snapshot captured from active Fin.D transmission canvas.",
      keyTickers: ["NIFTY50", "RELIANCE.NS", "HDFCBANK.NS"],
      impactLevel: "High",
      primaryDriver: "Real-time user graph snapshot",
    };

    setScenarios((prev) => [newScenario, ...prev]);
    setNewScenarioTitle("");
    setIsSaveModalOpen(false);
    showToast(`Successfully saved "${newScenario.title}"`);
  };

  const handleRestoreDefaults = () => {
    setScenarios(DEFAULT_SAVED_SCENARIOS);
    setRecentlyDeleted(null);
    showToast("Restored all 6 default scenarios");
  };

  // Filter scenarios
  const filteredScenarios = scenarios.filter((sc) => {
    const matchesTag = selectedTag === "All" || sc.tag === selectedTag;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = 
      !query ||
      sc.title.toLowerCase().includes(query) ||
      sc.tag.toLowerCase().includes(query) ||
      sc.summary.toLowerCase().includes(query) ||
      sc.keyTickers.some((ticker) => ticker.toLowerCase().includes(query));
    return matchesTag && matchesQuery;
  });

  const getTagStyle = (tag: SavedScenarioItem["tag"]) => {
    switch (tag) {
      case "Commodity":
        return "bg-amber-50 text-amber-800 border-amber-200/90";
      case "Technology":
        return "bg-blue-50 text-blue-800 border-blue-200/90";
      case "Monetary Policy":
        return "bg-purple-50 text-purple-800 border-purple-200/90";
      case "Equity":
        return "bg-emerald-50 text-emerald-800 border-emerald-200/90";
      case "Global Macro":
        return "bg-sky-50 text-sky-800 border-sky-200/90";
      case "Agriculture":
        return "bg-lime-50 text-lime-800 border-lime-200/90";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getImpactBadge = (level: SavedScenarioItem["impactLevel"]) => {
    switch (level) {
      case "Critical":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "High":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Medium":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const categories = [
    "All",
    "Commodity",
    "Technology",
    "Monetary Policy",
    "Equity",
    "Global Macro",
    "Agriculture",
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto py-2 px-1 text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm border border-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>{toastMessage}</span>
          {recentlyDeleted && (
            <button
              onClick={handleUndoDelete}
              className="ml-2 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Undo
            </button>
          )}
        </div>
      )}

      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-md flex items-center gap-1.5">
              <Bookmark className="w-3 h-3 text-blue-600" />
              Fin.D Scenario Vault
            </span>
            <span className="text-xs text-slate-400">• Institutional Causal Repository</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Your Saved Scenarios ({scenarios.length})
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Multi-hop transmission models, input-shock pathways, and cross-asset contagion graphs saved for immediate stress testing.
          </p>
        </div>

        {/* Action Button: + Save Current */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsSaveModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Save Current</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Scenarios</span>
            <Bookmark className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">{scenarios.length}</span>
            <span className="text-[11px] text-emerald-600 font-medium">Ready to load</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tracked Entities</span>
            <Network className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">
              {scenarios.reduce((acc, curr) => acc + curr.entitiesCount, 0)}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Across markets</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Causal Pathways</span>
            <GitFork className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">
              {scenarios.reduce((acc, curr) => acc + curr.pathwaysCount, 0)}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Multi-hop links</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Avg. Confidence</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">92.4%</span>
            <span className="text-[11px] text-emerald-600 font-medium">Calibrated</span>
          </div>
        </div>
      </div>

      {/* 3. Search and Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? scenarios.length
                : scenarios.filter((s) => s.tag === cat).length;
            const isSelected = selectedTag === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedTag(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? "bg-slate-800 text-slate-200"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px] md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved scenarios..."
            className="w-full h-9 pl-9 pr-8 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. Grid of 6 Scenario Cards */}
      {filteredScenarios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScenarios.map((card) => {
            const isLoading = loadingScenarioId === card.id;

            return (
              <div
                key={card.id}
                className="group relative bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                {/* Card Top: Category Pill + Delete Button */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTagStyle(
                        card.tag
                      )}`}
                    >
                      {card.tag}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getImpactBadge(
                          card.impactLevel
                        )}`}
                      >
                        {card.impactLevel} Risk
                      </span>

                      {/* Small Delete Icon Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDelete(card.id, e)}
                        title="Delete scenario"
                        aria-label={`Delete scenario ${card.title}`}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Save Date */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                    <span>{card.title}</span>
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{card.savedDate}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] font-mono text-slate-400 truncate max-w-[150px]">
                      {card.primaryDriver}
                    </span>
                  </div>

                  {/* Summary Narrative */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {card.summary}
                  </p>

                  {/* Entities & Pathways Metrics */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center">
                        <Network className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">
                          {card.entitiesCount}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Entities
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-100/70 text-indigo-700 flex items-center justify-center">
                        <GitFork className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">
                          {card.pathwaysCount}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          Pathways
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Key Monitored Tickers */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {card.keyTickers.map((ticker) => (
                      <span
                        key={ticker}
                        className="text-[10.5px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-medium"
                      >
                        {ticker}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Bottom: Load Scenario Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {card.entitiesCount} entities, {card.pathwaysCount} pathways
                  </span>

                  <button
                    type="button"
                    onClick={() => handleLoadScenario(card.id)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span>Load Scenario</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Filter State */
        <div className="p-12 text-center flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">
            No matching saved scenarios found
          </h4>
          <p className="text-xs text-slate-500 max-w-sm">
            Try adjusting your search criteria or reset filters to display your saved scenario models.
          </p>
          <div className="flex items-center gap-2 mt-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={handleRestoreDefaults}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restore All Defaults</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Save Current Scenario Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Save Current Scenario</h3>
                  <p className="text-[11px] text-slate-500">Capture the active transmission graph state</p>
                </div>
              </div>
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCurrentSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scenario Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Copper Smelter Outage or Semiconductor Export Rule"
                  value={newScenarioTitle}
                  onChange={(e) => setNewScenarioTitle(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Tag
                </label>
                <select
                  value={newScenarioTag}
                  onChange={(e) => setNewScenarioTag(e.target.value as SavedScenarioItem["tag"])}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                >
                  <option value="Commodity">Commodity</option>
                  <option value="Technology">Technology</option>
                  <option value="Monetary Policy">Monetary Policy</option>
                  <option value="Equity">Equity</option>
                  <option value="Global Macro">Global Macro</option>
                  <option value="Agriculture">Agriculture</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Snapshot payload:</span>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500">
                  <span>• 14 Active Entities</span>
                  <span>• 8 Causal Pathways</span>
                  <span>• Live Confidence: 94%</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
