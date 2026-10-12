import React, { useState, useMemo } from "react";
import { 
  Bell, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  ArrowUpDown, 
  Info, 
  CornerDownLeft, 
  Check, 
  Sparkles, 
  X, 
  ShoppingBag,
  ExternalLink,
  ChevronDown
} from "lucide-react";

interface PricePoint {
  date: string;
  price: number;
}

interface AssetProfile {
  id: string;
  name: string;
  ticker: string;
  category: string;
  highestPrice: number;
  averagePrice: number;
  lowestPrice: number;
  currentPrice: number;
  dealScore: number;
  recommendation: string;
  dealVerdict: string;
  dealBadge: string;
  dealPoints: { label: string; points: number; full: boolean }[];
  priceHistory: PricePoint[];
}

const PRESET_ASSETS: AssetProfile[] = [
  {
    id: "specimen",
    name: "Alpha Specimen Index (Direct Reference)",
    ticker: "SPECIMEN-01",
    category: "Algorithmic Deal Matrix",
    highestPrice: 1099,
    averagePrice: 529.89,
    lowestPrice: 449,
    currentPrice: 449,
    dealScore: 92,
    recommendation: "Go Ahead & Buy now",
    dealVerdict: "Optimal price point",
    dealBadge: "Epic Hatke Steal 🚀",
    dealPoints: [
      { label: "No Price hike before sale", points: 36, full: true },
      { label: "At All time low price (₹449)", points: 29, full: true },
      { label: "At 6 months low productPrice (₹449)", points: 21, full: true },
      { label: "Below average price (₹524)", points: 6, full: false },
    ],
    priceHistory: [
      { date: "16 Mar", price: 1099 },
      { date: "20 Mar", price: 580 },
      { date: "30 Mar", price: 529 },
      { date: "13 Apr", price: 480 },
      { date: "27 Apr", price: 540 },
      { date: "11 May", price: 529 },
      { date: "25 May", price: 490 },
      { date: "8 Jun", price: 535 },
      { date: "22 Jun", price: 540 },
      { date: "6 Jul", price: 490 },
      { date: "20 Jul", price: 530 },
      { date: "3 Aug", price: 530 },
      { date: "17 Aug", price: 540 },
      { date: "31 Aug", price: 530 },
      { date: "14 Sep", price: 535 },
      { date: "28 Sep", price: 449 },
      { date: "12 Oct", price: 449 },
    ],
  },
  {
    id: "asianpaint",
    name: "Asian Paints Ltd (Decorative Solvents)",
    ticker: "ASIANPAINT.NS",
    category: "Paints & Chemicals",
    highestPrice: 3120,
    averagePrice: 2640.50,
    lowestPrice: 2310,
    currentPrice: 2345,
    dealScore: 88,
    recommendation: "Favorable Entry Zone",
    dealVerdict: "Petrochemical Lag Priced In",
    dealBadge: "High Margin Rebound Steal 🚀",
    dealPoints: [
      { label: "Raw material cost peak passed", points: 34, full: true },
      { label: "Near 52-week support (₹2,310)", points: 28, full: true },
      { label: "Seasonal festive demand tailwind", points: 20, full: true },
      { label: "Below 200-day EMA (₹2,640)", points: 6, full: false },
    ],
    priceHistory: [
      { date: "16 Mar", price: 3120 },
      { date: "20 Mar", price: 2950 },
      { date: "30 Mar", price: 2840 },
      { date: "13 Apr", price: 2710 },
      { date: "27 Apr", price: 2790 },
      { date: "11 May", price: 2650 },
      { date: "25 May", price: 2620 },
      { date: "8 Jun", price: 2680 },
      { date: "22 Jun", price: 2710 },
      { date: "6 Jul", price: 2590 },
      { date: "20 Jul", price: 2640 },
      { date: "3 Aug", price: 2610 },
      { date: "17 Aug", price: 2580 },
      { date: "31 Aug", price: 2520 },
      { date: "14 Sep", price: 2460 },
      { date: "28 Sep", price: 2345 },
      { date: "12 Oct", price: 2345 },
    ],
  },
  {
    id: "tatamotors",
    name: "Tata Motors Ltd (CV Fleet Cycle)",
    ticker: "TATAMOTORS.NS",
    category: "Automotive & CV",
    highestPrice: 1140,
    averagePrice: 945.20,
    lowestPrice: 875,
    currentPrice: 924,
    dealScore: 84,
    recommendation: "Accumulate on Dips",
    dealVerdict: "Healthy Freight Orderbook",
    dealBadge: "Deep Cyclical Value 🚀",
    dealPoints: [
      { label: "Stable fleet order backlog", points: 32, full: true },
      { label: "Within 5% of strong quarterly support", points: 26, full: true },
      { label: "JLR operating margin expansion", points: 19, full: true },
      { label: "Discounted forward P/E ratio", points: 7, full: true },
    ],
    priceHistory: [
      { date: "16 Mar", price: 1140 },
      { date: "20 Mar", price: 1080 },
      { date: "30 Mar", price: 1020 },
      { date: "13 Apr", price: 980 },
      { date: "27 Apr", price: 990 },
      { date: "11 May", price: 950 },
      { date: "25 May", price: 940 },
      { date: "8 Jun", price: 960 },
      { date: "22 Jun", price: 970 },
      { date: "6 Jul", price: 930 },
      { date: "20 Jul", price: 945 },
      { date: "3 Aug", price: 950 },
      { date: "17 Aug", price: 935 },
      { date: "31 Aug", price: 920 },
      { date: "14 Sep", price: 915 },
      { date: "28 Sep", price: 924 },
      { date: "12 Oct", price: 924 },
    ],
  },
];

export const ThinkBeforeBuyCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"scanner" | "drop">("scanner");
  const [timeRange, setTimeRange] = useState<"1M" | "3M" | "Max">("Max");
  const [horizon, setHorizon] = useState<"2-3 Days" | "1 Week" | "1 Month">("2-3 Days");
  const [selectedAssetId, setSelectedAssetId] = useState<string>("specimen");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  
  // Alert modal state
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState<string>("449");
  const [alertSuccessMsg, setAlertSuccessMsg] = useState<string | null>(null);

  const activeAsset = useMemo(() => {
    return PRESET_ASSETS.find((a) => a.id === selectedAssetId) || PRESET_ASSETS[0];
  }, [selectedAssetId]);

  // Compute SVG coordinate points for the exact Price History chart
  const chartWidth = 840;
  const chartHeight = 250;
  const paddingLeft = 65;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 45;

  const dataPoints = useMemo(() => {
    const raw = activeAsset.priceHistory;
    if (timeRange === "1M") return raw.slice(-6);
    if (timeRange === "3M") return raw.slice(-11);
    return raw;
  }, [activeAsset, timeRange]);

  const maxPriceScale = activeAsset.highestPrice > 2000 ? 3500 : 1500;
  const minPriceScale = 0;

  const getX = (idx: number) => {
    const availableWidth = chartWidth - paddingLeft - paddingRight;
    return paddingLeft + (idx / (dataPoints.length - 1)) * availableWidth;
  };

  const getY = (price: number) => {
    const availableHeight = chartHeight - paddingTop - paddingBottom;
    const ratio = (price - minPriceScale) / (maxPriceScale - minPriceScale);
    return chartHeight - paddingBottom - ratio * availableHeight;
  };

  // Generate SVG path strings
  const { linePath, areaPath } = useMemo(() => {
    if (dataPoints.length === 0) return { linePath: "", areaPath: "" };

    const points = dataPoints.map((pt, idx) => ({
      x: getX(idx),
      y: getY(pt.price),
    }));

    // Build smooth/stepped line matching the image style
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Gentle curve to next point
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      d += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const baselineY = chartHeight - paddingBottom;
    const area = `${d} L ${points[points.length - 1].x} ${baselineY} L ${points[0].x} ${baselineY} Z`;

    return { linePath: d, areaPath: area };
  }, [dataPoints, chartWidth, chartHeight]);

  const handleSaveAlert = () => {
    setAlertSuccessMsg(`Price Drop Alert active for ₹${alertTargetPrice}! You will be alerted immediately.`);
    setTimeout(() => {
      setAlertSuccessMsg(null);
      setShowAlertModal(false);
    }, 2800);
  };

  // Gauge angle calculation (0 to 100 mapped across 180 degree semi-circle)
  // 0% -> 180 deg (pointing left), 100% -> 0 deg (pointing right)
  const getNeedleRotation = (score: number) => {
    const clamped = Math.max(0, Math.min(100, score));
    return -180 + (clamped / 100) * 180;
  };

  return (
    <div className="rounded-[24px] bg-white border border-[#e5e7eb] shadow-sm p-5 sm:p-7 flex flex-col gap-6">
      {/* ─── CARD HEADER & ASSET SELECTOR ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shadow-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                Card 3 • Valuation & Timing Engine
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Live Algorithmic Scoring
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              ThinkBeforeBuy
            </h2>
            <p className="text-xs text-slate-500">
              Autonomous historical price drop monitoring, deal verification, and capital entry recommendation.
            </p>
          </div>
        </div>

        {/* Specimen / Stock Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 hidden sm:inline">
            Active Asset:
          </label>
          <div className="relative">
            <select
              value={selectedAssetId}
              onChange={(e) => {
                setSelectedAssetId(e.target.value);
                setAlertTargetPrice(
                  PRESET_ASSETS.find((a) => a.id === e.target.value)?.lowestPrice.toString() || "449"
                );
              }}
              className="appearance-none pl-3.5 pr-8 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
            >
              {PRESET_ASSETS.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ─── 1. PRICE HISTORY CHART (EXACT MATCH FROM IMAGE 1) ─── */}
      <div className="rounded-[20px] bg-white border border-slate-200/90 shadow-2xs p-4 sm:p-6 flex flex-col gap-4">
        {/* Header with Title and 1 Month / 3 Month / Max Selector */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Price History
          </h3>

          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
            {(["1 Month", "3 Month", "Max"] as const).map((r) => {
              const code = r === "1 Month" ? "1M" : r === "3 Month" ? "3M" : "Max";
              const isActive = timeRange === code;
              return (
                <button
                  key={r}
                  onClick={() => setTimeRange(code)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* SVG Interactive Area Chart Container */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[640px] relative">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto select-none overflow-visible"
              onMouseLeave={() => setHoverIndex(null)}
            >
              <defs>
                {/* Yellow-Amber to Mint-Green Gradient Fill Under Curve (Exact Image 1 Match) */}
                <linearGradient id="priceDropGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
                  <stop offset="60%" stopColor="#d1fae5" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#ecfdf5" stopOpacity="0.02" />
                </linearGradient>

                <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ef4444" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Horizontal Gridlines & Y-Axis Labels */}
              {([
                { val: maxPriceScale, label: maxPriceScale > 2000 ? "₹3.5K" : "₹1.5K" },
                { val: maxPriceScale > 2000 ? 2500 : 1000, label: maxPriceScale > 2000 ? "₹2.5K" : "₹1000" },
                { val: maxPriceScale > 2000 ? 1500 : 500, label: maxPriceScale > 2000 ? "₹1.5K" : "₹500" },
                { val: minPriceScale, label: "0" },
              ]).map((tick, i) => {
                const yPos = getY(tick.val);
                return (
                  <g key={i}>
                    <line
                      x1={paddingLeft}
                      y1={yPos}
                      x2={chartWidth - paddingRight}
                      y2={yPos}
                      stroke="#f1f5f9"
                      strokeWidth="1.2"
                      strokeDasharray={tick.val === 0 ? undefined : "3,3"}
                    />
                    <text
                      x={paddingLeft - 12}
                      y={yPos + 4}
                      textAnchor="end"
                      fontSize="11.5"
                      fontWeight="600"
                      fill="#94a3b8"
                      className="font-mono"
                    >
                      {tick.label}
                    </text>
                  </g>
                );
              })}

              {/* Gradient Area Fill */}
              {areaPath && (
                <path d={areaPath} fill="url(#priceDropGradient)" />
              )}

              {/* Stepped / Smooth Red Price Line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#chartGlow)"
                />
              )}

              {/* X-Axis Date Labels & Hover Target Circles */}
              {dataPoints.map((pt, idx) => {
                const cx = getX(idx);
                const cy = getY(pt.price);
                const isHovered = hoverIndex === idx;

                return (
                  <g key={idx}>
                    {/* Date label at bottom */}
                    <text
                      x={cx}
                      y={chartHeight - paddingBottom + 22}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight="600"
                      fill={isHovered ? "#0f172a" : "#64748b"}
                      className="font-sans"
                    >
                      {pt.date}
                    </text>

                    {/* Interactive hover circle & target hit-area */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="16"
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoverIndex(idx)}
                    />

                    {isHovered && (
                      <g>
                        {/* Vertical dotted guide line */}
                        <line
                          x1={cx}
                          y1={paddingTop}
                          x2={cx}
                          y2={chartHeight - paddingBottom}
                          stroke="#cbd5e1"
                          strokeWidth="1.5"
                          strokeDasharray="3,3"
                        />
                        {/* Point dot */}
                        <circle cx={cx} cy={cy} r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Floating Tooltip Pill */}
            {hoverIndex !== null && dataPoints[hoverIndex] && (
              <div
                className="absolute z-30 pointer-events-none -translate-x-1/2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in duration-100"
                style={{
                  left: `${(getX(hoverIndex) / chartWidth) * 100}%`,
                  top: `${Math.max(10, getY(dataPoints[hoverIndex].price) - 38)}px`,
                }}
              >
                <span className="font-mono text-slate-300">{dataPoints[hoverIndex].date}:</span>
                <span className="font-bold font-mono text-emerald-400">
                  ₹{dataPoints[hoverIndex].price.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── 2. DEAL SCANNER & PRICE DROP MATRIX (EXACT MATCH FROM IMAGES 2 & 3) ─── */}
      <div className="rounded-[20px] bg-white border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
        {/* Tab Header Switcher: Deal Scanner | Price Drop */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveTab("scanner")}
            className={`py-3.5 px-4 text-center font-bold text-sm sm:text-base transition-colors relative cursor-pointer ${
              activeTab === "scanner"
                ? "text-indigo-600 bg-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Deal Scanner
            {activeTab === "scanner" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("drop")}
            className={`py-3.5 px-4 text-center font-bold text-sm sm:text-base transition-colors relative cursor-pointer ${
              activeTab === "drop"
                ? "text-indigo-600 bg-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Price Drop
            {activeTab === "drop" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600" />
            )}
          </button>
        </div>

        {/* Tab 1 Content: DEAL SCANNER (Exact Match from Image 3) */}
        {activeTab === "scanner" && (
          <div className="p-5 sm:p-7 flex flex-col gap-6 animate-in fade-in duration-150">
            {/* Top Row: Steal Badge + Deal Score Speedometer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Green Thumbs Up Steal Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-emerald-500/80 bg-emerald-50/60 text-emerald-700 font-extrabold text-sm sm:text-base shadow-xs">
                <span className="text-lg">👍</span>
                <span>{activeAsset.dealBadge}</span>
              </div>

              {/* Deal Score Speedometer Gauge */}
              <div className="flex items-center gap-3">
                <div className="relative w-36 h-20 flex items-center justify-center">
                  <svg viewBox="0 0 160 90" className="w-36 h-20 overflow-visible">
                    <defs>
                      <linearGradient id="dealScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="35%" stopColor="#f59e0b" />
                        <stop offset="70%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>
                    {/* Background Track */}
                    <path
                      d="M 15 80 A 65 65 0 0 1 145 80"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Gradient Arc */}
                    <path
                      d="M 15 80 A 65 65 0 0 1 145 80"
                      fill="none"
                      stroke="url(#dealScoreGrad)"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Needle Indicator for Deal Score */}
                    <g transform={`translate(80, 80) rotate(${getNeedleRotation(activeAsset.dealScore)})`}>
                      <line x1="0" y1="0" x2="55" y2="0" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="0" cy="0" r="5.5" fill="#1e293b" />
                      <circle cx="0" cy="0" r="2" fill="#ffffff" />
                    </g>
                    {/* Score Labels */}
                    <text x="12" y="90" fontSize="9" fontWeight="700" fill="#dc2626">0</text>
                    <text x="148" y="90" fontSize="9" fontWeight="700" fill="#16a34a" textAnchor="end">100</text>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-semibold">Deal Score</span>
                  <span className="text-2xl font-black text-slate-900">{activeAsset.dealScore}</span>
                </div>
              </div>
            </div>

            {/* Highlight Banner: Lowest Price Ever (Light Green Box) */}
            <div className="p-4 rounded-2xl bg-[#eaf8ee] border border-emerald-200/80 flex items-start gap-3 shadow-2xs">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 mt-0.5">
                <CornerDownLeft className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-base font-bold text-slate-900 leading-tight">
                  Lowest Price Ever
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Best price we've ever recorded for this product
                </p>
              </div>
            </div>

            {/* Deal Score Breakup Table */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-xs font-bold text-slate-900">
                <span>Deal Score Breakup</span>
                <span className="text-slate-500">Pts</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {activeAsset.dealPoints.map((pt, i) => (
                  <div key={i} className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-700 font-medium">{pt.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center">
                        {pt.full ? (
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 bg-emerald-100" />
                        )}
                      </span>
                      <span className="font-mono font-bold text-slate-900 min-w-[20px] text-right">
                        {pt.points}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-slate-500 italic mt-2">
                **We analyse past prices and patterns to tell you if it's truly a smart deal.
              </p>
            </div>

            {/* Footer Action: Set Price Drop Alert */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-center">
              <button
                onClick={() => setShowAlertModal(true)}
                className="py-2 px-4 rounded-xl text-slate-900 hover:text-indigo-600 font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4 text-indigo-600" />
                <span>Set price drop alert to buy later</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2 Content: PRICE DROP (Exact Match from Image 2) */}
        {activeTab === "drop" && (
          <div className="p-5 sm:p-7 flex flex-col gap-6 animate-in fade-in duration-150">
            {/* Header: Should you buy now? */}
            <div className="flex flex-col gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Should you buy now?
              </h3>

              {/* Horizon Selector Pills: 2-3 Days | 1 Week | 1 Month + (i) */}
              <div className="flex items-center gap-2 flex-wrap">
                {(["2-3 Days", "1 Week", "1 Month"] as const).map((h) => {
                  const isActive = horizon === h;
                  return (
                    <button
                      key={h}
                      onClick={() => setHorizon(h)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "border border-indigo-400 bg-indigo-50/70 text-indigo-700 shadow-2xs"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
                <span title="Algorithm calculates price mean reversion based on past supply chain spikes" className="text-slate-400 hover:text-slate-600 cursor-help">
                  <Info className="w-3.5 h-3.5" />
                </span>
              </div>
              <span className="text-[11px] text-slate-500">Select based on your need</span>
            </div>

            {/* Speedometer Gauge & Verdict Box */}
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs grid grid-cols-1 sm:grid-cols-[180px_1fr] items-center gap-6">
              {/* Speedometer */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-40 h-22 flex items-center justify-center">
                  <svg viewBox="0 0 160 90" className="w-40 h-22 overflow-visible">
                    <defs>
                      <linearGradient id="speedoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="35%" stopColor="#f59e0b" />
                        <stop offset="70%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 15 80 A 65 65 0 0 1 145 80"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 15 80 A 65 65 0 0 1 145 80"
                      fill="none"
                      stroke="url(#speedoGrad)"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Needle pointing into green Good Time zone */}
                    <g transform={`translate(80, 80) rotate(${getNeedleRotation(activeAsset.dealScore)})`}>
                      <line x1="0" y1="0" x2="55" y2="0" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="0" cy="0" r="5.5" fill="#1e293b" />
                      <circle cx="0" cy="0" r="2" fill="#ffffff" />
                    </g>
                    <text x="12" y="90" fontSize="9" fontWeight="700" fill="#dc2626">0</text>
                    <text x="148" y="90" fontSize="9" fontWeight="700" fill="#16a34a" textAnchor="end">100</text>
                  </svg>
                </div>
                {/* Bad Time / Good Time Legend */}
                <div className="flex items-center gap-3 text-[10.5px] font-bold text-slate-600 mt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-xs bg-red-500" />
                    <span>Bad Time</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-xs bg-emerald-500" />
                    <span>Good Time</span>
                  </span>
                </div>
              </div>

              {/* Recommendation Callout */}
              <div className="flex flex-col gap-1 sm:pl-4 sm:border-l sm:border-slate-100">
                <span className="text-xs font-semibold text-slate-500">
                  Our Recommendation
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
                  {activeAsset.recommendation}
                </h4>
                <p className="text-xs text-slate-500">
                  {activeAsset.dealVerdict}
                </p>
              </div>
            </div>

            {/* Price Stats Cards: Highest Price ↑ | Average Price ⇅ | Lowest Price ↓ */}
            <div className="flex flex-col gap-2.5">
              <h4 className="text-sm font-bold text-slate-900">Price Stats</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Highest Price */}
                <div className="p-4 rounded-2xl bg-[#f0f6ff] border border-blue-100/70 flex flex-col items-center justify-center gap-1 shadow-2xs">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    Highest Price <span className="text-red-500 font-extrabold">↑</span>
                  </span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    ₹{activeAsset.highestPrice.toLocaleString()}
                  </span>
                </div>

                {/* Average Price */}
                <div className="p-4 rounded-2xl bg-[#f0f6ff] border border-blue-100/70 flex flex-col items-center justify-center gap-1 shadow-2xs">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    Average Price <span className="text-amber-500 font-extrabold">⇅</span>
                  </span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    ₹{activeAsset.averagePrice.toLocaleString()}
                  </span>
                </div>

                {/* Lowest Price */}
                <div className="p-4 rounded-2xl bg-[#f0f6ff] border border-blue-100/70 flex flex-col items-center justify-center gap-1 shadow-2xs">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    Lowest Price <span className="text-emerald-500 font-extrabold">↓</span>
                  </span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    ₹{activeAsset.lowestPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Action: Set Price Drop Alert */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-center">
              <button
                onClick={() => setShowAlertModal(true)}
                className="py-2 px-4 rounded-xl text-slate-900 hover:text-indigo-600 font-bold text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4 text-indigo-600" />
                <span>Set price drop alert to buy later</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── PRICE DROP ALERT MODAL ─── */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Set Price Drop Alert
                </h3>
              </div>
              <button
                onClick={() => setShowAlertModal(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Notify me automatically when <strong>{activeAsset.name}</strong> dips below your target trigger price.
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700">Target Trigger Price (₹)</label>
              <input
                type="number"
                value={alertTargetPrice}
                onChange={(e) => setAlertTargetPrice(e.target.value)}
                placeholder="449"
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                <span className="text-slate-400">Presets:</span>
                <button
                  onClick={() => setAlertTargetPrice(activeAsset.lowestPrice.toString())}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-semibold"
                >
                  Lowest (₹{activeAsset.lowestPrice})
                </button>
                <button
                  onClick={() => setAlertTargetPrice(Math.round(activeAsset.averagePrice * 0.95).toString())}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-semibold"
                >
                  -5% of Avg
                </button>
              </div>
            </div>

            {alertSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{alertSuccessMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAlertModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAlert}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Activate Real-Time Alert</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
