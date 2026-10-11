import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, GitFork, Maximize2, ArrowDownRight, ArrowUpRight, 
  ArrowDown, ChevronRight, FileSignature, Check, ShieldAlert, 
  Zap, Layers, ExternalLink, Activity, Info
} from 'lucide-react';
import { Network as VisNetwork } from 'vis-network/standalone';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// ─── 3 PRESET MARKET SHOCK DATASETS ──────────────────────────────────────────
const PRESET_VOUCHERS = [
  {
    id: 'oil-shock',
    title: 'Crude Oil Supply Shock',
    tag: 'ENERGY & TRANSPORT',
    voucherCode: 'FIN-VOUCHER-OIL-01',
    accentColor: '#ef4444',
    root: { 
      id: "CL=F", 
      name: "Crude Oil Futures", 
      sector: "Commodities", 
      baseShock: 14.2, 
      displayShock: "+14.2%", 
      role: "Trigger Commodity",
      summary: "Global benchmark crude spikes due to geopolitical embargo and output constraints."
    },
    tier1Title: "Direct Cost & Supply Contagion",
    tier2Title: "Secondary Cascading Ripple",
    tier3Title: "Terminal Macroeconomic Pass-Through",
    impacts: [
      { 
        id: "INDIGO.NS", 
        name: "InterGlobe Aviation (IndiGo)", 
        sector: "Airlines", 
        baseImpact: -11.8, 
        channel: "Direct Fuel Cost Surge", 
        hop: 1, 
        parentId: "CL=F",
        confidence: "94.2%", 
        beta: -0.83,
        explanation: "Aviation Turbine Fuel (ATF) represents 40%+ of airline operating expenses. A +14.2% jump in crude immediately contracts airline operating margins.",
        timeSeries: [
          { day: "T-5", price: 4420 }, { day: "T-4", price: 4410 }, { day: "T-3", price: 4435 },
          { day: "T-2", price: 4390 }, { day: "T-1", price: 4380 }, { day: "Shock T0", price: 3865 }
        ]
      },
      { 
        id: "SPICEJET", 
        name: "SpiceJet Airlines", 
        sector: "Airlines", 
        baseImpact: -16.4, 
        channel: "Cash Flow & Lease Strain", 
        hop: 1, 
        parentId: "CL=F",
        confidence: "91.5%", 
        beta: -1.15,
        explanation: "Thinner operating buffers exacerbate volatility; fuel supplier credit lines are curtailed on spot oil surges.",
        timeSeries: [
          { day: "T-5", price: 62.4 }, { day: "T-4", price: 61.8 }, { day: "T-3", price: 62.0 },
          { day: "T-2", price: 61.2 }, { day: "T-1", price: 60.5 }, { day: "Shock T0", price: 50.5 }
        ]
      },
      { 
        id: "ASIANPAINT", 
        name: "Asian Paints Ltd", 
        sector: "Paints & Chemicals", 
        baseImpact: -8.5, 
        channel: "Petrochemical Solvent Cost", 
        hop: 2, 
        parentId: "CL=F",
        confidence: "88.4%", 
        beta: -0.60,
        explanation: "Titanium dioxide and petroleum-derived solvent feedstocks rise with crude, hurting gross profit margins in 30-60 days.",
        timeSeries: [
          { day: "T-5", price: 2880 }, { day: "T-4", price: 2875 }, { day: "T-3", price: 2890 },
          { day: "T-2", price: 2860 }, { day: "T-1", price: 2850 }, { day: "Shock T0", price: 2608 }
        ]
      },
      { 
        id: "LOGISTICS_SEC", 
        name: "Freight & Shipping Logistics", 
        sector: "Logistics", 
        baseImpact: 6.8, 
        channel: "Freight Surcharge Pass-Through", 
        hop: 2, 
        parentId: "INDIGO.NS",
        confidence: "86.1%", 
        beta: 0.48,
        explanation: "Logistics carriers invoke contractual fuel surcharges, insulating short-term revenues while shifting costs down to shippers.",
        timeSeries: [
          { day: "T-5", price: 110 }, { day: "T-4", price: 111 }, { day: "T-3", price: 110.5 },
          { day: "T-2", price: 112 }, { day: "T-1", price: 113 }, { day: "Shock T0", price: 120.7 }
        ]
      },
      { 
        id: "CPI_INFLATION", 
        name: "Headline CPI Inflation", 
        sector: "Macroeconomic Indicator", 
        baseImpact: 1.8, 
        channel: "Terminal Pass-Through Ripple", 
        hop: 3, 
        parentId: "LOGISTICS_SEC",
        confidence: "96.7%", 
        beta: 0.13,
        explanation: "Cumulative energy cost pressure trickles into broader consumer baskets, forcing central banks toward tighter monetary stances.",
        timeSeries: [
          { day: "T-5", price: 5.1 }, { day: "T-4", price: 5.1 }, { day: "T-3", price: 5.2 },
          { day: "T-2", price: 5.2 }, { day: "T-1", price: 5.2 }, { day: "Shock T0", price: 6.9 }
        ]
      }
    ]
  },
  {
    id: 'chip-boom',
    title: 'Semiconductor Export Embargo',
    tag: 'GLOBAL TECH HARDWARE',
    voucherCode: 'FIN-VOUCHER-SEMI-02',
    accentColor: '#3b82f6',
    root: { 
      id: "SEMI", 
      name: "Semiconductor Index", 
      sector: "Tech Hardware", 
      baseShock: 18.6, 
      displayShock: "+18.6%", 
      role: "Trigger Tech Index",
      summary: "Export embargo chokes component availability and multiplies spot foundry pricing."
    },
    tier1Title: "Foundry Cost & Supply Bottleneck",
    tier2Title: "Downstream Hardware Margin Pinch",
    tier3Title: "Global Technology Infrastructure Capex",
    impacts: [
      { 
        id: "AAPL", 
        name: "Apple Inc", 
        sector: "Consumer Tech", 
        baseImpact: -4.2, 
        channel: "Device BOM & Lead-Times", 
        hop: 1, 
        parentId: "SEMI",
        confidence: "93.4%", 
        beta: -0.42,
        explanation: "Hardware gross margins experience compression as custom silicon fabrication lead times and foundry bills climb.",
        timeSeries: [
          { day: "T-5", price: 228 }, { day: "T-4", price: 230 }, { day: "T-3", price: 231 },
          { day: "T-2", price: 229 }, { day: "T-1", price: 230 }, { day: "Shock T0", price: 220 }
        ]
      },
      { 
        id: "MSFT", 
        name: "Microsoft Cloud & AI", 
        sector: "Enterprise Software", 
        baseImpact: -3.1, 
        channel: "Data Center Server Capex Hike", 
        hop: 1, 
        parentId: "SEMI",
        confidence: "94.8%", 
        beta: -0.31,
        explanation: "Cloud hyperscalers face delayed server rack deployments and higher accelerator acquisition bills.",
        timeSeries: [
          { day: "T-5", price: 420 }, { day: "T-4", price: 422 }, { day: "T-3", price: 425 },
          { day: "T-2", price: 424 }, { day: "T-1", price: 423 }, { day: "Shock T0", price: 410 }
        ]
      },
      { 
        id: "AUTO_CHIPS", 
        name: "Auto Electronics Tier-1", 
        sector: "Automotive Supply", 
        baseImpact: -9.5, 
        channel: "Assembly Line Stoppages", 
        hop: 2, 
        parentId: "AAPL",
        confidence: "89.2%", 
        beta: -0.78,
        explanation: "Microcontroller scarcity triggers assembly slowdowns across electric and autonomous vehicle plants.",
        timeSeries: [
          { day: "T-5", price: 84 }, { day: "T-4", price: 85 }, { day: "T-3", price: 84.5 },
          { day: "T-2", price: 84 }, { day: "T-1", price: 83.5 }, { day: "Shock T0", price: 75.6 }
        ]
      },
      { 
        id: "TCS.NS", 
        name: "TCS Enterprise AI", 
        sector: "IT Services", 
        baseImpact: 5.4, 
        channel: "Legacy System Re-architecture", 
        hop: 2, 
        parentId: "MSFT",
        confidence: "85.0%", 
        beta: 0.35,
        explanation: "Enterprises contract system integrators to refactor chip workloads to multi-cloud and edge architectures.",
        timeSeries: [
          { day: "T-5", price: 3950 }, { day: "T-4", price: 3960 }, { day: "T-3", price: 3940 },
          { day: "T-2", price: 3970 }, { day: "T-1", price: 3980 }, { day: "Shock T0", price: 4195 }
        ]
      },
      { 
        id: "TECH_CAPEX", 
        name: "Headline Tech Infrastructure PPI", 
        sector: "Macro Capex Indicator", 
        baseImpact: 12.0, 
        channel: "Terminal Strategic Re-rating", 
        hop: 3, 
        parentId: "AUTO_CHIPS",
        confidence: "91.8%", 
        beta: 0.65,
        explanation: "Fortune 500 corporations raise sovereign tech infrastructure allocation to secure guaranteed supply pipelines.",
        timeSeries: [
          { day: "T-5", price: 100 }, { day: "T-4", price: 101 }, { day: "T-3", price: 100.5 },
          { day: "T-2", price: 102 }, { day: "T-1", price: 103 }, { day: "Shock T0", price: 115.4 }
        ]
      }
    ]
  },
  {
    id: 'rate-cut',
    title: 'Central Bank Emergency Rate Cut',
    tag: 'MONETARY POLICY',
    voucherCode: 'FIN-VOUCHER-RATES-03',
    accentColor: '#10b981',
    root: { 
      id: "FED_FUNDS", 
      name: "Benchmark Policy Rate", 
      sector: "Central Bank Indicator", 
      baseShock: -50, 
      displayShock: "-50 bps", 
      role: "Monetary Rate Pivot",
      summary: "Central bank implements emergency easing to spur credit liquidity and consumer spending."
    },
    tier1Title: "Direct Financial & Liquidity Transmission",
    tier2Title: "Secondary Credit & Asset Expansion",
    tier3Title: "Terminal Sovereign Yield Repricing",
    impacts: [
      { 
        id: "BANK_NIFTY", 
        name: "Banking Sector Index", 
        sector: "Commercial Banking", 
        baseImpact: -4.5, 
        channel: "Net Interest Margin (NIM) Compression", 
        hop: 1, 
        parentId: "FED_FUNDS",
        confidence: "92.6%", 
        beta: -0.62,
        explanation: "Immediate downward repricing on floating-rate corporate and personal loans precedes lag in retail deposit cost cuts.",
        timeSeries: [
          { day: "T-5", price: 51200 }, { day: "T-4", price: 51400 }, { day: "T-3", price: 51300 },
          { day: "T-2", price: 51500 }, { day: "T-1", price: 51600 }, { day: "Shock T0", price: 49278 }
        ]
      },
      { 
        id: "REALTY_SEC", 
        name: "Commercial & Residential Real Estate", 
        sector: "Real Estate", 
        baseImpact: 11.2, 
        channel: "Mortgage Refinancing & Housing Demand", 
        hop: 1, 
        parentId: "FED_FUNDS",
        confidence: "89.5%", 
        beta: 1.18,
        explanation: "Cheaper housing loans sharply reduce EMIs, sparking rapid revival in home booking velocity and developer liquidity.",
        timeSeries: [
          { day: "T-5", price: 820 }, { day: "T-4", price: 825 }, { day: "T-3", price: 818 },
          { day: "T-2", price: 830 }, { day: "T-1", price: 835 }, { day: "Shock T0", price: 928 }
        ]
      },
      { 
        id: "NBFC_LENDERS", 
        name: "Housing Finance NBFCs", 
        sector: "Credit & Mortgage", 
        baseImpact: 8.6, 
        channel: "Accelerated Loan Disbursal Growth", 
        hop: 2, 
        parentId: "BANK_NIFTY",
        confidence: "87.3%", 
        beta: 0.92,
        explanation: "Wholesale bond refinancing yields collapse, enabling non-bank lenders to expand loan margins rapidly.",
        timeSeries: [
          { day: "T-5", price: 460 }, { day: "T-4", price: 462 }, { day: "T-3", price: 458 },
          { day: "T-2", price: 465 }, { day: "T-1", price: 468 }, { day: "Shock T0", price: 508 }
        ]
      },
      { 
        id: "AUTO_SECTOR", 
        name: "Automobile Manufacturers", 
        sector: "Consumer Discretionary", 
        baseImpact: 5.4, 
        channel: "Auto-Loan Rate Relief", 
        hop: 2, 
        parentId: "REALTY_SEC",
        confidence: "86.0%", 
        beta: 0.58,
        explanation: "Lower vehicle loan interest rates encourage consumer retail purchases and fleet renewals.",
        timeSeries: [
          { day: "T-5", price: 1540 }, { day: "T-4", price: 1545 }, { day: "T-3", price: 1550 },
          { day: "T-2", price: 1560 }, { day: "T-1", price: 1570 }, { day: "Shock T0", price: 1625 }
        ]
      },
      { 
        id: "GOVT_BONDS", 
        name: "10-Year Sovereign Benchmark Yield", 
        sector: "Fixed Income", 
        baseImpact: -28.0, 
        channel: "Yield Curve Inversion Flattening", 
        hop: 3, 
        parentId: "NBFC_LENDERS",
        confidence: "97.4%", 
        beta: 0.85,
        explanation: "Institutional debt markets rally as bond capital values surge in response to benchmark rate cut.",
        timeSeries: [
          { day: "T-5", price: 7.15 }, { day: "T-4", price: 7.14 }, { day: "T-3", price: 7.15 },
          { day: "T-2", price: 7.12 }, { day: "T-1", price: 7.10 }, { day: "Shock T0", price: 6.82 }
        ]
      }
    ]
  }
];

export default function AIHub() {
  const [activeVoucher, setActiveVoucher] = useState(PRESET_VOUCHERS[0]);
  const [selectedNode, setSelectedNode] = useState(PRESET_VOUCHERS[0].impacts[0]);
  const [graphViewMode, setGraphViewMode] = useState('diagram'); // 'diagram' | 'network'

  const graphContainerRef = useRef(null);
  const networkInstanceRef = useRef(null);

  const handleSelectVoucher = (v) => {
    setActiveVoucher(v);
    setSelectedNode(v.impacts[0]);
  };

  // Vis-Network initialization
  useEffect(() => {
    if (graphViewMode !== 'network' || !graphContainerRef.current) return;

    const root = activeVoucher.root;
    const impacts = activeVoucher.impacts;

    const nodes = [
      {
        id: root.id,
        level: 0,
        label: `🚨 PRIMARY TRIGGER SHOCK (HOP 0)\n${root.name}\n${root.displayShock} Price Shock`,
        color: { 
          background: '#dc2626', 
          border: '#991c1c', 
          highlight: { background: '#ef4444', border: '#ffffff' } 
        },
        font: { color: '#ffffff', size: 13, bold: true, face: 'Inter, system-ui, sans-serif' },
        shape: 'box',
        shapeProperties: { borderRadius: 10 },
        margin: { top: 14, right: 20, bottom: 14, left: 20 },
        shadow: { enabled: true, color: 'rgba(220, 38, 38, 0.4)', size: 16, x: 0, y: 4 }
      },
      ...impacts.map(item => {
        const isSelected = selectedNode?.id === item.id;
        const currentImpact = item.baseImpact.toFixed(1);
        const isNegative = Number(currentImpact) < 0;
        return {
          id: item.id,
          level: item.hop,
          label: `HOP ${item.hop} • ${item.sector.toUpperCase()}\n${item.name}\n${isNegative ? '🔻' : '🔺'} ${isNegative ? '' : '+'}${currentImpact}% Shock  |  ${item.confidence} Conf.`,
          color: {
            background: isSelected ? '#0f172a' : (isNegative ? '#fef2f2' : '#f0fdf4'),
            border: isSelected ? '#2563eb' : (isNegative ? '#f87171' : '#34d399'),
            highlight: {
              background: isSelected ? '#0f172a' : (isNegative ? '#fee2e2' : '#dcfce7'),
              border: '#2563eb'
            }
          },
          font: {
            color: isSelected ? '#ffffff' : (isNegative ? '#991b1b' : '#065f46'),
            size: 11,
            bold: true,
            face: 'Inter, system-ui, sans-serif'
          },
          shape: 'box',
          shapeProperties: { borderRadius: 8 },
          margin: { top: 12, right: 16, bottom: 12, left: 16 },
          borderWidth: isSelected ? 3 : 2,
          shadow: { enabled: true, color: 'rgba(0,0,0,0.06)', size: 8, x: 0, y: 2 }
        };
      })
    ];

    const edges = impacts.map(item => ({
      from: item.parentId || root.id,
      to: item.id,
      label: item.channel,
      arrows: { to: { enabled: true, scaleFactor: 0.9, type: 'arrow' } },
      font: {
        size: 11,
        align: 'horizontal',
        color: '#0f172a',
        background: '#ffffff',
        strokeWidth: 2,
        strokeColor: '#cbd5e1',
        face: 'Inter, system-ui, sans-serif'
      },
      color: { color: '#64748b', highlight: '#2563eb' },
      width: 2.5,
      smooth: { type: 'cubicBezier', forceDirection: 'vertical', roundness: 0.4 }
    }));

    const options = {
      layout: {
        hierarchical: {
          enabled: true,
          direction: 'UD',
          sortMethod: 'directed',
          levelSeparation: 160,
          nodeSpacing: 280,
          treeSpacing: 300,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true
        }
      },
      physics: { enabled: false },
      interaction: { hover: true, tooltipDelay: 100, zoomView: true, dragView: true }
    };

    if (networkInstanceRef.current) {
      networkInstanceRef.current.destroy();
    }

    networkInstanceRef.current = new VisNetwork(graphContainerRef.current, { nodes, edges }, options);
    setTimeout(() => {
      networkInstanceRef.current?.fit();
    }, 120);

    networkInstanceRef.current.on('click', (params) => {
      if (params.nodes.length > 0) {
        const clickedId = params.nodes[0];
        const match = impacts.find(i => i.id === clickedId);
        if (match) setSelectedNode(match);
      }
    });

    return () => {
      if (networkInstanceRef.current) {
        networkInstanceRef.current.destroy();
        networkInstanceRef.current = null;
      }
    };
  }, [graphViewMode, activeVoucher, selectedNode]);

  // Printable Legal Intelligence Brief
  const handlePrintBrief = (node) => {
    if (!node) return;
    const currentImpact = node.baseImpact.toFixed(1);
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Intelligence Voucher - ${node.name}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
          .voucher { border: 2px dashed #2563eb; border-radius: 16px; padding: 32px; background: #f8fafc; max-width: 680px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
          .badge { display: inline-block; background: #2563eb; color: #fff; font-weight: bold; font-size: 11px; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
          h1 { margin: 14px 0 6px 0; font-size: 24px; color: #0f172a; }
          .meta { font-size: 13px; color: #64748b; margin-bottom: 24px; }
          .details { border-collapse: collapse; width: 100%; margin-top: 18px; }
          .details th, .details td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; font-size: 13px; }
          .details th { background: #f1f5f9; color: #475569; width: 35%; }
          .highlight { font-weight: 800; font-size: 16px; color: ${Number(currentImpact) < 0 ? '#dc2626' : '#16a34a'}; }
          .footer { margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="voucher">
          <span class="badge">FinD AUTONOMOUS IMPACT VOUCHER</span>
          <h1>${node.name} (${node.id})</h1>
          <div class="meta">Root Trigger: ${activeVoucher.root.name} • Certified Propagation Chain</div>
          <table class="details">
            <tr><th>Asset Symbol</th><td>${node.id}</td></tr>
            <tr><th>Industry Sector</th><td>${node.sector}</td></tr>
            <tr><th>Propagation Distance</th><td>Hop ${node.hop} Ripple Chain</td></tr>
            <tr><th>Transmission Channel</th><td>${node.channel}</td></tr>
            <tr><th>Projected Impact Delta</th><td class="highlight">${Number(currentImpact) < 0 ? '' : '+'}${currentImpact}%</td></tr>
            <tr><th>Econometric Confidence</th><td>${node.confidence} (OLS R² Backtested)</td></tr>
            <tr><th>Beta Sensitivity Factor</th><td>${node.beta}</td></tr>
          </table>
          <p style="font-size: 13px; color: #334155; margin-top: 20px; line-height: 1.6; background: #fff; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <b>Algorithmic Rationale:</b> ${node.explanation}
          </p>
          <div class="footer">Hackwave 3.0 • FinD Event Intelligence Lab • Certified Autonomous Audit</div>
        </div>
        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `);
    win.document.close();
  };

  const calculatedImpact = selectedNode ? selectedNode.baseImpact.toFixed(1) : 0;
  const isSelectedNegative = Number(calculatedImpact) < 0;

  // Filter hops for clean graph representation
  const hop1Items = activeVoucher.impacts.filter(i => i.hop === 1);
  const hop2Items = activeVoucher.impacts.filter(i => i.hop === 2);
  const hop3Items = activeVoucher.impacts.filter(i => i.hop === 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 40, maxWidth: 1480, margin: '0 auto' }}>
      
      {/* ─── CLEAN EXECUTIVE HEADER ───────────────────────────────── */}
      <div style={{
        background: 'var(--panel2)',
        borderRadius: 14,
        padding: '16px 22px',
        border: '1px solid var(--line)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 14,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
            }}>
              <Network size={18} />
            </span>
            Executive Contagion Flow Diagram
          </h1>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
            Structured multi-hop transmission channels from trigger shock to downstream assets.
          </div>
        </div>

        {/* CONTROLS: EVENT PICKER & GRAPH VIEW TOGGLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Compact Event Pills */}
          <div style={{ display: 'flex', background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 24, padding: 3, gap: 4 }}>
            {PRESET_VOUCHERS.map(v => {
              const isSelected = activeVoucher.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => handleSelectVoucher(v)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: isSelected ? v.accentColor : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--muted2)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span>{v.title}</span>
                  <span style={{ fontSize: 11, opacity: 0.9, fontWeight: 800 }}>({v.root.displayShock})</span>
                </button>
              );
            })}
          </div>

          {/* Clean Diagram vs 2D Network Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 8, padding: 3, gap: 4 }}>
            <button
              onClick={() => setGraphViewMode('diagram')}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: graphViewMode === 'diagram' ? 'var(--accent)' : 'transparent',
                color: graphViewMode === 'diagram' ? '#fff' : 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s'
              }}
            >
              <GitFork size={14} />
              Clean Diagram
            </button>
            <button
              onClick={() => {
                setGraphViewMode('network');
                setTimeout(() => networkInstanceRef.current?.fit(), 60);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: graphViewMode === 'network' ? 'var(--accent)' : 'transparent',
                color: graphViewMode === 'network' ? '#fff' : 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s'
              }}
            >
              <Network size={14} />
              2D Network
            </button>
          </div>

          {graphViewMode === 'network' && (
            <button 
              onClick={() => networkInstanceRef.current?.fit()}
              style={{ 
                background: 'var(--panel2)', border: '1px solid var(--line)', 
                padding: '6px 12px', borderRadius: 8, fontSize: 12, 
                cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 
              }}
            >
              <Maximize2 size={13} />
              Fit Graph
            </button>
          )}
        </div>
      </div>

      {/* ─── MAIN LAYOUT: GRAPH CANVAS (LEFT) + INTELLIGENCE INSPECTOR (RIGHT) ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 18, alignItems: 'start' }}>
        
        {/* ─── LEFT: THE EXECUTIVE FLOW GRAPH ─────────────────────── */}
        <div className="card" style={{ padding: 24, minHeight: 650, background: 'var(--panel)', position: 'relative', overflow: 'hidden' }}>
          
          {/* MODE 1: CLEAN FLOW DIAGRAM (VISUAL GRAPH) */}
          {graphViewMode === 'diagram' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              
              {/* ─── HOP 0: PRIMARY TRIGGER SHOCK ──────────────────── */}
              <div style={{ width: '100%', maxWidth: 440, zIndex: 2 }}>
                <div 
                  onClick={() => setSelectedNode(activeVoucher.impacts[0])}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                    color: '#ffffff',
                    borderRadius: 14,
                    padding: '16px 24px',
                    boxShadow: '0 8px 24px rgba(239, 68, 68, 0.35)',
                    border: '1px solid #f87171',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', opacity: 0.95, marginBottom: 4 }}>
                    <ShieldAlert size={14} />
                    🚨 PRIMARY TRIGGER SHOCK (HOP 0)
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.3px' }}>
                    {activeVoucher.root.name}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, background: 'rgba(0,0,0,0.3)', padding: '4px 16px', borderRadius: 20, fontSize: 13, fontWeight: 900 }}>
                    <span>{activeVoucher.root.displayShock} Price Shock</span>
                  </div>
                  <div style={{ fontSize: 11.5, opacity: 0.9, marginTop: 8, lineHeight: 1.4 }}>
                    {activeVoucher.root.summary}
                  </div>
                </div>
              </div>

              {/* ─── SVG BRANCH CONNECTOR 0 ➔ 1 ────────────────────── */}
              <div style={{ width: '100%', maxWidth: 760, position: 'relative', margin: '6px 0', height: 75 }}>
                <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                  <defs>
                    <marker id="flow-arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ef4444" />
                    </marker>
                    <marker id="flow-arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
                    </marker>
                  </defs>
                  {/* Stem from Hop 0 */}
                  <line x1="50%" y1="0" x2="50%" y2="28" stroke="#ef4444" strokeWidth="2.5" />
                  {/* Branch to Hop 1 Left */}
                  <path d="M 50% 28 C 50% 50, 25% 45, 25% 72" fill="none" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#flow-arrow-red)" />
                  {/* Branch to Hop 1 Right */}
                  <path d="M 50% 28 C 50% 50, 75% 45, 75% 72" fill="none" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#flow-arrow-red)" />
                </svg>

                {/* Center Badge: Direct Cost & Supply Contagion */}
                <div style={{
                  position: 'absolute',
                  top: 14,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--panel2)',
                  border: '1.5px solid #ef4444',
                  borderRadius: 20,
                  padding: '3px 14px',
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#dc2626',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  zIndex: 3
                }}>
                  <Zap size={12} color="#ef4444" />
                  {activeVoucher.tier1Title}
                </div>

                {/* Left transmission label */}
                <div style={{
                  position: 'absolute',
                  top: 48,
                  left: '25%',
                  transform: 'translateX(-50%)',
                  background: 'var(--panel2)',
                  border: '1px solid var(--line)',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--muted)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  whiteSpace: 'nowrap'
                }}>
                  {hop1Items[0]?.channel} 🔻
                </div>

                {/* Right transmission label */}
                <div style={{
                  position: 'absolute',
                  top: 48,
                  left: '75%',
                  transform: 'translateX(-50%)',
                  background: 'var(--panel2)',
                  border: '1px solid var(--line)',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--muted)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  whiteSpace: 'nowrap'
                }}>
                  {hop1Items[1]?.channel} 🔻
                </div>
              </div>

              {/* ─── HOP 1: AIRLINES (2 NODES) ────────────────────── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24, width: '100%', maxWidth: 760, zIndex: 2 }}>
                {hop1Items.map(item => {
                  const isSelected = selectedNode?.id === item.id;
                  const impactVal = item.baseImpact.toFixed(1);
                  const isNeg = Number(impactVal) < 0;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedNode(item)}
                      style={{
                        cursor: 'pointer',
                        borderRadius: 14,
                        padding: '16px 18px',
                        background: isSelected ? 'var(--panel2)' : (isNeg ? '#fff5f5' : '#f0fdf4'),
                        border: `2px solid ${isSelected ? 'var(--accent)' : (isNeg ? '#fca5a5' : '#86efac')}`,
                        boxShadow: isSelected ? '0 0 20px rgba(37, 99, 235, 0.35)' : '0 4px 12px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        transform: isSelected ? 'scale(1.02)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
                          padding: '3px 8px', borderRadius: 6,
                          background: isNeg ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                          color: isNeg ? '#b91c1c' : '#047857'
                        }}>
                          HOP 1 • {item.sector}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)' }}>
                          {item.confidence} Conf.
                        </span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: isSelected ? '#ffffff' : '#0f172a' }}>
                        {item.name}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 6, borderTop: '1px dashed var(--line)' }}>
                        <span style={{ fontSize: 11, color: isSelected ? 'var(--muted)' : '#64748b', fontWeight: 600 }}>
                          {item.channel}
                        </span>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 2,
                          fontSize: 14, fontWeight: 900,
                          color: isNeg ? '#dc2626' : '#16a34a'
                        }}>
                          {isNeg ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
                          {isNeg ? '' : '+'}{impactVal}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ─── SVG BRANCH CONNECTOR 1 ➔ 2 ────────────────────── */}
              <div style={{ width: '100%', maxWidth: 760, position: 'relative', margin: '6px 0', height: 75 }}>
                <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                  {/* Connector from left Hop 1 down to left Hop 2 */}
                  <line x1="25%" y1="0" x2="25%" y2="72" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#flow-arrow-amber)" />
                  {/* Cross-link or direct link from right Hop 1 to right Hop 2 */}
                  <line x1="75%" y1="0" x2="75%" y2="72" stroke="#f59e0b" strokeWidth="2.5" markerEnd="url(#flow-arrow-amber)" />
                  {/* Subtle cross transmission link */}
                  <line x1="25%" y1="20" x2="75%" y2="20" stroke="var(--line)" strokeWidth="1" strokeDasharray="3 3" />
                </svg>

                {/* Center Badge: Secondary Cascading Ripple */}
                <div style={{
                  position: 'absolute',
                  top: 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--panel2)',
                  border: '1.5px solid #f59e0b',
                  borderRadius: 20,
                  padding: '3px 14px',
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#b45309',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  zIndex: 3
                }}>
                  <Layers size={12} color="#f59e0b" />
                  {activeVoucher.tier2Title}
                </div>

                {/* Left transmission label */}
                <div style={{
                  position: 'absolute',
                  top: 46,
                  left: '25%',
                  transform: 'translateX(-50%)',
                  background: 'var(--panel2)',
                  border: '1px solid var(--line)',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--muted)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  whiteSpace: 'nowrap'
                }}>
                  {hop2Items[0]?.channel} 🔻
                </div>

                {/* Right transmission label */}
                <div style={{
                  position: 'absolute',
                  top: 46,
                  left: '75%',
                  transform: 'translateX(-50%)',
                  background: 'var(--panel2)',
                  border: '1px solid var(--line)',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--muted)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  whiteSpace: 'nowrap'
                }}>
                  {hop2Items[1]?.channel} 🔺
                </div>
              </div>

              {/* ─── HOP 2: PAINTS & LOGISTICS (2 NODES) ───────────── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 24, width: '100%', maxWidth: 760, zIndex: 2 }}>
                {hop2Items.map(item => {
                  const isSelected = selectedNode?.id === item.id;
                  const impactVal = item.baseImpact.toFixed(1);
                  const isNeg = Number(impactVal) < 0;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedNode(item)}
                      style={{
                        cursor: 'pointer',
                        borderRadius: 14,
                        padding: '16px 18px',
                        background: isSelected ? 'var(--panel2)' : (isNeg ? '#fff5f5' : '#f0fdf4'),
                        border: `2px solid ${isSelected ? 'var(--accent)' : (isNeg ? '#fca5a5' : '#86efac')}`,
                        boxShadow: isSelected ? '0 0 20px rgba(37, 99, 235, 0.35)' : '0 4px 12px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        transform: isSelected ? 'scale(1.02)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
                          padding: '3px 8px', borderRadius: 6,
                          background: isNeg ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                          color: isNeg ? '#b91c1c' : '#047857'
                        }}>
                          HOP 2 • {item.sector}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)' }}>
                          {item.confidence} Conf.
                        </span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: isSelected ? '#ffffff' : '#0f172a' }}>
                        {item.name}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 6, borderTop: '1px dashed var(--line)' }}>
                        <span style={{ fontSize: 11, color: isSelected ? 'var(--muted)' : '#64748b', fontWeight: 600 }}>
                          {item.channel}
                        </span>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 2,
                          fontSize: 14, fontWeight: 900,
                          color: isNeg ? '#dc2626' : '#16a34a'
                        }}>
                          {isNeg ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
                          {isNeg ? '' : '+'}{impactVal}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ─── SVG BRANCH CONNECTOR 2 ➔ 3 (CONVERGING) ───────── */}
              {hop3Items.length > 0 && (
                <>
                  <div style={{ width: '100%', maxWidth: 760, position: 'relative', margin: '6px 0', height: 75 }}>
                    <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
                      <defs>
                        <marker id="flow-arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#3b82f6" />
                        </marker>
                      </defs>
                      {/* Left Hop 2 converging to center Hop 3 */}
                      <path d="M 25% 0 C 25% 35, 50% 30, 50% 72" fill="none" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#flow-arrow-blue)" />
                      {/* Right Hop 2 converging to center Hop 3 */}
                      <path d="M 75% 0 C 75% 35, 50% 30, 50% 72" fill="none" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#flow-arrow-blue)" />
                    </svg>

                    {/* Center Badge: Terminal Macroeconomic Pass-Through */}
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--panel2)',
                      border: '1.5px solid #3b82f6',
                      borderRadius: 20,
                      padding: '3px 14px',
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#1d4ed8',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      zIndex: 3
                    }}>
                      <Activity size={12} color="#3b82f6" />
                      {activeVoucher.tier3Title}
                    </div>

                    {/* Terminal Transmission label */}
                    <div style={{
                      position: 'absolute',
                      top: 48,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--panel2)',
                      border: '1px solid var(--line)',
                      borderRadius: 6,
                      padding: '2px 10px',
                      fontSize: 10,
                      fontWeight: 700,
                      color: 'var(--muted)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      whiteSpace: 'nowrap'
                    }}>
                      {hop3Items[0]?.channel} 🔺
                    </div>
                  </div>

                  {/* ─── HOP 3: TERMINAL MACROECONOMIC INDICATOR ───── */}
                  <div style={{ width: '100%', maxWidth: 440, zIndex: 2 }}>
                    {hop3Items.map(item => {
                      const isSelected = selectedNode?.id === item.id;
                      const impactVal = item.baseImpact.toFixed(1);
                      const isNeg = Number(impactVal) < 0;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedNode(item)}
                          style={{
                            cursor: 'pointer',
                            borderRadius: 14,
                            padding: '16px 20px',
                            background: isSelected ? 'var(--panel2)' : 'rgba(59, 130, 246, 0.07)',
                            border: `2px solid ${isSelected ? 'var(--accent)' : '#93c5fd'}`,
                            boxShadow: isSelected ? '0 0 20px rgba(37, 99, 235, 0.35)' : '0 4px 12px rgba(59, 130, 246, 0.08)',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            transform: isSelected ? 'scale(1.02)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{
                              fontSize: 10, fontWeight: 900, textTransform: 'uppercase',
                              padding: '3px 8px', borderRadius: 6,
                              background: 'rgba(59, 130, 246, 0.15)',
                              color: '#1d4ed8'
                            }}>
                              HOP 3 • {item.sector}
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)' }}>
                              {item.confidence} Conf.
                            </span>
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 900, color: isSelected ? '#ffffff' : '#0f172a' }}>
                            {item.name}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 6, borderTop: '1px dashed var(--line)' }}>
                            <span style={{ fontSize: 11, color: isSelected ? 'var(--muted)' : '#64748b', fontWeight: 600 }}>
                              {item.channel}
                            </span>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 2,
                              fontSize: 14, fontWeight: 900,
                              color: isNeg ? '#dc2626' : '#16a34a'
                            }}>
                              {isNeg ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
                              {isNeg ? '' : '+'}{impactVal}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

            </div>
          )}

          {/* MODE 2: 2D INTERACTIVE VIS-NETWORK CANVAS */}
          <div 
            ref={graphContainerRef} 
            style={{ 
              display: graphViewMode === 'network' ? 'block' : 'none',
              height: 600, 
              background: 'var(--bg2)', 
              borderRadius: 12, 
              border: '1px solid var(--line)',
              position: 'relative'
            }} 
          />

        </div>

        {/* ─── RIGHT: INTELLIGENCE VOUCHER INSPECTOR ───────────────── */}
        <div>
          {selectedNode ? (
            <div style={{
              borderRadius: 16,
              padding: '3px',
              background: 'linear-gradient(135deg, #38bdf8, #818cf8, #ec4899)',
              boxShadow: '0 12px 35px -5px rgba(56, 189, 248, 0.35)',
              position: 'sticky',
              top: 20
            }}>
              <div style={{
                background: 'var(--panel2)',
                borderRadius: 14,
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ 
                      fontSize: 10, fontWeight: 900, textTransform: 'uppercase', 
                      letterSpacing: 1, color: 'var(--accent)', background: 'var(--accent-light)',
                      padding: '3px 8px', borderRadius: 4
                    }}>
                      INTELLIGENCE VOUCHER
                    </span>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>
                      {selectedNode.name}
                    </h3>
                  </div>
                  <span style={{ 
                    fontFamily: 'monospace', fontSize: 13, fontWeight: 800, 
                    color: 'var(--accent)', padding: '4px 8px', background: 'var(--bg2)',
                    borderRadius: 6, border: '1px solid var(--line)' 
                  }}>
                    {selectedNode.id}
                  </span>
                </div>

                {/* Key Metric Shock Delta */}
                <div style={{ 
                  background: isSelectedNegative ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                  border: `1px solid ${isSelectedNegative ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
                  borderRadius: 12,
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted2)' }}>PROJECTED SHOCK DELTA</div>
                    <div style={{ 
                      fontSize: 24, fontWeight: 900, 
                      color: isSelectedNegative ? '#ef4444' : '#10b981',
                      marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 
                    }}>
                      {isSelectedNegative ? <ArrowDownRight size={22} /> : <ArrowUpRight size={22} />}
                      {isSelectedNegative ? '' : '+'}{calculatedImpact}%
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted2)' }}>TOPOLOGY DEPTH</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginTop: 2 }}>
                      Hop {selectedNode.hop} Ripple
                    </div>
                  </div>
                </div>

                {/* Attributes Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: 'var(--bg2)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line)' }}>
                    <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>SECTOR</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>{selectedNode.sector}</div>
                  </div>
                  <div style={{ background: 'var(--bg2)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line)' }}>
                    <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>AI CONFIDENCE</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#10b981', marginTop: 2 }}>{selectedNode.confidence}</div>
                  </div>
                </div>

                {/* Propagation Rationale */}
                <div style={{
                  background: 'var(--bg2)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  border: '1px solid var(--line)',
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: 'var(--text)'
                }}>
                  <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: 4 }}>
                    🧠 Propagation Rationale:
                  </strong>
                  {selectedNode.explanation}
                </div>

                {/* Historical Beta Sparkline */}
                {selectedNode.timeSeries && (
                  <div style={{ height: 110, background: 'var(--bg2)', padding: '8px 10px', borderRadius: 10, border: '1px solid var(--line)' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
                      PRICE SHOCK TIMELINE (T-5 to T0)
                    </div>
                    <ResponsiveContainer width="100%" height={80}>
                      <AreaChart data={selectedNode.timeSeries}>
                        <defs>
                          <linearGradient id="sparkColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={isSelectedNegative ? '#ef4444' : '#10b981'} stopOpacity={0.4}/>
                            <stop offset="95%" stopColor={isSelectedNegative ? '#ef4444' : '#10b981'} stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="price" stroke={isSelectedNegative ? '#ef4444' : '#10b981'} strokeWidth={2} fillOpacity={1} fill="url(#sparkColor)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Export Brief Button */}
                <button
                  onClick={() => handlePrintBrief(selectedNode)}
                  style={{
                    background: 'var(--accent)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px 16px',
                    fontSize: 13,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                    transition: 'all 0.2s'
                  }}
                >
                  <FileSignature size={16} /> Export Intelligence Voucher (PDF)
                </button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
              Click any node on the left to inspect its certified transmission voucher.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
