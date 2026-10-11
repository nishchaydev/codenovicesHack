import type { EventDataset } from '../types/graph'

export const mockEvents: EventDataset[] = [
  // ==========================================
  // Dataset 1: Indian Market Shock
  // ==========================================
  {
    id: 'sugar-ethanol-policy-2024',
    title: 'Government hikes Ethanol Blending Target to 20% & tightens Sugar Export Quotas',
    market: 'india',
    category: 'Agriculture & Energy',
    summary:
      'The Ministry of Consumer Affairs, Food & Public Distribution combined with MoPNG accelerated the E20 ethanol mandate while imposing strict sugar export quotas to preserve domestic price stability and cushion foreign exchange outflows.',
    rootNodeId: 'root-1',
    nodes: [
      // Left: Backward Causes (Observed Facts)
      {
        id: 'bc-1',
        label: 'Crude Import Bill Surges 14% YoY',
        description:
          'Elevated international crude benchmarks widened India’s current account deficit and drained foreign exchange reserves.',
        nodeType: 'backward_cause',
        entityType: 'Macro Indicator',
        truthStatus: 'observed_fact',
        confidenceScore: 96,
        impactDirection: 'negative',
        estimatedMagnitude: '+$18.2B Deficit',
        tickerSymbol: 'INR=X',
        transmissionLogic:
          'Higher hydrocarbon import bill forced inter-ministerial policy intervention to substitute imported gasoline with domestically refined agro-biofuels.',
        evidence: [
          {
            sourceName: 'Economic Times',
            headline: 'India petroleum import bill surges 14.2% YoY amidst West Asia volatility',
            url: 'https://economictimes.indiatimes.com/industry/energy/oil-gas/india-oil-import-bill',
            publishedAt: '2024-08-14',
          },
          {
            sourceName: 'Ministry of Commerce & Industry',
            headline: 'Trade deficit and foreign trade statistics release: Mineral fuels import expansion',
            url: 'https://commerce.gov.in/trade-statistics/',
            publishedAt: '2024-08-16',
          },
        ],
        historicalPrecedent: 'Correlated with the 2018 National Policy on Biofuels rollout (r=0.82)',
      },
      {
        id: 'bc-2',
        label: 'Domestic Cane Crushing Yield Stagnates',
        description:
          'Erratic monsoon distribution across Maharashtra and North Karnataka triggered domestic cane availability concerns.',
        nodeType: 'backward_cause',
        entityType: 'Commodity',
        truthStatus: 'observed_fact',
        confidenceScore: 92,
        impactDirection: 'neutral',
        estimatedMagnitude: '-3.1% Harvest Yield',
        tickerSymbol: 'SUGAR.MCX',
        transmissionLogic:
          'Anticipation of tightened sugar stocks prompted the Directorate of Sugar to constrain commercial exports to avoid domestic retail food inflation.',
        evidence: [
          {
            sourceName: 'Mint',
            headline: 'Uneven southwest monsoon dents sugarcane yield projections in key peninsular belts',
            url: 'https://livemint.com/industry/agriculture/sugarcane-crop-yield-projections',
            publishedAt: '2024-09-02',
          },
          {
            sourceName: 'Indian Sugar Mills Association (ISMA)',
            headline: 'ISMA second advance estimates: domestic consumption vs cane juice diversion',
            url: 'https://isma.org/sugar-production-statistics',
            publishedAt: '2024-09-10',
          },
        ],
        historicalPrecedent: 'Similar to the 2022-23 Sugar Export Restriction Notification cycle',
      },

      // Center: Root Event
      {
        id: 'root-1',
        label: 'Sugar Export Cap & Ethanol Blending Mandate Enforced',
        description:
          'Government notifies stringent zero-export sugar quota allocations while mandating 20% ethanol blending target with incentive procurement tariffs.',
        nodeType: 'root_event',
        entityType: 'Regulatory Policy',
        truthStatus: 'observed_fact',
        confidenceScore: 100,
        impactDirection: 'positive',
        estimatedMagnitude: 'E20 Mandate Enacted',
        transmissionLogic:
          'Regulatory pivot simultaneously caps overseas inventory outflows and creates guaranteed, inflation-indexed offtake for sugar mills converting B-heavy molasses and cane syrup to ethanol.',
        evidence: [
          {
            sourceName: 'Press Information Bureau (PIB)',
            headline: 'Cabinet approves higher procurement price for ethanol produced from sugarcane juice & B-heavy molasses',
            url: 'https://pib.gov.in/PressReleasePage.aspx',
            publishedAt: '2024-10-04',
          },
          {
            sourceName: 'Reuters',
            headline: 'India extends sugar export curbs into 2024-25 season to tame festive retail prices',
            url: 'https://reuters.com/markets/commodities/india-sugar-export-restrictions',
            publishedAt: '2024-10-05',
          },
        ],
        historicalPrecedent: 'Direct successor to 2021 Ethanol Blended Petrol (EBP) roadmap acceleration',
      },

      // Right: Forward Impacts
      {
        id: 'fi-1',
        label: 'Sugar & Distilleries Rally on Biofuel Divergence',
        description:
          'Integrated mills with distillery capacity enjoy guaranteed OMC offtake contracts and improved operating margins.',
        nodeType: 'forward_impact',
        entityType: 'Sector',
        truthStatus: 'observed_fact',
        confidenceScore: 94,
        impactDirection: 'positive',
        estimatedMagnitude: '+8.5%',
        tickerSymbol: 'NSE:BALRAMCHIN',
        transmissionLogic:
          'Higher ethanol procurement pricing directly enhances distillery EBITDA margins from ₹52/L to ₹65/L, de-linking cash flows from volatile commodity sugar retail pricing.',
        evidence: [
          {
            sourceName: 'Economic Times',
            headline: 'Balrampur Chini, Praj Industries, Shree Renuka surge up to 9% following ethanol revision',
            url: 'https://economictimes.indiatimes.com/markets/stocks/news/sugar-stocks-rally-ethanol-mandate',
            publishedAt: '2024-10-06',
          },
        ],
        historicalPrecedent: 'Biofuel margin expansion during the 2020-21 grain-based distillery incentive cycle',
      },
      {
        id: 'fi-2',
        label: 'FMCG Input Costs Surge & Margin Compression',
        description:
          'Confectionery, biscuit, and beverage manufacturers face elevated domestic refined sugar and sweetener procurement prices.',
        nodeType: 'forward_impact',
        entityType: 'Sector',
        truthStatus: 'observed_fact',
        confidenceScore: 88,
        impactDirection: 'negative',
        estimatedMagnitude: '-2.4%',
        tickerSymbol: 'NSE:BRITANNIA',
        transmissionLogic:
          'Export restriction prevents price arbitrage but domestic diversion to distilleries keeps raw refined sugar spot quotes elevated by 4.2%, squeezing gross margins for FMCG packagers.',
        evidence: [
          {
            sourceName: 'Mint',
            headline: 'FMCG companies prepare for gross margin pressure as sugar and palm oil input costs rise',
            url: 'https://livemint.com/market/mark-to-market/fmcg-margin-pressure-raw-materials',
            publishedAt: '2024-10-08',
          },
        ],
        historicalPrecedent: 'Mirror image of Britannia and Nestle EBITDA compression during the 2016 sugar run-up',
      },
      {
        id: 'fi-3',
        label: 'OMCs Capex Push into Ethanol Blending Depots',
        description:
          'State-run oil marketing companies scale blending terminals and dedicated tankage infrastructure nationwide.',
        nodeType: 'forward_impact',
        entityType: 'Sector',
        truthStatus: 'observed_fact',
        confidenceScore: 82,
        impactDirection: 'neutral',
        estimatedMagnitude: '₹14,500 Cr Capex',
        tickerSymbol: 'NSE:BPCL',
        transmissionLogic:
          'OMCs face mandatory compliance with statutory blending ratios, requiring retrofitting retail dispensing pumps and logistics tank depots with ethanol-compatible sealings.',
        evidence: [
          {
            sourceName: 'Reuters',
            headline: 'Indian state refiners ramp up green depot upgrades for E20 nationwide fuel rollout',
            url: 'https://reuters.com/business/energy/india-omc-ethanol-infrastructure',
            publishedAt: '2024-10-09',
          },
        ],
        historicalPrecedent: 'Parallels OMC terminal retrofits during BS-VI fuel transition in 2019-20',
      },
      {
        id: 'fi-4',
        label: 'CPI Food Basket Inflation Pressure (+18 bps)',
        description:
          'Processed food and beverages sub-index absorbs higher sweeteners pricing, feeding into core consumer price readings.',
        nodeType: 'forward_impact',
        entityType: 'Macro Indicator',
        truthStatus: 'inferred_relationship',
        confidenceScore: 74,
        impactDirection: 'negative',
        estimatedMagnitude: '+18 bps CPI',
        transmissionLogic:
          'Second-round transmission: sugar carries a 1.36% weight in headline CPI, but indirect pass-through via manufactured foods, hotels, and packaged goods amplifies inflationary sticky expectations.',
        evidence: [
          {
            sourceName: 'Reserve Bank of India (RBI)',
            headline: 'Monetary Policy Report: Food price shocks and persistence in core inflation expectations',
            url: 'https://rbi.org.in/scripts/PublicationsView.aspx',
            publishedAt: '2024-10-10',
          },
        ],
        historicalPrecedent: 'Analogous to food price propagation during the 2019 rural consumption cycle',
      },
    ],
    edges: [
      {
        id: 'e-bc1-root',
        source: 'bc-1',
        target: 'root-1',
        label: 'Catalyzed Forex Defense',
        weight: 0.92,
        animated: true,
      },
      {
        id: 'e-bc2-root',
        source: 'bc-2',
        target: 'root-1',
        label: 'Triggered Export Protectionism',
        weight: 0.88,
        animated: true,
      },
      {
        id: 'e-root-fi1',
        source: 'root-1',
        target: 'fi-1',
        label: 'Direct Revenue Uplift',
        weight: 0.95,
        animated: true,
      },
      {
        id: 'e-root-fi2',
        source: 'root-1',
        target: 'fi-2',
        label: 'Raw Material Cost Pressure',
        weight: 0.85,
        animated: true,
      },
      {
        id: 'e-root-fi3',
        source: 'root-1',
        target: 'fi-3',
        label: 'Statutory Infrastructure Mandate',
        weight: 0.78,
        animated: false,
      },
      {
        id: 'e-fi2-fi4',
        source: 'fi-2',
        target: 'fi-4',
        label: 'Second-Round Inflation Pass-Through',
        weight: 0.72,
        animated: true,
      },
    ],
  },

  // ==========================================
  // Dataset 2: Global/US Macro Shock
  // ==========================================
  {
    id: 'hormuz-crude-shock-2024',
    title: 'Brent Crude Spikes 11% Following Strait of Hormuz Tanker Transit Disruptions',
    market: 'us',
    category: 'Energy & Geopolitics',
    summary:
      'Escalating regional conflict in the Persian Gulf halted commercial VLCC tanker transits through the Strait of Hormuz, stranding ~20% of global daily petroleum flows and creating an immediate maritime war-risk premium.',
    rootNodeId: 'root-2',
    nodes: [
      // Left: Backward Causes (Observed Facts)
      {
        id: 'bc-201',
        label: 'Supply Route Security Premiums Rise',
        description:
          'Lloyd’s Market Association Joint War Committee widened Persian Gulf high-risk maritime boundaries, quadrupling hull insurance premiums.',
        nodeType: 'backward_cause',
        entityType: 'Geopolitical',
        truthStatus: 'observed_fact',
        confidenceScore: 98,
        impactDirection: 'negative',
        estimatedMagnitude: '+380% War Risk Premium',
        tickerSymbol: 'BDI',
        transmissionLogic:
          'Surging protection and indemnity (P&I) insurance tariffs rendered unescorted commercial shipping economically unviable across key choke points.',
        evidence: [
          {
            sourceName: 'Financial Times',
            headline: 'Red Sea and Gulf tanker war risk insurance rates spiral after drone and missile threats',
            url: 'https://ft.com/content/tanker-war-risk-insurance-gulf',
            publishedAt: '2024-06-18',
          },
          {
            sourceName: 'Reuters',
            headline: 'Maritime insurers declare expanded Persian Gulf critical risk corridor',
            url: 'https://reuters.com/business/energy/maritime-insurance-hormuz-risk',
            publishedAt: '2024-06-19',
          },
        ],
        historicalPrecedent: 'Matches tanker risk re-pricing during the 2019 Gulf of Oman tanker attacks',
      },
      {
        id: 'bc-202',
        label: 'OPEC+ Spare Capacity Discipline Maintained',
        description:
          'OPEC+ ministerial committee reaffirmed voluntary 2.2 mbpd production curtailments, leaving global commercial inventories depleted.',
        nodeType: 'backward_cause',
        entityType: 'Macro Indicator',
        truthStatus: 'observed_fact',
        confidenceScore: 94,
        impactDirection: 'neutral',
        estimatedMagnitude: '2.2 mbpd Withheld',
        tickerSymbol: 'CL=F',
        transmissionLogic:
          'Tight physical upstream crude inventories in OECD hubs meant international spot markets lacked emergency supply elasticity to absorb maritime transport shocks.',
        evidence: [
          {
            sourceName: 'Bloomberg',
            headline: 'OPEC+ maintains production targets despite emerging geopolitical transport stress',
            url: 'https://bloomberg.com/news/articles/opec-spare-capacity-discipline',
            publishedAt: '2024-06-20',
          },
          {
            sourceName: 'International Energy Agency (IEA)',
            headline: 'Oil Market Report: Global crude inventory deficits and operational buffer capacity',
            url: 'https://iea.org/reports/oil-market-report',
            publishedAt: '2024-06-21',
          },
        ],
        historicalPrecedent: 'Correlated with 1990 Gulf War supply elasticity floor',
      },

      // Center: Root Event
      {
        id: 'root-2',
        label: 'Strait of Hormuz Tanker Transit Stoppage',
        description:
          'Commercial vessel traffic through the 21-mile wide Hormuz maritime channel freezes after hostile boarding operations and naval exclusion alerts.',
        nodeType: 'root_event',
        entityType: 'Geopolitical',
        truthStatus: 'observed_fact',
        confidenceScore: 100,
        impactDirection: 'positive',
        estimatedMagnitude: '+11.4% Crude Spike',
        tickerSymbol: 'BZ=F',
        transmissionLogic:
          'The Strait carries 20.5 million barrels/day of petroleum liquids (~21% of global petroleum consumption). Immediate physical blockage triggers panic short-covering in NYMEX and ICE forward curves.',
        evidence: [
          {
            sourceName: 'Wall Street Journal',
            headline: 'Crude oil surges over 11% as tanker transit halts abruptly in the Strait of Hormuz',
            url: 'https://wsj.com/articles/brent-crude-surges-hormuz-stoppage',
            publishedAt: '2024-06-22',
          },
          {
            sourceName: 'Reuters',
            headline: 'Global energy shipping thrown into chaos as major tanker lines divert around Cape of Good Hope',
            url: 'https://reuters.com/business/energy/hormuz-tanker-stoppage-global-energy',
            publishedAt: '2024-06-22',
          },
        ],
        historicalPrecedent: 'Highest single-day geopolitical premium since the 2019 Abqaiq-Khurais drone strikes',
      },

      // Right: Forward Impacts
      {
        id: 'fi-201',
        label: 'Global Jet Fuel Spot Price Spike -> Airlines Margin Pressure',
        description:
          'Refinery crack spreads for kerosene-type jet fuel surge +28%, eroding airline cash flows into peak summer travel season.',
        nodeType: 'forward_impact',
        entityType: 'Sector',
        truthStatus: 'observed_fact',
        confidenceScore: 92,
        impactDirection: 'negative',
        estimatedMagnitude: '-4.8%',
        tickerSymbol: 'NYSE:DAL',
        transmissionLogic:
          'Jet kerosene represents 28-34% of major airline operating expenditure. Inability to hedge unexpected crack spread widening forces downward quarterly earnings revisions.',
        evidence: [
          {
            sourceName: 'Bloomberg',
            headline: 'Airline stocks tumble globally as spot jet fuel prices reach 9-month highs',
            url: 'https://bloomberg.com/news/articles/airline-margins-crude-jet-fuel-surge',
            publishedAt: '2024-06-23',
          },
          {
            sourceName: 'IATA Jet Fuel Price Monitor',
            headline: 'Global jet fuel crack spread and regional index weekly report',
            url: 'https://iata.org/en/publications/economics/fuel-monitor/',
            publishedAt: '2024-06-24',
          },
        ],
        historicalPrecedent: 'Parallels airline index drawdown following the February 2022 energy shock (r=0.86)',
      },
      {
        id: 'fi-202',
        label: 'Petrochemical Feedstock Inflation -> Paint & Specialty Chemicals',
        description:
          'Naphtha, ethylene, and benzene polymer intermediate costs climb sharply, impacting downstream coatings and plastics producers.',
        nodeType: 'forward_impact',
        entityType: 'Sector',
        truthStatus: 'observed_fact',
        confidenceScore: 89,
        impactDirection: 'negative',
        estimatedMagnitude: '-3.7%',
        tickerSymbol: 'NSE:ASIANPAINT',
        transmissionLogic:
          'Petrochemical monomers and crude oil derivatives make up over 55% of raw material consumption for architectural coatings and specialty polymers.',
        evidence: [
          {
            sourceName: 'Economic Times',
            headline: 'Asian Paints, Berger, Dow slide as crude oil derivative input costs spike',
            url: 'https://economictimes.indiatimes.com/markets/stocks/news/paint-stocks-slide-crude-oil',
            publishedAt: '2024-06-24',
          },
          {
            sourceName: 'Chemical & Engineering News',
            headline: 'Naphtha and petrochemical cracker economics strained by upstream crude spike',
            url: 'https://cen.acs.org/business/petrochemicals/naphtha-costs-spike',
            publishedAt: '2024-06-25',
          },
        ],
        historicalPrecedent: 'Matches Asian Paints gross margin contraction during Q2 FY23 crude rally',
      },
      {
        id: 'fi-203',
        label: 'US 10-Year Breakeven Inflation Expectations Rebound (+14 bps)',
        description:
          'Bond markets price in higher energy persistence, pushing Treasury yields higher and postponing central bank rate cuts.',
        nodeType: 'forward_impact',
        entityType: 'Macro Indicator',
        truthStatus: 'inferred_relationship',
        confidenceScore: 78,
        impactDirection: 'negative',
        estimatedMagnitude: '+14 bps Yield',
        tickerSymbol: 'T10YIE',
        transmissionLogic:
          'Supply-side energy shocks rapidly pass into headline PCE/CPI, compelling institutional fixed-income traders to recalibrate terminal policy rates higher.',
        evidence: [
          {
            sourceName: 'Financial Times',
            headline: 'US Treasury yields climb as crude spike revives sticky inflation concerns',
            url: 'https://ft.com/content/treasuries-yields-energy-inflation-shock',
            publishedAt: '2024-06-25',
          },
          {
            sourceName: 'Federal Reserve Bank of St. Louis (FRED)',
            headline: '10-Year Breakeven Inflation Rate data series release',
            url: 'https://fred.stlouisfed.org/series/T10YIE',
            publishedAt: '2024-06-26',
          },
        ],
        historicalPrecedent: 'Correlated with the 2022 US Treasury yield spike during European gas disruption (r=0.79)',
      },
    ],
    edges: [
      {
        id: 'e-bc201-root2',
        source: 'bc-201',
        target: 'root-2',
        label: 'Escalated Transit Risk Costs',
        weight: 0.94,
        animated: true,
      },
      {
        id: 'e-bc202-root2',
        source: 'bc-202',
        target: 'root-2',
        label: 'Constrained Physical Buffer',
        weight: 0.89,
        animated: true,
      },
      {
        id: 'e-root2-fi201',
        source: 'root-2',
        target: 'fi-201',
        label: 'Aviation Fuel Crack Widening',
        weight: 0.93,
        animated: true,
      },
      {
        id: 'e-root2-fi202',
        source: 'root-2',
        target: 'fi-202',
        label: 'Naphtha / Petrochemical Pass-Through',
        weight: 0.86,
        animated: true,
      },
      {
        id: 'e-root2-fi203',
        source: 'root-2',
        target: 'fi-203',
        label: 'Supply-Side Reflation Impulse',
        weight: 0.77,
        animated: true,
      },
    ],
  },

  // ==========================================
  // Dataset 3: Agri & Commodity Trader Shock
  // ==========================================
  {
    id: 'fertilizer-grain-disruption-2024',
    title: 'Black Sea Grain Corridor Suspension & Potash Export Tariffs',
    market: 'global',
    category: 'Agriculture & Food',
    summary:
      'Abrupt suspension of maritime grain transit protocols combined with unilateral export quotas on muriate of potash (MOP) triggers a worldwide agro-commodity cost escalation.',
    rootNodeId: 'root-3',
    nodes: [
      // Backward Causes
      {
        id: 'bc-301',
        label: 'Global Natural Gas Feedstock Cost Spikes',
        description: 'European TTF gas contracts rise +22%, squeezing nitrogen fertilizer synthesis margins.',
        nodeType: 'backward_cause',
        entityType: 'Commodity',
        truthStatus: 'observed_fact',
        confidenceScore: 97,
        impactDirection: 'negative',
        estimatedMagnitude: '+22.4% TTF Gas',
        tickerSymbol: 'TTF=F',
        transmissionLogic: 'Anhydrous ammonia synthesis relies directly on methane feedstock; rising input prices force European ammonia synthesis curtailments.',
        evidence: [
          {
            sourceName: 'Bloomberg Agriculture',
            headline: 'European fertilizer curtailments resume as natural gas prices jump',
            url: 'https://bloomberg.com/news/articles/fertilizer-gas-spikes',
            publishedAt: '2024-05-10',
          },
        ],
        historicalPrecedent: 'Corresponds with the 2021-22 European ammonia plant shutdowns',
      },
      {
        id: 'bc-302',
        label: 'Severe Heatwave Across Black Sea Wheat Belt',
        description: 'Persistent drought conditions cut soft wheat yield estimates across Eastern Europe.',
        nodeType: 'backward_cause',
        entityType: 'Macro Indicator',
        truthStatus: 'observed_fact',
        confidenceScore: 93,
        impactDirection: 'neutral',
        estimatedMagnitude: '-8.5% Crop Harvest',
        tickerSymbol: 'ZW=F',
        transmissionLogic: 'Depleted soil moisture reduces regional exportable grain surpluses before planting season.',
        evidence: [
          {
            sourceName: 'USDA WASDE',
            headline: 'World Agricultural Supply and Demand Estimates: Black Sea Wheat Revisions',
            url: 'https://usda.gov/wasde',
            publishedAt: '2024-05-12',
          },
        ],
        historicalPrecedent: 'Parallels the 2010 Russian grain export embargo cycle',
      },

      // Root Event
      {
        id: 'root-3',
        label: 'Black Sea Safe-Transit Protocol Voided & Fertilizer Tariffs Enacted',
        description: 'Safe maritime agricultural corridor unilaterally suspended alongside 15% export duties on potassium chloride and nitrogen fertilizers.',
        nodeType: 'root_event',
        entityType: 'Regulatory Policy',
        truthStatus: 'observed_fact',
        confidenceScore: 100,
        impactDirection: 'positive',
        estimatedMagnitude: '+16.8% Wheat Futures',
        tickerSymbol: 'ZW=F',
        transmissionLogic: 'Instant maritime insurance withdrawal and supply embargo strand millions of metric tons of grain and vital soil nutrients at port elevators.',
        evidence: [
          {
            sourceName: 'Reuters',
            headline: 'Black Sea grain initiative lapses as ports put on high security exclusion alerts',
            url: 'https://reuters.com/markets/commodities/black-sea-grain-halt',
            publishedAt: '2024-05-15',
          },
        ],
        historicalPrecedent: 'Direct repeat of the March 2022 soft commodity price shock wave',
      },

      // Forward Impacts
      {
        id: 'fi-301',
        label: 'Nutrien & Mosaic Surge on North American Fertilizer Supply Defense',
        description: 'Western crop nutrient producers capture pricing leverage as global buyers seek non-embargoed alternative tons.',
        nodeType: 'forward_impact',
        entityType: 'Sector',
        truthStatus: 'observed_fact',
        confidenceScore: 95,
        impactDirection: 'positive',
        estimatedMagnitude: '+11.2%',
        tickerSymbol: 'NYSE:MOS',
        transmissionLogic: 'Global nutrient buyers scramble to secure potash and DAP contracts from North American miners, lifting realized netbacks.',
        evidence: [
          {
            sourceName: 'Wall Street Journal',
            headline: 'Mosaic and Nutrien rally as global fertilizer prices jump on export limits',
            url: 'https://wsj.com/articles/mosaic-nutrien-fertilizer-surge',
            publishedAt: '2024-05-16',
          },
        ],
        historicalPrecedent: 'North American fertilizer equity rerating during H1 2022',
      },
      {
        id: 'fi-302',
        label: 'Bunge & ADM Agronomic Crush Margins Widen',
        description: 'Global agribusiness merchants benefit from volatility-driven origination spreads and inventory arbitrage.',
        nodeType: 'forward_impact',
        entityType: 'Sector',
        truthStatus: 'observed_fact',
        confidenceScore: 91,
        impactDirection: 'positive',
        estimatedMagnitude: '+6.4%',
        tickerSymbol: 'NYSE:BG',
        transmissionLogic: 'Major ABCD grain handlers leverage global port networks to redirect grain flows and expand gross merchandizing margins.',
        evidence: [
          {
            sourceName: 'Financial Times',
            headline: 'Global grain traders capitalize on shifting export corridors and volatile crop flows',
            url: 'https://ft.com/content/grain-traders-record-margins',
            publishedAt: '2024-05-17',
          },
        ],
        historicalPrecedent: 'Matches Bunge and ADM earnings beats in 2022',
      },
      {
        id: 'fi-303',
        label: 'Emerging Market Food Import Subsidies Strained',
        description: 'North African and Middle Eastern grain importing sovereigns face widening fiscal deficits.',
        nodeType: 'forward_impact',
        entityType: 'Macro Indicator',
        truthStatus: 'inferred_relationship',
        confidenceScore: 79,
        impactDirection: 'negative',
        estimatedMagnitude: '+$4.2B Fiscal Drag',
        transmissionLogic: 'State procurement agencies must pay inflated FOB prices and higher maritime demurrage fees to maintain strategic bread reserves.',
        evidence: [
          {
            sourceName: 'World Bank Policy Research',
            headline: 'Food Security Update: Fiscal implications of agricultural trade interruptions',
            url: 'https://worldbank.org/food-security-brief',
            publishedAt: '2024-05-18',
          },
        ],
        historicalPrecedent: 'Parallels sovereign food import balance-of-payments stress in 2022-23',
      },
    ],
    edges: [
      {
        id: 'e-bc301-root3',
        source: 'bc-301',
        target: 'root-3',
        label: 'Elevated Upstream Cost Floor',
        weight: 0.94,
        animated: true,
      },
      {
        id: 'e-bc302-root3',
        source: 'bc-302',
        target: 'root-3',
        label: 'Compounded Physical Scarcity',
        weight: 0.89,
        animated: true,
      },
      {
        id: 'e-root3-fi301',
        source: 'root-3',
        target: 'fi-301',
        label: 'Alternative Sourcing Arbitrage',
        weight: 0.96,
        animated: true,
      },
      {
        id: 'e-root3-fi302',
        source: 'root-3',
        target: 'fi-302',
        label: 'Origination & Trading Spreads',
        weight: 0.9,
        animated: true,
      },
      {
        id: 'e-root3-fi303',
        source: 'root-3',
        target: 'fi-303',
        label: 'Downstream Sovereign Fiscal Pass-Through',
        weight: 0.76,
        animated: true,
      },
    ],
  },
]

