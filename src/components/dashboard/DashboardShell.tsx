'use client';

import React, { useState } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { ThemeSelector } from '@/components/ThemeSelector';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  Network,
  Terminal,
  Sliders,
  GitBranch,
  Settings,
  Search,
  User,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
  Radio,
  Compass,
} from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
  breadcrumbPath?: string[];
}

export function DashboardShell({
  children,
  breadcrumbPath = ['Simulation', 'Energy Shock', 'OPEC+ Supply Contagion'],
}: DashboardShellProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { label: 'Graph Engine', href: '/dashboard', icon: Network, tooltip: 'Interactive React Flow node visualizer' },
    { label: 'News NLP Extractor', href: '/dashboard/events', icon: Terminal, tooltip: 'Extract entities & confidence from raw text' },
    { label: 'Stress Testing Matrix', href: '/dashboard/scenarios', icon: Sliders, tooltip: 'Adjust shock severity from +5% to +50%' },
    { label: 'Affected Assets Roster', href: '/dashboard/paths', icon: GitBranch, tooltip: 'Table of impacted tickers with risk score' },
    { label: 'Settings & Keys', href: '/dashboard/settings', icon: Settings, tooltip: 'API keys & engine configuration' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-clay-bg text-clay-text relative z-10">
      {/* Top Dashboard Nav Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-clay-border/40 bg-clay-bg/90 backdrop-blur-xl px-4 py-2.5">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle + Brand + Links to Overview & Live Feed + Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden clay-surface p-2 rounded-xl text-clay-text"
              aria-label="Toggle Navigation Sidebar"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="clay-surface p-1.5 text-[var(--accent-primary)] group-hover:scale-110 transition-transform">
                <Network className="w-4 h-4" />
              </div>
              <span className="font-black text-base tracking-tight hidden sm:inline text-[var(--text-primary)]">
                Financial<span className="text-[var(--accent-primary)]">Graph</span>
              </span>
            </Link>

            <span className="text-[var(--text-secondary)]/30 hidden md:inline">/</span>

            {/* Breadcrumbs / Current Shock Scenario */}
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
              {breadcrumbPath.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[var(--text-secondary)]/60" />}
                  <span className={idx === breadcrumbPath.length - 1 ? 'text-[var(--accent-primary)] font-black' : ''}>
                    {item}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Quick Search Bar (Cmd+K) */}
          <div className="hidden lg:flex items-center max-w-md w-full">
            <div className="clay-inset w-full px-4 py-2 flex items-center gap-2 rounded-full border border-[var(--clay-border)]">
              <Search className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quick search nodes, tickers, filings (Cmd+K)..."
                className="w-full bg-transparent border-none text-xs text-[var(--text-primary)] focus:outline-none placeholder:text-[var(--text-secondary)]/60 font-bold"
              />
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold text-[var(--text-secondary)] bg-black/5 dark:bg-white/10 rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Theme Toggle & User Avatar */}
          <div className="flex items-center gap-3 shrink-0">
            <ThemeSelector />

            {/* User Profile Avatar */}
            <div className="clay-card-solid p-1.5 flex items-center gap-2 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all">
              <div className="w-7 h-7 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline text-xs font-extrabold pr-2 text-[var(--text-primary)]">Inst. Desk</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex relative">
        {/* Left App Rail / Sidebar (Claymorphic Icon Dock with Tooltips) */}
        <aside
          className={`fixed lg:sticky top-[57px] z-30 h-[calc(100vh-57px)] clay-surface border-r border-clay-border/40 transition-all duration-300 p-3 flex flex-col justify-between ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          {/* Navigation Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2 py-1 text-[10px] font-black uppercase tracking-wider text-clay-text-muted">
              {!sidebarCollapsed && <span>App Dock</span>}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:block text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform"
                title={sidebarCollapsed ? 'Expand Dock' : 'Collapse Dock'}
              >
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-0' : 'rotate-180'}`} />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.tooltip}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 group relative ${
                      isActive
                        ? 'clay-button-primary text-white shadow-lg scale-[1.02]'
                        : 'clay-surface text-clay-text hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1'
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                    {!sidebarCollapsed && <span className="truncate font-black">{item.label}</span>}

                    {/* Tooltip for Collapsed State */}
                    {sidebarCollapsed && (
                      <div className="absolute left-16 px-3 py-1.5 clay-surface text-xs font-black whitespace-nowrap hidden group-hover:block z-50 shadow-xl border border-clay-border/40">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Engine Status Footnote */}
          {!sidebarCollapsed && (
            <div className="clay-inset p-3 rounded-2xl space-y-1 text-[10px] text-clay-text-muted font-bold">
              <div className="flex items-center gap-1.5 font-black text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>GNN Engine Active</span>
              </div>
              <p>50,000 Corporate Nodes • Latency 11.8ms</p>
            </div>
          )}
        </aside>

        {/* Main View Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
