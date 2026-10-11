import React from "react";
import { GraphNode } from "@/types/fingraph/types";
import { Grid, Sparkles, Building2, Cpu, Fuel, Layers } from "lucide-react";

interface AppSelectorBarProps {
  nodes: GraphNode[];
  selectedAppId: string | null;
  onSelectApp: (appId: string | null) => void;
}

export const AppSelectorBar: React.FC<AppSelectorBarProps> = ({
  nodes,
  selectedAppId,
  onSelectApp,
}) => {
  // Curate top systemically important companies / assets
  const keyApps = React.useMemo(() => {
    return nodes.filter(
      (n) => n.type === "Company" || n.type === "Commodity" || n.type === "Sector"
    );
  }, [nodes]);

  const getAppInitials = (name: string, ticker?: string) => {
    if (ticker && ticker.length <= 4) return ticker.slice(0, 2);
    const parts = name.split(" ");
    if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const getCategoryColor = (group: string) => {
    switch (group) {
      case "Semiconductors":
      case "Technology":
        return "clay-button-primary text-white";
      case "Energy":
        return "clay-inset text-[var(--text-primary)]";
      case "Financials":
        return "clay-inset text-[var(--text-primary)]";
      case "Precious Metals":
        return "clay-inset text-[var(--text-primary)]";
      default:
        return "clay-inset text-[var(--text-primary)]";
    }
  };

  return (
    <div className="w-full clay-surface border-b border-[var(--clay-border)] px-4 py-2 flex items-center gap-2.5 overflow-x-auto select-none">
      <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium whitespace-nowrap pr-2 border-r border-[var(--clay-border)]">
        <Layers className="w-3.5 h-3.5 text-[var(--text-primary)]" />
        <span>Select App:</span>
      </div>

      {/* "All Apps" pill button */}
      <button
        onClick={() => onSelectApp(null)}
        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
          selectedAppId === null
            ? "clay-button-primary text-white border-[#141414] font-medium"
            : "clay-inset text-[var(--text-primary)] border-[var(--clay-border)] hover:bg-[#e0e0e0]"
        }`}
      >
        <Grid className="w-3 h-3" />
        <span>All Markets (Global Graph)</span>
      </button>

      {/* App pills with 30% squircle icons */}
      <div className="flex items-center gap-2 flex-nowrap">
        {keyApps.map((app) => {
          const isSelected = app.id === selectedAppId;
          const initials = getAppInitials(app.name, app.ticker);

          return (
            <button
              key={app.id}
              onClick={() => onSelectApp(isSelected ? null : app.id)}
              className={`flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? "clay-surface border-[#0066ff] ring-2 ring-[#0066ff]/20 text-[var(--text-primary)] font-semibold"
                  : "clay-surface border-[var(--clay-border)] hover:border-[#adadad] text-[var(--text-primary)]"
              }`}
            >
              {/* iOS-style 30% squircle icon tile */}
              <div
                className={`w-5 h-5 rounded-[6px] flex items-center justify-center font-bold text-[9px] font-mono tracking-tighter ${getCategoryColor(
                  app.group
                )}`}
              >
                {initials}
              </div>

              <span>{app.name}</span>

              {app.ticker && (
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                  {app.ticker}
                </span>
              )}

              {app.risk_score > 0 && (
                <span className="text-[10px] font-mono font-bold text-[#ef4444] clay-inset px-1 rounded-full">
                  ⚡{app.risk_score}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

