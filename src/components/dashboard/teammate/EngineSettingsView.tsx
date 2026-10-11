import React, { useState } from "react";
import {
  Network,
  Cpu,
  Database,
  Activity,
  Sliders,
  CheckCircle2,
  Radio,
  Zap,
  RefreshCw,
  Server,
  ShieldCheck,
  ChevronDown,
  Clock,
  RotateCcw,
  Save,
  Check,
} from "lucide-react";

export const EngineSettingsView: React.FC = () => {
  // 1. Graph Engine toggles (defaults as requested)
  const [multiHop, setMultiHop] = useState<boolean>(true); // ON
  const [crossSector, setCrossSector] = useState<boolean>(true); // ON
  const [timeDecay, setTimeDecay] = useState<boolean>(true); // ON
  const [sentimentAnalysis, setSentimentAnalysis] = useState<boolean>(false); // OFF

  // 2. Model Configuration
  const [primaryModel, setPrimaryModel] = useState<string>("GPT-4o");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState<boolean>(false);
  const [maxPropagationDepth, setMaxPropagationDepth] = useState<number>(3); // 3 hops
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(60); // 60%

  // 3. Data Sources Checklist & States
  const [dataSources, setDataSources] = useState([
    {
      id: "reuters",
      name: "Reuters",
      category: "Global Financial Wire & Energy Tickers",
      connected: true,
      enabled: true,
      latency: "28ms",
      lastSync: "3s ago",
      syncType: "Streaming WebSocket",
    },
    {
      id: "bloomberg",
      name: "Bloomberg Terminal",
      category: "B-PIPE Real-Time Market Data & Spreads",
      connected: true,
      enabled: true,
      latency: "14ms",
      lastSync: "Real-time",
      syncType: "FIX Protocol 4.4",
    },
    {
      id: "rbi",
      name: "RBI Bulletins",
      category: "Monetary Policy & Interbank Liquidity Circulars",
      connected: true,
      enabled: true,
      latency: "62ms",
      lastSync: "12m ago",
      syncType: "ETL Scraper Sync",
    },
    {
      id: "ppac",
      name: "PPAC Ministry",
      category: "Petroleum Planning & Analysis Cell (Domestic Fuel Benchmarks)",
      connected: true,
      enabled: true,
      latency: "45ms",
      lastSync: "45m ago",
      syncType: "Bi-hourly Cron",
    },
    {
      id: "bse_nse",
      name: "BSE/NSE Filings",
      category: "Corporate XBRL Results & Shareholding Disclosures",
      connected: false,
      enabled: false,
      latency: "--",
      lastSync: "Paused (Maintenance)",
      syncType: "REST Gateway v2",
    },
  ]);

  // Notification / Toast state
  const [savedNotification, setSavedNotification] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const modelOptions = [
    {
      name: "GPT-4o",
      provider: "OpenAI",
      context: "128k context",
      description: "High-throughput multimodal reasoning with chain-of-thought verification.",
      isDefault: true,
    },
    {
      name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      context: "200k context",
      description: "Advanced causal chain breakdown & econometric prose generation.",
      isDefault: false,
    },
    {
      name: "FinGPT-70B Causal",
      provider: "Fin.D Weights",
      context: "64k context",
      description: "Proprietary fine-tune on 10 years of Indian NSE/BSE and RBI policy transcripts.",
      isDefault: false,
    },
    {
      name: "Llama 3.3 70B Quantized",
      provider: "Local Cluster",
      context: "32k context",
      description: "Ultra-low latency local inference fallback with zero external API calls.",
      isDefault: false,
    },
  ];

  const handleToggleDataSource = (id: string) => {
    setDataSources((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const handleResetDefaults = () => {
    setMultiHop(true);
    setCrossSector(true);
    setTimeDecay(true);
    setSentimentAnalysis(false);
    setPrimaryModel("GPT-4o");
    setMaxPropagationDepth(3);
    setConfidenceThreshold(60);
    setDataSources((prev) =>
      prev.map((src) => ({
        ...src,
        enabled: src.id !== "bse_nse",
      }))
    );
    showNotice("Settings reset to institutional defaults");
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showNotice("Fin.D AI Engine parameters successfully applied to production cluster");
    }, 600);
  };

  const showNotice = (msg: string) => {
    setSavedNotification(msg);
    setTimeout(() => {
      setSavedNotification(null);
    }, 3500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4 px-4 sm:px-6 flex flex-col gap-8 pb-16">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--clay-border)]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              AI Engine Configuration
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Fin.D Core v2.4
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
            Configure multi-hop financial contagion mechanics, foundational LLM reasoning layers,
            institutional streaming sources, and cluster API telemetry.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl border border-[var(--clay-border)] clay-surface hover:clay-surface text-[var(--text-primary)] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-70"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isSaving ? "Applying..." : "Save Settings"}</span>
          </button>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {savedNotification && (
        <div className="p-3.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{savedNotification}</span>
          </div>
          <button
            onClick={() => setSavedNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid Layout for Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ======================================================== */}
        {/* SECTION 1: GRAPH ENGINE                                  */}
        {/* ======================================================== */}
        <div className="clay-surface rounded-2xl border border-[var(--clay-border)]/90 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[var(--clay-border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Network className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[var(--text-primary)]">
                    Graph Engine
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Propagation dynamics and systemic transmission algorithms
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded clay-inset text-[var(--text-secondary)]">
                Live Algorithm
              </span>
            </div>

            {/* Toggles Container */}
            <div className="flex flex-col divide-y divide-slate-100">
              {/* 1. Multi-hop propagation */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      Multi-hop propagation
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        multiHop
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "clay-inset text-[var(--text-secondary)]"
                      }`}
                    >
                      {multiHop ? "ON" : "OFF"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Traces second and third-order ripple effects across downstream suppliers and credit counterparties.
                  </p>
                </div>

                {/* Switch */}
                <button
                  type="button"
                  onClick={() => setMultiHop(!multiHop)}
                  aria-pressed={multiHop}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    multiHop ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full clay-surface shadow-md ring-0 transition duration-200 ease-in-out ${
                      multiHop ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* 2. Cross-sector transmission */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      Cross-sector transmission
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        crossSector
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "clay-inset text-[var(--text-secondary)]"
                      }`}
                    >
                      {crossSector ? "ON" : "OFF"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Allows macroeconomic shocks in commodities (e.g. Brent Crude) to cross sector boundaries into Paints, Aviation, & Autos.
                  </p>
                </div>

                {/* Switch */}
                <button
                  type="button"
                  onClick={() => setCrossSector(!crossSector)}
                  aria-pressed={crossSector}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    crossSector ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full clay-surface shadow-md ring-0 transition duration-200 ease-in-out ${
                      crossSector ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* 3. Time-decay weighting */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      Time-decay weighting
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        timeDecay
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "clay-inset text-[var(--text-secondary)]"
                      }`}
                    >
                      {timeDecay ? "ON" : "OFF"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Decays edge transmission sensitivity with exponential half-life (t½ = 45 days) to emphasize fresh data.
                  </p>
                </div>

                {/* Switch */}
                <button
                  type="button"
                  onClick={() => setTimeDecay(!timeDecay)}
                  aria-pressed={timeDecay}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    timeDecay ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full clay-surface shadow-md ring-0 transition duration-200 ease-in-out ${
                      timeDecay ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* 4. Sentiment analysis */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      Sentiment analysis
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        sentimentAnalysis
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "clay-inset text-[var(--text-secondary)]"
                      }`}
                    >
                      {sentimentAnalysis ? "ON" : "OFF"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Injects unstructured social and media headline sentiment directly into Bayesian edge priors.
                  </p>
                </div>

                {/* Switch */}
                <button
                  type="button"
                  onClick={() => setSentimentAnalysis(!sentimentAnalysis)}
                  aria-pressed={sentimentAnalysis}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    sentimentAnalysis ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full clay-surface shadow-md ring-0 transition duration-200 ease-in-out ${
                      sentimentAnalysis ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--clay-border)] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Kernel: CausalGraph-V3</span>
            <span className="flex items-center gap-1 text-[var(--text-secondary)]">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              Verified Deterministic
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: MODEL CONFIGURATION                           */}
        {/* ======================================================== */}
        <div className="clay-surface rounded-2xl border border-[var(--clay-border)]/90 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[var(--clay-border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[var(--text-primary)]">
                    Model Configuration
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Inference engine, vector embeddings, and graph thresholding
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/50">
                Inference Ready
              </span>
            </div>

            {/* Primary Model dropdown-like display */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">
                <span>Primary Model</span>
                <span className="text-[11px] text-slate-400 font-normal">Foundation LLM</span>
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[var(--clay-border)] clay-surface hover:clay-inset/80 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md clay-surface border border-[var(--clay-border)] text-blue-600 flex items-center justify-center font-bold text-xs">
                      ⚡
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                        {primaryModel}
                        <span className="px-1.5 py-0.2 rounded bg-blue-100/80 text-blue-700 text-[10px] font-medium">
                          Active
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)]">
                        {modelOptions.find((m) => m.name === primaryModel)?.description || "High-throughput multimodal reasoning"}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${
                      isModelDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                {isModelDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 z-20 clay-surface border border-[var(--clay-border)] rounded-xl shadow-lg overflow-hidden py-1">
                    {modelOptions.map((opt) => (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => {
                          setPrimaryModel(opt.name);
                          setIsModelDropdownOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 text-left text-xs flex items-start justify-between gap-2 hover:clay-surface transition cursor-pointer ${
                          primaryModel === opt.name ? "bg-blue-50/70" : ""
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <span>{opt.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({opt.provider} • {opt.context})
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)]">{opt.description}</p>
                        </div>
                        {primaryModel === opt.name && (
                          <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Knowledge Graph representation */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">
                <span>Knowledge Graph</span>
                <span className="text-[11px] text-slate-400 font-normal">Topology Store</span>
              </label>

              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[var(--clay-border)] clay-surface/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      Neo4j + Custom Embeddings
                    </span>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      text-embedding-3-large (3072 dims) • 12.8k nodes & 48.2k relationships
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Synched
                </div>
              </div>
            </div>

            {/* Max Propagation Depth Slider */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[var(--text-primary)]">
                  Max Propagation Depth
                </label>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold">
                  {maxPropagationDepth} hops
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={maxPropagationDepth}
                onChange={(e) => setMaxPropagationDepth(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono px-0.5">
                <span>1 hop (Direct)</span>
                <span>2 hops</span>
                <span className="font-bold text-blue-600">3 hops (Recommended)</span>
                <span>4 hops</span>
                <span>5 hops (Deep)</span>
              </div>
            </div>

            {/* Confidence Threshold Slider */}
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[var(--text-primary)]">
                  Confidence Threshold
                </label>
                <span className="px-2.5 py-0.5 rounded-md clay-inset border border-[var(--clay-border)] text-[var(--text-primary)] text-xs font-mono font-bold">
                  {confidenceThreshold}%
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={95}
                step={5}
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono px-0.5">
                <span>20% (Permissive)</span>
                <span className="font-bold text-[var(--text-primary)]">60% (Default)</span>
                <span>95% (High Certainty)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--clay-border)] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Embedding Dim: 3072</span>
            <span>Pruning Rate: 18.4%</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 3: DATA SOURCES CHECKLIST                        */}
        {/* ======================================================== */}
        <div className="clay-surface rounded-2xl border border-[var(--clay-border)]/90 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[var(--clay-border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[var(--text-primary)]">
                    Data Sources
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Active ingestion pipelines feeding real-time financial telemetry
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                4 of 5 Connected
              </span>
            </div>

            {/* Checklist items */}
            <div className="flex flex-col gap-2.5">
              {dataSources.map((source) => {
                const isConnected = source.connected;

                return (
                  <div
                    key={source.id}
                    onClick={() => handleToggleDataSource(source.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      source.enabled
                        ? "clay-surface/60 border-[var(--clay-border)] hover:border-blue-300"
                        : "clay-surface border-[var(--clay-border)]/60 opacity-60 hover:opacity-80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={source.enabled}
                        onChange={() => {}} // handled by parent onClick
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                      />

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[var(--text-primary)]">
                            {source.name}
                          </span>
                          {/* Connection Dot */}
                          <div className="flex items-center gap-1">
                            {isConnected ? (
                              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                                <span className="text-[10px]">connected</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                                <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                                <span className="text-[10px]">disconnected</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] text-[var(--text-secondary)]">
                          {source.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div className="hidden sm:flex flex-col items-end text-[10px] font-mono">
                        <span className="text-[var(--text-secondary)] font-semibold">{source.syncType}</span>
                        <span className="text-slate-400">{source.lastSync}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--clay-border)] flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Automated polling active
            </span>
            <span className="font-mono text-[10px] text-slate-400">Sync: Sub-second FIX + REST</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 4: API STATUS                                    */}
        {/* ======================================================== */}
        <div className="clay-surface rounded-2xl border border-[var(--clay-border)]/90 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[var(--clay-border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[var(--text-primary)]">
                    API Status
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Service telemetry, database health, and rate consumption
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                All Systems Normal
              </span>
            </div>

            {/* Service Status Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Backend Status */}
              <div className="p-3.5 rounded-xl border border-[var(--clay-border)] clay-surface/60 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">Backend</span>
                  <Server className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold text-[var(--text-primary)]">Active</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600">24ms latency</span>
                </div>
              </div>

              {/* Graph DB Status */}
              <div className="p-3.5 rounded-xl border border-[var(--clay-border)] clay-surface/60 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">Graph DB</span>
                  <Database className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold text-[var(--text-primary)]">Active</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600">12ms Bolt RTT</span>
                </div>
              </div>

              {/* LLM Endpoint Status */}
              <div className="p-3.5 rounded-xl border border-[var(--clay-border)] clay-surface/60 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">LLM Endpoint</span>
                  <Zap className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold text-[var(--text-primary)]">Active</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600">182ms token p95</span>
                </div>
              </div>
            </div>

            {/* Rate Limit Box */}
            <div className="p-4 rounded-xl border border-[var(--clay-border)] clay-surface/80 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    Rate Limit
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    (Rolling 60m window)
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded">
                  45/100 requests
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: "45%" }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                <span>55 requests remaining</span>
                <span className="font-mono text-[10px] text-slate-400">Resets in 18m 42s</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--clay-border)] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Uptime: 99.99%</span>
            <span>Cluster: ap-south-1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

