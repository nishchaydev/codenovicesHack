'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, THEME_LIST } from '@/context/ThemeContext';
import { Palette, Check, Sparkles } from 'lucide-react';

export function ThemeSelector() {
  const { theme, setTheme, activeMeta } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="clay-surface px-3 py-2 text-xs font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
        aria-label="Select Clay Theme Palette"
      >
        <span className="text-sm leading-none">{activeMeta.emoji}</span>
        <span className="hidden sm:inline font-black text-clay-text">
          {activeMeta.name}
        </span>
      </button>

      {isOpen && (
        <div className="clay-surface absolute top-12 right-0 w-64 sm:w-72 p-3 shadow-2xl z-50 rounded-3xl animate-in fade-in zoom-in-95 duration-150 border border-clay-border/40">
          <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-clay-text-muted border-b border-clay-border/40 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>4-Theme Color Engine</span>
            </span>
          </div>

          <div className="space-y-2">
            {THEME_LIST.map((item) => {
              const isSelected = theme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTheme(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-2xl text-xs transition-all duration-200 ${
                    isSelected
                      ? 'clay-button-primary text-white font-black shadow-md scale-[1.02]'
                      : 'clay-surface hover:scale-[1.01] text-clay-text'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 font-black">
                      <span className="text-base leading-none">{item.emoji}</span>
                      <span>{item.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <p
                    className={`text-[10px] mt-1 font-bold leading-snug line-clamp-2 ${
                      isSelected ? 'text-white/90' : 'text-clay-text-muted'
                    }`}
                  >
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
