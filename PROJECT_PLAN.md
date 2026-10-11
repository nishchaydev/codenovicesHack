# FinGraph — Complete Project Build Plan
## Autonomous Financial Event Market Impact Graph

> **Status:** Implementation Phase
> **Team:** Code Novices
> **Hackathon:** Hackwave 3.0

---

## 1. PROJECT OVERVIEW (Hinglish Mein)

### Problem Kya Hai?
Jab crude oil ka price spike hota hai, toh sirf oil companies affect nahi hoti.
Flights mehngi hoti hain → Shipping mehnga hota hai → Store ki cheezon ke daam badhte hain → 
Central bank interest rates badhata hai → Home loans mehnge hote hain → Housing market crash.

**Yeh ek chain reaction hai.** Lekin koi bhi tool yeh chain visually nahi dikhata.

### Hum Kya Bana Rahe Hain?
**FinGraph** — ek AI-powered system jo financial news event leke ek **3D interactive graph** 
banata hai jisme dikhta hai:
- WHO affected hai (companies, sectors, commodities)
- HOW MUCH affected hai (confidence scores)
- WHY affected hai (AI explanations)
- HOW FAR impact phailta hai (1st, 2nd, 3rd order effects)

---

## 2. TECH STACK

| Layer              | Technology             | Kyu Use Kar Rahe Hain                |
|--------------------|------------------------|--------------------------------------|
| Backend Server     | Python 3.12 + FastAPI  | Best for AI/ML + graph computation   |
| LLM / AI Brain     | OpenRouter (Claude/GPT)| News se entities extract karne ke liye|
| Graph Engine       | NetworkX (in-memory)   | Zero setup, built-in algorithms      |
| Frontend Framework | Next.js 16 + TypeScript| Vercel pe deploy, fast dev            |
| 3D Visualization   | react-force-graph-3d   | 3D graph + particle animation        |
| Market Data        | yfinance (free)        | Real stock prices for validation     |
| Caching            | diskcache              | LLM calls cache, cost bachao         |
| Deploy             | Vercel (FE) + Railway  | Free tiers, fast setup               |

---

## 3. COMPLETE FILE STRUCTURE

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
│   │   └── algorithms.py        # PageRank, shortest path
│   ├── data/
│   │   ├── market.py            # yfinance data fetching
│   │   ├── seed_graph.py        # Pre-built demo graph (20 nodes)
│   │   └── scenarios.json       # Pre-loaded demo scenarios
│   ├── cache/                   # diskcache directory
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx         # Main dashboard page
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── GraphView.tsx    # react-force-graph-3d wrapper
│   │   │   ├── EventPanel.tsx   # Simulate + What-If input
│   │   │   ├── ImpactChain.tsx  # Step-by-step propagation sidebar
│   │   │   ├── NodeDetail.tsx   # Company info + sparkline on hover
│   │   │   └── ConfidenceLegend.tsx # Edge styling legend
│   │   ├── lib/
│   │   │   ├── api.ts           # Backend API client
│   │   │   └── types.ts         # GraphNode, GraphLink types
│   │   └── hooks/
│   │       └── useGraph.ts      # Graph state management hook
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
├── data/scenarios/              # Pre-built JSON scenarios
├── docs/                        # All documentation
├── .env.example
└── README.md
```

---

## 4. API ENDPOINTS

| Method | Endpoint             | Kya Karta Hai                                |
|--------|----------------------|----------------------------------------------|
| GET    | /health              | Server alive check (200 OK)                  |
| GET    | /api/graph           | Full knowledge graph return (nodes + links)  |
| POST   | /api/simulate        | News headline dalo → impact graph milega     |
| POST   | /api/analyze         | Raw NLP extraction → entities/relationships  |
| GET    | /api/stock/{ticker}  | Stock sparkline data (yfinance se)           |
| GET    | /api/sectors         | Sector-level heatmap data                    |

---

## 5. GRAPH SCHEMA

### Node Types (6 Types)
| Type       | Description          | Example            |
|------------|----------------------|--------------------|
| Company    | Listed company       | Apple (AAPL)       |
| Sector     | Industry/ETF         | Technology (XLK)   |
| Commodity  | Traded commodity     | Crude Oil (CL=F)   |
| Event      | Financial shock      | TSMC Factory Fire  |
| Indicator  | Economic metric      | 10Y Treasury       |
| Country    | Nation/region        | United States      |

### Edge Types (7 Types)
| Edge              | Direction          | Example                      |
|-------------------|--------------------|------------------------------|
| SUPPLIES_TO       | Company → Company  | TSMC → Apple                 |
| BELONGS_TO        | Company → Sector   | Apple → Technology           |
| PRODUCES          | Company → Commodity| Aramco → Crude Oil           |
| CONSUMES          | Company → Commodity| Delta → Jet Fuel             |
| AFFECTS           | Event → Any        | Rate Hike → Banks            |
| CORRELATED_WITH   | Any ↔ Any          | NVDA ↔ AMD                   |
| COMPETES_WITH     | Company ↔ Company  | AMD ↔ Intel                  |

### BFS Decay Propagation Algorithm
```
Initial: Event node gets impact = 100
Each hop: child_impact = parent_impact × edge_weight
Stop when: impact < 5
```

---

## 6. SEED GRAPH DATA (20 Nodes for Demo)

| ID       | Name            | Type       | Group           |
|----------|-----------------|------------|-----------------|
| TSM      | TSMC            | Company    | Semiconductors  |
| NVDA     | NVIDIA          | Company    | Semiconductors  |
| AMD      | AMD             | Company    | Semiconductors  |
| INTC     | Intel           | Company    | Semiconductors  |
| AAPL     | Apple           | Company    | Technology      |
| MSFT     | Microsoft       | Company    | Technology      |
| GOOGL    | Alphabet        | Company    | Technology      |
| AMZN     | Amazon          | Company    | Technology      |
| META     | Meta            | Company    | Technology      |
| AVGO     | Broadcom        | Company    | Semiconductors  |
| QCOM     | Qualcomm        | Company    | Semiconductors  |
| FOXCONN  | Foxconn         | Company    | Manufacturing   |
| CL=F     | Crude Oil       | Commodity  | Energy          |
| XLE      | Energy Sector   | Sector     | Energy          |
| XLK      | Tech Sector     | Sector     | Technology      |
| ^TNX     | 10Y Treasury    | Indicator  | Rates           |
| ^VIX     | VIX Volatility  | Indicator  | Volatility      |
| SPY      | S&P 500         | Sector     | Broad Market    |
| LMT      | Lockheed Martin | Company    | Defense         |
| DAL      | Delta Airlines  | Company    | Airlines        |

---

## 7. THREE DEMO SCENARIOS (Pre-Built)

| # | Scenario                | Event                          | Key Affected Nodes            |
|---|-------------------------|--------------------------------|-------------------------------|
| 1 | Semiconductor Shock     | "TSMC factory fire"            | TSM → AAPL → NVDA → AMD      |
| 2 | Oil Spike               | "Crude oil rises 12%"          | CL=F → XLE → DAL → SPY       |
| 3 | Russia-Ukraine Conflict | "Russia invades Ukraine"       | Oil, Gas, Wheat, LMT, XLE    |

---

## 8. FIVE FRONTEND COMPONENTS

| Component              | Kya Dikhayega                                     |
|------------------------|----------------------------------------------------|
| GraphView.tsx          | 3D force-directed graph with particles animations  |
| EventPanel.tsx         | Scenario selector + "What-If" text input + button  |
| ImpactChain.tsx        | Step-by-step propagation path sidebar              |
| NodeDetail.tsx         | Hover/click → entity info + sparkline price chart  |
| ConfidenceLegend.tsx   | Edge thickness/dash legend guide                   |

---

## 9. IMPLEMENTATION PHASES

### Phase 1: Outstanding UI (Frontend) ← WE START HERE
- [ ] Initialize Next.js 16 + TypeScript project
- [ ] Design premium dark glassmorphism theme (BETTER colors!)
- [ ] Build 3D Graph component (react-force-graph-3d)
- [ ] Build EventPanel (scenario selector + What-If input)
- [ ] Build Inspector sidebar (LLM reasoning + metrics)
- [ ] Build ConfidenceLegend (edge guide)
- [ ] Connect to hardcoded seed data (work without backend)

### Phase 2: Backend Foundation
- [ ] Scaffold FastAPI app (main.py + config.py)
- [ ] Build seed_graph.py (hardcode 20 nodes + edges)
- [ ] Build BFS Decay propagation algorithm
- [ ] Create API endpoints (GET /api/graph, POST /api/simulate)

### Phase 3: AI / LLM Integration
- [ ] Build LLM extractor (extractor.py + prompts.py)
- [ ] Connect OpenRouter API (Claude / GPT)
- [ ] Cache all LLM responses (diskcache)
- [ ] Build POST /api/analyze endpoint

### Phase 4: Market Data + Validation
- [ ] Add yfinance sparkline endpoint
- [ ] Build NodeDetail.tsx with price chart
- [ ] Pre-build Russia-Ukraine scenario with real data

### Phase 5: Demo Polish
- [ ] Pre-compute all demo scenarios
- [ ] Test end-to-end flow
- [ ] Deploy Frontend (Vercel) + Backend (Railway)
- [ ] Prepare 5-minute demo script

---

## 10. KEY DESIGN DECISIONS

| Decision       | Choice              | Rationale                        |
|----------------|----------------------|----------------------------------|
| Graph DB       | NetworkX (in-memory) | Zero setup, JSON export          |
| LLM Provider   | OpenRouter           | Single key, multiple models      |
| Frontend Graph | react-force-graph-3d | 3D + particles, WebGL perf       |
| Caching        | diskcache            | File-based, no Redis needed      |
| Deployment     | Vercel + Railway     | Free tiers, fast setup           |
| Data Strategy  | Pre-compute + cache  | Demo reliability > live data     |

---

## 11. IMPORTANT RULES

1. Pre-compute the demo graph — don't rely on live API calls during pitch
2. Cache ALL LLM responses — avoid redundant API costs
3. Fallback Plan: If OpenRouter is down, serve pre-cached seed_data.json
4. Commit hourly — hackathon monitors GitHub every hour
5. No hardcoded API keys — use .env file always
