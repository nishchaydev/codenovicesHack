'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ClayTheme = 'porcelain' | 'neon-pink' | 'electric-blue' | 'obsidian';

export interface ThemeMeta {
  id: ClayTheme;
  name: string;
  emoji: string;
  description: string;
  bgHex: string;
  accentHex: string;
  surfaceHex: string;
}

export const THEME_LIST: ThemeMeta[] = [
  {
    id: 'porcelain',
    name: 'Porcelain Matte',
    emoji: '⚪',
    description: 'Classic clean clay porcelain base (#F3F5F9), slate text, blue accents.',
    bgHex: '#F3F5F9',
    accentHex: '#3B82F6',
    surfaceHex: '#FFFFFF',
  },
  {
    id: 'neon-pink',
    name: 'Neon Pink Clay',
    emoji: '🌸',
    description: 'Vibrant bubblegum clay base (#FFF1F5), high-contrast magenta text & pink accents.',
    bgHex: '#FFF1F5',
    accentHex: '#EC4899',
    surfaceHex: '#FFE4EC',
  },
  {
    id: 'electric-blue',
    name: 'Royal Blue Clay',
    emoji: '🔷',
    description: 'Financial cyber blue base (#EFF6FF), deep navy text, royal blue accents.',
    bgHex: '#EFF6FF',
    accentHex: '#1D4ED8',
    surfaceHex: '#DBEAFE',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Clay',
    emoji: '🌑',
    description: 'Stealth dark matte base (#0E1117), crisp white text, sky cyan accents.',
    bgHex: '#0E1117',
    accentHex: '#38BDF8',
    surfaceHex: '#181D27',
  },
];

interface ThemeContextType {
  theme: ClayTheme;
  setTheme: (theme: ClayTheme) => void;
  activeMeta: ThemeMeta;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ClayTheme>('porcelain');

  useEffect(() => {
    const saved = localStorage.getItem('clay-theme') as ClayTheme;
    if (saved && THEME_LIST.some((t) => t.id === saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'porcelain');
    }
  }, []);

  const setTheme = (nextTheme: ClayTheme) => {
    setThemeState(nextTheme);
    localStorage.setItem('clay-theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const activeMeta = THEME_LIST.find((t) => t.id === theme) || THEME_LIST[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, activeMeta }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
