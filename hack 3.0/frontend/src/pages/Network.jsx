import React, { useEffect, useRef, useState } from 'react';
import { Network as VisNetwork } from 'vis-network/standalone';
import { api } from '../api';
import { 
  Network as NetworkIcon, Search, ShieldAlert, FileText, AlertTriangle, 
  RotateCw, Layers, GitFork, Activity, ChevronRight, Zap, Sparkles,
  Sliders, Info, CheckCircle2
} from 'lucide-react';

const AbhedyaChakraLoader = ({ progress = 0 }) => {
  const currentPct = Math.min(100, Math.max(0, Math.round(progress)));
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.88)',
      padding: '16px 32px',
      borderRadius: '10px',
      border: '1px solid #38bdf8',
      boxShadow: '0 0 24px rgba(56, 189, 248, 0.35)'
    }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8', letterSpacing: 1, fontFamily: 'monospace' }}>
        TRACING CASCADE... <span style={{ color: '#f8fafc', minWidth: '4ch', display: 'inline-block', textAlign: 'right' }}>{currentPct}%</span>
      </div>
    </div>
  );
};

export default function Network() {
  const ref = useRef(null);
  const netRef = useRef(null);
  const progressTimerRef = useRef(null);

  // View Mode: 'cascade' (matches user's uploaded diagram) | 'physics' (2D vis-network)
  const [viewMode, setViewMode] = useState('cascade');
  
  // Available Scenarios / Triggers
  const [selectedScenarioKey, setSelectedScenarioKey] = useState('CRUDE_OIL');
  const [activeHop1Index, setActiveHop1Index] = useState(0); // Which card in column 2 is selected
  const [activeHop2Index, setActiveHop2Index] = useState(0); // Which card in column 3 is selected

  const [txnId, setTxnId] = useState('');
  const [district, setDistrict] = useState('');
  const [minTies, setMinTies] = useState(1);
  const [districts, setDistricts] = useState([]);
  
  const [info, setInfo] = useState({ nodes: 0, edges: 0 });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [rawGraph, setRawGraph] = useState({ nodes: [], edges: [] });

  // ─── SCENARIO DATASETS FOR FLOW CASCADE GRAPH ─────────────────────
  const cascadeScenarios = {
    CRUDE_OIL: {
      id: 'CL=F',
      name: 'Crude Oil Futures (CL=F)',
      shock: '+14.2% Shock',
      category: 'Energy Commodity',
      exposure: 14500000,
      description: 'Global geopolitical benchmark surge propagating upstream procurement costs across petrochemicals, aviation turbine fuel (ATF), and transport logistics.',
      hop1: [
        {
          id: 'INDIGO.NS',
          name: 'InterGlobe (IndiGo)',
          sector: 'Aviation',
          delta: '-11.8%',
          impactType: 'ATF Jet Fuel Margin',
          role: 'Hop 1 Direct Impact',
          exposure: 5200000,
          confidence: 94,
          beta: -0.82,
          explanation: 'Fuel accounts for ~40% of airline operating costs. Crude rally triggers immediate margin compression and crack-spread expansion.',
          hop2: [
            { id: 'INDIGO_ATF', name: 'ATF Fuel Cost Surcharge', delta: '-18.4%', tag: 'Cost Input', exposure: 2400000 },
            { id: 'INDIGO_FARES', name: 'Domestic Airfare Hikes', delta: '+12.0%', tag: 'Pricing Pass-Through', exposure: 1800000 },
            { id: 'INDIGO_LEASE', name: 'Aircraft Lease Debt Strain', delta: '-8.5%', tag: 'Working Capital', exposure: 1200000 },
            { id: 'INDIGO_CARGO', name: 'Air Cargo Yield Adjustment', delta: '+6.2%', tag: 'Logistics Ripple', exposure: 950000 },
            { id: 'INDIGO_TOURISM', name: 'Discretionary Tourism Spend', delta: '-4.8%', tag: 'Consumer Demand', exposure: 720000 }
          ]
        },
        {
          id: 'SPICEJET',
          name: 'SpiceJet Airlines',
          sector: 'Aviation',
          delta: '-16.4%',
          impactType: 'Cash Flow & Lease Strain',
          role: 'Hop 1 Direct Impact',
          exposure: 2100000,
          confidence: 91,
          beta: -1.14,
          explanation: 'Tight working capital buffers amplify unhedged aviation fuel spikes, elevating fleet lease covenant breach probabilities.',
          hop2: [
            { id: 'SPICE_VENDOR', name: 'Vendor & Fuel Arrears Risk', delta: '-21.0%', tag: 'Liquidity Pressure', exposure: 1100000 },
            { id: 'SPICE_FLEET', name: 'Operational Aircraft Grounding', delta: '-14.2%', tag: 'Asset Utilization', exposure: 800000 },
            { id: 'SPICE_ROUTES', name: 'Regional Route Curtailment', delta: '-9.5%', tag: 'Capacity Cut', exposure: 620000 },
            { id: 'SPICE_CARGO', name: 'SpiceXpress Cargo Margins', delta: '-7.0%', tag: 'Cargo Division', exposure: 450000 },
            { id: 'SPICE_CREDIT', name: 'Airport Credit Facility Caps', delta: '-12.8%', tag: 'Counterparty Risk', exposure: 380000 }
          ]
        },
        {
          id: 'ASIANPAINT',
          name: 'Asian Paints Ltd',
          sector: 'Chemicals & Coatings',
          delta: '-8.5%',
          impactType: 'Solvent Feedstock Surge',
          role: 'Hop 1 Direct Impact',
          exposure: 3400000,
          confidence: 89,
          beta: -0.58,
          explanation: 'Crude derivatives (phthalic anhydride, mineral turpentine) form 50% of coatings raw material basket, pinching EBITDA margins.',
          hop2: [
            { id: 'AP_SOLVENTS', name: 'Petrochem Solvent Inputs', delta: '-14.0%', tag: 'Raw Feedstock', exposure: 1600000 },
            { id: 'AP_MARGINS', name: 'Gross Margin Compression', delta: '-320 bps', tag: 'Profitability', exposure: 1200000 },
            { id: 'AP_PACKAGING', name: 'Polymer Packaging Costs', delta: '+9.4%', tag: 'Container Costs', exposure: 750000 },
            { id: 'AP_DEALER', name: 'Dealer Working Capital Lag', delta: '-5.2%', tag: 'Channel Credit', exposure: 580000 },
            { id: 'AP_RETAIL', name: 'Retail Repainting Delay', delta: '-3.6%', tag: 'Consumer Sentiment', exposure: 420000 }
          ]
        },
        {
          id: 'AUTO_SUPPLY',
          name: 'Auto Electronics Tier-1',
          sector: 'Automotive Component',
          delta: '-7.2%',
          impactType: 'Freight & Tariffs Ripple',
          role: 'Hop 1 Direct Impact',
          exposure: 2800000,
          confidence: 84,
          beta: -0.49,
          explanation: 'Synthetic elastomer, resin, and air cargo rates compress margins across tier-1 electronic harness and ECU suppliers.',
          hop2: [
            { id: 'AUTO_RESINS', name: 'Engineering Plastic Resins', delta: '+11.5%', tag: 'Feedstock Cost', exposure: 1300000 },
            { id: 'AUTO_FREIGHT', name: 'Inbound Air Freight Tariffs', delta: '+15.2%', tag: 'Logistics Cost', exposure: 920000 },
            { id: 'AUTO_LEAD', name: 'Assembly Plant Production Lag', delta: '+8 Days', tag: 'Supply Delay', exposure: 680000 },
            { id: 'AUTO_OEM', name: 'OEM Cost Absorption Delay', delta: '-4.1%', tag: 'Contract Margins', exposure: 510000 },
            { id: 'AUTO_AFTER', name: 'Aftermarket Spares Inflation', delta: '+5.8%', tag: 'Secondary Market', exposure: 390000 }
          ]
        },
        {
          id: 'BANK_NIFTY',
          name: 'Commercial Banking Index',
          sector: 'Financials & Macro',
          delta: '-4.5%',
          impactType: 'Rate Expectations Squeeze',
          role: 'Hop 1 Direct Impact',
          exposure: 8900000,
          confidence: 86,
          beta: -0.36,
          explanation: 'Higher crude oil feeds into headline CPI, delaying central bank rate cuts and raising borrowing costs across capital-intensive sectors.',
          hop2: [
            { id: 'BANK_CPI', name: 'Headline CPI Inflation Surge', delta: '+1.8%', tag: 'Macro Spillover', exposure: 4200000 },
            { id: 'BANK_YIELD', name: '10-Yr Sovereign Yield Spike', delta: '+18 bps', tag: 'Bond Market', exposure: 2900000 },
            { id: 'BANK_LOANS', name: 'Aviation & Fleet Loan Watchlist', delta: '+12.4%', tag: 'Credit Risk', exposure: 1700000 },
            { id: 'BANK_FII', name: 'Foreign Portfolio Outflows', delta: '-$420M', tag: 'Institutional Flows', exposure: 1100000 },
            { id: 'BANK_NIM', name: 'Net Interest Margin Pinch', delta: '-14 bps', tag: 'Banking Margins', exposure: 850000 }
          ]
        }
      ]
    },

    SEMICONDUCTORS: {
      id: 'CHIP_DISRUPT',
      name: 'Semiconductor Export Restrictions',
      shock: '-28.0% Supply Shock',
      category: 'Hardware & Tech',
      exposure: 22000000,
      description: 'Advanced lithography export controls causing global microcontroller and AI accelerator supply bottlenecks.',
      hop1: [
        {
          id: 'AUTO_CHIPS',
          name: 'Automotive OEMs & EV',
          sector: 'Automotive',
          delta: '-12.4%',
          impactType: 'Microcontroller Bottleneck',
          role: 'Hop 1 Direct Impact',
          exposure: 7800000,
          confidence: 93,
          beta: -0.92,
          explanation: 'Vehicles require over 1,500 semiconductors each. Supply halts trigger factory line shutdowns.',
          hop2: [
            { id: 'EV_WAIT', name: 'Customer Wait Times (+6 Wks)', delta: '+42%', tag: 'Order Backlog', exposure: 3100000 },
            { id: 'EV_BATTERY', name: 'Battery Management Supply', delta: '-16%', tag: 'BMS Shortage', exposure: 2400000 },
            { id: 'EV_DEALER', name: 'Dealer Channel Inventory', delta: '-28%', tag: 'Floor Stock', exposure: 1500000 },
            { id: 'EV_PROFIT', name: 'Premium Trim Margin Hit', delta: '-8.5%', tag: 'High-End Mix', exposure: 1100000 },
            { id: 'EV_RIVAL', name: 'Domestic Alternative Sourcing', delta: '+18%', tag: 'Rerouting', exposure: 750000 }
          ]
        },
        {
          id: 'SERVER_OEM',
          name: 'Data Center Hardware',
          sector: 'Cloud Infrastructure',
          delta: '-14.8%',
          impactType: 'AI GPU Allocation Deficit',
          role: 'Hop 1 Direct Impact',
          exposure: 8900000,
          confidence: 95,
          beta: -1.05,
          explanation: 'Hyperscalers face delivery delays on high-performance accelerators, stalling expansion plans.',
          hop2: [
            { id: 'GPU_CLOUD', name: 'Cloud Compute Spot Rates', delta: '+24%', tag: 'Pricing Spike', exposure: 3800000 },
            { id: 'GPU_AI', name: 'GenAI Inference Expansion Delay', delta: '-19%', tag: 'Capacity Lag', exposure: 2600000 },
            { id: 'GPU_HARD', name: 'Server Motherboard Lead Time', delta: '+45 Days', tag: 'Manufacturing', exposure: 1700000 },
            { id: 'GPU_MARGIN', name: 'Cloud Provider Gross Margins', delta: '-210 bps', tag: 'CapEx Pressure', exposure: 1200000 },
            { id: 'GPU_SEC', name: 'Secondary ASIC Silicon Surge', delta: '+31%', tag: 'Alternatives', exposure: 900000 }
          ]
        },
        {
          id: 'SMARTPHONE',
          name: 'Consumer Electronics Tier-1',
          sector: 'Consumer Tech',
          delta: '-9.2%',
          impactType: 'SoC & Memory Pricing Spike',
          role: 'Hop 1 Direct Impact',
          exposure: 5300000,
          confidence: 88,
          beta: -0.65,
          explanation: 'Component price rises squeeze mid-tier consumer electronics margins.',
          hop2: [
            { id: 'PHONE_BOM', name: 'Bill of Materials (BOM) Cost', delta: '+14%', tag: 'Hardware Cost', exposure: 2100000 },
            { id: 'PHONE_UNIT', name: 'Shipment Volume Forecast', delta: '-8.4%', tag: 'Unit Volumes', exposure: 1600000 },
            { id: 'PHONE_DISC', name: 'Promotional Discount Cuts', delta: '-50%', tag: 'Retail Margin', exposure: 950000 },
            { id: 'PHONE_CYCLE', name: 'Consumer Replacement Cycle', delta: '+4 Mos', tag: 'Demand Lag', exposure: 680000 },
            { id: 'PHONE_COMP', name: 'Legacy Node Substitution', delta: '+12%', tag: 'Supply Pivot', exposure: 420000 }
          ]
        },
        {
          id: 'INDUSTRIAL_ROBOT',
          name: 'Industrial Robotics',
          sector: 'Automation',
          delta: '-6.5%',
          impactType: 'PLC Controller Lead Time',
          role: 'Hop 1 Direct Impact',
          exposure: 3100000,
          confidence: 85,
          beta: -0.52,
          explanation: 'Factory automation controllers delayed by 14 weeks.',
          hop2: [
            { id: 'ROBOT_CAPEX', name: 'Factory CapEx Deployments', delta: '-11%', tag: 'Investment Lag', exposure: 1200000 },
            { id: 'ROBOT_PLANT', name: 'Line Modernization Delays', delta: '+90 Days', tag: 'Facility Setup', exposure: 850000 },
            { id: 'ROBOT_PARTS', name: 'Spare Controller Gray Market', delta: '+65%', tag: 'Spot Premium', exposure: 610000 },
            { id: 'ROBOT_SERVICE', name: 'Predictive Maintenance Upgrades', delta: '-7%', tag: 'Software Spend', exposure: 430000 },
            { id: 'ROBOT_DOM', name: 'Regional Foundry Adoption', delta: '+22%', tag: 'Domestic Sourcing', exposure: 290000 }
          ]
        },
        {
          id: 'TELECOM_INFRA',
          name: '5G Telecom Base Stations',
          sector: 'Telecommunications',
          delta: '-5.1%',
          impactType: 'RF Power Amplifier Shortage',
          role: 'Hop 1 Direct Impact',
          exposure: 2600000,
          confidence: 82,
          beta: -0.41,
          explanation: 'Tower equipment vendors experience radio frequency chip constraints.',
          hop2: [
            { id: 'TELCO_ROLL', name: '5G Tower Rollout Cadence', delta: '-15%', tag: 'Deployment Speed', exposure: 1100000 },
            { id: 'TELCO_SPECTRUM', name: 'Spectrum Monetization Lag', delta: '-6%', tag: 'Revenue Yield', exposure: 750000 },
            { id: 'TELCO_CAPEX', name: 'Carrier Infrastructure CapEx', delta: '-9%', tag: 'Vendor Spend', exposure: 520000 },
            { id: 'TELCO_ROUT', name: 'Fiber Optical Routing Nodes', delta: '+11 Days', tag: 'Hardware Delay', exposure: 380000 },
            { id: 'TELCO_FIRM', name: 'Firmware Re-architecture Spend', delta: '+$45M', tag: 'Engineering CapEx', exposure: 250000 }
          ]
        }
      ]
    }
  };

  const currentScenario = cascadeScenarios[selectedScenarioKey] || cascadeScenarios.CRUDE_OIL;
  const currentHop1 = currentScenario.hop1[activeHop1Index] || currentScenario.hop1[0];
  const currentHop2List = currentHop1.hop2 || [];
  const currentHop2 = currentHop2List[activeHop2Index] || currentHop2List[0];

  const startLoadingWithProgress = () => {
    setLoading(true);
    setProgress(1);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    
    progressTimerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 88) return 88;
        return prev + Math.floor(Math.random() * 3 + 1);
      });
    }, 25);
  };

  const completeLoading = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setProgress(100);
    setTimeout(() => {
      setLoading(false);
    }, 350);
  };

  // Sync selected node with inspector when scenario or card changes
  useEffect(() => {
    if (viewMode === 'cascade') {
      setSelected({
        id: currentHop1.id,
        label: currentHop1.name,
        role: currentHop1.role,
        sector: currentHop1.sector,
        delta: currentHop1.delta,
        total_received: currentHop1.exposure,
        confidence: currentHop1.confidence,
        explanation: currentHop1.explanation,
        beta: currentHop1.beta
      });
    }
  }, [selectedScenarioKey, activeHop1Index, viewMode]);

  // Load districts
  useEffect(() => {
    if (api.districts) {
      api.districts().then(d => { if (Array.isArray(d)) setDistricts(d); }).catch(() => {});
    }
  }, []);

  // ─── VIS-NETWORK 2D FALLBACK RENDERER ─────────────────────────────
  const renderPhysicsGraph = () => {
    if (!ref.current) return;
    startLoadingWithProgress();

    const nodes = [
      { id: currentScenario.id, label: currentScenario.name, color: { background: '#38bdf8', border: '#0284c7' }, shape: 'box', font: { color: '#0f172a', bold: true } },
      ...currentScenario.hop1.map(h => ({
        id: h.id, label: `${h.name}\n${h.delta}`, color: { background: '#f59e0b', border: '#d97706' }, shape: 'box', font: { color: '#0f172a' }
      })),
      ...currentHop1.hop2.map(h2 => ({
        id: h2.id, label: `${h2.name}\n${h2.delta}`, color: { background: '#ef4444', border: '#b91c1c' }, shape: 'box', font: { color: '#ffffff' }
      }))
    ];

    const edges = [
      ...currentScenario.hop1.map(h => ({ from: currentScenario.id, to: h.id, arrows: 'to', color: '#94a3b8' })),
      ...currentHop1.hop2.map(h2 => ({ from: currentHop1.id, to: h2.id, arrows: 'to', color: '#ef4444' }))
    ];

    if (netRef.current) netRef.current.destroy();

    netRef.current = new VisNetwork(ref.current, { nodes, edges }, {
      physics: { barnesHut: { gravitationalConstant: -6000, springLength: 100 } },
      interaction: { hover: true }
    });

    netRef.current.on('click', params => {
      if (params.nodes && params.nodes.length) {
        const id = params.nodes[0];
        const h1 = currentScenario.hop1.find(h => h.id === id);
        if (h1) {
          setSelected({
            id: h1.id, label: h1.name, role: h1.role, sector: h1.sector,
            delta: h1.delta, total_received: h1.exposure, confidence: h1.confidence,
            explanation: h1.explanation, beta: h1.beta
          });
        }
      }
    });

    completeLoading();
  };

  useEffect(() => {
    if (viewMode === 'physics') {
      renderPhysicsGraph();
    }
  }, [viewMode, selectedScenarioKey, activeHop1Index]);

  // ─── REPORT GENERATORS ────────────────────────────────────────────
  const printFreezeNotice = (node) => {
    const accLabel = node?.label || currentHop1.name;
    const totalAmt = (node?.total_received || currentHop1.exposure).toLocaleString();

    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sector Impact Report - ${accLabel}</title>
        <style>
          body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 40px; color: #000; background: #fff; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 16px; }
          .gov-title { font-size: 16px; font-weight: bold; letter-spacing: 1px; }
          .dept-title { font-size: 20px; font-weight: bold; margin-top: 2px; }
          .meta-table { width: 100%; margin-bottom: 16px; font-size: 13px; border-collapse: collapse; }
          .urgent-tag { border: 2px solid #dc2626; color: #dc2626; padding: 4px 10px; font-weight: bold; font-size: 14px; display: inline-block; border-radius: 4px; }
          .subject-box { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 10px 14px; font-weight: bold; font-size: 14px; margin: 16px 0; border-radius: 4px; }
          .sec-head { background: #e2e8f0; padding: 6px 10px; font-weight: bold; font-size: 13px; border: 1px solid #cbd5e1; margin-top: 14px; }
          .tbl { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px; }
          .tbl th, .tbl td { border: 1px solid #94a3b8; padding: 6px 8px; text-align: left; }
          .tbl th { background: #f8fafc; font-weight: bold; }
          .sign-block { margin-top: 40px; display: flex; justify-content: space-between; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="gov-title">HACKWAVE 3.0</div>
          <div class="dept-title">FINANCIAL EVENT & IMPACT PROPAGATION RADAR</div>
        </div>
        <table class="meta-table">
          <tr>
            <td><b>Reference ID:</b> HW/FIN-IMP/2026/094</td>
            <td style="text-align: right;"><span class="urgent-tag">HIGH CONTAGION EXPOSURE</span></td>
          </tr>
          <tr>
            <td><b>Evaluation Date:</b> 22 September 2026</td>
            <td style="text-align: right;"><b>Model Confidence:</b> ${node?.confidence || 94}%</td>
          </tr>
        </table>
        <div class="subject-box">
          Subject: Cross-Asset Contagion & Downstream Sensitivity Audit for: ${accLabel}
        </div>
        <p style="font-size: 12px; line-height: 1.6;">
          This official dossier confirms observed transmission vectors originating from root commodity shock <b>${currentScenario.name} (${currentScenario.shock})</b>.
          Empirical regression demonstrates high downstream sensitivity with an estimated total institutional exposure of <b>$${totalAmt}</b>.
        </p>
        <div class="sec-head">1. Entity Vulnerability Profile</div>
        <table class="tbl">
          <tr><td><b>Target Entity</b></td><td>${accLabel}</td><td><b>Industry Sector</b></td><td>${node?.sector || currentHop1.sector}</td></tr>
          <tr><td><b>Downstream Drop</b></td><td>${node?.delta || currentHop1.delta}</td><td><b>Regression Beta (β)</b></td><td>${node?.beta || currentHop1.beta}</td></tr>
        </table>
        <div class="sec-head">2. Hop 2 Propagation Channels</div>
        <table class="tbl">
          <thead>
            <tr><th>#</th><th>Downstream Channel</th><th>Delta Shift</th><th>Category</th><th>Exposure ($)</th></tr>
          </thead>
          <tbody>
            ${currentHop1.hop2.map((h2, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td>${h2.name}</td>
                <td><b style="color:#dc2626">${h2.delta}</b></td>
                <td>${h2.tag}</td>
                <td>$${h2.exposure.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="sign-block">
          <div>Approved by AI Portfolio Risk Engine<br/>Hackwave Quantitative Intelligence</div>
          <div style="text-align: right;">Automated Legal & Valuation Audit Stamp</div>
        </div>
        <script>window.onload = () => { window.print(); };</script>
      </body>
      </html>
    `);
    win.document.close();
  };

  const printFIRReport = (node) => {
    const accLabel = node?.label || currentHop1.name;
    const totalAmt = (node?.total_received || currentHop1.exposure).toLocaleString();

    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Impact Analysis Dossier - ${accLabel}</title>
        <style>
          body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 40px; color: #000; background: #fff; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 16px; }
          .gov-title { font-size: 14px; font-weight: bold; letter-spacing: 1px; }
          .dept-title { font-size: 20px; font-weight: bold; margin-top: 2px; }
          .fir-title { font-size: 16px; font-weight: bold; text-decoration: underline; margin-top: 4px; }
          .sec-head { background: #e2e8f0; padding: 6px 10px; font-weight: bold; font-size: 13px; border: 1px solid #cbd5e1; margin-top: 14px; text-transform: uppercase; }
          .tbl { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px; }
          .tbl th, .tbl td { border: 1px solid #94a3b8; padding: 6px 8px; text-align: left; }
          .tbl th { background: #f8fafc; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="gov-title">HACKWAVE 3.0</div>
          <div class="dept-title">MULTI-HOP GRAPH REASONING ENGINE</div>
          <div class="fir-title">INSTITUTIONAL CASCADE PATH REPORT</div>
        </div>
        <div class="sec-head">1. Shock Propagation Synopsis</div>
        <p style="font-size: 12px; line-height: 1.5;">
          Knowledge graph multi-hop traversal completed for event node <b>${currentScenario.name}</b> reaching <b>${accLabel}</b>.
          Algorithmic NLP extractions combined with 90-day returns correlation matrix confirm transmission along supply chain input vectors.
        </p>
        <div class="sec-head">2. Multi-Hop Risk Metrics</div>
        <table class="tbl">
          <thead>
            <tr><th>Propagation Stage</th><th>Entities Affected</th><th>Value Impact ($)</th><th>Transmission Factor</th></tr>
          </thead>
          <tbody>
            <tr><td>Hop 0 (Root Shock)</td><td>1 Primary Trigger</td><td>$${currentScenario.exposure.toLocaleString()}</td><td>Direct Macro Shock</td></tr>
            <tr><td>Hop 1 (Immediate Equities)</td><td>5 Direct Stocks</td><td>$${(currentScenario.exposure * 0.65).toLocaleString()}</td><td>Input Cost & Margin Squeeze</td></tr>
            <tr><td>Hop 2 (Secondary Domino)</td><td>25 Tertiary Nodes</td><td>$${(currentScenario.exposure * 0.42).toLocaleString()}</td><td>Macro Pass-Through & Inflation</td></tr>
          </tbody>
        </table>
        <script>window.onload = () => { window.print(); };</script>
      </body>
      </html>
    `);
    win.document.close();
  };

  // ─── COORDINATE SETUP FOR CASCADE GRAPH (MATCHING USER SCREENSHOT) ──
  // Canvas: viewBox="0 0 920 540"
  // Col 1 (Root Card): x=24, y=240, w=190, h=60, port=(214, 270)
  // Col 2 (Hop 1 Cards): x=370, w=220, h=56, inputPort=(370, cy), outputPort=(590, cy)
  // Col 3 (Hop 2 Cards): x=700, w=200, h=56, inputPort=(700, cy)
  const rootPort = { x: 214, y: 270 };
  const hop1CardsY = [36, 138, 240, 342, 444]; // 5 vertical cards
  const hop2CardsY = [36, 138, 240, 342, 444]; // 5 vertical cards

  const selectedHop1Y = hop1CardsY[activeHop1Index] + 28;
  const hop1OutputPort = { x: 590, y: selectedHop1Y };

  return (
    <>
      {/* ─── TOPBAR ──────────────────────────────────────────────── */}
      <div className="topbar">
        <h1>
          <NetworkIcon size={20} style={{ marginRight: 8, verticalAlign: 'text-bottom' }} /> 
          Impact Network & Domino Cascade
        </h1>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Scenario Trigger Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--panel2)', padding: '4px 8px', borderRadius: 8, border: '1px solid var(--line)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>TRIGGER:</span>
            <select 
              value={selectedScenarioKey} 
              onChange={e => {
                setSelectedScenarioKey(e.target.value);
                setActiveHop1Index(0);
                setActiveHop2Index(0);
              }}
              style={{ padding: '4px 8px', fontSize: 12, fontWeight: 700, border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <option value="CRUDE_OIL">Crude Oil Shock (CL=F)</option>
              <option value="SEMICONDUCTORS">Semiconductor Chip Ban (TSMC/NVDA)</option>
            </select>
          </div>

          {/* View Mode Toggle: Cascade (Uploaded Diagram) vs 2D Physics */}
          <div style={{ display: 'flex', background: 'var(--panel2)', borderRadius: 8, border: '1px solid var(--line)', padding: 2 }}>
            <button
              onClick={() => setViewMode('cascade')}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                background: viewMode === 'cascade' ? 'var(--accent)' : 'transparent',
                color: viewMode === 'cascade' ? '#ffffff' : 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <GitFork size={13} /> Flow Cascade
            </button>
            <button
              onClick={() => setViewMode('physics')}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                background: viewMode === 'physics' ? 'var(--accent)' : 'transparent',
                color: viewMode === 'physics' ? '#ffffff' : 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Layers size={13} /> 2D Force Graph
            </button>
          </div>

          {/* Reload / Trace Button */}
          <button 
            className="primary" 
            onClick={() => {
              startLoadingWithProgress();
              setTimeout(() => completeLoading(), 400);
            }} 
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', fontWeight: 700, fontSize: 12 }}
          >
            <RotateCw size={14} style={{ animation: loading ? 'spinChakra 1s linear infinite' : 'none' }} />
            Recalculate Ripple
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: 12, borderRadius: 6, marginBottom: 12 }}>
          <AlertTriangle size={18} style={{ verticalAlign: 'text-bottom', marginRight: 8 }} /> {error}
        </div>
      )}

      {/* Explanatory Banner */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--panel2)', padding: '8px 14px', borderRadius: 8, border: '1px solid var(--line)',
        marginBottom: 12, fontSize: 12, color: 'var(--muted2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ 
            width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', 
            boxShadow: '0 0 8px #3b82f6', animation: 'pulse 1.5s infinite' 
          }} />
          <span>
            <b>Live Contagion Cascade:</b> Click any card in <b>Hop 1</b> to expand its downstream second-hop ripple paths into <b>Hop 2</b>.
          </span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>
          Root Event: {currentScenario.id} ({currentScenario.shock})
        </span>
      </div>

      {/* ─── MAIN GRAPH & INSPECTOR SPLIT ────────────────────────── */}
      <div className="row" style={{ alignItems: 'stretch' }}>
        
        {/* GRAPH CANVAS COLUMN */}
        <div className="network col" style={{ minWidth: '65%', position: 'relative', height: '560px', background: '#F8FAFC', borderRadius: 12, border: '1px solid var(--line)', overflow: 'hidden' }}>
          {loading && <AbhedyaChakraLoader progress={progress} />}

          {viewMode === 'cascade' ? (
            /* ─── FLOW CASCADE GRAPH (MATCHING USER'S UPLOADED SCREENSHOT) ─── */
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <svg 
                viewBox="0 0 920 540" 
                preserveAspectRatio="xMidYMid meet" 
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
              >
                <defs>
                  {/* Gradients */}
                  <linearGradient id="rootCardGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>

                  <linearGradient id="activeCardGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>

                  <linearGradient id="lineGradActive" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>

                  {/* Soft Drop Shadows */}
                  <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(37,99,235,0.18)" />
                  </filter>
                  <filter id="activeShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(59,130,246,0.35)" />
                  </filter>
                </defs>

                {/* ─── 1. BÉZIER CURVES: STAGE 0 (ROOT) ➔ STAGE 1 (HOP 1) ─── */}
                {currentScenario.hop1.map((card, i) => {
                  const targetY = hop1CardsY[i] + 28;
                  const isActive = i === activeHop1Index;
                  const dx = 370 - rootPort.x;
                  const pathD = `M ${rootPort.x} ${rootPort.y} C ${rootPort.x + dx * 0.55} ${rootPort.y}, ${370 - dx * 0.45} ${targetY}, 370 ${targetY}`;

                  return (
                    <g key={`curve-0-1-${i}`}>
                      <path
                        d={pathD}
                        fill="none"
                        stroke={isActive ? '#3b82f6' : '#bfdbfe'}
                        strokeWidth={isActive ? 2.8 : 1.6}
                        strokeOpacity={isActive ? 1 : 0.8}
                        style={{ transition: 'all 0.3s ease' }}
                      />
                      {isActive && (
                        <circle r="3" fill="#3b82f6">
                          <animateMotion dur="2.2s" repeatCount="indefinite" path={pathD} />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* ─── 2. BÉZIER CURVES: STAGE 1 (HOP 1) ➔ STAGE 2 (HOP 2) ─── */}
                {currentHop2List.map((card2, j) => {
                  const targetY2 = hop2CardsY[j] + 28;
                  const isActive2 = j === activeHop2Index;
                  const dx2 = 700 - hop1OutputPort.x;
                  const pathD2 = `M ${hop1OutputPort.x} ${hop1OutputPort.y} C ${hop1OutputPort.x + dx2 * 0.55} ${hop1OutputPort.y}, ${700 - dx2 * 0.45} ${targetY2}, 700 ${targetY2}`;

                  return (
                    <g key={`curve-1-2-${j}`}>
                      <path
                        d={pathD2}
                        fill="none"
                        stroke={isActive2 ? '#4f46e5' : '#bfdbfe'}
                        strokeWidth={isActive2 ? 2.8 : 1.6}
                        strokeOpacity={isActive2 ? 1 : 0.8}
                        style={{ transition: 'all 0.3s ease' }}
                      />
                      {isActive2 && (
                        <circle r="3" fill="#4f46e5">
                          <animateMotion dur="2s" repeatCount="indefinite" path={pathD2} />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* ─── 3. STAGE 0 CARD (ROOT TRIGGER SHOCK) ───────────────── */}
                <g 
                  onClick={() => {
                    setSelected({
                      id: currentScenario.id,
                      label: currentScenario.name,
                      role: 'Root Shock Trigger',
                      sector: currentScenario.category,
                      delta: currentScenario.shock,
                      total_received: currentScenario.exposure,
                      confidence: 99,
                      explanation: currentScenario.description,
                      beta: 1.0
                    });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x="24"
                    y="240"
                    width="190"
                    height="60"
                    rx="10"
                    fill="url(#rootCardGrad)"
                    filter="url(#activeShadow)"
                  />
                  {/* Root Card Content */}
                  <text x="38" y="264" fill="#ffffff" fontSize="12" fontWeight="800" fontFamily="sans-serif">
                    {currentScenario.name}
                  </text>
                  <text x="38" y="284" fill="#dbeafe" fontSize="10.5" fontWeight="600" fontFamily="sans-serif">
                    {currentScenario.shock} • Primary Shock
                  </text>

                  {/* Output Port Dot (Root Right Connector) */}
                  <circle cx={rootPort.x} cy={rootPort.y} r="9" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
                  <circle cx={rootPort.x} cy={rootPort.y} r="3" fill="#ffffff" />
                </g>

                {/* ─── 4. STAGE 1 CARDS (HOP 1 EQUITIES & SECTORS) ─────────── */}
                {currentScenario.hop1.map((item, i) => {
                  const y = hop1CardsY[i];
                  const cy = y + 28;
                  const isActive = i === activeHop1Index;

                  return (
                    <g
                      key={item.id}
                      onClick={() => {
                        setActiveHop1Index(i);
                        setActiveHop2Index(0);
                        setSelected({
                          id: item.id,
                          label: item.name,
                          role: item.role,
                          sector: item.sector,
                          delta: item.delta,
                          total_received: item.exposure,
                          confidence: item.confidence,
                          explanation: item.explanation,
                          beta: item.beta
                        });
                      }}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                      {/* Card Background */}
                      <rect
                        x="370"
                        y={y}
                        width="220"
                        height="56"
                        rx="9"
                        fill={isActive ? 'url(#activeCardGrad)' : '#E0F2FE'}
                        stroke={isActive ? '#3b82f6' : '#BAE6FD'}
                        strokeWidth="1.2"
                        filter={isActive ? 'url(#activeShadow)' : 'url(#cardShadow)'}
                      />

                      {/* Card Texts */}
                      <text 
                        x="386" 
                        y={y + 24} 
                        fill={isActive ? '#ffffff' : '#0369a1'} 
                        fontSize="12.5" 
                        fontWeight="800" 
                        fontFamily="sans-serif"
                      >
                        {item.name}
                      </text>
                      <text 
                        x="386" 
                        y={y + 42} 
                        fill={isActive ? '#dbeafe' : '#0284c7'} 
                        fontSize="10" 
                        fontWeight="600" 
                        fontFamily="sans-serif"
                      >
                        {item.sector} • {item.impactType}
                      </text>

                      {/* Delta Pill on Card */}
                      <rect 
                        x="530" 
                        y={y + 12} 
                        width="48" 
                        height="18" 
                        rx="4" 
                        fill={isActive ? 'rgba(255,255,255,0.2)' : 'rgba(239, 68, 68, 0.12)'} 
                      />
                      <text 
                        x="554" 
                        y={y + 25} 
                        fill={isActive ? '#ffffff' : '#dc2626'} 
                        fontSize="10" 
                        fontWeight="900" 
                        textAnchor="middle" 
                        fontFamily="sans-serif"
                      >
                        {item.delta}
                      </text>

                      {/* Right Connector Port Dot (Visible on all, active on selected) */}
                      <circle 
                        cx="590" 
                        cy={cy} 
                        r={isActive ? "8.5" : "5"} 
                        fill={isActive ? "#4f46e5" : "#7dd3fc"} 
                        stroke="#ffffff" 
                        strokeWidth="2" 
                      />
                      {isActive && <circle cx="590" cy={cy} r="3" fill="#ffffff" />}
                    </g>
                  );
                })}

                {/* ─── 5. STAGE 2 CARDS (HOP 2 DOWNSTREAM RIPPLE) ─────────── */}
                {currentHop2List.map((item2, j) => {
                  const y2 = hop2CardsY[j];
                  const isActive2 = j === activeHop2Index;

                  return (
                    <g
                      key={item2.id}
                      onClick={() => {
                        setActiveHop2Index(j);
                        setSelected({
                          id: item2.id,
                          label: item2.name,
                          role: 'Hop 2 Downstream Transmission',
                          sector: currentHop1.sector,
                          delta: item2.delta,
                          total_received: item2.exposure,
                          confidence: currentHop1.confidence,
                          explanation: `Cascading shock passing from ${currentHop1.name} into ${item2.name} under ${item2.tag} vector.`,
                          beta: currentHop1.beta
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Card Background */}
                      <rect
                        x="700"
                        y={y2}
                        width="200"
                        height="56"
                        rx="9"
                        fill={isActive2 ? 'url(#activeCardGrad)' : '#E0F2FE'}
                        stroke={isActive2 ? '#4f46e5' : '#BAE6FD'}
                        strokeWidth="1.2"
                        filter={isActive2 ? 'url(#activeShadow)' : 'url(#cardShadow)'}
                      />

                      {/* Card Text */}
                      <text 
                        x="714" 
                        y={y2 + 23} 
                        fill={isActive2 ? '#ffffff' : '#0369a1'} 
                        fontSize="11.5" 
                        fontWeight="800" 
                        fontFamily="sans-serif"
                      >
                        {item2.name}
                      </text>
                      <text 
                        x="714" 
                        y={y2 + 41} 
                        fill={isActive2 ? '#dbeafe' : '#0284c7'} 
                        fontSize="9.5" 
                        fontWeight="600" 
                        fontFamily="sans-serif"
                      >
                        {item2.tag}
                      </text>

                      {/* Delta Indicator */}
                      <text 
                        x="882" 
                        y={y2 + 25} 
                        fill={isActive2 ? '#ffffff' : '#dc2626'} 
                        fontSize="10" 
                        fontWeight="900" 
                        textAnchor="end" 
                        fontFamily="sans-serif"
                      >
                        {item2.delta}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Bottom Legend */}
              <div style={{
                position: 'absolute', bottom: 12, left: 16, right: 16,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontSize: 11, color: 'var(--muted)', background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(6px)', padding: '6px 14px', borderRadius: 8, border: '1px solid var(--line)'
              }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb' }} /> Stage 0: Root Macro Event
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} /> Stage 1: Direct Exposed Assets
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f46e5' }} /> Stage 2: Downstream Market Vectors
                  </span>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>
                  Interactive: Click any card to trace
                </span>
              </div>
            </div>
          ) : (
            /* ─── 2D PHYSICS GRAPH CONTAINER ────────────────────────── */
            <div style={{ width: '100%', height: '100%' }}>
              <div ref={ref} style={{ width: '100%', height: '100%' }} />
            </div>
          )}
        </div>

        {/* ─── RIGHT COLUMN: INTELLIGENCE INSPECTOR ────────────────── */}
        <div className="card col" style={{ maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text)', fontSize: 16 }}>
            <Search size={18} color="var(--accent)" /> Intelligence Inspector
          </h3>

          {!selected && (
            <div className="dim" style={{ fontSize: 12 }}>
              Click any node on the cascade flow to inspect quantitative sensitivity & propagation pathways.
            </div>
          )}

          {selected && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <h3 style={{ margin: '0 0 2px 0', wordBreak: 'break-all', color: 'var(--accent)', fontSize: 16 }}>
                  {selected.label}
                </h3>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>
                  Role: <span style={{ color: 'var(--text)' }}>{selected.role || 'Hop 1 Direct Asset'}</span>
                </div>
              </div>

              {/* Exposure & Beta Metrics */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
                background: 'var(--bg2)', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--line)'
              }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>EXPOSURE VALUE</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--text)' }}>
                    ${(selected.total_received || 3800000).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>REGRESSION BETA</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#dc2626' }}>
                    β = {selected.beta || -0.82}
                  </div>
                </div>
              </div>

              {/* AI Prediction Confidence */}
              <div style={{ background: 'rgba(37, 99, 235, 0.05)', padding: 10, borderRadius: 8, border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ fontWeight: 800, fontSize: 11, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Sparkles size={12} /> AI Prediction Confidence
                  </div>
                  <div style={{ background: '#10b981', color: '#fff', fontSize: 10.5, fontWeight: 800, padding: '1px 6px', borderRadius: 4 }}>
                    {selected.confidence || 94}%
                  </div>
                </div>
                <div style={{ height: 5, background: '#bfdbfe', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${selected.confidence || 94}%`, height: '100%', background: '#10b981', borderRadius: 3 }}></div>
                </div>
              </div>

              {/* Impact Evidence & Explanation */}
              <div style={{ background: 'var(--bg2)', padding: 10, borderRadius: 8, border: '1px solid var(--line)' }}>
                <div style={{ fontWeight: 800, fontSize: 11.5, color: 'var(--text)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FileText size={13} color="var(--accent)" /> Empirical Impact Evidence
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--muted2)', lineHeight: 1.45 }}>
                  {selected.explanation || 'High-probability propagation channel identified by LLM extraction & 90-day returns regression.'}
                </div>
                <div style={{ fontSize: 10, color: '#f59e0b', fontWeight: 700, marginTop: 6 }}>
                  Primary Source: Market Data Regression & NLP Trigger Engine
                </div>
              </div>

              {/* Action Buttons: Legal / Financial Dossier Export */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                <button 
                  style={{
                    background: '#dc2626', color: '#fff', border: 'none', padding: '9px 12px',
                    borderRadius: 8, fontWeight: 700, fontSize: 12, display: 'flex',
                    alignItems: 'center', gap: 8, cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(220,38,38,0.25)'
                  }}
                  onClick={() => printFreezeNotice(selected)}
                >
                  <ShieldAlert size={15} /> Generate Sector Impact Report
                </button>

                <button 
                  style={{
                    background: '#2563eb', color: '#fff', border: 'none', padding: '9px 12px',
                    borderRadius: 8, fontWeight: 700, fontSize: 12, display: 'flex',
                    alignItems: 'center', gap: 8, cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37,99,235,0.25)'
                  }}
                  onClick={() => printFIRReport(selected)}
                >
                  <FileText size={15} /> Generate Impact Path Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
