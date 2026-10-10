import React from "react";
import { GraphNode } from "../types";
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
        return "bg-[#141414] text-white";
      case "Energy":
        return "bg-[#f3f3f3] text-[#141414]";
      case "Financials":
        return "bg-[#f3f3f3] text-[#141414]";
      case "Precious Metals":
        return "bg-[#f3f3f3] text-[#141414]";
      default:
        return "bg-[#f0f0f0] text-[#262626]";
    }
  };

  return (
    <div className="w-full bg-[#ffffff] border-b border-[#e0e0e0] px-4 py-2 flex items-center gap-2.5 overflow-x-auto select-none">
      <div className="flex items-center gap-1.5 text-xs text-[#707070] font-medium whitespace-nowrap pr-2 border-r border-[#e0e0e0]">
        <Layers className="w-3.5 h-3.5 text-[#141414]" />
        <span>Select App:</span>
      </div>

      {/* "All Apps" pill button */}
      <button
        onClick={() => onSelectApp(null)}
        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
          selectedAppId === null
            ? "bg-[#141414] text-white border-[#141414] font-medium"
            : "bg-[#f3f3f3] text-[#141414] border-[#e0e0e0] hover:bg-[#e0e0e0]"
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
                  ? "bg-[#ffffff] border-[#0066ff] ring-2 ring-[#0066ff]/20 text-[#141414] font-semibold"
                  : "bg-[#ffffff] border-[#e0e0e0] hover:border-[#adadad] text-[#262626]"
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
                <span className="text-[10px] font-mono text-[#707070]">
                  {app.ticker}
                </span>
              )}

              {app.risk_score > 0 && (
                <span className="text-[10px] font-mono font-bold text-[#ef4444] bg-[#f3f3f3] px-1 rounded-full">
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
