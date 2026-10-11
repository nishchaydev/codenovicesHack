'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Terminal, Zap, Tag, FileText, CheckCircle2, ArrowRight, RefreshCw, Filter, Sparkles } from 'lucide-react';
import { useRouter } from '@/i18n/routing';

interface EventItem {
  id: string;
  source: string;
  timestamp: string;
  headline: string;
  summary: string;
  entities: { text: string; type: 'ORG' | 'GPE' | 'MONEY' | 'PERCENT' | 'PRODUCT' }[];
  impactScore: number;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

const mockEvents: EventItem[] = [
  {
    id: 'ev-1',
    source: 'Bloomberg Terminal',
    timestamp: '3 mins ago',
    headline: 'OPEC+ Signals Potential Emergency Production Cut Following Regional Tensions',
    summary: 'Delegates report emergency discussions regarding a 1.5M bpd output restriction to support crude oil price stability.',
    entities: [
      { text: 'OPEC+', type: 'ORG' },
      { text: '1.5M bpd', type: 'PRODUCT' },
      { text: 'Crude Oil', type: 'PRODUCT' },
      { text: '+12%', type: 'PERCENT' },
    ],
    impactScore: 9.1,
    sentiment: 'Bearish',
  },
  {
    id: 'ev-2',
    source: 'Reuters Financial',
    timestamp: '12 mins ago',
    headline: 'Federal Reserve Chairman Hints at Prolonged Terminal Interest Rate Stance',
    summary: 'Higher headline CPI energy pass-through risks require persistent rate pressure according to FOMC meeting minutes.',
    entities: [
      { text: 'Federal Reserve', type: 'ORG' },
      { text: '+50bps', type: 'PERCENT' },
      { text: 'USCPI', type: 'PRODUCT' },
    ],
    impactScore: 8.4,
    sentiment: 'Bearish',
  },
  {
    id: 'ev-3',
    source: 'SEC EDGAR 8-K',
    timestamp: '28 mins ago',
    headline: 'Global Container Shipping Fleet Announces Red Sea Transit Surcharges',
    summary: 'Vessel rerouting around Africa increases voyage duration by 14 days, raising bunker fuel costs per TEU container.',
    entities: [
      { text: 'Red Sea', type: 'GPE' },
      { text: '+14 Days', type: 'PRODUCT' },
      { text: '$1,200/TEU', type: 'MONEY' },
    ],
    impactScore: 7.8,
    sentiment: 'Bearish',
  },
];

export default function EventTerminalPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<EventItem>(mockEvents[0]);

  return (
    <DashboardShell breadcrumbPath={['Simulation', 'Event Terminal (NER)']}>
      <div className="space-y-6">
        {/* Terminal Header */}
        <div className="clay-glass p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl border border-clay-border/60">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 clay-glass-pill text-xs font-black text-clay-accent">
              <Terminal className="w-4 h-4" />
              <span>Real-Time Unstructured News & SEC NER Tagger</span>
            </div>
            <h1 className="text-2xl font-black text-clay-text">Event Extraction Terminal</h1>
            <p className="text-xs text-clay-text-muted font-medium">
              Parsing unstructured financial press releases, SEC 8-K disclosures, and news wire feeds into structured graph entities in &lt;12ms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/dashboard?event=${encodeURIComponent(selectedEvent.headline)}`)}
              className="clay-btn-accent px-5 py-2.5 rounded-full font-black text-xs flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Map Selected Event to Graph</span>
            </button>
          </div>
        </div>

        {/* 2-Column Event Feed & Entity Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live Event Feed List */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-extrabold uppercase tracking-wider text-clay-text-muted">
              <span>Live Ingested Feed Items ({events.length})</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Socket Connected
              </span>
            </div>

            <div className="space-y-3">
              {events.map((ev) => {
                const isSelected = selectedEvent.id === ev.id;
                return (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className={`w-full text-left p-5 rounded-3xl transition-all duration-200 border ${
                      isSelected
                        ? 'clay-btn-accent text-white scale-[1.01] shadow-xl'
                        : 'clay-glass text-clay-text hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-white/80' : 'text-clay-text-muted'}`}>
                        {ev.source} • {ev.timestamp}
                      </span>
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-rose-500/10 text-rose-500'}`}>
                        Impact {ev.impactScore}
                      </span>
                    </div>

                    <h3 className="font-black text-sm sm:text-base leading-tight mb-2">
                      {ev.headline}
                    </h3>

                    <p className={`text-xs leading-relaxed font-medium mb-3 line-clamp-2 ${isSelected ? 'text-white/90' : 'text-clay-text-muted'}`}>
                      {ev.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {ev.entities.map((ent, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10 text-clay-text'
                          }`}
                        >
                          [{ent.type}: {ent.text}]
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Entity Recognition Inspection Drawer */}
          <div className="lg:col-span-5">
            <div className="clay-glass p-6 rounded-3xl space-y-5 shadow-xl sticky top-20 border border-clay-border/60">
              <div className="flex items-center justify-between border-b border-clay-border/60 pb-3">
                <h3 className="font-black text-sm flex items-center gap-2 text-clay-text">
                  <Tag className="w-4 h-4 text-clay-accent" />
                  <span>NER Tagged Entity Details</span>
                </h3>
                <span className="clay-glass-pill text-[10px] font-bold text-clay-accent px-2.5 py-0.5">
                  Sub-12ms Latency
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-clay-text-muted">
                    {selectedEvent.source} • {selectedEvent.timestamp}
                  </span>
                  <h4 className="text-base font-black text-clay-text leading-tight">
                    {selectedEvent.headline}
                  </h4>
                </div>

                <div className="clay-inset p-3.5 rounded-2xl text-xs text-clay-text-muted leading-relaxed font-medium">
                  {selectedEvent.summary}
                </div>

                {/* Extracted Entity Badges Grid */}
                <div className="space-y-2">
                  <span className="text-xs font-black text-clay-text">Extracted Knowledge Graph Entities</span>
                  <div className="space-y-2">
                    {selectedEvent.entities.map((ent, idx) => (
                      <div key={idx} className="clay-glass-pill p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-clay-accent/20 text-clay-accent text-[10px] font-black">
                            {ent.type}
                          </span>
                          <span className="font-bold text-clay-text">{ent.text}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          99.4% Match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/dashboard?event=${encodeURIComponent(selectedEvent.headline)}`)}
                  className="w-full clay-btn-accent py-3 rounded-full font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all mt-4"
                >
                  <span>Build Causal Contagion Graph</span>
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
