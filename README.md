# 🌐 FinGraph — Autonomous Financial Event Market Impact Graph

> **Hackathon Project by Team codenovicesHack**  
> **Status: 🔬 RESEARCH & DOCUMENTATION PHASE**

---

## 📌 Current Status

| Phase | Status | What We're Doing |
|-------|:------:|-----------------|
| ✅ **Research** | COMPLETE | Deep research across 6 dimensions — NLP, graphs, finance, architecture, competition, data |
| ✅ **Documentation** | COMPLETE | Architecture, API spec, graph schema, dev guide — all written |
| 🔄 **Planning** | IN PROGRESS | Implementation plan created, task assignments being finalized |
| ⬜ **Implementation** | NEXT | Backend (FastAPI), Frontend (Next.js), Graph engine (NetworkX) |
| ⬜ **Demo Prep** | LATER | Pre-computed scenarios, pitch deck, demo script |

---

## What Is This Project?

### The Problem (In Simple Words)

When crude oil prices spike, it doesn't just affect oil companies. It makes flights expensive, which makes shipping expensive, which makes everything in the store more expensive, which makes the central bank raise interest rates, which makes home loans expensive, which crashes the housing market.

**This is a chain reaction.** But no tool shows you this chain visually. News apps show you "Oil went up 12%" as an isolated headline. They never show you the 5 downstream effects.

### Our Solution

**FinGraph** takes a financial news event and builds a **visual chain reaction graph** showing:

1. **WHO** is affected (companies, sectors, commodities)
2. **HOW MUCH** they're affected (confidence scores)
3. **WHY** they're affected (AI-generated explanations)
4. **HOW FAR** the impact spreads (1st, 2nd, 3rd order effects)

### Example

```
Input:  "Crude oil rises 12% after OPEC cuts production"

Output: An interactive 3D graph showing:

  🛢️ Oil (+12%) ──→ ✈️ Airlines (-8%) ──→ 🏨 Tourism (-3%)
       │                                        
       ├──→ 📈 Inflation (+2%) ──→ 🏦 Rate Hike ──→ 🏠 Housing (-5%)
       │
       └──→ ⚡ Energy Stocks (+6%) ──→ 📊 S&P 500 (-1.2%)
```

Each arrow has a **confidence score** and a **plain-English explanation** you can click to read.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Backend** | Python + FastAPI | Best for AI/ML + graph computation |
| **AI/LLM** | OpenRouter (Claude / GPT-4o) | Extracts entities and relationships from news |
| **Graph Engine** | NetworkX | In-memory graph algorithms (PageRank, BFS) |
| **Frontend** | Next.js + TypeScript | Fast deployment on Vercel |
| **Visualization** | react-force-graph-3d | Interactive 3D graph with animations |
| **Market Data** | yfinance (free) | Real stock/commodity prices |

---

## Documentation

| Doc | What's Inside | Who Should Read |
|-----|--------------|----------------|
| 📊 [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, data flow, component ownership | Everyone |
| 🔌 [API.md](docs/API.md) | Every API endpoint with request/response examples | Backend + Frontend devs |
| 🕸️ [GRAPH-SCHEMA.md](docs/GRAPH-SCHEMA.md) | Node types, edge types, propagation algorithm code | Data + Algorithm dev |
| 👩‍💻 [DEV-GUIDE.md](docs/DEV-GUIDE.md) | Setup, git workflow, coding rules, team roles | Everyone (read first!) |
| 🔬 [Research](docs/research/financial-impact-graph-research.md) | Full research with real data, proofs, papers | Everyone |

---

## Project Structure

```
codenovicesHack/
├── docs/                        ← You are here (research phase)
│   ├── ARCHITECTURE.md          System design
│   ├── API.md                   API reference
│   ├── GRAPH-SCHEMA.md          Graph node/edge schema
│   ├── DEV-GUIDE.md             Developer onboarding
│   └── research/                Full research document
├── backend/                     ← Coming next (implementation phase)
├── frontend/                    ← Coming next
├── financial-impact-graph.md    Implementation plan / task tracker
├── .env.example                 Environment variable template
├── .gitignore
└── README.md                    ← This file
```

---

## Team

**codenovicesHack** — [GitHub](https://github.com/nishchaydev/codenovicesHack)

| Role | Responsibility |
|------|---------------|
| **Backend + LLM** | FastAPI server, OpenRouter integration, caching |
| **Frontend + Viz** | Next.js app, 3D graph component, animations |
| **Data + Algorithms** | Seed graph, yfinance data, BFS propagation algorithm |
| **Integration + Demo** | Wire everything together, demo scenarios, pitch |

---

## License

MIT
