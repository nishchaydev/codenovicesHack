# Developer Guide — FinGraph

> Everything you need to start contributing. Read this before touching code.

---

## Team Roles & Task Ownership

| Role | Owner | Files | First Task |
|------|-------|-------|------------|
| **Backend + LLM** | Dev 1 | `backend/main.py`, `backend/llm/*` | FastAPI scaffold + LLM extractor |
| **Frontend + Viz** | Dev 2 | `frontend/**` | Next.js scaffold + GraphView component |
| **Data + Algorithms** | Dev 3 | `backend/graph/*`, `backend/data/*` | Seed graph + BFS Decay algorithm |
| **Integration + Demo** | Dev 4 | everywhere (read), scenarios, README | Connect FE↔BE + demo scenarios + pitch |

> **Rule:** Don't step on each other's files. If you need something from another dev's area, ask — or create an interface and let them fill it in.

---

## Setup

### Prerequisites

- Python 3.12+ (`python --version`)
- Node.js 22+ (`node --version`)
- Git (`git --version`)

### Clone & Setup

```bash
git clone https://github.com/nishchaydev/finDlilly.git
cd finDlilly
```

### Backend Setup

```bash
cd backend
python -m venv venv

# Activate:
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows CMD:
venv\Scripts\activate.bat
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### Frontend Setup

```bash
cd frontend
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
OPENROUTER_API_KEY=sk-or-v1-...     # Get from team lead
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Running Locally

**Terminal 1 — Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Git Workflow

### ⚠️ CRITICAL: Hourly Commits Required

The hackathon monitors our GitHub every hour. **You must push at least once per hour.**

### Branch Strategy

We work on `main` directly (hackathon speed). But **communicate before pushing** to avoid conflicts.

### Commit Convention

```
feat: add LLM extraction endpoint
fix: handle empty graph response
docs: update API reference
data: add Russia-Ukraine scenario
style: improve graph node colors
```

### Push Checklist

Before every push:
1. `git pull` first (avoid conflicts)
2. Make sure your code doesn't break the other person's work
3. Write a clear commit message
4. Push immediately — don't hoard commits

```bash
git add .
git commit -m "feat: your message"
git push
```

---

## Coding Conventions

### Python (Backend)

- **Type hints** on all function signatures
- **Pydantic models** for API request/response schemas
- **No bare `except:`** — always catch specific exceptions
- **f-strings** for string formatting
- Run with `uvicorn main:app --reload` for hot reload

### TypeScript (Frontend)

- **Strict mode** enabled in tsconfig
- **Interface over type** for object shapes
- **No `any`** — use proper types from `lib/types.ts`
- Components are functional + hooks only

### Shared

- No hardcoded API keys anywhere in code — use `.env`
- No `console.log` left in production code (use sparingly for debug)
- Keep functions small — one function, one job

---

## Key Interfaces Between Teams

These are the contracts. Backend implements them. Frontend consumes them.

### Graph Data (Dev 1 → Dev 2)

Backend serves at `GET /api/graph`:

```typescript
// frontend/src/lib/types.ts
interface GraphNode {
  id: string;
  name: string;
  type: "Company" | "Sector" | "Commodity" | "Event" | "Indicator";
  group: string;
  val: number;
  risk_score: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
  weight: number;
  confidence: number;
  explanation: string;
  sentiment: -1 | 0 | 1;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
```

### Simulate Response (Dev 1 → Dev 2)

Backend serves at `POST /api/simulate`:

```typescript
interface SimulateResponse {
  event: {
    id: string;
    type: string;
    headline: string;
    severity: number;
    sentiment: string;
  };
  new_nodes: GraphNode[];
  new_links: GraphLink[];
  impact_scores: Record<string, number>;
  propagation_path: {
    from: string;
    to: string;
    impact: number;
    explanation: string;
  }[];
}
```

### Sparkline Data (Dev 3 → Dev 2)

Backend serves at `GET /api/stock/{ticker}`:

```typescript
interface SparklineData {
  ticker: string;
  name: string;
  prices: { date: string; close: number }[];
  change_pct: number;
}
```

---

## Demo Scenarios to Pre-Build

Each scenario is a JSON file in `data/scenarios/`. Dev 3 + Dev 4 create these.

| Scenario | Event | Key Nodes Affected |
|----------|-------|-------------------|
| **Semiconductor Shock** | "TSMC factory fire" | TSM → AAPL → NVDA → AMD |
| **Oil Spike** | "Crude oil rises 12%" | CL=F → XLE → DAL → SPY |
| **Russia-Ukraine** | "Russia invades Ukraine" | Oil, Gas, Wheat, LMT, XLE |

Format:
```json
{
  "id": "semiconductor-shock",
  "headline": "TSMC reports major factory fire in Hsinchu",
  "event_type": "Corporate",
  "pre_computed_graph": { "nodes": [...], "links": [...] },
  "impact_scores": { "TSM": 100, "AAPL": 90, ... },
  "propagation_path": [...]
}
```

---

## Quick Reference

| What | Where |
|------|-------|
| Implementation plan | `financial-impact-graph.md` (project root) |
| Full research | `docs/research/financial-impact-graph-research.md` |
| Architecture | `docs/ARCHITECTURE.md` |
| API reference | `docs/API.md` |
| Graph schema | `docs/GRAPH-SCHEMA.md` |
| This guide | `docs/DEV-GUIDE.md` |
