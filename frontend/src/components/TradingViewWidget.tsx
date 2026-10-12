import React, { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol: string;
  theme?: "light" | "dark";
  autosize?: boolean;
  height?: number | string;
  chartStyle?: "1" | "2" | "3"; // 1 = Candles, 2 = Line, 3 = Area
}

export function mapTickerToTradingViewSymbol(ticker: string): string {
  const clean = ticker.toUpperCase().trim();
  if (clean.endsWith(".NS")) {
    const sym = clean.replace(".NS", "");
    if (sym === "M&M") return "BSE:M_M";
    return `BSE:${sym}`;
  }
  if (clean.endsWith(".BO") || clean.endsWith(".BSE")) {
    const sym = clean.replace(".BO", "").replace(".BSE", "");
    if (sym === "M&M") return "BSE:M_M";
    return `BSE:${sym}`;
  }
  if (
    [
      "NVDA",
      "AAPL",
      "MSFT",
      "TSLA",
      "GOOGL",
      "AMZN",
      "META",
      "AMD",
      "NFLX",
      "PLTR",
      "ORCL",
    ].includes(clean)
  ) {
    return `NASDAQ:${clean}`;
  }
  return clean.includes(":") ? clean : `BSE:${clean}`;
}

const TradingViewWidgetComponent: React.FC<TradingViewWidgetProps> = ({
  symbol,
  theme = "light",
  autosize = true,
  height = 520,
  chartStyle = "1",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tvSymbol = mapTickerToTradingViewSymbol(symbol);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clean up any previously appended scripts or iframes
    const existingScript = container.querySelector("script");
    if (existingScript) {
      existingScript.remove();
    }
    const existingIframe = container.querySelector("iframe");
    if (existingIframe) {
      existingIframe.remove();
    }

    try {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: autosize,
        symbol: tvSymbol,
        interval: "D",
        timezone: "Asia/Kolkata",
        theme: theme,
        style: chartStyle, // 1 = Candlesticks, 2 = Line, 3 = Area
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: true,
        calendar: false,
        hide_volume: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        withdateranges: true,
        range: "1M",
        studies: ["STD;SMA", "STD;Bollinger_Bands"],
        support_host: "https://www.tradingview.com",
      });

      container.appendChild(script);
    } catch (err) {
      console.warn("TradingView widget initialization skipped:", err);
    }

    return () => {
      if (container) {
        const s = container.querySelector("script");
        if (s) s.remove();
        const f = container.querySelector("iframe");
        if (f) f.remove();
      }
    };
  }, [tvSymbol, theme, autosize, chartStyle]);

  return (
    <div
      className="tradingview-widget-container w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs bg-white"
      ref={containerRef}
      style={{ height, width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: typeof height === "number" ? `${height}px` : height, width: "100%" }}
      />
    </div>
  );
};

export const TradingViewWidget = memo(TradingViewWidgetComponent);
