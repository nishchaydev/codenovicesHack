# 📊 Financial Data Bible — Complete Reference

> **What this file is:** Every commodity, sector, index, stock exchange, heavyweight, and historical event we need to know.  
> **Why it exists:** If you don't understand the financial world we're mapping, you can't build the tool.

---

## Table of Contents

1. [Understanding the PS — Line by Line](#1-understanding-the-ps--line-by-line)
2. [Global Stock Exchanges](#2-global-stock-exchanges)
3. [Global Market Indices](#3-global-market-indices)
4. [The Magnificent 7 + Global Giants](#4-the-magnificent-7--global-giants)
5. [Indian Market — Complete Breakdown](#5-indian-market--complete-breakdown)
6. [All 11 GICS Sectors — Deep Dive](#6-all-11-gics-sectors--deep-dive)
7. [Commodities — Complete Guide](#7-commodities--complete-guide)
8. [Economic Indicators That Move Markets](#8-economic-indicators-that-move-markets)
9. [Historical Events That Caused Cascades](#9-historical-events-that-caused-cascades)
10. [News Platforms & Data Sources](#10-news-platforms--data-sources)
11. [Cross-Market Connections](#11-cross-market-connections)

---

## 1. Understanding the PS — Line by Line

Let's break down EVERY line of the problem statement so there's zero confusion.

### THE PROBLEM

> *"Financial events rarely affect a single company."*

**What this means:** When TSMC has a factory fire, it doesn't just hurt TSMC. Apple can't get chips. NVIDIA can't get chips. Samsung gains market share. Semiconductor ETF drops. Insurance companies pay out claims.

> *"A geopolitical event, commodity shock, interest-rate decision, or regulatory change can propagate through sectors and financial instruments."*

**The 4 event types they specifically mention:**

| Event Type | Example | How It Propagates |
|-----------|---------|-------------------|
| **Geopolitical** | Russia invades Ukraine | Oil/gas supply → energy prices → inflation → rates → housing |
| **Commodity shock** | Oil rises 12% | Energy → transport → consumer goods → inflation |
| **Interest-rate decision** | Fed hikes 0.25% | Bonds → banks → mortgages → housing → construction |
| **Regulatory change** | EU bans combustion engines by 2035 | Auto sector → EV makers → battery metals → mining |

> *"Many systems show news as isolated stories rather than connected chains of impact."*

**This is the gap we fill.** Bloomberg shows "Oil up 12%" and "Airlines down 5%" as separate headlines. We draw the line between them.

### EXPECTED CAPABILITIES (What We Must Build)

| Capability | What It Means Practically | How We Build It |
|-----------|--------------------------|----------------|
| Detect financial events from unstructured information | Read a news article, identify that something happened | LLM reads text → classifies event type + severity |
| Extract companies, **commodities, sectors**, indicators, instruments | Pull out every entity mentioned | LLM extracts entities with types + tickers |
| Identify and **score** relationships between entities | Not just "connected" but "how strongly" | Edge weight (0-1) + confidence score |
| Construct and update a **knowledge graph** | Build a graph that grows over time | NetworkX graph, add nodes/edges per event |
| Estimate **plausible propagation paths** | Show the chain reaction | BFS Decay algorithm |
| Incorporate **time-series data** where available | Overlay real stock prices | yfinance historical data |
| **Explain** each impact chain and the evidence behind it | Plain English on every connection | LLM generates 1-sentence explanation per edge |

### TECHNICAL CHALLENGE (What Makes It Hard)

> *"Distinguish observed facts from inferred relationships, and communicate uncertainty rather than presenting predictions as guarantees."*

**THIS IS THE MOST IMPORTANT LINE.** It means:

- ✅ "TSMC supplies Apple's chips" = **observed fact** (from SEC filings) → **solid line, high confidence**
- ⚠️ "If TSMC goes down, Best Buy might lose revenue" = **inferred relationship** → **dashed line, lower confidence**
- ❌ "Best Buy stock WILL drop 15%" = **prediction/guarantee** → **WE MUST NEVER DO THIS**

### DEMO EXPECTATION

> *"Introduce a financial news event and show the system extracting entities, building a connected graph, tracing multiple propagation paths, identifying potentially affected assets, and explaining why each connection exists."*

**The demo flow is literally spelled out:**

```
1. Input a news event (text box)
2. Show entities being extracted (loading animation)
3. Graph appears with nodes and edges
4. Ripple animation shows propagation paths
5. Click any edge → read the explanation
```

---

## 2. Global Stock Exchanges

### Major Exchanges by Market Cap

| # | Exchange | Country | Market Cap (2024) | Currency | Trading Hours (Local) | Key Index |
|---|---------|---------|:-:|---------|------|-----------|
| 1 | **NYSE** (New York Stock Exchange) | USA | ~$28.4T | USD | 9:30-16:00 ET | S&P 500, DJIA |
| 2 | **NASDAQ** | USA | ~$25.5T | USD | 9:30-16:00 ET | Nasdaq 100 |
| 3 | **Euronext** | EU (NL/FR/PT/BE) | ~$7.3T | EUR | 9:00-17:30 CET | CAC 40 |
| 4 | **Shanghai (SSE)** | China | ~$6.7T | CNY | 9:30-15:00 CST | SSE Composite |
| 5 | **Japan Exchange (JPX)** | Japan | ~$6.5T | JPY | 9:00-15:00 JST | Nikkei 225 |
| 6 | **Shenzhen (SZSE)** | China | ~$4.8T | CNY | 9:30-15:00 CST | SZSE Component |
| 7 | **Hong Kong (HKEX)** | Hong Kong | ~$4.2T | HKD | 9:30-16:00 HKT | Hang Seng |
| 8 | **LSE** (London Stock Exchange) | UK | ~$3.4T | GBP | 8:00-16:30 GMT | FTSE 100 |
| 9 | **NSE** (National Stock Exchange) | India | ~$3.3T | INR | 9:15-15:30 IST | Nifty 50 |
| 10 | **BSE** (Bombay Stock Exchange) | India | ~$3.2T | INR | 9:15-15:30 IST | Sensex |
| 11 | **TSX** (Toronto) | Canada | ~$3.1T | CAD | 9:30-16:00 ET | S&P/TSX |
| 12 | **Saudi Exchange (Tadawul)** | Saudi Arabia | ~$2.8T | SAR | 10:00-15:00 AST | TASI |
| 13 | **Deutsche Börse** | Germany | ~$2.3T | EUR | 9:00-17:30 CET | DAX 40 |
| 14 | **SIX Swiss** | Switzerland | ~$2.0T | CHF | 9:00-17:30 CET | SMI |
| 15 | **Korea Exchange (KRX)** | South Korea | ~$1.9T | KRW | 9:00-15:30 KST | KOSPI |

> **Source:** World Federation of Exchanges (WFE) 2024 Market Statistics.

### Why This Matters for Our Tool

When something happens in the US market (after hours), the **Asian markets react the next morning**. When China's PMI drops, **commodity markets worldwide** fall. Our graph needs to show these **cross-exchange connections**.

---

## 3. Global Market Indices

### US Indices (Most Important — Global Leaders)

#### S&P 500 (`SPY`) — The World's Benchmark

**500 largest US companies.** ~80% of US market cap. When people say "the market," they mean this.

**Top 10 Holdings (they make up ~35% of the index!):**

| # | Stock | Ticker | Weight | Sector | Market Cap |
|---|-------|:------:|:------:|--------|:----------:|
| 1 | Apple | AAPL | ~7.1% | Technology | ~$3.4T |
| 2 | Microsoft | MSFT | ~6.8% | Technology | ~$3.1T |
| 3 | NVIDIA | NVDA | ~6.2% | Technology | ~$3.0T |
| 4 | Amazon | AMZN | ~3.6% | Consumer Disc. | ~$1.9T |
| 5 | Alphabet (Google) | GOOGL | ~2.1% | Communication | ~$2.1T |
| 6 | Meta (Facebook) | META | ~2.4% | Communication | ~$1.4T |
| 7 | Berkshire Hathaway | BRK.B | ~1.7% | Financials | ~$0.9T |
| 8 | Tesla | TSLA | ~1.5% | Consumer Disc. | ~$0.8T |
| 9 | Broadcom | AVGO | ~1.5% | Technology | ~$0.8T |
| 10 | JPMorgan Chase | JPM | ~1.3% | Financials | ~$0.6T |

**S&P 500 Sector Breakdown:**

| Sector | Weight | Sector ETF |
|--------|:------:|:----------:|
| Information Technology | ~32% | XLK |
| Financials | ~13% | XLF |
| Health Care | ~12% | XLV |
| Consumer Discretionary | ~10% | XLY |
| Communication Services | ~9% | XLC |
| Industrials | ~9% | XLI |
| Consumer Staples | ~6% | XLP |
| Energy | ~4% | XLE |
| Utilities | ~2% | XLU |
| Real Estate | ~2% | XLRE |
| Materials | ~2% | XLB |

#### Nasdaq 100 (`QQQ`) — Tech-Heavy

**100 largest non-financial Nasdaq stocks.** Tech-dominated.

Top 5: Apple (9%), Microsoft (8%), NVIDIA (7%), Amazon (5%), Meta (5%)

#### Dow Jones (`DIA`) — 30 Blue Chips

30 hand-picked mega-caps. **Price-weighted** (not market-cap weighted), so a $500 stock like UnitedHealth matters more than a $170 stock like Apple.

#### Russell 2000 (`IWM`) — Small Caps

2000 small-cap US stocks. When this drops hard, it signals broad economic fear (small companies are more vulnerable).

### European Indices

| Index | Country | Ticker | # Stocks | Top Stock |
|-------|---------|:------:|:--------:|-----------|
| **FTSE 100** | UK | `^FTSE` | 100 | AstraZeneca, Shell |
| **DAX 40** | Germany | `^GDAXI` | 40 | SAP, Siemens |
| **CAC 40** | France | `^FCHI` | 40 | LVMH, TotalEnergies |
| **Euro Stoxx 50** | Eurozone | `^STOXX50E` | 50 | ASML, LVMH |

### Asian Indices

| Index | Country | Ticker | # Stocks | Top Stock |
|-------|---------|:------:|:--------:|-----------|
| **Nikkei 225** | Japan | `^N225` | 225 | Fast Retailing, Tokyo Electron |
| **Hang Seng** | Hong Kong | `^HSI` | ~80 | Tencent, AIA, HSBC |
| **SSE Composite** | China | `000001.SS` | ~2000 | Kweichow Moutai, ICBC |
| **KOSPI** | South Korea | `^KS11` | ~800 | Samsung Electronics |
| **TAIEX** | Taiwan | `^TWII` | ~900 | TSMC (30%+ weight!) |
| **Nifty 50** | India | `^NSEI` | 50 | Reliance, HDFC Bank |
| **Sensex** | India | `^BSESN` | 30 | Reliance, HDFC Bank |

---

## 4. The Magnificent 7 + Global Giants

### The Magnificent 7 (US Tech Giants)

These 7 stocks make up **~30% of the entire S&P 500**. When they move, the world moves.

| Company | Ticker | Market Cap | What They Control | If They Sneeze, Who Gets a Cold? |
|---------|:------:|:----------:|-------------------|--------------------------------|
| **Apple** | AAPL | ~$3.4T | 56% of US smartphone market, services ecosystem | TSMC (chips), Foxconn (assembly), Qualcomm (modems), app developers |
| **Microsoft** | MSFT | ~$3.1T | 75% of desktop OS, Azure #2 cloud, Office/Teams | Enterprise software, cloud customers, LinkedIn advertisers |
| **NVIDIA** | NVDA | ~$3.0T | 80%+ of AI training GPU market | Every AI company, cloud providers (AWS, Azure, GCP), TSMC (fabs their chips) |
| **Amazon** | AMZN | ~$1.9T | 38% of US e-commerce, AWS #1 cloud (32%) | 3rd-party sellers, logistics industry, cloud customers |
| **Alphabet** | GOOGL | ~$2.1T | 90%+ of search, 70%+ of mobile OS (Android), YouTube | Digital advertisers, app developers, cloud customers |
| **Meta** | META | ~$1.4T | 3.1B daily active users across apps | Digital advertisers, VR/AR ecosystem, news publishers |
| **Tesla** | TSLA | ~$0.8T | ~20% of global EV sales, energy storage | Battery suppliers (Panasonic, CATL), lithium miners, auto industry |

### Other Global Giants That Move Markets

| Company | Ticker | Country | Market Cap | Why They're Systemically Important |
|---------|:------:|:-------:|:----------:|-----------------------------------|
| **TSMC** | TSM | Taiwan | ~$900B | Makes chips for Apple, NVIDIA, AMD, Qualcomm. If TSMC stops, the world stops. |
| **Samsung** | 005930.KS | Korea | ~$400B | Memory chips (40% global market), displays, smartphones |
| **ASML** | ASML | Netherlands | ~$350B | ONLY company making EUV lithography machines. No ASML = no advanced chips |
| **LVMH** | MC.PA | France | ~$380B | Largest luxury conglomerate. Proxy for global consumer wealth |
| **Saudi Aramco** | 2222.SR | Saudi Arabia | ~$1.8T | World's largest oil producer. Sets global oil supply expectations |
| **Reliance Industries** | RELIANCE.NS | India | ~$250B | India's largest company. Refining, telecom (Jio), retail |
| **Tencent** | 0700.HK | China | ~$450B | Dominant in China: gaming, social (WeChat), fintech, cloud |

---

## 5. Indian Market — Complete Breakdown

### NSE/BSE Overview

| Metric | Number |
|--------|--------|
| Total listed companies (BSE) | **5,500+** |
| Total listed companies (NSE) | **2,200+** |
| Market cap (combined) | **~$4.5 trillion** (5th largest globally) |
| Trading hours | **9:15 AM – 3:30 PM IST** |
| Settlement | **T+1** (trade + 1 day) |
| Currency | **INR (₹)** |
| Regulator | **SEBI** |

### Nifty 50 — Top 20 Stocks by Weight

| # | Stock | Ticker (NSE) | Weight | Sector | What Moves It |
|---|-------|:------:|:------:|--------|---------------|
| 1 | **Reliance Industries** | RELIANCE.NS | ~10.2% | Energy/Conglomerate | Oil refining margins, Jio subscribers, retail expansion |
| 2 | **HDFC Bank** | HDFCBANK.NS | ~8.5% | Banking | RBI rates, credit growth, NPA ratios |
| 3 | **ICICI Bank** | ICICIBANK.NS | ~7.2% | Banking | RBI rates, retail loan growth |
| 4 | **Infosys** | INFY.NS | ~5.8% | IT Services | US/EU tech spending, USD/INR rate |
| 5 | **TCS** | TCS.NS | ~4.5% | IT Services | US/EU tech spending, deal wins |
| 6 | **Bharti Airtel** | BHARTIARTL.NS | ~3.8% | Telecom | ARPU, subscriber additions, 5G rollout |
| 7 | **ITC** | ITC.NS | ~3.5% | FMCG/Tobacco | Cigarette volumes, FMCG growth, hotels |
| 8 | **Kotak Mahindra Bank** | KOTAKBANK.NS | ~2.8% | Banking | RBI rates, deposit growth |
| 9 | **LarsenToubro** | LT.NS | ~2.7% | Infra/Construction | Government capex, order book |
| 10 | **HUL** | HINDUNILVR.NS | ~2.5% | FMCG | Rural consumption, monsoon, raw material costs |
| 11 | **SBI** | SBIN.NS | ~2.4% | Banking (PSU) | Government policy, farm loan waivers |
| 12 | **Axis Bank** | AXISBANK.NS | ~2.3% | Banking | Credit growth, asset quality |
| 13 | **Sun Pharma** | SUNPHARMA.NS | ~1.9% | Pharma | FDA approvals, US generics market |
| 14 | **Bajaj Finance** | BAJFINANCE.NS | ~1.8% | NBFC | Consumer lending, interest rates |
| 15 | **Tata Motors** | TATAMOTORS.NS | ~1.7% | Auto | JLR sales, EV transition, commodity costs |
| 16 | **Maruti Suzuki** | MARUTI.NS | ~1.5% | Auto | Domestic car demand, rural income, fuel prices |
| 17 | **M&M** | M&M.NS | ~1.5% | Auto/Tractors | Monsoon (tractors), SUV segment |
| 18 | **Asian Paints** | ASIANPAINT.NS | ~1.3% | Paints/Consumer | Crude oil (raw material), housing demand |
| 19 | **Titan** | TITAN.NS | ~1.2% | Consumer/Jewelry | Gold prices, consumer sentiment, weddings |
| 20 | **NTPC** | NTPC.NS | ~1.1% | Power/Utilities | Electricity demand, coal availability |

### All NSE Sectoral Indices

| Index | # Stocks | Top 3 by Weight | What Moves This Sector |
|-------|:--------:|-----------------|----------------------|
| **Nifty Bank** | 12 | HDFC Bank (28%), ICICI (22%), Kotak (14%) | RBI Repo Rate, credit growth, NPAs, deposit rates |
| **Nifty IT** | 10 | TCS (24%), Infosys (23%), HCL Tech (14%) | US/EU IT spending, USD/INR rate, H-1B visa policy, deal pipeline |
| **Nifty Auto** | 15 | M&M (17%), Maruti (15%), Tata Motors (14%) | Monsoon (rural), fuel prices, interest rates (EMIs), commodity costs |
| **Nifty Energy** | 10 | Reliance (30%), NTPC (16%), Power Grid (12%) | Crude oil prices, government policy, coal availability |
| **Nifty FMCG** | 15 | ITC (23%), HUL (20%), Nestle (8%) | Rural consumption, monsoon, raw material inflation, monsoon |
| **Nifty Pharma** | 20 | Sun Pharma (20%), Dr Reddy's (12%), Cipla (10%) | US FDA approvals, ANDA filings, API prices, USD/INR |
| **Nifty Metal** | 15 | Tata Steel (17%), Hindalco (15%), JSW Steel (14%) | China demand, global steel/aluminum prices, EU carbon taxes |
| **Nifty Realty** | 10 | DLF (21%), Godrej Properties (16%), Oberoi (14%) | Interest rates, urban housing demand, government incentives |
| **Nifty PSE** | 20 | NTPC, SBI, Power Grid, Coal India | Government disinvestment, policy, capex budget |
| **Nifty Infra** | 30 | L&T (19%), NTPC (10%), Power Grid (8%) | Government infrastructure spending, PPP projects |
| **Nifty Financial Services** | 20 | HDFC Bank (21%), ICICI (14%), Bajaj Finance (8%) | RBI policy, credit cycle, insurance penetration |
| **Nifty Media** | 10 | Zee (20%), PVR-Inox (15%), Sun TV (14%) | Ad spending, OTT competition, movie box office |
| **Nifty Commodities** | 30 | Reliance (14%), Tata Steel (8%), ONGC (7%) | Global commodity prices, China demand, INR |
| **Nifty MidCap 100** | 100 | Diverse — broader market indicator | Domestic liquidity, retail investor sentiment |
| **Nifty SmallCap 250** | 250 | Diverse — high risk/reward | Retail flows, market risk appetite |

### India's Market Cap Classification

| Category | Definition (SEBI) | # of Companies | Typical Investor |
|----------|------------------|:-:|---|
| **Large Cap** | Top 100 by market cap | 100 | FIIs, mutual funds, safe |
| **Mid Cap** | Rank 101-250 | 150 | Growth investors |
| **Small Cap** | Rank 251+ | 5000+ | High risk/reward, retail |

---

## 6. All 11 GICS Sectors — Deep Dive

### For Each Sector: What It Is, Who's In It, What Moves It, Who It Affects

#### 1. Information Technology (XLK) — 32% of S&P 500

| Attribute | Details |
|-----------|---------|
| **What it is** | Companies that make/sell technology — software, hardware, semiconductors, IT services |
| **Global giants** | Apple ($3.4T), Microsoft ($3.1T), NVIDIA ($3T), TSMC ($900B), Samsung ($400B) |
| **Indian equivalents** | TCS, Infosys, HCL Tech, Wipro, Tech Mahindra |
| **What moves it** | Interest rates (growth stocks hate rate hikes), AI spending, enterprise IT budgets, chip supply |
| **Connected to** | Communication Services (cloud customers), Industrials (automation), Financials (fintech) |
| **When rates go UP** | DROPS — higher discount rates reduce present value of future earnings |

#### 2. Financials (XLF) — 13% of S&P 500

| Attribute | Details |
|-----------|---------|
| **What it is** | Banks, insurance, asset management, fintech |
| **Global giants** | JPMorgan ($600B), Berkshire ($900B), Visa ($550B), Mastercard ($400B) |
| **Indian equivalents** | HDFC Bank, ICICI Bank, SBI, Kotak, Bajaj Finance |
| **What moves it** | Interest rates (banks earn more on rate hikes — wider NIM), credit quality (NPAs), loan growth |
| **Connected to** | Real Estate (mortgages), Consumer (credit cards, personal loans), Government (regulatory) |
| **When rates go UP** | RISES initially (wider margins), then FALLS if rates cause recession |

#### 3. Health Care (XLV) — 12% of S&P 500

| Attribute | Details |
|-----------|---------|
| **What it is** | Pharma, biotech, medical devices, health insurance, hospitals |
| **Global giants** | UnitedHealth ($500B), Eli Lilly ($800B), J&J ($400B), Novo Nordisk ($500B) |
| **Indian equivalents** | Sun Pharma, Dr Reddy's, Cipla, Divi's Labs, Apollo Hospitals |
| **What moves it** | Drug approvals (FDA), patent expirations, government healthcare policy, aging population |
| **Connected to** | Consumer Staples (defensive), Technology (med-tech, AI diagnostics) |
| **Defensive?** | YES — people need healthcare regardless of economy |

#### 4. Consumer Discretionary (XLY) — 10% of S&P 500

| Attribute | Details |
|-----------|---------|
| **What it is** | Things people buy when they have extra money — cars, luxury, retail, travel, restaurants |
| **Global giants** | Amazon ($1.9T), Tesla ($800B), LVMH ($380B), Toyota ($300B), Nike ($130B) |
| **Indian equivalents** | Tata Motors, Maruti, Titan, Zomato, Trent |
| **What moves it** | Consumer confidence, employment, interest rates (car/home loans), fuel prices |
| **Connected to** | Financials (consumer credit), Energy (fuel costs), Industrials (manufacturing) |
| **When economy slows** | DROPS HARD — first thing people cut is discretionary spending |

#### 5. Communication Services (XLC) — 9% of S&P 500

| Attribute | Details |
|-----------|---------|
| **What it is** | Telecom, media, social platforms, streaming, gaming |
| **Global giants** | Alphabet/Google ($2.1T), Meta ($1.4T), Netflix ($300B), Disney ($200B) |
| **Indian equivalents** | Bharti Airtel, Jio (Reliance), Zee Entertainment, PVR-Inox |
| **What moves it** | Ad spending (tied to GDP), subscriber growth, content costs, spectrum auctions |
| **Connected to** | Technology (cloud, AI), Consumer Discretionary (advertising budgets) |

#### 6. Industrials (XLI) — 9% of S&P 500

| Attribute | Details |
|-----------|---------|
| **What it is** | Aerospace, defense, construction, machinery, logistics, airlines |
| **Global giants** | GE Aerospace ($200B), Caterpillar ($180B), Lockheed Martin ($130B), UPS ($130B) |
| **Indian equivalents** | L&T, HAL, BEL, Siemens India, Adani Ports |
| **What moves it** | Government spending (defense, infrastructure), oil prices (airlines), manufacturing PMI |
| **Connected to** | Energy (fuel costs), Materials (raw inputs), Government policy |

#### 7. Consumer Staples (XLP) — 6% of S&P 500

| Attribute | Details |
|-----------|---------|
| **What it is** | Things people MUST buy — food, drinks, household products, tobacco |
| **Global giants** | Procter & Gamble ($400B), Coca-Cola ($270B), Walmart ($600B), Nestlé ($250B) |
| **Indian equivalents** | HUL, ITC, Nestle India, Dabur, Marico, Britannia |
| **What moves it** | Raw material costs (palm oil, wheat), rural consumption, monsoon (India) |
| **Defensive?** | YES — people buy toothpaste and food regardless of recession |

#### 8. Energy (XLE) — 4% of S&P 500

| Attribute | Details |
|-----------|---------|
| **What it is** | Oil & gas exploration, production, refining, equipment, renewables |
| **Global giants** | Saudi Aramco ($1.8T), ExxonMobil ($500B), Chevron ($300B), Shell ($220B) |
| **Indian equivalents** | Reliance, ONGC, Indian Oil, BPCL, GAIL, Adani Green |
| **What moves it** | Crude oil prices (OPEC decisions, geopolitics), natural gas, energy transition policy |
| **Connected to** | EVERYTHING — energy is an input cost for every other sector |
| **When oil goes UP** | Energy stocks RISE. Airlines, paints, chemicals, FMCG FALL |

#### 9. Utilities (XLU) — 2% of S&P 500

| Attribute | Details |
|-----------|---------|
| **What it is** | Electric, water, gas utilities — regulated monopolies |
| **Global giants** | NextEra ($160B), Duke Energy ($90B), Southern Co ($85B) |
| **Indian equivalents** | NTPC, Power Grid, Tata Power, Adani Power |
| **What moves it** | Interest rates (high-yield stocks compete with bonds), regulation, coal/gas prices |
| **Defensive?** | YES — people pay electric bills in recessions |

#### 10. Real Estate (XLRE) — 2% of S&P 500

| Attribute | Details |
|-----------|---------|
| **What it is** | REITs (Real Estate Investment Trusts), property developers |
| **Global giants** | Prologis ($110B), American Tower ($90B), Equinix ($80B) |
| **Indian equivalents** | DLF, Godrej Properties, Oberoi Realty, Embassy REIT |
| **What moves it** | Interest rates (#1 driver — mortgages), urban migration, WFH trends |
| **When rates go UP** | DROPS HARD — higher mortgage rates kill housing demand |

#### 11. Materials (XLB) — 2% of S&P 500

| Attribute | Details |
|-----------|---------|
| **What it is** | Chemicals, metals, mining, paper, packaging, construction materials |
| **Global giants** | Linde ($200B), BHP ($170B), Rio Tinto ($110B), Freeport-McMoRan ($70B) |
| **Indian equivalents** | Tata Steel, Hindalco, JSW Steel, UPL, Pidilite, Asian Paints |
| **What moves it** | China demand (#1), commodity prices, infrastructure spending, construction activity |
| **Connected to** | Industrials, Construction, Real Estate, Energy (fuel for smelting) |

---

## 7. Commodities — Complete Guide

### Energy Commodities

| Commodity | Ticker | Exchange | Price Range | Major Producers | Major Consumers |
|-----------|:------:|:--------:|:-----------:|----------------|----------------|
| **WTI Crude Oil** | `CL=F` | NYMEX | $70-90/bbl | USA, Saudi, Russia | USA, China, India |
| **Brent Crude Oil** | `BZ=F` | ICE | $75-95/bbl | North Sea, Middle East | Global benchmark |
| **Natural Gas** | `NG=F` | NYMEX | $2-3.50/MMBtu | USA, Russia, Iran | USA, EU, China |
| **Heating Oil** | `HO=F` | NYMEX | $2.20-2.80/gal | Refineries | US Northeast, EU |
| **Gasoline (RBOB)** | `RB=F` | NYMEX | $2.00-2.80/gal | Refineries | US drivers |

**When Oil Goes UP — Complete Impact Chain:**
```
Oil ↑ → ExxonMobil, Chevron, ONGC ↑ (produce oil)
     → Airlines (DAL, UAL, IndiGo) ↓ (jet fuel = 30% costs)
     → Paints (Asian Paints, Sherwin-Williams) ↓ (crude derivatives)
     → Tires (MRF, Apollo, Michelin) ↓ (rubber + petroleum)
     → FMCG (HUL, P&G) ↓ (packaging + logistics costs)
     → Inflation ↑ → Central banks raise rates
     → Banks ↑ (wider margins) → Housing ↓ (expensive mortgages)
```

### Precious Metals

| Commodity | Ticker | Exchange | Price Range | What Drives It |
|-----------|:------:|:--------:|:-----------:|---------------|
| **Gold** | `GC=F` | COMEX | $2300-2600/oz | Real interest rates, USD, safe-haven demand, central bank buying |
| **Silver** | `SI=F` | COMEX | $25-32/oz | Gold correlation + industrial (solar panels, electronics) |
| **Platinum** | `PL=F` | NYMEX | $900-1050/oz | Auto catalytic converters, fuel cells |
| **Palladium** | `PA=F` | NYMEX | $900-1100/oz | Auto catalytic converters (gasoline engines) |

**Gold Goes UP When:**
- Interest rates fall (gold doesn't pay yield, so low rates = low opportunity cost)
- USD weakens (gold priced in dollars)
- Geopolitical fear (wars, pandemics — safe haven)
- Inflation fears (store of value)

**Beneficiaries:** Newmont, Barrick Gold, Muthoot Finance, Manappuram Finance  
**Hurt:** Jewelry retailers (Titan) — volume drops due to high prices

### Industrial Metals

| Commodity | Ticker | Exchange | Price Range | What Drives It |
|-----------|:------:|:--------:|:-----------:|---------------|
| **Copper** | `HG=F` | COMEX | $3.80-4.50/lb | "Dr. Copper" — proxy for global economic health. EV demand, construction |
| **Aluminum** | `ALI=F` | COMEX | $2200-2600/ton | Energy costs (smelting), construction, packaging |
| **Iron Ore** | `TIO=F` | SGX | $100-130/ton | China steel demand, infrastructure |
| **Nickel** | — | LME | $16K-20K/ton | EV batteries, stainless steel |
| **Lithium** | — | OTC | Varies | EV batteries. Chile, Australia, China dominate |

**Copper Goes UP When:**
- Global manufacturing PMI > 50 (expansion)
- EV production ramps (EVs use 4x more copper than ICE cars)
- Infrastructure spending increases

**Beneficiaries:** Freeport-McMoRan, BHP, Hindustan Copper, Vedanta  
**Hurt:** Automakers (Tata Motors, Ford), electronics (Havells, Voltas), construction (L&T)

### Agricultural Commodities

| Commodity | Ticker | Exchange | What Drives It |
|-----------|:------:|:--------:|---------------|
| **Wheat** | `ZW=F` | CBOT | Weather, Black Sea geopolitics, fertilizer costs |
| **Corn** | `ZC=F` | CBOT | Weather, ethanol mandates, livestock feed demand |
| **Soybeans** | `ZS=F` | CBOT | China demand, weather in Brazil/US, biodiesel |
| **Coffee** | `KC=F` | ICE | Brazilian frosts, Vietnamese harvests, demand |
| **Cocoa** | `CC=F` | ICE | West African rain, disease, demand |
| **Sugar** | `SB=F` | ICE | Brazil production (ethanol diversion), India export bans |
| **Cotton** | `CT=F` | ICE | Monsoon (India), China textile demand |
| **Rice** | `ZR=F` | CBOT | India/Thailand export policy, monsoon |

**Wheat Goes UP — Impact Chain:**
```
Wheat ↑ → Bread/flour prices ↑ → Food processors (Britannia, Nestle) margins ↓
       → Livestock feed costs ↑ → Poultry (Venky's) margins ↓
       → Fertilizer demand ↑ → UPL, Coromandel ↑
       → Farm equipment demand ↑ → Deere, M&M tractors ↑
       → Global food inflation → Social unrest in importing nations
```

### Cross-Commodity Correlations

| Pair | Correlation | Why |
|------|:----------:|-----|
| Oil ↔ Natural Gas | **Positive** | Both energy, often co-produced |
| Gold ↔ Silver | **Strong Positive** | Both monetary metals |
| Oil ↔ Agriculture | **Positive** | Farming needs diesel + natural gas makes fertilizer |
| Corn ↔ Soybeans | **Positive** | Compete for same farmland acreage |
| All Commodities ↔ USD | **Inverse** | Commodities priced in USD; strong dollar = expensive for world |
| Copper ↔ Global GDP | **Strong Positive** | "Dr. Copper" — used in everything manufactured |
| Gold ↔ Interest Rates | **Inverse** | Low rates = gold attractive (no yield competition) |

### India's Commodity Dependencies

| Commodity | India Imports or Exports? | % Imported | Key Indian Stocks Affected |
|-----------|:------------------------:|:----------:|---------------------------|
| **Crude Oil** | IMPORTS 85%+ | 85% | ONGC ↑, IOC/BPCL/HPCL margins squeezed, Asian Paints ↓ |
| **Gold** | IMPORTS (2nd largest buyer) | 100% | Titan ↓ (volume), Muthoot ↑ (collateral value) |
| **Coal** | IMPORTS ~30% | 30% | Coal India ↑, NTPC costs ↑, power tariffs ↑ |
| **Edible Oil (Palm/Soy)** | IMPORTS 60%+ | 60% | HUL, Adani Wilmar margins squeezed |
| **Wheat** | EXPORTS (usually) | — | Britannia, ITC Foods |
| **Rice** | EXPORTS (#1 globally) | — | KRBL, government policy risk |
| **Cotton** | EXPORTS | — | Textile companies benefit |
| **Iron Ore** | Domestic + Exports | — | Tata Steel, JSW Steel, NMDC |

---

## 8. Economic Indicators That Move Markets

These are the numbers that, when released, cause instant market reactions.

| Indicator | Frequency | Who Releases It | What It Measures | Market Reaction When Higher Than Expected |
|-----------|:---------:|:---------------:|-----------------|------------------------------------------|
| **US CPI (Inflation)** | Monthly | Bureau of Labor Statistics | Consumer price changes | Stocks ↓, Bond yields ↑ (fear of rate hikes) |
| **US Non-Farm Payrolls (NFP)** | Monthly | BLS | Jobs added | Mixed: strong economy but rate hike fear |
| **Federal Funds Rate** | 8x/year | US Federal Reserve (FOMC) | Borrowing cost benchmark | Rate hike = Stocks ↓, USD ↑, Gold ↓, EM ↓ |
| **US GDP** | Quarterly | BEA | Economic output | Below expectations = recession fear |
| **US PMI** | Monthly | ISM / S&P Global | Manufacturing health (>50 = expanding) | Below 50 = Commodities ↓, Industrials ↓ |
| **China PMI** | Monthly | NBS / Caixin | China manufacturing | Below 50 = Metals ↓, Mining ↓, EM ↓ |
| **RBI Repo Rate** | 6x/year | Reserve Bank of India | India's borrowing cost | Hike = Bank Nifty volatile, Realty ↓, Auto ↓ |
| **India CPI** | Monthly | CSO | India inflation | High = RBI rate hike fear |
| **India GDP** | Quarterly | CSO | India economic output | Key for FII flows and market sentiment |
| **US 10Y Treasury Yield** | Continuous | Market | Risk-free rate benchmark | Rising = Tech ↓, Banks ↑, Housing ↓, EM outflows |
| **VIX (Fear Index)** | Continuous | CBOE | Expected S&P 500 volatility | VIX > 30 = high fear, Gold ↑, Stocks volatile |
| **US Dollar Index (DXY)** | Continuous | ICE | USD vs basket of 6 currencies | DXY ↑ = EM ↓, Commodities ↓, US exporters ↓ |

### FRED API Codes (For Our Tool)

| Indicator | FRED Series ID | Use in Our Tool |
|-----------|:-------------:|----------------|
| Federal Funds Rate | `FEDFUNDS` | Interest rate node |
| US CPI | `CPIAUCSL` | Inflation indicator node |
| 10Y Treasury Yield | `DGS10` | Rate proxy |
| US GDP | `GDP` | Economic health |
| Unemployment Rate | `UNRATE` | Labor market |
| M2 Money Supply | `M2SL` | Liquidity indicator |

---

## 9. Historical Events That Caused Cascades

These are **proven** chain reactions. Every number is verifiable. These become our demo scenarios.

### Event 1: Russia-Ukraine Invasion (Feb 24, 2022)

| Step | What Happened | Data |
|------|-------------|------|
| 1 | Russia invades Ukraine | Geopolitical event |
| 2 | Oil supply fears (Russia = #3 producer) | Brent: $94 → $128/bbl (+36%) |
| 3 | Gas supply to Europe threatened | EU TTF gas: €80 → €340/MWh (+325%) |
| 4 | Wheat supply blocked (Ukraine = 10% of global) | Wheat: $7.50 → $12.94/bu (+73%) |
| 5 | Fertilizer exports cut (Russia = 15% of nitrogen) | Fertilizer Index: 700 → 1,270 (+81%) |
| 6 | Global food prices spike | 27.2M more people into poverty |
| 7 | Defense spending surges worldwide | LMT: +18.7% in 1 month |
| 8 | Energy stocks surge | XLE: +15.1% in 1 month |
| 9 | Broad market falls on uncertainty | SPY: -3.1% in 1 month |

### Event 2: SVB Bank Collapse (March 10, 2023)

| Step | What Happened | Data |
|------|-------------|------|
| 1 | Fed hikes rates aggressively (2022-23) | Fed Funds: 0% → 5.25% |
| 2 | SVB's $91B bond portfolio loses value | Mark-to-market losses |
| 3 | Depositors panic and withdraw | $42B withdrawn in ONE DAY |
| 4 | SVB fails (March 10) | 2nd largest US bank failure ever |
| 5 | Contagion: Signature Bank fails (March 12) | Bank run |
| 6 | First Republic fails (May 1) | Another domino |
| 7 | Regional bank ETF crashes | KRE: -40% (Feb-May 2023) |
| 8 | Fed guarantees all deposits | Emergency intervention |
| 9 | Market expects rate CUTS → Tech rallies | QQQ: +20% over next 3 months |

### Event 3: COVID-19 Crash (March 2020)

| Step | What Happened | Data |
|------|-------------|------|
| 1 | COVID-19 declared pandemic (March 11, 2020) | WHO declaration |
| 2 | Global lockdowns begin | Factory shutdowns, travel bans |
| 3 | S&P 500 crashes 34% in 23 trading days | Fastest bear market in history |
| 4 | VIX hits 82.69 (March 16) | Highest fear level since 2008 |
| 5 | Oil crashes — WTI goes NEGATIVE (-$37.63) | April 20, 2020. First time ever |
| 6 | Fed cuts rates to 0% + unlimited QE | March 15, 2020 |
| 7 | Stay-at-home stocks explode | Zoom: +400%, Amazon: +70% |
| 8 | Chip shortage from factory shutdowns | Auto production: -16% in 2020 |
| 9 | Used car prices spike | Manheim Index: +69% by Jan 2022 |
| 10 | Inflation forces rate hikes in 2022 | CPI hits 9.1% — highest since 1981 |

### Event 4: 2008 Financial Crisis

| Step | What Happened | Data |
|------|-------------|------|
| 1 | US housing bubble built on subprime mortgages | Loose lending standards |
| 2 | Mortgage defaults spike | Subprime delinquency: 5% → 25% |
| 3 | Mortgage-Backed Securities (MBS) collapse | Rating agencies: AAA → junk overnight |
| 4 | Bear Stearns fails (March 2008) | Bought by JPMorgan for $2/share |
| 5 | Lehman Brothers fails (Sept 15, 2008) | $639B in assets — largest bankruptcy ever |
| 6 | Interbank lending freezes globally | LIBOR-OIS spread explodes |
| 7 | Stock markets crash worldwide | S&P 500: -57% peak to trough |
| 8 | US GDP contracts 4.3% | Worst since Great Depression |
| 9 | 8.7M US jobs lost | Unemployment: 4.7% → 10% |
| 10 | Fed slashes rates to 0% + QE1 | $1.75T in asset purchases |

### Event 5: China Evergrande Crisis (2021-2023)

| Step | What Happened | Data |
|------|-------------|------|
| 1 | Evergrande over-leveraged ($300B+ liabilities) | World's most indebted developer |
| 2 | "Three Red Lines" policy restricts developer borrowing | Chinese government regulation |
| 3 | Evergrande misses bond payments | First default: Dec 2021 |
| 4 | Upstream suppliers (cement, paint, steel) crushed | Unpaid bills cascade through supply chain |
| 5 | Land sale revenues collapse (40% of local gov budgets) | Local government fiscal crisis |
| 6 | Chinese property sector contracts ~25% | Home sales volume crash |
| 7 | Iron ore prices fall (less steel needed) | Iron ore: $220 → $100/ton |
| 8 | Australia/Brazil mining stocks hit | BHP, Rio Tinto, Vale drop |

---

## 10. News Platforms & Data Sources

### Where Financial Events First Break

| Platform | Type | Coverage | Speed | Free? | URL |
|----------|------|---------|:-----:|:-----:|-----|
| **Bloomberg Terminal** | Professional | Everything | Fastest | No ($24K/yr) | bloomberg.com |
| **Reuters** | News Wire | Global finance + politics | Very fast | Partial | reuters.com |
| **CNBC** | TV + Web | US markets, breaking news | Fast | Yes | cnbc.com |
| **Financial Times** | Newspaper | Global markets, analysis | Fast | Paywall | ft.com |
| **Wall Street Journal** | Newspaper | US business + markets | Fast | Paywall | wsj.com |
| **Economic Times** | Newspaper | Indian markets | Fast | Yes | economictimes.com |
| **MoneyControl** | Web Portal | Indian markets, live data | Fast | Yes | moneycontrol.com |
| **LiveMint** | Web | Indian business news | Fast | Partial | livemint.com |
| **Yahoo Finance** | Web Portal | Global stocks, free data | Medium | Yes | finance.yahoo.com |
| **Google News** | Aggregator | Everything | Medium | Yes | news.google.com |
| **Twitter/X** | Social | Breaking news, rumors | Fastest (unverified) | Yes | x.com |

### Free APIs We Use for News Ingestion

| API | What It Gives | Rate Limit | Cost |
|-----|-------------|:----------:|:----:|
| **Google News RSS** | Headlines by topic/query | Unlimited | Free |
| **Yahoo Finance RSS** | Market news feed | Unlimited | Free |
| **NewsAPI.org** | Structured news search | 100 req/day | Free tier |
| **GDELT Project** | Global event database | Unlimited | Free |
| **Finnhub** | Financial news + sentiment | 60 req/min | Free tier |

### Free APIs We Use for Market Data

| API | What It Gives | Rate Limit | Key? |
|-----|-------------|:----------:|:----:|
| **yfinance** (Python) | Stock prices, ETFs, futures, company info | ~2000/hr | No |
| **FRED** (Federal Reserve) | US economic indicators | 120/min | Free key |
| **Alpha Vantage** | FX, crypto, fundamentals | 25/day | Free key |
| **CoinGecko** | Crypto prices | 30/min | No |
| **World Bank API** | Global macro data | Generous | No |
| **OpenFIGI** | Map company names to tickers | 20/min | No |

---

## 11. Cross-Market Connections

### How Markets Influence Each Other

```
US Market closes at 4 PM ET (1:30 AM IST)
  → US futures trade overnight
    → Asian markets open and react (Japan 5:30 AM IST, India 9:15 AM IST)
      → European markets open and react (1:30 PM IST)
        → US market opens again, reacting to global developments
```

### Key Cross-Market Chains

| Trigger | → First Reaction | → Second Reaction | → Third Reaction |
|---------|-----------------|-------------------|-----------------|
| US Fed rate hike | USD ↑, US bonds ↑ | EM currencies ↓, FII outflows from India | Indian stocks ↓, RBI forced to follow |
| China PMI < 50 | Iron ore ↓, copper ↓ | Australian mining ↓, Tata Steel ↓ | Global growth fears → Safe haven (Gold, USD, Bonds) ↑ |
| Oil spikes | Middle East stocks ↑ | Indian OMCs ↓, Airlines ↓ | Global inflation fears → Central banks tighten |
| US tech earnings beat | Nasdaq ↑ | India IT (TCS, Infosys) ↑ next morning | Tech spending optimism → Semiconductor stocks ↑ |
| Japan rate change | Yen ↑/↓ | Carry trade unwinds globally | EM volatility spikes, global bond repricing |
| India monsoon failure | Agri stocks volatile | Rural FMCG ↓, Auto ↓ | Food inflation → RBI rate hike → Banking volatile |

### The Correlation Matrix (Simplified)

| | US Stocks | EU Stocks | India Stocks | China Stocks | Gold | Oil | USD |
|-|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **US Stocks** | 1.0 | 0.85 | 0.60 | 0.30 | -0.20 | 0.15 | -0.30 |
| **EU Stocks** | 0.85 | 1.0 | 0.55 | 0.35 | -0.15 | 0.20 | -0.40 |
| **India Stocks** | 0.60 | 0.55 | 1.0 | 0.25 | -0.10 | -0.30 | -0.50 |
| **Gold** | -0.20 | -0.15 | -0.10 | 0.05 | 1.0 | 0.10 | -0.60 |
| **Oil** | 0.15 | 0.20 | -0.30 | 0.20 | 0.10 | 1.0 | -0.50 |
| **USD** | -0.30 | -0.40 | -0.50 | -0.25 | -0.60 | -0.50 | 1.0 |

*Approximate Pearson correlations. Actual values shift based on market regime (crisis vs calm).*

---

> **This file is our team's financial knowledge base. Before building any feature, check if the financial logic makes sense against this reference.**

---

*Compiled October 10, 2026 by Team codenovicesHack*
