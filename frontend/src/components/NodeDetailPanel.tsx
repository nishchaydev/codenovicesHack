import React, { useEffect, useState } from "react";
import { GraphNode, StockHistory } from "../types";
import { fetchStockHistory } from "../api";
import { SparklineChart } from "./SparklineChart";
import { X, ExternalLink, Globe, DollarSign, Layers } from "lucide-react";

interface NodeDetailPanelProps {
  node: GraphNode | null;
  onClose: () => void;
}

export const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ node, onClose }) => {
  const [stockData, setStockData] = useState<StockHistory | null>(null);
  const [loadingStock, setLoadingStock] = useState<boolean>(false);

  useEffect(() => {
    if (!node || !node.ticker) {
      setStockData(null);
      return;
    }

    let isMounted = true;
    setLoadingStock(true);

    fetchStockHistory(node.ticker)
      .then((data) => {
        if (isMounted) {
          setStockData(data);
          setLoadingStock(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingStock(false);
      });

    return () => {
      isMounted = false;
    };
  }, [node]);

  if (!node) return null;

  return (
    <div className="absolute top-4 left-4 z-20 w-80 bg-[#0B0F19]/95 backdrop-blur-md border border-slate-800 p-4 rounded-lg shadow-2xl text-slate-200 animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-mono uppercase bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-amber-400 font-semibold">
              {node.type}
            </span>
            {node.country && (
              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                <Globe className="w-2.5 h-2.5" />
                {node.country}
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-white leading-tight">{node.name}</h2>
          {node.ticker && (
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              {node.ticker}
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Meta Specs */}
      <div className="grid grid-cols-2 gap-2 my-3 text-xs font-mono">
        {node.sector && (
          <div className="bg-[#070A10] p-2 rounded border border-slate-800/60">
            <span className="text-[10px] text-slate-500 block">SECTOR</span>
            <span className="text-slate-300 font-medium truncate block">{node.sector}</span>
          </div>
        )}
        {node.market_cap && (
          <div className="bg-[#070A10] p-2 rounded border border-slate-800/60">
            <span className="text-[10px] text-slate-500 block">MARKET CAP</span>
            <span className="text-slate-300 font-medium truncate block">{node.market_cap}</span>
          </div>
        )}
      </div>

      {/* Shock Impact Meter */}
      {node.risk_score > 0 && (
        <div className="mb-3 bg-rose-950/40 border border-rose-900/60 p-2.5 rounded">
          <div className="flex justify-between items-center text-xs font-mono mb-1">
            <span className="text-rose-300 font-semibold flex items-center gap-1">
              ⚡ Simulated Shock Score
            </span>
            <span className="text-rose-400 font-bold text-sm">{node.risk_score}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full"
              style={{ width: `${Math.min(100, node.risk_score)}%` }}
            />
          </div>
        </div>
      )}

      {/* Sparkline Price Action */}
      {node.ticker && (
        <div className="mb-3">
          {loadingStock ? (
            <div className="h-20 flex items-center justify-center text-xs text-slate-500 font-mono">
              Fetching market telemetry...
            </div>
          ) : stockData ? (
            <SparklineChart
              prices={stockData.prices}
              changePct={stockData.change_pct}
              ticker={stockData.ticker}
            />
          ) : null}
        </div>
      )}

      {/* Descriptive Summary */}
      {node.details && (
        <p className="text-xs text-slate-400 leading-relaxed bg-[#070A10] p-2 rounded border border-slate-800/60">
          {node.details}
        </p>
      )}
    </div>
  );
};
