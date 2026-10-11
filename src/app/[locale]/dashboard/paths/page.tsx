'use client';

import React from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { GitBranch, CheckCircle2, BrainCircuit, ArrowRight, Zap, Layers } from 'lucide-react';
import { useRouter } from '@/i18n/routing';

interface PathRoute {
  id: string;
  sourceNode: string;
  targetNode: string;
  hops: number;
  delay: string;
  confidence: number;
  classification: 'Verified Fact' | 'LLM Inferred';
  mechanism: string;
  impactScore: number;
}

const mockPaths: PathRoute[] = [
  {
    id: 'p-1',
    sourceNode: 'Strait of Hormuz Closure',
    targetNode: 'Energy & Refining ($XLE)',
    hops: 1,
    delay: '+48 Hours',
    confidence: 0.98,
    classification: 'Verified Fact',
    mechanism: 'Direct spot commodity crude supply constriction.',
    impactScore: 9.2,
  },
  {
    id: 'p-2',
    sourceNode: 'Energy & Refining ($XLE)',
    targetNode: 'Core CPI Inflation (USCPI)',
    hops: 2,
    delay: '+14 Days',
    confidence: 0.89,
    classification: 'Verified Fact',
    mechanism: 'Wholesale fuel PPI pass-through into consumer inflation.',
    impactScore: 8.5,
  },
  {
    id: 'p-3',
    sourceNode: 'Core CPI Inflation (USCPI)',
    targetNode: 'Commercial Airline Equities ($JETS)',
    hops: 3,
    delay: '+30 Days',
    confidence: 0.78,
    classification: 'LLM Inferred',
    mechanism: 'Macro inflation squeezing consumer discretionary travel.',
    impactScore: 7.4,
  },
  {
    id: 'p-4',
    sourceNode: 'Global Shipping ($SEA)',
    targetNode: 'Semiconductor Foundries ($TSMC)',
    hops: 2,
    delay: '+14 Days',
    confidence: 0.85,
    classification: 'LLM Inferred',
    mechanism: 'Shipping route delays bottlenecking fab chemical shipments.',
    impactScore: 7.9,
  },
];

export default function ContagionPathsPage() {
  const router = useRouter();

  return (
    <DashboardShell breadcrumbPath={['Simulation', 'Identified Contagion Paths']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="clay-glass p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl border border-clay-border/60">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 clay-glass-pill text-xs font-black text-clay-accent">
              <GitBranch className="w-4 h-4" />
              <span>Multi-Hop Transmission Route Table</span>
            </div>
            <h1 className="text-2xl font-black text-clay-text">Contagion Transmission Paths</h1>
            <p className="text-xs text-clay-text-muted font-medium">
              Audit all identified multi-hop routes across corporate, macro indicator, and sector nodes.
            </p>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="clay-btn-accent px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>View Interactive Graph</span>
          </button>
        </div>

        {/* Structured Table Container */}
        <div className="clay-glass rounded-3xl p-6 shadow-xl border border-clay-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-clay-border/60 text-clay-text-muted font-black uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Route ID</th>
                  <th className="py-3 px-4">Source Node &rarr; Target Node</th>
                  <th className="py-3 px-4">Hop Depth</th>
                  <th className="py-3 px-4">Transmission Delay</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clay-border/40 font-medium">
                {mockPaths.map((p) => (
                  <tr key={p.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-clay-accent">{p.id}</td>
                    <td className="py-4 px-4 font-bold text-clay-text">
                      <div className="flex items-center gap-2">
                        <span>{p.sourceNode}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-clay-accent shrink-0" />
                        <span>{p.targetNode}</span>
                      </div>
                      <div className="text-[10px] text-clay-text-muted mt-0.5 font-normal">{p.mechanism}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="clay-glass-pill px-2.5 py-0.5 text-[10px] font-mono font-black">
                        {p.hops} {p.hops === 1 ? 'Hop' : 'Hops'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold">{p.delay}</td>
                    <td className="py-4 px-4">
                      {p.classification === 'Verified Fact' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[10px] font-black inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Fact
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[10px] font-black inline-flex items-center gap-1">
                          <BrainCircuit className="w-3 h-3" /> Inferred
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono font-black text-clay-accent">
                      {(p.confidence * 100).toFixed(0)}%
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => router.push('/dashboard')}
                        className="clay-glass-pill px-3 py-1 text-[10px] font-black text-clay-text hover:text-clay-accent hover:scale-105"
                      >
                        Inspect Node
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
