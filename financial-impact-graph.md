# Financial Impact Graph — Implementation Plan

## Goal
Build an AI system that converts unstructured financial news into a dynamic dependency graph, showing how events propagate across sectors, companies, commodities, and instruments — with visual impact chains, confidence scoring, and LLM-generated explanations.

## Project Type
**WEB** — Full-stack (Python backend + Next.js frontend)

## Success Criteria
- [ ] User can see a pre-built financial knowledge graph with 15-20 nodes
- [ ] Clicking "Simulate" on a financial event triggers visual ripple animation through the graph
- [ ] Each edge has a confidence score and LLM-generated explanation
- [ ] "What-If" text input sends news to LLM → extracts entities/relationships → updates graph live
- [ ] At least 1 historical scenario validated with real market data (yfinance)

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Backend | Python 3.12 + FastAPI | Best for AI/ML, NetworkX, pandas |
| LLM | OpenRouter (Claude 3.5 Sonnet) | Key ready, structured JSON output |
| Graph Engine | NetworkX (in-memory → JSON) | Zero config, built-in algorithms |
| Frontend | Next.js 16 + TypeScript | Vercel deploy, react-force-graph |
| Visualization | react-force-graph-3d | 3D graph with particle animations |
| Market Data | yfinance | Free, no API keys |
| Cache | diskcache (Python) | Don't re-pay for LLM calls |
| Deploy | Vercel (FE) + Railway (BE) | Free tiers, fast setup |

## File Structure

```
codenovicesHack/
├── backend/
│   ├── main.py                  # FastAPI app + CORS + routes
│   ├── config.py                # API keys, settings
│   ├── llm/
│   │   ├── extractor.py         # LLM extraction via OpenRouter
│   │   └── prompts.py           # Prompt templates (JSON schema)
│   ├── graph/
│   │   ├── builder.py           # NetworkX graph construction
│   │   ├── propagation.py       # BFS Decay impact algorithm
│   │   └── algorithms.py        # PageRank, shortest path wrappers
│   ├── data/
│   │   ├── market.py            # yfinance data fetching
│   │   ├── seed_graph.py        # Pre-built semiconductor/energy graph
│   │   └── scenarios.json       # Pre-loaded demo scenarios
│   ├── cache/                   # diskcache directory (gitignored)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx         # Main dashboard page
│   │   │   └── globals.css      # Tailwind v4
│   │   ├── components/
│   │   │   ├── GraphView.tsx    # react-force-graph-3d wrapper
│   │   │   ├── EventPanel.tsx   # Simulate + What-If input
│   │   │   ├── ImpactChain.tsx  # Step-by-step propagation sidebar
│   │   │   ├── NodeDetail.tsx   # Company info + sparkline on hover
│   │   │   └── ConfidenceLegend.tsx # Edge styling legend
│   │   ├── lib/
│   │   │   ├── api.ts           # Backend API client
│   │   │   └── types.ts         # Graph node/edge TypeScript types
│   │   └── hooks/
│   │       └── useGraph.ts      # Graph state management hook
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
├── data/
│   └── scenarios/               # Pre-built JSON scenarios for demo
├── docs/research/               # Research docs (already created)
├── .env.example
├── .gitignore
└── README.md
```

## Tasks

### Phase 1: Backend Foundation
- [x] Task 1: Scaffold FastAPI app with CORS, health check, and config → Verify: `curl localhost:8000/health` returns 200
- [x] Task 2: Build LLM extractor (`llm/extractor.py` + `prompts.py`) — call OpenRouter with JSON schema, parse response → Verify: Pass a sample headline, get structured JSON back
- [x] Task 3: Build seed graph (`data/seed_graph.py`) — hardcode 15-20 nodes (semiconductors: TSMC, NVDA, AAPL, etc.) with weighted edges → Verify: Import and print `len(G.nodes), len(G.edges)`
- [x] Task 4: Build BFS Decay propagation (`graph/propagation.py`) → Verify: Inject shock at "TSMC" node, get impact scores for downstream nodes
- [x] Task 5: Build graph API endpoints (`GET /api/graph`, `POST /api/simulate`, `GET /api/stock/{ticker}`) → Verify: `curl localhost:8000/api/graph` returns valid JSON with nodes and links

### Phase 2: Frontend Foundation
- [x] Task 6: Scaffold modern React app with Tailwind CSS → Verify: `npm run dev` shows page at localhost:3000
- [x] Task 7: Build `InteractiveGraph.tsx` — render 60 FPS Canvas with fetched graph data, color nodes by type → Verify: See interactive graph with physics nodes in browser
- [x] Task 8: Build `ScenarioBar.tsx` — dropdown/chips of pre-loaded scenarios + "Simulate" button → Verify: Click button, see active cascade response
- [x] Task 9: Wire ripple animation — on simulate, emit particles along affected edges, color affected nodes red/green → Verify: Visual ripple propagates through graph

### Phase 3: Core Features
- [x] Task 10: Build edge/node click → show LLM explanation in `CascadeDrawer.tsx` sidebar → Verify: Click an edge, see explanation text
- [x] Task 11: Add confidence scoring visuals — thick/thin/dashed edges based on confidence → Verify: See different edge styles in graph
- [x] Task 12: Build "What-If" text input — send to `POST /api/simulate`, LLM extracts entities, graph updates dynamically → Verify: Type breaking news headline, see shockwave appear

### Phase 4: Data & Validation
- [x] Task 13: Add yfinance sparkline endpoint (`GET /api/stock/{ticker}`) + `NodeDetailPanel.tsx` tooltip → Verify: Hover/click node, see 14-day price chart
- [x] Task 14: Pre-build OPEC Crude Oil 12% benchmark scenario with real market cascade data → Verify: Select scenario, see graph + actual price movements

### Phase X: Verification
- [x] All API endpoints return valid JSON
- [x] Graph renders with 30+ nodes without lag (60 FPS Canvas simulation)
- [x] Simulate button triggers visible ripple animation and glowing shockwave
- [x] Edge explanations display correctly
- [x] "What-If" produces reasonable output with instant heuristic fallback
- [x] Build passes: `npm run build` (frontend), Python backend tests pass (30 nodes, 27 edges)
- [x] Demo flow runs end-to-end smoothly

## Notes
- **Pre-compute the demo graph** before the pitch — don't rely on live API calls
- **Cache all LLM responses** with diskcache to avoid redundant API costs
- **Fallback**: If OpenRouter is down, serve pre-cached `seed_data.json` directly
- OpenRouter API key: configured in `.env` (never committed)
- Research doc: `docs/research/financial-impact-graph-research.md`
