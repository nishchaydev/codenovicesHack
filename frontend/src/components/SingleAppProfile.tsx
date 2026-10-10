import React, { useEffect, useState } from "react";
import { GraphNode, GraphLink, StockHistory } from "../types";
import { fetchStockHistory } from "../api";
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
    <div className="absolute top-4 left-4 z-20 w-88 max-w-[calc(100vw-32px)] bg-[#ffffff] border border-[#e0e0e0] p-5 rounded-[24px] text-[#141414] animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#f0f0f0]">
        <div className="flex items-center gap-3">
          {/* 30% iOS Squircle Icon Tile */}
          <div className="w-12 h-12 rounded-[14px] bg-[#141414] text-white flex items-center justify-center font-bold text-base font-mono shadow-sm">
            {app.ticker ? app.ticker.slice(0, 2) : app.name.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-sans font-medium text-[#707070] uppercase">
                {app.type}
              </span>
              {app.country && (
                <span className="text-[11px] text-[#adadad] font-sans flex items-center gap-0.5">
                  <Globe className="w-2.5 h-2.5" />
                  {app.country}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold tracking-tight text-[#141414] leading-tight">
              {app.name}
            </h2>
            {app.ticker && (
              <span className="text-xs font-mono font-semibold text-[#0066ff]">
                {app.ticker}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-[#707070] hover:text-[#141414] p-1.5 rounded-full hover:bg-[#f3f3f3] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Pill Matrix */}
      <div className="grid grid-cols-2 gap-2 my-3 text-xs font-sans">
        {app.sector && (
          <div className="bg-[#f3f3f3] p-2.5 rounded-[16px]">
            <span className="text-[10px] text-[#707070] block font-medium">SECTOR</span>
            <span className="text-[#141414] font-semibold truncate block">{app.sector}</span>
          </div>
        )}
        {app.market_cap && (
          <div className="bg-[#f3f3f3] p-2.5 rounded-[16px]">
            <span className="text-[10px] text-[#707070] block font-medium">MARKET CAP</span>
            <span className="text-[#141414] font-semibold truncate block">{app.market_cap}</span>
          </div>
        )}
      </div>

      {/* Sparkline Price Action */}
      {app.ticker && (
        <div className="mb-3">
          {loadingStock ? (
            <div className="h-20 flex items-center justify-center text-xs text-[#707070] font-sans">
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
          className="w-full bg-[#141414] hover:bg-[#262626] text-white rounded-full py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
        >
          <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
          <span>Simulate Direct Shock to {app.name}</span>
        </button>
      </div>

      {/* Inbound Supply Feeds */}
      {inboundLinks.length > 0 && (
        <div className="mb-3">
          <span className="text-[11px] font-sans font-semibold text-[#707070] uppercase flex items-center gap-1 mb-1.5">
            <ArrowDownLeft className="w-3 h-3 text-[#141414]" />
            Inbound Feeds & Suppliers ({inboundLinks.length})
          </span>
          <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
            {inboundLinks.map((l, idx) => {
              const srcId = typeof l.source === "object" ? l.source.id : l.source;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectConnectedNode(srcId)}
                  className="w-full text-left bg-[#f3f3f3] hover:bg-[#e0e0e0] p-2 rounded-[12px] text-xs transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span className="font-medium text-[#141414] truncate">
                    {getNodeName(srcId)}
                  </span>
                  <span className="text-[10px] font-mono text-[#707070]">
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
          <span className="text-[11px] font-sans font-semibold text-[#707070] uppercase flex items-center gap-1 mb-1.5">
            <ArrowUpRight className="w-3 h-3 text-[#141414]" />
            Outbound Impact Channels ({outboundLinks.length})
          </span>
          <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
            {outboundLinks.map((l, idx) => {
              const tgtId = typeof l.target === "object" ? l.target.id : l.target;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectConnectedNode(tgtId)}
                  className="w-full text-left bg-[#f3f3f3] hover:bg-[#e0e0e0] p-2 rounded-[12px] text-xs transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span className="font-medium text-[#141414] truncate">
                    {getNodeName(tgtId)}
                  </span>
                  <span className="text-[10px] font-mono text-[#707070]">
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
        <p className="text-xs text-[#707070] leading-relaxed bg-[#f3f3f3] p-2.5 rounded-[16px] mt-2">
          {app.details}
        </p>
      )}
    </div>
  );
};
