import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Layers,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  RefreshCw,
  Building2,
  Cpu,
  Fuel,
  Car,
  ShoppingBag,
  HeartPulse,
  Pickaxe,
  Zap,
  Radio,
  Wrench,
  Home,
  Plane,
  Palette,
  X,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Info
} from "lucide-react";

export interface ConstituentStock {
  ticker: string;
  name: string;
  weightInSector: number; // e.g. 35%
  ltp: string; // Last traded price, e.g. "₹1,684.20"
  change1D: number; // e.g. +2.1
  transmissionRole: "Upstream Producer" | "Downstream Consumer" | "Margin Sensitive" | "Core Bellwether";
}

export interface SectorItem {
  id: string;
  name: string;
  shortName: string;
  indexCode: string;
  iconType: string;
  marketWeight: number; // percentage of market, e.g. 32.4
  marketCapCr: string; // e.g. "₹42.8L Cr"
  change1D: number; // percentage
  change1W: number;
  change1M: number;
  shockBeta: number; // transmission sensitivity factor (0.5 to 2.5)
  advancers: number;
  decliners: number;
  volumeRatio: number; // e.g. 1.3x 30d avg
  shockVulnerability: string;
  constituents: ConstituentStock[];
}

interface SectorHeatmapViewProps {
  onSimulateSectorShock?: (sectorName: string) => void;
  onNavigateToGraph?: () => void;
}

// 1. Comprehensive Indian Market Sectors Dataset (Nifty 500 & Sectoral Indices)
const SECTORS_DATA: SectorItem[] = [
  {
    id: "sec-bfsi",
    name: "Banking & Financial Services",
    shortName: "Banking & Finance",
    indexCode: "NIFTY BANK",
    iconType: "bank",
    marketWeight: 32.4,
    marketCapCr: "₹42.8 Lakh Cr",
    change1D: 1.84,
    change1W: 2.92,
    change1M: 4.65,
    shockBeta: 1.45,
    advancers: 28,
    decliners: 4,
    volumeRatio: 1.38,
    shockVulnerability: "Sensitive to RBI Repo rate moves, interbank liquidity spreads & credit delinquency cycles.",
    constituents: [
      { ticker: "HDFCBANK.NS", name: "HDFC Bank Ltd.", weightInSector: 29.5, ltp: "₹1,684.50", change1D: 2.12, transmissionRole: "Core Bellwether" },
      { ticker: "ICICIBANK.NS", name: "ICICI Bank Ltd.", weightInSector: 24.2, ltp: "₹1,245.80", change1D: 1.64, transmissionRole: "Core Bellwether" },
      { ticker: "SBIN.NS", name: "State Bank of India", weightInSector: 12.8, ltp: "₹824.15", change1D: 0.92, transmissionRole: "Core Bellwether" },
      { ticker: "KOTAKBANK.NS", name: "Kotak Mahindra Bank", weightInSector: 9.6, ltp: "₹1,792.00", change1D: 1.45, transmissionRole: "Margin Sensitive" },
      { ticker: "AXISBANK.NS", name: "Axis Bank Ltd.", weightInSector: 9.2, ltp: "₹1,180.40", change1D: 2.05, transmissionRole: "Core Bellwether" },
      { ticker: "BAJFINANCE.NS", name: "Bajaj Finance Ltd.", weightInSector: 8.5, ltp: "₹6,940.00", change1D: 2.45, transmissionRole: "Margin Sensitive" },
    ],
  },
  {
    id: "sec-it",
    name: "Information Technology & Software",
    shortName: "Technology Services",
    indexCode: "NIFTY IT",
    iconType: "tech",
    marketWeight: 13.8,
    marketCapCr: "₹24.6 Lakh Cr",
    change1D: 2.38,
    change1W: 3.45,
    change1M: 5.82,
    shockBeta: 1.25,
    advancers: 19,
    decliners: 2,
    volumeRatio: 1.22,
    shockVulnerability: "Correlated to US Fed interest rates, enterprise BFSI tech discretionary budgets & USD/INR depreciation.",
    constituents: [
      { ticker: "TCS.NS", name: "Tata Consultancy Services", weightInSector: 26.8, ltp: "₹4,290.00", change1D: 2.35, transmissionRole: "Core Bellwether" },
      { ticker: "INFY.NS", name: "Infosys Ltd.", weightInSector: 24.5, ltp: "₹1,885.60", change1D: 2.78, transmissionRole: "Core Bellwether" },
      { ticker: "HCLTECH.NS", name: "HCL Technologies Ltd.", weightInSector: 12.4, ltp: "₹1,745.00", change1D: 1.95, transmissionRole: "Core Bellwether" },
      { ticker: "WIPRO.NS", name: "Wipro Ltd.", weightInSector: 7.2, ltp: "₹532.40", change1D: 1.40, transmissionRole: "Margin Sensitive" },
      { ticker: "LTIM.NS", name: "LTIMindtree Ltd.", weightInSector: 6.8, ltp: "₹5,820.00", change1D: 3.12, transmissionRole: "Downstream Consumer" },
    ],
  },
  {
    id: "sec-oil",
    name: "Oil, Gas & Energy Minerals",
    shortName: "Energy & Petrochem",
    indexCode: "NIFTY OIL & GAS",
    iconType: "oil",
    marketWeight: 11.2,
    marketCapCr: "₹21.5 Lakh Cr",
    change1D: -0.85,
    change1W: -1.42,
    change1M: 2.15,
    shockBeta: 1.85,
    advancers: 6,
    decliners: 12,
    volumeRatio: 1.15,
    shockVulnerability: "High exposure to Brent crude price shocks, Middle East shipping bottlenecks & refining GRM margins.",
    constituents: [
      { ticker: "RELIANCE.NS", name: "Reliance Industries Ltd.", weightInSector: 38.5, ltp: "₹2,795.50", change1D: -1.15, transmissionRole: "Core Bellwether" },
      { ticker: "ONGC.NS", name: "Oil & Natural Gas Corp.", weightInSector: 14.2, ltp: "₹298.40", change1D: 0.65, transmissionRole: "Upstream Producer" },
      { ticker: "BPCL.NS", name: "Bharat Petroleum Corp.", weightInSector: 8.5, ltp: "₹342.10", change1D: -2.35, transmissionRole: "Downstream Consumer" },
      { ticker: "IOC.NS", name: "Indian Oil Corp.", weightInSector: 7.8, ltp: "₹164.20", change1D: -1.80, transmissionRole: "Downstream Consumer" },
      { ticker: "GAIL.NS", name: "GAIL (India) Ltd.", weightInSector: 6.9, ltp: "₹215.80", change1D: -0.40, transmissionRole: "Upstream Producer" },
    ],
  },
  {
    id: "sec-auto",
    name: "Automotive & Auto Components",
    shortName: "Automobile",
    indexCode: "NIFTY AUTO",
    iconType: "car",
    marketWeight: 7.9,
    marketCapCr: "₹16.4 Lakh Cr",
    change1D: -1.72,
    change1W: -2.35,
    change1M: 3.20,
    shockBeta: 1.35,
    advancers: 5,
    decliners: 15,
    volumeRatio: 1.32,
    shockVulnerability: "Vulnerable to steel/rubber input inflation, NBFC vehicle loan rate spikes & rural purchasing power.",
    constituents: [
      { ticker: "TATAMOTORS.NS", name: "Tata Motors Ltd.", weightInSector: 22.4, ltp: "₹915.20", change1D: -3.42, transmissionRole: "Core Bellwether" },
      { ticker: "MARUTI.NS", name: "Maruti Suzuki India", weightInSector: 20.8, ltp: "₹12,480.00", change1D: -0.78, transmissionRole: "Core Bellwether" },
      { ticker: "M&M.NS", name: "Mahindra & Mahindra", weightInSector: 18.6, ltp: "₹2,940.00", change1D: 1.25, transmissionRole: "Core Bellwether" },
      { ticker: "BAJAJ-AUTO.NS", name: "Bajaj Auto Ltd.", weightInSector: 10.5, ltp: "₹9,850.00", change1D: -1.45, transmissionRole: "Margin Sensitive" },
      { ticker: "EICHERMOT.NS", name: "Eicher Motors Ltd.", weightInSector: 6.9, ltp: "₹4,780.00", change1D: -1.10, transmissionRole: "Margin Sensitive" },
    ],
  },
  {
    id: "sec-fmcg",
    name: "Fast-Moving Consumer Goods",
    shortName: "FMCG Staples",
    indexCode: "NIFTY FMCG",
    iconType: "fmcg",
    marketWeight: 8.4,
    marketCapCr: "₹17.2 Lakh Cr",
    change1D: 0.48,
    change1W: 0.95,
    change1M: -0.85,
    shockBeta: 0.65,
    advancers: 14,
    decliners: 8,
    volumeRatio: 0.88,
    shockVulnerability: "Defensive profile; sensitive to palm oil, packaging polymers, monsoon rain distribution & rural wages.",
    constituents: [
      { ticker: "ITC.NS", name: "ITC Ltd.", weightInSector: 32.5, ltp: "₹488.20", change1D: 1.15, transmissionRole: "Core Bellwether" },
      { ticker: "HINDUNILVR.NS", name: "Hindustan Unilever Ltd.", weightInSector: 25.8, ltp: "₹2,640.00", change1D: 0.32, transmissionRole: "Core Bellwether" },
      { ticker: "NESTLEIND.NS", name: "Nestle India Ltd.", weightInSector: 10.2, ltp: "₹2,420.00", change1D: 0.75, transmissionRole: "Margin Sensitive" },
      { ticker: "BRITANNIA.NS", name: "Britannia Industries", weightInSector: 7.8, ltp: "₹5,680.00", change1D: 0.15, transmissionRole: "Margin Sensitive" },
      { ticker: "TATACONSUM.NS", name: "Tata Consumer Products", weightInSector: 6.5, ltp: "₹1,120.00", change1D: -0.45, transmissionRole: "Downstream Consumer" },
    ],
  },
  {
    id: "sec-pharma",
    name: "Healthcare & Pharmaceuticals",
    shortName: "Health Technology",
    indexCode: "NIFTY PHARMA",
    iconType: "pharma",
    marketWeight: 5.6,
    marketCapCr: "₹12.9 Lakh Cr",
    change1D: 1.42,
    change1W: 1.82,
    change1M: 3.52,
    shockBeta: 0.75,
    advancers: 18,
    decliners: 6,
    volumeRatio: 1.05,
    shockVulnerability: "Defensive buffer; sensitive to US FDA inspection Form 483 citations and active pharmaceutical ingredient (API) prices.",
    constituents: [
      { ticker: "SUNPHARMA.NS", name: "Sun Pharmaceutical Ind.", weightInSector: 27.4, ltp: "₹1,840.00", change1D: 1.92, transmissionRole: "Core Bellwether" },
      { ticker: "CIPLA.NS", name: "Cipla Ltd.", weightInSector: 14.5, ltp: "₹1,580.00", change1D: 1.40, transmissionRole: "Core Bellwether" },
      { ticker: "DRREDDY.NS", name: "Dr. Reddy's Laboratories", weightInSector: 13.8, ltp: "₹6,480.00", change1D: 1.15, transmissionRole: "Core Bellwether" },
      { ticker: "DIVISLAB.NS", name: "Divi's Laboratories", weightInSector: 10.2, ltp: "₹5,240.00", change1D: 1.85, transmissionRole: "Upstream Producer" },
      { ticker: "APOLLOHOSP.NS", name: "Apollo Hospitals Enterprise", weightInSector: 9.6, ltp: "₹6,980.00", change1D: 0.85, transmissionRole: "Downstream Consumer" },
    ],
  },
  {
    id: "sec-metal",
    name: "Metals & Mining",
    shortName: "Metals & Minerals",
    indexCode: "NIFTY METAL",
    iconType: "metal",
    marketWeight: 4.1,
    marketCapCr: "₹9.8 Lakh Cr",
    change1D: -2.64,
    change1W: -3.85,
    change1M: 1.25,
    shockBeta: 1.95,
    advancers: 3,
    decliners: 14,
    volumeRatio: 1.62,
    shockVulnerability: "Highly pro-cyclical; immediate contagion from Chinese real-estate demand, LME base metal spot prices & coking coal tariffs.",
    constituents: [
      { ticker: "TATASTEEL.NS", name: "Tata Steel Ltd.", weightInSector: 25.8, ltp: "₹154.20", change1D: -2.45, transmissionRole: "Core Bellwether" },
      { ticker: "JSWSTEEL.NS", name: "JSW Steel Ltd.", weightInSector: 24.1, ltp: "₹968.00", change1D: -2.85, transmissionRole: "Core Bellwether" },
      { ticker: "HINDALCO.NS", name: "Hindalco Industries", weightInSector: 18.5, ltp: "₹685.00", change1D: -3.15, transmissionRole: "Upstream Producer" },
      { ticker: "COALINDIA.NS", name: "Coal India Ltd.", weightInSector: 12.2, ltp: "₹482.00", change1D: -1.25, transmissionRole: "Upstream Producer" },
      { ticker: "VEDL.NS", name: "Vedanta Ltd.", weightInSector: 9.4, ltp: "₹475.00", change1D: -2.95, transmissionRole: "Upstream Producer" },
    ],
  },
  {
    id: "sec-capgoods",
    name: "Capital Goods & Engineering",
    shortName: "Producer Manufacturing",
    indexCode: "NIFTY INFRA",
    iconType: "wrench",
    marketWeight: 4.2,
    marketCapCr: "₹10.5 Lakh Cr",
    change1D: 1.65,
    change1W: 2.15,
    change1M: 4.20,
    shockBeta: 1.20,
    advancers: 15,
    decliners: 5,
    volumeRatio: 1.18,
    shockVulnerability: "Tied to government capex announcements, industrial power demand, and global infrastructure order backlogs.",
    constituents: [
      { ticker: "LT.NS", name: "Larsen & Toubro Ltd.", weightInSector: 42.5, ltp: "₹3,620.00", change1D: 1.82, transmissionRole: "Core Bellwether" },
      { ticker: "SIEMENS.NS", name: "Siemens Ltd.", weightInSector: 14.8, ltp: "₹6,840.00", change1D: 2.25, transmissionRole: "Downstream Consumer" },
      { ticker: "ABB.NS", name: "ABB India Ltd.", weightInSector: 12.5, ltp: "₹7,950.00", change1D: 1.55, transmissionRole: "Downstream Consumer" },
      { ticker: "BEL.NS", name: "Bharat Electronics Ltd.", weightInSector: 11.2, ltp: "₹295.00", change1D: 1.95, transmissionRole: "Core Bellwether" },
      { ticker: "HAL.NS", name: "Hindustan Aeronautics", weightInSector: 10.1, ltp: "₹4,620.00", change1D: 1.40, transmissionRole: "Core Bellwether" },
    ],
  },
  {
    id: "sec-power",
    name: "Power & Green Utilities",
    shortName: "Utilities",
    indexCode: "NIFTY ENERGY",
    iconType: "zap",
    marketWeight: 3.5,
    marketCapCr: "₹8.4 Lakh Cr",
    change1D: 0.94,
    change1W: 1.55,
    change1M: 2.85,
    shockBeta: 0.85,
    advancers: 8,
    decliners: 4,
    volumeRatio: 0.95,
    shockVulnerability: "Regulated utility tariffs with steady dividend yields; exposure to thermal coal availability and grid transmission tariffs.",
    constituents: [
      { ticker: "NTPC.NS", name: "NTPC Ltd.", weightInSector: 36.4, ltp: "₹412.50", change1D: 1.45, transmissionRole: "Core Bellwether" },
      { ticker: "POWERGRID.NS", name: "Power Grid Corp of India", weightInSector: 31.2, ltp: "₹338.00", change1D: 0.85, transmissionRole: "Core Bellwether" },
      { ticker: "TATAPOWER.NS", name: "Tata Power Co. Ltd.", weightInSector: 14.5, ltp: "₹440.00", change1D: 1.20, transmissionRole: "Downstream Consumer" },
      { ticker: "ADANIGREEN.NS", name: "Adani Green Energy", weightInSector: 9.8, ltp: "₹1,890.00", change1D: 0.25, transmissionRole: "Upstream Producer" },
    ],
  },
  {
    id: "sec-chem",
    name: "Specialty Chemicals & Paints",
    shortName: "Process Industries",
    indexCode: "NIFTY CHEMICALS",
    iconType: "palette",
    marketWeight: 3.2,
    marketCapCr: "₹7.6 Lakh Cr",
    change1D: -2.18,
    change1W: -2.95,
    change1M: -1.40,
    shockBeta: 1.60,
    advancers: 2,
    decliners: 11,
    volumeRatio: 1.34,
    shockVulnerability: "Acute margin compression when crude oil climbs; titanium dioxide & phthalic anhydride inputs lag price hikes by 60 days.",
    constituents: [
      { ticker: "ASIANPAINT.NS", name: "Asian Paints Ltd.", weightInSector: 34.2, ltp: "₹2,980.00", change1D: -2.45, transmissionRole: "Downstream Consumer" },
      { ticker: "BERGEPAINT.NS", name: "Berger Paints India", weightInSector: 15.6, ltp: "₹540.00", change1D: -2.90, transmissionRole: "Downstream Consumer" },
      { ticker: "PIDILITIND.NS", name: "Pidilite Industries", weightInSector: 22.8, ltp: "₹3,120.00", change1D: -1.25, transmissionRole: "Margin Sensitive" },
      { ticker: "SRF.NS", name: "SRF Ltd.", weightInSector: 14.5, ltp: "₹2,340.00", change1D: -2.10, transmissionRole: "Upstream Producer" },
    ],
  },
  {
    id: "sec-telco",
    name: "Telecommunications & Media",
    shortName: "Communications",
    indexCode: "NIFTY MEDIA & TELCO",
    iconType: "radio",
    marketWeight: 2.8,
    marketCapCr: "₹6.8 Lakh Cr",
    change1D: 1.15,
    change1W: 1.90,
    change1M: 3.10,
    shockBeta: 0.90,
    advancers: 4,
    decliners: 2,
    volumeRatio: 1.12,
    shockVulnerability: "Driven by telecom ARPU (Average Revenue Per User) expansion, 5G spectrum monetization, and digital subscriber churn.",
    constituents: [
      { ticker: "BHARTIARTL.NS", name: "Bharti Airtel Ltd.", weightInSector: 64.5, ltp: "₹1,640.00", change1D: 1.45, transmissionRole: "Core Bellwether" },
      { ticker: "TATACOMM.NS", name: "Tata Communications", weightInSector: 16.2, ltp: "₹1,980.00", change1D: 0.85, transmissionRole: "Core Bellwether" },
      { ticker: "INDUSTOWER.NS", name: "Indus Towers Ltd.", weightInSector: 12.4, ltp: "₹385.00", change1D: 0.40, transmissionRole: "Upstream Producer" },
    ],
  },
  {
    id: "sec-realty",
    name: "Real Estate & Housing Infrastructure",
    shortName: "Real Estate",
    indexCode: "NIFTY REALTY",
    iconType: "home",
    marketWeight: 1.9,
    marketCapCr: "₹4.2 Lakh Cr",
    change1D: -0.62,
    change1W: 0.45,
    change1M: 5.20,
    shockBeta: 1.55,
    advancers: 4,
    decliners: 8,
    volumeRatio: 0.92,
    shockVulnerability: "Directly affected by retail home loan interest rates, cement/steel building cost inflation & inventory absorption cycles.",
    constituents: [
      { ticker: "DLF.NS", name: "DLF Ltd.", weightInSector: 36.5, ltp: "₹842.00", change1D: -0.85, transmissionRole: "Core Bellwether" },
      { ticker: "GODREJPROP.NS", name: "Godrej Properties", weightInSector: 22.4, ltp: "₹2,950.00", change1D: -0.42, transmissionRole: "Core Bellwether" },
      { ticker: "LODHA.NS", name: "Macrotech Developers", weightInSector: 18.2, ltp: "₹1,180.00", change1D: 0.35, transmissionRole: "Downstream Consumer" },
      { ticker: "OBEROIRLTY.NS", name: "Oberoi Realty Ltd.", weightInSector: 14.5, ltp: "₹1,820.00", change1D: -1.15, transmissionRole: "Margin Sensitive" },
    ],
  },
  {
    id: "sec-aviation",
    name: "Aviation, Logistics & Freight",
    shortName: "Transportation",
    indexCode: "LOGISTICS INDEX",
    iconType: "plane",
    marketWeight: 1.0,
    marketCapCr: "₹2.4 Lakh Cr",
    change1D: -3.85,
    change1W: -4.62,
    change1M: -2.15,
    shockBeta: 2.45,
    advancers: 1,
    decliners: 5,
    volumeRatio: 1.78,
    shockVulnerability: "Aviation Turbine Fuel (ATF) accounts for 40% of airline OPEX. High transmission sensitivity to crude oil rally.",
    constituents: [
      { ticker: "INDIGO.NS", name: "InterGlobe Aviation Ltd.", weightInSector: 58.2, ltp: "₹4,620.00", change1D: -4.25, transmissionRole: "Downstream Consumer" },
      { ticker: "CONCOR.NS", name: "Container Corp of India", weightInSector: 21.5, ltp: "₹910.00", change1D: 0.40, transmissionRole: "Core Bellwether" },
      { ticker: "DELHIVERY.NS", name: "Delhivery Ltd.", weightInSector: 12.8, ltp: "₹385.00", change1D: -2.15, transmissionRole: "Downstream Consumer" },
    ],
  },
];

// Helper to get sector icon
const getSectorIcon = (type: string, className = "w-4 h-4") => {
  switch (type) {
    case "bank":
      return <Building2 className={className} />;
    case "tech":
      return <Cpu className={className} />;
    case "oil":
      return <Fuel className={className} />;
    case "car":
      return <Car className={className} />;
    case "fmcg":
      return <ShoppingBag className={className} />;
    case "pharma":
      return <HeartPulse className={className} />;
    case "metal":
      return <Pickaxe className={className} />;
    case "wrench":
      return <Wrench className={className} />;
    case "zap":
      return <Zap className={className} />;
    case "palette":
      return <Palette className={className} />;
    case "radio":
      return <Radio className={className} />;
    case "home":
      return <Home className={className} />;
    case "plane":
      return <Plane className={className} />;
    default:
      return <Layers className={className} />;
  }
};

// TradingView Color Mapping Function
export const getTradingViewColor = (val: number) => {
  if (val >= 3.0) return { bg: "bg-[#05603a]", border: "border-[#034428]", text: "text-white", glow: "hover:ring-emerald-400" };
  if (val >= 2.0) return { bg: "bg-[#15803d]", border: "border-[#166534]", text: "text-white", glow: "hover:ring-emerald-300" };
  if (val >= 1.0) return { bg: "bg-[#16a34a]", border: "border-[#15803d]", text: "text-white", glow: "hover:ring-emerald-200" };
  if (val > 0.15) return { bg: "bg-[#22c55e]", border: "border-[#16a34a]", text: "text-white", glow: "hover:ring-green-200" };
  if (val >= -0.15 && val <= 0.15) return { bg: "bg-[#475569]", border: "border-[#334155]", text: "text-white", glow: "hover:ring-slate-300" };
  if (val > -1.0) return { bg: "bg-[#ef4444]", border: "border-[#dc2626]", text: "text-white", glow: "hover:ring-rose-200" };
  if (val > -2.0) return { bg: "bg-[#dc2626]", border: "border-[#b91c1c]", text: "text-white", glow: "hover:ring-rose-300" };
  if (val > -3.0) return { bg: "bg-[#b91c1c]", border: "border-[#991b1b]", text: "text-white", glow: "hover:ring-red-400" };
  return { bg: "bg-[#881337]", border: "border-[#701a75]", text: "text-white", glow: "hover:ring-rose-500" };
};

// Squarified Treemap partition calculation
interface TreemapNode {
  item: SectorItem;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  w: number; // 0 to 100 percentage
  h: number; // 0 to 100 percentage
}

function calculateTreemap(
  items: SectorItem[],
  metricKey: "marketWeight" | "volumeRatio" | "shockBeta"
): TreemapNode[] {
  if (!items || items.length === 0) return [];

  // Sort items descending by metric value
  const sorted = [...items].sort((a, b) => {
    const valA = metricKey === "marketWeight" ? a.marketWeight : metricKey === "volumeRatio" ? a.volumeRatio : a.shockBeta;
    const valB = metricKey === "marketWeight" ? b.marketWeight : metricKey === "volumeRatio" ? b.volumeRatio : b.shockBeta;
    return valB - valA;
  });

  const total = sorted.reduce((sum, item) => {
    const val = metricKey === "marketWeight" ? item.marketWeight : metricKey === "volumeRatio" ? item.volumeRatio : item.shockBeta;
    return sum + Math.max(0.1, val);
  }, 0);

  const results: TreemapNode[] = [];

  function sliceTreemap(nodes: SectorItem[], x: number, y: number, w: number, h: number) {
    if (nodes.length === 0) return;
    if (nodes.length === 1) {
      results.push({ item: nodes[0], x, y, w, h });
      return;
    }

    const subTotal = nodes.reduce((sum, item) => {
      const val = metricKey === "marketWeight" ? item.marketWeight : metricKey === "volumeRatio" ? item.volumeRatio : item.shockBeta;
      return sum + Math.max(0.1, val);
    }, 0);

    // Find partition index that splits subTotal roughly in half
    let accumulated = 0;
    let splitIndex = 0;
    for (let i = 0; i < nodes.length; i++) {
      const val = metricKey === "marketWeight" ? nodes[i].marketWeight : metricKey === "volumeRatio" ? nodes[i].volumeRatio : nodes[i].shockBeta;
      accumulated += Math.max(0.1, val);
      if (accumulated >= subTotal / 2 || i === nodes.length - 2) {
        splitIndex = i + 1;
        break;
      }
    }

    const groupA = nodes.slice(0, splitIndex);
    const groupB = nodes.slice(splitIndex);

    const totalA = groupA.reduce((sum, item) => {
      const val = metricKey === "marketWeight" ? item.marketWeight : metricKey === "volumeRatio" ? item.volumeRatio : item.shockBeta;
      return sum + Math.max(0.1, val);
    }, 0);
    const ratioA = totalA / subTotal;

    // Split along the longer dimension to keep aspect ratio squarish
    if (w >= h) {
      const wA = w * ratioA;
      const wB = w - wA;
      sliceTreemap(groupA, x, y, wA, h);
      sliceTreemap(groupB, x + wA, y, wB, h);
    } else {
      const hA = h * ratioA;
      const hB = h - hA;
      sliceTreemap(groupA, x, y, w, hA);
      sliceTreemap(groupB, x, y + hA, w, hB);
    }
  }

  sliceTreemap(sorted, 0, 0, 100, 100);
  return results;
}

export const SectorHeatmapView: React.FC<SectorHeatmapViewProps> = ({
  onSimulateSectorShock,
  onNavigateToGraph,
}) => {
  const [activeUniverse, setActiveUniverse] = useState<"nifty500" | "nifty50" | "global">("nifty500");
  const [activeMetric, setActiveMetric] = useState<"1D" | "1W" | "1M" | "shockBeta">("1D");
  const [activeSizing, setActiveSizing] = useState<"marketWeight" | "volumeRatio" | "shockBeta">("marketWeight");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<SectorItem | null>(null);

  // Filter sectors by search query
  const filteredSectors = useMemo(() => {
    if (!searchQuery.trim()) return SECTORS_DATA;
    const query = searchQuery.toLowerCase();
    return SECTORS_DATA.filter(
      (sec) =>
        sec.name.toLowerCase().includes(query) ||
        sec.shortName.toLowerCase().includes(query) ||
        sec.indexCode.toLowerCase().includes(query) ||
        sec.constituents.some((c) => c.ticker.toLowerCase().includes(query) || c.name.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Compute treemap geometry
  const treemapNodes = useMemo(() => {
    return calculateTreemap(filteredSectors, activeSizing);
  }, [filteredSectors, activeSizing]);

  // Overall Market Breadth summary statistics
  const breadthStats = useMemo(() => {
    let advances = 0;
    let declines = 0;
    let advWeight = 0;
    let decWeight = 0;
    let weightedDelta = 0;

    SECTORS_DATA.forEach((s) => {
      const delta = activeMetric === "1D" ? s.change1D : activeMetric === "1W" ? s.change1W : s.change1M;
      if (delta > 0) {
        advances++;
        advWeight += s.marketWeight;
      } else {
        declines++;
        decWeight += s.marketWeight;
      }
      weightedDelta += delta * (s.marketWeight / 100);
    });

    return {
      advances,
      declines,
      advWeight: advWeight.toFixed(1),
      decWeight: decWeight.toFixed(1),
      weightedDelta: weightedDelta > 0 ? `+${weightedDelta.toFixed(2)}%` : `${weightedDelta.toFixed(2)}%`,
      isBullish: weightedDelta >= 0,
    };
  }, [activeMetric]);

  return (
    <div className="flex flex-col h-full w-full gap-3 select-none pb-2">
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 clay-surface p-3.5 rounded-2xl border border-[var(--clay-border)]/90 shadow-2xs">
        {/* Title & Index Pill */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#111111] text-white flex items-center justify-center shadow-xs">
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight leading-none">
                Sector Heatmap
              </h2>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                LIVE NSE
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] font-sans mt-0.5">
              Proportional sector treemap weighted by market capitalization and real-time transmission
            </p>
          </div>
        </div>

        {/* Controls: Universe / Metric / Sizing / Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Index Universe Switcher */}
          <div className="flex items-center clay-inset p-0.5 rounded-xl border border-[var(--clay-border)] text-xs">
            <button
              onClick={() => setActiveUniverse("nifty500")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeUniverse === "nifty500"
                  ? "clay-surface text-[var(--text-primary)] shadow-2xs font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Nifty 500 Sectors
            </button>
            <button
              onClick={() => setActiveUniverse("nifty50")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeUniverse === "nifty50"
                  ? "clay-surface text-[var(--text-primary)] shadow-2xs font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Heavyweights
            </button>
          </div>

          {/* Timeframe Metric Pill */}
          <div className="flex items-center clay-inset p-0.5 rounded-xl border border-[var(--clay-border)] text-xs">
            {(["1D", "1W", "1M"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  activeMetric === m
                    ? "clay-surface text-[var(--text-primary)] shadow-2xs font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {m === "1D" ? "Change 1D, %" : m === "1W" ? "Change 1W, %" : "1M Momentum"}
              </button>
            ))}
          </div>

          {/* Sizing Selector */}
          <div className="relative">
            <select
              value={activeSizing}
              onChange={(e) => setActiveSizing(e.target.value as any)}
              className="text-xs clay-surface hover:clay-inset border border-[var(--clay-border)] rounded-xl px-2.5 py-1.5 font-medium text-[var(--text-primary)] outline-none cursor-pointer"
            >
              <option value="marketWeight">Size: Market Cap Wt</option>
              <option value="volumeRatio">Size: Volume Turnover</option>
              <option value="shockBeta">Size: Event Shock Beta</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sector or ticker..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[var(--clay-border)] clay-surface placeholder-slate-400 focus:outline-none focus:border-slate-400 w-44 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 text-slate-400 hover:text-[var(--text-secondary)]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. The Main Treemap Canvas Area */}
      <div className="flex-1 w-full relative min-h-[500px] rounded-2xl overflow-hidden border border-[var(--clay-border)]/90 bg-[#121212] shadow-sm p-1.5">
        <div className="w-full h-full relative">
          {treemapNodes.map(({ item, x, y, w, h }) => {
            const delta =
              activeMetric === "1D"
                ? item.change1D
                : activeMetric === "1W"
                ? item.change1W
                : item.change1M;
            const styleColor = getTradingViewColor(delta);
            const isSelected = selectedSector?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedSector(item)}
                style={{
                  position: "absolute",
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${w}%`,
                  height: `${h}%`,
                  padding: "3px",
                  boxSizing: "border-box",
                }}
                className="transition-all duration-300"
              >
                <div
                  className={`w-full h-full rounded-xl p-3 flex flex-col justify-between cursor-pointer border transition-all duration-150 ${
                    styleColor.bg
                  } ${styleColor.border} ${styleColor.glow} ${
                    isSelected ? "ring-3 ring-white shadow-xl scale-[0.99] z-20" : "hover:brightness-110 shadow-xs"
                  }`}
                >
                  {/* Card Header: Sector Name & Index Tag */}
                  <div className="flex items-start justify-between gap-1 overflow-hidden">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="p-1 rounded-md bg-black/25 text-white/90 flex-shrink-0">
                        {getSectorIcon(item.iconType, "w-3.5 h-3.5")}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white tracking-tight truncate leading-tight">
                          {item.shortName}
                        </h4>
                        <span className="text-[10px] text-white/70 font-mono tracking-tight block truncate">
                          {item.indexCode}
                        </span>
                      </div>
                    </div>

                    <span className="text-[9.5px] font-mono bg-black/30 text-white/90 px-1.5 py-0.5 rounded flex-shrink-0">
                      {item.marketWeight}%
                    </span>
                  </div>

                  {/* Card Body: Big Change Percentage */}
                  <div className="my-auto py-1 flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl md:text-2xl font-black text-white tracking-tighter leading-none">
                        {delta > 0 ? `+${delta.toFixed(2)}%` : `${delta.toFixed(2)}%`}
                      </span>
                      {delta >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-200" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-rose-200" />
                      )}
                    </div>
                    {w > 18 && h > 20 && (
                      <span className="text-[10px] text-white/75 font-sans mt-0.5 line-clamp-1">
                        Cap: {item.marketCapCr}
                      </span>
                    )}
                  </div>

                  {/* Card Footer: Top Constituents Previews (visible when tile is wide enough) */}
                  {w > 16 && h > 18 && (
                    <div className="flex flex-wrap items-center gap-1 overflow-hidden pt-1 border-t border-white/15">
                      {item.constituents.slice(0, w > 25 ? 3 : 2).map((c) => (
                        <div
                          key={c.ticker}
                          className="text-[9px] bg-black/35 hover:bg-black/50 text-white/95 px-1.5 py-0.5 rounded font-mono flex items-center gap-1 truncate"
                        >
                          <span className="font-semibold">{c.ticker.replace(".NS", "")}</span>
                          <span
                            className={c.change1D >= 0 ? "text-emerald-300 font-bold" : "text-rose-300 font-bold"}
                          >
                            {c.change1D >= 0 ? `+${c.change1D}%` : `${c.change1D}%`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Legend & Market Breadth Bar (TradingView Style) */}
      <div className="flex flex-wrap items-center justify-between gap-3 clay-surface px-4 py-2.5 rounded-2xl border border-[var(--clay-border)]/90 shadow-2xs text-xs text-[var(--text-primary)]">
        {/* Left: Color Gradient Legend Bar */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            1D Return Scale:
          </span>
          <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-white">
            <span className="bg-[#881337] px-2 py-0.5 rounded text-center min-w-[34px]">&lt;-3%</span>
            <span className="bg-[#b91c1c] px-2 py-0.5 rounded text-center min-w-[34px]">-2%</span>
            <span className="bg-[#dc2626] px-2 py-0.5 rounded text-center min-w-[34px]">-1%</span>
            <span className="bg-[#475569] px-2 py-0.5 rounded text-center min-w-[34px]">0%</span>
            <span className="bg-[#22c55e] px-2 py-0.5 rounded text-center min-w-[34px]">+1%</span>
            <span className="bg-[#15803d] px-2 py-0.5 rounded text-center min-w-[34px]">+2%</span>
            <span className="bg-[#05603a] px-2 py-0.5 rounded text-center min-w-[34px]">&gt;+3%</span>
          </div>
        </div>

        {/* Right: Breadth Stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            <span className="text-[var(--text-secondary)]">
              Advancing: <strong className="text-[var(--text-primary)]">{breadthStats.advances} Sectors</strong> ({breadthStats.advWeight}% Wt)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-100" />
            <span className="text-[var(--text-secondary)]">
              Declining: <strong className="text-[var(--text-primary)]">{breadthStats.declines} Sectors</strong> ({breadthStats.decWeight}% Wt)
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-lg clay-inset border border-[var(--clay-border)]/80 font-mono text-[11px]">
            Weighted Net: <strong className={breadthStats.isBullish ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>{breadthStats.weightedDelta}</strong>
          </div>
        </div>
      </div>

      {/* 4. Sector Drilldown & Transmission Modal */}
      {selectedSector && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="clay-surface rounded-3xl border border-[var(--clay-border)] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--clay-border)] flex items-start justify-between clay-surface/60">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#111111] text-white flex items-center justify-center shadow-xs">
                  {getSectorIcon(selectedSector.iconType, "w-5 h-5 text-emerald-400")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">
                      {selectedSector.name}
                    </h3>
                    <span className="text-xs font-mono font-bold bg-slate-200 text-[var(--text-primary)] px-2 py-0.5 rounded-full">
                      {selectedSector.indexCode}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Market Weight: <strong>{selectedSector.marketWeight}%</strong> • Total Cap: <strong>{selectedSector.marketCapCr}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSector(null)}
                className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Metrics & Stock Table */}
            <div className="p-5 overflow-y-auto flex flex-col gap-4">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl clay-surface border border-[var(--clay-border)]/80">
                  <span className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase">1D Change</span>
                  <div className={`text-base font-bold font-mono mt-0.5 ${selectedSector.change1D >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {selectedSector.change1D >= 0 ? `+${selectedSector.change1D}%` : `${selectedSector.change1D}%`}
                  </div>
                </div>

                <div className="p-3 rounded-xl clay-surface border border-[var(--clay-border)]/80">
                  <span className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase">1W Return</span>
                  <div className={`text-base font-bold font-mono mt-0.5 ${selectedSector.change1W >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {selectedSector.change1W >= 0 ? `+${selectedSector.change1W}%` : `${selectedSector.change1W}%`}
                  </div>
                </div>

                <div className="p-3 rounded-xl clay-surface border border-[var(--clay-border)]/80">
                  <span className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase">Shock Beta</span>
                  <div className="text-base font-bold font-mono text-[var(--text-primary)] mt-0.5">
                    {selectedSector.shockBeta}x
                  </div>
                </div>

                <div className="p-3 rounded-xl clay-surface border border-[var(--clay-border)]/80">
                  <span className="text-[10px] text-[var(--text-secondary)] font-semibold uppercase">Breadth</span>
                  <div className="text-xs font-bold text-[var(--text-primary)] mt-1">
                    <span className="text-emerald-600">{selectedSector.advancers} Adv</span> / <span className="text-rose-600">{selectedSector.decliners} Dec</span>
                  </div>
                </div>
              </div>

              {/* Vulnerability Banner */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <strong className="font-semibold">Causal Transmission Profile: </strong>
                  {selectedSector.shockVulnerability}
                </div>
              </div>

              {/* Constituent Bellwethers Table */}
              <div>
                <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                  Top Constituent Bellwethers ({selectedSector.constituents.length})
                </h4>
                <div className="rounded-2xl border border-[var(--clay-border)] overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="clay-surface border-b border-[var(--clay-border)] text-[var(--text-secondary)] font-semibold">
                      <tr>
                        <th className="p-2.5">Stock</th>
                        <th className="p-2.5">Weight</th>
                        <th className="p-2.5">Price</th>
                        <th className="p-2.5">1D Change</th>
                        <th className="p-2.5">Transmission Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedSector.constituents.map((stock) => (
                        <tr key={stock.ticker} className="hover:clay-surface/80 transition-colors">
                          <td className="p-2.5">
                            <span className="font-bold text-[var(--text-primary)] font-mono">{stock.ticker.replace(".NS", "")}</span>
                            <span className="block text-[10px] text-[var(--text-secondary)] truncate">{stock.name}</span>
                          </td>
                          <td className="p-2.5 font-mono">{stock.weightInSector}%</td>
                          <td className="p-2.5 font-mono font-medium">{stock.ltp}</td>
                          <td className="p-2.5 font-mono font-bold">
                            <span className={stock.change1D >= 0 ? "text-emerald-600" : "text-rose-600"}>
                              {stock.change1D >= 0 ? `+${stock.change1D}%` : `${stock.change1D}%`}
                            </span>
                          </td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold clay-inset text-[var(--text-primary)] border border-[var(--clay-border)]">
                              {stock.transmissionRole}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer: Action CTAs */}
            <div className="p-4 border-t border-[var(--clay-border)] clay-surface/70 flex items-center justify-between">
              <span className="text-[11px] text-[var(--text-secondary)]">
                Simulate ripple impact of macro shock on {selectedSector.name}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSector(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-[var(--clay-border)] hover:clay-inset text-xs font-semibold text-[var(--text-primary)] cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (onSimulateSectorShock) {
                      onSimulateSectorShock(selectedSector.name);
                    } else if (onNavigateToGraph) {
                      onNavigateToGraph();
                    }
                    setSelectedSector(null);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Simulate Causal Shock in Impact Graph →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

