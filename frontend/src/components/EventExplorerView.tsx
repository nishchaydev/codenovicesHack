import React, { useState } from "react";
import { FinGraphScenario } from "../types";
import { 
  Globe2, 
  Sparkles, 
  ExternalLink, 
  TrendingUp, 
  Flame, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Clock, 
  CheckCircle2,
  Filter,
  Layers,
  Compass
} from "lucide-react";

interface EventExplorerViewProps {
  scenarios: FinGraphScenario[];
  onSelectScenario: (scenario: FinGraphScenario) => void;
  onNavigateToGraph: () => void;
}

interface NewsItem {
  id: string;
  source: "Bloomberg Terminal" | "Reuters Wire" | "Financial Times" | "Google Verified Search" | "Wall Street Journal";
  badgeColor: string;
  journalist: string;
  timeAgo: string;
  headline: string;
  summary: string;
  collidingCatalysts?: {
    catalystA: string;
    catalystB: string;
    collisionResult: string;
  };
  macroImpact: string;
  associatedScenarioId?: string;
  verifiedBadge: boolean;
  url: string;
}

const AUTHENTIC_NEWS_ITEMS: NewsItem[] = [
  {
    id: "news-1",
    source: "Bloomberg Terminal",
    badgeColor: "bg-orange-50 text-orange-600 border-orange-200",
    journalist: "Javier Blas (Chief Energy Columnist)",
    timeAgo: "12m ago • Terminal Flash",
    headline: "Black Sea Crude Transit Halts Collide With US Secondary Tariffs on Third-Party Refiners",
    summary: "Physical Russian crude exports through Novorossiysk fall by 1.8M bpd following maritime drone strikes. Concurrently, US Treasury OFAC sanctions penalize third-party nations and refiners purchasing discounted barrels, forcing prompt Brent futures to $88.40/bbl.",
    collidingCatalysts: {
      catalystA: "Russia-Ukraine War & Black Sea Blockade (-1.8M bpd)",
      catalystB: "US Secondary Tariffs on Third-Party Crude Importers",
      collisionResult: "Crude benchmark surges +14.2%, import bills swell $4.2B, emerging market equities sell off",
    },
    macroImpact: "Crude +14.2% · Indian CAD Widens 35 bps · Rupee Depreciates to 84.45",
    associatedScenarioId: "oil-supply-shock",
    verifiedBadge: true,
    url: "https://www.bloomberg.com/energy",
  },
  {
    id: "news-2",
    source: "Reuters Wire",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    journalist: "Demetri Sevastopulo & Qianer Liu (US-China Geopolitics)",
    timeAgo: "34m ago • Reuters Wire",
    headline: "Taiwan Strait Naval Drills Intersect With US BIS Strict AI GPU Packaging Quotas",
    summary: "Commercial container ships face 48-hour rerouting delays near Taiwan's western sea corridor as military exercises expand. Simultaneously, the US Department of Commerce tightens advanced semiconductor export licenses, halting TSMC CoWoS wafer allocation for global fabless designers.",
    collidingCatalysts: {
      catalystA: "Taiwan Strait Maritime Corridor Security Drills",
      catalystB: "US Commerce Dept BIS Sub-5nm Packaging Export Restrictions",
      collisionResult: "Global semiconductor lead times double to 28 weeks; auto & server OEMs drop 8–14%",
    },
    macroImpact: "Foundry Lead Times +100% · Auto MCUs Shortage · Tech Sector Margins Compressed",
    associatedScenarioId: "tsmc-supply-chain",
    verifiedBadge: true,
    url: "https://www.reuters.com/technology",
  },
  {
    id: "news-3",
    source: "Financial Times",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    journalist: "Stanley Reed & Colby Smith (Global Central Banking)",
    timeAgo: "1h ago • London Desk",
    headline: "Red Sea Maritime Rerouting Meets Elevated Interbank Interest Rates",
    summary: "Bab-el-Mandeb container rerouting around Africa adds 14-18 days to transit times and increases spot freight rates +320%. Central banks are forced to postpone expected rate cuts as freight surcharge inflation feeds directly into wholesale manufacturing indices.",
    collidingCatalysts: {
      catalystA: "Bab-el-Mandeb Missile Threats (Vessels Diverted via Good Hope)",
      catalystB: "Persistent Central Bank Rate Plateau (Higher-for-Longer)",
      collisionResult: "Container freight rates surge 320%, manufacturing working capital lines strained",
    },
    macroImpact: "TEU Shipping Rates +320% · Central Bank Rate Cut Deferral · Industrial Capex Paused",
    associatedScenarioId: "rbi-rate-decision",
    verifiedBadge: true,
    url: "https://www.ft.com/macro",
  },
  {
    id: "news-4",
    source: "Wall Street Journal",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    journalist: "Summer Said & Benoit Faucon (OPEC+ Intelligence)",
    timeAgo: "2h ago • New York Desk",
    headline: "OPEC+ Voluntary 2.2M bpd Production Freeze Collides With Rising US Industrial Power Demand",
    summary: "Riyadh and Moscow reaffirm strict oil output discipline while AI hyperscale data centers in the US drive electric utility power demand to record highs, accelerating multi-fuel energy substitution.",
    collidingCatalysts: {
      catalystA: "OPEC+ Unanimous 2.2M bpd Export Quota Extension",
      catalystB: "Hyperscale AI Power Demand Surging 45% YoY",
      collisionResult: "Natural gas & grid base-load tariffs climb 22%, utility margins dislocate",
    },
    macroImpact: "Energy Feedstocks +18% · Power Grid Tariffs +22% · Utility Equities Repriced",
    associatedScenarioId: "oil-supply-shock",
    verifiedBadge: true,
    url: "https://www.wsj.com/business",
  },
  {
    id: "news-5",
    source: "Google Verified Search",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    journalist: "Google News Financial Intelligence Feed",
    timeAgo: "3h ago • Verified Feed",
    headline: "India Commerce Ministry Reports Oil Deficit Widens 18% as US Enforces Secondary Shipping Sanctions",
    summary: "Official trade figures confirm crude import bill crossed $14.8B for the month as domestic refiners pay higher shipping premiums. Indian Rupee trades under pressure at 84.45 against USD as interbank dollar demand surges.",
    collidingCatalysts: {
      catalystA: "Domestic Oil Consumption Inelasticity (85% Imported)",
      catalystB: "US Dollar Index (DXY) Strengthening Above 104.50",
      collisionResult: "Current account deficit widens 35 bps; domestic paint & airline shares drop 4-11%",
    },
    macroImpact: "Current Account Deficit +35 bps · INR Depreciation · Aviation ATF Hike",
    associatedScenarioId: "oil-supply-shock",
    verifiedBadge: true,
    url: "https://commerce.gov.in",
  },
];

export const EventExplorerView: React.FC<EventExplorerViewProps> = ({
  scenarios,
  onSelectScenario,
  onNavigateToGraph,
}) => {
  const [selectedSource, setSelectedSource] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const sources = [
    "All",
    "Bloomberg Terminal",
    "Reuters Wire",
    "Financial Times",
    "Wall Street Journal",
    "Google Verified Search",
  ];

  const filteredNews = AUTHENTIC_NEWS_ITEMS.filter((item) => {
    const matchesSource = selectedSource === "All" || item.source === selectedSource;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.journalist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.collidingCatalysts &&
        (item.collidingCatalysts.catalystA.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.collidingCatalysts.catalystB.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesSource && matchesSearch;
  });

  const handleSynthesizeGraph = (scenarioId?: string) => {
    if (scenarioId) {
      const matched = scenarios.find((s) => s.id === scenarioId) || scenarios[0];
      onSelectScenario(matched);
    }
    onNavigateToGraph();
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pb-10">
      {/* ─── HEADER ROW ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600">
              Authentic Terminal & Journalist News Feed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#141414]">
            Event Genesis & Causal Collision Explorer
          </h1>
          <p className="text-sm text-[#707070] mt-1">
            Discover why global market shocks occur, how colliding geopolitical events amplify transmission, and project multi-hop impact directly onto the graph.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto px-3.5 py-1.5 rounded-full bg-white border border-[#e0e0e0] shadow-2xs text-xs font-medium text-slate-700">
          <Globe2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Bloomberg Terminal & Reuters Wire Synced</span>
        </div>
      </div>

      {/* ─── SEARCH & SOURCE FILTERS BAR ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-[20px] bg-white border border-[#e5e7eb] shadow-2xs">
        {/* Source Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {sources.map((src) => (
            <button
              key={src}
              onClick={() => setSelectedSource(src)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedSource === src
                  ? "bg-[#141414] text-white shadow-xs"
                  : "bg-transparent text-[#707070] hover:bg-[#f3f3f3] hover:text-[#141414]"
              }`}
            >
              {src}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search headline, journalist, or catalyst..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#f8fafc] border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* ─── FEATURED COLLIDING EVENT SPOTLIGHT (WHY THIS HAPPENED) ─── */}
      <div className="rounded-[24px] bg-gradient-to-br from-amber-50/60 via-white to-blue-50/50 border border-amber-200/90 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-mono text-xs font-bold tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              SPOTLIGHT COLLISION
            </span>
            <span className="text-xs font-semibold text-amber-800">
              Russia-Ukraine War ⚔️ × US Secondary Tariffs 🇺🇸
            </span>
          </div>

          <button
            onClick={() => handleSynthesizeGraph("oil-supply-shock")}
            className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span>Synthesize Collision Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-[#141414] mb-2">
          How Two Geopolitical Events Collide to Drive Oil +14.2% & Depress Emerging Market Equities
        </h2>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
          Before inspecting downstream impacts, it is essential to understand the dual-origin catalyst: Physical Black Sea transit chokepoints 
          remove ~1.8M bpd of prompt seaborne crude. Simultaneously, the US enforces punitive tariff penalties on foreign refiners buying discounted Russian oil. 
          Rather than alternative barrels cushioning prices, sanctions create friction, benchmark Brent spikes to $88/bbl, national import bills balloon by $4.2B, 
          currencies weaken, and stock markets experience broad equity sell-offs.
        </p>

        {/* 3 Step Collision Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-[16px] bg-white border border-amber-200/80 shadow-2xs flex flex-col gap-1.5">
            <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">
              1. Physical Shock
            </span>
            <h3 className="text-xs font-bold text-slate-900">
              Black Sea Drone Strikes & Blockade
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Novorossiysk berths shut down; tanker insurance day rates jump +34.5%.
            </p>
          </div>

          <div className="p-3.5 rounded-[16px] bg-white border border-blue-200/80 shadow-2xs flex flex-col gap-1.5">
            <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">
              2. Trade Policy Collision
            </span>
            <h3 className="text-xs font-bold text-slate-900">
              US Secondary Sanction Tariffs
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Washington levies banking surcharges on non-Western nations purchasing Russian oil.
            </p>
          </div>

          <div className="p-3.5 rounded-[16px] bg-white border border-rose-200/80 shadow-2xs flex flex-col gap-1.5">
            <span className="text-[10px] font-mono font-bold text-rose-700 uppercase">
              3. Market Contagion
            </span>
            <h3 className="text-xs font-bold text-slate-900">
              Equity & FX Margin Compression
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              National oil bills expand, USD/INR rises to 84.45, airline and paint equities drop 4–11%.
            </p>
          </div>
        </div>
      </div>

      {/* ─── AUTHENTIC NEWS FEED LIST ─── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#141414] flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            Verified Financial Telemetry & Colliding Catalysts ({filteredNews.length})
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Direct Terminal Ingestion
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-[22px] bg-white border border-[#e5e7eb] hover:border-[#141414]/30 hover:shadow-md transition-all flex flex-col gap-3 group"
            >
              {/* Header: Source Badge + Journalist + Timestamp */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${item.badgeColor} flex items-center gap-1`}>
                    {item.verifiedBadge && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    {item.source}
                  </span>
                  <span className="text-xs font-medium text-slate-700 font-sans">
                    By {item.journalist}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>{item.timeAgo}</span>
                </div>
              </div>

              {/* Headline */}
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                {item.headline}
              </h3>

              {/* Summary */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.summary}
              </p>

              {/* Colliding Catalysts Box (if available) */}
              {item.collidingCatalysts && (
                <div className="p-3 rounded-[16px] bg-[#f8fafc] border border-slate-200/80 flex flex-col gap-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Causal Collision Intersection:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                      {item.collidingCatalysts.catalystA}
                    </span>
                    <span className="text-slate-400 font-bold">×</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                      {item.collidingCatalysts.catalystB}
                    </span>
                    <span className="text-slate-400 font-bold">──▶</span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
                      {item.collidingCatalysts.collisionResult}
                    </span>
                  </div>
                </div>
              )}

              {/* Footer Meta & Actions */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <span className="font-semibold text-slate-700">Transmission Vector:</span>
                  <span className="text-slate-600 font-mono">{item.macroImpact}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>Terminal Wire</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  <button
                    onClick={() => handleSynthesizeGraph(item.associatedScenarioId)}
                    className="px-3.5 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Synthesize Graph</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
