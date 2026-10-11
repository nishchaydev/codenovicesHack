'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import {
  ShieldAlert,
  Network,
  ArrowRight,
  Activity,
  FileText,
  BrainCircuit,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Zap,
  BookOpen,
  X,
  Sliders,
  Database,
  Cpu,
  Check,
} from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';

interface StageData {
  stage: number;
  title: string;
  subtitle: string;
  delay: string;
  magnitude: string;
  tickers: string[];
  type: string;
  color: string;
  description: string;
  historicalPrecedent: string;
  empiricalScore: number;
}

const contagionStages: StageData[] = [
  {
    stage: 1,
    title: 'Supply Disruption',
    subtitle: '+12.0% Brent, WTI',
    delay: 'Day 0',
    magnitude: '+12.0%',
    tickers: ['Brent', 'WTI', '$USO'],
    type: 'Primary Event',
    color: 'text-blue-600 dark:text-blue-400',
    description: 'Physical crude oil flow disruption via Strait of Hormuz chokepoint or OPEC+ production quota cuts.',
    historicalPrecedent: '1990 Gulf War Shock: Brent Crude spiked 135% in 60 days following Iraqi invasion of Kuwait, triggering severe OECD stagflation.',
    empiricalScore: 0.98,
  },
  {
    stage: 2,
    title: 'Indicator Shift',
    subtitle: '+40bps Headline CPI',
    delay: '+48 Hours',
    magnitude: '+40bps',
    tickers: ['USCPI', '$XLE', '$VLO'],
    type: 'Macro Indicator',
    color: 'text-amber-500',
    description: 'Wholesale crack spreads widen as refining margins surge and fuel PPI passes through to broader transport and consumer price indexes.',
    historicalPrecedent: '2022 Energy Shock: Headline CPI accelerated by +38bps within 3 weeks of European natural gas and crude spikes.',
    empiricalScore: 0.92,
  },
  {
    stage: 3,
    title: 'Sector Exposure',
    subtitle: '-8.5% Freight & Aviation Margins',
    delay: '+14 Days',
    magnitude: '-8.5%',
    tickers: ['Delta', 'FedEx', '$JETS'],
    type: 'Industry Impact',
    color: 'text-rose-500',
    description: 'Airlines and logistics providers experience rapid EBITDA margin compression due to unhedged jet-fuel & diesel input costs.',
    historicalPrecedent: '2008 & 2022 Airline Margin Contraction: Jet fuel prices doubled, wiping out $4.2B in operating income across major legacy carriers.',
    empiricalScore: 0.85,
  },
  {
    stage: 4,
    title: 'Counterparty Risk',
    subtitle: '-3.4% Bank Loan Portfolios',
    delay: '+30 Days',
    magnitude: '-3.4%',
    tickers: ['KRE', 'VNQ', '$JPM'],
    type: 'Financial System',
    color: 'text-purple-500',
    description: 'Elevated discount rates and commercial loan default expectations pressure regional bank balance sheets and debt service coverage ratios.',
    historicalPrecedent: '2023 Regional Banking Stress: Commercial real estate loan provisioning surged 45% as high interest rates combined with fuel-driven operating cost inflation.',
    empiricalScore: 0.78,
  },
];

const enterpriseFeatures = [
  {
    icon: FileText,
    title: 'Live SEC Filing NER',
    description: 'Real-time Natural Language Entity Recognition across 10-K, 10-Q, and 8-K filings to extract hidden supply chain dependencies in <12ms.',
    badge: 'NLP Engine',
  },
  {
    icon: BrainCircuit,
    title: 'Bayesian Confidence Scoring',
    description: 'Every causal edge displays explicit posterior probability distributions, separating verified facts from LLM probabilistic hypotheses.',
    badge: 'Uncertainty AI',
  },
  {
    icon: Network,
    title: 'Multi-Hop Vector Traversal',
    description: 'Sub-second graph database queries traversing up to 5 depth hops across 50,000+ interconnected global corporate nodes.',
    badge: 'Graph DB',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Tick Correlation',
    description: 'Cross-references graph links against 30+ years of high-frequency tick data, implied volatility surfaces, and CDS spreads.',
    badge: '30-Year Backtest',
  },
  {
    icon: ShieldAlert,
    title: 'Regulatory Stress-Testing',
    description: 'Pre-configured compliance templates for Federal Reserve CCAR, Dodd-Frank, and Basel III liquidity stress tests.',
    badge: 'Compliance',
  },
  {
    icon: Sliders,
    title: 'Portfolio Hedging Simulator',
    description: 'Automatically calculates tail-risk mitigation options and index basket hedges to offset systemic contagion drawdowns.',
    badge: 'Risk Hedging',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [activeStage, setActiveStage] = useState<StageData>(contagionStages[0]);
  const [shockMagnitude, setShockMagnitude] = useState<number>(15);
  const [showWhitepaper, setShowWhitepaper] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text-primary)] selection:bg-blue-600 selection:text-white relative z-10">
      {/* Top Floating Glass Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 relative z-10">
        {/* ==================================================================== */}
        {/* SECTION 1: Anatomy of a Market Shock (mt-24 Solid Clay Card)          */}
        {/* ==================================================================== */}
        <section id="contagion-map" className="clay-card-solid mt-24 p-8 sm:p-12 space-y-8 relative scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 clay-card-solid text-xs font-black text-[var(--accent-primary)] rounded-full">
                <Activity className="w-4 h-4 animate-pulse text-[var(--accent-primary)]" />
                <span>Interactive Contagion Pipeline</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)]">
                The Anatomy of a <span className="text-[var(--accent-primary)]">Market Shock</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md font-bold">
              Click through the 4-stage systemic contagion pipeline below to inspect how an upstream supply disruption propagates into downstream market risk.
            </p>
          </div>

          {/* 4 Distinct Interactive Solid Clay Cards for Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contagionStages.map((stg) => {
              const isSelected = activeStage.stage === stg.stage;
              return (
                <button
                  key={stg.stage}
                  onClick={() => setActiveStage(stg)}
                  className={`clay-card-solid p-6 rounded-2xl text-left transition-all duration-300 relative ${
                    isSelected
                      ? 'ring-2 ring-[var(--accent-primary)] scale-[1.03]'
                      : 'hover:scale-[1.02]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[var(--text-secondary)]">
                      Stage 0{stg.stage} • {stg.delay}
                    </span>
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${stg.magnitude.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-500'}`}>
                      {stg.magnitude}
                    </span>
                  </div>

                  <div className={`font-black text-base sm:text-lg leading-tight mb-1 ${isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
                    {stg.title}
                  </div>
                  <div className="text-xs font-bold text-[var(--text-secondary)] mb-3">
                    {stg.subtitle}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {stg.tickers.map((tk) => (
                      <span
                        key={tk}
                        className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full clay-inset text-[var(--text-primary)]"
                      >
                        {tk}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Summary Box for Active Stage */}
          <div className="clay-card-solid p-6 sm:p-8 space-y-4 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)] text-white font-black flex items-center justify-center text-lg shadow-md shrink-0">
                  0{activeStage.stage}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] leading-tight">
                    Stage {activeStage.stage}: {activeStage.title} ({activeStage.subtitle})
                  </h3>
                  <span className="text-xs text-[var(--text-secondary)] font-bold">
                    Estimated Propagation Lag: {activeStage.delay} | Expected Variance: {activeStage.magnitude}
                  </span>
                </div>
              </div>

              <div className="clay-card-solid px-4 py-1.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Empirical Grounding: {(activeStage.empiricalScore * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <span className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider">Causal Rationale & Transmission</span>
                <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-bold">
                  {activeStage.description}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black text-[var(--accent-primary)] uppercase tracking-wider">Historical Precedent Citation</span>
                <div className="clay-inset p-4 rounded-2xl text-xs text-[var(--text-secondary)] leading-relaxed font-bold border-l-4 border-[var(--accent-primary)]">
                  {activeStage.historicalPrecedent}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 2: Fact vs. Inferred Intelligence (Opaque Clay-Card Wrapper)  */}
        {/* ==================================================================== */}
        <section id="causal-engine" className="clay-card-solid bg-[var(--clay-surface)] p-8 sm:p-12 space-y-8 scroll-mt-24 my-28 relative">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 clay-card-solid text-xs font-black text-[var(--accent-primary)] rounded-full">
              <BrainCircuit className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Dual Intelligence Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)]">
              Fact vs. Inferred Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-bold">
              Our graph neural network explicitly decouples hard regulatory disclosures from probabilistic multi-hop predictive links.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="clay-card-solid p-8 space-y-6 rounded-2xl">
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[var(--text-primary)]">Empirical Ground Facts</h3>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-black">100% Verified Disclosures</span>
                  </div>
                </div>
                <span className="clay-card-solid px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400 rounded-full">
                  Fact Score: 1.00
                </span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[var(--text-primary)] font-bold">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>SEC 10-K & 8-K Regulatory Filings:</strong> Verified corporate supplier & customer disclosures.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Customs & Trade Manifests:</strong> Physical cargo manifests and bill of lading tracking.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>CFTC & EIA Energy Reports:</strong> Official commercial inventory reports and futures market positioning.</span>
                </li>
              </ul>
            </div>

            <div className="clay-card-solid p-8 space-y-6 rounded-2xl">
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-[var(--accent-primary)] flex items-center justify-center font-bold">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[var(--text-primary)]">Probabilistic Inferences</h3>
                    <span className="text-xs text-[var(--accent-primary)] font-black">GNN & LLM Multi-Hop Predictive Models</span>
                  </div>
                </div>
                <span className="clay-card-solid px-3 py-1 text-xs font-black text-[var(--accent-primary)] rounded-full">
                  Conf: 0.78 - 0.92
                </span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-[var(--text-primary)] font-bold">
                <li className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[var(--accent-primary)] mt-0.5 shrink-0" />
                  <span><strong>2nd & 3rd Order Supplier Dependencies:</strong> LLM extracted unlisted sub-tier supply relationships.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[var(--accent-primary)] mt-0.5 shrink-0" />
                  <span><strong>Executive & Board Interlocks:</strong> Common board member network influence propagation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[var(--accent-primary)] mt-0.5 shrink-0" />
                  <span><strong>Policy Sentiment & Regulatory Shift:</strong> Predictive legislative impact scoring on regional lenders.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 3: Enterprise Features Grid (3x2 Solid Clay Grid)            */}
        {/* ==================================================================== */}
        <section id="enterprise-api" className="space-y-8 scroll-mt-24">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 clay-surface text-xs font-bold text-blue-600 dark:text-blue-400">
              <Zap className="w-4 h-4 fill-blue-600 dark:fill-blue-400" />
              <span>Enterprise Platform Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-clay-text">
              Institutional Graph Infrastructure
            </h2>
            <p className="text-xs sm:text-sm text-clay-text-muted font-bold">
              Engineered specifically for quantitative hedge funds, central banks, and risk management desks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enterpriseFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="clay-surface p-6 space-y-4 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl clay-surface flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-clay-text">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-clay-text-muted leading-relaxed font-bold">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==================================================================== */}
        {/* SECTION 4: Interactive ROI / Scenario Sandbox Widget                 */}
        {/* ==================================================================== */}
        <section id="live-scenarios" className="clay-surface p-8 sm:p-12 space-y-8 relative overflow-hidden scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-clay-border/40 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 clay-surface text-xs font-bold text-blue-600 dark:text-blue-400">
                <Sliders className="w-4 h-4" />
                <span>Live Interactive Sandbox</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-clay-text">
                Simulate <span className="text-blue-600 dark:text-blue-400">Oil Price Shock</span> Impact
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-clay-text-muted max-w-md font-bold">
              Adjust the slider below to modulate an oil price shock from +5% to +50% and watch real-time sector drawdowns re-calculate dynamically.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left Control Column */}
            <div className="space-y-6">
              <div className="clay-inset p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-wider text-clay-text-muted">Crude Oil Shock</span>
                  <span className="text-2xl font-black text-rose-500">+{shockMagnitude}%</span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={shockMagnitude}
                  onChange={(e) => setShockMagnitude(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />

                <div className="flex justify-between text-[10px] font-mono font-bold text-clay-text-muted">
                  <span>+5% Mild</span>
                  <span>+25% Moderate</span>
                  <span>+50% Crisis</span>
                </div>
              </div>

              <button
                onClick={() => router.push(`/dashboard?event=oil&shock=${shockMagnitude}`)}
                className="w-full clay-button-primary py-3.5 rounded-full font-black text-sm flex items-center justify-center gap-2 shadow-xl"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Open in Full Graph Sandbox</span>
              </button>
            </div>

            {/* Right Drawdown Bar Chart Column */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-clay-text-muted mb-2">
                Estimated Sector Drawdown & Expansion Bars
              </h4>

              {/* Bar 1: Energy Upstream */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-clay-text">Energy Upstream ($XLE)</span>
                  <span className="text-emerald-500 font-black">+{(shockMagnitude * 0.8).toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, shockMagnitude * 2)}%` }}
                  />
                </div>
              </div>

              {/* Bar 2: Airlines & Aviation */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-clay-text">Commercial Airlines ($DAL, $UAL)</span>
                  <span className="text-rose-500 font-black">-{(shockMagnitude * 1.2).toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, shockMagnitude * 2.2)}%` }}
                  />
                </div>
              </div>

              {/* Bar 3: Freight & Logistics */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-clay-text">Freight & Logistics ($FDX)</span>
                  <span className="text-rose-500 font-black">-{(shockMagnitude * 0.7).toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, shockMagnitude * 1.5)}%` }}
                  />
                </div>
              </div>

              {/* Bar 4: Regional Banking */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-clay-text">Regional Lenders ($KRE)</span>
                  <span className="text-rose-500 font-black">-{(shockMagnitude * 0.4).toFixed(1)}%</span>
                </div>
                <div className="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, shockMagnitude * 1.1)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="clay-surface p-8 sm:p-14 text-center space-y-8 relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 clay-surface text-xs font-black text-blue-600 dark:text-blue-400">
              <Zap className="w-4 h-4 fill-blue-600 dark:fill-blue-400" />
              <span>Institutional Enterprise Access</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-clay-text leading-tight">
              Ready to Model Systemic Contagion?
            </h2>
            <p className="text-base sm:text-lg text-clay-text-muted max-w-xl mx-auto font-bold">
              Deploy autonomous causal graph intelligence to safeguard capital against multi-hop supply chain failures.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="clay-button-primary px-8 py-4 rounded-full font-black text-base flex items-center gap-2 shadow-xl"
            >
              <Activity className="w-5 h-5" />
              <span>Launch Graph Sandbox</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowWhitepaper(true)}
              className="clay-surface px-8 py-4 rounded-full font-black text-base text-clay-text flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Read Whitepaper</span>
            </button>
          </div>
        </section>
      </main>

      {/* Opaque Solid Claymorphic Footer Container */}
      <footer className="bg-[var(--clay-surface)] border-t border-[var(--clay-border,rgba(0,0,0,0.06))] rounded-t-3xl shadow-2xl py-10 px-6 sm:px-12 text-xs relative z-10 mt-20">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Row: Brand Logo, Brief Mission, & Simple Navigation Links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                  <Network className="w-5 h-5" />
                </div>
                <span className="font-black text-lg text-[var(--text-primary)]">
                  Financial<span className="text-[var(--accent-primary)]">Graph</span>
                </span>
              </div>
              <span className="hidden sm:inline text-[var(--text-secondary)]/40">|</span>
              <span className="text-xs font-bold text-[var(--text-secondary)]">
                Autonomous Market Contagion & Systemic Risk Graph
              </span>
            </div>

            <div className="flex items-center gap-6 font-bold text-[var(--text-secondary)]">
              <a href="#causal-engine" className="hover:text-[var(--accent-primary)] transition-colors">API Docs</a>
              <a href="#contagion-map" className="hover:text-[var(--accent-primary)] transition-colors">Methodology</a>
              <button onClick={() => setShowWhitepaper(true)} className="hover:text-[var(--accent-primary)] transition-colors">Privacy</button>
            </div>
          </div>

          {/* Bottom Row: Monospaced Copyright Notice & Regulatory Disclaimer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-black/5 dark:border-white/5 font-mono text-[11px] text-[var(--text-secondary)]">
            <div>
              &copy; 2026 FinancialGraph. Institutional Risk Engine.
            </div>
            <div className="text-[10px] text-[var(--text-secondary)]/80">
              SEC Rule 206(4)-7 Compliant • High-Frequency Causal Intelligence
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Whitepaper Modal */}
      {showWhitepaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="clay-surface max-w-2xl w-full p-6 sm:p-8 space-y-6 relative max-h-[85vh] overflow-y-auto shadow-2xl rounded-3xl">
            <div className="flex items-center justify-between border-b border-clay-border/40 pb-4">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-sm">
                <BookOpen className="w-5 h-5" />
                <span>Technical Whitepaper Summary</span>
              </div>
              <button
                onClick={() => setShowWhitepaper(false)}
                className="clay-surface p-2 rounded-full hover:scale-110 active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-clay-text leading-relaxed">
              <h3 className="text-xl font-black">Autonomous Financial Contagion Modeling via Multimodal Knowledge Graphs</h3>
              <p className="text-clay-text-muted font-bold">
                Abstract: Global economic interdependency exhibits non-linear systemic risk across commodities, sovereign treasuries, and derivative counterparty networks.
              </p>

              <div className="clay-inset p-4 rounded-2xl space-y-2 font-mono text-xs">
                <div className="font-extrabold text-blue-600 dark:text-blue-400">Core Formulation:</div>
                <div>{"P(Contagion) = \\sum_{k=1}^{H} \\beta_k \\cdot Impact(N_k) \\cdot e^{-\\lambda \\cdot \\Delta t}"}</div>
              </div>

              <div className="space-y-2 font-bold">
                <h4 className="font-extrabold">Key Architectural Highlights:</h4>
                <ul className="list-disc pl-5 space-y-1 text-clay-text-muted">
                  <li><strong>LLM & GNN Hybrid:</strong> Combines natural language entity extraction with Graph Neural Network message passing.</li>
                  <li><strong>Uncertainty Quantification:</strong> Dual scoring separating empirical historical disclosures from probabilistic inferences.</li>
                  <li><strong>Sub-12ms Latency:</strong> High-frequency GPU graph query pipeline tailored for trading desks.</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowWhitepaper(false)}
                className="clay-button-primary px-6 py-2.5 rounded-full font-black text-xs"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
