'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { ThemeSelector } from './ThemeSelector';
import { LanguageSelector } from './LanguageSelector';
import { Network, ArrowRight } from 'lucide-react';

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
      <div 
        className="pointer-events-auto max-w-5xl mx-auto mt-4 px-8 py-3.5 rounded-full flex items-center justify-between bg-[var(--clay-surface)] border border-[var(--clay-border)] transition-all duration-300"
        style={{
          boxShadow: '0 10px 30px var(--clay-shadow-dark)',
        }}
      >
        {/* Left: Brand Logo + Small Pulsing Dot Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] group-hover:scale-110 transition-transform">
              <Network className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl tracking-tight text-[var(--text-primary)]">
                Financial<span className="text-[var(--accent-primary)]">Graph</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Engine Operational" />
            </div>
          </Link>
        </div>

        {/* Center: 2 Core Navigation Anchors */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold">
          <a
            href="#contagion-map"
            className="transition-colors text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-bold"
          >
            Contagion Map
          </a>
          <a
            href="#causal-engine"
            className="transition-colors text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-bold"
          >
            Documentation
          </a>
        </nav>

        {/* Right Controls: Theme Toggle, Language Switcher, Launch App CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <ThemeSelector />
          <LanguageSelector placement="inline" />

          <Link
            href="/dashboard"
            className="bg-[var(--accent-primary)] text-white font-black px-5 py-2.5 text-xs rounded-full flex items-center gap-1.5 whitespace-nowrap shadow-md hover:opacity-95 transition-opacity"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5 font-black" />
          </Link>
        </div>
      </div>
    </header>
  );
}


