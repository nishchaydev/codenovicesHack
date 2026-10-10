import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List

from config import settings
from graph.models import (
    GraphData,
    SimulationRequest,
    SimulationResponse,
    GraphNode,
    GraphLink,
    PropagationStep
)
from data.seed_graph import build_seed_graph
from data.scenarios import PRELOADED_SCENARIOS
from data.market import get_market_data
from graph.propagation import propagate_shock, enrich_graph_with_scores
from llm.extractor import extract_event_with_llm

app = FastAPI(
    title="FinGraph API",
    description="Autonomous Financial Event Market Impact Graph Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory working graph instance
active_graph, active_graph_data = build_seed_graph()

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "nodes": len(active_graph.nodes),
        "edges": len(active_graph.edges),
        "version": "1.0.0",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

@app.get("/api/graph", response_model=GraphData)
def get_graph():
    """Returns the current full knowledge graph representation."""
    enriched = enrich_graph_with_scores(active_graph, {}, {}, [])
    return enriched

@app.get("/api/scenarios")
def get_scenarios():
    """Lists preloaded real-world historical shock scenarios."""
    return PRELOADED_SCENARIOS

@app.post("/api/reset", response_model=GraphData)
def reset_graph():
    """Resets graph back to clean baseline state."""
    global active_graph, active_graph_data
    active_graph, active_graph_data = build_seed_graph()
    return enrich_graph_with_scores(active_graph, {}, {}, [])

@app.post("/api/simulate", response_model=SimulationResponse)
async def simulate_event(req: SimulationRequest):
    """
    Main Simulation Engine:
    Takes an event headline, extracts financial entities & transmission channels,
    injects shock into the knowledge graph, and calculates multi-hop propagation.
    """
    global active_graph

    # 1. Check if matching a preloaded scenario
    matched_scenario = None
    if req.scenario_id:
        for s in PRELOADED_SCENARIOS:
            if s["id"] == req.scenario_id:
                matched_scenario = s
                break

    headline = req.headline or (matched_scenario["headline"] if matched_scenario else "Market event occurred")

    # 2. Extract event structure via LLM (or cache/heuristic fallback)
    extracted = await extract_event_with_llm(headline, use_llm=req.use_llm if req.use_llm is not None else True)

    primary_trigger = extracted.get("primary_trigger", "CL=F")
    if primary_trigger not in active_graph:
        # Fallback to nearest anchor if trigger is unrecognized
        primary_trigger = "CL=F" if "oil" in headline.lower() else "TSM" if "chip" in headline.lower() else "^TNX"

    event_id = f"EVT_{datetime.datetime.now().strftime('%M%S')}"
    event_name = headline[:36] + ("..." if len(headline) > 36 else "")

    # 3. Add dynamic event node to the graph
    active_graph.add_node(
        event_id,
        name=event_name,
        type="Event",
        group="Active Shock",
        val=30.0,
        risk_score=req.magnitude or 100.0,
        sentiment=-1 if extracted.get("sentiment") == "Bearish" else 1,
        details=extracted.get("summary", headline)
    )

    # 4. Connect event node to primary trigger
    active_graph.add_edge(
        event_id,
        primary_trigger,
        type="CATALYST_TRANSMISSION",
        weight=0.96,
        confidence=0.98,
        explanation=f"Breaking news directly impacts {primary_trigger} as ground-zero propagation anchor.",
        sentiment=-1 if extracted.get("sentiment") == "Bearish" else 1
    )

    # Add any auxiliary extracted links from LLM
    for link_data in extracted.get("new_links", []):
        src = link_data.get("source")
        tgt = link_data.get("target")
        if src in active_graph and tgt in active_graph:
            active_graph.add_edge(
                src,
                tgt,
                type=link_data.get("type", "AFFECTS"),
                weight=link_data.get("weight", 0.75),
                confidence=link_data.get("confidence", 0.85),
                explanation=link_data.get("explanation", "Extracted transmission link"),
                sentiment=link_data.get("sentiment", -1)
            )

    # 5. Execute Multi-Hop BFS Decay Shock Propagation
    impact_magnitude = req.magnitude or settings.INITIAL_SHOCK_MAGNITUDE
    initial_sent = -1 if extracted.get("sentiment") == "Bearish" else 1

    impact_scores, propagation_steps, node_sentiments = propagate_shock(
        active_graph,
        event_node_id=event_id,
        initial_shock=impact_magnitude,
        threshold=settings.DECAY_THRESHOLD,
        initial_sentiment=initial_sent
    )

    # 6. Re-enrich graph data with fresh shock scores
    enriched_graph = enrich_graph_with_scores(
        active_graph,
        impact_scores,
        node_sentiments,
        propagation_steps
    )

    return SimulationResponse(
        event_id=event_id,
        headline=headline,
        event_type=extracted.get("event_type", "Financial Shock"),
        severity=extracted.get("severity", 8),
        sentiment=extracted.get("sentiment", "Bearish"),
        summary=extracted.get("summary", "Market entities repricing following headline transmission."),
        affected_nodes=impact_scores,
        propagation_paths=propagation_steps,
        graph=enriched_graph,
        timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
    )

@app.get("/api/stock/{ticker}")
def get_ticker_history(ticker: str):
    """Returns price time-series and sparkline metadata for any node."""
    return get_market_data(ticker)

@app.post("/api/analyze")
async def analyze_raw_text(payload: Dict[str, str]):
    """Raw NLP extraction endpoint."""
    text = payload.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Missing text field")
    return await extract_event_with_llm(text)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
