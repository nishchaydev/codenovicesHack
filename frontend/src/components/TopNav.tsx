import React, { useState } from "react";
import { UserProfile } from "../types";
import { ChevronDown, Plus, Search } from "lucide-react";
import { GoogleTranslateDropdown } from "./GoogleTranslateDropdown";

interface TopNavProps {
  onAnalyze: (query: string) => void;
  onOpenAddStock?: () => void;
  isLoading?: boolean;
  onOpenAuthModal?: () => void;
  onOpenRbacModal?: () => void;
  userProfile?: UserProfile | null;
}

export const TopNav: React.FC<TopNavProps> = ({
  onAnalyze,
  onOpenAddStock,
  isLoading = false,
  onOpenAuthModal,
  onOpenRbacModal,
  userProfile,
}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [marketSelector, setMarketSelector] = useState<string>("India • All markets");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onAnalyze(searchInput.trim());
    }
  };

  return (
    <header className="h-16 w-full border-b border-slate-200/70 bg-white/70 backdrop-blur-2xl px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      {/* Search & Event Prompt Input with Apple Spotlight Style */}
      <div className="flex-1 max-w-3xl flex items-center gap-3">
        <form onSubmit={handleSubmit} className="flex-1 flex items-center">
          <div className="relative w-full flex items-center group">
            {/* Magnifier Icon */}
            <div className="absolute left-3.5 pointer-events-none text-slate-400 group-focus-within:text-[#007AFF] transition-colors">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder='Enter a financial catalyst, e.g. "Crude oil rises 12%" or "Tata Motors margin cut"...'
              className="w-full h-10 pl-10 pr-36 rounded-2xl border border-slate-200/80 bg-white/60 backdrop-blur-xl text-[13px] text-slate-900 placeholder:text-slate-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/25 focus:border-[#007AFF] transition-all"
            />

            {/* Analyze event Button Inside Input - Apple Accent Pill */}
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-1.5 h-7.5 px-3 rounded-xl bg-[#007AFF] hover:bg-[#0062cc] active:scale-[0.98] text-white text-[12px] font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,122,255,0.3)] transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full" />
              ) : null}
              <span>Analyze</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>

        {/* Add Stock / News Action Button - Frosted Glass Pill */}
        {onOpenAddStock && (
          <button
            type="button"
            onClick={onOpenAddStock}
            className="h-10 px-3.5 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 text-slate-700 text-[12.5px] font-semibold flex items-center gap-1.5 transition shadow-[0_1px_2px_rgba(0,0,0,0.04)] whitespace-nowrap cursor-pointer active:scale-[0.98] hover:border-blue-300"
          >
            <Plus className="w-3.5 h-3.5 text-[#007AFF]" />
            <span>Add Stock</span>
          </button>
        )}
      </div>

      {/* Right Controls: Market Selector & User Profile */}
      <div className="flex items-center gap-2.5">
        {/* Country & Market Dropdown Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-9 px-3 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-xl hover:bg-white flex items-center gap-2 text-[12.5px] font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            {/* Indian Tricolor Flag SVG */}
            <svg className="w-4 h-3 rounded-2xs overflow-hidden shadow-2xs" viewBox="0 0 640 480">
              <rect width="640" height="160" fill="#FF9933" />
              <rect y="160" width="640" height="160" fill="#FFFFFF" />
              <rect y="320" width="640" height="160" fill="#128807" />
              <circle cx="320" cy="240" r="40" fill="none" stroke="#000080" strokeWidth="8" />
            </svg>
            <span className="hidden md:inline">{marketSelector}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-52 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200/80 shadow-xl py-1.5 z-40 text-[13px] animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => { setMarketSelector("India • All markets"); setIsDropdownOpen(false); }}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-800 cursor-pointer"
              >
                <span>🇮🇳</span> India • All markets (NSE/BSE)
              </button>
              <button
                onClick={() => { setMarketSelector("US • Global Tech"); setIsDropdownOpen(false); }}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-800 cursor-pointer"
              >
                <span>🇺🇸</span> US • Global Markets (NYSE/NASDAQ)
              </button>
              <button
                onClick={() => { setMarketSelector("Global Commodities"); setIsDropdownOpen(false); }}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-800 cursor-pointer"
              >
                <span>🌐</span> Cross-Market Commodities
              </button>
            </div>
          )}
        </div>

        {/* ─── GOOGLE TRANSLATE (PLACED RIGHT BESIDE INDIA & OTHER COUNTRY DROPDOWN) ─── */}
        <GoogleTranslateDropdown />

        {/* User Profile Avatar & RBAS Clearance Button */}
        <div className="flex items-center gap-2">
          {userProfile && (
            <button
              onClick={onOpenRbacModal}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/80 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer"
              title="Click to switch institutional clearance (RBAS)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="truncate max-w-[120px]">{userProfile.roleLabel.split(" ")[0]}</span>
            </button>
          )}

          <div
            className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white text-[12px] font-semibold tracking-wider select-none shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-slate-700"
            title={userProfile ? `${userProfile.name} (${userProfile.roleLabel})` : "Active Analyst"}
          >
            {userProfile ? userProfile.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "DN"}
          </div>
        </div>
      </div>
    </header>
  );
};
