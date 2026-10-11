import google.generativeai as genai
import json
import os
from rag_engine import RAGEngine

# You can set your Gemini API key as an environment variable or pass it directly.
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Use the latest gemini model
model = genai.GenerativeModel('gemini-2.5-flash')
rag_engine = RAGEngine()

def extract_financial_entities(news_text: str):
    """
    Uses RAG to get context, then uses Gemini to extract structured JSON entities.
    """
    # 1. Retrieve Context from Vector DB (RAG)
    context_docs = rag_engine.search(news_text, top_k=2)
    context_str = "\n".join([f"- {doc}" for doc in context_docs])
    
    # 2. Build the Prompt
    prompt = f"""
    You are an expert AI financial analyst building a knowledge graph.
    Read the following financial news event and extract the key entities.
    
    Historical Context for Guidance:
    {context_str if context_str else "No historical context found."}
    
    News Event:
    "{news_text}"
    
    Extract the entities and categorize them exactly into this JSON structure:
    {{
        "event": "Short title of the event",
        "companies": ["Company1", "Company2"],
        "commodities": ["Commodity1"],
        "sectors": ["Sector1", "Sector2"],
        "indicators": ["Inflation", "Interest Rates", etc.],
        "impact_summary": "1-sentence explanation of why these entities are affected based on the historical context."
    }}
    
    Return ONLY valid JSON.
    """
    
    try:
        response = model.generate_content(prompt)
        # Parse JSON
        result = response.text.strip()
        if result.startswith("```json"):
            result = result.replace("```json", "").replace("```", "")
        return json.loads(result)
    except Exception as e:
        print(f"LLM Extraction Error: {e}")
        # Rule-based fallback extraction
        news_lower = news_text.lower()
        if "oil" in news_lower or "crude" in news_lower or "opec" in news_lower:
            return {
                "event": "Crude Oil Price Shock",
                "companies": ["InterGlobe Aviation (IndiGo)", "Asian Paints", "SpiceJet"],
                "commodities": ["Crude Oil (CL=F)", "Brent"],
                "sectors": ["Airlines", "Paints & Chemicals", "Logistics"],
                "indicators": ["Consumer Inflation (CPI)", "Fuel Operating Cost"],
                "impact_summary": "Surge in crude oil directly escalates aviation fuel expenses and industrial solvent costs."
            }
        elif "chip" in news_lower or "semiconductor" in news_lower:
            return {
                "event": "Semiconductor Supply Restriction",
                "companies": ["Apple Inc", "Microsoft Cloud", "Tata Motors"],
                "commodities": ["Silicon Wafers", "Microcontrollers"],
                "sectors": ["Consumer Electronics", "Automotive", "Enterprise Cloud"],
                "indicators": ["Hardware Lead Times", "Server Capex"],
                "impact_summary": "Export limits on advanced microchips trigger spot supply shortages across auto and cloud computing clusters."
            }
        elif "rate" in news_lower or "bank" in news_lower or "inflation" in news_lower or "rbi" in news_lower:
            return {
                "event": "Benchmark Policy Rate Adjustment",
                "companies": ["HDFC Bank", "DLF Real Estate", "State Bank of India"],
                "commodities": ["Gold", "10Y Sovereign Debt"],
                "sectors": ["Commercial Banking", "Real Estate", "Housing Credit"],
                "indicators": ["Repo Rate", "Mortgage Origination Volume", "NIM"],
                "impact_summary": "Policy rate cut stimulates mortgage refinancing demand while temporarily compressing commercial lending yields."
            }
        else:
            return {
                "event": "Macroeconomic Market Event",
                "companies": ["Benchmark Index Basket"],
                "commodities": ["Broad Commodities"],
                "sectors": ["Equities", "Debt Capital Markets"],
                "indicators": ["Market Volatility Index (VIX)"],
                "impact_summary": "Systemic narrative influences multi-sector liquidity flows and risk asset premiums."
            }

if __name__ == "__main__":
    test_news = "Crude oil surges by 12% following a supply cut in the Middle East."
    print("Testing Extractor on:", test_news)
    print(extract_financial_entities(test_news))
