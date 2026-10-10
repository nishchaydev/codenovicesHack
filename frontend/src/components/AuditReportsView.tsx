import React, { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  Download,
  RefreshCw,
  FileText,
  Cpu,
  Eye,
  Copy,
  Check,
  ShieldCheck,
  BarChart3,
  Database,
  Timer,
  ChevronDown,
  X,
  Network,
} from "lucide-react";

export type AuditStatus = "Completed" | "Processing" | "Failed";

export interface AuditLogEntry {
  id: string;
  traceId: string;
  timestamp: string;
  eventAnalyzed: string;
  category: "Commodities" | "Semiconductors" | "Monetary Policy" | "Geopolitics" | "Macroeconomic" | "Currency & FX" | "Sovereign Debt";
  entitiesExtracted: number;
  pathwaysTraced: number;
  confidenceScore: number; // percentage (e.g., 94)
  status: AuditStatus;
  modelUsed: string;
  latencySeconds: number;
  tokensConsumed: number;
  graphHops: number;
  triggerSource: "Autonomous Feed" | "User Query" | "Market Anomaly Trigger" | "Scheduled Batch";
  entitiesSample: string[];
  primaryTransmissionVector: string;
  validationCheck: "Passed (p < 0.01)" | "Passed (p < 0.05)" | "In-Flight" | "Failed Validation Gate";
}

const AUDIT_ENTRIES: AuditLogEntry[] = [
  {
    id: "AUD-9481",
    traceId: "tr-9481-brent-shock",
    timestamp: "2024-03-26 14:32:18",
    eventAnalyzed: "Brent Crude Oil Supply Shock (+12.4%)",
    category: "Commodities",
    entitiesExtracted: 14,
    pathwaysTraced: 9,
    confidenceScore: 94,
    status: "Completed",
    modelUsed: "GPT-4o + Knowledge Graph",
    latencySeconds: 1.82,
    tokensConsumed: 4180,
    graphHops: 3,
    triggerSource: "Market Anomaly Trigger",
    entitiesSample: ["Brent Crude", "Asian Paints", "Berger Paints", "IndiGo Airlines", "Reliance Industries"],
    primaryTransmissionVector: "Crude -> Petrochemical Solvents -> Paint Gross Margins (-160 bps)",
    validationCheck: "Passed (p < 0.01)",
  },
  {
    id: "AUD-9480",
    traceId: "tr-9480-tsmc-outage",
    timestamp: "2024-03-26 13:15:42",
    eventAnalyzed: "TSMC Fab 18 Sub-5nm Wafer Outage",
    category: "Semiconductors",
    entitiesExtracted: 18,
    pathwaysTraced: 12,
    confidenceScore: 96,
    status: "Completed",
    modelUsed: "GPT-4o + Neo4j Graph RAG",
    latencySeconds: 2.35,
    tokensConsumed: 5820,
    graphHops: 4,
    triggerSource: "Autonomous Feed",
    entitiesSample: ["TSMC Fab 18", "NVIDIA Corp", "Tata Motors CV", "Apple Inc", "Qualcomm"],
    primaryTransmissionVector: "Foundry Outage -> Auto ECU Allocation Quotas -> Tier-1 Assembly Delay",
    validationCheck: "Passed (p < 0.01)",
  },
  {
    id: "AUD-9479",
    traceId: "tr-9479-rbi-repo-hike",
    timestamp: "2024-03-26 11:48:09",
    eventAnalyzed: "RBI Unscheduled 25 bps Repo Rate Hike",
    category: "Monetary Policy",
    entitiesExtracted: 11,
    pathwaysTraced: 8,
    confidenceScore: 91,
    status: "Completed",
    modelUsed: "Fin-Llama-3-70B + Graph Neural Net",
    latencySeconds: 2.10,
    tokensConsumed: 4690,
    graphHops: 3,
    triggerSource: "User Query",
    entitiesSample: ["RBI Policy Rate", "HDFC Bank", "Bajaj Finance", "DLF Real Estate", "Tata Motors"],
    primaryTransmissionVector: "Repo Rate (+25 bps) -> NBFC Cost of Funds -> Commercial Fleet Financing",
    validationCheck: "Passed (p < 0.01)",
  },
  {
    id: "AUD-9478",
    traceId: "tr-9478-redsea-blockade",
    timestamp: "2024-03-26 10:22:55",
    eventAnalyzed: "Red Sea Bab-el-Mandeb Maritime Blockade",
    category: "Geopolitics",
    entitiesExtracted: 15,
    pathwaysTraced: 11,
    confidenceScore: 88,
    status: "Completed",
    modelUsed: "GPT-4o + Knowledge Graph",
    latencySeconds: 2.84,
    tokensConsumed: 6140,
    graphHops: 4,
    triggerSource: "Autonomous Feed",
    entitiesSample: ["Bab-el-Mandeb Strait", "Maersk", "Adani Ports", "Tata Steel", "European Chemicals"],
    primaryTransmissionVector: "Cape Route (+14 Days) -> Container Freight (+140%) -> Import Lead Inflation",
    validationCheck: "Passed (p < 0.05)",
  },
  {
    id: "AUD-9477",
    traceId: "tr-9477-us-cpi-overshoot",
    timestamp: "2024-03-26 09:14:30",
    eventAnalyzed: "US Core CPI YoY 3.8% Overshoot Shock",
    category: "Macroeconomic",
    entitiesExtracted: 12,
    pathwaysTraced: 7,
    confidenceScore: 86,
    status: "Completed",
    modelUsed: "GPT-4o + Knowledge Graph",
    latencySeconds: 1.98,
    tokensConsumed: 3950,
    graphHops: 3,
    triggerSource: "Scheduled Batch",
    entitiesSample: ["US 10Y Yield", "USD/INR", "TCS", "Infosys", "Nifty 50 Index"],
    primaryTransmissionVector: "Fed Higher-For-Longer -> US 10Y Yield Spike -> FII Capital Outflow -> INR Drag",
    validationCheck: "Passed (p < 0.05)",
  },
  {
    id: "AUD-9476",
    traceId: "tr-9476-lithium-plunge",
    timestamp: "2024-03-26 08:45:12",
    eventAnalyzed: "Lithium Hydroxide Spot Benchmark -18% Plunge",
    category: "Commodities",
    entitiesExtracted: 8,
    pathwaysTraced: 5,
    confidenceScore: 78,
    status: "Processing",
    modelUsed: "Fin-Llama-3-70B + Vector Index",
    latencySeconds: 4.12,
    tokensConsumed: 2410,
    graphHops: 2,
    triggerSource: "Market Anomaly Trigger",
    entitiesSample: ["Lithium Carbonate", "Tata Motors EV", "Exide Industries", "CATL", "Tesla Inc"],
    primaryTransmissionVector: "Lithium Glut -> Battery Cell Cost Deflation -> EV Gross Margin Expansion",
    validationCheck: "In-Flight",
  },
  {
    id: "AUD-9475",
    traceId: "tr-9475-boj-carry-trade",
    timestamp: "2024-03-25 18:02:44",
    eventAnalyzed: "BOJ Rate Hike & JPY Carry Trade Unwind",
    category: "Currency & FX",
    entitiesExtracted: 16,
    pathwaysTraced: 10,
    confidenceScore: 93,
    status: "Completed",
    modelUsed: "Claude 3.5 Sonnet + Graph RAG",
    latencySeconds: 2.65,
    tokensConsumed: 5320,
    graphHops: 4,
    triggerSource: "Autonomous Feed",
    entitiesSample: ["USD/JPY", "Nikkei 225", "US Treasuries", "Global Tech Equities", "Emerging Market FX"],
    primaryTransmissionVector: "Yen Rebound -> Carry Deleveraging -> High-Beta Tech Cross-Asset Liquidation",
    validationCheck: "Passed (p < 0.01)",
  },
  {
    id: "AUD-9474",
    traceId: "tr-9474-gcc-debt-downgrade",
    timestamp: "2024-03-25 16:30:11",
    eventAnalyzed: "Gulf Cooperation Council Sovereign Debt Rumor",
    category: "Sovereign Debt",
    entitiesExtracted: 6,
    pathwaysTraced: 2,
    confidenceScore: 48,
    status: "Failed",
    modelUsed: "Fin-BERT + Rule Engine",
    latencySeconds: 0.85,
    tokensConsumed: 940,
    graphHops: 1,
    triggerSource: "Autonomous Feed",
    entitiesSample: ["GCC Sovereign Bonds", "Brent Crude", "MENA Banks"],
    primaryTransmissionVector: "Source Discredited: Causal regression failed empirical threshold (p > 0.05)",
    validationCheck: "Failed Validation Gate",
  },
];

export const AuditReportsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"All" | AuditStatus>("All");
  const [selectedModel, setSelectedModel] = useState<string>("All Models");
  const [sortBy, setSortBy] = useState<"timestamp" | "confidence" | "entities" | "pathways">("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [activeEntry, setActiveEntry] = useState<AuditLogEntry | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Model unique options
  const modelOptions = useMemo(() => {
    const set = new Set<string>();
    AUDIT_ENTRIES.forEach((e) => set.add(e.modelUsed));
    return ["All Models", ...Array.from(set)];
  }, []);

  // Filtered and sorted entries
  const filteredEntries = useMemo(() => {
    return AUDIT_ENTRIES.filter((entry) => {
      // Search matches
      const matchesSearch =
        searchQuery.trim() === "" ||
        entry.eventAnalyzed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.modelUsed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.entitiesSample.some((entity) =>
          entity.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Status matches
      const matchesStatus =
        selectedStatus === "All" || entry.status === selectedStatus;

      // Model matches
      const matchesModel =
        selectedModel === "All Models" || entry.modelUsed === selectedModel;

      return matchesSearch && matchesStatus && matchesModel;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === "timestamp") {
        comparison = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortBy === "confidence") {
        comparison = b.confidenceScore - a.confidenceScore;
      } else if (sortBy === "entities") {
        comparison = b.entitiesExtracted - a.entitiesExtracted;
      } else if (sortBy === "pathways") {
        comparison = b.pathwaysTraced - a.pathwaysTraced;
      }
      return sortDirection === "desc" ? comparison : -comparison;
    });
  }, [searchQuery, selectedStatus, selectedModel, sortBy, sortDirection]);

  const handleCopyJson = (entry: AuditLogEntry) => {
    const payload = JSON.stringify(entry, null, 2);
    navigator.clipboard.writeText(payload);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = "ID,Timestamp,Event Analyzed,Entities Extracted,Pathways Traced,Confidence Score,Status,Model Used,Latency\n";
      const rows = filteredEntries
        .map(
          (e) =>
            `"${e.id}","${e.timestamp}","${e.eventAnalyzed}",${e.entitiesExtracted},${e.pathwaysTraced},"${e.confidenceScore}%","${e.status}","${e.modelUsed}","${e.latencySeconds}s"`
        )
        .join("\n");
      const blob = new Blob([headers + rows], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `find-audit-reports-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsExporting(false);
    }, 600);
  };

  const getStatusBadge = (status: AuditStatus) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Completed
          </span>
        );
      case "Processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
            <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
            Processing
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-slate-50/70 p-6 md:p-8 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-blue-100/70 text-blue-700 text-[11px] font-bold font-mono tracking-wider uppercase">
                Fin.D System Telemetry
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Audit Log Engine v2.4
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Audit Reports & Forensic Analysis Log
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Immutable ledger of macroeconomic shocks, entity extractions, and causal transmission pathways synthesized by Fin.D.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
            </button>
            <div className="px-3.5 py-2 rounded-xl text-xs font-medium bg-emerald-50/80 border border-emerald-200/70 text-emerald-700 flex items-center gap-1.5 shadow-2xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SHA-256 Verifiable</span>
            </div>
          </div>
        </div>

        {/* 1. Summary Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Analyses */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                Total Analyses
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                  47
                </span>
                <span className="text-xs font-medium text-emerald-600 flex items-center font-mono">
                  +12 today
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Across 18 market sectors & indexes
              </p>
            </div>
          </div>

          {/* Card 2: Avg Confidence */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                Avg Confidence
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                  84.2%
                </span>
                <span className="text-xs font-medium text-slate-500 font-mono">
                  ± 2.4% σ
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Multivariate regression & RAG consensus
              </p>
            </div>
          </div>

          {/* Card 3: Avg Entities per Analysis */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                Avg Entities / Analysis
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                  9.3
                </span>
                <span className="text-xs font-medium text-indigo-600 font-mono">
                  nodes / run
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                From 4,820 indexed global tickers & macro nodes
              </p>
            </div>
          </div>

          {/* Card 4: Avg Processing Time */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                Avg Processing Time
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Timer className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                  2.4s
                </span>
                <span className="text-xs font-medium text-slate-500 font-mono">
                  P95: 3.1s
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Sub-3s multi-hop graph vector search
              </p>
            </div>
          </div>
        </div>

        {/* 2. Search, Filters, and Controls Toolbar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by event, ticker, model, ID (e.g., Oil shock, TSMC, GPT-4o)..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter Buttons */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs">
                {(["All", "Completed", "Processing", "Failed"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                      selectedStatus === status
                        ? "bg-white text-slate-900 shadow-2xs font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Model Dropdown */}
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  {modelOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none pl-3 pr-8 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="timestamp">Sort: Timestamp</option>
                  <option value="confidence">Sort: Confidence</option>
                  <option value="entities">Sort: Entities Extracted</option>
                  <option value="pathways">Sort: Pathways Traced</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort Direction Toggle */}
              <button
                onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
                title={`Sort ${sortDirection === "desc" ? "Descending" : "Ascending"}`}
                className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Filter Indicators */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">
                Showing {filteredEntries.length} of {AUDIT_ENTRIES.length} entries
              </span>
              {(searchQuery || selectedStatus !== "All" || selectedModel !== "All Models") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStatus("All");
                    setSelectedModel("All Models");
                  }}
                  className="text-[11px] text-blue-600 hover:underline font-medium cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span>Sync status: In Sync</span>
              <span>•</span>
              <span>Audit retention: 90 Days</span>
            </div>
          </div>
        </div>

        {/* 3. The Audit Entries Table */}
        <div className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-mono text-[11px] uppercase tracking-wider select-none">
                  <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                  <th className="py-3.5 px-4 font-semibold">Event Analyzed</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Entities</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Pathways</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Confidence</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Model Used</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="w-8 h-8 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-700">No audit logs match criteria</p>
                        <p className="text-xs text-slate-400">Try modifying your search or clearing status filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      onClick={() => setActiveEntry(entry)}
                      className={`group hover:bg-blue-50/40 transition-colors cursor-pointer ${
                        activeEntry?.id === entry.id ? "bg-blue-50/60" : ""
                      }`}
                    >
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-slate-700 font-medium">
                          {entry.timestamp}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>{entry.id}</span>
                          <span>•</span>
                          <span>{entry.latencySeconds}s</span>
                        </div>
                      </td>

                      {/* Event Analyzed */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                            {entry.eventAnalyzed}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                            {entry.category}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[200px]" title={entry.primaryTransmissionVector}>
                            {entry.primaryTransmissionVector}
                          </span>
                        </div>
                      </td>

                      {/* Entities Extracted */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60 font-mono font-bold text-slate-800 text-xs">
                          <Database className="w-3 h-3 text-slate-400" />
                          <span>{entry.entitiesExtracted}</span>
                        </div>
                      </td>

                      {/* Pathways Traced */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50/70 border border-indigo-200/50 font-mono font-bold text-indigo-700 text-xs">
                          <Network className="w-3 h-3 text-indigo-500" />
                          <span>{entry.pathwaysTraced}</span>
                        </div>
                      </td>

                      {/* Confidence Score */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="inline-flex flex-col items-center">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-mono font-bold text-xs ${
                                entry.confidenceScore >= 90
                                  ? "text-emerald-700"
                                  : entry.confidenceScore >= 75
                                  ? "text-blue-700"
                                  : "text-amber-700"
                              }`}
                            >
                              {entry.confidenceScore}%
                            </span>
                          </div>
                          {/* Mini Progress Bar */}
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1 border border-slate-200/50">
                            <div
                              className={`h-full rounded-full ${
                                entry.confidenceScore >= 90
                                  ? "bg-emerald-500"
                                  : entry.confidenceScore >= 75
                                  ? "bg-blue-500"
                                  : "bg-amber-500"
                              }`}
                              style={{ width: `${entry.confidenceScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {getStatusBadge(entry.status)}
                      </td>

                      {/* Model Used */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/80 font-medium text-[11px]">
                          <Cpu className="w-3 h-3 text-slate-500" />
                          <span>{entry.modelUsed}</span>
                        </div>
                      </td>

                      {/* Inspect Detail Button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveEntry(entry);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Meta Bar */}
          <div className="p-4 bg-slate-50/60 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Real-Time Audit Ledger Stream Active</span>
            </div>
            <div>
              <span>Latency target: &lt; 3,000ms</span>
              <span className="mx-2">•</span>
              <span>All records cryptographically signed</span>
            </div>
          </div>
        </div>

        {/* 4. Detail Modal for Deep Inspection */}
        {activeEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {activeEntry.id}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-mono text-slate-500">
                        {activeEntry.timestamp}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {activeEntry.eventAnalyzed}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setActiveEntry(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs">
                {/* Status and Telemetry Pill Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                      Status
                    </span>
                    <div className="mt-1">{getStatusBadge(activeEntry.status)}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                      Confidence
                    </span>
                    <span className="text-sm font-bold font-mono text-slate-900 mt-1 block">
                      {activeEntry.confidenceScore}%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                      Latency
                    </span>
                    <span className="text-sm font-bold font-mono text-slate-900 mt-1 block">
                      {activeEntry.latencySeconds}s
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                      Tokens Consumed
                    </span>
                    <span className="text-sm font-bold font-mono text-slate-900 mt-1 block">
                      {activeEntry.tokensConsumed.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Primary Transmission Vector */}
                <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-100 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-blue-700 block">
                    Synthesized Causal Transmission Vector
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {activeEntry.primaryTransmissionVector}
                  </p>
                </div>

                {/* Entities Extracted Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Extracted Equities & Macro Nodes ({activeEntry.entitiesExtracted})
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Graph Depth: {activeEntry.graphHops} Hops
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeEntry.entitiesSample.map((entity, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[11px] font-medium"
                      >
                        {entity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Algorithmic Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-mono">Architecture & Model:</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {activeEntry.modelUsed}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Ingestion Trigger:</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {activeEntry.triggerSource}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">Validation Hypothesis Gate:</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {activeEntry.validationCheck}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono">System Trace Identifier:</span>
                    <span className="font-mono text-slate-600 mt-0.5 block truncate">
                      {activeEntry.traceId}
                    </span>
                  </div>
                </div>

                {/* Raw JSON Audit Payload */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                      Raw JSON Telemetry
                    </span>
                    <button
                      onClick={() => handleCopyJson(activeEntry)}
                      className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Payload</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-40 leading-relaxed border border-slate-800">
                    {JSON.stringify(activeEntry, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-[11px] text-slate-400 font-mono">
                  Audit Entry ID: {activeEntry.id}
                </span>
                <button
                  onClick={() => setActiveEntry(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
