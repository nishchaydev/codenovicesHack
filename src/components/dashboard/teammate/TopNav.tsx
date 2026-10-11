import React, { useState } from "react";
import { UserProfile } from "@/types/fingraph/types";
import { ThemeSelector } from "@/components/ThemeSelector";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Search, Plus, ArrowRight } from "lucide-react";

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
    <header className="h-16 w-full nav-glass px-6 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
      {/* Search & Event Prompt Input */}
      <div className="flex-1 max-w-3xl flex items-center gap-3">
        <form onSubmit={handleSubmit} className="flex-1 flex items-center">
          <div className="relative w-full flex items-center">
            {/* Magnifier Icon */}
            <div className="absolute left-3.5 pointer-events-none text-[var(--accent-primary)]">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder='Enter financial event, e.g. "Tata Motors margin cut" or "Crude oil rises 12%"...'
              className="w-full h-10 pl-10 pr-36 rounded-full clay-inset text-xs font-bold text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:outline-none transition-all"
            />

            {/* Analyze event Button Inside Input */}
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-1.5 h-7.5 px-3.5 rounded-full clay-button-primary text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60 shadow-md"
            >
              {isLoading ? (
                <span className="animate-spin inline-block w-3 h-3 border-2 border-white/40 border-t-white rounded-full" />
              ) : null}
              <span>Propagate</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </form>

        {/* Add Stock / News Action Button */}
        {onOpenAddStock && (
          <button
            type="button"
            onClick={onOpenAddStock}
            className="h-9 px-3.5 rounded-full clay-surface border border-[var(--clay-border)] text-[var(--text-primary)] hover:text-[var(--accent-primary)] text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer hover:scale-102 active:scale-98 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Add Stock</span>
          </button>
        )}
      </div>

      {/* Right Controls: Market Selector, Theme, Language & User Avatar */}
      <div className="flex items-center gap-2.5">
        {/* Country & Market Dropdown Pill */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-9 px-3.5 rounded-full clay-surface border border-[var(--clay-border)] flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] transition-all cursor-pointer shadow-sm"
          >
            <span className="text-sm">🇮🇳</span>
            <span className="truncate max-w-[130px]">{marketSelector}</span>
            <span className="text-[10px] text-[var(--text-secondary)]">▼</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl clay-surface border border-[var(--clay-border)] shadow-2xl p-1.5 z-40 text-xs font-bold">
              <button
                onClick={() => { setMarketSelector("India • All markets"); setIsDropdownOpen(false); }}
                className="w-full px-3 py-2 text-left rounded-xl flex items-center gap-2 hover:bg-[var(--clay-bg)] text-[var(--text-primary)] cursor-pointer"
              >
                <span>🇮🇳</span> India • All markets (NSE/BSE)
              </button>
              <button
                onClick={() => { setMarketSelector("US • Global Tech"); setIsDropdownOpen(false); }}
                className="w-full px-3 py-2 text-left rounded-xl flex items-center gap-2 hover:bg-[var(--clay-bg)] text-[var(--text-primary)] cursor-pointer"
              >
                <span>🇺🇸</span> US • Global Markets
              </button>
              <button
                onClick={() => { setMarketSelector("Global Commodities"); setIsDropdownOpen(false); }}
                className="w-full px-3 py-2 text-left rounded-xl flex items-center gap-2 hover:bg-[var(--clay-bg)] text-[var(--text-primary)] cursor-pointer"
              >
                <span>🌐</span> Cross-Market Commodities
              </button>
            </div>
          )}
        </div>

        {/* 4-Theme Selector */}
        <ThemeSelector />

        {/* 8-Language Selector */}
        <LanguageSelector placement="inline" />

        {/* User Profile Avatar & RBAS Clearance Button */}
        <div className="flex items-center gap-2 pl-1">
          {userProfile && (
            <button
              onClick={onOpenRbacModal}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full clay-badge text-[var(--accent-primary)] text-xs font-black transition-transform hover:scale-105 cursor-pointer"
              title="Click to switch institutional clearance (RBAS)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate max-w-[110px]">{userProfile.roleLabel.split(" ")[0]}</span>
            </button>
          )}

          <button
            onClick={onOpenAuthModal}
            className="w-9 h-9 rounded-full clay-button-primary flex items-center justify-center text-white text-xs font-black tracking-wider select-none shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Institutional Clearance & Identity Gate"
          >
            {userProfile ? userProfile.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "FD"}
          </button>
        </div>
      </div>
    </header>
  );
};
