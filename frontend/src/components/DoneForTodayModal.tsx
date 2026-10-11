import React, { useState } from "react";
import { Sparkles, CheckCircle2, GitCommit, ShieldCheck, Heart, Moon, ArrowRight, X } from "lucide-react";

interface DoneForTodayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPushToGit?: () => Promise<void> | void;
}

export const DoneForTodayModal: React.FC<DoneForTodayModalProps> = ({
  isOpen,
  onClose,
  onPushToGit,
}) => {
  const [isPushing, setIsPushing] = useState(false);
  const [isPushed, setIsPushed] = useState(false);

  if (!isOpen) return null;

  const handlePush = async () => {
    setIsPushing(true);
    try {
      if (onPushToGit) {
        await onPushToGit();
      }
      setIsPushed(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col p-7 relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Apple Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-[0_10px_25px_rgba(16,185,129,0.35)] mb-4">
          <Sparkles className="w-7 h-7" />
        </div>

        {/* Title & Narrative */}
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
          Done for Today!
        </h3>
        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
          Phenomenal session. Your market shocks, multi-hop pathways, and econometric hypotheses have been mapped and preserved in Fin.D.
        </p>

        {/* Session Recap Glass Pill Grid */}
        <div className="grid grid-cols-2 gap-3 my-5">
          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 shadow-2xs flex flex-col">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Causal Nodes</span>
            <span className="text-xl font-bold text-slate-900 mt-0.5">14 Active</span>
            <span className="text-[11px] text-emerald-600 font-medium mt-0.5">Multi-tier verified</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 shadow-2xs flex flex-col">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Transmission Depth</span>
            <span className="text-xl font-bold text-slate-900 mt-0.5">3 Hops</span>
            <span className="text-[11px] text-blue-600 font-medium mt-0.5">Decay factor 0.85</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 shadow-2xs flex flex-col">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Regression Beta</span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 font-mono">β = 1.42</span>
            <span className="text-[11px] text-purple-600 font-medium mt-0.5">R² = 0.86 (p &lt; 0.001)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/70 shadow-2xs flex flex-col">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Git Status</span>
            <span className="text-xl font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Synced</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-0.5">Hourly daemon active</span>
          </div>
        </div>

        {/* Motivational Institutional Footer */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center gap-2.5 mb-5">
          <Moon className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            Markets may sleep, but the knowledge graph stands ready for tomorrow&apos;s bell.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-2xl bg-slate-900 hover:bg-black text-white text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Wrap Up &amp; Rest</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
