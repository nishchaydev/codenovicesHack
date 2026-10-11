import React from "react";
import { StockPricePoint } from "@/types/fingraph/types";

interface SparklineChartProps {
  prices: StockPricePoint[];
  changePct: number;
  ticker: string;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({ prices, changePct, ticker }) => {
  if (!prices || prices.length < 2) {
    return <div className="text-xs text-[var(--text-secondary)] italic py-3">No price trajectory data</div>;
  }

  const values = prices.map((p) => p.close);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const width = 300;
  const height = 64;
  const padding = 6;

  const points = prices.map((p, idx) => {
    const x = padding + (idx / (prices.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((p.close - minVal) / range) * (height - 2 * padding);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${width - padding},${height} L ${padding},${height} Z`;

  const isPositive = changePct >= 0;
  const strokeColor = isPositive ? "#10b981" : "#ef4444";
  const gradientId = `mobbin-spark-${ticker.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div className="w-full clay-inset p-3 rounded-2xl border border-[var(--clay-border)]">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-sans text-[12px] font-bold text-[var(--text-primary)]">14-Day Trajectory</span>
        <span
          className={`font-mono text-[12px] font-extrabold ${
            isPositive ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {isPositive ? "+" : ""}
          {changePct}%
        </span>
      </div>

      <svg width={width} height={height} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.18" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <path d={areaD} fill={`url(#${gradientId})`} />
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />

        {prices.length > 0 && (
          <circle
            cx={points[points.length - 1].split(",")[0]}
            cy={points[points.length - 1].split(",")[1]}
            r="3"
            fill={strokeColor}
          />
        )}
      </svg>

      <div className="flex justify-between items-center text-[10px] text-[#707070] font-sans mt-1">
        <span>Low: ${minVal.toFixed(1)}</span>
        <span className="font-mono text-[#adadad]">{prices[prices.length - 1].date}</span>
        <span>High: ${maxVal.toFixed(1)}</span>
      </div>
    </div>
  );
};
