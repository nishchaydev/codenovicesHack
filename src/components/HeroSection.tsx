'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { HeroCanvas } from './HeroCanvas';
import { Zap, Search, TrendingUp } from 'lucide-react';
import gsap from 'gsap';

const presets = [
  { id: 'oil', label: 'Crude Oil +12%', query: 'oil' },
  { id: 'fed', label: 'Fed Rate Hike 50bps', query: 'fed' },
  { id: 'taiwan', label: 'Taiwan Strait Conflict', query: 'semi' },
];

import { useTranslations } from '@/i18n/useTranslations';

export function HeroSection() {
  const router = useRouter();
  const tHero = useTranslations('hero');
  const [shockQuery, setShockQuery] = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Parallax Layer Refs
  const sectionRef = useRef<HTMLDivElement>(null);
  const layer1CanvasRef = useRef<HTMLDivElement>(null);
  const layer2CardRef = useRef<HTMLDivElement>(null);

  // GSAP Mouse Parallax Handler
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;

      if (layer1CanvasRef.current) {
        gsap.to(layer1CanvasRef.current, {
          x: x * 15,
          y: y * 15,
          duration: 1,
          ease: 'power2.out',
        });
      }

      if (layer2CardRef.current) {
        gsap.to(layer2CardRef.current, {
          x: x * 20,
          y: y * 20,
          rotateY: x * 2,
          rotateX: -y * 2,
          duration: 1.2,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSelectPreset = (preset: typeof presets[0]) => {
    setActivePreset(preset.id);
    setShockQuery(preset.label);
  };

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    const eventParam = shockQuery ? encodeURIComponent(shockQuery) : 'oil';
    router.push(`/dashboard?event=${eventParam}`);
  };

  return (
    <div
      ref={sectionRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-32 pb-12 px-4 sm:px-6 lg:px-8 perspective-1000"
    >
      {/* Primary Solid Clay Hero Card */}
      <div className="relative z-10 max-w-4xl w-full mx-auto">
        <div
          ref={layer2CardRef}
          className="clay-card-solid max-w-4xl mx-auto px-10 py-12 space-y-8 relative overflow-hidden"
        >
          {/* Top Badge Pill */}
          <div className="flex items-center justify-center">
            <div className="clay-card-solid px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold text-[var(--accent-primary)] flex items-center gap-2.5 shadow-sm">
              <Zap className="w-4 h-4 fill-[var(--accent-primary)] animate-pulse" />
              <span>⚡ {tHero('badge') || 'Autonomous Shock Intelligence Engine'}</span>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.1]">
              {tHero('title') || 'Systemic Risk Graph & Network Analytics'}
            </h1>
            <p className="text-base sm:text-lg font-bold text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              {tHero('subtitle') || 'Trace financial shocks across sectors, commodities, and institutions.'}
            </p>
          </div>

          {/* Interactive Search Input inside .clay-inset with bold tactile simulation button */}
          <form onSubmit={handleRunSimulation} className="max-w-2xl mx-auto space-y-5">
            <div className="clay-inset rounded-full px-6 py-4 flex items-center gap-3 transition-transform duration-200">
              <div className="text-[var(--accent-primary)] shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={shockQuery}
                onChange={(e) => {
                  setShockQuery(e.target.value);
                  setActivePreset(null);
                }}
                placeholder="Enter financial shock (e.g. Crude Oil +12%, Fed Rate Hike)..."
                className="w-full bg-transparent border-none text-[var(--text-primary)] text-sm sm:text-base focus:outline-none placeholder:text-[var(--text-secondary)]/60 font-bold px-1"
              />
              <button
                type="submit"
                className="bg-[var(--accent-primary)] text-white font-semibold rounded-full px-7 py-3 text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap hover:opacity-95 transition-opacity shadow-md shrink-0"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Run Causal Simulation</span>
              </button>
            </div>

            {/* Presets: Tactile solid clay pills that populate search box on click */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <span className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider mr-1">
                Presets:
              </span>
              {presets.map((preset) => {
                const isActive = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`clay-card-solid py-2 px-5 rounded-full text-xs font-semibold hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1.5 ${
                      isActive ? 'text-[var(--accent-primary)] font-bold ring-2 ring-[var(--accent-primary)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    <TrendingUp className={`w-3.5 h-3.5 ${isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`} />
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

