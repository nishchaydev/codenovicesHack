'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePathname, useRouter, locales, Locale } from '@/i18n/routing';
import { Globe, ChevronDown, Check } from 'lucide-react';

const localeDetails: Record<Locale, { name: string; nativeName: string; flag: string; dir: 'ltr' | 'rtl' }> = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  hi: { name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', dir: 'ltr' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  zh: { name: 'Mandarin', nativeName: '中文', flag: '🇨🇳', dir: 'ltr' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
};

interface LanguageSelectorProps {
  placement?: 'fixed' | 'inline';
}

export function LanguageSelector({ placement = 'fixed' }: LanguageSelectorProps) {
  const params = useParams();
  const currentLocale = (params?.locale as Locale) || 'en';
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLang = localeDetails[currentLocale] || localeDetails.en;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocale = (nextLocale: Locale) => {
    setIsOpen(false);
    document.documentElement.dir = localeDetails[nextLocale].dir;
    document.documentElement.lang = nextLocale;
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(en|hi|fr|es|de|ja|zh|ar)/, '');
    const targetPath = `/${nextLocale}${pathWithoutLocale || ''}`;
    window.location.href = targetPath;
  };

  const containerClass =
    placement === 'fixed'
      ? 'fixed bottom-6 right-6 z-50'
      : 'relative z-50';

  const dropdownClass =
    placement === 'fixed'
      ? 'clay-card-sm absolute bottom-14 right-0 w-64 p-2 shadow-2xl backdrop-blur-md z-50 animate-in fade-in slide-in-from-bottom-3 duration-200'
      : 'clay-card-sm absolute top-12 right-0 w-64 p-2 shadow-2xl backdrop-blur-md z-50 animate-in fade-in zoom-in-95 duration-200';

  return (
    <div ref={containerRef} className={containerClass}>
      {/* Selector Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="clay-btn flex items-center gap-2 px-3 py-2 text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label="Select Language"
      >
        <span className="flex items-center justify-center text-sm leading-none">
          {activeLang.flag}
        </span>
        <span className="hidden sm:inline-block font-semibold">{activeLang.nativeName}</span>
        <span className="sm:hidden font-bold uppercase">{currentLocale}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-clay-muted transition-transform duration-300 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={dropdownClass}>
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-clay-muted border-b border-clay-border mb-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-clay-accent" />
            <span>Select Language</span>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1 custom-scrollbar p-1">
            {locales.map((loc) => {
              const lang = localeDetails[loc];
              const isSelected = loc === currentLocale;

              return (
                <button
                  key={loc}
                  onClick={() => handleSelectLocale(loc)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isSelected
                      ? 'clay-btn-accent text-white font-semibold shadow-md'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-clay-text hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <div className="flex flex-col text-left">
                      <span className="leading-tight font-bold">{lang.nativeName}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-clay-muted'}`}>
                        {lang.name}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
