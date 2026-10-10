# Architecture — FinGraph

## System Overview

FinGraph is a pipeline that converts unstructured financial news into a visual, interactive impact graph. It combines four core subsystems:

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌──────────────┐
│  Ingestion   │────▶│  NLP Engine   │────▶│  Graph Engine  │────▶│  Frontend    │
│  (News/Data) │     │  (LLM + NER)  │     │  (NetworkX)    │     │  (Next.js)   │
└─────────────┘     └──────────────┘     └───────────────┘     └──────────────┘
```

---

## Component Responsibilities

### 1. Data Ingestion (`backend/data/`)

**Owner:** Dev 3

| Source | What It Provides | Library |
|--------|-----------------|---------|
| Google/Yahoo News RSS | Financial headlines + articles | `feedparser` or `requests` |
| yfinance | Stock prices, sector info, historical data | `yfinance` |
| FRED API | US macro indicators (CPI, GDP, rates) | `requests` |
| Seed data | Pre-built graph for demo fallback | `seed_graph.py` |

**Key rule:** All external data is fetched **once** and cached locally. During the demo, we serve from cache — never depend on live APIs.

### 2. NLP Engine (`backend/llm/`)

**Owner:** Dev 1

Calls OpenRouter API with structured JSON schema prompts. Single responsibility: take raw text in, produce structured extraction out.

**Input:** A news headline or article body (string)

**Output:**
```json
{
  "events": [...],
  "entities": [...],
  "relationships": [...]
}
```

**Flow:**
1. `prompts.py` — contains the system prompt + JSON schema
2. `extractor.py` — calls OpenRouter, parses response, validates schema
3. Response is cached in `diskcache` so identical articles don't cost money twice

**LLM choice:** Claude 3.5 Sonnet via OpenRouter (best at JSON compliance). Fallback: GPT-4o.

### 3. Graph Engine (`backend/graph/`)

**Owner:** Dev 3

Three files, three jobs:

| File | Responsibility |
|------|---------------|
| `builder.py` | Takes extracted entities/relationships → adds them to a NetworkX `DiGraph` |
| `propagation.py` | BFS Decay algorithm — injects a shock and traces cascading impact |
| `algorithms.py` | Wrappers around `nx.pagerank()`, `nx.shortest_path()`, `nx.community` |

**Graph export format:** The graph is exported as `{"nodes": [...], "links": [...]}` JSON — this is what the frontend consumes directly.

### 4. API Layer (`backend/main.py`)

**Owner:** Dev 1

FastAPI app that wires everything together. Stateless — the graph lives in memory (rebuilt on startup from seed data + cached extractions).

**Endpoints defined in** [API.md](API.md)

### 5. Frontend (`frontend/`)

**Owner:** Dev 2

Next.js 16 app with five core components:

| Component | What It Renders |
|-----------|----------------|
| `GraphView.tsx` | 3D force-directed graph (react-force-graph-3d) |
| `EventPanel.tsx` | Scenario selector + "What-If" text input + Simulate button |
| `ImpactChain.tsx` | Sidebar showing step-by-step propagation path with explanations |
| `NodeDetail.tsx` | Hover/click panel — entity info, sparkline chart, risk score |
| `ConfidenceLegend.tsx` | Visual guide for edge styles (thick/dashed/colored) |

**Data flow:** Frontend fetches `GET /api/graph` on load → renders graph. On "Simulate", it `POST /api/simulate` → receives new/updated nodes and links → animates the ripple.

---

## Data Flow Diagram

```
User clicks "Simulate: TSMC Factory Fire"
           │
           ▼
POST /api/simulate { headline: "TSMC factory fire..." }
           │
           ▼
extractor.py → OpenRouter API → Structured JSON
  {
    entities: [TSMC, Apple, NVIDIA, Foxconn],
    relationships: [
      {TSMC → Apple, weight: 0.9, "manufactures A-series chips"},
      {TSMC → NVIDIA, weight: 0.7, "fabricates GPU dies"}
    ]
  }
           │
           ▼
builder.py → Adds to NetworkX graph
           │
           ▼
propagation.py → BFS Decay from "TSMC_FIRE" event node
  TSMC: 100 → Apple: 90 → Best Buy: 36 → ...
           │
           ▼
Response JSON: { new_nodes, new_links, impact_scores, paths }
           │
           ▼
Frontend animates particles along affected edges
  Nodes glow red (negative) or green (positive)
  Sidebar shows step-by-step chain with explanations
```

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Graph DB | NetworkX (in-memory) over Neo4j | Zero setup time, built-in algorithms, JSON export |
| LLM provider | OpenRouter over direct API | Single key for multiple models, easy fallback |
| Frontend graph lib | react-force-graph-3d over D3/Cytoscape | Built-in 3D, particle animation, WebGL performance |
| Caching | diskcache over Redis | Zero infrastructure, file-based, survives restarts |
| Deployment | Vercel + Railway over Docker | Fastest path to live demo |
| Data strategy | Pre-compute + cache over real-time | Demo reliability > live data freshness |
