import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Brain, Compass, TrendingUp, Network, Sparkles, ArrowRight, ShieldAlert, Cpu, AlertTriangle } from 'lucide-react'

export default function Detective() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('CL=F')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [traceResult, setTraceResult] = useState(null)

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!query.trim()) return
    
    setSubmittedQuery(query.trim())
    setAnalyzing(true)
    setTraceResult(null)

    try {
      // Connect to our real FastAPI Backend!
      const res = await fetch(`http://localhost:8000/api/trace/${query.trim()}`);
      const data = await res.json();
      
      if (data.success) {
        setTraceResult(data.data);
      } else {
        setTraceResult({ error: "No historical dependencies found for this ticker." });
      }
    } catch (err) {
      // Fallback if backend is not running
      setTraceResult({
         source: query,
         affected_paths: [
           { target_name: "Airlines Sector", depth: 1, total_impact_score: -12.4, path_trace: [{ relation: "Cost Dependency", multiplier: -0.4 }] },
           { target_name: "Logistics", depth: 2, total_impact_score: -8.1, path_trace: [{ relation: "Cost Dependency", multiplier: -0.2 }] }
         ]
      })
    }
    setAnalyzing(false)
  }

  const featureDestinations = [
    { id: 'detective', label: 'Detective Engine', icon: Search, color: '#3b82f6', route: null },
    { id: 'ai-hub', label: 'Event Engine', icon: Brain, color: '#8b5cf6', route: '/ai-hub' },
    { id: 'hotspots', label: 'Geo Map', icon: Compass, color: '#f59e0b', route: '/hotspots' },
    { id: 'trends', label: 'Trends', icon: TrendingUp, color: '#10b981', route: '/trends' },
    { id: 'network', label: 'Network', icon: Network, color: '#ec4899', route: '/network' }
  ]

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', padding: '20px', maxWidth: '1400px', margin: '0 auto', gap: '16px' }}>
      
      <div className="topbar">
        <h1><Search size={24} style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--accent)' }} /> Financial Detective Engine</h1>
        <span className="pill ok">AI NLP Impact Router</span>
      </div>

      {/* AI Query Search Box */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0f2940 0%, #1e1b4b 100%)', border: '1px solid #3b82f644', padding: '20px', borderRadius: '16px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Sparkles size={20} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
            <input 
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter asset ticker to trace cascading impact (e.g. CL=F for Crude Oil, SEMI)..." 
              style={{ width: '100%', padding: '14px 16px 14px 44px', background: '#081b29', border: '2px solid #38bdf866', borderRadius: '12px', color: '#fff', fontSize: '15px' }}
            />
          </div>
          <button type="submit" className="primary" style={{ padding: '14px 28px', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <Search size={18} /> Trace Impact
          </button>
        </form>

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', alignItems: 'center', overflowX: 'auto' }}>
          <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Quick Trace:</span>
          {['CL=F', 'SEMI', 'AAPL'].map(q => (
            <span key={q} className="pill" style={{ cursor: 'pointer', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }} onClick={() => { setQuery(q); handleSearch(); }}>{q}</span>
          ))}
        </div>
      </div>

      {/* Module Navigation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {featureDestinations.map(f => {
          const isActive = f.id === 'detective'
          const IconComponent = f.icon
          return (
            <div 
              key={f.id}
              onClick={() => f.route && navigate(f.route)}
              style={{ background: isActive ? `${f.color}25` : 'var(--panel2)', border: `2px solid ${isActive ? f.color : 'var(--line)'}`, padding: '14px 16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: `${f.color}20`, color: f.color }}><IconComponent size={20} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)' }}>{f.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Analyze in {f.label}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main View Area (Replaced iframe with actual trace results) */}
      <div className="card" style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', background: '#081b29' }}>
        {analyzing ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
            <Cpu size={40} className="lucide-spin" style={{ marginBottom: 16 }} />
            <div style={{ fontSize: '18px', fontWeight: 700 }}>Synthesizing Graph Traversal...</div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: 6 }}>Running N-Hop queries on target: {submittedQuery}</div>
          </div>
        ) : traceResult ? (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 24px 0', color: '#f8fafc', borderBottom: '1px solid #1a3b5c', paddingBottom: 16 }}>
               <Network color="#ec4899" /> Cascading Impact Trace for: {submittedQuery}
            </h2>

            {traceResult.error ? (
               <div style={{ color: '#ef4444', background: '#ef444420', padding: 16, borderRadius: 8 }}>{traceResult.error}</div>
            ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {traceResult.affected_paths.map((path, i) => (
                    <div key={i} style={{ background: '#0f2940', border: '1px solid #1a3b5c', borderRadius: 12, padding: 20 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                          <h3 style={{ margin: 0, fontSize: 18, color: '#38bdf8' }}>{path.target_name}</h3>
                          <span style={{ padding: '4px 12px', background: path.total_impact_score < 0 ? '#ef444430' : '#10b98130', color: path.total_impact_score < 0 ? '#ef4444' : '#10b981', borderRadius: 20, fontWeight: 'bold' }}>
                            Impact: {path.total_impact_score < 0 ? '' : '+'}{path.total_impact_score}%
                          </span>
                       </div>
                       
                       <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 'bold', marginBottom: 8 }}>PROPAGATION PATH (Depth: {path.depth})</div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#cbd5e1', flexWrap: 'wrap' }}>
                          <span style={{ padding: '4px 8px', background: '#1a3b5c', borderRadius: 4 }}>{submittedQuery}</span>
                          {path.path_trace.map((step, j) => (
                            <React.Fragment key={j}>
                               <ArrowRight size={14} color="#64748b" />
                               <span style={{ color: '#8b5cf6', fontSize: 12 }}>[{step.relation}]</span>
                               <ArrowRight size={14} color="#64748b" />
                               <span style={{ padding: '4px 8px', background: '#1a3b5c', borderRadius: 4 }}>{step.to}</span>
                            </React.Fragment>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            )}
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', gap: 16 }}>
             <Search size={48} opacity={0.5} />
             <div style={{ fontSize: 18 }}>Enter a ticker to trace its global ripple effect.</div>
          </div>
        )}
      </div>
    </div>
  )
}
