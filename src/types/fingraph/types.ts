export type NodeType = "Company" | "Sector" | "Commodity" | "Indicator" | "Event" | "Country";

export interface GraphNode {
  id: string;
  name: string;
  type: NodeType;
  group: string;
  val: number;
  risk_score: number;
  sentiment?: number;
  ticker?: string;
  sector?: string;
  market_cap?: string;
  country?: string;
  details?: string;
  // Simulation coordinate props added dynamically
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: string;
  weight: number;
  confidence: number;
  explanation: string;
  sentiment: number;
  is_active_shock?: boolean;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  total_nodes: number;
  total_links: number;
  metadata?: Record<string, any>;
}

export interface PropagationStep {
  source_id: string;
  source_name: string;
  target_id: string;
  target_name: string;
  impact: number;
  sentiment: number;
  confidence: number;
  relation: string;
  explanation: string;
  hop: number;
}

export interface Scenario {
  id: string;
  title: string;
  category: string;
  headline: string;
  primary_trigger: string;
  severity: number;
  sentiment: string;
  badge: string;
  description: string;
  expected_cascade: string[];
}

export interface SimulationResponse {
  event_id: string;
  headline: string;
  event_type: string;
  severity: number;
  sentiment: string;
  summary: string;
  affected_nodes: Record<string, number>;
  propagation_paths: PropagationStep[];
  graph: GraphData;
  timestamp: string;
}

export interface StockPricePoint {
  date: string;
  close: number;
}

export interface StockHistory {
  ticker: string;
  current_price: number;
  change_pct: number;
  prices: StockPricePoint[];
  data_source: string;
}

export interface ReferenceLink {
  title: string;
  url: string;
  publisher: string;
  date?: string;
}

// FinGraph / Fin.D Institutional Radial Schemas
export type EntityCategory =
  | "commodity" // 🚢 Physical Chokepoints / Commodities (Amber)
  | "geopolitical" // 🏛️ Regulatory / Geopolitical Sanctions (Red)
  | "economic_variable" // 📊 Macro Indicators & FX (Cyan)
  | "supply_chain" // 🏭 Critical Supply Chain Nodes (Violet)
  | "financial_asset" // 🏦 Credit, Sovereign Bonds & Liquid Assets (Emerald)
  | "sector"
  | "company";

export interface RadialCardNode {
  id: string;
  title: string;
  metric: string;
  metricColor: "red" | "green" | "blue" | "slate" | "amber" | "cyan" | "emerald" | "purple";
  subtitle: string;
  badge: string;
  badgeType: "red" | "green" | "blue" | "amber" | "cyan" | "emerald" | "purple";
  category: EntityCategory;
  icon: "oil" | "chart" | "ship" | "currency" | "plane" | "factory" | "chip" | "bank" | "wheat" | "building" | "shield" | "dock";
  position: "center" | "top" | "left" | "right" | "bottom-left" | "bottom-right" | "custom";
  timeHorizon?: string; // e.g. "T+0", "T+15", "T+45", "T+90"
  minTimeDays?: number; // Days offset for time slider (0, 15, 45, 90)
  lineType?: "positive" | "negative" | "indirect";
  tickers?: string[];
  priority?: "P1 Critical" | "P2 High" | "P3 Moderate";
  priorityRank?: number;
  impactScore?: number; // 0 to 100
  systemicImportance?: "Chokepoint Hub" | "Systemic Bellwether" | "Peripheral Asset";
  causalReason?: string;
  refLinks?: ReferenceLink[];
  isExtended?: boolean;
  extendedChildren?: RadialCardNode[];
  // Empirical Evidence Drawer Fields
  factType?: "Verified Regulatory Filing / Fact" | "LLM Probabilistic Inference";
  empiricalConfidence?: number; // 0 - 100%
  primarySourceSnippet?: string;
  sourceFilingCitation?: string;
  sourceUrl?: string;
}

// Role-Based Access Control (RBAS / RBAC)
export type UserRole = "quant_analyst" | "portfolio_manager" | "risk_officer" | "institutional_trader";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  firm: string;
  desk: string;
  permissions: string[];
}

// Econometric Regression & Causal Hypothesis Calibration
export interface RegressionCalibration {
  catalyst: string;
  shockMagnitude: number; // e.g. 12
  whyThesis: string; // The explicit "WHY event is causing this"
  regressionModel: "ols_factor" | "var_impulse" | "bayesian_causal";
  regressionModelLabel: string;
  confidenceInterval: number; // e.g. 95
  rSquared: number; // e.g. 0.84
  betaFactor: number; // e.g. 1.42
  tStat: number; // e.g. 3.86
  pValue: number; // e.g. 0.001
}

export interface PathwayHop {
  hopNumber: number;
  source: string;
  target: string;
  impactType: "Increases" | "Decreases" | "Neutral";
  impactLabel: string;
  timeframe: string;
  timeHorizonDays?: number; // e.g. 0, 15, 45, 90
  explanation: string;
  sector: string;
  evidenceGrade: "Well established" | "Moderate evidence" | "Emerging evidence";
  badgeGradeType: "green" | "yellow" | "blue" | "red";
  factType?: "Verified Regulatory Filing / Fact" | "LLM Probabilistic Inference";
  confidenceScore?: number;
  sourceDocument?: string;
  sourceExcerpt?: string;
  sourceUrl?: string;
}

export interface EvidenceSource {
  id: string;
  title: string;
  source: string;
  date: string;
  url?: string;
  summary: string;
  relevanceScore: number;
  category: string;
  factType?: "Verified Regulatory Filing / Fact" | "LLM Probabilistic Inference";
  documentType?: "SEC 10-K" | "Central Bank Bulletin" | "Reuters Wire" | "EIA Monthly" | "Bloomberg Intelligence";
  confidenceScore?: number;
  directExcerpt?: string;
}

export interface FinGraphScenario {
  id: string;
  title: string;
  dropdownLabel: string;
  narrative: string;
  date: string;
  source: string;
  sourceUrl?: string;
  entitiesCount: number;
  pathwaysCount: number;
  evidenceCount: number;
  transmissionRisk: string;
  transmissionRiskDetail: string;
  evidenceStrength: "High" | "Moderate" | "Low";
  evidenceStrengthDetail: string;
  centerNode: RadialCardNode;
  radialNodes: RadialCardNode[];
  pathways: PathwayHop[];
  evidenceSources: EvidenceSource[];
}

export interface StockSearchResult {
  ticker: string;
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  exchange: string;
  country: string;
  currency: string;
  market_cap: string;
}

export interface StockNewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  link: string;
  summary: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
}

export interface StockSupplyChain {
  sector_index: string;
  upstream_inputs: Array<{
    title: string;
    metric: string;
    metricColor: "red" | "green" | "blue";
    category: string;
    badge: string;
    badgeType: "red" | "green" | "blue" | "amber";
    icon: string;
    horizon: string;
  }>;
  downstream_impacts: Array<{
    title: string;
    metric: string;
    metricColor: "red" | "green" | "blue";
    category: string;
    badge: string;
    badgeType: "red" | "green" | "blue" | "amber";
    icon: string;
    horizon: string;
  }>;
  competitors: Array<{
    title: string;
    metric: string;
    metricColor: "red" | "green" | "blue";
    category: string;
    badge: string;
    badgeType: "red" | "green" | "blue" | "amber";
    icon: string;
    horizon: string;
    ticker?: string;
  }>;
}

export interface StockProfileData {
  ticker: string;
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  exchange: string;
  currency: string;
  current_price: number;
  change_pct: number;
  market_cap: string;
  supply_chain: StockSupplyChain;
  news: StockNewsItem[];
}
