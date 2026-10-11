import { GraphNode, GraphLink, GraphData, PropagationStep, SimulationResponse, Scenario } from "@/types/fingraph/types";

export const SEED_NODES: GraphNode[] = [
  // --- Commodities & Energy ---
  {
    id: "CL=F",
    name: "WTI Crude Oil",
    type: "Commodity",
    group: "Energy",
    val: 22.0,
    risk_score: 10.0,
    ticker: "CL=F",
    sector: "Energy",
    details: "Global benchmark for light sweet crude oil traded on NYMEX.",
  },
  {
    id: "BZ=F",
    name: "Brent Crude Oil",
    type: "Commodity",
    group: "Energy",
    val: 20.0,
    risk_score: 10.0,
    ticker: "BZ=F",
    sector: "Energy",
    details: "International benchmark pricing for 2/3 of global seaborne crude trade.",
  },
  {
    id: "NG=F",
    name: "Natural Gas",
    type: "Commodity",
    group: "Energy",
    val: 16.0,
    risk_score: 8.0,
    ticker: "NG=F",
    sector: "Energy",
    details: "Key feedstock for power generation, heating, and fertilizer synthesis.",
  },
  {
    id: "GC=F",
    name: "Gold Futures",
    type: "Commodity",
    group: "Precious Metals",
    val: 20.0,
    risk_score: 5.0,
    ticker: "GC=F",
    sector: "Materials",
    details: "Universal safe-haven monetary asset, inflation hedge, and reserve backing.",
  },
  {
    id: "HG=F",
    name: "Copper Futures",
    type: "Commodity",
    group: "Industrial Metals",
    val: 17.0,
    risk_score: 8.0,
    ticker: "HG=F",
    sector: "Materials",
    details: "'Dr. Copper' - key leading indicator of global manufacturing and clean energy grids.",
  },
  {
    id: "ZW=F",
    name: "Wheat Futures",
    type: "Commodity",
    group: "Agriculture",
    val: 16.0,
    risk_score: 9.0,
    ticker: "ZW=F",
    sector: "Consumer Staples",
    details: "Essential global staple grain traded on CBOT; highly sensitive to Black Sea logistics.",
  },

  // --- Macro Economic Indicators ---
  {
    id: "^TNX",
    name: "US 10Y Treasury Yield",
    type: "Indicator",
    group: "Macro/Rates",
    val: 22.0,
    risk_score: 12.0,
    ticker: "^TNX",
    details: "Global risk-free rate anchor; dictates global equity discount valuations.",
  },
  {
    id: "^VIX",
    name: "CBOE Volatility Index",
    type: "Indicator",
    group: "Volatility",
    val: 18.0,
    risk_score: 15.0,
    ticker: "^VIX",
    details: "The stock market 'Fear Gauge' measuring 30-day forward S&P 500 implied volatility.",
  },
  {
    id: "DXY",
    name: "US Dollar Index",
    type: "Indicator",
    group: "Currencies",
    val: 18.0,
    risk_score: 8.0,
    ticker: "DX-Y.NYB",
    details: "Value of USD relative to basket of foreign currencies; inversely moves commodities.",
  },

  // --- Key Sector ETFs ---
  {
    id: "XLE",
    name: "Energy Select SPDR",
    type: "Sector",
    group: "Energy",
    val: 18.0,
    risk_score: 12.0,
    ticker: "XLE",
    sector: "Energy",
    details: "ETF tracking top US oil & gas exploration, refining, and service giants.",
  },
  {
    id: "XLK",
    name: "Technology Select SPDR",
    type: "Sector",
    group: "Technology",
    val: 24.0,
    risk_score: 14.0,
    ticker: "XLK",
    sector: "Technology",
    details: "Dominant S&P 500 tech ETF composed of chipmakers, enterprise cloud, and devices.",
  },
  {
    id: "XLF",
    name: "Financial Select SPDR",
    type: "Sector",
    group: "Financials",
    val: 20.0,
    risk_score: 11.0,
    ticker: "XLF",
    sector: "Financials",
    details: "Banking, insurance, and brokerage giants directly tied to yield curve spreads.",
  },
  {
    id: "XLI",
    name: "Industrial Select SPDR",
    type: "Sector",
    group: "Industrials",
    val: 17.0,
    risk_score: 9.0,
    ticker: "XLI",
    sector: "Industrials",
    details: "Heavy machinery, defense contractors, airlines, and logistics operators.",
  },

  // --- Semiconductor & Hardware Supply Chain ---
  {
    id: "TSM",
    name: "TSMC",
    type: "Company",
    group: "Semiconductors",
    val: 28.0,
    risk_score: 15.0,
    ticker: "TSM",
    sector: "Technology",
    market_cap: "$890B",
    country: "Taiwan",
    details: "World's largest dedicated contract semiconductor foundry; produces 90%+ advanced sub-5nm chips.",
  },
  {
    id: "ASML",
    name: "ASML Holding",
    type: "Company",
    group: "Semiconductors",
    val: 22.0,
    risk_score: 12.0,
    ticker: "ASML",
    sector: "Technology",
    market_cap: "$360B",
    country: "Netherlands",
    details: "Sole global manufacturer of Extreme Ultraviolet (EUV) photolithography scanners.",
  },
  {
    id: "NVDA",
    name: "NVIDIA Corporation",
    type: "Company",
    group: "Semiconductors",
    val: 30.0,
    risk_score: 18.0,
    ticker: "NVDA",
    sector: "Technology",
    market_cap: "$3.05T",
    country: "USA",
    details: "Dominant producer of GPU hardware, compute clusters, and AI acceleration architectures.",
  },
  {
    id: "AAPL",
    name: "Apple Inc.",
    type: "Company",
    group: "Technology",
    val: 30.0,
    risk_score: 12.0,
    ticker: "AAPL",
    sector: "Technology",
    market_cap: "$3.42T",
    country: "USA",
    details: "Consumer tech titan; relies completely on TSMC for custom A-series and M-series Silicon.",
  },
  {
    id: "MSFT",
    name: "Microsoft",
    type: "Company",
    group: "Technology",
    val: 28.0,
    risk_score: 10.0,
    ticker: "MSFT",
    sector: "Technology",
    market_cap: "$3.15T",
    country: "USA",
    details: "Enterprise cloud and AI infrastructure provider with multi-gigawatt datacenters.",
  },
  {
    id: "AMD",
    name: "Advanced Micro Devices",
    type: "Company",
    group: "Semiconductors",
    val: 19.0,
    risk_score: 14.0,
    ticker: "AMD",
    sector: "Technology",
    market_cap: "$220B",
    country: "USA",
    details: "Key fabless CPU/GPU competitor with TSMC wafer allocation dependencies.",
  },

  // --- Indian Equities & Global Corporate Bellwethers ---
  {
    id: "RELIANCE.NS",
    name: "Reliance Industries",
    type: "Company",
    group: "Energy",
    val: 24.0,
    risk_score: 12.0,
    ticker: "RELIANCE.NS",
    sector: "Energy",
    market_cap: "$230B",
    country: "India",
    details: "Operates Jamnagar, world's largest refining complex; crude price spikes expand GRMs.",
  },
  {
    id: "HDFCBANK.NS",
    name: "HDFC Bank",
    type: "Company",
    group: "Financials",
    val: 22.0,
    risk_score: 11.0,
    ticker: "HDFCBANK.NS",
    sector: "Financials",
    market_cap: "$155B",
    country: "India",
    details: "India's premier private banking institution with massive retail mortgage & commercial loan books.",
  },
  {
    id: "TCS.NS",
    name: "Tata Consultancy Services",
    type: "Company",
    group: "Technology",
    val: 22.0,
    risk_score: 10.0,
    ticker: "TCS.NS",
    sector: "Technology",
    market_cap: "$175B",
    country: "India",
    details: "Global IT services major benefiting from INR depreciation vs USD billings.",
  },
  {
    id: "TATAMOTORS.NS",
    name: "Tata Motors",
    type: "Company",
    group: "Industrials",
    val: 18.0,
    risk_score: 13.0,
    ticker: "TATAMOTORS.NS",
    sector: "Industrials",
    market_cap: "$40B",
    country: "India",
    details: "Owner of Jaguar Land Rover & domestic CV fleet titan; sensitive to aluminum, chips, and fuel costs.",
  },
  {
    id: "ASIANPAINT.NS",
    name: "Asian Paints",
    type: "Company",
    group: "Consumer",
    val: 18.0,
    risk_score: 16.0,
    ticker: "ASIANPAINT.NS",
    sector: "Consumer Discretionary",
    market_cap: "$32B",
    country: "India",
    details: "Decorative paints leader; crude oil derivatives form 50-55% of raw material COGS.",
  },
  {
    id: "DAL",
    name: "Delta Air Lines",
    type: "Company",
    group: "Industrials",
    val: 16.0,
    risk_score: 15.0,
    ticker: "DAL",
    sector: "Industrials",
    market_cap: "$30B",
    country: "USA",
    details: "Global carrier; jet fuel is #1 variable OPEX cost (30-35% of revenue).",
  },
];

export const SEED_LINKS: GraphLink[] = [
  // Crude Oil Cascades
  {
    source: "CL=F",
    target: "XLE",
    type: "MARGIN_TRANSMISSION",
    weight: 0.88,
    confidence: 0.95,
    explanation: "Higher spot crude prices immediately expand upstream energy E&P operating cashflows.",
    sentiment: 1,
  },
  {
    source: "CL=F",
    target: "DAL",
    type: "COST_INPUT_SHOCK",
    weight: 0.82,
    confidence: 0.92,
    explanation: "Jet fuel directly tracks crude benchmarks; sudden surge compresses passenger airline margins.",
    sentiment: -1,
  },
  {
    source: "CL=F",
    target: "ASIANPAINT.NS",
    type: "RAW_MATERIAL_INPUT",
    weight: 0.78,
    confidence: 0.9,
    explanation: "Petrochemical derivatives (monomers, solvents, titanium dioxide) represent >50% of paint input costs.",
    sentiment: -1,
  },
  {
    source: "CL=F",
    target: "RELIANCE.NS",
    type: "REFINING_SPREAD_PASS",
    weight: 0.72,
    confidence: 0.88,
    explanation: "Crude volatility expands Gross Refining Margins (GRM) for high-complexity coastal refineries.",
    sentiment: 1,
  },
  {
    source: "CL=F",
    target: "^TNX",
    type: "INFLATION_EXPECTATIONS",
    weight: 0.65,
    confidence: 0.85,
    explanation: "Headline energy price spikes lift headline inflation breakevens, causing bond traders to price rate cuts out.",
    sentiment: 1,
  },
  {
    source: "CL=F",
    target: "TATAMOTORS.NS",
    type: "OPERATING_COST_STRESS",
    weight: 0.58,
    confidence: 0.8,
    explanation: "Diesel pump inflation raises total cost of ownership for commercial transport fleets, delaying replacement cycles.",
    sentiment: -1,
  },

  // Rates & Yield Curve Cascades
  {
    source: "^TNX",
    target: "XLK",
    type: "DISCOUNT_RATE_COMPRESSION",
    weight: 0.85,
    confidence: 0.94,
    explanation: "Higher risk-free discount rates reduce Present Value of distant corporate growth cashflows.",
    sentiment: -1,
  },
  {
    source: "^TNX",
    target: "XLF",
    type: "NIM_EXPANSION_INITIAL",
    weight: 0.68,
    confidence: 0.86,
    explanation: "Steeper yields initially expand Net Interest Margins (NIM) for commercial banking institutions.",
    sentiment: 1,
  },
  {
    source: "^TNX",
    target: "GC=F",
    type: "OPPORTUNITY_COST_DRAG",
    weight: 0.74,
    confidence: 0.91,
    explanation: "Non-yielding gold assets compete directly with higher real risk-free yields.",
    sentiment: -1,
  },
  {
    source: "^TNX",
    target: "DXY",
    type: "INTEREST_RATE_DIFFERENTIAL",
    weight: 0.76,
    confidence: 0.89,
    explanation: "US yield premium attracts foreign portfolio capital into dollar-denominated assets.",
    sentiment: 1,
  },

  // Semiconductor Supply Chain Cascades
  {
    source: "ASML",
    target: "TSM",
    type: "CAPITAL_EQUIPMENT_CRITICAL",
    weight: 0.94,
    confidence: 0.99,
    explanation: "TSMC cannot expand or service leading-edge sub-5nm fabs without ASML Extreme Ultraviolet (EUV) photolithography tools.",
    sentiment: 1,
  },
  {
    source: "TSM",
    target: "NVDA",
    type: "FOUNDRY_SINGLE_SOURCE",
    weight: 0.96,
    confidence: 0.98,
    explanation: "NVIDIA's Hopper & Blackwell AI GPU compute architectures are exclusively manufactured at TSMC advanced packaging nodes.",
    sentiment: 1,
  },
  {
    source: "TSM",
    target: "AAPL",
    type: "FABRICATION_ALLOCATION",
    weight: 0.92,
    confidence: 0.97,
    explanation: "Apple consumes the majority of TSMC's 3nm production capacity for iPhone and Mac Silicon processors.",
    sentiment: 1,
  },
  {
    source: "TSM",
    target: "AMD",
    type: "CPU_GPU_FOUNDRY",
    weight: 0.88,
    confidence: 0.95,
    explanation: "AMD relies on TSMC for Zen CPU and Instinct accelerator chiplet fabrication.",
    sentiment: 1,
  },
  {
    source: "NVDA",
    target: "MSFT",
    type: "HYPERSCALER_AI_CAPEX",
    weight: 0.86,
    confidence: 0.93,
    explanation: "Azure AI infrastructure deployment rate is directly throttled by GPU cluster allocation and delivery lead times.",
    sentiment: 1,
  },
  {
    source: "NVDA",
    target: "XLK",
    type: "INDEX_WEIGHT_BETA",
    weight: 0.91,
    confidence: 0.98,
    explanation: "NVIDIA represents a top-3 weighting in the Technology Select Sector ETF.",
    sentiment: 1,
  },

  // Cross-Asset Interlocks
  {
    source: "DXY",
    target: "TCS.NS",
    type: "FX_TRANSLATION_GAIN",
    weight: 0.65,
    confidence: 0.88,
    explanation: "A stronger US dollar enhances rupee realization for Indian IT services revenue billed in USD.",
    sentiment: 1,
  },
  {
    source: "^VIX",
    target: "HDFCBANK.NS",
    type: "EM_FII_OUTFLOWS",
    weight: 0.62,
    confidence: 0.84,
    explanation: "Global volatility spikes trigger foreign institutional liquidity exits from liquid Emerging Market financial holdings.",
    sentiment: -1,
  },
];

export const PRELOADED_SCENARIOS: Scenario[] = [
  {
    id: "opec-oil-spike",
    title: "Crude Oil Rises 12% on Surprise OPEC+ Cuts",
    category: "Commodity Shock",
    headline: "Crude oil rises 12% after surprise OPEC+ production cuts announced in Vienna",
    primary_trigger: "CL=F",
    severity: 8,
    sentiment: "Bearish",
    badge: "PS Benchmark",
    description: "Exemplary Problem Statement shock: Oil surge cascades through inflation expectations, airline operating margins, paint manufacturers, and bond yields.",
    expected_cascade: ["CL=F", "XLE", "DAL", "ASIANPAINT.NS", "^TNX", "XLK", "XLF"],
  },
  {
    id: "tsmc-fab-fire",
    title: "TSMC Fab Disruption in Hsinchu",
    category: "Supply Chain",
    headline: "TSMC reports critical wafer fabrication disruption at Hsinchu Fab 18 facility",
    primary_trigger: "TSM",
    severity: 9,
    sentiment: "Bearish",
    badge: "High Impact",
    description: "Hardware supply shock: Sub-3nm wafer allocation freezes directly impacting Apple, Nvidia AI GPU deliveries, and tech ETFs.",
    expected_cascade: ["TSM", "AAPL", "NVDA", "AMD", "MSFT", "XLK"],
  },
  {
    id: "fed-rate-hike",
    title: "Fed Hikes Rates 50 bps (Inflation Shock)",
    category: "Monetary Policy",
    headline: "Federal Reserve unexpectedly hikes rates by 50 bps as core inflation gauges reaccelerate",
    primary_trigger: "^TNX",
    severity: 8,
    sentiment: "Bearish",
    badge: "Macro Risk",
    description: "Discount rate repricing: 10Y Yield spikes, compressing high-multiple tech valuations while initially widening bank net interest spreads.",
    expected_cascade: ["^TNX", "XLK", "XLF", "GC=F", "DXY", "TCS.NS"],
  },
  {
    id: "russia-ukraine-food",
    title: "Black Sea Grain Corridor Disruption",
    category: "Geopolitical",
    headline: "Black Sea maritime shipping corridor halts, stranding agricultural wheat exports",
    primary_trigger: "ZW=F",
    severity: 7,
    sentiment: "Bearish",
    badge: "Geopolitics",
    description: "Food security shock: CBOT Wheat and fertilizer benchmarks surge, pressuring Consumer Staples gross margins.",
    expected_cascade: ["ZW=F", "^VIX", "GC=F"],
  },
  {
    id: "rbi-rate-easing",
    title: "RBI Rate Cut & Indian Festive Capex Boom",
    category: "Emerging Markets",
    headline: "RBI cuts repo rate by 25 bps as domestic inflation cools, signaling growth stimulus",
    primary_trigger: "HDFCBANK.NS",
    severity: 6,
    sentiment: "Bullish",
    badge: "India Focus",
    description: "Credit expansion catalyst: Lower borrowing costs stimulate retail mortgages, passenger vehicle loans, and Bank Nifty momentum.",
    expected_cascade: ["HDFCBANK.NS", "RELIANCE.NS", "TATAMOTORS.NS", "ASIANPAINT.NS"],
  },
];

export function runClientSimulation(params: {
  headline: string;
  scenario_id?: string;
  magnitude?: number;
}): SimulationResponse {
  const magnitude = params.magnitude || 85.0;
  const headline = params.headline;
  const lower = headline.toLowerCase();

  // Find trigger node
  let triggerId = "CL=F";
  let eventType = "Commodity Shock";
  let sentiment = "Bearish";
  let severity = 8;
  let summary = `Autonomous shock propagation modeled across upstream suppliers, inflation indicators, and equities.`;

  if (params.scenario_id) {
    const sc = PRELOADED_SCENARIOS.find((s) => s.id === params.scenario_id);
    if (sc) {
      triggerId = sc.primary_trigger;
      eventType = sc.category;
      sentiment = sc.sentiment;
      severity = sc.severity;
      summary = sc.description;
    }
  } else if (lower.includes("tsmc") || lower.includes("chip") || lower.includes("semiconductor") || lower.includes("wafer")) {
    triggerId = "TSM";
    eventType = "Supply Chain Disruption";
    severity = 9;
    summary = "Advanced semiconductor packaging disruption halts client assembly lines and GPU lead times.";
  } else if (lower.includes("rate") || lower.includes("fed") || lower.includes("inflation") || lower.includes("yield")) {
    triggerId = "^TNX";
    eventType = "Monetary Policy Shock";
    severity = 8;
    summary = "Discount rate escalation drives valuation multiple compression across duration assets.";
  } else if (lower.includes("tata") || lower.includes("vehicle") || lower.includes("auto")) {
    triggerId = "TATAMOTORS.NS";
    eventType = "Automotive Margin Shock";
    severity = 7;
    summary = "Input cost inflation and financing tightening affect fleet demand and production schedules.";
  } else if (lower.includes("rbi") || lower.includes("bank") || lower.includes("credit")) {
    triggerId = "HDFCBANK.NS";
    eventType = "Banking Liquidity Movement";
    severity = 6;
    sentiment = lower.includes("cut") || lower.includes("easing") ? "Bullish" : "Bearish";
    summary = "Interbank liquidity transmission alters credit expansion and domestic asset returns.";
  }

  const eventId = `EVT_${Date.now()}`;
  const initialSent = sentiment === "Bearish" ? -1 : 1;

  // BFS Decay Propagation
  const impactScores: Record<string, number> = { [triggerId]: magnitude };
  const propagationSteps: PropagationStep[] = [];
  const visitedEdges = new Set<string>();

  // Queue: [nodeId, currentImpact, currentSent, hop]
  const queue: Array<[string, number, number, number]> = [[triggerId, magnitude, initialSent, 0]];

  while (queue.length > 0) {
    const [currId, currImpact, currSent, hop] = queue.shift()!;
    if (hop >= 4) continue;

    // Find all outgoing links from currId
    const outgoing = SEED_LINKS.filter((l) => {
      const src = typeof l.source === "object" ? l.source.id : l.source;
      return src === currId;
    });

    for (const link of outgoing) {
      const tgtId = typeof link.target === "object" ? link.target.id : link.target;
      const edgeKey = `${currId}->${tgtId}`;
      if (visitedEdges.has(edgeKey)) continue;
      visitedEdges.add(edgeKey);

      const transmitted = Math.round(currImpact * link.weight * (0.8 + 0.2 * link.confidence) * 100) / 100;
      if (transmitted >= 4.0) {
        const edgeSentimentMult = link.sentiment >= 0 ? 1 : -1;
        const targetSentiment = currSent * edgeSentimentMult;

        if (impactScores[tgtId]) {
          impactScores[tgtId] = Math.min(100, Math.round((impactScores[tgtId] + transmitted * 0.4) * 100) / 100);
        } else {
          impactScores[tgtId] = transmitted;
          queue.push([tgtId, transmitted, targetSentiment, hop + 1]);
        }

        const srcNode = SEED_NODES.find((n) => n.id === currId);
        const tgtNode = SEED_NODES.find((n) => n.id === tgtId);

        propagationSteps.push({
          source_id: currId,
          source_name: srcNode?.name || currId,
          target_id: tgtId,
          target_name: tgtNode?.name || tgtId,
          impact: transmitted,
          sentiment: targetSentiment,
          confidence: link.confidence,
          relation: link.type,
          explanation: link.explanation,
          hop: hop + 1,
        });
      }
    }
  }

  // Enrich nodes
  const enrichedNodes: GraphNode[] = SEED_NODES.map((node) => {
    const shock = impactScores[node.id] || 0;
    return {
      ...node,
      risk_score: shock > 0 ? shock : node.risk_score,
      val: shock > 0 ? Math.min(36, node.val + shock * 0.12) : node.val,
    };
  });

  const activeEdgeKeys = new Set(propagationSteps.map((p) => `${p.source_id}->${p.target_id}`));
  const enrichedLinks: GraphLink[] = SEED_LINKS.map((link) => {
    const src = typeof link.source === "object" ? link.source.id : link.source;
    const tgt = typeof link.target === "object" ? link.target.id : link.target;
    return {
      ...link,
      is_active_shock: activeEdgeKeys.has(`${src}->${tgt}`),
    };
  });

  return {
    event_id: eventId,
    headline,
    event_type: eventType,
    severity,
    sentiment,
    summary,
    affected_nodes: impactScores,
    propagation_paths: propagationSteps,
    graph: {
      nodes: enrichedNodes,
      links: enrichedLinks,
      total_nodes: enrichedNodes.length,
      total_links: enrichedLinks.length,
    },
    timestamp: new Date().toISOString(),
  };
}

export function generateSyntheticHistory(ticker: string, days = 14) {
  const baseMap: Record<string, number> = {
    "TATAMOTORS.NS": 964.2,
    "RELIANCE.NS": 1342.0,
    "HDFCBANK.NS": 1684.5,
    "ASIANPAINT.NS": 2845.5,
    "TCS.NS": 4125.0,
    "NVDA": 128.5,
    "AAPL": 235.0,
    "TSM": 182.4,
    "CL=F": 82.4,
    "BZ=F": 86.1,
    "^TNX": 4.25,
    "^VIX": 18.2,
  };

  const base = baseMap[ticker.toUpperCase()] || 120.0;
  const prices = [];
  let curr = base * 0.96;
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const dt = new Date(today);
    dt.setDate(today.getDate() - i);
    const delta = (Math.random() - 0.47) * 0.028;
    curr = Math.round(curr * (1 + delta) * 100) / 100;
    prices.push({
      date: dt.toISOString().split("T")[0],
      close: curr,
    });
  }

  const firstPrice = prices[0].close;
  const lastPrice = prices[prices.length - 1].close;
  const changePct = Math.round(((lastPrice - firstPrice) / firstPrice) * 10000) / 100;

  return {
    ticker: ticker.toUpperCase(),
    current_price: lastPrice,
    change_pct: changePct,
    prices,
    data_source: "in_memory_simulation",
  };
}
