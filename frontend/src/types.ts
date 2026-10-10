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

// FinGraph Institutional Radial Schemas
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
  position: "center" | "top" | "left" | "right" | "bottom-left" | "bottom-right";
  timeHorizon?: string;
  lineType?: "positive" | "negative" | "indirect";
  tickers?: string[];
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
