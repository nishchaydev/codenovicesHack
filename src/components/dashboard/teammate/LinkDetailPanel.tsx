import React from "react";
import { GraphLink } from "@/types/fingraph/types";
import { X, ArrowRight } from "lucide-react";

interface LinkDetailPanelProps {
  link: GraphLink | null;
  onClose: () => void;
}

export const LinkDetailPanel: React.FC<LinkDetailPanelProps> = ({ link, onClose }) => {
  if (!link) return null;

  const srcName = typeof link.source === "object" ? link.source.name : link.source;
  const tgtName = typeof link.target === "object" ? link.target.name : link.target;

  return (
    <div className="absolute top-4 left-4 z-20 w-84 max-w-[calc(100vw-32px)] bg-[#ffffff] border border-[#e0e0e0] p-5 rounded-[24px] text-[#141414] animate-in fade-in slide-in-from-top-2 duration-150 shadow-sm">
      <div className="flex items-start justify-between gap-2 border-b border-[#f0f0f0] pb-3">
        <div>
          <span className="text-[10px] font-sans font-semibold uppercase bg-[#f3f3f3] text-[#707070] px-2 py-0.5 rounded-full border border-[#e0e0e0]">
            Transmission Channel
          </span>
          <div className="flex items-center gap-1.5 font-bold text-sm text-[#141414] mt-2">
            <span>{srcName}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#adadad] shrink-0" />
            <span>{tgtName}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-[#707070] hover:text-[#141414] p-1.5 rounded-full hover:bg-[#f3f3f3] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 my-3 text-xs font-sans">
        <div className="bg-[#f3f3f3] p-2.5 rounded-[16px]">
          <span className="text-[10px] text-[#707070] block font-medium">WEIGHT</span>
          <span className="text-[#141414] font-bold block text-sm">{link.weight}</span>
        </div>
        <div className="bg-[#f3f3f3] p-2.5 rounded-[16px]">
          <span className="text-[10px] text-[#707070] block font-medium">CONFIDENCE</span>
          <span className="text-[#0066ff] font-bold block text-sm">
            {Math.round(link.confidence * 100)}%
          </span>
        </div>
      </div>

      <div className="mb-2">
        <span className="text-[10px] font-sans text-[#707070] uppercase font-semibold block mb-1">
          Mechanism ({link.type})
        </span>
        <p className="text-xs text-[#262626] leading-relaxed bg-[#f3f3f3] p-3 rounded-[16px]">
          {link.explanation}
        </p>
      </div>
    </div>
  );
};

