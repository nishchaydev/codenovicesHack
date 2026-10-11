# FinGraph MVP — Quick Action Plan
## Based on Extracted Abhedya Chakra UI + codenovicesHack Docs

---

## APPROACH: Copy the Abhedya UI Framework → Adapt for Financial Impact Graph

### What We Are Reusing From Svvv-26 Frontend:
- React + Vite setup (package.json, vite.config.js)
- vis-network for graph visualization (already installed)
- recharts for charts (already installed)
- framer-motion for animations (already installed)
- Clean CSS design system (styles.css)
- Sidebar + Main layout pattern (App.jsx Shell)
- Network page graph rendering logic (pages/Network.jsx)

### What We Are Changing:
- Brand name: "Abhedya Chakra" → "FinGraph — Financial Impact Tracker"
- Domain: Crime forensics → Financial event chain reactions
- Graph nodes: Criminal suspects → Companies, Sectors, Commodities
- Graph edges: Criminal connections → SUPPLIES_TO, AFFECTS, CONSUMES
- Dashboard: Crime stats → Market overview + scenario selector
- Network page: Transaction tracing → Impact propagation graph
- Add: "What-If" simulation input
- Add: LLM explanation sidebar
- Add: Confidence scoring on edges

---

## STEP-BY-STEP EXECUTION (Start ASAP)

### Step 1: Copy & Initialize Project ⏳ NOW
- Copy the svvv frontend folder to new `fingraph` project folder
- npm install to ensure dependencies work
- Run dev server, confirm it loads

### Step 2: Rebrand ⏳ 15 min
- Change brand name in App.jsx → "FinGraph AI"
- Update footer → "Hackwave 3.0 • Financial Impact Graph MVP"
- Remove crime-specific pages (Detective, Patrol, Vision, Audit)
- Keep: Dashboard, Network, AI Hub

### Step 3: Build Seed Data ⏳ 20 min
- Create seed_data.js with 20 financial nodes (from GRAPH-SCHEMA.md)
- Add 10+ edges with weights, confidence, explanations
- Format matches vis-network input

### Step 4: Rebuild Dashboard Page ⏳ 30 min
- Show 3 scenario cards (Oil Spike, Rate Hike, Semi Shock)
- Show market ticker summary
- Show graph stats (nodes, edges)

### Step 5: Rebuild Network Page → Impact Graph ⏳ 45 min
- Load seed_data.js into vis-network
- Color nodes by type (Company=blue, Sector=teal, Commodity=gold, Event=red)
- Click node → show sidebar with name, type, impact score, LLM explanation
- Click edge → show relationship type, confidence %, explanation

### Step 6: Add "What-If" Simulation ⏳ 20 min
- Text input at top of Network page
- On submit → add new Event node to graph
- Connect to related entities
- Animate the ripple (highlight affected nodes)

### Step 7: News Integration ⏳ 15 min
- Use Google News RSS (free, no key needed)
- URL: https://news.google.com/rss/search?q=financial+market+india
- Fetch top 5 headlines, show in sidebar
- Click headline → auto-simulate on graph

---

## TOTAL ESTIMATED TIME: ~2.5 hours for working MVP

---

## FILES WE WILL CREATE/MODIFY:

| File | Action |
|------|--------|
| App.jsx | Rebrand + remove crime pages |
| styles.css | Keep as-is (design is already clean) |
| src/data/seedGraph.js | NEW — 20 financial nodes + edges |
| src/data/scenarios.js | NEW — 3 pre-built demo scenarios |
| pages/Dashboard.jsx | REWRITE — financial dashboard |
| pages/Network.jsx | MODIFY — financial impact graph |
| pages/AIHub.jsx | MODIFY — add What-If simulation |
| components/ImpactSidebar.jsx | NEW — LLM explanation panel |
| components/ScenarioCard.jsx | NEW — scenario selector cards |

---

## NEWS EXTRACTION SOURCES (from news extract.txt):
1. Finnhub API (finnhub.io) — Free 60 calls/min
2. NewsAPI.org — Free for dev
3. Alpha Vantage — Free + sentiment scores
4. Google News RSS — Completely free, no key needed (RECOMMENDED for MVP)
