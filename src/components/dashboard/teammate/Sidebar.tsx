import React, { useState } from "react";
import { 
  Network, 
  Sparkles, 
  Search, 
  Building2,
  LayoutDashboard, 
  History, 
  Grid,
  FileText,
  Bookmark, 
  Pin, 
  PinOff, 
  EyeOff, 
  PanelLeftOpen, 
  ShieldCheck, 
  Activity,
  Settings,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export type NavTab = 
  | "impact_graph" 
  | "ai_hub" 
  | "event_explorer" 
  | "asset_profiler" 
  | "overview" 
  | "historical_replay" 
  | "contagion_matrix" 
  | "audit_reports" 
  | "saved_analyses" 
  | "settings" 
  | "help_docs";

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenAddStock?: () => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onOpenAddStock }) => {
  const [open, setOpen] = useState(true);
  const [isPinned, setIsPinned] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  // Core Transmission Modules
  const transmissionModules: NavItem[] = [
    { id: "impact_graph", label: "Impact Graph", icon: <Network className="w-4 h-4 flex-shrink-0 text-blue-500" />, badge: "LIVE" },
    { id: "ai_hub", label: "AI Hub", icon: <Sparkles className="w-4 h-4 flex-shrink-0 text-indigo-500" />, badge: "INSIGHTS" },
    { id: "event_explorer", label: "Event Explorer", icon: <Search className="w-4 h-4 flex-shrink-0 text-amber-500" />, badge: "SHOCK" },
    { id: "asset_profiler", label: "Asset Profiler", icon: <Building2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />, badge: "STOCKS" },
  ];

  // Forensics, Analytics & Historical Verification
  const forensicTools: NavItem[] = [
    { id: "overview", label: "Market Overview", icon: <LayoutDashboard className="w-4 h-4 flex-shrink-0 text-[#626260]" />, badge: "INDEX" },
    { id: "historical_replay", label: "Historical Replay", icon: <History className="w-4 h-4 flex-shrink-0 text-amber-600" />, badge: "CRISIS" },
    { id: "contagion_matrix", label: "Sector Heatmap", icon: <Grid className="w-4 h-4 flex-shrink-0 text-emerald-600" />, badge: "HEATMAP" },
    { id: "audit_reports", label: "Audit Reports", icon: <FileText className="w-4 h-4 flex-shrink-0 text-[#626260]" />, badge: "LOGS" },
    { id: "saved_analyses", label: "Saved Watchlists", icon: <Bookmark className="w-4 h-4 flex-shrink-0 text-[#626260]" /> },
  ];

  // System & Methodology Settings
  const systemSettings: NavItem[] = [
    { id: "settings", label: "Engine Settings", icon: <Settings className="w-4 h-4 flex-shrink-0 text-[#626260]" /> },
    { id: "help_docs", label: "Methodology & Docs", icon: <HelpCircle className="w-4 h-4 flex-shrink-0 text-[#626260]" /> },
  ];

  const handleMouseEnter = () => { if (!isPinned && !isHidden) setOpen(true); };
  const handleMouseLeave = () => { if (!isPinned && !isHidden) setOpen(false); };

  if (isHidden) {
    return (
      <button
        onClick={() => { setIsHidden(false); setOpen(true); setIsPinned(true); }}
        title="Show Navigation Bar"
        className="fixed top-3.5 left-4 z-50 p-2 rounded-xl bg-white/90 backdrop-blur-md text-[#111111] hover:bg-white shadow-md transition-all active:scale-95 flex items-center gap-2 border border-slate-200"
      >
        <div className="bg-[#111111] p-1.5 rounded-lg text-white"><Activity className="w-3.5 h-3.5" /></div>
        <span className="text-xs font-semibold tracking-tight">Fin.D</span>
        <PanelLeftOpen className="w-3.5 h-3.5 text-blue-600 ml-0.5" />
      </button>
    );
  }

  const renderSection = (title: string, items: NavItem[]) => (
    <div>
      <motion.div
        animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0, marginBottom: open ? 6 : 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="px-2 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-wider overflow-hidden whitespace-nowrap font-mono"
      >
        {title}
      </motion.div>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "asset_profiler" && onOpenAddStock) onOpenAddStock();
                else onTabChange(item.id);
              }}
              className={`w-full flex items-center justify-start gap-3 py-2.5 px-3 rounded-2xl text-xs relative transition-all duration-150 cursor-pointer ${
                isActive
                  ? "clay-button-primary text-white font-black shadow-md scale-[1.02]"
                  : "clay-surface text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:translate-x-1"
              }`}
            >
              <div className="flex-shrink-0 flex items-center justify-center w-5 h-5">{item.icon}</div>
              <motion.div
                animate={{ opacity: open ? 1 : 0, width: open ? "auto" : 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex items-center justify-between whitespace-nowrap overflow-hidden"
              >
                <span className="truncate font-bold">{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ml-2 ${
                    isActive ? "bg-white/20 text-white" : "clay-badge text-[var(--accent-primary)]"
                  }`}>{item.badge}</span>
                )}
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <motion.aside
      className="h-screen sticky top-0 px-3 py-4 hidden md:flex md:flex-col justify-between clay-surface border-r border-[var(--clay-border)] flex-shrink-0 z-30 shadow-xl overflow-x-hidden select-none"
      animate={{ width: open ? "260px" : "72px" }}
      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden space-y-4 pr-0.5">
        {/* Header Brand */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--clay-border)] mb-1 min-h-[44px]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              onClick={() => { if (isPinned) { setIsPinned(false); setOpen(false); } else { setIsPinned(true); setOpen(true); } }}
              title={isPinned ? "Click to switch to hover rail mode" : "Click to pin open"}
              className="clay-inset p-2 rounded-xl text-[var(--accent-primary)] cursor-pointer hover:scale-105 transition-transform flex-shrink-0 flex items-center justify-center w-8 h-8 font-black"
            >
              <Activity className="w-4 h-4 text-[var(--accent-primary)]" />
            </div>
            <motion.div
              animate={{ opacity: open ? 1 : 0, width: open ? "auto" : 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col whitespace-nowrap overflow-hidden"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[var(--text-primary)] font-black text-sm tracking-tight font-sans">Fin.D</span>
                <span className="text-[9px] clay-badge text-[var(--accent-primary)] font-bold px-1.5 py-0.5 rounded-full tracking-wide font-mono">LIVE</span>
              </div>
              <span className="text-[10px] text-[var(--text-secondary)] leading-tight font-medium">Market Transmission Suite</span>
            </motion.div>
          </div>

          <motion.div
            animate={{ opacity: open ? 1 : 0, width: open ? "auto" : 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-1 whitespace-nowrap overflow-hidden flex-shrink-0"
          >
            <button
              onClick={() => { const n = !isPinned; setIsPinned(n); if (!n) setOpen(false); }}
              title={isPinned ? "Unpin (Auto-expand on hover)" : "Pin Open"}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${isPinned ? 'text-[#111111] bg-black/5 hover:bg-black/10' : 'text-[#7b7b78] hover:text-[#111111] hover:bg-black/5'}`}
            >
              {isPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
            </button>
            <button onClick={() => setIsHidden(true)} title="Hide Sidebar completely" className="p-1.5 rounded-md text-[#7b7b78] hover:text-rose-600 hover:bg-black/5 transition-colors cursor-pointer">
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>

        {!open && (
          <div className="flex flex-col items-center mb-1">
            <button onClick={() => { setIsPinned(true); setOpen(true); }} title="Pin Sidebar Open" className="p-1.5 rounded-md text-[#7b7b78] hover:text-[#111111] hover:bg-black/5 transition-colors cursor-pointer">
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="space-y-4">
          {renderSection("Transmission Engine", transmissionModules)}
          {renderSection("Forensics & Analytics", forensicTools)}
          {renderSection("System & Verification", systemSettings)}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#d3cec6]/60 overflow-hidden">
        <div className="relative min-h-[36px] flex items-center">
          <motion.div
            animate={{ opacity: open ? 1 : 0, width: open ? "100%" : 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-1 text-[10px] text-[#626260] whitespace-nowrap overflow-hidden"
          >
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /><span className="truncate">Autonomous Causal Graph Active</span></div>
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" /><span className="truncate">Multi-Tier Transmission Sync</span></div>
            <div className="flex items-center justify-between text-[#7b7b78] pt-1 border-t border-[#d3cec6]/40 mt-1 font-mono text-[9px]">
              <span>CFTT-MG</span><span>v1.2.0 • Fin.D</span>
            </div>
          </motion.div>
          <motion.div
            animate={{ opacity: open ? 0 : 1, scale: open ? 0.6 : 1 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full flex justify-center py-1 absolute inset-0 pointer-events-none ${open ? 'hidden' : 'flex'}`}
            title="Causal Graph Active • Fin.D"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
};
