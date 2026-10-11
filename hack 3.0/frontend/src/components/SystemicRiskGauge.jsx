import React, { useState } from 'react';
import { 
  Activity, ArrowDownRight, ArrowUpRight, Zap, ChevronRight, 
  X, ShieldAlert, Sparkles, SlidersHorizontal, TrendingDown,
  Layers, ExternalLink, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SystemicRiskGauge() {
  const [activeTab, setActiveTab] = useState('stocks'); // 'stocks' | 'vectors'
  const [scenario, setScenario] = useState('active'); // 'mild' | 'active' | 'severe'
  const [selectedStock, setSelectedStock] = useState(null);

  // Scenario Multipliers
  const scenarios = {
    mild: {
      label: '+5% Shock',
      score: 48.5,
      severity: 'MODERATE RISK',
      severityColor: '#eab308',
      desc: 'Moderate energy uptick absorbed by corporate margins.',
      multiplier: 0.45
    },
    active: {
      label: '+14% Shock (Live)',
      score: 74.2,
      severity: 'ELEVATED RISK',
      severityColor: '#ef4444',
      desc: 'Crude futures rally (+14.2%) propagating across 3 hops.',
      multiplier: 1.0
    },
    severe: {
      label: '+30% Crisis',
      score: 93.4,
      severity: 'CRITICAL CONTAGION',
      severityColor: '#dc2626',
      desc: 'Severe stagflation shock. Multi-sector insolvency alerts.',
      multiplier: 1.85
    }
  };

  const currentScenario = scenarios[scenario];
  const riskScore = currentScenario.score;

  // Top 5 Vulnerable Stocks (Dynamic based on selected scenario)
  const baseStocks = [
    {
      id: 'INDIGO.NS',
      name: 'InterGlobe Aviation (IndiGo)',
      sector: 'Airlines',
      baseDelta: -11.8,
      baseVuln: 94.2,
      signal: 'Direct ATF Fuel Exposure',
      hop: 'Hop 1',
      beta: -0.82,
      r2: '91.4%',
      hedge: 'Initiate Brent crack-spread fuel swap hedges on MCX.'
    },
    {
      id: 'SPICEJET',
      name: 'SpiceJet Airlines',
      sector: 'Airlines',
      baseDelta: -16.4,
      baseVuln: 91.5,
      signal: 'Cash Flow & Lease Strain',
      hop: 'Hop 1',
      beta: -1.14,
      r2: '88.2%',
      hedge: 'High liquidity alert; reduce debt covenants & unhedged routes.'
    },
    {
      id: 'ASIANPAINT',
      name: 'Asian Paints Ltd',
      sector: 'Paints & Chemicals',
      baseDelta: -8.5,
      baseVuln: 88.4,
      signal: 'Solvent Feedstock Surge',
      hop: 'Hop 2',
      beta: -0.58,
      r2: '84.0%',
      hedge: 'Rebalance chemical raw inventory; forward purchase monomers.'
    },
    {
      id: 'AUTO_CHIPS',
      name: 'Auto Electronics Tier-1',
      sector: 'Auto Supply',
      baseDelta: -7.2,
      baseVuln: 81.0,
      signal: 'Freight & Power Tariffs',
      hop: 'Hop 2',
      beta: -0.49,
      r2: '79.5%',
      hedge: 'Buffer semiconductor logistics buffers; activate air freight.'
    },
    {
      id: 'BANK_NIFTY',
      name: 'Commercial Banking Index',
      sector: 'Financials',
      baseDelta: -4.5,
      baseVuln: 73.5,
      signal: 'Margin Squeeze via Rates',
      hop: 'Hop 3',
      beta: -0.36,
      r2: '76.2%',
      hedge: 'Short-duration Treasury hedge; monitor aviation loan books.'
    }
  ];

  const vulnerableStocks = baseStocks.map(stock => {
    const adjustedDelta = Number((stock.baseDelta * currentScenario.multiplier).toFixed(1));
    const adjustedVuln = Math.min(100, Number((stock.baseVuln * (0.6 + 0.4 * currentScenario.multiplier)).toFixed(1)));
    return {
      ...stock,
      delta: adjustedDelta,
      vulnerability: adjustedVuln,
      color: adjustedVuln > 90 ? '#ef4444' : (adjustedVuln > 80 ? '#f97316' : '#eab308')
    };
  });

  // Active Contagion Vectors
  const contagionVectors = [
    {
      from: 'Crude Oil (CL=F)',
      to: 'Airlines (INDIGO, SPICEJET)',
      transmission: 'Direct Aviation Turbine Fuel (ATF) Cost Spike',
      impact: `${( -11.8 * currentScenario.multiplier).toFixed(1)}% to ${( -16.4 * currentScenario.multiplier).toFixed(1)}%`,
      hops: 'Hop 0 ➔ Hop 1',
      speed: 'T+0 Immediate'
    },
    {
      from: 'Crude Oil (CL=F)',
      to: 'Paints (ASIANPAINT)',
      transmission: 'Titanium Dioxide & Petrochem Solvent Margins',
      impact: `${( -8.5 * currentScenario.multiplier).toFixed(1)}%`,
      hops: 'Hop 0 ➔ Hop 2',
      speed: 'T+2 Quarters'
    },
    {
      from: 'Shipping Freight Surcharges',
      to: 'Headline CPI & Banks',
      transmission: 'Consumer Basket Pass-Through & Rate Expectations',
      impact: `+${(1.8 * currentScenario.multiplier).toFixed(1)}% CPI`,
      hops: 'Hop 2 ➔ Hop 3',
      speed: 'Macro Propagation'
    }
  ];

  // Gauge Angle Calculation (-90deg at 0% to +90deg at 100%)
  const clampedScore = Math.min(Math.max(riskScore, 0), 100);
  const needleAngle = -90 + (clampedScore / 100) * 180;
  const arcLength = 226.2; // pi * 72
  const arcOffset = arcLength - (clampedScore / 100) * arcLength;

  return (
    <div style={{
      padding: '16px 18px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--panel2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ─── HEADER ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
          }}>
            <Activity size={17} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text)', lineHeight: 1.2, letterSpacing: '-0.2px' }}>
              AI Systemic Risk & Domino Radar
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: 2 }}>
              Contagion velocity & cross-asset vulnerability model
            </div>
          </div>
        </div>

        {/* Live Severity Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: `${currentScenario.severityColor}15`,
          border: `1px solid ${currentScenario.severityColor}35`,
          padding: '3px 9px', borderRadius: 20, fontSize: '10px', fontWeight: 800,
          color: currentScenario.severityColor
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: currentScenario.severityColor,
            boxShadow: `0 0 6px ${currentScenario.severityColor}`, animation: 'pulse 1.5s infinite'
          }} />
          {currentScenario.severity}
        </div>
      </div>

      {/* ─── SPEEDOMETER GAUGE & INTEL SUMMARY ───────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '175px 1fr',
        gap: 12,
        alignItems: 'center',
        background: 'var(--bg2)',
        borderRadius: 10,
        padding: '10px 12px',
        border: '1px solid var(--line)',
        marginBottom: 10
      }}>
        {/* Speedometer SVG */}
        <div style={{ position: 'relative', width: 175, height: 94, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg width="175" height="88" viewBox="0 0 180 94" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="35%" stopColor="#eab308" />
                <stop offset="70%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
              </filter>
            </defs>

            {/* Background Arc */}
            <path
              d="M 18 84 A 72 72 0 0 1 162 84"
              fill="none"
              stroke="var(--line)"
              strokeWidth="11"
              strokeLinecap="round"
            />

            {/* Active Colored Arc */}
            <path
              d="M 18 84 A 72 72 0 0 1 162 84"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="11"
              strokeDasharray={arcLength}
              strokeDashoffset={arcOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
            />

            {/* Scale Tick Markers */}
            <line x1="18" y1="84" x2="26" y2="84" stroke="var(--muted)" strokeWidth="1.5" />
            <line x1="90" y1="12" x2="90" y2="20" stroke="var(--muted)" strokeWidth="1.5" />
            <line x1="162" y1="84" x2="154" y2="84" stroke="var(--muted)" strokeWidth="1.5" />

            {/* Needle Pivot Assembly */}
            <g transform={`rotate(${needleAngle}, 90, 84)`} style={{ transition: 'transform 0.7s cubic-bezier(0.34, 1.4, 0.64, 1)' }}>
              <line 
                x1="90" y1="84" x2="90" y2="24" 
                stroke="#1e293b" strokeWidth="2.8" strokeLinecap="round" 
                filter="url(#needleGlow)" 
              />
              <polygon points="90,18 86,28 94,28" fill={currentScenario.severityColor} />
            </g>

            {/* Needle Pivot Cap */}
            <circle cx="90" cy="84" r="8" fill="#ffffff" stroke="var(--line)" strokeWidth="2" />
            <circle cx="90" cy="84" r="4.5" fill="#1e293b" />
            <circle cx="90" cy="84" r="1.5" fill={currentScenario.severityColor} />
          </svg>

          {/* Clean Risk Score Readout */}
          <div style={{ marginTop: -2, textAlign: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 900, color: currentScenario.severityColor, letterSpacing: '-0.5px' }}>
              {riskScore}
            </span>
            <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginLeft: 4 }}>
              / 100 Index
            </span>
          </div>
        </div>

        {/* Intelligence Context Block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: '#f59e0b' }}>⚠️</span>
            Commodity-to-Equity Contagion
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--muted2)', lineHeight: 1.35 }}>
            {currentScenario.desc}
          </div>

          {/* Quick Stat Tags */}
          <div style={{ display: 'flex', gap: 5, marginTop: 1, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: 4, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: 700, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              Root: CL=F (Crude)
            </span>
            <span style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: 4, background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', fontWeight: 700, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              3 Domino Hops
            </span>
            <span style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              94.2% AI Conf.
            </span>
          </div>
        </div>
      </div>

      {/* ─── SCENARIO SHOCK SIMULATOR BAR ────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px 8px',
        background: 'var(--bg2)',
        borderRadius: 8,
        border: '1px solid var(--line)',
        marginBottom: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '10px', fontWeight: 800, color: 'var(--muted)' }}>
          <SlidersHorizontal size={11} color="var(--accent)" />
          <span>SHOCK SCENARIO:</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {Object.entries(scenarios).map(([key, s]) => (
            <button
              key={key}
              onClick={() => setScenario(key)}
              style={{
                padding: '2px 7px',
                borderRadius: 4,
                fontSize: '10px',
                fontWeight: scenario === key ? 800 : 600,
                border: scenario === key ? `1px solid ${s.severityColor}` : '1px solid transparent',
                background: scenario === key ? `${s.severityColor}18` : 'transparent',
                color: scenario === key ? s.severityColor : 'var(--muted2)',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── TAB SWITCHER & EXPLORE LINK ─────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg2)', padding: '2px', borderRadius: 6, border: '1px solid var(--line)' }}>
          <button
            onClick={() => setActiveTab('stocks')}
            style={{
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: '10.5px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'stocks' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'stocks' ? '#ffffff' : 'var(--muted)',
              transition: 'all 0.15s'
            }}
          >
            🔥 Top 5 Exposed Equities
          </button>
          <button
            onClick={() => setActiveTab('vectors')}
            style={{
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: '10.5px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'vectors' ? 'var(--accent)' : 'transparent',
              color: activeTab === 'vectors' ? '#ffffff' : 'var(--muted)',
              transition: 'all 0.15s'
            }}
          >
            ⚡ Transmission Vectors
          </button>
        </div>

        <Link 
          to="/ai-hub"
          style={{
            fontSize: '10.5px',
            fontWeight: 700,
            color: 'var(--accent)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          View 3D Graph <ChevronRight size={12} />
        </Link>
      </div>

      {/* ─── TAB CONTENT (ULTRA-CLEAN DENSE CARDS) ────────────────── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        paddingRight: 2
      }}>
        {activeTab === 'stocks' ? (
          vulnerableStocks.map((stock, i) => (
            <div
              key={stock.id}
              onClick={() => setSelectedStock(stock)}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--line)',
                borderRadius: 7,
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.transform = 'translateX(2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--line)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              {/* Rank & Ticker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, minWidth: 0 }}>
                <span style={{
                  fontSize: '10.5px', fontWeight: 900, color: 'var(--muted)',
                  width: 16, textAlign: 'center'
                }}>
                  #{i + 1}
                </span>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {stock.name}
                    </span>
                    <span style={{
                      fontSize: '9px', fontWeight: 800, color: 'var(--accent)',
                      background: 'rgba(37, 99, 235, 0.08)', padding: '1px 4px', borderRadius: 3,
                      fontFamily: 'monospace'
                    }}>
                      {stock.id}
                    </span>
                  </div>
                  <div style={{ fontSize: '9.5px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                    <span>{stock.sector}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--muted2)' }}>{stock.signal}</span>
                  </div>
                </div>
              </div>

              {/* Hop Badge */}
              <span style={{
                fontSize: '9.5px', fontWeight: 700, color: 'var(--muted)',
                background: 'var(--panel2)', padding: '2px 5px', borderRadius: 4,
                border: '1px solid var(--line)', whiteSpace: 'nowrap'
              }}>
                {stock.hop}
              </span>

              {/* Delta & Meter */}
              <div style={{ width: 62, textAlign: 'right', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, fontSize: '11.5px', fontWeight: 900, color: stock.color }}>
                  <ArrowDownRight size={12} />
                  {stock.delta}%
                </div>
                <div style={{
                  height: 3, background: 'var(--line)', borderRadius: 2, marginTop: 2, overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%', width: `${stock.vulnerability}%`, background: stock.color,
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            </div>
          ))
        ) : (
          contagionVectors.map((vec, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg2)',
                border: '1px solid var(--line)',
                borderRadius: 7,
                padding: '7px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 3
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--text)' }}>
                  {vec.from} ➔ {vec.to}
                </span>
                <span style={{
                  fontSize: '10.5px', fontWeight: 900, padding: '1px 5px', borderRadius: 4,
                  background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444'
                }}>
                  {vec.impact}
                </span>
              </div>
              <div style={{ fontSize: '10px', color: 'var(--muted2)' }}>
                {vec.transmission}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                <span style={{ fontSize: '9px', color: 'var(--accent)', fontWeight: 800 }}>
                  {vec.hops}
                </span>
                <span style={{ fontSize: '9px', color: 'var(--muted)', fontWeight: 600 }}>
                  ⚡ {vec.speed}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ─── FOOTER LAUNCH ACTION ─────────────────────────────────── */}
      <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid var(--line)' }}>
        <Link
          to="/ai-hub"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            background: 'var(--accent)',
            color: '#fff',
            padding: '7px 12px',
            borderRadius: 7,
            fontSize: '11.5px',
            fontWeight: 800,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
        >
          <Zap size={13} />
          Trace Domino Shock in Contagion Lab
        </Link>
      </div>

      {/* ─── INTERACTIVE STOCK INSPECTOR DRAWER (MODAL) ──────────── */}
      {selectedStock && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: 50,
          animation: 'fadeIn 0.15s ease'
        }}>
          <div style={{
            background: 'var(--panel2)',
            width: '100%',
            borderRadius: '12px 12px 0 0',
            padding: '16px',
            borderTop: '2px solid var(--accent)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text)' }}>
                  {selectedStock.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', display: 'flex', gap: 6, marginTop: 2 }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>{selectedStock.id}</span>
                  <span>•</span>
                  <span>{selectedStock.sector}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStock(null)}
                style={{
                  background: 'var(--bg2)', border: '1px solid var(--line)',
                  borderRadius: '50%', width: 26, height: 26,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', padding: 0
                }}
              >
                <X size={14} color="var(--text)" />
              </button>
            </div>

            {/* Regression Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
              background: 'var(--bg2)',
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid var(--line)'
            }}>
              <div>
                <div style={{ fontSize: '9px', color: 'var(--muted)', fontWeight: 700 }}>PREDICTED DROP</div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: selectedStock.color }}>{selectedStock.delta}%</div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: 'var(--muted)', fontWeight: 700 }}>REGRESSION BETA</div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--text)' }}>β = {selectedStock.beta}</div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: 'var(--muted)', fontWeight: 700 }}>R² ACCURACY</div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#10b981' }}>{selectedStock.r2}</div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.2)', padding: '8px 10px', borderRadius: 8 }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={11} /> AI MITIGATION RECOMMENDATION:
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text)', marginTop: 3, lineHeight: 1.35 }}>
                {selectedStock.hedge}
              </div>
            </div>

            {/* Close & Trace Action */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setSelectedStock(null)}
                style={{ flex: 1, padding: '6px', fontSize: '11px', fontWeight: 700 }}
              >
                Dismiss
              </button>
              <Link
                to={`/detective`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  background: 'var(--accent)',
                  color: '#fff',
                  padding: '6px',
                  borderRadius: 6,
                  fontSize: '11px',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                Deep Graph Trace <ExternalLink size={11} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
