import datetime
import random
from typing import Dict, Any, List

# Approximate baseline anchors for instant reliable sparklines
TICKER_BASELINES = {
    "AAPL": 235.0,
    "NVDA": 128.0,
    "MSFT": 420.0,
    "TSM": 182.0,
    "AMD": 155.0,
    "ASML": 780.0,
    "FOXCONN": 185.0,
    "CL=F": 76.5,
    "BZ=F": 81.2,
    "NG=F": 2.45,
    "GC=F": 2620.0,
    "HG=F": 4.35,
    "ZW=F": 585.0,
    "^TNX": 4.22,
    "^VIX": 17.8,
    "DXY": 103.5,
    "XLE": 92.0,
    "XLK": 225.0,
    "XLF": 46.5,
    "XLI": 128.0,
    "DAL": 48.5,
    "LMT": 560.0,
    "JPM": 218.0,
    "RELIANCE.NS": 1340.0,
    "HDFCBANK.NS": 1680.0,
    "TCS.NS": 4120.0,
    "INFY.NS": 1890.0,
    "ASIANPAINT.NS": 2840.0,
    "TATAMOTORS.NS": 960.0,
}

def generate_synthetic_series(ticker: str, days: int = 14) -> Dict[str, Any]:
    base = TICKER_BASELINES.get(ticker.upper(), 100.0)
    today = datetime.date.today()
    prices: List[Dict[str, Any]] = []
    
    curr = base * (0.95 + random.random() * 0.05)
    for i in range(days, -1, -1):
        dt = today - datetime.timedelta(days=i)
        # Random daily walk (-1.5% to +1.6%)
        pct = (random.random() - 0.48) * 0.03
        curr = round(curr * (1 + pct), 2)
        prices.append({"date": dt.strftime("%Y-%m-%d"), "close": curr})

    first_price = prices[0]["close"]
    last_price = prices[-1]["close"]
    change_pct = round(((last_price - first_price) / first_price) * 100, 2)

    return {
        "ticker": ticker.upper(),
        "current_price": last_price,
        "change_pct": change_pct,
        "prices": prices,
        "data_source": "synthetic_buffered"
    }

def get_market_data(ticker: str) -> Dict[str, Any]:
    """
    Attempts yfinance with fast fallback to synthetic baseline series.
    """
    try:
        import yfinance as yf
        t = yf.Ticker(ticker)
        hist = t.history(period="1mo", interval="1d")
        if not hist.empty and len(hist) > 3:
            prices: List[Dict[str, Any]] = []
            for dt, row in hist.iterrows():
                prices.append({
                    "date": dt.strftime("%Y-%m-%d"),
                    "close": round(float(row["Close"]), 2)
                })
            first_p = prices[0]["close"]
            last_p = prices[-1]["close"]
            change_pct = round(((last_p - first_p) / first_p) * 100, 2)
            return {
                "ticker": ticker.upper(),
                "current_price": last_p,
                "change_pct": change_pct,
                "prices": prices[-15:],
                "data_source": "yfinance_live"
            }
    except Exception:
        pass

    return generate_synthetic_series(ticker)
