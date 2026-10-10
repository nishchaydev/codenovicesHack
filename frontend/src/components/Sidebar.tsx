import React from "react";

export type NavTab = "overview" | "event_explorer" | "impact_graph" | "ai_hub" | "historical_replay" | "saved_analyses";

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col justify-between p-4 select-none z-30">
      {/* Top Brand Logo & Navigation */}
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          {/* Blue Geometric Logo Mark */}
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="6" cy="6" r="3" fill="currentColor" />
              <circle cx="18" cy="8" r="3" fill="currentColor" />
              <circle cx="12" cy="18" r="3" fill="currentColor" />
              <path d="M8.5 7.5L15.5 7.5" stroke="white" strokeWidth="2" />
              <path d="M7.5 8.5L10.5 15.5" stroke="white" strokeWidth="2" />
              <path d="M16.5 8.5L13.5 15.5" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
            FinGraph
          </span>
        </div>

        {/* Primary Navigation Menu */}
        <nav className="flex flex-col gap-1 text-[13.5px] font-medium text-slate-600">
          {/* Overview */}
          <button
            onClick={() => onTabChange("overview")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
              activeTab === "overview"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Overview</span>
          </button>

          {/* Event Explorer */}
          <button
            onClick={() => onTabChange("event_explorer")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
              activeTab === "event_explorer"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Event Explorer</span>
          </button>

          {/* Impact Graph (Active by default) */}
          <button
            onClick={() => onTabChange("impact_graph")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
              activeTab === "impact_graph"
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <svg className="w-4 h-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <circle cx="6" cy="6" r="3" />
              <circle cx="18" cy="8" r="3" />
              <circle cx="12" cy="18" r="3" />
              <path d="M8.5 7.5L15.5 7.5" />
              <path d="M7.5 8.5L10.5 15.5" />
              <path d="M16.5 8.5L13.5 15.5" />
            </svg>
            <span>Impact Graph</span>
          </button>

          {/* AI Hub (AI Insights) */}
          <button
            onClick={() => onTabChange("ai_hub")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
              activeTab === "ai_hub"
                ? "bg-indigo-50 text-indigo-700 font-semibold"
                : "hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 shrink-0 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>AI Hub</span>
            </div>
            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 border border-indigo-200">
              INSIGHTS
            </span>
          </button>

          {/* Historical Replay */}
          <button
            onClick={() => onTabChange("historical_replay")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
              activeTab === "historical_replay"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Historical Replay</span>
          </button>

          {/* Saved Analyses */}
          <button
            onClick={() => onTabChange("saved_analyses")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
              activeTab === "saved_analyses"
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>Saved Analyses</span>
          </button>
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex flex-col gap-1 border-t border-slate-100 pt-3 text-[13px] font-medium text-slate-500">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Help & Docs</span>
        </button>
      </div>
    </aside>
  );
};
