import networkx as nx
from typing import Tuple, List
from graph.models import GraphNode, GraphLink, GraphData

def get_initial_seed_nodes() -> List[GraphNode]:
    return [
        # --- Commodities & Energy ---
        GraphNode(
            id="CL=F",
            name="WTI Crude Oil",
            type="Commodity",
            group="Energy",
            val=22.0,
            ticker="CL=F",
            sector="Energy",
            details="Global benchmark for light sweet crude oil traded on NYMEX."
        ),
        GraphNode(
            id="BZ=F",
            name="Brent Crude Oil",
            type="Commodity",
            group="Energy",
            val=20.0,
            ticker="BZ=F",
            sector="Energy",
            details="International benchmark pricing for 2/3 of global seaborne crude trade."
        ),
        GraphNode(
            id="NG=F",
            name="Natural Gas",
            type="Commodity",
            group="Energy",
            val=16.0,
            ticker="NG=F",
            sector="Energy",
            details="Key feedstock for power generation, heating, and fertilizer synthesis."
        ),
        GraphNode(
            id="GC=F",
            name="Gold Futures",
            type="Commodity",
            group="Precious Metals",
            val=20.0,
            ticker="GC=F",
            sector="Materials",
            details="Universal safe-haven monetary asset, inflation hedge, and reserve backing."
        ),
        GraphNode(
            id="HG=F",
            name="Copper Futures",
            type="Commodity",
            group="Industrial Metals",
            val=17.0,
            ticker="HG=F",
            sector="Materials",
            details="'Dr. Copper' - key leading indicator of global manufacturing and clean energy grids."
        ),
        GraphNode(
            id="ZW=F",
            name="Wheat Futures",
            type="Commodity",
            group="Agriculture",
            val=16.0,
            ticker="ZW=F",
            sector="Consumer Staples",
            details="Essential global staple grain traded on CBOT; highly sensitive to Black Sea logistics."
        ),

        # --- Macro Economic Indicators ---
        GraphNode(
            id="^TNX",
            name="US 10Y Treasury Yield",
            type="Indicator",
            group="Macro/Rates",
            val=22.0,
            ticker="^TNX",
            details="Global risk-free rate anchor; dictates global equity discount valuations."
        ),
        GraphNode(
            id="^VIX",
            name="CBOE Volatility Index",
            type="Indicator",
            group="Volatility",
            val=18.0,
            ticker="^VIX",
            details="The stock market 'Fear Gauge' measuring 30-day forward S&P 500 implied volatility."
        ),
        GraphNode(
            id="DXY",
            name="US Dollar Index",
            type="Indicator",
            group="Currencies",
            val=18.0,
            ticker="DX-Y.NYB",
            details="Value of USD relative to basket of foreign currencies; inversely moves commodities."
        ),

        # --- Key Sector ETFs ---
        GraphNode(
            id="XLE",
            name="Energy Select SPDR",
            type="Sector",
            group="Energy",
            val=18.0,
            ticker="XLE",
            sector="Energy",
            details="ETF tracking top US oil & gas exploration, refining, and service giants."
        ),
        GraphNode(
            id="XLK",
            name="Technology Select SPDR",
            type="Sector",
            group="Technology",
            val=24.0,
            ticker="XLK",
            sector="Technology",
            details="Dominant S&P 500 tech ETF composed of chipmakers, enterprise cloud, and devices."
        ),
        GraphNode(
            id="XLF",
            name="Financial Select SPDR",
            type="Sector",
            group="Financials",
            val=20.0,
            ticker="XLF",
            sector="Financials",
            details="Banking, insurance, and brokerage giants directly tied to yield curve spreads."
        ),
        GraphNode(
            id="XLI",
            name="Industrial Select SPDR",
            type="Sector",
            group="Industrials",
            val=17.0,
            ticker="XLI",
            sector="Industrials",
            details="Heavy machinery, defense contractors, airlines, and logistics operators."
        ),

        # --- Semiconductor & Hardware Supply Chain ---
        GraphNode(
            id="TSM",
            name="TSMC",
            type="Company",
            group="Semiconductors",
            val=28.0,
            ticker="TSM",
            sector="Technology",
            market_cap="$890B",
            country="Taiwan",
            details="World's largest dedicated contract semiconductor foundry; produces 90%+ advanced sub-5nm chips."
        ),
        GraphNode(
            id="ASML",
            name="ASML Holding",
            type="Company",
            group="Semiconductors",
            val=22.0,
            ticker="ASML",
            sector="Technology",
            market_cap="$360B",
            country="Netherlands",
            details="Sole global manufacturer of Extreme Ultraviolet (EUV) photolithography scanners."
        ),
        GraphNode(
            id="NVDA",
            name="NVIDIA Corporation",
            type="Company",
            group="Semiconductors",
            val=30.0,
            ticker="NVDA",
            sector="Technology",
            market_cap="$3.05T",
            country="USA",
            details="Dominant producer of GPU hardware, compute clusters, and AI acceleration architectures."
        ),
        GraphNode(
            id="AAPL",
            name="Apple Inc.",
            type="Company",
            group="Technology",
            val=30.0,
            ticker="AAPL",
            sector="Technology",
            market_cap="$3.42T",
            country="USA",
            details="Consumer tech titan; relies completely on TSMC for custom A-series and M-series Silicon."
        ),
        GraphNode(
            id="MSFT",
            name="Microsoft",
            type="Company",
            group="Technology",
            val=28.0,
            ticker="MSFT",
            sector="Technology",
            market_cap="$3.15T",
            country="USA",
            details="Enterprise cloud and AI infrastructure provider with multi-gigawatt datacenters."
        ),
        GraphNode(
            id="AMD",
            name="Advanced Micro Devices",
            type="Company",
            group="Semiconductors",
            val=19.0,
            ticker="AMD",
            sector="Technology",
            market_cap="$220B",
            country="USA",
            details="Key fabless CPU/GPU competitor with TSMC wafer allocation dependencies."
        ),
        GraphNode(
            id="FOXCONN",
            name="Hon Hai (Foxconn)",
            type="Company",
            group="Manufacturing",
            val=16.0,
            ticker="2317.TW",
            sector="Industrials",
            market_cap="$85B",
            country="Taiwan",
            details="Assembles over 70% of worldwide iPhones and critical cloud AI server racks."
        ),

        # --- Global Industrials, Defense & Transport ---
        GraphNode(
            id="DAL",
            name="Delta Air Lines",
            type="Company",
            group="Airlines",
            val=16.0,
            ticker="DAL",
            sector="Industrials",
            market_cap="$34B",
            country="USA",
            details="Major commercial air carrier where jet fuel accounts for ~28-32% of total operational cost."
        ),
        GraphNode(
            id="LMT",
            name="Lockheed Martin",
            type="Company",
            group="Defense",
            val=18.0,
            ticker="LMT",
            sector="Industrials",
            market_cap="$115B",
            country="USA",
            details="Premier aerospace and defense prime contractor; direct beneficiary of geopolitical friction."
        ),
        GraphNode(
            id="JPM",
            name="JPMorgan Chase",
            type="Company",
            group="Financials",
            val=24.0,
            ticker="JPM",
            sector="Financials",
            market_cap="$590B",
            country="USA",
            details="Largest US bank; balances interest income against commercial loan default risks."
        ),

        # --- Indian Market Giants (NSE) ---
        GraphNode(
            id="RELIANCE.NS",
            name="Reliance Industries",
            type="Company",
            group="Conglomerate",
            val=24.0,
            ticker="RELIANCE.NS",
            sector="Energy/Telecom",
            market_cap="₹20.1L Cr ($242B)",
            country="India",
            details="India's largest company operating the Jamnagar complex, telecom (Jio), and retail."
        ),
        GraphNode(
            id="HDFCBANK.NS",
            name="HDFC Bank",
            type="Company",
            group="Financials",
            val=22.0,
            ticker="HDFCBANK.NS",
            sector="Financials",
            market_cap="₹13.2L Cr ($158B)",
            country="India",
            details="India's largest private sector bank commanding ~28% weighting in Nifty Bank."
        ),
        GraphNode(
            id="TCS.NS",
            name="Tata Consultancy Services",
            type="Company",
            group="Technology",
            val=22.0,
            ticker="TCS.NS",
            sector="Technology",
            market_cap="₹15.4L Cr ($185B)",
            country="India",
            details="India's premier IT exporter with high sensitivity to US corporate discretionary tech spending."
        ),
        GraphNode(
            id="INFY.NS",
            name="Infosys",
            type="Company",
            group="Technology",
            val=20.0,
            ticker="INFY.NS",
            sector="Technology",
            market_cap="₹7.8L Cr ($94B)",
            country="India",
            details="Global digital services and consulting major driven by North American IT spending and USD/INR."
        ),
        GraphNode(
            id="ASIANPAINT.NS",
            name="Asian Paints",
            type="Company",
            group="Consumer/Chemicals",
            val=16.0,
            ticker="ASIANPAINT.NS",
            sector="Materials",
            market_cap="₹2.7L Cr ($32B)",
            country="India",
            details="Market leader in decorative coatings; crude oil derivatives form 50%+ of raw material expenses."
        ),
        GraphNode(
            id="TATAMOTORS.NS",
            name="Tata Motors",
            type="Company",
            group="Automotive",
            val=17.0,
            ticker="TATAMOTORS.NS",
            sector="Consumer Discretionary",
            market_cap="₹3.6L Cr ($43B)",
            country="India",
            details="Commercial vehicles & Jaguar Land Rover luxury division; sensitive to steel, aluminum, and EV chip availability."
        ),
    ]

def get_initial_seed_links() -> List[GraphLink]:
    return [
        # Semiconductor precision supply chain
        GraphLink(
            source="ASML",
            target="TSM",
            type="CAPITAL_EQUIPMENT",
            weight=0.96,
            confidence=0.98,
            explanation="ASML is the exclusive global monopoly supplier of High-NA and EUV scanners required for TSMC sub-3nm nodes.",
            sentiment=-1
        ),
        GraphLink(
            source="TSM",
            target="AAPL",
            type="SOLE_SUPPLIER",
            weight=0.92,
            confidence=0.99,
            explanation="TSMC manufactures 100% of Apple's proprietary Silicon (A18 Bionic and M4 architectures).",
            sentiment=-1
        ),
        GraphLink(
            source="TSM",
            target="NVDA",
            type="FOUNDRY_PARTNER",
            weight=0.88,
            confidence=0.96,
            explanation="TSMC CoWoS advanced packaging and 4N foundries fabricate Hopper and Blackwell AI GPUs.",
            sentiment=-1
        ),
        GraphLink(
            source="TSM",
            target="AMD",
            type="FOUNDRY_PARTNER",
            weight=0.82,
            confidence=0.95,
            explanation="AMD relies on TSMC for all Zen-architecture CPUs and Instinct MI300 series AI accelerators.",
            sentiment=-1
        ),
        GraphLink(
            source="AAPL",
            target="FOXCONN",
            type="ASSEMBLY_OUTSOURCING",
            weight=0.85,
            confidence=0.94,
            explanation="Foxconn Zhengzhou and India campuses assemble ~70% of global finished iPhone hardware.",
            sentiment=-1
        ),
        GraphLink(
            source="NVDA",
            target="MSFT",
            type="AI_COMPUTE_INPUT",
            weight=0.78,
            confidence=0.91,
            explanation="Microsoft Azure is NVIDIA's largest hyperscaler cloud customer deploying hundreds of thousands of GPUs.",
            sentiment=-1
        ),
        GraphLink(
            source="NVDA",
            target="XLK",
            type="INDEX_HEAVYWEIGHT",
            weight=0.72,
            confidence=1.0,
            explanation="NVIDIA commands over 18% direct weighting in the Technology Select Sector ETF (XLK).",
            sentiment=1
        ),
        GraphLink(
            source="AAPL",
            target="XLK",
            type="INDEX_HEAVYWEIGHT",
            weight=0.75,
            confidence=1.0,
            explanation="Apple accounts for over 15% direct weighting in XLK.",
            sentiment=1
        ),

        # Energy & Oil cascades
        GraphLink(
            source="CL=F",
            target="BZ=F",
            type="PRICE_ARBITRAGE",
            weight=0.94,
            confidence=0.98,
            explanation="WTI and Brent crude trade with high historical Pearson correlation (r > 0.92) across physical hubs.",
            sentiment=1
        ),
        GraphLink(
            source="CL=F",
            target="XLE",
            type="REVENUE_DRIVER",
            weight=0.89,
            confidence=0.95,
            explanation="Crude price appreciation directly expands cash flows and upstream E&P margins for US energy majors.",
            sentiment=1
        ),
        GraphLink(
            source="CL=F",
            target="DAL",
            type="COST_INFLATION",
            weight=0.78,
            confidence=0.93,
            explanation="Jet fuel derivatives account for 28-32% of airline operating costs; unhedged spikes compress operating margins.",
            sentiment=-1
        ),
        GraphLink(
            source="CL=F",
            target="ASIANPAINT.NS",
            type="RAW_MATERIAL_INPUT",
            weight=0.81,
            confidence=0.94,
            explanation="Petroleum derivatives (monomers, solvents, titanium dioxide dispersants) form ~50% of paint production costs.",
            sentiment=-1
        ),
        GraphLink(
            source="CL=F",
            target="RELIANCE.NS",
            type="REFINING_CRACK_SPREAD",
            weight=0.84,
            confidence=0.90,
            explanation="High crude volatility alters Gross Refining Margins (GRMs) at Reliance's twin Jamnagar mega-refineries.",
            sentiment=1
        ),
        GraphLink(
            source="CL=F",
            target="^TNX",
            type="HEADLINE_INFLATION",
            weight=0.68,
            confidence=0.86,
            explanation="Sustained energy price surges flow directly into CPI readings, elevating long-term bond yield expectations.",
            sentiment=1
        ),

        # Macro interest rate cascades
        GraphLink(
            source="^TNX",
            target="XLF",
            type="NET_INTEREST_MARGIN",
            weight=0.74,
            confidence=0.88,
            explanation="Higher bond yields initially expand bank lending net interest margins before credit contraction risk mounts.",
            sentiment=1
        ),
        GraphLink(
            source="^TNX",
            target="XLK",
            type="DCF_VALUATION_COMPRESSION",
            weight=0.69,
            confidence=0.89,
            explanation="Elevated risk-free discount rates mathematically discount distant corporate tech terminal earnings.",
            sentiment=-1
        ),
        GraphLink(
            source="^TNX",
            target="GC=F",
            type="OPPORTUNITY_COST",
            weight=0.65,
            confidence=0.87,
            explanation="Rising real yields increase the opportunity cost of holding non-yielding physical gold.",
            sentiment=-1
        ),
        GraphLink(
            source="^TNX",
            target="DXY",
            type="YIELD_DIFFERENTIAL",
            weight=0.72,
            confidence=0.89,
            explanation="Widening US bond yield premiums attract global capital flight, strengthening the USD index.",
            sentiment=1
        ),

        # Financials and Geopolitics
        GraphLink(
            source="JPM",
            target="XLF",
            type="INDEX_PILLAR",
            weight=0.82,
            confidence=1.0,
            explanation="JPMorgan Chase is the flagship holding of the US financial banking sector.",
            sentiment=1
        ),
        GraphLink(
            source="^VIX",
            target="GC=F",
            type="SAFE_HAVEN_FLIGHT",
            weight=0.76,
            confidence=0.90,
            explanation="Market turmoil and equity drawdown panics prompt institutional liquidity rotations into gold.",
            sentiment=1
        ),
        GraphLink(
            source="LMT",
            target="XLI",
            type="DEFENSE_WEIGHT",
            weight=0.62,
            confidence=0.96,
            explanation="Lockheed Martin represents a core defense weighting inside the Industrial Select SPDR.",
            sentiment=1
        ),

        # India Market linkages
        GraphLink(
            source="RELIANCE.NS",
            target="HDFCBANK.NS",
            type="MARKET_BREADTH_CORRELATION",
            weight=0.58,
            confidence=0.82,
            explanation="Reliance and HDFC Bank jointly constitute over 20% of the entire Nifty 50 benchmark index.",
            sentiment=1
        ),
        GraphLink(
            source="XLK",
            target="TCS.NS",
            type="GLOBAL_TECH_CAPEX",
            weight=0.73,
            confidence=0.87,
            explanation="US enterprise technology spending cuts directly translate into deal-signing delays for Indian IT majors.",
            sentiment=1
        ),
        GraphLink(
            source="XLK",
            target="INFY.NS",
            type="GLOBAL_TECH_CAPEX",
            weight=0.75,
            confidence=0.88,
            explanation="Infosys generates over 60% of revenues from North American banking and tech discretionary contracts.",
            sentiment=1
        ),
        GraphLink(
            source="DXY",
            target="TCS.NS",
            type="FX_TRANSLATION_GAIN",
            weight=0.62,
            confidence=0.85,
            explanation="A stronger USD against the INR improves operating rupee realization margins for Indian software exporters.",
            sentiment=1
        ),
        GraphLink(
            source="HG=F",
            target="TATAMOTORS.NS",
            type="EV_INPUT_COST",
            weight=0.64,
            confidence=0.86,
            explanation="Industrial copper and battery minerals dictate cost-of-goods for commercial vehicles and EV architectures.",
            sentiment=-1
        ),
        GraphLink(
            source="ZW=F",
            target="XLP",
            type="STAPLES_INPUT_COST",
            weight=0.71,
            confidence=0.91,
            explanation="Global grain price spikes compress gross margins across packaged foods and consumer staples conglomerates.",
            sentiment=-1
        )
    ]

def build_seed_graph() -> Tuple[nx.DiGraph, GraphData]:
    """Constructs and returns both the NetworkX graph and serialized GraphData."""
    G = nx.DiGraph()
    nodes = get_initial_seed_nodes()
    links = get_initial_seed_links()

    for node in nodes:
        G.add_node(
            node.id,
            name=node.name,
            type=node.type,
            group=node.group,
            val=node.val,
            risk_score=node.risk_score,
            sentiment=node.sentiment,
            ticker=node.ticker,
            sector=node.sector,
            market_cap=node.market_cap,
            country=node.country,
            details=node.details
        )

    for link in links:
        G.add_edge(
            link.source,
            link.target,
            type=link.type,
            weight=link.weight,
            confidence=link.confidence,
            explanation=link.explanation,
            sentiment=link.sentiment
        )

    graph_data = GraphData(
        nodes=nodes,
        links=links,
        total_nodes=len(nodes),
        total_links=len(links),
        metadata={"version": "1.0.0", "coverage": "Global & Indian Interconnected Ecosystem"}
    )
    return G, graph_data
