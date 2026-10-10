# API Reference — FinGraph Backend

> Base URL: `http://localhost:8000`

---

## `GET /health`

Health check.

**Response:** `200 OK`
```json
{ "status": "ok", "graph_nodes": 20, "graph_edges": 35 }
```

---

## `GET /api/graph`

Returns the full knowledge graph for initial render.

**Response:** `200 OK`
```json
{
  "nodes": [
    {
      "id": "AAPL",
      "name": "Apple Inc.",
      "type": "Company",
      "group": "Technology",
      "val": 10,
      "risk_score": 0.0
    },
    {
      "id": "XLE",
      "name": "Energy Select Sector",
      "type": "Sector",
      "group": "Energy",
      "val": 8,
      "risk_score": 0.0
    },
    {
      "id": "CL=F",
      "name": "Crude Oil WTI",
      "type": "Commodity",
      "group": "Commodities",
      "val": 7,
      "risk_score": 0.0
    }
  ],
  "links": [
    {
      "source": "TSM",
      "target": "AAPL",
      "type": "SUPPLIES_TO",
      "weight": 0.9,
      "confidence": 0.95,
      "explanation": "TSMC fabricates 100% of Apple's A-series and M-series chips",
      "sentiment": -1
    }
  ]
}
```

---

## `POST /api/simulate`

Send a financial event headline. Returns new/updated nodes, links, impact scores, and the propagation path.

**Request:**
```json
{
  "headline": "TSMC reports major factory fire in Hsinchu facility"
}
```

**Response:** `200 OK`
```json
{
  "event": {
    "id": "EVT_001",
    "type": "Corporate",
    "headline": "TSMC reports major factory fire in Hsinchu facility",
    "severity": 8,
    "sentiment": "Bearish"
  },
  "new_nodes": [
    { "id": "EVT_001", "name": "TSMC Factory Fire", "type": "Event", "group": "Events", "val": 12 }
  ],
  "new_links": [
    { "source": "EVT_001", "target": "TSM", "type": "AFFECTS", "weight": 1.0, "confidence": 0.98, "explanation": "Direct impact on TSMC operations", "sentiment": -1 }
  ],
  "impact_scores": {
    "TSM": 100,
    "AAPL": 90,
    "NVDA": 70,
    "AMD": 35,
    "BEST_BUY": 18
  },
  "propagation_path": [
    { "from": "EVT_001", "to": "TSM", "impact": 100, "explanation": "Factory fire halts chip production" },
    { "from": "TSM", "to": "AAPL", "impact": 90, "explanation": "Apple depends on TSMC for 100% of its chips" },
    { "from": "TSM", "to": "NVDA", "impact": 70, "explanation": "NVIDIA GPUs are fabricated at TSMC" }
  ]
}
```

---

## `GET /api/stock/{ticker}`

Returns recent price data for sparkline rendering.

**Example:** `GET /api/stock/AAPL`

**Response:** `200 OK`
```json
{
  "ticker": "AAPL",
  "name": "Apple Inc.",
  "prices": [
    { "date": "2026-10-04", "close": 242.15 },
    { "date": "2026-10-05", "close": 239.80 },
    { "date": "2026-10-06", "close": 241.50 },
    { "date": "2026-10-07", "close": 238.90 },
    { "date": "2026-10-08", "close": 240.20 }
  ],
  "change_pct": -0.8
}
```

---

## `POST /api/analyze`

Raw NLP extraction — returns structured entities, events, and relationships from any text.

**Request:**
```json
{
  "text": "Crude oil surged 12% after OPEC announced surprise production cuts, raising inflation fears across emerging markets."
}
```

**Response:** `200 OK`
```json
{
  "events": [
    {
      "event_type": "Commodity_Shock",
      "headline": "Crude oil surges 12% on OPEC cuts",
      "primary_entity": "Crude Oil",
      "related_entities": ["OPEC", "Emerging Markets"],
      "sentiment": "Bearish",
      "severity_score": 8,
      "explanation": "A 12% oil spike acts as a cost-push inflation driver across the global economy"
    }
  ],
  "entities": [
    { "name": "Crude Oil", "type": "Commodity", "ticker": "CL=F" },
    { "name": "OPEC", "type": "Organization", "ticker": null }
  ],
  "relationships": [
    { "source": "Crude Oil", "target": "Airlines", "relation": "COST_INPUT", "impact_direction": "negative", "confidence": 0.95, "explanation": "Jet fuel is ~30% of airline operating costs" },
    { "source": "Crude Oil", "target": "Energy Sector", "relation": "REVENUE_DRIVER", "impact_direction": "positive", "confidence": 0.92, "explanation": "Higher oil prices directly boost energy company revenues" }
  ]
}
```

---

## `GET /api/sectors`

Returns sector-level performance data for heatmap rendering.

**Response:** `200 OK`
```json
{
  "sectors": [
    { "name": "Technology", "ticker": "XLK", "change_pct": -2.1, "impact_score": 65 },
    { "name": "Energy", "ticker": "XLE", "change_pct": 4.3, "impact_score": 90 },
    { "name": "Financials", "ticker": "XLF", "change_pct": -1.5, "impact_score": 45 }
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Description of what went wrong",
  "code": "ERROR_CODE"
}
```

| Code | HTTP Status | When |
|------|:-----------:|------|
| `INVALID_INPUT` | 400 | Missing or malformed request body |
| `LLM_ERROR` | 502 | OpenRouter API call failed |
| `RATE_LIMITED` | 429 | Too many requests |
| `NOT_FOUND` | 404 | Ticker or event ID not found |
| `INTERNAL` | 500 | Unexpected server error |
