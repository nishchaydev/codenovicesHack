export type EntityClassification =
  | 'Commodity'
  | 'Macro Indicator'
  | 'Sector'
  | 'Listed Company'
  | 'Regulatory Policy'
  | 'Geopolitical'

export type NodeType = 'backward_cause' | 'root_event' | 'forward_impact'

export type TruthStatus = 'observed_fact' | 'inferred_relationship'

export type ImpactDirection = 'positive' | 'negative' | 'neutral'

export interface EvidenceItem {
  sourceName: string
  headline: string
  url: string
  publishedAt?: string
}

export interface GraphNode {
  [key: string]: unknown
  id: string
  label: string
  description: string
  nodeType: NodeType
  entityType: EntityClassification
  truthStatus: TruthStatus
  confidenceScore: number // 0 to 100
  impactDirection: ImpactDirection
  estimatedMagnitude: string // e.g., "+4.5%", "-2.1%", "High Volatility"
  tickerSymbol?: string // e.g., "CL=F", "ASIANPAINT.NS", "INDA", "TCS.NS"
  transmissionLogic: string // concise explanation of why this connection exists
  evidence: EvidenceItem[]
  historicalPrecedent?: string // e.g., "Correlated with 2022 Energy Shock (r=0.78)"
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  label: string
  weight: number // strength of relationship: 0.1 to 1.0
  animated: boolean
}

export interface EventDataset {
  id: string
  title: string
  market: 'india' | 'us' | 'global'
  category: string
  summary: string
  rootNodeId: string
  nodes: GraphNode[]
  edges: GraphEdge[]
}
