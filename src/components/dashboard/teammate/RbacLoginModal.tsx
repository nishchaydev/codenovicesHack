import React, { useState } from "react";
import { UserRole, UserProfile } from "@/types/fingraph/types";
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Building2,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  X
} from "lucide-react";

export const PRESET_ROLES: Array<UserProfile & {
  label: string;
  badgeColor: string;
  description: string;
}> = [
  {
    id: "usr-quant-01",
    role: "quant_analyst",
    roleLabel: "Quantitative Research Analyst",
    label: "Quantitative Research Analyst",
    name: "Dr. Nishchay Gupta",
    firm: "Citadel Quantitative Strategies",
    desk: "Cross-Asset Causal Alpha Desk",
    email: "n.gupta@citadel-quant.internal",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    permissions: [
      "Dynamic 2nd-Order Node Extension",
      "Econometric Factor OLS Regressions",
      "Monte Carlo Contagion Sensitivity",
      "Custom Macro Shock Ingestion"
    ],
    description: "Full research clearance: unrestricted node extension, factor betas, regression calibration & BFS causal decay tuning."
  },
  {
    id: "usr-pm-02",
    role: "portfolio_manager",
    roleLabel: "Senior Portfolio Manager",
    label: "Senior Portfolio Manager",
    name: "Arjun Singhania",
    firm: "BlackRock Multi-Asset Allocation",
    desk: "Emerging Markets Macro Fund",
    email: "a.singhania@blackrock.internal",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    permissions: [
      "Cross-Sector Heatmap Treemap Analysis",
      "Drawdown & Volatility Shock Projection",
      "Macro Replay (1973, 2008, 2020 Crises)",
      "Portfolio Beta Stress Hedging"
    ],
    description: "Asset allocation focus: macro scenarios, multi-asset treemap breadth, sector tilts and empirical drawdown defense."
  },
  {
    id: "usr-risk-03",
    role: "risk_officer",
    roleLabel: "Chief Risk & Compliance Officer",
    label: "Chief Risk & Compliance Officer",
    name: "Elena Rostova",
    firm: "Bank for International Settlements (BIS)",
    desk: "Systemic Contagion Surveillance",
    email: "e.rostova@bis-surveillance.org",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    permissions: [
      "Full Forensic Audit Logs & Evidence Inspection",
      "Regulatory Filing & Citation Verification",
      "Interbank Contagion Matrix Sensitivity",
      "Export Certified Risk PDF Dossiers"
    ],
    description: "Surveillance clearance: deep audit trails, regulatory circular validation, transmission risk scoring & evidence grading."
  },
  {
    id: "usr-trade-04",
    role: "institutional_trader",
    roleLabel: "Head of Derivatives Trading",
    label: "Head of Derivatives Trading",
    name: "Marcus Vance",
    firm: "Jane Street Capital",
    desk: "Index & Commodity Arbitrage",
    email: "m.vance@janestreet.internal",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    permissions: [
      "Immediate-Hop Dislocation Alerts",
      "Crude & Commodity Spread Arbitrage",
      "Top Bellwether Equity Delta Tracking",
      "Short-Term FX Transmission Hops"
    ],
    description: "Execution desk: high-frequency catalyst response, spot basis tracking, and immediate-term transmission velocity."
  }
];

interface RbacLoginModalProps {
  isOpen: boolean;
  currentUser: UserProfile | null;
  onLogin: (profile: UserProfile) => void;
  onClose?: () => void;
}

export const RbacLoginModal: React.FC<RbacLoginModalProps> = ({
  isOpen,
  currentUser,
  onLogin,
  onClose
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser?.role || "quant_analyst");
  const [analystName, setAnalystName] = useState(currentUser?.name || "Dr. Nishchay Gupta");
  const [customKey, setCustomKey] = useState("FIN-D-AUTH-SEC-9942");

  if (!isOpen) return null;

  const currentPreset = PRESET_ROLES.find((r) => r.role === selectedRole)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: `usr-${selectedRole}-${Date.now().toString().slice(-4)}`,
      name: analystName,
      email: currentPreset.email,
      role: selectedRole,
      roleLabel: currentPreset.label,
      firm: currentPreset.firm,
      desk: currentPreset.desk,
      permissions: currentPreset.permissions
    });
  };

  const handleSelectPreset = (role: UserRole) => {
    setSelectedRole(role);
    const p = PRESET_ROLES.find((r) => r.role === role)!;
    setAnalystName(p.name);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="clay-surface rounded-3xl border border-[var(--clay-border)] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-6 bg-[var(--clay-surface)] border-b border-[var(--clay-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl clay-inset flex items-center justify-center font-black text-sm text-[var(--accent-primary)]">
              FD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)] leading-none">
                  Fin.D Institutional Gateway
                </h3>
                <span className="text-[10px] font-mono clay-badge text-[var(--accent-primary)] px-2 py-0.5 rounded-full font-bold">
                  RBAS AUTH
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">
                Role-Based Access System (RBAC) • Select your operational clearance tier
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="clay-surface p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-5">
          {/* Role Selection Grid */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              Select Institutional Role Clearance
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_ROLES.map((preset) => {
                const isSelected = selectedRole === preset.role;
                return (
                  <div
                    key={preset.role}
                    onClick={() => handleSelectPreset(preset.role)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? "clay-inset ring-2 ring-[var(--accent-primary)]"
                        : "clay-surface hover:scale-101 border-[var(--clay-border)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-black text-[var(--text-primary)] leading-tight block">
                          {preset.label}
                        </span>
                        <span className="text-[11px] text-[var(--accent-primary)] font-bold block truncate">
                          {preset.firm}
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]" : "border-[var(--clay-border)]"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed font-medium">
                      {preset.description}
                    </p>

                    <div className="pt-2 border-t border-[var(--clay-border)] flex items-center justify-between text-[10px] text-[var(--text-secondary)] font-mono">
                      <span>{preset.desk}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Role Clearance Details Banner */}
          <div className="p-4 rounded-2xl clay-inset flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="text-xs font-black text-[var(--text-primary)]">
                  Granted RBAS Permissions for {currentPreset.label}:
                </span>
              </div>
              <span className="text-[10px] font-mono clay-badge text-[var(--accent-primary)] font-bold">
                TIER 1 ACCESS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {currentPreset.permissions.map((perm, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[var(--text-secondary)] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-[11px] truncate">{perm}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Profile Credentials Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wide block mb-1">
                Analyst / Officer Name
              </label>
              <input
                type="text"
                value={analystName}
                onChange={(e) => setAnalystName(e.target.value)}
                required
                className="w-full clay-inset px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wide block mb-1">
                Security Token / Desk Key
              </label>
              <div className="relative flex items-center">
                <KeyRound className="w-3.5 h-3.5 text-[var(--text-secondary)] absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="w-full clay-inset pl-9 pr-3 py-2.5 text-xs font-mono font-bold text-[var(--text-primary)] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <span className="text-[11px] text-[var(--text-secondary)] font-medium">
              Session is encrypted & authenticated locally via institutional key.
            </span>
            <button
              type="submit"
              className="clay-button-primary px-6 py-2.5 rounded-full text-xs font-black flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Authenticate & Enter Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
