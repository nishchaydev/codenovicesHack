# Knowledge Graph Schema — FinGraph

## Overview

The knowledge graph represents the financial ecosystem as a directed graph where **nodes** are financial entities and **edges** are relationships between them. Built with NetworkX, exported as JSON for the frontend.

---

## Node Types

| Type | Description | Example | Attributes |
|------|-------------|---------|------------|
| `Company` | Publicly traded company | Apple (AAPL) | ticker, market_cap, sector |
| `Sector` | Industry sector or ETF | Technology (XLK) | etf_ticker |
| `Commodity` | Traded commodity | Crude Oil (CL=F) | futures_ticker |
| `Event` | A financial event (shock) | TSMC Factory Fire | severity, sentiment, date |
| `Indicator` | Economic indicator | 10Y Treasury (^TNX) | data_source |
| `Country` | Nation/region | United States | currency |

### Node JSON Schema

```json
{
  "id": "AAPL",
  "name": "Apple Inc.",
  "type": "Company",
  "group": "Technology",
  "val": 10,
  "risk_score": 0.0,
  "metadata": {
    "ticker": "AAPL",
    "sector": "Technology"
  }
}
```

**Field notes:**
- `id` — Unique identifier (ticker symbol, or `EVT_xxx` for events)
- `val` — Controls node size in visualization (higher = bigger)
- `risk_score` — Set to 0 initially, updated by propagation algorithm
- `group` — Used for color coding in the graph

---

## Edge Types

| Edge | Direction | Example | Weight Basis |
|------|-----------|---------|-------------|
| `SUPPLIES_TO` | Company → Company | TSMC → Apple | % of revenue/COGS dependency |
| `BELONGS_TO` | Company → Sector | Apple → Technology | 1.0 (structural) |
| `PRODUCES` | Company → Commodity | Saudi Aramco → Crude Oil | Production volume share |
| `CONSUMES` | Company → Commodity | Delta → Jet Fuel | % of operating cost |
| `AFFECTS` | Event → Any | Rate Hike → Banks | LLM-scored impact (0–1) |
| `CORRELATED_WITH` | Any ↔ Any | NVDA ↔ AMD | Pearson r > 0.7 |
| `COMPETES_WITH` | Company ↔ Company | AMD ↔ Intel | Market share overlap |

### Edge JSON Schema

```json
{
  "source": "TSM",
  "target": "AAPL",
  "type": "SUPPLIES_TO",
  "weight": 0.9,
  "confidence": 0.95,
  "explanation": "TSMC fabricates 100% of Apple's A-series and M-series chips",
  "sentiment": -1
}
```

**Field notes:**
- `weight` — Strength of relationship (0.0–1.0). Used in propagation math
- `confidence` — How certain we are this relationship exists (0.0–1.0). Controls visual styling:
  - `>= 0.8` → thick solid line
  - `0.5–0.8` → normal solid line
  - `< 0.5` → dashed line
- `sentiment` — Direction of impact: `-1` negative, `0` neutral, `1` positive
- `explanation` — LLM-generated natural language reason for this edge

---

## Propagation Algorithm — BFS Decay

When a shock event is injected, impact propagates through the graph with exponential decay:

```
Initial: Event node gets impact = 100
Each hop: child_impact = parent_impact × edge_weight
Stop when: impact < 5 (threshold)
```

### Pseudocode

```python
def propagate_impact(graph, event_node, initial_impact=100, threshold=5):
    queue = [(event_node, initial_impact)]
    visited = {event_node: initial_impact}

    while queue:
        current, impact = queue.pop(0)
        for neighbor in graph.neighbors(current):
            weight = graph[current][neighbor]['weight']
            new_impact = impact * weight

            if new_impact >= threshold and neighbor not in visited:
                visited[neighbor] = new_impact
                graph.nodes[neighbor]['risk_score'] = new_impact
                queue.append((neighbor, new_impact))

    return visited
```

### Example Propagation

```
Event: "TSMC Factory Fire" (impact: 100)
  │
  ├── TSMC (weight: 1.0) ──────── impact: 100
  │     ├── Apple (weight: 0.9) ── impact: 90
  │     │     └── Best Buy (0.4) ── impact: 36
  │     ├── NVIDIA (weight: 0.7) ── impact: 70
  │     │     └── Cloud/AI (0.6) ── impact: 42
  │     └── AMD (weight: 0.5) ──── impact: 50
  │
  └── Semiconductor Sector (1.0) ── impact: 100
        └── Technology Sector (0.6) ── impact: 60
```

---

## Seed Graph — Pre-Built Demo Data

The seed graph ships with ~20 nodes covering the **semiconductor supply chain**:

### Nodes

| ID | Name | Type | Group |
|----|------|------|-------|
| `TSM` | TSMC | Company | Semiconductors |
| `NVDA` | NVIDIA | Company | Semiconductors |
| `AMD` | AMD | Company | Semiconductors |
| `INTC` | Intel | Company | Semiconductors |
| `AAPL` | Apple | Company | Technology |
| `MSFT` | Microsoft | Company | Technology |
| `GOOGL` | Alphabet | Company | Technology |
| `AMZN` | Amazon | Company | Technology |
| `META` | Meta | Company | Technology |
| `AVGO` | Broadcom | Company | Semiconductors |
| `QCOM` | Qualcomm | Company | Semiconductors |
| `FOXCONN` | Foxconn (Hon Hai) | Company | Manufacturing |
| `CL=F` | Crude Oil | Commodity | Energy |
| `XLE` | Energy Sector | Sector | Energy |
| `XLK` | Technology Sector | Sector | Technology |
| `^TNX` | 10Y Treasury Yield | Indicator | Rates |
| `^VIX` | VIX Volatility | Indicator | Volatility |
| `SPY` | S&P 500 | Sector | Broad Market |
| `LMT` | Lockheed Martin | Company | Defense |
| `DAL` | Delta Airlines | Company | Airlines |

### Key Edges

| Source | Target | Type | Weight | Explanation |
|--------|--------|------|:------:|------------|
| TSM | AAPL | SUPPLIES_TO | 0.9 | TSMC fabs 100% of Apple's custom chips |
| TSM | NVDA | SUPPLIES_TO | 0.7 | TSMC fabs NVIDIA's GPU dies |
| TSM | AMD | SUPPLIES_TO | 0.6 | TSMC fabs AMD's CPU/GPU chips |
| TSM | QCOM | SUPPLIES_TO | 0.5 | TSMC fabs Qualcomm's Snapdragon chips |
| AAPL | FOXCONN | SUPPLIES_TO | 0.8 | Foxconn assembles ~70% of iPhones |
| NVDA | XLK | BELONGS_TO | 1.0 | Part of tech sector |
| CL=F | XLE | REVENUE_DRIVER | 0.85 | Oil price directly drives energy revenues |
| CL=F | DAL | COST_INPUT | 0.7 | Jet fuel = ~30% of airline costs |
| ^TNX | XLF | AFFECTS | 0.6 | Rate changes directly affect bank margins |
| NVDA | AMD | COMPETES_WITH | 0.5 | GPU market competitors |

---

## Graph Algorithms Used

| Algorithm | Purpose | When Used |
|-----------|---------|-----------|
| **BFS Decay** | Trace impact propagation from event → downstream | On every "Simulate" action |
| **PageRank** | Rank nodes by systemic importance | On graph load (highlight critical nodes) |
| **Shortest Path** | Show the path between any two entities | When user asks "How does X affect Y?" |
| **Louvain Communities** | Find clusters of related entities | Color-code groups in visualization |
