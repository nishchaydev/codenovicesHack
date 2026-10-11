import React from 'react'
import { useLang, LANGUAGES } from '../i18n.jsx'
import { Languages } from 'lucide-react'

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang, t } = useLang()

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '36px', height: '36px', flexShrink: 0 }} title={t.selectLang}>
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--panel2, #1e293b)', borderRadius: '50%',
        border: '1px solid var(--line, #334155)',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'all 0.2s'
      }}>
        <Languages size={18} style={{ color: 'var(--accent, #38bdf8)' }} />
      </div>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        aria-label="Select Language"
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          opacity: 0, cursor: 'pointer', appearance: 'none'
        }}
      >
        {LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>
            {l.flag} {l.native} ({l.label})
          </option>
        ))}
      </select>
    </div>
  )
}

