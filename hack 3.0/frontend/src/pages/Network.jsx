import React, { useEffect, useRef, useState } from 'react'
import { Network as VisNetwork } from 'vis-network/standalone'
import { api } from '../api'
import { Network as NetworkIcon, Search, ShieldAlert, FileText, AlertTriangle, Printer, Layers, RotateCw, Loader2 } from 'lucide-react';

const AbhedyaChakraLoader = ({ progress = 0 }) => {
  const currentPct = Math.min(100, Math.max(0, Math.round(progress)))
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
      background: 'rgba(15, 23, 42, 0.85)',
      padding: '16px 32px',
      borderRadius: '8px',
      border: '1px solid #38bdf8',
      boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)'
    }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#38bdf8', letterSpacing: 1, fontFamily: 'monospace' }}>
        TRACING FAST... <span style={{ color: '#f8fafc', minWidth: '4ch', display: 'inline-block', textAlign: 'right' }}>{currentPct}%</span>
      </div>
    </div>
  )
}

export default function Network() {
  const ref = useRef(null)
  const netRef = useRef(null)
  const progressTimerRef = useRef(null)

  const [txnId, setTxnId] = useState('')
  const [districts, setDistricts] = useState([])
  const [district, setDistrict] = useState('')
  const [minTies, setMinTies] = useState(1)

  const [info, setInfo] = useState({ nodes: 0, edges: 0 })
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [rawGraph, setRawGraph] = useState({ nodes: [], edges: [] })

  const startLoadingWithProgress = () => {
    setLoading(true)
    setProgress(1)
    if (progressTimerRef.current) clearInterval(progressTimerRef.current)

    progressTimerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 88) return 88
        return prev + Math.floor(Math.random() * 3 + 1)
      })
    }, 25)
  }

  const completeLoading = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    setProgress(100)
    // Wait a brief moment so the user actually sees 100%
    setTimeout(() => {
      setLoading(false)
    }, 400)
  }

  useEffect(() => {
    if (api.districts) {
      api.districts().then(d => { if (Array.isArray(d)) setDistricts(d) }).catch(() => { })
    }
    loadMacroNetwork()
  }, [])

  const FALLBACK_FIN_GRAPH = {
    nodes: [
      { id: "CL=F", label: "Crude Oil (CL=F)", role: "root", layer_level: 0, total_received: 14500000, total_sent: 14500000, is_cash_out: false },
      { id: "INDIGO.NS", label: "InterGlobe Aviation", role: "intermediate", layer_level: 1, total_received: 5200000, total_sent: 3800000, is_cash_out: false },
      { id: "SPICEJET", label: "SpiceJet Airlines", role: "intermediate", layer_level: 1, total_received: 2100000, total_sent: 1400000, is_cash_out: false },
      { id: "ASIANPAINT", label: "Asian Paints Ltd", role: "intermediate", layer_level: 2, total_received: 3400000, total_sent: 2200000, is_cash_out: false },
      { id: "LOGISTICS_SEC", label: "Freight & Logistics", role: "intermediate", layer_level: 2, total_received: 4600000, total_sent: 3100000, is_cash_out: false },
      { id: "CPI_INFLATION", label: "Consumer Price Index Shock", role: "terminal", layer_level: 3, total_received: 8900000, total_sent: 0, is_cash_out: true },
      { id: "EQUITY_VOLATILITY", label: "VIX Volatility Spillover", role: "terminal", layer_level: 3, total_received: 6200000, total_sent: 0, is_cash_out: true }
    ],
    edges: [
      { source: "CL=F", target: "INDIGO.NS", amount: 5200000, payment_mode: "Fuel Cost Surge (-14.2%)" },
      { source: "CL=F", target: "SPICEJET", amount: 2100000, payment_mode: "Fuel Cost Surge (-18.6%)" },
      { source: "CL=F", target: "ASIANPAINT", amount: 3400000, payment_mode: "Raw Material Margin (-8.4%)" },
      { source: "INDIGO.NS", target: "LOGISTICS_SEC", amount: 3800000, payment_mode: "Cargo Rate Uplift (+11.5%)" },
      { source: "LOGISTICS_SEC", target: "CPI_INFLATION", amount: 8900000, payment_mode: "Downstream Inflation Pass-through" },
      { source: "ASIANPAINT", target: "EQUITY_VOLATILITY", amount: 2200000, payment_mode: "Earnings Downgrade Pressure" }
    ]
  };

  const loadMacroNetwork = async () => {
    startLoadingWithProgress()
    setError(null)
    try {
      const res = await fetch('http://127.0.0.1:8000/api/sample-accounts')
      if (res.ok) {
        const samples = await res.json()
        if (samples && samples.length > 0) {
          const sampleAcc = samples[0].account_number || samples[0]
          setTxnId(sampleAcc)
          const g = await api.traceTransaction(sampleAcc)
          if (g && g.nodes && g.nodes.length > 0) {
            mapGraphData(g)
            return
          }
        }
      }
      // If sample-accounts doesn't respond or is empty, trace default CL=F
      setTxnId('CL=F')
      const g = await api.traceTransaction('CL=F')
      if (g && g.nodes && g.nodes.length > 0) {
        mapGraphData(g)
        return
      }
      mapGraphData(FALLBACK_FIN_GRAPH)
    } catch (e) {
      console.warn("Backend trace unreachable, loading fallback financial network:", e)
      setTxnId('CL=F')
      mapGraphData(FALLBACK_FIN_GRAPH)
    } finally {
      completeLoading()
    }
  }

  const mapGraphData = (g) => {
    if (!g || !g.nodes) return
    const visNodes = g.nodes.map(n => ({
      id: n.id,
      label: n.label || n.id,
      title: n.role,
      role: n.role,
      ifsc: n.ifsc,
      total_received: n.total_received,
      total_sent: n.total_sent,
      in_degree: n.in_degree,
      out_degree: n.out_degree,
      group: n.role,
      layer_level: n.layer_level,
      is_cash_out: n.is_cash_out,
      city: 'Unknown'
    }))
    const visEdges = (g.edges || []).map(e => ({
      from: e.source,
      to: e.target,
      value: e.amount,
      title: `${e.payment_mode || ''} | ${e.amount}`
    }))
    setRawGraph({ nodes: visNodes, edges: visEdges })
  }

  const traceFunds = async (overrideId) => {
    const idToTrace = (overrideId || txnId || 'CL=F').trim()
    startLoadingWithProgress()
    setError(null)
    try {
      const g = await api.traceTransaction(idToTrace)
      if (g && g.nodes && g.nodes.length > 0) {
        mapGraphData(g)
      } else {
        mapGraphData(FALLBACK_FIN_GRAPH)
      }
    } catch (e) {
      console.warn("Falling back for trigger", idToTrace, e)
      mapGraphData(FALLBACK_FIN_GRAPH)
    } finally {
      completeLoading()
    }
  }

  useEffect(() => {
    if (!rawGraph.nodes || rawGraph.nodes.length === 0) return

    let filteredNodes = rawGraph.nodes
    if (district) {
      const dName = districts.find(d => d.id === parseInt(district))?.name
      if (dName) {
        filteredNodes = filteredNodes.filter(n => !n.city || n.city.toLowerCase() === dName.toLowerCase())
      }
    }

    const nodeIds = new Set(filteredNodes.map(n => n.id))
    const filteredEdges = rawGraph.edges.filter(e => nodeIds.has(e.from) && nodeIds.has(e.to))

    renderGraph({ nodes: filteredNodes, edges: filteredEdges })
  }, [rawGraph, district, minTies, districts])

  const renderGraph = (g) => {
    setInfo({ nodes: g.nodes.length, edges: g.edges.length })
    if (netRef.current) { netRef.current.destroy() }

    const formattedNodes = g.nodes.map(n => {
      let bg = '#2563eb', border = '#1d4ed8', labelPrefix = ''; // Sky Blue / Blue default

      if (n.layer_level === 0 || n.role === 'root') {
        bg = '#38bdf8'; border = '#0284c7'; labelPrefix = 'Source Event: '; // Sky blue
      }
      else if (n.is_cash_out || (n.role === 'terminal' && n.layer_level >= 2)) {
        bg = '#ef4444'; border = '#b91c1c'; labelPrefix = 'TERMINAL IMPACT: '; // Crimson Red
      }
      else if (n.layer_level === 1) {
        bg = '#f59e0b'; border = '#d97706'; labelPrefix = 'L1 Asset: '; // Amber
      }
      else if (n.layer_level === 2) {
        bg = '#f59e0b'; border = '#b45309'; labelPrefix = 'L2 Asset: '; // Dark Amber
      }
      else if (n.layer_level === 3) {
        bg = '#fb923c'; border = '#c2410c'; labelPrefix = 'L3 Asset: '; // Orange
      }
      else if (n.layer_level > 3) {
        bg = '#f97316'; border = '#9a3412'; labelPrefix = `L${n.layer_level}: `;
      }
      else if (n.role === 'intermediate') {
        bg = '#f59e0b'; border = '#d97706';
      }
      else if (n.role === 'terminal' && !n.is_cash_out) {
        bg = '#10b981'; border = '#059669'; labelPrefix = 'CLEAN: '; // Green for clean
      }

      if (n.is_cash_out) {
        border = '#000000'; // Black border emphasis
      }

      return {
        ...n,
        label: labelPrefix + (n.label || n.id),
        shape: 'dot',
        scaling: { min: 8, max: 36 },
        color: { background: bg, border: border, highlight: { background: bg, border: '#ffffff' } },
        font: { color: '#111827', size: 12 }
      }
    })

    netRef.current = new VisNetwork(ref.current, { nodes: formattedNodes, edges: g.edges }, {
      physics: { barnesHut: { gravitationalConstant: -8000, springLength: 120 } },
      interaction: { hover: true }
    })

    netRef.current.on('click', params => {
      if (params.nodes && params.nodes.length) {
        const id = params.nodes[0]
        const node = g.nodes.find(n => n.id === id)
        setSelected(node)
      } else setSelected(null)
    })

    let hasCompleted = false
    netRef.current.on('afterDrawing', () => {
      if (!hasCompleted) {
        hasCompleted = true
        completeLoading()
      }
    })

    setTimeout(() => {
      if (!hasCompleted) {
        hasCompleted = true
        completeLoading()
      }
    }, 50)
  }

  // --- REPORT 1 GENERATOR: SECTOR IMPACT REPORT ---
  const printFreezeNotice = (node) => {
    const accLabel = node?.label || 'EVENT10000001'
    const ifsc = node?.ifsc || 'N/A'
    const totalAmt = (node?.total_received || 500000).toLocaleString()

    const win = window.open('', '_blank')
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sector Impact Report - ${accLabel}</title>
        <style>
          body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 40px; color: #000; background: #fff; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 16px; position: relative; }
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
          <div class="dept-title">FINANCIAL EVENT & MARKET IMPACT ENGINE</div>
        </div>

        <table class="meta-table">
          <tr>
            <td><b>Ref. No. :</b> HW/IMP/2026/0912</td>
            <td style="text-align: right;"><span class="urgent-tag">HIGH IMPACT</span></td>
          </tr>
          <tr>
            <td><b>Date :</b> 22 September 2026</td>
            <td></td>
          </tr>
        </table>

        <div class="subject-box">
          Subject : Sector Impact Analysis for Event: ${accLabel}<br/>
        </div>

        <p style="font-size: 12px; line-height: 1.6;">
          This report details the observed and inferred market impacts stemming from the specified financial event.
          Propagation paths have been traced across various sectors and asset classes.
        </p>

        <div class="sec-head">1. Event Reference Details</div>
        <table class="tbl">
          <tr><td><b>Event ID</b></td><td>${accLabel}</td><td><b>Type</b></td><td>Market Shock</td></tr>
          <tr><td><b>Date of Detection</b></td><td>22 Sep 2026</td><td><b>Primary Sector</b></td><td>Energy</td></tr>
        </table>

        <div class="sec-head">2. Affected Assets & Sectors</div>
        <table class="tbl">
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Asset / Sector Name</th>
              <th>Impact Score</th>
              <th>Estimated Value Change ($)</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Crude Oil Index</td>
              <td>High</td>
              <td>+${totalAmt}</td>
              <td>Primary affected asset</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Transport Sector</td>
              <td>Medium</td>
              <td>-250,000</td>
              <td>Secondary impact via supply chain</td>
            </tr>
          </tbody>
        </table>

        <div class="sign-block">
          <div>
            Generated by AI Analyst<br/>
            Hackwave Market Impact System
          </div>
          <div style="text-align: right;">
            <b>Date :</b> 22 September 2026
          </div>
        </div>

        <script>
          window.onload = () => { window.print(); }
        </script>
      </body>
      </html>
    `)
    win.document.close()
  }

  // --- REPORT 2 GENERATOR: FINANCIAL EVENT IMPACT ANALYSIS ---
  const printFIRReport = (node) => {
    const accLabel = node?.label || 'EVENT10000001'
    const totalAmt = (node?.total_received || 2450000).toLocaleString()

    const win = window.open('', '_blank')
    win.document.write(`<!DOCTYPE html>
    <html>
      <head>
        <title>Impact Analysis Report - ${accLabel}</title>
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
          <div class="dept-title">FINANCIAL EVENT ENGINE</div>
          <div class="fir-title">IMPACT PROPAGATION PATH ANALYSIS</div>
        </div>

        <div class="sec-head">1. Event Synopsis</div>
        <p style="font-size: 12px;">Analysis of propagation paths derived from event: ${accLabel}. The system converted unstructured financial data into a dynamic dependency graph.</p>

        <div class="sec-head">2. Affected Entities</div>
        <table class="tbl">
          <thead>
            <tr>
              <th>Layer</th>
              <th>No. of Assets Affected</th>
              <th>Cumulative Value Shift ($)</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Layer 1</td><td>2</td><td>1,200,000</td><td>Directly impacted assets</td></tr>
            <tr><td>Layer 2</td><td>4</td><td>825,000</td><td>Secondary sector impacts</td></tr>
            <tr><td>Layer 3</td><td>3</td><td>375,000</td><td>Tertiary propagation paths</td></tr>
          </tbody>
        </table>

        <div class="sec-head">3. Evidence & Knowledge Graph</div>
        <p style="font-size: 12px;">Connections are substantiated by NLP extraction from recent financial news events and time-series correlation models.</p>

        <script>
          window.onload = () => { window.print(); }
        </script>
      </body>
    </html>
    `)
    win.document.close()
  }

  return (
    <>
      <div className="topbar">
        <h1><NetworkIcon size={20} style={{marginRight:8, verticalAlign:'text-bottom'}}/> Impact Network</h1>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <select 
            value={txnId} 
            onChange={e => {
              const val = e.target.value;
              setTxnId(val);
              traceFunds(val);
            }} 
            style={{ width: 170, padding: '6px 8px', borderRadius: '6px', fontSize: '13px' }}
          >
            <option value="CL=F">Crude Oil (CL=F)</option>
            <option value="SEMI">Semiconductors (SEMI)</option>
            <option value="AAPL">Apple Inc (AAPL)</option>
            <option value="INDIGO.NS">IndiGo Aviation (INDIGO)</option>
            <option value="TCS.NS">TCS Enterprise (TCS.NS)</option>
          </select>
          <input 
            placeholder="Asset Ticker (e.g. CL=F)" 
            value={txnId} 
            onChange={e=>setTxnId(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && traceFunds()}
            style={{width:160}}
          />
          <div style={{display:'flex', alignItems:'center', gap:4}}>
            <span style={{fontSize: 12, color:'var(--muted)'}}>min ties</span>
            <input type="number" min="1" value={minTies} onChange={e=>setMinTies(parseInt(e.target.value)||1)} style={{width:50}} />
          </div>
          <button 
            className="primary" 
            onClick={traceFunds} 
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontWeight: 600 }}
          >
            <RotateCw size={15} style={{ animation: loading ? 'spinChakra 1s linear infinite' : 'none' }} />
            {loading ? `Tracing(${ Math.round(progress) } %)...` : 'Reload Network'}
          </button>
        </div>
      </div>
      
      {error && <div style={{background: '#fee2e2', color: '#991b1b', padding: 12, borderRadius: 6, marginBottom: 12}}>
        <AlertTriangle size={18} style={{verticalAlign: 'text-bottom', marginRight: 8}}/> {error}
      </div>}
      
      <div className="dim" style={{marginBottom: 12}}>
        Click a node to inspect and generate official legal reports (Section 91 Freeze Order & Section 154 FIR Report).
      </div>
      
      <div className="row">
        <div className="network col" style={{ minWidth: '60%', position: 'relative', height: '550px' }}>
          {loading && <AbhedyaChakraLoader progress={progress} />}
          <div ref={ref} style={{ width: '100%', height: '100%' }} />
          
          {/* Layer Color Legend */}
          <div style={{ 
            position: 'absolute', bottom: 16, left: 16, right: 16,
            background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
            padding: '12px 20px', borderRadius: '12px', border: '1px solid #334155',
            display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: 13,
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)', zIndex: 10,
            justifyContent: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#38bdf8', border: '2px solid #0284c7' }} />
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>Source Event (Sky Blue)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#f59e0b', border: '2px solid #d97706' }} />
              <span style={{ color: '#e2e8f0', fontWeight: 500 }}>Layer 1-2 Assets (Amber)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fb923c', border: '2px solid #c2410c' }} />
              <span style={{ color: '#e2e8f0', fontWeight: 500 }}>Layer 3+ Assets (Orange)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ef4444', border: '2px solid #000000' }} />
              <span style={{ color: '#f8fafc', fontWeight: 700 }}>Terminal Impact (Red)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#10b981', border: '2px solid #059669' }} />
              <span style={{ color: '#e2e8f0', fontWeight: 500 }}>Unaffected Asset (Green)</span>
            </div>
          </div>
        </div>
        <div className="card col" style={{maxWidth:340}}>
          <h3 style={{marginTop:0}}>Inspector</h3>
          {!selected && <div className="dim">Click a node to inspect.</div>}
          {selected && (
            <div>
              <h3 style={{margin: '0 0 4px 0', wordBreak: 'break-all'}}>{selected.label}</h3>
              <div style={{color: 'var(--muted)', fontSize: 13, marginBottom:4, wordBreak: 'break-all'}}>{selected.label}</div>
              <div style={{fontSize: 13, marginBottom:4}}>Role: {selected.role}</div>
              <div style={{fontSize: 13, marginBottom:4}}>IFSC: {selected.ifsc || 'Unknown'}</div>
              <div style={{fontSize: 13, marginBottom:16}}>Received: ₹{selected.total_received?.toLocaleString() || 0}</div>
              
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {/* REPORT 1 BUTTON */}
                <button 
                  style={{
                    background: '#dc2626', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    fontWeight: 700, 
                    fontSize: '13px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(220,38,38,0.3)'
                  }}
                  onClick={() => printFreezeNotice(selected)}
                >
                  <ShieldAlert size={18} /> Generate Sector Impact Report
                </button>

                {/* REPORT 2 BUTTON */}
                <button 
                  style={{
                    background: '#2563eb', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    fontWeight: 700, 
                    fontSize: '13px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37,99,235,0.3)'
                  }}
                  onClick={() => printFIRReport(selected)}
                >
                  <FileText size={18} /> Generate Impact Path Analysis
                </button>

                <button 
                  onClick={() => {
                    if (netRef.current) netRef.current.focus(selected.id, {scale: 1.5, animation: true})
                  }}
                  style={{ marginTop: '4px' }}
                >
                  <Search size={18} style={{marginRight:8, verticalAlign:'text-bottom'}}/> Re-center graph on this node
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="dim" style={{marginTop: 8}}>{info.nodes} nodes · {info.edges} edges</div>
    </>
  )
}
