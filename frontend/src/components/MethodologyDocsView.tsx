import React, { useState, useMemo } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Cpu,
  FileText,
  Share2,
  GitBranch,
  ShieldCheck,
  Layers,
  Sparkles,
  Search,
  Check,
  Copy,
  Terminal,
  Zap,
  ArrowRight,
  Database,
  ExternalLink,
  Code2,
  CheckCircle2,
  AlertCircle,
  Network,
  TrendingDown,
  Scale,
  Sliders,
  Filter,
} from "lucide-react";

interface AccordionSection {
  id: string;
  number: string;
  title: string;
  badge: string;
  badgeColor: string;
  summary: string;
  icon: React.ReactNode;
}

export const MethodologyDocsView: React.FC = () => {
  // Accordion open/close state: all open by default for comprehensive reading, or user can toggle
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "how-it-works": true,
    "nlp-pipeline": true,
    "knowledge-graph": true,
    "propagation-algo": true,
    "evidence-scoring": true,
    "tech-stack": true,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Interactive demo states inside accordions
  const [selectedDemoEventIndex, setSelectedDemoEventIndex] = useState(0);
  const [simulationDecayFactor, setSimulationDecayFactor] = useState(0.75);
  const [simulationBaseSeverity, setSimulationBaseSeverity] = useState(0.85);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    setOpenSections({
      "how-it-works": true,
      "nlp-pipeline": true,
      "knowledge-graph": true,
      "propagation-algo": true,
      "evidence-scoring": true,
      "tech-stack": true,
    });
  };

  const handleCollapseAll = () => {
    setOpenSections({
      "how-it-works": false,
      "nlp-pipeline": false,
      "knowledge-graph": false,
      "propagation-algo": false,
      "evidence-scoring": false,
      "tech-stack": false,
    });
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedSnippet(label);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  // Sample events for interactive NLP pipeline demo
  const sampleEvents = [
    {
      headline: "Brent Crude surges +7.8% after Strait of Hormuz maritime disruption",
      category: "Commodity Shock",
      categoryColor: "text-amber-700 bg-amber-50 border-amber-200",
      severity: 0.88,
      severityLabel: "Critical Shock",
      polarity: "Negative (-)",
      entities: [
        { name: "Brent Crude", type: "Commodity", role: "Epicenter Shock" },
        { name: "Aviation Turbine Fuel", type: "Input Product", role: "1st Hop Direct Feedstock" },
        { name: "Asian Paints", type: "Public Equity", role: "Raw Material Squeeze" },
        { name: "InterGlobe Aviation", type: "Public Equity", role: "Margin Compression" },
        { name: "USD/INR", type: "FX Indicator", role: "Import Bill Inflation" },
      ],
      nlpRationale:
        "High-severity geopolitical energy shock detected. Feedstock elasticity implies immediate downstream cost inflation for paints, petrochems, and civil aviation.",
    },
    {
      headline: "RBI unexpectedly increases Repo Rate by 25 bps to 6.75% citing core inflation",
      category: "Policy Change",
      categoryColor: "text-purple-700 bg-purple-50 border-purple-200",
      severity: 0.72,
      severityLabel: "High Policy Shift",
      polarity: "Mixed / Contractionary",
      entities: [
        { name: "RBI Repo Rate", type: "Policy Benchmark", role: "Epicenter Catalyst" },
        { name: "NBFC Borrowing Cost", type: "Credit Variable", role: "Wholesale Spread Expansion" },
        { name: "Commercial Vehicle Finance", type: "Credit Segment", role: "Fleet Demand Dampening" },
        { name: "Tata Motors (CV)", type: "Public Equity", role: "Order Deferral Sensitivity" },
        { name: "HDFC Bank", type: "Public Equity", role: "Short-term NIM Expansion" },
      ],
      nlpRationale:
        "Hawkish central bank surprise. Increases marginal cost of lending for non-banking financiers while slowing capital capex cycles in rate-sensitive industrial sectors.",
    },
    {
      headline: "TSMC Fab 18 reports 3-week advanced packaging line halt following seismic event",
      category: "Supply Chain & Hardware",
      categoryColor: "text-blue-700 bg-blue-50 border-blue-200",
      severity: 0.94,
      severityLabel: "Systemic Contagion",
      polarity: "Severe Negative (-)",
      entities: [
        { name: "TSMC Fab 18", type: "Foundry Facility", role: "Physical Bottleneck" },
        { name: "CoWoS Packaging", type: "Component Tech", role: "Sub-5nm Allocation Deficit" },
        { name: "Nvidia Corp", type: "Semiconductor", role: "GPU Lead-Time Lag" },
        { name: "Automotive ECU Suppliers", type: "Tier-1 Auto", role: "Assembly Buffer Depletion" },
        { name: "Tata Elxsi", type: "Engineering R&D", role: "Platform Release Delay" },
      ],
      nlpRationale:
        "Single-source semiconductor foundry bottleneck. Disruption radiates across high-performance compute and tier-1 automotive embedded electronic controllers.",
    },
  ];

  // Calculated values for propagation algorithm visualizer
  const hop1Impact = simulationBaseSeverity * (0.9 * simulationDecayFactor);
  const hop2Impact = hop1Impact * (0.85 * simulationDecayFactor);
  const hop3Impact = hop2Impact * (0.75 * simulationDecayFactor);

  const sectionsList: AccordionSection[] = [
    {
      id: "how-it-works",
      number: "01",
      title: "How Fin.D Works",
      badge: "Core Architecture",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      summary:
        "Fin.D ingests unstructured financial events, extracts entities (companies, commodities, indicators), builds a knowledge graph, and traces multi-hop transmission paths to show how one event cascades across markets.",
      icon: <Cpu className="w-5 h-5 text-blue-600" />,
    },
    {
      id: "nlp-pipeline",
      number: "02",
      title: "Event Detection & NLP Pipeline",
      badge: "Entity Ingestion",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      summary:
        "Uses NLP to detect financial events from news, extract named entities, classify event types (commodity shock, policy change, earnings), and score severity.",
      icon: <FileText className="w-5 h-5 text-purple-600" />,
    },
    {
      id: "knowledge-graph",
      number: "03",
      title: "Knowledge Graph Construction",
      badge: "Relational Topology",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      summary:
        "Entities are connected via weighted edges representing causal/correlational relationships. Edge weights are derived from historical co-movement, supply chain data, and sector classification.",
      icon: <Share2 className="w-5 h-5 text-emerald-600" />,
    },
    {
      id: "propagation-algo",
      number: "04",
      title: "Propagation Algorithm",
      badge: "BFS Multi-Hop Decay",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      summary:
        "BFS-based multi-hop traversal with exponential decay. Each hop reduces transmission strength by a decay factor. Paths are ranked by cumulative impact score.",
      icon: <GitBranch className="w-5 h-5 text-amber-600" />,
    },
    {
      id: "evidence-scoring",
      number: "05",
      title: "Evidence & Confidence Scoring",
      badge: "Confidence Triangulation",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      summary:
        "Each connection is scored based on historical data availability, academic citations, regulatory filings, and LLM reasoning confidence.",
      icon: <ShieldCheck className="w-5 h-5 text-rose-600" />,
    },
    {
      id: "tech-stack",
      number: "06",
      title: "Technical Stack",
      badge: "Production Stack",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
      summary:
        "React + TypeScript frontend, FastAPI + Python backend, Neo4j knowledge graph, GPT-4o for reasoning, yfinance for market data.",
      icon: <Layers className="w-5 h-5 text-slate-700" />,
    },
  ];

  // Search filtering
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sectionsList;
    const q = searchQuery.toLowerCase();
    return sectionsList.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.number.includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto py-3 px-1 sm:px-2 text-slate-800">
      {/* 1. Header Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white border border-slate-800 shadow-lg">
        {/* Decorative background grid and glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-semibold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                Fin.D Methodology White Paper
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-mono">
                v2.4 Production Spec
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Causal Knowledge Graph & Transmission Methodology
            </h1>

            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Autonomous macroeconomic event ingestion, multi-relational property graph modeling,
              and exponential decay multi-hop shock propagation for systemic financial contagion analysis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto flex-shrink-0">
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 px-4 py-2.5 rounded-2xl flex items-center gap-3 text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Inference Latency</span>
                <span className="text-slate-200 font-bold">&lt; 180ms End-to-End</span>
              </div>
            </div>
            <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 px-4 py-2.5 rounded-2xl flex items-center gap-3 text-xs font-mono">
              <Network className="w-4 h-4 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Graph Scale</span>
                <span className="text-slate-200 font-bold">1,200+ Nodes • 8,400+ Edges</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Spec Metric Strips */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800/80 text-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-400 text-[11px]">Shock Traversal</span>
            <span className="text-slate-200 font-semibold font-mono">Breadth-First Search (BFS)</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-400 text-[11px]">Decay Attenuation (λ)</span>
            <span className="text-slate-200 font-semibold font-mono">0.65 – 0.85 per hop</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-400 text-[11px]">Max Transmission Depth</span>
            <span className="text-slate-200 font-semibold font-mono">4 Discrete Hops</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-400 text-[11px]">Reasoning Engine</span>
            <span className="text-slate-200 font-semibold font-mono">GPT-4o + Vector Embeddings</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation & Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        {/* Search filter */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search methodology, algorithms, formulas, or tech stack..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Accordion Expand / Collapse All Toggles */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleExpandAll}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Expand All
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            Collapse All
          </button>
        </div>
      </div>

      {/* 3. The 6 Accordion Sections */}
      <div className="flex flex-col gap-4">
        {filteredSections.map((section) => {
          const isOpen = !!openSections[section.id];

          return (
            <div
              key={section.id}
              id={section.id}
              className={`rounded-2xl transition-all duration-200 overflow-hidden border ${
                isOpen
                  ? "bg-white border-slate-300 shadow-sm"
                  : "bg-white/80 border-slate-200/90 hover:border-slate-300 hover:bg-white"
              }`}
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 text-left cursor-pointer select-none transition-colors"
                aria-expanded={isOpen}
              >
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  {/* Section index number pill */}
                  <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-700">
                    {section.number}
                  </span>

                  <div className="flex-shrink-0 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    {section.icon}
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        {section.title}
                      </h2>
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${section.badgeColor}`}
                      >
                        {section.badge}
                      </span>
                    </div>
                    {!isOpen && (
                      <p className="text-xs text-slate-500 line-clamp-1 pr-2">
                        {section.summary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2 pl-2 text-slate-400">
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                    {isOpen ? "Collapse" : "Read Section"}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border border-slate-200 bg-slate-50 text-slate-600 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-blue-50 text-blue-600 border-blue-200" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Accordion Body */}
              {isOpen && (
                <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-6">
                  {/* SECTION 1: HOW FIN.D WORKS */}
                  {section.id === "how-it-works" && (
                    <div className="space-y-6">
                      {/* Executive summary highlight */}
                      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-950 flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 font-mono">
                            Core Mission & Architectural Thesis
                          </h4>
                          <p className="text-sm leading-relaxed text-blue-900 font-medium">
                            Fin.D ingests unstructured financial events, extracts entities (companies, commodities, indicators),
                            builds a knowledge graph, and traces multi-hop transmission paths to show how one event cascades across markets.
                          </p>
                        </div>
                      </div>

                      <div className="prose prose-sm text-slate-600 max-w-none space-y-3">
                        <p className="text-sm leading-relaxed">
                          Traditional market intelligence terminals silo data into disconnected tables: equity quotes in one pane,
                          news alerts in another, and quarterly macroeconomic reports in PDFs. When a catalyst strikes—such as an
                          unexpected crude oil supply cut or an interest rate shock—analysts are forced to manually guess how
                          second-order and third-order impacts will reverberate down the supply chain.
                        </p>
                        <p className="text-sm leading-relaxed">
                          Fin.D transforms chaotic market inputs into a <strong>deterministic, multi-relational transmission network</strong>.
                          By mapping cross-asset dependencies, corporate revenue sensitivities, and macroeconomic elasticities into a continuous
                          graph, Fin.D tracks how localized disruptions radiate outward into industry margins, stock valuations, and sovereign benchmarks.
                        </p>
                      </div>

                      {/* 4-Step End-to-End Pipeline Visualization */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-3">
                          End-to-End Processing Architecture
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-blue-600 px-1.5 py-0.5 bg-blue-100 rounded">
                                  STAGE 1
                                </span>
                                <FileText className="w-4 h-4 text-slate-400" />
                              </div>
                              <h5 className="text-sm font-bold text-slate-900">Unstructured Ingestion</h5>
                              <p className="text-xs text-slate-600 leading-normal">
                                Real-time financial feeds, earnings releases, central bank speeches, and shipping manifests.
                              </p>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 border-t border-slate-200/80 pt-2">
                              Output: Raw Event Stream
                            </span>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-purple-600 px-1.5 py-0.5 bg-purple-100 rounded">
                                  STAGE 2
                                </span>
                                <Cpu className="w-4 h-4 text-slate-400" />
                              </div>
                              <h5 className="text-sm font-bold text-slate-900">Entity & NLP Extraction</h5>
                              <p className="text-xs text-slate-600 leading-normal">
                                GPT-4o few-shot extraction classifies event type, extracts entities, and scores severity (0.0 to 1.0).
                              </p>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 border-t border-slate-200/80 pt-2">
                              Output: Typed Event Payload
                            </span>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-emerald-600 px-1.5 py-0.5 bg-emerald-100 rounded">
                                  STAGE 3
                                </span>
                                <Share2 className="w-4 h-4 text-slate-400" />
                              </div>
                              <h5 className="text-sm font-bold text-slate-900">Graph Construction</h5>
                              <p className="text-xs text-slate-600 leading-normal">
                                Entities link via weighted edges derived from co-movement, supply chains, and input-output coefficients.
                              </p>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 border-t border-slate-200/80 pt-2">
                              Output: Neo4j Knowledge Graph
                            </span>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-amber-600 px-1.5 py-0.5 bg-amber-100 rounded">
                                  STAGE 4
                                </span>
                                <GitBranch className="w-4 h-4 text-slate-400" />
                              </div>
                              <h5 className="text-sm font-bold text-slate-900">Propagation & Scoring</h5>
                              <p className="text-xs text-slate-600 leading-normal">
                                BFS traversal computes multi-hop transmission curves with exponential decay, ranking impact pathways.
                              </p>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 border-t border-slate-200/80 pt-2">
                              Output: Cascade Impact Vector
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Real-World Cascade Example */}
                      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                            Real-World Transmission Blueprint
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">Oil Supply Shock Example</span>
                        </div>

                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 pt-1 text-xs font-mono">
                          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex-1">
                            <span className="text-[10px] text-amber-400 font-bold block mb-1">EPICENTER (Hop 0)</span>
                            <span className="font-bold text-white text-sm">Brent Crude Spikes +$15</span>
                            <p className="text-[11px] text-slate-300 mt-1 font-sans">Geopolitical maritime chokepoint restriction</p>
                          </div>

                          <ArrowRight className="w-4 h-4 text-slate-500 self-center hidden md:block" />

                          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex-1">
                            <span className="text-[10px] text-blue-400 font-bold block mb-1">1st HOP TRANSMISSION</span>
                            <span className="font-bold text-white text-sm">Petrochemical Solvents</span>
                            <p className="text-[11px] text-slate-300 mt-1 font-sans">Immediate feedstock cost surge (+11.4%)</p>
                          </div>

                          <ArrowRight className="w-4 h-4 text-slate-500 self-center hidden md:block" />

                          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex-1">
                            <span className="text-[10px] text-purple-400 font-bold block mb-1">2nd HOP TRANSMISSION</span>
                            <span className="font-bold text-white text-sm">Indian Paint Makers</span>
                            <p className="text-[11px] text-slate-300 mt-1 font-sans">Asian Paints & Berger gross margin -180 bps</p>
                          </div>

                          <ArrowRight className="w-4 h-4 text-slate-500 self-center hidden md:block" />

                          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex-1">
                            <span className="text-[10px] text-rose-400 font-bold block mb-1">3rd HOP TRANSMISSION</span>
                            <span className="font-bold text-white text-sm">End Consumer Durables</span>
                            <p className="text-[11px] text-slate-300 mt-1 font-sans">Housing repainting delayed; discretionary retail lag</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 2: EVENT DETECTION & NLP PIPELINE */}
                  {section.id === "nlp-pipeline" && (
                    <div className="space-y-6">
                      <div className="prose prose-sm text-slate-600 max-w-none space-y-3">
                        <p className="text-sm leading-relaxed">
                          Fin.D’s NLP pipeline continuously ingests unstructured financial texts from global news wires,
                          regulatory filings (SEBI, SEC, RBI), and corporate investor disclosures. It detects catalyst events,
                          extracts target entities, maps them against a canonical financial taxonomy, and quantifies event severity.
                        </p>
                      </div>

                      {/* 3 Extraction Columns */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 1. Entity Recognition */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                            NER
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">Named Entity Extraction</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Maps ambiguous text entities to canonical identifiers:
                          </p>
                          <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4 font-mono">
                            <li>Tickers: ASIANPAINT.NS, NVDA, TSM</li>
                            <li>Commodities: Brent, Gold, Lithium, Lithium Carbonate</li>
                            <li>Macro: RBI Repo Rate, US 10Y Yield, CPI</li>
                            <li>Currencies: USD/INR, DXY, EUR/USD</li>
                          </ul>
                        </div>

                        {/* 2. Event Classification */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                            CLS
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">Taxonomy Classification</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Classifies catalyst into discrete contagion archetypes:
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                              Commodity Shock
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-medium">
                              Policy Change
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                              Earnings & Capex
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
                              Supply Chain Bottleneck
                            </span>
                          </div>
                        </div>

                        {/* 3. Severity Scoring */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                            SEV
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">Severity Calibration (0.0 – 1.0)</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            Quantitative severity derived from three weighted factors:
                          </p>
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
                            <div>Severity = 0.45 · ΔMagnitude</div>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.35 · Centrality</div>
                            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.20 · Surprisal</div>
                          </div>
                        </div>
                      </div>

                      {/* Interactive NLP Parser Demo */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-emerald-400" />
                            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                              Live NLP Pipeline Parser Simulation
                            </h4>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            Select sample catalyst to inspect extracted entities
                          </span>
                        </div>

                        {/* Event selection pills */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {sampleEvents.map((ev, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedDemoEventIndex(idx)}
                              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                                selectedDemoEventIndex === idx
                                  ? "bg-slate-800 border-blue-500 shadow-xs"
                                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono font-bold text-slate-300">
                                  SAMPLE {idx + 1}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                  {ev.category}
                                </span>
                              </div>
                              <p className="text-xs text-slate-200 line-clamp-1 font-sans">{ev.headline}</p>
                            </button>
                          ))}
                        </div>

                        {/* Parsed Output Display Card */}
                        {(() => {
                          const activeEv = sampleEvents[selectedDemoEventIndex];
                          return (
                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-400">Class:</span>
                                  <span className="text-xs font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                                    {activeEv.category}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                  <span className="text-slate-400">Severity:</span>
                                  <span className="text-emerald-400 font-bold">{activeEv.severity}</span>
                                  <span className="text-slate-500">•</span>
                                  <span className="text-slate-400">Polarity:</span>
                                  <span className="text-rose-400 font-bold">{activeEv.polarity}</span>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                                  Extracted Graph Entities & Identified Roles:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 font-sans">
                                  {activeEv.entities.map((ent, eIdx) => (
                                    <div
                                      key={eIdx}
                                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs flex flex-col justify-between"
                                    >
                                      <span className="font-bold text-slate-200">{ent.name}</span>
                                      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                                        <span className="font-mono text-blue-400">{ent.type}</span>
                                        <span className="text-slate-500">{ent.role}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <p className="text-xs text-slate-300 font-sans italic pt-1 border-t border-slate-800">
                                &ldquo;{activeEv.nlpRationale}&rdquo;
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* SECTION 3: KNOWLEDGE GRAPH CONSTRUCTION */}
                  {section.id === "knowledge-graph" && (
                    <div className="space-y-6">
                      <div className="prose prose-sm text-slate-600 max-w-none space-y-3">
                        <p className="text-sm leading-relaxed">
                          Fin.D’s Knowledge Graph organizes global capital markets as a directional, multi-relational property graph.
                          Nodes represent economic actors—companies, commodities, sovereign indices, and central bank benchmarks.
                          Edges represent verified causal and correlational transmission vectors with mathematical weights.
                        </p>
                      </div>

                      {/* 3 Derivation Factors for Edge Weights */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-3">
                          Empirical Derivation of Edge Weights (W_ij)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                            <span className="text-xs font-mono font-bold text-blue-600 px-2 py-0.5 rounded bg-blue-100">
                              Factor 1: Co-Movement (W_co)
                            </span>
                            <h5 className="text-sm font-bold text-slate-900">Historical Return Co-Movement</h5>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              180-day rolling Pearson correlation of daily return series combined with Granger causality
                              F-tests (p &lt; 0.05) to eliminate spurious non-directional correlations.
                            </p>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                            <span className="text-xs font-mono font-bold text-emerald-600 px-2 py-0.5 rounded bg-emerald-100">
                              Factor 2: Supply Chain (W_sup)
                            </span>
                            <h5 className="text-sm font-bold text-slate-900">Supply Chain & COGS Dependency</h5>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Audited supplier-customer linkages from annual 10-K and MCA filings. Quantifies input
                              share of total Cost of Goods Sold (e.g., TiO2 + solvents = 55% of paint COGS).
                            </p>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                            <span className="text-xs font-mono font-bold text-purple-600 px-2 py-0.5 rounded bg-purple-100">
                              Factor 3: Sector Hierarchy (W_sec)
                            </span>
                            <h5 className="text-sm font-bold text-slate-900">Sector Classification & Betas</h5>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              GICS and NSE sector classification hierarchies, sector beta to interest rates, and
                              cross-elasticities of demand across substitute product categories.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Edge Relationship Ontology Table */}
                      <div className="rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                            Relationship Ontology & Edge Properties
                          </span>
                          <span className="text-xs font-mono text-slate-500">Neo4j Relationship Schema</span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] border-b border-slate-200">
                              <tr>
                                <th className="p-3 font-semibold">Relationship Type</th>
                                <th className="p-3 font-semibold">Source → Target Node</th>
                                <th className="p-3 font-semibold">Weight Range</th>
                                <th className="p-3 font-semibold">Typical Transmission Lag</th>
                                <th className="p-3 font-semibold">Primary Evidence Source</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              <tr className="hover:bg-slate-50/60">
                                <td className="p-3 font-mono font-bold text-blue-700">SUPPLIES_TO</td>
                                <td className="p-3">TSMC → NVIDIA</td>
                                <td className="p-3 font-mono font-semibold">0.85 – 0.95</td>
                                <td className="p-3 font-mono text-slate-500">T+15 to T+45 days</td>
                                <td className="p-3">Form 10-K Supply Disclosures</td>
                              </tr>
                              <tr className="hover:bg-slate-50/60">
                                <td className="p-3 font-mono font-bold text-amber-700">COST_DRIVER_OF</td>
                                <td className="p-3">Brent Crude → Asian Paints</td>
                                <td className="p-3 font-mono font-semibold">0.78 – 0.90</td>
                                <td className="p-3 font-mono text-slate-500">T+30 to T+60 days</td>
                                <td className="p-3">COGS Commodity Regression</td>
                              </tr>
                              <tr className="hover:bg-slate-50/60">
                                <td className="p-3 font-mono font-bold text-purple-700">POLICY_SENSITIVE_TO</td>
                                <td className="p-3">Bajaj Finance → RBI Repo Rate</td>
                                <td className="p-3 font-mono font-semibold">0.70 – 0.88</td>
                                <td className="p-3 font-mono text-slate-500">T+0 to T+14 days</td>
                                <td className="p-3">Interbank Yield Spread Elasticity</td>
                              </tr>
                              <tr className="hover:bg-slate-50/60">
                                <td className="p-3 font-mono font-bold text-emerald-700">PRICE_CORRELATED_WITH</td>
                                <td className="p-3">USD/INR → TCS / Infosys</td>
                                <td className="p-3 font-mono font-semibold">0.65 – 0.80</td>
                                <td className="p-3 font-mono text-slate-500">T+0 to T+7 days</td>
                                <td className="p-3">Rolling FX Realization Beta</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 4: PROPAGATION ALGORITHM */}
                  {section.id === "propagation-algo" && (
                    <div className="space-y-6">
                      <div className="prose prose-sm text-slate-600 max-w-none space-y-3">
                        <p className="text-sm leading-relaxed">
                          The contagion propagation engine employs a <strong>Breadth-First Search (BFS) multi-hop traversal with exponential decay</strong>.
                          Starting at the catalyst epicenter, the algorithm traverses radiating concentric hops, attenuating transmission strength
                          as distance from the catalyst increases.
                        </p>
                      </div>

                      {/* Mathematical Formulation Card */}
                      <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                            Mathematical Formulation
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">BFS Attenuation Law</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                            <span className="text-xs text-slate-400 font-mono">Hop Transmission Equation:</span>
                            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-sm text-emerald-400">
                              Impact(Hop_k) = S_0 · ∏ [ W_(i-1, i) · λ ]
                            </div>
                            <p className="text-[11px] text-slate-400 leading-normal">
                              Where <code className="text-slate-300">S_0</code> is the initial event severity,
                              <code className="text-slate-300"> W</code> is the directional edge weight, and
                              <code className="text-slate-300"> λ ∈ [0.65, 0.85]</code> is the hop attenuation decay factor.
                            </p>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                            <span className="text-xs text-slate-400 font-mono">Cumulative Path Impact Ranking:</span>
                            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-sm text-blue-400">
                              Score(Path) = ∑ [ Impact(Hop_k) · (1 - (k-1)/K) ]
                            </div>
                            <p className="text-[11px] text-slate-400 leading-normal">
                              Transmission paths are sorted and ranked by cumulative score, prioritizing high-velocity, high-magnitude
                              vulnerabilities over distant noise.
                            </p>
                          </div>
                        </div>

                        {/* Three Algorithmic Safeguards */}
                        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                            <span className="text-amber-400 font-bold block mb-1">1. Pruning Cutoff Threshold</span>
                            <p className="text-slate-300 text-[11px]">
                              Any propagation branch where <code className="text-amber-300">Impact &lt; 0.05</code> is pruned to prevent
                              combinatorial state explosion.
                            </p>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                            <span className="text-blue-400 font-bold block mb-1">2. Cycle Prevention</span>
                            <p className="text-slate-300 text-[11px]">
                              Visited node sets are maintained per traversal branch to prevent infinite feedback loops in cyclical dependencies.
                            </p>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                            <span className="text-emerald-400 font-bold block mb-1">3. Time Horizon Lag Offset</span>
                            <p className="text-slate-300 text-[11px]">
                              Each hop accrues empirical real-world transmission lag (Hop 1: 0–7 days; Hop 2: 15–45 days; Hop 3: 60–90 days).
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Decay Factor Visualizer */}
                      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-amber-600" />
                            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                              Interactive Multi-Hop Attenuation Simulator
                            </h4>
                          </div>
                          <span className="text-xs text-slate-500 font-mono">
                            Adjust decay factor (λ) and observe ripple attenuation
                          </span>
                        </div>

                        {/* Sliders */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-slate-600 font-semibold">Decay Factor (λ):</span>
                              <span className="text-blue-600 font-bold">{simulationDecayFactor.toFixed(2)}</span>
                            </div>
                            <input
                              type="range"
                              min="0.5"
                              max="0.95"
                              step="0.05"
                              value={simulationDecayFactor}
                              onChange={(e) => setSimulationDecayFactor(parseFloat(e.target.value))}
                              className="w-full accent-blue-600 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                              <span>0.50 (High damping)</span>
                              <span>0.95 (High contagion)</span>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-mono">
                              <span className="text-slate-600 font-semibold">Base Severity (S_0):</span>
                              <span className="text-rose-600 font-bold">{simulationBaseSeverity.toFixed(2)}</span>
                            </div>
                            <input
                              type="range"
                              min="0.4"
                              max="1.0"
                              step="0.05"
                              value={simulationBaseSeverity}
                              onChange={(e) => setSimulationBaseSeverity(parseFloat(e.target.value))}
                              className="w-full accent-rose-600 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                              <span>0.40 (Minor catalyst)</span>
                              <span>1.00 (Black Swan shock)</span>
                            </div>
                          </div>
                        </div>

                        {/* Visual Ripple Decay Bars */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="font-bold text-slate-700">Epicenter</span>
                              <span className="text-rose-600 font-bold">{(simulationBaseSeverity * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-rose-500 h-2.5 rounded-full transition-all duration-150"
                                style={{ width: `${simulationBaseSeverity * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">Direct Shock (T+0)</span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="font-bold text-slate-700">Hop 1 (Direct)</span>
                              <span className="text-amber-600 font-bold">{(hop1Impact * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-amber-500 h-2.5 rounded-full transition-all duration-150"
                                style={{ width: `${Math.min(100, hop1Impact * 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">1st Degree Tier (T+7d)</span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="font-bold text-slate-700">Hop 2 (Secondary)</span>
                              <span className="text-blue-600 font-bold">{(hop2Impact * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-blue-500 h-2.5 rounded-full transition-all duration-150"
                                style={{ width: `${Math.min(100, hop2Impact * 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">Downstream Margin (T+30d)</span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="font-bold text-slate-700">Hop 3 (Tertiary)</span>
                              <span className="text-purple-600 font-bold">{(hop3Impact * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-purple-500 h-2.5 rounded-full transition-all duration-150"
                                style={{ width: `${Math.min(100, hop3Impact * 100)}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">End Consumer (T+90d)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 5: EVIDENCE & CONFIDENCE SCORING */}
                  {section.id === "evidence-scoring" && (
                    <div className="space-y-6">
                      <div className="prose prose-sm text-slate-600 max-w-none space-y-3">
                        <p className="text-sm leading-relaxed">
                          To protect portfolio managers against algorithmic hallucinations, Fin.D rejects purely probabilistic
                          LLM assertions. Every edge in the transmission pathway is evaluated through a
                          <strong> multi-source confidence triangulation framework</strong>.
                        </p>
                      </div>

                      {/* 4 Pillars of Evidence Scoring */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-emerald-700 px-2 py-0.5 bg-emerald-100 rounded">
                                WEIGHT: 35%
                              </span>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h5 className="text-sm font-bold text-slate-900">Historical Data</h5>
                            <p className="text-xs text-slate-600 leading-normal">
                              10-year econometric regressions, rolling cointegration vectors, and historical market crisis backtests.
                            </p>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500 border-t border-slate-200 pt-2">
                            Min 250 Daily Observations
                          </span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-blue-700 px-2 py-0.5 bg-blue-100 rounded">
                                WEIGHT: 30%
                              </span>
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <h5 className="text-sm font-bold text-slate-900">Regulatory Filings</h5>
                            <p className="text-xs text-slate-600 leading-normal">
                              Item 1A Risk Factors from 10-K/10-Q filings, SEBI quarterly notes, and annual supplier concentration reports.
                            </p>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500 border-t border-slate-200 pt-2">
                            Audited Corporate Disclosures
                          </span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-purple-700 px-2 py-0.5 bg-purple-100 rounded">
                                WEIGHT: 20%
                              </span>
                              <BookOpen className="w-4 h-4 text-purple-600" />
                            </div>
                            <h5 className="text-sm font-bold text-slate-900">Academic Research</h5>
                            <p className="text-xs text-slate-600 leading-normal">
                              Empirical macro literature, central bank working papers (RBI, Federal Reserve, BIS), and IMF contagion models.
                            </p>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500 border-t border-slate-200 pt-2">
                            Peer-Reviewed Citations
                          </span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-amber-700 px-2 py-0.5 bg-amber-100 rounded">
                                WEIGHT: 15%
                              </span>
                              <Sparkles className="w-4 h-4 text-amber-600" />
                            </div>
                            <h5 className="text-sm font-bold text-slate-900">LLM Reasoning Confidence</h5>
                            <p className="text-xs text-slate-600 leading-normal">
                              GPT-4o chain-of-thought self-consistency sampling over multiple inference passes.
                            </p>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500 border-t border-slate-200 pt-2">
                            Multi-Pass Agreement Score
                          </span>
                        </div>
                      </div>

                      {/* Institutional Confidence Tiers Breakdown */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                          Confidence Tier Classification
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-emerald-800">Tier A: Deterministic Link</span>
                              <span className="text-xs font-mono font-bold text-emerald-600">90% – 100%</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-normal">
                              Verified in audited regulatory reports and verified by econometric co-movement (p &lt; 0.01).
                              Example: TSMC wafer supply directly to Nvidia.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-white border border-blue-200 shadow-2xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-blue-800">Tier B: High Causal Hypothesis</span>
                              <span className="text-xs font-mono font-bold text-blue-600">75% – 89%</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-normal">
                              Standard economic pass-through documented in central bank research with strong historical correlations.
                              Example: Crude oil spike to Asian Paints gross margins.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-2xs space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-800">Tier C: Emerging Heuristic</span>
                              <span className="text-xs font-mono font-bold text-amber-600">60% – 74%</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-normal">
                              Second-order behavioural and substitution linkages derived via LLM semantic clustering with early correlation markers.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 6: TECHNICAL STACK */}
                  {section.id === "tech-stack" && (
                    <div className="space-y-6">
                      <div className="prose prose-sm text-slate-600 max-w-none space-y-3">
                        <p className="text-sm leading-relaxed">
                          Fin.D is architected for low-latency transmission queries, combining an asynchronous Python backend,
                          a high-performance Neo4j graph database, and a responsive React frontend.
                        </p>
                      </div>

                      {/* 5 Core Stack Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {/* 1. Frontend */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-blue-700 px-2 py-0.5 bg-blue-100 rounded">
                                PRESENTATION LAYER
                              </span>
                              <Code2 className="w-4 h-4 text-blue-600" />
                            </div>
                            <h5 className="text-sm font-bold text-slate-900">React + TypeScript</h5>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Vite 8 build system, Tailwind CSS v4, Lucide React icons, and Framer Motion.
                              Features a custom SVG/HTML5 radial transmission canvas with interactive ripple animations.
                            </p>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 flex items-center justify-between">
                            <span>Vite • Tailwind CSS</span>
                            <span className="text-blue-600 font-semibold">Strict TS</span>
                          </div>
                        </div>

                        {/* 2. Backend */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-emerald-700 px-2 py-0.5 bg-emerald-100 rounded">
                                API & ORCHESTRATION
                              </span>
                              <Terminal className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h5 className="text-sm font-bold text-slate-900">FastAPI + Python</h5>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              High-throughput async Python ASGI server with Pydantic typing, NetworkX
                              graph traversal routines, and vectorized NumPy mathematical decay transformations.
                            </p>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 flex items-center justify-between">
                            <span>Async ASGI • Pydantic</span>
                            <span className="text-emerald-600 font-semibold">FastAPI</span>
                          </div>
                        </div>

                        {/* 3. Knowledge Graph */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-purple-700 px-2 py-0.5 bg-purple-100 rounded">
                                GRAPH DATABASE
                              </span>
                              <Database className="w-4 h-4 text-purple-600" />
                            </div>
                            <h5 className="text-sm font-bold text-slate-900">Neo4j Knowledge Graph</h5>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Native property graph database storing market entities, multi-hop transmission weights,
                              and directional causality. Supports sub-millisecond Cypher pathway queries.
                            </p>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 flex items-center justify-between">
                            <span>Cypher Engine • Indexed</span>
                            <span className="text-purple-600 font-semibold">Neo4j</span>
                          </div>
                        </div>

                        {/* 4. Reasoning Engine */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-amber-700 px-2 py-0.5 bg-amber-100 rounded">
                                COGNITIVE REASONING
                              </span>
                              <Sparkles className="w-4 h-4 text-amber-600" />
                            </div>
                            <h5 className="text-sm font-bold text-slate-900">GPT-4o for Reasoning</h5>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Zero-shot catalyst classification, causal narrative synthesis, and economic transmission
                              rationalization with structured JSON output enforcement.
                            </p>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 flex items-center justify-between">
                            <span>Structured Outputs</span>
                            <span className="text-amber-600 font-semibold">GPT-4o</span>
                          </div>
                        </div>

                        {/* 5. Market Data Engine */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-rose-700 px-2 py-0.5 bg-rose-100 rounded">
                                QUANT DATA PIPELINE
                              </span>
                              <Zap className="w-4 h-4 text-rose-600" />
                            </div>
                            <h5 className="text-sm font-bold text-slate-900">yfinance for Market Data</h5>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Real-time and historical time-series pricing for Indian equities (.NS, .BO), US securities,
                              global commodities (Brent, WTI, Gold), and foreign exchange benchmarks.
                            </p>
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 flex items-center justify-between">
                            <span>Live Feeds • Historical</span>
                            <span className="text-rose-600 font-semibold">yfinance</span>
                          </div>
                        </div>

                        {/* 6. Architecture Highlights */}
                        <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/20 rounded">
                                INTEGRATION FLOW
                              </span>
                              <Layers className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h5 className="text-sm font-bold text-white">Full-Stack Cohesion</h5>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              Clients trigger event simulation → FastAPI orchestrates GPT-4o entity extraction &rarr;
                              queries Neo4j transmission topology &rarr; pulls real-time yfinance quotes &rarr; streams to UI.
                            </p>
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
                            <span>End-to-End Latency</span>
                            <span className="text-emerald-400 font-semibold">&lt; 180ms</span>
                          </div>
                        </div>
                      </div>

                      {/* Sample Neo4j Cypher Query Snippet */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                              Representative Neo4j Cypher Traversal Query
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              handleCopyText(
                                `MATCH path = (origin:Entity {id: $catalystId})-[r:TRANSMITS_TO*1..3]->(target:Entity)
WHERE all(rel in relationships(path) WHERE rel.weight >= $minThreshold)
RETURN path, 
       reduce(totalDecay = 1.0, rel in relationships(path) | totalDecay * rel.weight * $decayFactor) AS pathImpactScore
ORDER BY pathImpactScore DESC
LIMIT 15;`,
                                "cypher"
                              )
                            }
                            className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                          >
                            {copiedSnippet === "cypher" ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Cypher</span>
                              </>
                            )}
                          </button>
                        </div>

                        <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                          <code>{`MATCH path = (origin:Entity {id: $catalystId})-[r:TRANSMITS_TO*1..3]->(target:Entity)
WHERE all(rel in relationships(path) WHERE rel.weight >= $minThreshold)
RETURN path, 
       reduce(totalDecay = 1.0, rel in relationships(path) | totalDecay * rel.weight * $decayFactor) AS pathImpactScore
ORDER BY pathImpactScore DESC
LIMIT 15;`}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Footer Note & Research Disclosure */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span>
            Fin.D Quantitative Methodologies are designed for institutional macro & portfolio risk research.
            Models are backtested against historical geopolitical and central bank shock sequences.
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400 flex-shrink-0">
          <span>Neo4j v5.x</span>
          <span>•</span>
          <span>FastAPI v0.115</span>
          <span>•</span>
          <span>GPT-4o</span>
        </div>
      </div>
    </div>
  );
};
