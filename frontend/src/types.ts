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
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export interface StockHistory {
  ticker: string;
  current_price: number;
  change_pct: number;
  prices: StockPricePoint[];
  data_source: string;
  open?: number;
  high_24h?: number;
  low_24h?: number;
  volume?: number;
  high_ever?: number;
  low_ever?: number;
  avg_price?: number;
  deal_score?: number;
  deal_rating?: string;
  api_connected?: boolean;
}

export interface ReferenceLink {
  title: string;
  url: string;
  publisher: string;
  date?: string;
}

// FinGraph / Fin.D Institutional Radial Schemas
export interface RadialCardNode {
  id: string;
  title: string;
  metric: string;
  metricColor: "red" | "green" | "blue" | "slate";
  subtitle: string;
  badge: string;
  badgeType: "red" | "green" | "blue" | "amber";
  category: "commodity" | "economic_variable" | "sector" | "company";
  icon: "oil" | "chart" | "ship" | "currency" | "plane" | "factory" | "chip" | "bank" | "wheat";
  position: "center" | "top" | "left" | "right" | "bottom-left" | "bottom-right" | "custom";
  timeHorizon?: string;
  lineType?: "positive" | "negative" | "indirect";
  tickers?: string[];
  // Priority based node importance
  priority?: "P1 Critical" | "P2 High" | "P3 Moderate";
  priorityRank?: number;
  impactScore?: number; // 0 to 100
  // Causal rationale: WHY event is causing this
  causalReason?: string;
  // External reference links & citations
  refLinks?: ReferenceLink[];
  // Dynamic 2nd-order node extension
  isExtended?: boolean;
  extendedChildren?: RadialCardNode[];
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
  explanation: string;
  sector: string;
  evidenceGrade: "Well established" | "Moderate evidence" | "Emerging evidence";
  badgeGradeType: "green" | "yellow" | "blue";
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
}

export interface CollidingEvent {
  catalystA: {
    title: string;
    flag: string;
    source: string;
    summary: string;
  };
  catalystB: {
    title: string;
    flag: string;
    source: string;
    summary: string;
  };
  collisionPoint: string;
  collisionMechanism: string;
  causalFlow: string[];
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
  collidingEvent?: CollidingEvent;
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
  open?: number;
  high_24h?: number;
  low_24h?: number;
  volume?: number;
  high_ever?: number;
  low_ever?: number;
  avg_price?: number;
  deal_score?: number;
  deal_rating?: string;
  data_source?: string;
  api_connected?: boolean;
  prices?: StockPricePoint[];
  supply_chain: StockSupplyChain;
  news: StockNewsItem[];
}
