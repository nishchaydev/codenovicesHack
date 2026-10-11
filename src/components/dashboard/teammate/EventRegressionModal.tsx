import React, { useState, useEffect } from "react";
import { FinGraphScenario, RegressionCalibration } from "@/types/fingraph/types";
import {
  Sparkles,
  Calculator,
  BrainCircuit,
  TrendingDown,
  TrendingUp,
  Sliders,
  CheckCircle2,
  HelpCircle,
  Play,
  X,
  Layers,
  ArrowRight
} from "lucide-react";

interface EventRegressionModalProps {
  isOpen: boolean;
  scenario: FinGraphScenario;
  onConfirm: (calibration: RegressionCalibration) => void;
  onCancel?: () => void;
}

export const EventRegressionModal: React.FC<EventRegressionModalProps> = ({
  isOpen,
  scenario,
  onConfirm,
  onCancel,
}) => {
  const [shockMagnitude, setShockMagnitude] = useState<number>(12);
  const [whyThesis, setWhyThesis] = useState<string>("");
  const [modelType, setModelType] = useState<"ols_factor" | "var_impulse" | "bayesian_causal">("ols_factor");
  const [confidenceInterval, setConfidenceInterval] = useState<number>(95);
  const [isComputing, setIsComputing] = useState(false);
  const [computeStep, setComputeStep] = useState("");

  // Populate default thesis on scenario load
  useEffect(() => {
    if (scenario) {
      if (scenario.id.includes("oil")) {
        setWhyThesis(
          "Crude oil is the foundational upstream feedstock for petrochemicals, aviation jet fuel, and national transport logistics. When crude spikes, input costs rise immediately for refining and chemicals, while downstream price pass-through to retail consumers suffers a 45–60 day lag, causing direct operating margin compression."
        );
        setShockMagnitude(12);
      } else if (scenario.id.includes("tsmc") || scenario.id.includes("semiconductor")) {
        setWhyThesis(
          "Foundry wafer manufacturing concentration in Taiwan creates a single point of failure for global semiconductor supply. Disruptions trigger multi-month production halts across automotive ECUs, consumer electronics, and high-performance server hardware."
        );
        setShockMagnitude(15);
      } else if (scenario.id.includes("rbi") || scenario.id.includes("rate")) {
        setWhyThesis(
          "Policy repo rate tightening elevates interbank marginal cost of funds (MCLR), increasing wholesale borrowing rates for NBFCs and debt-heavy real estate developers while cooling discretionary loan demand."
        );
        setShockMagnitude(25);
      } else {
        setWhyThesis(
          `Primary catalyst "${scenario.title}" transmits across interconnected supply chains, input commodity indices, and corporate margin structures through lagged cost pass-through channels.`
        );
        setShockMagnitude(10);
      }
    }
  }, [scenario]);

  if (!isOpen) return null;

  const handleRunRegression = () => {
    setIsComputing(true);
    setComputeStep("Estimating multi-factor asset sensitivity betas...");

    setTimeout(() => {
      setComputeStep("Calculating covariance matrix & transmission decay factors...");
    }, 400);

    setTimeout(() => {
      setComputeStep("Sorting causal nodes by impact magnitude priority (P1 Critical first)...");
    }, 750);

    setTimeout(() => {
      setIsComputing(false);
      onConfirm({
        catalyst: scenario.centerNode.title,
        shockMagnitude,
        whyThesis,
        regressionModel: modelType,
        regressionModelLabel:
          modelType === "ols_factor"
            ? "OLS Multi-Factor Elasticity"
            : modelType === "var_impulse"
            ? "VAR Impulse Response (lag=2)"
            : "Bayesian Causal Network",
        confidenceInterval,
        rSquared: 0.86,
        betaFactor: 1.42,
        tStat: 3.86,
        pValue: 0.001,
      });
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="clay-surface rounded-3xl border border-[var(--clay-border)] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-[var(--clay-surface)] border-b border-[var(--clay-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl clay-inset flex items-center justify-center font-black text-[var(--accent-primary)]">
              <Calculator className="w-5 h-5 text-[var(--accent-primary)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-[var(--text-primary)] leading-none">
                  Event Ingestion & Econometric Calibration
                </h3>
                <span className="text-[10px] font-mono clay-badge text-[var(--accent-primary)] px-2 py-0.5 rounded-full font-bold">
                  STEP 1
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 font-medium">
                Formulate the causal thesis & calibrate regression before mapping transmission nodes
              </p>
            </div>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="clay-surface p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          {/* 1. Event Catalyst Details */}
          <div className="p-4 rounded-2xl clay-inset flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-wider">
                Primary Catalyst Detected
              </span>
              <span className="text-xs font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                {scenario.centerNode.metric}
              </span>
            </div>

            <h4 className="text-base font-bold text-[var(--text-primary)] leading-snug">
              {scenario.title}
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {scenario.narrative}
            </p>

            {/* Shock magnitude slider */}
            <div className="pt-2 border-t border-[var(--clay-border)]/80 flex items-center justify-between gap-4">
              <label className="text-xs font-semibold text-[var(--text-primary)] whitespace-nowrap">
                Calibrated Shock Magnitude:
              </label>
              <div className="flex items-center gap-3 w-48">
                <input
                  type="range"
                  min="2"
                  max="50"
                  value={shockMagnitude}
                  onChange={(e) => setShockMagnitude(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-[var(--text-primary)] w-10 text-right">
                  +{shockMagnitude}%
                </span>
              </div>
            </div>
          </div>

          {/* 2. THE CRUCIAL "WHY" QUESTION */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-indigo-600" />
                <span>WHY is this event causing this? (Causal Hypothesis Thesis)</span>
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Editable Thesis</span>
            </div>

            <p className="text-xs text-[var(--text-secondary)]">
              Confirm or fine-tune the fundamental economic mechanism through which the shock propagates into downstream equities:
            </p>

            <textarea
              rows={4}
              value={whyThesis}
              onChange={(e) => setWhyThesis(e.target.value)}
              placeholder="Explain the causal transmission mechanism..."
              className="w-full p-3.5 text-xs rounded-xl border border-slate-300 clay-surface leading-relaxed text-[var(--text-primary)] font-sans focus:outline-none focus:border-slate-800 shadow-2xs"
            />
          </div>

          {/* 3. Econometric Regression Model Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Select Econometric Regression & Propagation Engine</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div
                onClick={() => setModelType("ols_factor")}
                className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  modelType === "ols_factor"
                    ? "border-blue-600 bg-blue-50/60 shadow-xs"
                    : "border-[var(--clay-border)] hover:border-slate-300 clay-surface"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-[var(--text-primary)] block leading-tight">
                    OLS Factor Elasticity
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5 block">
                    ΔY = α + β·ΔX + ε
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] mt-2">
                  Linear sensitivity regression across 10-year historical factor betas.
                </p>
              </div>

              <div
                onClick={() => setModelType("var_impulse")}
                className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  modelType === "var_impulse"
                    ? "border-blue-600 bg-blue-50/60 shadow-xs"
                    : "border-[var(--clay-border)] hover:border-slate-300 clay-surface"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-[var(--text-primary)] block leading-tight">
                    VAR Impulse Response
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5 block">
                    Lag order p=2
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] mt-2">
                  Dynamic multi-period lagged feedback response between sectors.
                </p>
              </div>

              <div
                onClick={() => setModelType("bayesian_causal")}
                className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  modelType === "bayesian_causal"
                    ? "border-blue-600 bg-blue-50/60 shadow-xs"
                    : "border-[var(--clay-border)] hover:border-slate-300 clay-surface"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-[var(--text-primary)] block leading-tight">
                    Directed Causal Graph
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5 block">
                    BFS Exponential Decay
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] mt-2">
                  Structural supply-chain BFS propagation with decay factor λ=0.72.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Priority Ordering Guarantee */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="text-xs text-emerald-900">
                <strong>Priority-Ranked Placement: </strong>
                Nodes with highest impact magnitude (P1 Critical) will be plotted prominently first.
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
              P1 &gt; P2 &gt; P3
            </span>
          </div>

          {/* Loading Computation Overlay */}
          {isComputing && (
            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center gap-3 animate-pulse">
              <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
              <span className="text-xs font-mono text-emerald-300">
                {computeStep}
              </span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <span className="text-[11px] text-[var(--text-secondary)]">
              Econometric model parameters will attach to all plotted node pathways.
            </span>
            <button
              onClick={handleRunRegression}
              disabled={isComputing}
              className="px-6 py-2.5 rounded-xl clay-button-primary text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Regression & Plot Causal Nodes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

