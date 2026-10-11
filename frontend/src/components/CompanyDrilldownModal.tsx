import React from "react";
import { RadialCardNode } from "../types";

interface CompanyDrilldownModalProps {
  node: RadialCardNode | null;
  onClose: () => void;
}

const STOCK_PROFILES: Record<string, { name: string; price: string; delta: string; sensitivity: string; marketCap: string }> = {
  "ASIANPAINT.NS": {
    name: "Asian Paints Ltd.",
    price: "₹2,845.50",
    delta: "-3.8%",
    sensitivity: "High (55% raw material exposure to crude derivatives like Phthalic Anhydride and Pentaerythritol)",
    marketCap: "₹2.72 Lakh Cr",
  },
  "BERGEPAINT.NS": {
    name: "Berger Paints India Ltd.",
    price: "₹512.20",
    delta: "-3.2%",
    sensitivity: "High (Decorative paint gross margins contract 180 bps per 10% crude spike)",
    marketCap: "₹61,400 Cr",
  },
  "PIDILITIND.NS": {
    name: "Pidilite Industries Ltd.",
    price: "₹3,020.10",
    delta: "-2.1%",
    sensitivity: "Moderate (VAM monomer costs track petrochemical feedstocks)",
    marketCap: "₹1.53 Lakh Cr",
  },
  "INDIGO.NS": {
    name: "InterGlobe Aviation Ltd. (IndiGo)",
    price: "₹4,680.00",
    delta: "-4.6%",
    sensitivity: "Critical (ATF comprises 41% of airline OPEX; every 10% ATF surge cuts EBITDAR by ₹950 Cr)",
    marketCap: "₹1.81 Lakh Cr",
  },
  "SPICEJET.BO": {
    name: "SpiceJet Ltd.",
    price: "₹56.40",
    delta: "-6.1%",
    sensitivity: "Critical (Thin operating liquidity limits fuel hedging capabilities)",
    marketCap: "₹4,520 Cr",
  },
  "TATAMOTORS.NS": {
    name: "Tata Motors Ltd.",
    price: "₹924.30",
    delta: "+1.8%",
    sensitivity: "Moderate (Commercial vehicle demand benefits from logistics capex, but input steel/rubber pressure exists)",
    marketCap: "₹3.39 Lakh Cr",
  },
  "HDFCBANK.NS": {
    name: "HDFC Bank Ltd.",
    price: "₹1,682.00",
    delta: "+1.2%",
    sensitivity: "Benchmark (Net interest margins expand with credit volume growth)",
    marketCap: "₹12.8 Lakh Cr",
  },
};

export const CompanyDrilldownModal: React.FC<CompanyDrilldownModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  const relevantTickers = node.tickers || [];
  const [liveData, setLiveData] = React.useState<Record<string, { price: number; change: number; source: string }>>({});

  React.useEffect(() => {
    relevantTickers.forEach(async (ticker) => {
      try {
        const res = await fetch(`/api/stock/${ticker}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.current_price) {
            setLiveData((prev) => ({
              ...prev,
              [ticker]: {
                price: data.current_price,
                change: data.change_pct,
                source: data.data_source || "yfinance_live",
              },
            }));
          }
        }
      } catch (err) {
        // Fallback to static base
      }
    });
  }, [node]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {node.title.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                {node.title} — Corporate Breakdown
              </h3>
              <span className="text-[12px] text-slate-500">
                Live market transmission sensitivity across key listed equities
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Node Summary Pill */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[12.5px]">
          <span className="text-slate-600">
            Sector Horizon: <strong className="text-slate-900">{node.timeHorizon || "1–3 months"}</strong>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-800 font-semibold text-[11px]">
            Transmission: {node.badge}
          </span>
        </div>

        {/* Companies List */}
        <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
          {relevantTickers.length > 0 ? (
            relevantTickers.map((ticker) => {
              const profile = STOCK_PROFILES[ticker] || {
                name: ticker,
                price: "Live",
                delta: "-2.5%",
                sensitivity: "Direct channel exposure to commodity input cost",
                marketCap: "N/A",
              };
              const live = liveData[ticker];
              const displayPrice = live
                ? `${ticker.endsWith(".NS") || ticker.endsWith(".BO") ? "₹" : "$"}${live.price.toLocaleString()}`
                : profile.price;
              const displayDelta = live
                ? `${live.change > 0 ? "+" : ""}${live.change}%`
                : profile.delta;
              const isNegative = displayDelta.startsWith("-");

              return (
                <div
                  key={ticker}
                  className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 transition-all flex flex-col gap-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13.5px] font-bold text-slate-900">
                          {profile.name}
                        </span>
                        {live && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-mono font-bold">
                            yfinance
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {ticker} • {profile.marketCap}
                      </span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-[13.5px] font-bold text-slate-900 font-mono">
                        {displayPrice}
                      </span>
                      <span
                        className={`text-[11px] font-bold font-mono ${
                          isNegative ? "text-red-600" : "text-emerald-600"
                        }`}
                      >
                        {displayDelta}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11.5px] text-slate-600 leading-relaxed bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                    <strong className="text-slate-700">Sensitivity Analysis:</strong> {profile.sensitivity}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-400 text-sm">
              Macroeconomic variable with broad multi-sector transmission.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex justify-end border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-[13px] font-medium hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
