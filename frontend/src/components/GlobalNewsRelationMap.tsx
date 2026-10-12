import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Globe,
  Radio,
  ArrowUpRight,
  MapPin,
  TrendingUp,
  Newspaper,
  Layers,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
  Compass,
} from 'lucide-react';

// ─── Global type declaration for Mappls Web SDK ───────────────
declare global {
  interface Window {
    mappls: any;
  }
}

// ─── Data Types ───────────────────────────────────────────────
export interface GeoNode {
  id: string;
  name: string;
  type: 'country' | 'state';
  countryCode: 'USA' | 'IND' | 'GLOBAL';
  lng: number;
  lat: number;
}

export interface NewsRelation {
  id: string;
  headline: string;
  sourceId: string;
  targetId: string;
  tag: string;
  category: 'IMMIGRATION' | 'TECH' | 'CHIPS' | 'MACRO' | 'TRADE' | 'ENERGY';
  impactLevel: 'high' | 'medium' | 'low';
  summary: string;
  sourceUrl?: string;
  sourcePublisher?: string;
  sectors: string[];
}

// ─── Geographical Nodes (Longitudes & Latitudes) ───────────────
export const GEO_NODES: GeoNode[] = [
  // --- Global Country Anchors ---
  { id: 'c-usa', name: 'United States', type: 'country', countryCode: 'USA', lng: -98.5795, lat: 39.8283 },
  { id: 'c-ind', name: 'India', type: 'country', countryCode: 'IND', lng: 78.9629, lat: 22.5937 },
  { id: 'c-gbr', name: 'United Kingdom (London)', type: 'country', countryCode: 'GLOBAL', lng: -0.1278, lat: 51.5074 },
  { id: 'c-jpn', name: 'Japan (Tokyo)', type: 'country', countryCode: 'GLOBAL', lng: 139.6917, lat: 35.6895 },
  { id: 'c-sgp', name: 'Singapore (Financial Hub)', type: 'country', countryCode: 'GLOBAL', lng: 103.8198, lat: 1.3521 },
  { id: 'c-deu', name: 'Germany (Frankfurt / EU Hub)', type: 'country', countryCode: 'GLOBAL', lng: 8.6821, lat: 50.1109 },
  { id: 'c-twn', name: 'Taiwan (Hsinchu TSMC Hub)', type: 'country', countryCode: 'GLOBAL', lng: 120.9605, lat: 23.6978 },
  { id: 'c-fra', name: 'France (Paris / AI & Defense)', type: 'country', countryCode: 'GLOBAL', lng: 2.3522, lat: 48.8566 },
  { id: 'c-uae', name: 'UAE (Dubai / Trade & Capital)', type: 'country', countryCode: 'GLOBAL', lng: 55.2708, lat: 25.2048 },
  { id: 'c-can', name: 'Canada (Toronto Tech)', type: 'country', countryCode: 'GLOBAL', lng: -79.3832, lat: 43.6532 },

  // --- Sub-State Nodes: India Tech & Industrial Corridors ---
  { id: 's-ind-ka', name: 'Karnataka (Bengaluru / AI & GCC)', type: 'state', countryCode: 'IND', lng: 77.5946, lat: 12.9716 },
  { id: 's-ind-ts', name: 'Telangana (Hyderabad / Bio & Cloud)', type: 'state', countryCode: 'IND', lng: 78.4867, lat: 17.3850 },
  { id: 's-ind-mh', name: 'Maharashtra (Mumbai / FinTech & BSE)', type: 'state', countryCode: 'IND', lng: 72.8777, lat: 19.0760 },
  { id: 's-ind-tn', name: 'Tamil Nadu (Chennai / iPhone & Auto)', type: 'state', countryCode: 'IND', lng: 80.2707, lat: 13.0827 },
  { id: 's-ind-gj', name: 'Gujarat (GIFT City & Dholera Fab)', type: 'state', countryCode: 'IND', lng: 72.5714, lat: 23.0225 },
  { id: 's-ind-dl', name: 'Delhi NCR (Policy & Trade Ministry)', type: 'state', countryCode: 'IND', lng: 77.2090, lat: 28.6139 },
  { id: 's-ind-up', name: 'Uttar Pradesh (Noida / Electronics)', type: 'state', countryCode: 'IND', lng: 77.3910, lat: 28.5355 },
  { id: 's-ind-as', name: 'Assam (Morigaon / Tata OSAT Fab)', type: 'state', countryCode: 'IND', lng: 92.3424, lat: 26.2505 },
  { id: 's-ind-ap', name: 'Andhra Pradesh (Sriharikota / Spaceport)', type: 'state', countryCode: 'IND', lng: 80.2307, lat: 13.7198 },

  // --- Sub-State Nodes: USA Commercial & Tech Corridors ---
  { id: 's-usa-ca', name: 'California (Silicon Valley / Hyperscalers)', type: 'state', countryCode: 'USA', lng: -122.0838, lat: 37.3861 },
  { id: 's-usa-ny', name: 'New York (Wall St / Capital Markets)', type: 'state', countryCode: 'USA', lng: -74.0060, lat: 40.7128 },
  { id: 's-usa-tx', name: 'Texas (Austin / Energy & Semi)', type: 'state', countryCode: 'USA', lng: -97.7431, lat: 30.2672 },
  { id: 's-usa-wa', name: 'Washington (Seattle / Cloud Hyperscalers)', type: 'state', countryCode: 'USA', lng: -122.3321, lat: 47.6062 },
  { id: 's-usa-nj', name: 'New Jersey (IT Consulting & Pharma)', type: 'state', countryCode: 'USA', lng: -74.4121, lat: 40.5187 },
];

// ─── 33 Comprehensive News Relations (Global & State-Level) ─────
export const NEWS_RELATIONS: NewsRelation[] = [
  // ── 1. IMMIGRATION, PERM BAN & GCC EXPANSION (The Hindu Breaking Feature) ──
  {
    id: 'rel-perm-hindu',
    headline: "Trump's Move to Suspend PERM Program for Indian IT Majors Sparks Talent Retention Concerns & GCC Expansion",
    sourceId: 'c-usa',
    targetId: 's-ind-ka',
    tag: 'PERM SUSPENDED',
    category: 'IMMIGRATION',
    impactLevel: 'high',
    summary: 'The Trump administration has suspended the Permanent Labor Certification (PERM) program for Indian IT giants (TCS, Infosys, Wipro, HCLTech). As H-1B holders face the strict 6-year statutory cap without Green Card filings, IT firms are accelerating senior engineering repatriation and shifting high-complexity AI architecture directly to Bengaluru GCCs.',
    sourceUrl: 'https://www.thehindu.com/business/Industry/trumps-move-to-suspend-perm-programme-for-indian-it-majors-raises-talent-retention-concerns/article71563952.ece',
    sourcePublisher: 'The Hindu',
    sectors: ['IT Services', 'H-1B Visas', 'GCC Centers', 'Cloud Architecture'],
  },
  {
    id: 'rel-perm-hyderabad',
    headline: 'US PERM Freeze Drives Seattle & Silicon Valley Hyperscalers to Scale Redundant Product Pods in Hyderabad',
    sourceId: 's-usa-wa',
    targetId: 's-ind-ts',
    tag: 'GCC SCALE',
    category: 'IMMIGRATION',
    impactLevel: 'high',
    summary: 'Department of Labor scrutiny and PERM pause prompt enterprise software giants to transfer entire autonomous microservices squads to Hyderabad HITEC City, expanding compensation packages for senior Indian staff.',
    sourceUrl: 'https://www.thehindu.com/business/Industry/trumps-move-to-suspend-perm-programme-for-indian-it-majors-raises-talent-retention-concerns/article71563952.ece',
    sourcePublisher: 'Industry Intel',
    sectors: ['Enterprise Cloud', 'Talent Retention', 'GCC'],
  },
  {
    id: 'rel-perm-wallst',
    headline: 'Wall Street Investment Banks Restructure Offshore Contracts as PERM Halt Impacts NJ & NY IT Consultants',
    sourceId: 's-usa-ny',
    targetId: 's-ind-mh',
    tag: 'FIN-TECH OFFSHORE',
    category: 'IMMIGRATION',
    impactLevel: 'high',
    summary: 'Financial institutions in Manhattan and Jersey City reclassify on-site TCS and Wipro teams, routing mission-critical quantitative trading algorithms to Mumbai-based offshore development centers.',
    sourcePublisher: 'Wall Street Dispatch',
    sectors: ['Banking', 'IT Services', 'Compliance'],
  },
  {
    id: 'rel-perm-nearshore',
    headline: 'Canadian Nearshoring Gateway Expands for Indian Engineers Facing US Visa Deadlines',
    sourceId: 'c-can',
    targetId: 's-ind-up',
    tag: 'TORONTO NEARSHORE',
    category: 'IMMIGRATION',
    impactLevel: 'medium',
    summary: 'Firms establish bilateral bridge assignments connecting Toronto technology hubs with Noida campuses, allowing displaced US H-1B specialists to maintain enterprise continuity without loss of seniority.',
    sourcePublisher: 'Global Talent Wire',
    sectors: ['Cross-Border HR', 'Nearshoring'],
  },
  {
    id: 'rel-perm-uk',
    headline: 'UK Tech Sector Launches Fast-Track Visa Pipeline Targeting Displaced US Senior Indian Engineers',
    sourceId: 'c-gbr',
    targetId: 's-ind-ka',
    tag: 'TALENT CORRIDOR',
    category: 'IMMIGRATION',
    impactLevel: 'medium',
    summary: 'London AI startups and financial conglomerates offer expedited Global Talent Visas to senior architects affected by US labor certification halts, establishing direct hiring bridges to Bengaluru.',
    sourcePublisher: 'Tech London / FT',
    sectors: ['AI Research', 'Global Mobility'],
  },

  // ── 2. SEMICONDUCTORS & CHIPS PACT (Dholera, Sanand, Assam & Taiwan) ──
  {
    id: 'rel-chips-dholera',
    headline: 'Tata Electronics & Taiwan PSMC Finalize Cleanroom Equipment Procurements for ₹91,000 Cr Dholera Fab',
    sourceId: 'c-twn',
    targetId: 's-ind-gj',
    tag: 'DHOLERA 28NM FAB',
    category: 'CHIPS',
    impactLevel: 'high',
    summary: 'Commercial foundry agreement between Tata and Taiwan’s Powerchip Semiconductor Manufacturing Corp enters advanced machinery installation, targeting 50,000 wafer starts per month for automotive and power chips.',
    sourcePublisher: 'Semiconductor Today',
    sectors: ['Foundry', '28nm Nodes', 'Automotive'],
  },
  {
    id: 'rel-chips-micron',
    headline: 'Micron Sanand ATMP Facility in Gujarat Deploys Advanced Wafer Packaging Systems from Texas Line',
    sourceId: 's-usa-tx',
    targetId: 's-ind-gj',
    tag: 'MICRON SANAND',
    category: 'CHIPS',
    impactLevel: 'high',
    summary: 'Advanced assembly, testing, and packaging (ATMP) fabrication equipment shipped from Austin arrives at Sanand, accelerating pilot runs of DRAM and NAND memory packages for global delivery.',
    sourcePublisher: 'Business Standard',
    sectors: ['Packaging', 'DRAM / NAND', 'Supply Chain'],
  },
  {
    id: 'rel-chips-assam',
    headline: 'Tokyo Electron Ships Ultra-Pure Cleanroom Machinery to Tata Semiconductor Mega-Unit in Morigaon, Assam',
    sourceId: 'c-jpn',
    targetId: 's-ind-as',
    tag: 'ASSAM OSAT',
    category: 'CHIPS',
    impactLevel: 'high',
    summary: 'Japanese precision tooling arrives in northeast India for the ₹27,000 Cr OSAT facility, cementing India’s eastern electronics manufacturing corridor alongside Taiwan and Japan.',
    sourcePublisher: 'Nikkei Asia',
    sectors: ['OSAT', 'Cleanrooms', 'Robotics'],
  },
  {
    id: 'rel-chips-eda',
    headline: 'Synopsys & Cadence Expand Advanced EDA Chip Design Centers Across Bengaluru & Noida Campuses',
    sourceId: 's-usa-ca',
    targetId: 's-ind-ka',
    tag: 'CHIP DESIGN EDA',
    category: 'CHIPS',
    impactLevel: 'medium',
    summary: 'US electronic design automation leaders add 2,500 semiconductor verification engineers in Whitefield to design next-generation 3nm and 2nm architecture tape-outs.',
    sourcePublisher: 'EE Times',
    sectors: ['EDA Software', '3nm Verification'],
  },
  {
    id: 'rel-chips-paris',
    headline: 'France-India Tech Coalition Inks Silicon Photonics & GaN Power Semiconductor Research Deal',
    sourceId: 'c-fra',
    targetId: 's-ind-tn',
    tag: 'PHOTONICS PACT',
    category: 'CHIPS',
    impactLevel: 'medium',
    summary: 'French CEA-Leti laboratory partners with IIT Madras and Tamil Nadu semiconductor park on Gallium Nitride (GaN) fast-charging modules for EV drivetrains and defense radar systems.',
    sourcePublisher: 'Le Figaro Tech',
    sectors: ['GaN', 'Defense Electronics'],
  },

  // ── 3. APPLE & HARDWARE MANUFACTURING CORRIDOR ──
  {
    id: 'rel-apple-tamilnadu',
    headline: 'Apple Manufactures 25% of Worldwide iPhone 16 Pro Units in Tamil Nadu (Foxconn & Pegatron Campuses)',
    sourceId: 's-usa-ca',
    targetId: 's-ind-tn',
    tag: 'IPHONE 16 PRO',
    category: 'TECH',
    impactLevel: 'high',
    summary: 'Simultaneous launch production out of Sriperumbudur delivers zero-day iPhone 16 Pro flagships to North America and Europe, supported by state electronics manufacturing export subsidies.',
    sourcePublisher: 'Bloomberg Technology',
    sectors: ['Consumer Hardware', 'Exports', 'Foxconn'],
  },
  {
    id: 'rel-apple-tata-hosur',
    headline: 'Tata Electronics Hosur Precision Enclosure Plant Ships 100% Titanium Casings for US Flagships',
    sourceId: 's-ind-tn',
    targetId: 's-usa-ca',
    tag: 'TITANIUM EXPORT',
    category: 'TECH',
    impactLevel: 'high',
    summary: 'The 500-acre Hosur manufacturing base in Tamil Nadu achieves 95% yield efficiency on aerospace-grade titanium chassis, supplying primary assembly pipelines in Cupertino and Zhengzhou.',
    sourcePublisher: 'Economic Times',
    sectors: ['Precision Metallurgy', 'Global Supply'],
  },
  {
    id: 'rel-google-pixel',
    headline: 'Google Pixel 9 Assembly Line Ramps in Tamil Nadu & Andhra Pradesh via Foxconn ICT Alliances',
    sourceId: 's-usa-ca',
    targetId: 's-ind-tn',
    tag: 'PIXEL ASSEMBLY',
    category: 'TECH',
    impactLevel: 'medium',
    summary: 'Alphabet diversifies smartphone assembly away from Southeast Asia, inaugurating local motherboard surface-mount assembly lines near Chennai.',
    sourcePublisher: 'Reuters Tech',
    sectors: ['Smartphones', 'Hardware SMT'],
  },

  // ── 4. AI HYPERSCALERS & SOVEREIGN COMPUTE CLUSTERS ──
  {
    id: 'rel-ai-nvidia-mumbai',
    headline: 'Nvidia & Reliance Deploy 16,000 Blackwell & H100 GPU Sovereign AI Supercomputer in Navi Mumbai',
    sourceId: 's-usa-ca',
    targetId: 's-ind-mh',
    tag: 'NVIDIA AI CLUSTER',
    category: 'TECH',
    impactLevel: 'high',
    summary: 'Massive sovereign AI datacenter operational in Maharashtra provides multi-gigawatt compute capacity for enterprise foundation model pre-training in Indian languages.',
    sourcePublisher: 'Financial Express',
    sectors: ['AI Supercompute', 'GPU Clusters', 'Telecom'],
  },
  {
    id: 'rel-ai-azure-hyd',
    headline: "Microsoft Finalizes South Asia's Largest Cloud Region with 100-Acre Campus Expansion in Hyderabad",
    sourceId: 's-usa-wa',
    targetId: 's-ind-ts',
    tag: 'AZURE HYPERSCALE',
    category: 'TECH',
    impactLevel: 'high',
    summary: 'Three hyperscale availability zones in Telangana enter active commissioning, bringing ultra-low latency generative AI inferencing services to Indian and MENA banks.',
    sourcePublisher: 'Mint',
    sectors: ['Cloud Datacenters', 'AI Inferencing'],
  },
  {
    id: 'rel-ai-aws-mumbai',
    headline: 'AWS Injects $12.7B Cloud Infrastructure Program into Maharashtra & Telangana Server Parks',
    sourceId: 's-usa-wa',
    targetId: 's-ind-mh',
    tag: 'AWS $12.7B CLOUD',
    category: 'TECH',
    impactLevel: 'high',
    summary: 'Amazon Web Services confirms dedicated direct-to-grid renewable power contracts to support exponential enterprise migration to serverless bedrock AI workloads.',
    sourcePublisher: 'TechCrunch',
    sectors: ['Hyperscale Cloud', 'Clean Power'],
  },
  {
    id: 'rel-ai-yotta-gift',
    headline: 'Yotta Deploys 8,192 GPU Sovereign Compute Cluster for GIFT City Financial Modeling & AI Startups',
    sourceId: 's-ind-mh',
    targetId: 's-ind-gj',
    tag: 'SOVEREIGN COMPUTE',
    category: 'TECH',
    impactLevel: 'medium',
    summary: 'High-density Tier-IV datacenter connects IFSC trading desks and deep-tech incubators with local GPU capacity exempt from cross-border data latency.',
    sourcePublisher: 'Indian Express',
    sectors: ['Financial AI', 'GIFT City Tier-IV'],
  },

  // ── 5. CAPITAL MARKETS, FII INFLOWS & GIFT CITY IFSC ──
  {
    id: 'rel-fii-mumbai',
    headline: 'US Federal Reserve Rate Hold Sparks $4.8B Foreign Institutional Net Inflow into BSE & NSE',
    sourceId: 's-usa-ny',
    targetId: 's-ind-mh',
    tag: 'FII $4.8B INFLOW',
    category: 'MACRO',
    impactLevel: 'high',
    summary: 'Widening real yield differentials prompt Wall Street index funds to reweight emerging market allocations heavily toward Nifty banking and manufacturing heavyweights in Mumbai.',
    sourcePublisher: 'Bloomberg Markets',
    sectors: ['Equities', 'Nifty 50', 'FII Desks'],
  },
  {
    id: 'rel-gift-ifsc-prime',
    headline: 'Wall Street Prime Brokers Open Direct Offshore Clearing Desks in Gujarat GIFT City with 0% Capital Gains',
    sourceId: 's-usa-ny',
    targetId: 's-ind-gj',
    tag: 'GIFT CITY IFSC',
    category: 'MACRO',
    impactLevel: 'high',
    summary: 'USD-denominated Nifty and Indian sovereign bond contracts hit record daily turnover following cross-border regulatory approvals for US broker-dealers.',
    sourcePublisher: 'Reuters Financial',
    sectors: ['Offshore Clearing', 'Derivatives', 'IFSC'],
  },
  {
    id: 'rel-gic-bengaluru',
    headline: 'Singapore Sovereign Wealth GIC Allocates $2.2B into Indian Commercial Real Estate & Data Centers',
    sourceId: 'c-sgp',
    targetId: 's-ind-ka',
    tag: 'GIC REAL ESTATE',
    category: 'MACRO',
    impactLevel: 'medium',
    summary: 'Institutional equity backing Grade-A tech parks along Bengaluru’s Outer Ring Road signals institutional resilience against global commercial property contraction.',
    sourcePublisher: 'Straits Times',
    sectors: ['Institutional REITs', 'Tech Parks'],
  },
  {
    id: 'rel-tokyo-derivatives',
    headline: 'Tokyo Financial Exchange Lists INR/JPY Currency Futures Linked to Mumbai Clearing Corporation',
    sourceId: 'c-jpn',
    targetId: 's-ind-mh',
    tag: 'INR/JPY FUTURES',
    category: 'MACRO',
    impactLevel: 'medium',
    summary: 'Bilateral currency swap clearing protects Japanese automotive and electronics supply investments in India against foreign exchange volatility.',
    sourcePublisher: 'Japan Economic Wire',
    sectors: ['Currency Hedging', 'Bilateral Trade'],
  },

  // ── 6. CROSS-BORDER FINTECH & UPI RAILS ──
  {
    id: 'rel-upi-singapore',
    headline: 'NPCI International UPI-PayNow Linkage Crosses $1B Monthly Real-Time Remittance Run-Rate',
    sourceId: 's-ind-mh',
    targetId: 'c-sgp',
    tag: 'UPI-PAYNOW $1B',
    category: 'MACRO',
    impactLevel: 'high',
    summary: 'Direct merchant and peer-to-peer settlement rails reduce remittance transaction costs from 4.2% down to near-zero, proving instant cross-border retail payments.',
    sourcePublisher: 'FinTech Asia',
    sectors: ['Digital Payments', 'NPCI', 'Remittances'],
  },
  {
    id: 'rel-uae-dirham-rupee',
    headline: 'UAE Central Bank & RBI Operationalize Local Currency Settlement Rail (Dirham-Rupee Trade)',
    sourceId: 'c-uae',
    targetId: 's-ind-mh',
    tag: 'AED-INR RAILS',
    category: 'TRADE',
    impactLevel: 'high',
    summary: 'Direct interbank settlement bypasses USD intermediation for crude oil, gold bullion, and electronics trade between Dubai and Mumbai commercial ports.',
    sourcePublisher: 'Gulf News',
    sectors: ['Bilateral Currency', 'Oil Trade'],
  },
  {
    id: 'rel-upi-france',
    headline: 'France Lyra Network Expands UPI Terminals Across Paris Tourism Landmarks & Luxury Department Stores',
    sourceId: 'c-fra',
    targetId: 's-ind-mh',
    tag: 'UPI IN EUROPE',
    category: 'MACRO',
    impactLevel: 'medium',
    summary: 'Indian QR-code scanning now functional at the Eiffel Tower, Galeries Lafayette, and Charles de Gaulle airport terminals via French clearing gateways.',
    sourcePublisher: 'Les Echos',
    sectors: ['Tourism Payments', 'Cross-Border POS'],
  },

  // ── 7. AEROSPACE, DEFENSE & SPACE EXPLORATION ──
  {
    id: 'rel-defense-ge414',
    headline: 'US Congress Approves 80% Technology Transfer for GE F414 Jet Engine Co-Production with HAL Bengaluru',
    sourceId: 'c-usa',
    targetId: 's-ind-ka',
    tag: 'GE F414 JET ENGINE',
    category: 'TRADE',
    impactLevel: 'high',
    summary: 'Historic critical military propulsion technology sharing authorized for the Tejas Mk2 fighter fleet, establishing specialized aerospace metallurgy fabrication in Karnataka.',
    sourcePublisher: 'Defense News',
    sectors: ['Jet Engines', 'HAL', 'Tejas Mk2'],
  },
  {
    id: 'rel-airbus-vadodara',
    headline: 'Airbus & Tata Open C-295 Military Transport Aircraft Final Assembly Line in Vadodara, Gujarat',
    sourceId: 'c-fra',
    targetId: 's-ind-gj',
    tag: 'AIRBUS C-295 FAL',
    category: 'TRADE',
    impactLevel: 'high',
    summary: 'First private sector military aircraft assembly line in India inaugurated to deliver 40 tactical transport planes, creating 15,000 advanced aerospace manufacturing jobs.',
    sourcePublisher: 'Aviation Week',
    sectors: ['Aerospace FAL', 'Defense Transport'],
  },
  {
    id: 'rel-spacex-isro',
    headline: 'ISRO Telecom Satellite GSAT-N2 Successfully Orbit-Tested Following SpaceX Falcon 9 Florida Launch',
    sourceId: 's-usa-tx',
    targetId: 's-ind-ka',
    tag: 'ISRO-SPACEX LAUNCH',
    category: 'TECH',
    impactLevel: 'medium',
    summary: 'Commercial heavy-payload collaboration delivers high-throughput broadband capacity for in-flight Wi-Fi across the Indian subcontinent, monitored by ISRO telemetry centers.',
    sourcePublisher: 'SpaceNews',
    sectors: ['Satellite Comms', 'SpaceX Launch'],
  },

  // ── 8. ENERGY, LNG & GREEN TRANSITION ──
  {
    id: 'rel-lng-texas-gujarat',
    headline: 'US Gulf Coast LNG Consortium Inks 15-Year Supply Agreement for Dahej LNG Terminal in Gujarat',
    sourceId: 's-usa-tx',
    targetId: 's-ind-gj',
    tag: 'LNG SUPPLY PACT',
    category: 'ENERGY',
    impactLevel: 'medium',
    summary: 'Energy security pact guarantees 2.4 million metric tonnes of annual LNG deliveries into western industrial belts, substituting coal with cleaner gas combustion.',
    sourcePublisher: 'Platts Energy',
    sectors: ['LNG Terminals', 'Industrial Gas'],
  },
  {
    id: 'rel-adnoc-mumbai',
    headline: 'Abu Dhabi ADNOC & Indian Oil Finalize 1.2 MMTPA Long-Term LNG Sales Agreement',
    sourceId: 'c-uae',
    targetId: 's-ind-mh',
    tag: 'ADNOC ENERGY DECK',
    category: 'ENERGY',
    impactLevel: 'medium',
    summary: 'Ruwais LNG facility output dedicated to Indian state refiners under comprehensive economic partnership terms, anchoring long-term western grid electricity generation.',
    sourcePublisher: 'Middle East MEES',
    sectors: ['Hydrocarbons', 'Energy Security'],
  },
  {
    id: 'rel-eu-cbam-greenh2',
    headline: 'EU CBAM Carbon Tax Prompts Indian Steel Corridors to Fast-Track Green Hydrogen Projects in Gujarat',
    sourceId: 'c-deu',
    targetId: 's-ind-gj',
    tag: 'EU CBAM GREEN H2',
    category: 'ENERGY',
    impactLevel: 'medium',
    summary: 'Anticipated European border carbon adjustments spur major solar-to-hydrogen electrolyzer installations in Kutch to preserve zero-tariff exports to German automotive plants.',
    sourcePublisher: 'Reuters Sustainability',
    sectors: ['Green Hydrogen', 'Carbon Border Tax'],
  },

  // ── 9. PHARMA & US FDA APPROVALS ──
  {
    id: 'rel-fda-hyderabad',
    headline: 'US FDA Issues Clean 483 Audits for 14 Sterile Injectable & Biosimilar Lines in Hyderabad Genome Valley',
    sourceId: 's-usa-ny',
    targetId: 's-ind-ts',
    tag: 'US FDA BIO AUDIT',
    category: 'TECH',
    impactLevel: 'medium',
    summary: 'Clearance of Indian pharmaceutical manufacturing sites eliminates supply constraints for critical oncology and weight-loss drugs across US hospital formularies.',
    sourcePublisher: 'BioPharma Dive',
    sectors: ['Biosimilars', 'US FDA Audits'],
  },

  // ── 10. INTER-STATE DOMESTIC HIGH-VELOCITY CORRIDORS ──
  {
    id: 'rel-dom-fintech-ai',
    headline: 'Mumbai Banking Syndicate & Bengaluru AI Core Deploy Unified Real-Time Credit Underwriting Rails',
    sourceId: 's-ind-mh',
    targetId: 's-ind-ka',
    tag: 'FINTECH-AI SYNC',
    category: 'TECH',
    impactLevel: 'medium',
    summary: 'Algorithmic lending volume surges 48% year-on-year as Maharashtra financial conglomerates integrate Karnataka-developed open generative models for micro-enterprise credit.',
    sourcePublisher: 'Mint FinTech',
    sectors: ['Algorithmic Lending', 'Credit Rails'],
  },
  {
    id: 'rel-dom-pli-delhi-tn',
    headline: 'Delhi Electronics Ministry Fast-Tracks ₹22,000 Cr Component PLI for Tamil Nadu Hardware Mega-Parks',
    sourceId: 's-ind-dl',
    targetId: 's-ind-tn',
    tag: 'PLI SUBSIDY',
    category: 'TRADE',
    impactLevel: 'high',
    summary: 'Customs rationalization on surface-mount assembly machinery accelerates domestic production of high-density interconnect circuit boards for global export.',
    sourcePublisher: 'PIB New Delhi',
    sectors: ['PLI Schemes', 'Electronics Subsidies'],
  },
  {
    id: 'rel-dom-bio-ai-hyd-ka',
    headline: 'Hyderabad Bio-Valley Partners with Bengaluru DeepTech Labs for AI Molecular Synthesis Engine',
    sourceId: 's-ind-ts',
    targetId: 's-ind-ka',
    tag: 'BIO-AI CORRIDOR',
    category: 'TECH',
    impactLevel: 'low',
    summary: 'Shared GPU supercomputing clusters accelerate clinical trial simulation and generative protein folding research for cross-state biotechnology consortia.',
    sourcePublisher: 'Biospectrum India',
    sectors: ['Drug Discovery', 'Compute Clusters'],
  },
  {
    id: 'rel-dom-ifsc-mumbai-gj',
    headline: 'GIFT City IFSC Offshore Banking Units Route Liquidity Directly to Mumbai BSE Trading Desks',
    sourceId: 's-ind-gj',
    targetId: 's-ind-mh',
    tag: 'IFSC LIQUIDITY',
    category: 'MACRO',
    impactLevel: 'medium',
    summary: 'Zero-friction cross-border clearing enables multinational treasuries in Gujarat to supply instantaneous liquidity to domestic derivative market makers.',
    sourcePublisher: 'BSE Notices',
    sectors: ['Capital Clearing', 'Market Making'],
  },
  {
    id: 'rel-dom-hardware-tn-up',
    headline: 'Hosur Precision Titanium Unit Ships Sub-Assemblies to Noida Smartphone Assembly Mega-Parks',
    sourceId: 's-ind-tn',
    targetId: 's-ind-up',
    tag: 'SUPPLY LOGISTICS',
    category: 'TECH',
    impactLevel: 'low',
    summary: 'Dedicated freight corridor express services connect southern metallurgical precision stamping plants with northern automated surface-mount assembly units.',
    sourcePublisher: 'Logistics Pulse',
    sectors: ['Inter-State Freight', 'Hardware Assembly'],
  },
];

// Light Theme High-Contrast Color System
const LIGHT_IMPACT_COLORS: Record<string, { stroke: string; glow: string; badgeBg: string; badgeText: string; badgeBorder: string }> = {
  high: { stroke: '#E11D48', glow: 'rgba(225, 29, 72, 0.28)', badgeBg: 'bg-rose-50', badgeText: 'text-rose-700', badgeBorder: 'border-rose-200' },
  medium: { stroke: '#0284C7', glow: 'rgba(2, 132, 199, 0.28)', badgeBg: 'bg-sky-50', badgeText: 'text-sky-700', badgeBorder: 'border-sky-200' },
  low: { stroke: '#059669', glow: 'rgba(5, 150, 105, 0.28)', badgeBg: 'bg-emerald-50', badgeText: 'text-emerald-700', badgeBorder: 'border-emerald-200' },
};

export const GlobalNewsRelationMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(2.4);
  const [activeFocus, setActiveFocus] = useState<'GLOBAL' | 'IND' | 'USA'>('GLOBAL');
  const [selectedRelation, setSelectedRelation] = useState<NewsRelation | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isWireDrawerOpen, setIsWireDrawerOpen] = useState<boolean>(true);
  const [screenCoords, setScreenCoords] = useState<Map<string, { x: number; y: number; visible: boolean }>>(new Map());

  // ── Project Geo Coordinates to Screen Pixels via Mappls ───────
  const updateProjectedPositions = useCallback((map: any) => {
    if (!map) return;
    const nextCoords = new Map<string, { x: number; y: number; visible: boolean }>();
    const bounds = map.getBounds();

    for (const node of GEO_NODES) {
      try {
        const point = map.project([node.lng, node.lat]);
        if (point) {
          const isInside =
            bounds &&
            node.lng >= bounds.getWest() - 40 &&
            node.lng <= bounds.getEast() + 40 &&
            node.lat >= bounds.getSouth() - 30 &&
            node.lat <= bounds.getNorth() + 30;

          nextCoords.set(node.id, {
            x: point.x,
            y: point.y,
            visible: isInside,
          });
        }
      } catch {
        // projection handling
      }
    }

    setScreenCoords(new Map(nextCoords));
  }, []);

  // ── Initialize Official Mappls Map ───────────────────────────
  useEffect(() => {
    let map: any = null;

    const initMap = () => {
      if (!window.mappls || !mapContainerRef.current) return;

      try {
        const uniqueId = 'mappls-canvas-' + Math.random().toString(36).substring(2, 9);
        mapContainerRef.current.id = uniqueId;

        map = new window.mappls.Map(uniqueId, {
          center: [22.0, 50.0], // [lat, lng]
          zoom: 2.2,
          minZoom: 1.5,
          maxZoom: 14,
          zoomControl: false,
          search: false,
          location: false,
        });

        const handleSync = () => {
          setMapLoaded(true);
          setZoomLevel(map.getZoom());
          updateProjectedPositions(map);
        };

        map.on('load', handleSync);
        map.on('render', handleSync);
        map.on('move', handleSync);
        map.on('zoom', handleSync);
        map.on('resize', handleSync);

        mapInstanceRef.current = map;
      } catch (err) {
        console.error('Mappls map initialization error:', err);
      }
    };

    if (window.mappls) {
      initMap();
    } else {
      const interval = setInterval(() => {
        if (window.mappls) {
          clearInterval(interval);
          initMap();
        }
      }, 150);
      return () => clearInterval(interval);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove?.();
        } catch {
          // cleanup
        }
      }
    };
  }, [updateProjectedPositions]);

  // ── Camera Flight Controls ────────────────────────────────────
  const flyToTarget = (target: 'GLOBAL' | 'IND' | 'USA') => {
    setActiveFocus(target);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (target === 'GLOBAL') {
      map.flyTo({
        center: [50.0, 22.0],
        zoom: 2.2,
        essential: true,
        duration: 1600,
      });
    } else if (target === 'IND') {
      map.flyTo({
        center: [79.2, 20.0],
        zoom: 4.4,
        essential: true,
        duration: 1800,
      });
    } else if (target === 'USA') {
      map.flyTo({
        center: [-98.5795, 39.8283],
        zoom: 4.4,
        essential: true,
        duration: 1800,
      });
    }
  };

  const flyToRelation = (rel: NewsRelation) => {
    setSelectedRelation(rel);
    const map = mapInstanceRef.current;
    if (!map) return;

    const source = GEO_NODES.find((n) => n.id === rel.sourceId);
    const target = GEO_NODES.find((n) => n.id === rel.targetId);
    if (!source || !target) return;

    // Center between source and target
    const midLng = (source.lng + target.lng) / 2;
    const midLat = (source.lat + target.lat) / 2;
    const dist = Math.hypot(source.lng - target.lng, source.lat - target.lat);

    const targetZoom = dist > 80 ? 2.5 : dist > 25 ? 3.8 : 5.0;

    map.flyTo({
      center: [midLng, midLat],
      zoom: targetZoom,
      essential: true,
      duration: 1500,
    });
  };

  const handleZoomIn = () => {
    const map = mapInstanceRef.current;
    if (map) map.zoomIn({ duration: 350 });
  };

  const handleZoomOut = () => {
    const map = mapInstanceRef.current;
    if (map) map.zoomOut({ duration: 350 });
  };

  // ── Filter Nodes & News Relations ────────────────────────────
  const filteredRelations = useMemo(() => {
    return NEWS_RELATIONS.filter((rel) => {
      // Category filter
      if (selectedCategory !== 'ALL' && rel.category !== selectedCategory) {
        return false;
      }
      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesHeadline = rel.headline.toLowerCase().includes(q);
        const matchesTag = rel.tag.toLowerCase().includes(q);
        const matchesSummary = rel.summary.toLowerCase().includes(q);
        const matchesSectors = rel.sectors.some((s) => s.toLowerCase().includes(q));
        if (!matchesHeadline && !matchesTag && !matchesSummary && !matchesSectors) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // ── Calculate SVG Arc Curve ──────────────────────────────────
  const calculateArcPath = (sx: number, sy: number, tx: number, ty: number) => {
    const midX = (sx + tx) / 2;
    const dx = tx - sx;
    const dy = ty - sy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const archHeight = Math.max(35, dist * 0.20);
    const midY = Math.min(sy, ty) - archHeight;
    return `M ${sx} ${sy} Q ${midX} ${midY} ${tx} ${ty}`;
  };

  return (
    <div className="relative w-full h-[calc(100vh-105px)] min-h-[640px] bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm select-none font-sans">
      {/* 1. Mappls Native Vector Map Container (Clean Day Mode / Light Theme) */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 z-0 w-full h-full bg-[#f4f7f6]"
        style={{
          filter: 'saturate(0.95) contrast(1.02) brightness(1.01)',
        }}
      />

      {/* 2. Interactive SVG Arc Overlay on top of Mappls Canvas */}
      {mapLoaded && (
        <svg
          className="absolute inset-0 z-10 w-full h-full pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <style>{`
              @keyframes dash-flow {
                to { stroke-dashoffset: -32; }
              }
              .mappls-light-flow {
                animation: dash-flow 1.8s linear infinite;
              }
              @keyframes radar-pulse-light {
                0% { r: 6px; opacity: 0.7; }
                100% { r: 24px; opacity: 0; }
              }
              .radar-ring-light {
                animation: radar-pulse-light 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
              }
            `}</style>
            <filter id="arcGlowLight" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Flowing News Relation Arcs */}
          <g>
            {filteredRelations.map((rel) => {
              const sp = screenCoords.get(rel.sourceId);
              const tp = screenCoords.get(rel.targetId);
              if (!sp || !tp) return null;
              // Render if at least one node is in or near the canvas
              if (!sp.visible && !tp.visible) return null;

              const pathData = calculateArcPath(sp.x, sp.y, tp.x, tp.y);
              const theme = LIGHT_IMPACT_COLORS[rel.impactLevel];
              const isSelected = selectedRelation?.id === rel.id;
              const hasSelection = selectedRelation !== null;

              // Opacity management: prioritize selected arc
              const arcOpacity = isSelected ? 1 : hasSelection ? 0.38 : 0.85;

              // Compute mid-point of arc for the label pill
              const rawMidX = (sp.x + tp.x) / 2;
              const dist = Math.sqrt((tp.x - sp.x) ** 2 + (tp.y - sp.y) ** 2);
              const archHeight = Math.max(35, dist * 0.20);
              const midY = Math.min(sp.y, ty(tp.y)) - archHeight + 16;
              function ty(val: number) { return val; }

              // Keep tag label clamped on visible screen if one coordinate is off-screen
              const midX = Math.max(70, Math.min(window.innerWidth - 380, rawMidX));

              return (
                <g
                  key={rel.id}
                  className="pointer-events-auto cursor-pointer transition-opacity duration-300"
                  style={{ opacity: arcOpacity }}
                  onClick={() => setSelectedRelation(rel)}
                >
                  {/* Outer Glowing Halo */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={theme.stroke}
                    strokeWidth={isSelected ? 7 : 3}
                    strokeOpacity={isSelected ? 0.35 : 0.15}
                    strokeLinecap="round"
                    filter="url(#arcGlowLight)"
                  />

                  {/* Core Solid Line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={theme.stroke}
                    strokeWidth={isSelected ? 3.5 : 2}
                    strokeOpacity={isSelected ? 1 : 0.85}
                    strokeLinecap="round"
                  />

                  {/* Animated Dashed Particles Flowing Along Arc */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={1.8}
                    strokeDasharray="8 6"
                    strokeOpacity={0.9}
                    strokeLinecap="round"
                    className="mappls-light-flow"
                  />

                  {/* Intermediate News Badge Pill (Light Theme) */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x={-(rel.tag.length * 3.8 + 10)}
                      y="-10"
                      width={rel.tag.length * 7.6 + 20}
                      height="20"
                      rx="10"
                      fill="#FFFFFF"
                      stroke={isSelected ? theme.stroke : '#94A3B8'}
                      strokeWidth={isSelected ? '2' : '1.2'}
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
                    />
                    <text
                      x="0"
                      y="4"
                      fill="#0F172A"
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="middle"
                      fontFamily="monospace"
                      letterSpacing="0.5px"
                    >
                      {rel.tag}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* Render Active Geo Nodes */}
          <g>
            {GEO_NODES.map((node) => {
              const p = screenCoords.get(node.id);
              if (!p || !p.visible) return null;

              const isState = node.type === 'state';
              const dotColor = isState ? '#059669' : '#0284C7';
              const isConnectedToSelected =
                selectedRelation?.sourceId === node.id ||
                selectedRelation?.targetId === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${p.x}, ${p.y})`}
                  className="pointer-events-auto cursor-pointer"
                  onClick={() => {
                    const related = filteredRelations.find(
                      (r) => r.sourceId === node.id || r.targetId === node.id
                    );
                    if (related) setSelectedRelation(related);
                  }}
                >
                  {/* Radar Pulse Effect */}
                  <circle
                    cx="0"
                    cy="0"
                    fill="none"
                    stroke={dotColor}
                    strokeWidth="1.5"
                    className="radar-ring-light"
                  />
                  {/* Outer Concentric Ring */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isConnectedToSelected ? (isState ? 11 : 15) : isState ? 8 : 12}
                    fill="#FFFFFF"
                    stroke={isConnectedToSelected ? '#E11D48' : dotColor}
                    strokeWidth={isConnectedToSelected ? 3.5 : isState ? 2.2 : 2.8}
                    filter="drop-shadow(0 2px 5px rgba(0,0,0,0.18))"
                  />
                  {/* Core Dark Center Dot */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isState ? 3 : 4}
                    fill={isConnectedToSelected ? '#E11D48' : '#0F172A'}
                  />
                  {/* Node Name Label with Clean White Text Halo */}
                  <text
                    x="0"
                    y={isState ? 17 : 24}
                    fill="#0F172A"
                    fontSize={isState ? 9.5 : 11.5}
                    fontWeight={isConnectedToSelected ? '800' : '700'}
                    textAnchor="middle"
                    style={{
                      paintOrder: 'stroke',
                      stroke: '#FFFFFF',
                      strokeWidth: '4px',
                      strokeLinejoin: 'round',
                    }}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      )}

      {/* 3. Top Canvas Floating HUD Controls */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between">
          {/* Quick Country Focus Selector */}
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200/90 pointer-events-auto shadow-md">
            <button
              onClick={() => flyToTarget('GLOBAL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFocus === 'GLOBAL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Global View
            </button>
            <button
              onClick={() => flyToTarget('IND')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFocus === 'IND'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Focus India (States)
            </button>
            <button
              onClick={() => flyToTarget('USA')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFocus === 'USA'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Focus USA (States)
            </button>
          </div>

          {/* Filter Categories Pills */}
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 pointer-events-auto shadow-md overflow-x-auto max-w-full">
            {[
              { id: 'ALL', label: `All (${NEWS_RELATIONS.length})` },
              { id: 'IMMIGRATION', label: 'PERM & Talent (5)' },
              { id: 'CHIPS', label: 'Semiconductors (5)' },
              { id: 'TECH', label: 'AI & Cloud (8)' },
              { id: 'MACRO', label: 'FII & Macro (6)' },
              { id: 'TRADE', label: 'Trade & Defense (6)' },
              { id: 'ENERGY', label: 'Energy & LNG (3)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Zoom & LOD Status */}
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/90 pointer-events-auto shadow-md">
            <span className="text-[11px] font-mono font-medium text-slate-600">
              {zoomLevel >= 4.4 ? '🔬 STATE PRECISION' : '🌍 GLOBAL RADAR'} ({zoomLevel.toFixed(1)}x)
            </span>
            <div className="h-4 w-px bg-slate-200 mx-1" />
            <button
              onClick={handleZoomIn}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => flyToTarget('GLOBAL')}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Reset Map"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 🚨 BREAKING NEWS WIRE TICKER (Featuring The Hindu PERM Suspension Article) */}
        <div className="bg-white/95 backdrop-blur-md border border-rose-200/90 rounded-xl px-3.5 py-2 shadow-md flex items-center justify-between gap-3 pointer-events-auto">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              BREAKING INTEL
            </span>
            <p className="text-xs font-semibold text-slate-900 truncate">
              Trump administration suspends PERM program for Indian IT majors (TCS, Infosys, Wipro) • Senior talent shifts to Bengaluru & Hyderabad GCCs
            </p>
            <span className="text-[10px] text-slate-500 hidden lg:inline shrink-0 font-medium">
              [Source: The Hindu]
            </span>
          </div>

          <button
            onClick={() => {
              const permRel = NEWS_RELATIONS.find((r) => r.id === 'rel-perm-hindu');
              if (permRel) flyToRelation(permRel);
            }}
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1 rounded-lg shrink-0 transition"
          >
            <Compass className="w-3.5 h-3.5" />
            Inspect Corridor
          </button>
        </div>
      </div>

      {/* 4. Bottom Left: Official Mappls & Aatmanirbhar Bharat Branding */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/90 pointer-events-auto shadow-md">
        <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-900">
              Mappls MapMyIndia
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              Aatmanirbhar 🇮🇳
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Vector Tile Engine • 33 Active Live Corridors
          </span>
        </div>
      </div>

      {/* 5. Floating Interactive Corridors Wire Drawer (Right Side) */}
      <div className="absolute top-28 right-3 bottom-14 z-20 w-80 md:w-96 flex flex-col pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl flex flex-col overflow-hidden pointer-events-auto h-full">
          {/* Drawer Header */}
          <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-900">
                Transmission Wire
              </span>
              <span className="text-[10px] font-semibold bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded-full font-mono">
                {filteredRelations.length}
              </span>
            </div>
            <button
              onClick={() => setIsWireDrawerOpen(!isWireDrawerOpen)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition"
              title={isWireDrawerOpen ? 'Collapse Wire' : 'Expand Wire'}
            >
              {isWireDrawerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {isWireDrawerOpen && (
            <>
              {/* Search Box */}
              <div className="p-2 border-b border-slate-100 bg-white">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search PERM, Apple, Chips, TCS..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-2 text-[10px] text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Corridors List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2 divide-y divide-slate-50">
                {filteredRelations.map((rel) => {
                  const isSelected = selectedRelation?.id === rel.id;
                  const theme = LIGHT_IMPACT_COLORS[rel.impactLevel];

                  return (
                    <div
                      key={rel.id}
                      onClick={() => flyToRelation(rel)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                          : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
                        >
                          {rel.tag}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                          {rel.category}
                        </span>
                      </div>
                      <h5 className="text-[11.5px] font-bold text-slate-900 leading-snug line-clamp-2 mb-1.5">
                        {rel.headline}
                      </h5>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                        <span className="truncate max-w-[140px] font-medium text-slate-700">
                          {GEO_NODES.find((n) => n.id === rel.sourceId)?.name.split(' (')[0]} → {GEO_NODES.find((n) => n.id === rel.targetId)?.name.split(' (')[0]}
                        </span>
                        <span className="text-[9.5px] text-blue-600 font-semibold hover:underline">
                          Inspect →
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredRelations.length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    No corridors match your search criteria.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 6. Selected News Story Detail Card (Bottom Center / Left) */}
      <AnimatePresence>
        {selectedRelation && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 md:right-auto md:w-[540px] md:left-4 z-30 bg-white/98 backdrop-blur-xl border border-slate-200/90 p-4 rounded-2xl shadow-2xl pointer-events-auto"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    LIGHT_IMPACT_COLORS[selectedRelation.impactLevel].badgeBg
                  } ${LIGHT_IMPACT_COLORS[selectedRelation.impactLevel].badgeText} ${
                    LIGHT_IMPACT_COLORS[selectedRelation.impactLevel].badgeBorder
                  }`}
                >
                  {selectedRelation.tag} • {selectedRelation.category} • {selectedRelation.impactLevel.toUpperCase()} IMPACT
                </span>
                {selectedRelation.sourcePublisher && (
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                    {selectedRelation.sourcePublisher}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedRelation(null)}
                className="text-xs text-slate-400 hover:text-slate-700 px-2 py-0.5 rounded hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            <h4 className="text-sm font-bold text-slate-900 leading-snug mb-2">
              {selectedRelation.headline}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {selectedRelation.summary}
            </p>

            {/* Affected Sectors Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {selectedRelation.sectors.map((s, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                >
                  #{s}
                </span>
              ))}
            </div>

            {/* Entity Flow & External Link */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                <span className="text-sky-700 font-bold">
                  {GEO_NODES.find((n) => n.id === selectedRelation.sourceId)?.name}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-emerald-700 font-bold">
                  {GEO_NODES.find((n) => n.id === selectedRelation.targetId)?.name}
                </span>
              </div>

              {selectedRelation.sourceUrl && (
                <a
                  href={selectedRelation.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition"
                >
                  Read Article <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
