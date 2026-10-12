import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck(output_path):
    prs = Presentation()
    # 16:9 widescreen slides
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette: Deep FinTech Theme
    BG_DARK = RGBColor(11, 15, 25)        # #0B0F19
    CARD_BG = RGBColor(22, 30, 49)        # #161E31
    CARD_BORDER = RGBColor(38, 52, 84)    # #263454
    ACCENT_CYAN = RGBColor(56, 189, 248)  # #38BDF8
    ACCENT_GREEN = RGBColor(16, 185, 129) # #10B981
    ACCENT_RED = RGBColor(239, 68, 68)    # #EF4444
    ACCENT_AMBER = RGBColor(245, 158, 11) # #F59E0B
    TEXT_WHITE = RGBColor(248, 250, 252)  # #F8FAFC
    TEXT_MUTED = RGBColor(148, 163, 184)  # #94A3B8

    def add_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, tag, title, subtitle=None):
        # Category Tag / Badge
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.4))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = tag.upper()
        p_tag.font.bold = True
        p_tag.font.size = Pt(11)
        p_tag.font.color.rgb = ACCENT_CYAN
        p_tag.font.name = "Arial"

        # Slide Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.7))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title
        p_title.font.bold = True
        p_title.font.size = Pt(26)
        p_title.font.color.rgb = TEXT_WHITE
        p_title.font.name = "Arial"

        if subtitle:
            sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(0.4))
            tf_sub = sub_box.text_frame
            tf_sub.word_wrap = True
            p_sub = tf_sub.paragraphs[0]
            p_sub.text = subtitle
            p_sub.font.size = Pt(13)
            p_sub.font.color.rgb = TEXT_MUTED
            p_sub.font.name = "Arial"

    def add_card(slide, left, top, width, height, title, items, border_color=CARD_BORDER, badge=None):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_right = Inches(0.3)
        tf.margin_top = Inches(0.3)
        tf.margin_bottom = Inches(0.3)

        p = tf.paragraphs[0]
        if badge:
            p.text = f"[{badge}] {title}"
        else:
            p.text = title
        p.font.bold = True
        p.font.size = Pt(16)
        p.font.color.rgb = ACCENT_CYAN
        p.font.name = "Arial"
        p.space_after = Pt(10)

        for item in items:
            pi = tf.add_paragraph()
            pi.text = f"•  {item}"
            pi.font.size = Pt(12)
            pi.font.color.rgb = TEXT_WHITE
            pi.font.name = "Arial"
            pi.space_after = Pt(6)

        return card

    # =========================================================================
    # SLIDE 1: TITLE SLIDE
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    add_background(s1)

    # Accent decorative glow rectangle
    glow = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(4.8))
    glow.fill.solid()
    glow.fill.fore_color.rgb = CARD_BG
    glow.line.color.rgb = ACCENT_CYAN
    glow.line.width = Pt(2)

    s1_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11.0), Inches(4.2))
    s1_tf = s1_box.text_frame
    s1_tf.word_wrap = True

    p = s1_tf.paragraphs[0]
    p.text = "HACKWAVE 3.0  |  AUTONOMOUS FINANCIAL INTELLIGENCE"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = ACCENT_CYAN

    p = s1_tf.add_paragraph()
    p.text = "FinGraph / FinDlilly AI"
    p.font.bold = True
    p.font.size = Pt(40)
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(8)

    p = s1_tf.add_paragraph()
    p.text = "Autonomous Financial Event & Multi-Hop Market Impact Graph"
    p.font.bold = True
    p.font.size = Pt(20)
    p.font.color.rgb = ACCENT_GREEN
    p.space_after = Pt(16)

    p = s1_tf.add_paragraph()
    p.text = "Tracing how unstructured global news & geopolitical shocks propagate through sectors, supply chains, and equity portfolios using Knowledge Graphs, NLP, and Empirical Beta Sensitivity."
    p.font.size = Pt(14)
    p.font.color.rgb = TEXT_MUTED
    p.space_after = Pt(24)

    p = s1_tf.add_paragraph()
    p.text = "Team Presentation & Prototype Pitch  •  Live Demo Included"
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = ACCENT_AMBER

    # =========================================================================
    # SLIDE 2: THE PROBLEM STATEMENT
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_background(s2)
    add_header(s2, "The Core Dilemma", "The Problem: Financial News is Isolated, Impact is Cascading",
               "Why traditional news feeds and terminal alerts leave institutional investors and risk officers blind.")

    add_card(s2, Inches(0.8), Inches(2.2), Inches(3.7), Inches(4.6), "1. Siloed Information", [
        "News feeds (Bloomberg, Reuters, Google News) present events as isolated, single headlines.",
        "A 14% crude spike is shown only as an energy story, not an aviation or paint sector risk.",
        "No explicit mapping of cross-sector relationships or second-order dependencies."
    ], ACCENT_RED, "SILO BUG")

    add_card(s2, Inches(4.8), Inches(2.2), Inches(3.7), Inches(4.6), "2. The Multi-Hop Blindspot", [
        "Financial contagion doesn't stop at Direct Suppliers (Hop 1).",
        "It cascades into packaging costs, interest rate expectations, and sovereign debt (Hop 2 & 3).",
        "Analysts take hours of manual reading to uncover hidden downstream credit exposures."
    ], ACCENT_AMBER, "CONTAGION")

    add_card(s2, Inches(8.8), Inches(2.2), Inches(3.7), Inches(4.6), "3. Fact vs Prediction Confusion", [
        "Existing generative AI blindly hallucinates price predictions without statistical grounding.",
        "Zero transparency on what is an observed factual shock versus an inferred mathematical impact.",
        "Lack of verifiable evidence chains required for regulatory risk auditing."
    ], ACCENT_CYAN, "AUDIT GAP")

    # =========================================================================
    # SLIDE 3: OUR SOLUTION & VALUE PROPOSITION
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_background(s3)
    add_header(s3, "The Breakthrough Solution", "FinGraph AI: Dynamic Causal Dependency & Impact Radar",
               "An autonomous intelligence system transforming raw unstructured feeds into an interactive causal knowledge graph.")

    add_card(s3, Inches(0.8), Inches(2.2), Inches(3.7), Inches(4.6), "1. Autonomous NLP Ingestion", [
        "Extracts entities, catalysts, economic indicators, and commodity movements in real-time.",
        "FinBERT + LLM event classification detects shock magnitude, sentiment polarity, and affected nodes.",
        "Automated entity-resolution across tickers (e.g. Brent Crude -> INDIGO -> Asian Paints)."
    ], ACCENT_CYAN, "INGESTION")

    add_card(s3, Inches(4.8), Inches(2.2), Inches(3.7), Inches(4.6), "2. Multi-Hop Graph Traversal", [
        "Constructs a living NetworkX / Neo4j DiGraph linking upstream commodities to downstream equities.",
        "BFS / Dijkstra multi-hop traversal traces contagion velocity across supply vectors.",
        "Assigns statistical confidence scores (e.g. 94% confidence) and transmission factors to each hop."
    ], ACCENT_GREEN, "GRAPH BRAIN")

    add_card(s3, Inches(8.8), Inches(2.2), Inches(3.7), Inches(4.6), "3. Empirical Grounding & XAI", [
        "Couples graph topology with 90-day time-series returns regression (Beta sensitivity).",
        "Generates human-readable explanations explaining WHY an airline or bank is hit.",
        "One-click generation of Official Sector Impact Reports & Legal Audit Dossiers."
    ], ACCENT_AMBER, "EXPLAINABLE")

    # =========================================================================
    # SLIDE 4: END-TO-END SYSTEM ARCHITECTURE
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_background(s4)
    add_header(s4, "Engineering Blueprint", "End-to-End System Architecture",
               "A 4-tier pipeline connecting live news feeds to interactive 2D physics & cascade visualization.")

    add_card(s4, Inches(0.8), Inches(2.2), Inches(2.7), Inches(4.6), "Stage 1: Ingestion", [
        "Google News RSS / Terminal Wires / User Headline Input.",
        "Asynchronous stream processing with Python.",
        "Deduplication & topic clustering.",
        "Raw text parsing & tokenization."
    ], ACCENT_CYAN, "STEP 1")

    add_card(s4, Inches(3.8), Inches(2.2), Inches(2.7), Inches(4.6), "Stage 2: NLP & Extraction", [
        "FinBERT Sentiment + LLM Entity Resolution.",
        "Entity identification (Ticker, Sector, Commodity, Central Bank).",
        "Relationship extraction: (AFFECTS, INCREASES, COSTS).",
        "Confidence & impact severity scoring."
    ], ACCENT_CYAN, "STEP 2")

    add_card(s4, Inches(6.8), Inches(2.2), Inches(2.7), Inches(4.6), "Stage 3: Graph Engine", [
        "NetworkX Directed Graph (DiGraph) in FastAPI backend.",
        "Multi-hop propagation scoring: Distance-decay * Transmission factor.",
        "Time-series correlation (Historical regression beta).",
        "Observed Fact vs Inferred Probability gating."
    ], ACCENT_GREEN, "STEP 3")

    add_card(s4, Inches(9.8), Inches(2.2), Inches(2.7), Inches(4.6), "Stage 4: Visualization", [
        "React + Vite frontend with Tailwind & Vis-Network.",
        "Radial Transmission & Flow Domino Cascade views.",
        "Interactive Inspector with AI Confidence meters.",
        "Audit Report & Print Engine for export."
    ], ACCENT_AMBER, "STEP 4")

    # =========================================================================
    # SLIDE 5: MATHEMATICAL & PROPAGATION METHODOLOGY
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_background(s5)
    add_header(s5, "Methodology & Rigor", "How Propagation is Scored: Distinguishing Facts from Inference",
               "Combining graph structural path algorithms with empirical quantitative market sensitivity.")

    add_card(s5, Inches(0.8), Inches(2.2), Inches(5.6), Inches(4.6), "Propagation Math & Confidence", [
        "Transmission Factor (T): Calculated as T(Path) = Product of Edge Weights * Decay(Hop Distance).",
        "Decay Factor: Hop 1 retains 85-95% transmission; Hop 2 retains 40-60%; Hop 3 attenuates to systemic background noise.",
        "AI Confidence Metric: Blends FinBERT extraction certainty with historical co-movement frequency.",
        "Fact vs Inference Separation:",
        "  • Observed Facts (Green): Verified headline catalysts (e.g. Brent Crude spiked +14.2% today).",
        "  • Inferred Exposure (Amber/Red): Downstream company margin contraction derived from supply models."
    ], ACCENT_GREEN, "ALGORITHM")

    add_card(s5, Inches(6.8), Inches(2.2), Inches(5.7), Inches(4.6), "Time-Series Beta Calibration", [
        "Empirical Market Grounding: We don't just guess numbers; we calibrate against 90-day daily return regressions.",
        "Regression Beta (β): Delta(Asset) = Alpha + Beta * Delta(Commodity) + Epsilon.",
        "Example Finding: InterGlobe Aviation (IndiGo) displays Beta = -0.82 against Crude Oil futures.",
        "Stress Testing & What-If Engine:",
        "  • Users can input custom shocks (e.g. '+20% Crude Oil' or '-30% Semi Supply').",
        "  • Engine instantly simulates downstream P&L and market cap at risk ($14.5M portfolio exposure)."
    ], ACCENT_CYAN, "QUANT REGRESSION")

    # =========================================================================
    # SLIDE 6: KEY INNOVATIONS & UNIQUE DIFFERENTIATORS
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_background(s6)
    add_header(s6, "Competitive Edge", "Key Innovations that Set FinGraph Apart",
               "Built specifically to solve institutional risk hurdles, not just render basic nodes.")

    add_card(s6, Inches(0.8), Inches(2.2), Inches(3.7), Inches(4.6), "1. Causal Collision Explorer", [
        "Traditional tools look at one event in isolation.",
        "FinGraph detects collisions: What happens when an Oil Spike COLLIDES with a Central Bank Rate Hike?",
        "Multi-origin wave propagation highlights compounding stress points in real-time."
    ], ACCENT_CYAN, "COLLISION")

    add_card(s6, Inches(4.8), Inches(2.2), Inches(3.7), Inches(4.6), "2. Dual Graph Rendering", [
        "Switch effortlessly between 2 complementary visual paradigms:",
        "  • 2D Physics Force Graph: Visualizes overall structural clustering and centrality.",
        "  • Flow Domino Cascade: Linear Bézier multi-hop layout showing chronological shock transmission."
    ], ACCENT_GREEN, "DUAL UX")

    add_card(s6, Inches(8.8), Inches(2.2), Inches(3.7), Inches(4.6), "3. Institutional Dossier Export", [
        "One-click generation of professional Sector Impact Reports & Path Dossiers.",
        "Includes entity vulnerability profiles, channel breakdown, and model confidence stamps.",
        "Printable and shareable immediately for board and risk committee reviews."
    ], ACCENT_AMBER, "COMPLIANCE")

    # =========================================================================
    # SLIDE 7: LIVE PROTOTYPE DEMO WALKTHROUGH
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    add_background(s7)
    add_header(s7, "Hands-On Verification", "Live Prototype Walkthrough: The Crude Oil Shock Scenario",
               "Demonstrating end-to-end propagation from raw commodity event to specific portfolio assets.")

    add_card(s7, Inches(0.8), Inches(2.2), Inches(3.7), Inches(4.6), "Stage 0: Root Macro Shock", [
        "Trigger Event: Crude Oil Futures (CL=F) surge +14.2% due to Red Sea transit halt.",
        "Status: Verified Observed Fact.",
        "Systemic Exposure: $14,500,000 tracked portfolio exposure.",
        "Categorization: Energy Commodity Shock."
    ], ACCENT_CYAN, "HOP 0: TRIGGER")

    add_card(s7, Inches(4.8), Inches(2.2), Inches(3.7), Inches(4.6), "Stage 1: Direct Exposed Assets", [
        "Aviation: InterGlobe (IndiGo) drop -11.8% (Fuel = 40% of OpEx, Beta: -0.82, Conf: 94%).",
        "Airlines: SpiceJet drops -16.4% (Working capital & lease covenant strain).",
        "Chemicals: Asian Paints drops -8.5% (Petrochem solvent input pinch).",
        "Financials: Banking Index drops -4.5% (Delayed rate cuts via CPI inflation)."
    ], ACCENT_AMBER, "HOP 1: EQUITIES")

    add_card(s7, Inches(8.8), Inches(2.2), Inches(3.7), Inches(4.6), "Stage 2: Downstream Domino", [
        "IndiGo -> ATF Jet Fuel Surcharge (-18.4%).",
        "IndiGo -> Domestic Airfare Hike (+12.0%).",
        "IndiGo -> Discretionary Tourism Spend (-4.8%).",
        "Asian Paints -> Dealer Channel Credit Lag (-5.2%).",
        "Banking -> 10-Yr Sovereign Yield Spike (+18 bps)."
    ], ACCENT_RED, "HOP 2: SECONDARY")

    # =========================================================================
    # SLIDE 8: SYSTEMIC RISK GAUGE & DASHBOARD SUITE
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    add_background(s8)
    add_header(s8, "Complete Intelligence Suite", "Full Platform Suite: Beyond Graph Visualization",
               "A unified command center for portfolio managers, traders, and regulatory analysts.")

    add_card(s8, Inches(0.8), Inches(2.2), Inches(3.7), Inches(4.6), "Systemic Risk Gauge", [
        "Dynamic macro volatility dial computing composite stress scores (0 to 100).",
        "Integrates VIX, currency volatility, and supply chain fragility indices.",
        "Visual warning thresholds for market-wide contagion alerts."
    ], ACCENT_RED, "RISK RADAR")

    add_card(s8, Inches(4.8), Inches(2.2), Inches(3.7), Inches(4.6), "Live Terminal Wire Feed", [
        "Real-time integration with financial wires (Bloomberg, FT, Reuters, Google News).",
        "Real-time journalist credibility scores and topic taggers.",
        "Instant 'Simulate on Graph' button next to every breaking headline."
    ], ACCENT_CYAN, "NEWS WIRE")

    add_card(s8, Inches(8.8), Inches(2.2), Inches(3.7), Inches(4.6), "Interactive Inspector & XAI", [
        "Click any node or link to review plain-English causal logic.",
        "Provides exact citations and mathematical betas justifying the connection.",
        "Allows users to adjust node weights and re-simulate shock propagation."
    ], ACCENT_GREEN, "XAI COCKPIT")

    # =========================================================================
    # SLIDE 9: TARGET USERS & BUSINESS IMPACT
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    add_background(s9)
    add_header(s9, "Market Feasibility", "Target Market, User Personas & Commercial Value",
               "Transforming reactive post-mortem analysis into proactive pre-market positioning.")

    add_card(s9, Inches(0.8), Inches(2.2), Inches(3.7), Inches(4.6), "1. Hedge Funds & Asset Managers", [
        "Persona: Quantitative PMs and Equity Research Analysts.",
        "Pain Point: Missing non-obvious 2nd-order sector reactions before market open.",
        "FinGraph Value: Automated cross-asset hedging and alpha discovery across supply chain ripples."
    ], ACCENT_GREEN, "BUY-SIDE")

    add_card(s9, Inches(4.8), Inches(2.2), Inches(3.7), Inches(4.6), "2. Chief Risk Officers (CROs)", [
        "Persona: Bank Risk Managers and Insurance Treasuries.",
        "Pain Point: Hidden counterparty risk during geopolitical black swan events.",
        "FinGraph Value: Instant portfolio stress-testing and one-click regulatory risk audit reports."
    ], ACCENT_CYAN, "RISK / ENTERPRISE")

    add_card(s9, Inches(8.8), Inches(2.2), Inches(3.7), Inches(4.6), "3. Regulators & Central Banks", [
        "Persona: RBI, SEBI, SEC systemic risk surveillance teams.",
        "Pain Point: Detecting systemic failure points before contagion spreads to retail banking.",
        "FinGraph Value: Dynamic market topology monitoring and liquidity freeze alerts."
    ], ACCENT_AMBER, "REGULATORS")

    # =========================================================================
    # SLIDE 10: ROADMAP & CONCLUSION
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    add_background(s10)
    add_header(s10, "The Vision Forward", "Future Roadmap & Summary: The Autonomous Financial Brain",
               "Taking FinGraph from a hackathon proof-of-concept to an enterprise-grade financial terminal.")

    add_card(s10, Inches(0.8), Inches(2.2), Inches(3.7), Inches(4.6), "Near-Term (Next 3 Months)", [
        "Full Neo4j production cluster with 50,000+ global supply chain nodes.",
        "Automated SEC 10-K & earnings call transcript causal parsing.",
        "Real-time WebSocket streaming from Finnhub & Alpha Vantage."
    ], ACCENT_CYAN, "PHASE 1")

    add_card(s10, Inches(4.8), Inches(2.2), Inches(3.7), Inches(4.6), "Mid-Term (Next 6-12 Months)", [
        "Automated Portfolio Rebalancing: Recommends trade hedges directly via broker APIs.",
        "Multi-modal inputs: Satellite shipping AIS data + customs import/export filings.",
        "Enterprise RBAC login & multi-tenant portfolio segregation."
    ], ACCENT_GREEN, "PHASE 2")

    add_card(s10, Inches(8.8), Inches(2.2), Inches(3.7), Inches(4.6), "Summary & Takeaway", [
        "FinGraph solves Hackwave 3.0 by bridging unstructured news and quantitative contagion.",
        "Distinguishes observed facts from inferred probabilities.",
        "Fully working, dynamic interactive demo ready right now.",
        "Thank you! Ready for Questions & Live Demonstration."
    ], ACCENT_AMBER, "READY FOR Q&A")

    # Save presentation
    prs.save(output_path)
    print(f"Presentation successfully saved to: {output_path}")

if __name__ == '__main__':
    out_file = os.path.join(r"c:\Users\satya\Downloads\Hackwave", "FinGraph_Hackwave3_Pitch_Deck.pptx")
    create_deck(out_file)
