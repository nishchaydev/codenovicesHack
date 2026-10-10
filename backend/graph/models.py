from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field

NodeType = Literal["Company", "Sector", "Commodity", "Indicator", "Event", "Country"]
SentimentType = Literal["Bullish", "Bearish", "Neutral"]

class GraphNode(BaseModel):
    id: str
    name: str
    type: NodeType
    group: str
    val: float = Field(default=10.0, description="Node visualization size metric")
    risk_score: float = Field(default=0.0, description="Computed propagation shock score [0-100]")
    sentiment: Optional[int] = Field(default=0, description="-1 negative, 0 neutral, 1 positive impact")
    ticker: Optional[str] = None
    sector: Optional[str] = None
    market_cap: Optional[str] = None
    country: Optional[str] = None
    details: Optional[str] = None

class GraphLink(BaseModel):
    source: str
    target: str
    type: str
    weight: float = Field(default=0.7, ge=0.0, le=1.0)
    confidence: float = Field(default=0.85, ge=0.0, le=1.0)
    explanation: str
    sentiment: int = Field(default=-1, description="-1 negative impact, 0 neutral, 1 positive impact")
    is_active_shock: bool = False

class GraphData(BaseModel):
    nodes: List[GraphNode]
    links: List[GraphLink]
    total_nodes: int
    total_links: int
    metadata: Dict[str, Any] = {}

class PropagationStep(BaseModel):
    source_id: str
    source_name: str
    target_id: str
    target_name: str
    impact: float
    sentiment: int
    confidence: float
    relation: str
    explanation: str
    hop: int

class SimulationRequest(BaseModel):
    headline: str
    scenario_id: Optional[str] = None
    magnitude: Optional[float] = 100.0
    use_llm: Optional[bool] = True

class SimulationResponse(BaseModel):
    event_id: str
    headline: str
    event_type: str
    severity: int
    sentiment: SentimentType
    summary: str
    affected_nodes: Dict[str, float]
    propagation_paths: List[PropagationStep]
    graph: GraphData
    timestamp: str
