import React, { useEffect, useState } from "react";
import { GraphNode, GraphLink, StockHistory } from "@/types/fingraph/types";
import { fetchStockHistory } from "@/lib/api/fingraphApi";
import { SparklineChart } from "./SparklineChart";
import { X, ArrowRight, ArrowDownLeft, ArrowUpRight, Zap, Globe } from "lucide-react";

interface SingleAppProfileProps {
  app: GraphNode;
  allLinks: GraphLink[];
  allNodes: GraphNode[];
  onClose: () => void;
  onSimulateAppShock: (appName: string, ticker?: string) => void;
  onSelectConnectedNode: (nodeId: string) => void;
}

export const SingleAppProfile: React.FC<SingleAppProfileProps> = ({
  app,
  allLinks,
  allNodes,
  onClose,
  onSimulateAppShock,
  onSelectConnectedNode,
}) => {
  const [stockData, setStockData] = useState<StockHistory | null>(null);
  const [loadingStock, setLoadingStock] = useState<boolean>(false);

  useEffect(() => {
    if (!app.ticker) {
      setStockData(null);
      return;
    }

    let isMounted = true;
    setLoadingStock(true);
    fetchStockHistory(app.ticker)
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
  }, [app]);

  // Compute Inbound and Outbound transmission edges
  const inboundLinks = React.useMemo(() => {
    return allLinks.filter((l) => {
      const tgtId = typeof l.target === "object" ? l.target.id : l.target;
      return tgtId === app.id;
    });
  }, [allLinks, app.id]);

  const outboundLinks = React.useMemo(() => {
    return allLinks.filter((l) => {
      const srcId = typeof l.source === "object" ? l.source.id : l.source;
      return srcId === app.id;
    });
  }, [allLinks, app.id]);

  const getNodeName = (nodeId: string) => {
    const found = allNodes.find((n) => n.id === nodeId);
    return found ? found.name : nodeId;
  };

  return (
    <div className="absolute top-4 left-4 z-20 w-88 max-w-[calc(100vw-32px)] clay-surface border border-[var(--clay-border)] p-5 rounded-3xl text-[var(--text-primary)] animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--clay-border)]">
        <div className="flex items-center gap-3">
          {/* Tactile Icon Tile */}
          <div className="w-12 h-12 rounded-2xl clay-button-primary flex items-center justify-center font-bold text-base font-mono shadow-sm">
            {app.ticker ? app.ticker.slice(0, 2) : app.name.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-sans font-black text-[var(--text-secondary)] uppercase">
                {app.type}
              </span>
              {app.country && (
                <span className="text-[11px] text-[var(--text-secondary)] font-sans flex items-center gap-0.5 font-bold">
                  <Globe className="w-2.5 h-2.5 text-[var(--accent-primary)]" />
                  {app.country}
                </span>
              )}
            </div>
            <h2 className="text-base font-black tracking-tight text-[var(--text-primary)] leading-tight">
              {app.name}
            </h2>
            {app.ticker && (
              <span className="text-xs font-mono font-black text-[var(--accent-primary)]">
                {app.ticker}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="clay-surface text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1.5 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Pill Matrix */}
      <div className="grid grid-cols-2 gap-2 my-3 text-xs font-sans">
        {app.sector && (
          <div className="clay-inset p-2.5 rounded-2xl">
            <span className="text-[10px] text-[var(--text-secondary)] block font-bold">SECTOR</span>
            <span className="text-[var(--text-primary)] font-bold truncate block">{app.sector}</span>
          </div>
        )}
        {app.market_cap && (
          <div className="clay-inset p-2.5 rounded-2xl">
            <span className="text-[10px] text-[var(--text-secondary)] block font-bold">MARKET CAP</span>
            <span className="text-[var(--text-primary)] font-bold truncate block">{app.market_cap}</span>
          </div>
        )}
      </div>

      {/* Sparkline Price Action */}
      {app.ticker && (
        <div className="mb-3">
          {loadingStock ? (
            <div className="h-20 flex items-center justify-center text-xs text-[var(--text-secondary)] font-sans font-bold">
              Loading price history...
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

      {/* Direct Shock Catalyst Button */}
      <div className="my-3">
        <button
          onClick={() => onSimulateAppShock(app.name, app.ticker)}
          className="w-full clay-button-primary hover:bg-[#262626] text-white rounded-full py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
        >
          <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
          <span>Simulate Direct Shock to {app.name}</span>
        </button>
      </div>

      {/* Inbound Supply Feeds */}
      {inboundLinks.length > 0 && (
        <div className="mb-3">
          <span className="text-[11px] font-sans font-semibold text-[var(--text-secondary)] uppercase flex items-center gap-1 mb-1.5">
            <ArrowDownLeft className="w-3 h-3 text-[var(--text-primary)]" />
            Inbound Feeds & Suppliers ({inboundLinks.length})
          </span>
          <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
            {inboundLinks.map((l, idx) => {
              const srcId = typeof l.source === "object" ? l.source.id : l.source;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectConnectedNode(srcId)}
                  className="w-full text-left clay-inset hover:bg-[#e0e0e0] p-2 rounded-[12px] text-xs transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span className="font-medium text-[var(--text-primary)] truncate">
                    {getNodeName(srcId)}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                    {l.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Outbound Downstream Impact */}
      {outboundLinks.length > 0 && (
        <div className="mb-3">
          <span className="text-[11px] font-sans font-semibold text-[var(--text-secondary)] uppercase flex items-center gap-1 mb-1.5">
            <ArrowUpRight className="w-3 h-3 text-[var(--text-primary)]" />
            Outbound Impact Channels ({outboundLinks.length})
          </span>
          <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
            {outboundLinks.map((l, idx) => {
              const tgtId = typeof l.target === "object" ? l.target.id : l.target;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectConnectedNode(tgtId)}
                  className="w-full text-left clay-inset hover:bg-[#e0e0e0] p-2 rounded-[12px] text-xs transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span className="font-medium text-[var(--text-primary)] truncate">
                    {getNodeName(tgtId)}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                    {l.type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Details Description */}
      {app.details && (
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed clay-inset p-2.5 rounded-[16px] mt-2">
          {app.details}
        </p>
      )}
    </div>
  );
};

