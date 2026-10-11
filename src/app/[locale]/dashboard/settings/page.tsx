'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Settings, Key, Shield, Globe, Save, Check, Copy } from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('fg_live_8f92a10b4c892e31ff71e98d');
  const [copied, setCopied] = useState(false);
  const [gnnRegion, setGnnRegion] = useState('us-east-1');
  const [defaultThreshold, setDefaultThreshold] = useState<number>(75);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <DashboardShell breadcrumbPath={['Simulation', 'Settings & API Keys']}>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="clay-glass p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl border border-clay-border/60">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 clay-glass-pill text-xs font-black text-clay-accent">
              <Settings className="w-4 h-4" />
              <span>Platform Settings & API Configurations</span>
            </div>
            <h1 className="text-2xl font-black text-clay-text">Settings & Credentials</h1>
            <p className="text-xs text-clay-text-muted font-medium">
              Manage your institutional API keys, default confidence filters, and GPU cluster execution regions.
            </p>
          </div>

          <button
            onClick={handleSaveSettings}
            className="clay-btn-accent px-6 py-2.5 rounded-full font-black text-xs flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Settings Saved' : 'Save Changes'}</span>
          </button>
        </div>

        {/* API Keys Section */}
        <div className="clay-glass p-6 rounded-3xl space-y-4 shadow-xl border border-clay-border/60">
          <div className="flex items-center justify-between border-b border-clay-border/60 pb-3">
            <h3 className="font-black text-sm text-clay-text flex items-center gap-2">
              <Key className="w-4 h-4 text-clay-accent" />
              <span>Institutional API Keys</span>
            </h3>
            <span className="clay-glass-pill px-2.5 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
              Active Key
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-clay-text-muted">Production API Secret Token</label>
            <div className="clay-inset p-2 flex items-center gap-3 rounded-2xl">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="w-full bg-transparent border-none text-xs font-mono font-bold text-clay-text px-2 focus:outline-none"
              />
              <button
                onClick={handleCopyKey}
                className="clay-glass-pill px-4 py-1.5 text-xs font-black text-clay-accent flex items-center gap-1.5 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Key'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cluster & Region Settings */}
        <div className="clay-glass p-6 rounded-3xl space-y-4 shadow-xl border border-clay-border/60">
          <div className="flex items-center justify-between border-b border-clay-border/60 pb-3">
            <h3 className="font-black text-sm text-clay-text flex items-center gap-2">
              <Globe className="w-4 h-4 text-clay-accent" />
              <span>GNN Cluster & Default Parameters</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-clay-text-muted">GPU Cluster Region</label>
              <select
                value={gnnRegion}
                onChange={(e) => setGnnRegion(e.target.value)}
                className="clay-inset w-full p-3 text-xs font-bold text-clay-text rounded-2xl focus:outline-none bg-transparent"
              >
                <option value="us-east-1">US East (N. Virginia - Sub-12ms)</option>
                <option value="eu-west-1">EU West (Frankfurt - Sub-14ms)</option>
                <option value="ap-northeast-1">Asia Pacific (Tokyo - Sub-15ms)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-clay-text-muted">Default Confidence Threshold ({defaultThreshold}%)</label>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={defaultThreshold}
                onChange={(e) => setDefaultThreshold(Number(e.target.value))}
                className="w-full accent-clay-accent cursor-pointer mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
