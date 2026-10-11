import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { getToken, getUser, clearAuth, api } from './api'
import { LayoutDashboard, MessageCircle, Search, Camera, Database, Compass, TrendingUp, Network as NetworkIcon, BellRing, Route as RouteIcon, FlaskConical, Mic, ShieldCheck, Menu, X, Brain } from 'lucide-react'
import { useLang } from './i18n.jsx'
import LanguageSwitcher from './components/LanguageSwitcher.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import FirstLogin from './pages/FirstLogin.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Chat from './pages/Chat.jsx'
import Hotspots from './pages/Hotspots.jsx'
import Trends from './pages/Trends.jsx'
import Network from './pages/Network.jsx'
import Predict from './pages/Predict.jsx'
import Audit from './pages/Audit.jsx'
import Detective from './pages/Detective.jsx'
import Vision from './pages/Vision.jsx'
import Patrol from './pages/Patrol.jsx'
import PatrolRoute from './pages/PatrolRoute.jsx'
import AlertsToaster from './components/AlertsToaster.jsx'
import AIHub from './pages/AIHub.jsx'

function Shell({ children }) {
  const u = getUser()
  const nav = useNavigate()
  const location = useLocation()
  const { t } = useLang()

  const [stats, setStats] = useState(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])
  useEffect(() => { api.stats().then(setStats).catch(() => {}) }, [])

  const logout = () => { clearAuth(); nav('/login') }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordMsg(t.updating)
    try {
      await api.changePassword(oldPassword, newPassword)
      setPasswordMsg('Password changed successfully!')
      setTimeout(() => {
        setShowPasswordModal(false)
        setPasswordMsg(''); setOldPassword(''); setNewPassword('')
      }, 2000)
    } catch (err) {
      setPasswordMsg('Failed: ' + (err.message || 'Incorrect old password'))
    }
  }

  const canAudit = u && u.role === 'admin'

  const navItems = [
    { to: '/', end: true, icon: LayoutDashboard, label: t.dashboard },
    { to: '/detective', icon: Search, label: t.detective },
    { to: '/ai-hub', icon: Brain, label: t.aiHub || 'AI Hub' },
    { to: '/hotspots', icon: Compass, label: t.hotspots },
    { to: '/trends', icon: TrendingUp, label: t.trends },
    { to: '/network', icon: NetworkIcon, label: t.network },
    ...(canAudit ? [{ to: '/audit', icon: ShieldCheck, label: t.audit }] : []),
  ]

  return (
    <div className="app">
      {/* Hamburger — mobile only */}
      <button
        className="hamburger"
        aria-label="Open navigation"
        onClick={() => setSidebarOpen(o => !o)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo / Brand */}
        <div className="brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flexShrink: 0, width: 38, height: 38, borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}>
              <NetworkIcon size={22} color="#ffffff" strokeWidth={2.5} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.3px', lineHeight: 1.1, color: 'var(--text)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {t.brandName}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="nav">
          {navItems.map(({ to, end, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={end}>
              <Icon size={17} style={{ marginRight: 9, flexShrink: 0 }} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* User card */}
        <div className="user-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                Financial Analyst
              </div>
              <div style={{ color: '#64748b', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ADMIN
              </div>
            </div>
            {/* Language switcher moved here, next to Admin profile */}
            <LanguageSwitcher />
          </div>
          <button style={{ width: '100%', fontSize: 13, padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', fontWeight: 600, transition: 'all 0.2s' }} onClick={logout} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)' }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)' }}>
            {t.logout}
          </button>
        </div>
      </aside>

      {/* Password change modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: 16
        }}>
          <form
            onSubmit={handleChangePassword}
            style={{
              background: 'var(--panel2)', border: '1px solid var(--line)',
              padding: 24, borderRadius: 14, width: 320,
              display: 'flex', flexDirection: 'column', gap: 14,
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <h3 style={{ margin: 0, color: 'var(--text)', fontSize: 16 }}>{t.changePasswordTitle}</h3>
            <div className="auth-input-group">
              <label>{t.oldPassword}</label>
              <input type="password" required value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
            </div>
            <div className="auth-input-group">
              <label>{t.newPassword}</label>
              <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            {passwordMsg && (
              <div style={{ fontSize: 13, color: passwordMsg.includes('success') ? 'var(--ai)' : 'var(--bad)', fontWeight: 500 }}>
                {passwordMsg}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="primary" style={{ flex: 1 }}>{t.submit}</button>
              <button type="button" onClick={() => { setShowPasswordModal(false); setPasswordMsg('') }} style={{ flex: 1 }}>
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      <main className="main" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <footer style={{ marginTop: '40px', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--muted)', fontSize: 12, borderTop: '1px solid var(--line)', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontWeight: 800, color: 'var(--accent)', letterSpacing: 1 }}>FINANCIAL EVENT ENGINE</span>
            <span style={{ width: 4, height: 4, borderRadius: 2, background: 'var(--accent)' }}></span>
            <span>Market Impact Tracing System</span>
          </div>
          <div style={{ fontWeight: 600 }}>
            Hackwave 3.0 • Autonomous Financial Event & Market Impact Graph
          </div>
        </footer>
        <AlertsToaster />
      </main>

      {/* Bottom navigation — mobile only */}
      <nav className="bottom-nav" aria-label="Mobile navigation">
        <div className="bottom-nav-inner">
          {navItems.map(({ to, end, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={end}>
              <Icon size={20} />
              <span>{label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

function Private({ children }) {
  // Login Bypass: Always allow access without token for MVP presentation
  return <Shell>{children}</Shell>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/first-login" element={<FirstLogin />} />
      <Route path="/" element={<Private><Dashboard /></Private>} />
      <Route path="/detective" element={<Private><Detective /></Private>} />
      <Route path="/ai-hub" element={<Private><AIHub /></Private>} />
      <Route path="/vision" element={<Private><Vision /></Private>} />
      <Route path="/hotspots" element={<Private><Hotspots /></Private>} />
      <Route path="/trends" element={<Private><Trends /></Private>} />
      <Route path="/network" element={<Private><Network /></Private>} />
      <Route path="/predict" element={<Private><Predict /></Private>} />
      <Route path="/patrol-route" element={<Private><PatrolRoute /></Private>} />
      <Route path="/patrol" element={<Private><Patrol /></Private>} />
      <Route path="/audit" element={<Private><Audit /></Private>} />
    </Routes>
  )
}
