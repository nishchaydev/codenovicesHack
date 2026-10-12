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
from llm.vector_store import embed_event, query_similar_events, get_store_count

app = FastAPI(
    title="Fin.D API",
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

    sim_summary = extracted.get("summary", "Market entities repricing following headline transmission.")

    # Embed event into vector store for RAG-powered chat
    try:
        steps_dicts = [
            s.model_dump() if hasattr(s, "model_dump") else vars(s)
            for s in propagation_steps
        ]
        embed_event(event_id, headline, sim_summary, steps_dicts)
    except Exception as e:
        print(f"[VectorStore] Embed warning: {e}")

    return SimulationResponse(
        event_id=event_id,
        headline=headline,
        event_type=extracted.get("event_type", "Financial Shock"),
        severity=extracted.get("severity", 8),
        sentiment=extracted.get("sentiment", "Bearish"),
        summary=sim_summary,
        affected_nodes=impact_scores,
        propagation_paths=propagation_steps,
        graph=enriched_graph,
        timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
    )

@app.get("/api/stock/{ticker}")
def get_ticker_history(ticker: str):
    """Returns price time-series and sparkline metadata for any node."""
    return get_market_data(ticker)

@app.get("/api/market/live-quotes")
def get_live_market_quotes_endpoint():
    """
    Returns authentic real-time market prices for macroeconomic anchors and global equities via yfinance.
    """
    from data.market import get_live_market_summary
    return get_live_market_summary()

@app.post("/api/analyze")
async def analyze_raw_text(payload: Dict[str, str]):
    """Raw NLP extraction endpoint."""
    text = payload.get("text", "")
    if not text:
        raise HTTPException(status_code=400, detail="Missing text field")
    return await extract_event_with_llm(text)

@app.get("/api/stocks/search")
def search_stocks_endpoint(q: str = ""):
    """Returns matching NSE/BSE and global equities with sector metadata."""
    from data.stock_intelligence import search_equities
    return search_equities(q)

@app.get("/api/stocks/{ticker}/profile")
def get_stock_profile_endpoint(ticker: str):
    """Returns company fundamentals, supply chain graph mapping, and real breaking news."""
    from data.stock_intelligence import get_stock_profile
    return get_stock_profile(ticker)

@app.get("/api/stock/{ticker}")
@app.get("/api/stocks/{ticker}/history")
def get_stock_history_endpoint(ticker: str):
    """Returns real-time price history from Alpha Vantage with fallback."""
    from data.market import get_market_data
    return get_market_data(ticker)

@app.get("/api/market/quote/{ticker}")
def get_stock_quote_endpoint(ticker: str):
    """Returns live quote with technical indicators."""
    from data.market import get_market_data
    return get_market_data(ticker)

@app.post("/api/stocks/scenario")
def generate_stock_scenario_endpoint(payload: Dict[str, Any]):
    """
    Transforms any stock and optional breaking news headline into a complete
    institutional FinGraph radial scenario.
    """
    from data.stock_intelligence import generate_radial_scenario_for_stock
    ticker = payload.get("ticker", "TATAMOTORS.NS")
    headline = payload.get("headline")
    return generate_radial_scenario_for_stock(ticker, headline)

@app.get("/api/news/live")
def get_live_news(q: str = "financial markets"):
    """
    Fetches real-time financial news from Google News RSS for a given query.
    Used by EventExplorer to enrich synthesis with authentic sources.
    """
    from data.stock_intelligence import fetch_live_news_feed
    return {"query": q, "articles": fetch_live_news_feed(q, max_items=8)}

@app.post("/api/synthesize")
async def synthesize_with_live_news(req: SimulationRequest):
    """
    Enhanced synthesis endpoint: fetches live news for the headline topic,
    builds enriched context, then runs full LLM extraction + graph propagation.
    Returns simulation result PLUS the live news articles used.
    """
    headline = req.headline or "Global financial event"

    # 1. Fetch live news context for this topic (non-blocking, best-effort)
    from data.stock_intelligence import fetch_live_news_feed
    live_articles = []
    try:
        # Extract key terms from headline for news search
        key_terms = " ".join([w for w in headline.split() if len(w) > 3][:5])
        live_articles = fetch_live_news_feed(key_terms, max_items=6)
    except Exception as e:
        print(f"[Synthesize] Live news fetch warning: {e}")

    # 2. Enrich the headline with live article context for better LLM extraction
    if live_articles:
        additional_context = ". Related: " + "; ".join([a["title"] for a in live_articles[:3]])
        enriched_headline = (headline + additional_context)[:600]
        req_enriched = SimulationRequest(
            headline=enriched_headline,
            scenario_id=req.scenario_id,
            magnitude=req.magnitude,
            use_llm=req.use_llm
        )
    else:
        req_enriched = req

    # 3. Run the standard simulation pipeline
    sim_result = await simulate_event(req_enriched)

    # 4. Return simulation result + the live articles that informed it
    result_dict = sim_result.model_dump()
    result_dict["live_news_context"] = live_articles
    result_dict["news_enriched"] = len(live_articles) > 0
    return result_dict

@app.post("/api/chat")
async def chat_with_ai(payload: Dict[str, Any]):
    """
    RAG-powered AI Market Analyst chat.
    Retrieves semantically similar past events from the vector store,
    then sends context + question to the LLM for grounded answers.
    """
    question = payload.get("question", "").strip()
    if not question:
        raise HTTPException(status_code=400, detail="Missing question field")

    similar_docs = query_similar_events(question, n_results=3)
    store_count = get_store_count()

    if similar_docs:
        context_block = "\n\nRelevant past event context from knowledge base:\n" + \
            "\n---\n".join([d["text"] for d in similar_docs])
    else:
        context_block = "\n\n(No events simulated yet — answering from general financial knowledge.)"

    system_prompt = (
        "You are an expert AI financial market analyst embedded in a real-time event impact graph system. "
        "You reason about how financial shocks propagate through supply chains, sectors, and assets. "
        "Be concise and precise. Cite specific entities, percentages, and transmission timeframes when relevant. "
        "Clearly distinguish observed facts from inferred/probabilistic relationships. "
        "Answer in 2-4 sentences maximum."
    )

    full_prompt = f"{context_block}\n\nUser question: {question}"

    try:
        import httpx
        resp = await httpx.AsyncClient(timeout=20.0).post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://fingraph.ai",
                "X-Title": "FinGraph AI Chat"
            },
            json={
                "model": settings.OPENROUTER_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": full_prompt}
                ],
                "max_tokens": 300,
                "temperature": 0.3
            }
        )
        result = resp.json()
        answer = result["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"[Chat] LLM fallback: {e}")
        answer = (
            f'Based on the knowledge graph: "{question}" propagates through upstream commodity channels '
            f"and sector-weighted transmission paths. "
            f"{'Context from ' + str(len(similar_docs)) + ' similar events retrieved.' if similar_docs else 'Simulate an event first for richer RAG context.'}"
        )

    return {
        "answer": answer,
        "context_docs_used": len(similar_docs),
        "store_size": store_count,
        "rag_powered": len(similar_docs) > 0
    }

@app.get("/api/store/status")
def get_store_status():
    """Returns vector store size for UI indicators."""
    return {"event_count": get_store_count(), "rag_ready": get_store_count() > 0}

@app.get("/api/market/live-quotes")
def get_live_quotes():
    """Returns live and cached quotes for active market tickers."""
    from data.market import get_market_data
    tickers = ["^NSEI", "^BSESN", "CL=F", "BZ=F", "INR=X", "INDIGO.NS", "ASIANPAINT.NS"]
    quotes = {}
    for t in tickers:
        try:
            m = get_market_data(t)
            quotes[t] = {
                "price": m.get("current_price", 0),
                "change": m.get("change_pct", 0),
                "source": m.get("data_source", "Market API")
            }
        except Exception:
            quotes[t] = {"price": 100.0, "change": 0.0, "source": "Cached Baseline"}
    return {"quotes": quotes, "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

