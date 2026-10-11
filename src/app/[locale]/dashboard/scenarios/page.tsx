'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Sliders, Zap, ShieldAlert, BarChart3, TrendingDown, TrendingUp, RefreshCw, ArrowRight } from 'lucide-react';
import { useRouter } from '@/i18n/routing';

export default function ScenarioMatrixPage() {
  const router = useRouter();
  const [oilShock, setOilShock] = useState<number>(20);
  const [rateHike, setRateHike] = useState<number>(50);
  const [shippingDelay, setShippingDelay] = useState<number>(14);

  // Derived Scenario Risk Calculations
  const calculatedVar = (oilShock * 0.45 + rateHike * 0.12 + shippingDelay * 0.35).toFixed(1);
  const airlineDrawdown = (oilShock * 1.15 + rateHike * 0.2).toFixed(1);
  const energyGain = (oilShock * 0.85).toFixed(1);
  const reitDrawdown = (rateHike * 0.14 + shippingDelay * 0.2).toFixed(1);

  return (
    <DashboardShell breadcrumbPath={['Simulation', 'Scenario Matrix Sandbox']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="clay-glass p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl border border-clay-border/60">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 clay-glass-pill text-xs font-black text-clay-accent">
              <Sliders className="w-4 h-4" />
              <span>Multi-Variable Macro Stress-Test Matrix</span>
            </div>
            <h1 className="text-2xl font-black text-clay-text">Macro Scenario Sandbox</h1>
            <p className="text-xs text-clay-text-muted font-medium">
              Simulate compound systemic risk shocks across commodities, central bank interest rates, and global freight delays.
            </p>
          </div>

          <button
            onClick={() => router.push(`/dashboard?event=oil&shock=${oilShock}`)}
            className="clay-btn-accent px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Simulate Combined Scenario</span>
          </button>
        </div>

        {/* Sliders & Live Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Sliders Dock */}
          <div className="lg:col-span-5 space-y-5">
            <div className="clay-glass p-6 rounded-3xl space-y-6 shadow-xl border border-clay-border/60">
              <h3 className="text-sm font-black uppercase tracking-wider text-clay-text-muted border-b border-clay-border/60 pb-3">
                Macro Variable Controllers
              </h3>

              {/* Slider 1: Oil Price Shock */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-clay-text">Crude Oil Price Shock</span>
                  <span className="clay-glass-pill px-2.5 py-0.5 text-rose-500 font-mono font-black">
                    +{oilShock}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={oilShock}
                  onChange={(e) => setOilShock(Number(e.target.value))}
                  className="w-full accent-clay-accent cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-clay-text-muted">
                  <span>+5% Mild</span>
                  <span>+25% Moderate</span>
                  <span>+50% Crisis</span>
                </div>
              </div>

              {/* Slider 2: Fed Rate Hike */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-clay-text">Central Bank Terminal Rate Shift</span>
                  <span className="clay-glass-pill px-2.5 py-0.5 text-indigo-500 font-mono font-black">
                    +{rateHike}bps
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="25"
                  value={rateHike}
                  onChange={(e) => setRateHike(Number(e.target.value))}
                  className="w-full accent-clay-accent cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-clay-text-muted">
                  <span>0bps Hold</span>
                  <span>+75bps Hike</span>
                  <span>+150bps Shock</span>
                </div>
              </div>

              {/* Slider 3: Maritime Transit Delay */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-clay-text">Maritime Supply Chain Latency</span>
                  <span className="clay-glass-pill px-2.5 py-0.5 text-amber-500 font-mono font-black">
                    +{shippingDelay} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={shippingDelay}
                  onChange={(e) => setShippingDelay(Number(e.target.value))}
                  className="w-full accent-clay-accent cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-clay-text-muted">
                  <span>+2 Days</span>
                  <span>+14 Days</span>
                  <span>+30 Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Portfolio & Sector Impact Matrix */}
          <div className="lg:col-span-7 space-y-5">
            <div className="clay-glass p-6 rounded-3xl space-y-6 shadow-xl border border-clay-border/60">
              <div className="flex items-center justify-between border-b border-clay-border/60 pb-3">
                <h3 className="text-sm font-black text-clay-text flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-clay-accent" />
                  <span>Calculated Sector Impact & Value-at-Risk (VaR)</span>
                </h3>
                <span className="clay-glass-pill px-3 py-1 text-xs font-black text-rose-500">
                  Portfolio VaR 99%: -{calculatedVar}%
                </span>
              </div>

              <div className="space-y-4">
                {/* Sector 1: Commercial Airlines */}
                <div className="clay-glass-pill p-4 space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span>Commercial Airline Equities ($JETS)</span>
                    <span className="text-rose-500 font-mono font-black">-{airlineDrawdown}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Number(airlineDrawdown) * 2)}%` }}
                    />
                  </div>
                </div>

                {/* Sector 2: Upstream Energy */}
                <div className="clay-glass-pill p-4 space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span>Upstream Oil & Gas ($XLE)</span>
                    <span className="text-emerald-500 font-mono font-black">+{energyGain}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Number(energyGain) * 2.5)}%` }}
                    />
                  </div>
                </div>

                {/* Sector 3: REITs & Commercial Real Estate */}
                <div className="clay-glass-pill p-4 space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span>Commercial Real Estate ($VNQ)</span>
                    <span className="text-amber-500 font-mono font-black">-{reitDrawdown}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Number(reitDrawdown) * 2.2)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => router.push(`/dashboard?event=oil&shock=${oilShock}`)}
                  className="w-full clay-btn-accent py-3 rounded-full font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Launch Graph Sandbox for this Scenario</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
