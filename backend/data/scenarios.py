from typing import List, Dict, Any

PRELOADED_SCENARIOS: List[Dict[str, Any]] = [
    {
        "id": "opec-oil-spike",
        "title": "Crude Oil Rises 12% on Surprise OPEC+ Cuts",
        "category": "Commodity Shock",
        "headline": "Crude oil rises 12% after surprise OPEC+ production cuts announced in Vienna",
        "primary_trigger": "CL=F",
        "severity": 8,
        "sentiment": "Bearish",
        "badge": "PS Benchmark",
        "description": "Exemplary Problem Statement shock: Oil surge cascades through inflation expectations, airline operating margins, paint manufacturers, and bond yields.",
        "expected_cascade": ["CL=F", "XLE", "DAL", "ASIANPAINT.NS", "^TNX", "XLK", "XLF"]
    },
    {
        "id": "tsmc-fab-fire",
        "title": "TSMC Fab Disruption in Hsinchu",
        "category": "Supply Chain",
        "headline": "TSMC reports critical wafer fabrication disruption at Hsinchu Fab 18 facility",
        "primary_trigger": "TSM",
        "severity": 9,
        "sentiment": "Bearish",
        "badge": "High Impact",
        "description": "Hardware supply shock: Sub-3nm wafer allocation freezes directly impacting Apple, Nvidia AI GPU deliveries, and Foxconn assembly lines.",
        "expected_cascade": ["TSM", "AAPL", "NVDA", "AMD", "FOXCONN", "MSFT", "XLK"]
    },
    {
        "id": "fed-rate-hike",
        "title": "Fed Hikes Rates 50 bps (Inflation Shock)",
        "category": "Monetary Policy",
        "headline": "Federal Reserve unexpectedly hikes rates by 50 bps as core inflation gauges reaccelerate",
        "primary_trigger": "^TNX",
        "severity": 8,
        "sentiment": "Bearish",
        "badge": "Macro Risk",
        "description": "Discount rate repricing: 10Y Yield spikes, compressing high-multiple tech valuations while initially widening bank net interest spreads.",
        "expected_cascade": ["^TNX", "XLK", "XLF", "GC=F", "DXY", "TCS.NS", "JPM"]
    },
    {
        "id": "russia-ukraine-food",
        "title": "Black Sea Grain Corridor Disruption",
        "category": "Geopolitical",
        "headline": "Black Sea maritime shipping corridor halts, stranding agricultural wheat exports",
        "primary_trigger": "ZW=F",
        "severity": 7,
        "sentiment": "Bearish",
        "badge": "Geopolitics",
        "description": "Food security shock: CBOT Wheat and fertilizer benchmarks surge, pressuring Consumer Staples (XLP) gross margins.",
        "expected_cascade": ["ZW=F", "XLP", "^VIX", "GC=F"]
    },
    {
        "id": "rbi-rate-easing",
        "title": "RBI Rate Cut & Indian Festive Capex Boom",
        "category": "Emerging Markets",
        "headline": "RBI cuts repo rate by 25 bps as domestic inflation cools, signaling growth stimulus",
        "primary_trigger": "HDFCBANK.NS",
        "severity": 6,
        "sentiment": "Bullish",
        "badge": "India Focus",
        "description": "Credit expansion catalyst: Lower borrowing costs stimulate retail mortgages, passenger vehicle loans, and Bank Nifty momentum.",
        "expected_cascade": ["HDFCBANK.NS", "RELIANCE.NS", "TATAMOTORS.NS", "ASIANPAINT.NS"]
    },
    {
        "id": "us-perm-visa-suspension",
        "title": "US Suspends PERM Visas for Microsoft & Tech; Indian IT Stocks Rally",
        "category": "Regulatory & Offshore Shift",
        "headline": "US suspends PERM visa program for tech firms including Microsoft; Indian IT stocks rally as offshore hiring surges",
        "primary_trigger": "TCS.NS",
        "severity": 9,
        "sentiment": "Bullish",
        "badge": "Spotlight Catalyst",
        "description": "US Department of Labor suspends permanent labor certifications (PERM) for Microsoft, Adobe, TCS, Infosys, Wipro, and HCL Tech. While US onshore hiring freezes, global enterprises accelerate offshore delivery to Indian GCCs, driving a +5.8% Nifty IT rally, +280 bps margin expansion, and a +40% surge in domestic Indian tech hiring.",
        "expected_cascade": ["TCS.NS", "INFY.NS", "MSFT", "XLK", "DXY", "HDFCBANK.NS"]
    },
    {
        "id": "indian-it-licensing-audit",
        "title": "TCS & Infosys US Subcontracting & Work Authorization Audit",
        "category": "IT Services & Trade",
        "headline": "TCS and Infosys face severe US client-site visa scrutiny and subcontracting licensing audits",
        "primary_trigger": "TCS.NS",
        "severity": 8,
        "sentiment": "Bearish",
        "badge": "IT Export Risk",
        "description": "Strict compliance probes target offshore IT billing models, H-1B third-party placements, and onshore work authorizations. Indian IT majors risk multi-billion dollar enterprise contract delivery delays and immediate Nifty IT re-rating.",
        "expected_cascade": ["TCS.NS", "INFY.NS", "XLK", "MSFT", "DXY", "RELIANCE.NS"]
    }
]
