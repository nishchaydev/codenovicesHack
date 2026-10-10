import React, { useState } from "react";

interface TopNavProps {
  onAnalyze: (query: string) => void;
  isLoading?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ onAnalyze, isLoading = false }) => {
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
    <header className="h-16 w-full border-b border-slate-200 bg-white px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Search & Event Prompt Input */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-3xl flex items-center">
        <div className="relative w-full flex items-center">
          {/* Magnifier Icon */}
          <div className="absolute left-3.5 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder='Enter a news event, e.g. "Crude oil rises 12%" or paste a news article...'
            className="w-full h-11 pl-10 pr-36 rounded-xl border border-slate-200 bg-slate-50/50 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />

          {/* Analyze event Button Inside Input */}
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-1.5 h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full" />
            ) : null}
            <span>Analyze event</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>

      {/* Right Controls: Market Selector & User Avatar */}
      <div className="flex items-center gap-3">
        {/* Country & Market Dropdown Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-2 text-[13px] font-medium text-slate-700 transition-colors shadow-2xs"
          >
            {/* Indian Tricolor Flag SVG */}
            <svg className="w-4 h-3 rounded-2xs overflow-hidden shadow-2xs" viewBox="0 0 640 480">
              <rect width="640" height="160" fill="#FF9933" />
              <rect y="160" width="640" height="160" fill="#FFFFFF" />
              <rect y="320" width="640" height="160" fill="#128807" />
              <circle cx="320" cy="240" r="40" fill="none" stroke="#000080" strokeWidth="8" />
            </svg>
            <span>{marketSelector}</span>
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-52 rounded-xl bg-white border border-slate-200 shadow-lg py-1.5 z-40 text-[13px]">
              <button
                onClick={() => { setMarketSelector("India • All markets"); setIsDropdownOpen(false); }}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-800"
              >
                <span>🇮🇳</span> India • All markets (NSE/BSE)
              </button>
              <button
                onClick={() => { setMarketSelector("US • Global Tech"); setIsDropdownOpen(false); }}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-800"
              >
                <span>🇺🇸</span> US • Global Markets (NYSE/NASDAQ)
              </button>
              <button
                onClick={() => { setMarketSelector("Global Commodities"); setIsDropdownOpen(false); }}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 text-slate-800"
              >
                <span>🌐</span> Cross-Market Commodities
              </button>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white text-[12px] font-semibold tracking-wider select-none shadow-sm">
          NG
        </div>
      </div>
    </header>
  );
};
