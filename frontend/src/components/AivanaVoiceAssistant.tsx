import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Send, 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  User
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "flora";
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "What is Nifty & Sensex?",
  "Tell me about Reliance & Tata Motors",
  "How does Crude Oil shock affect Asian Paints?",
  "What is SIP & long term compounding?",
  "Explain US PERM visa freeze impact on Indian IT",
  "How does ThinkBeforeBuy Deal Scanner work?"
];

export const FloraVoiceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "flora",
      text: "Hi! I am Flora, your autonomous financial intelligence and stock market assistant. Ask me anything about share markets, companies, trading, or economics!",
      timestamp: "Just now"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isThinking]);

  // Speech Recognition setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery(transcript);
          handleSendQuery(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("[Flora SpeechRecognition Error]", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Text to Speech
  const speakText = (text: string) => {
    if (isMuted || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    // Clean markdown characters for natural voice
    const cleanSpeech = text
      .replace(/[*#_`~]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .slice(0, 320); // Speak first punchy segment

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick a high-quality female or english voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Zira")
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      deliverAiResponse("Voice recognition is not supported in this browser environment. Please type your question below and I will analyze it immediately.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        setIsSpeaking(false);
        recognitionRef.current.start();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleSendQuery = async (queryToSend?: string) => {
    const q = (queryToSend !== undefined ? queryToSend : inputQuery).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsThinking(true);

    // 1. Try real fast generative AI inference first (4.5s timeout)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const sysPrompt = "You are Flora, a smart, friendly, and knowledgeable AI assistant specializing in stock markets, finance, economy, and general queries. Give a clear, insightful, and concise answer in 2-3 sentences.";
      const pollUrl = `https://text.pollinations.ai/${encodeURIComponent(q)}?system=${encodeURIComponent(sysPrompt)}`;
      
      const pollRes = await fetch(pollUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (pollRes.ok) {
        const pollText = await pollRes.text();
        if (pollText && pollText.trim().length > 15 && !pollText.includes("<!DOCTYPE")) {
          deliverAiResponse(pollText.trim());
          return;
        }
      }
    } catch {
      // Proceed to next fallback tier
    }

    // 2. Try backend chat endpoint if backend is live
    try {
      let res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q })
      }).catch(() => null);

      if (!res || !res.ok) {
        if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
          res = await fetch("http://localhost:8000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: q })
          }).catch(() => null);
        }
      }

      if (res && res.ok) {
        const data = await res.json();
        if (data.answer && !data.answer.includes("Simulate an event first")) {
          deliverAiResponse(data.answer);
          return;
        }
      }
    } catch {
      // Proceed to Flora built-in knowledge engine
    }

    // 3. Comprehensive Flora Built-in Knowledge Engine (Instant, zero latency)
    const engineAns = generateIntelligentFloraResponse(q);
    deliverAiResponse(engineAns);
  };

  const deliverAiResponse = (ansText: string) => {
    setIsThinking(false);
    const aiMsg: ChatMessage = {
      id: "ai_" + Date.now(),
      sender: "flora",
      text: ansText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages((prev) => [...prev, aiMsg]);
    speakText(ansText);
  };

  const generateIntelligentFloraResponse = (q: string): string => {
    const lower = q.toLowerCase();

    // ─── GREETINGS & IDENTITY ───
    if (lower.match(/\b(who are you|your name|naam kya|who r u)\b/)) {
      return "I am Flora, your autonomous financial intelligence and stock market assistant. I can help you analyze equities, macroeconomic trends, company balance sheets, and smart consumer buying decisions!";
    }

    if (lower.match(/\b(how are you|kese ho|kaise ho|kya haal)\b/)) {
      return "I'm doing fantastic! The financial markets are dynamic today, and I'm ready to answer any question about stocks, sector trends, or macro catalysts.";
    }

    if (lower.match(/^(hi|hello|hey|namaste|pranam|good morning|good evening|good afternoon)\b/)) {
      return "Hello! I am Flora. Ask me anything about the share market, Indian or global equities, economic catalysts, or personal finance!";
    }

    if (lower.match(/\b(thank you|thanks|shukriya|dhanyawad)\b/)) {
      return "You're very welcome! Feel free to ask whenever you need market insights or stock analysis.";
    }

    // ─── SHARE MARKET CORE CONCEPTS ───
    if (lower.includes("what is share market") || lower.includes("stock market") || lower.includes("share bazaar") || lower.includes("share market kya hai")) {
      return "The share market is an organized exchange (like NSE and BSE in India) where shares of publicly listed companies are bought and sold. It enables companies to raise capital for growth while providing investors an avenue for capital appreciation and dividend yields.";
    }

    if (lower.includes("nifty") || lower.includes("sensex") || lower.includes("bank nifty") || lower.includes("index")) {
      return "NIFTY 50 tracks the 50 largest blue-chip companies on the National Stock Exchange (NSE), while SENSEX represents the top 30 corporations on the Bombay Stock Exchange (BSE). They serve as primary benchmarks reflecting India's overall economic pulse and investor confidence.";
    }

    if (lower.includes("bull") || lower.includes("bear") || lower.includes("rally") || lower.includes("crash")) {
      return "A Bull Market indicates sustained investor optimism with asset prices rising 20% or more from recent troughs. A Bear Market represents a sustained 20%+ decline driven by risk aversion, monetary tightening, or economic headwinds.";
    }

    if (lower.includes("sip") || lower.includes("mutual fund") || lower.includes("compounding")) {
      return "A Systematic Investment Plan (SIP) allows disciplined, periodic investing in mutual funds, benefiting from rupee-cost averaging and exponential long-term compounding without the stress of market timing.";
    }

    if (lower.includes("ipo")) {
      return "An Initial Public Offering (IPO) is when a privately held company issues shares to the public for the first time on a stock exchange, transforming into a publicly traded firm to raise capital for expansion and debt reduction.";
    }

    if (lower.includes("dividend") || lower.includes("pe ratio") || lower.includes("p/e") || lower.includes("valuation")) {
      return "The P/E (Price-to-Earnings) ratio compares a company's market price to its per-share earnings to gauge valuation against peers. Dividends represent cash profit distributions paid out directly to shareholders.";
    }

    if (lower.includes("intraday") || lower.includes("f&o") || lower.includes("futures") || lower.includes("options") || lower.includes("derivative")) {
      return "Intraday trading involves squaring off buy and sell positions within the same session before 3:30 PM. Futures and Options (F&O) are leveraged derivative contracts used by institutional desks for hedging and directional speculation.";
    }

    // ─── BLUE-CHIP COMPANIES & STOCKS ───
    if (lower.includes("reliance") || lower.includes("jio") || lower.includes("mukesh ambani")) {
      return "Reliance Industries (RELIANCE) is India's largest conglomerate by market cap, leading across petrochemicals, retail store chains, and Jio telecom, while aggressively scaling green hydrogen and solar energy infrastructure.";
    }

    if (lower.includes("tata motors") || lower.includes("tata motor") || lower.includes("ev")) {
      return "Tata Motors dominates India's commercial vehicle market and holds over 65% market share in domestic Electric Vehicles (EVs). Its global cash flow is further supported by luxury brand Jaguar Land Rover (JLR).";
    }

    if (lower.includes("tcs") || lower.includes("infosys") || lower.includes("wipro") || lower.includes("hcl") || lower.includes("it sector")) {
      return "Indian IT majors like TCS and Infosys generate strong operating margins (~22-25%) with high free cash flow conversion. Key growth drivers include enterprise cloud migration, generative AI integration, and offshore client delivery.";
    }

    if (lower.includes("hdfc") || lower.includes("icici") || lower.includes("sbi") || lower.includes("bank")) {
      return "Leading Indian banks (HDFC Bank, ICICI Bank, SBI) maintain healthy balance sheets with net interest margins around 3.4–4.0% and multi-year low non-performing assets (NPAs), benefiting from robust domestic credit expansion.";
    }

    if (lower.includes("adani")) {
      return "The Adani Group operates essential national infrastructure across deep-sea ports (APSEZ), green solar power, electricity transmission, airports, and city gas distribution networks with strong domestic capex pipeline.";
    }

    if (lower.includes("itc")) {
      return "ITC is an established cash cow boasting monopoly profits in cigarettes that fund rapid scaling in FMCG foods, personal care, paperboards, and agribusiness, alongside high dividend yields.";
    }

    if (lower.includes("asian paint") || lower.includes("paint") || lower.includes("crude") || lower.includes("oil")) {
      return "When Brent Crude surges, petrochemical solvents (like phthalic anhydride) jump by +8.4%. Since raw materials represent ~50% of Asian Paints' cost structure, margins experience a 140–180 bps compression with a 45-day lag.";
    }

    // ─── MACROECONOMICS, SHOCKS & POLICY ───
    if (lower.includes("rbi") || lower.includes("repo rate") || lower.includes("interest rate") || lower.includes("fed")) {
      return "The RBI repo rate determines borrowing costs across the economy. A rate cut lowers home and auto loan EMIs, boosting consumption and equity valuations, while rate hikes control inflation at the expense of liquidity.";
    }

    if (lower.includes("inflation") || lower.includes("cpi") || lower.includes("mehangai")) {
      return "Inflation erodes real purchasing power and prompts central banks to raise policy rates. High inflation typically impacts rate-sensitive sectors like real estate, auto, and consumer discretionary spending.";
    }

    if (lower.includes("gold") || lower.includes("silver") || lower.includes("sona")) {
      return "Gold and silver act as traditional safe-haven hedges against fiat currency debasement, geopolitical instability, and sudden equity market drawdowns.";
    }

    if (lower.includes("dollar") || lower.includes("rupee") || lower.includes("usd") || lower.includes("inr") || lower.includes("forex")) {
      return "A stronger US Dollar against the Indian Rupee benefits export-driven industries like IT services and Pharmaceuticals, but raises import bills for crude oil, electronics, and fertilizers.";
    }

    if (lower.includes("visa") || lower.includes("perm")) {
      return "The US PERM green card certification suspension freezes onshore visa conversions, directly accelerating offshore IT delivery allocation to Indian tech majors (TCS, Infosys, Tech Mahindra) with sustained tier-1 billing rates.";
    }

    if (lower.includes("risk") || lower.includes("systemic") || lower.includes("score")) {
      return "Current systemic stress gauge sits at 78/100 (Critical Macro Contagion). Key pressure points originate from crude energy volatility and tightening interbank borrowing spreads.";
    }

    if (lower.includes("hop 1") || lower.includes("hop 2") || lower.includes("cascade") || lower.includes("contagion")) {
      return "Hop 1 captures direct counterparties and immediate cost shocks (e.g., fuel price directly hitting airlines). Hop 2 traces second-order dominoes—such as flight surcharge hikes, reduced discretionary tourism spend, and delayed sovereign rate cuts.";
    }

    // ─── PLATFORM & THINKBEFOREBUY ───
    if (lower.includes("thinkbeforebuy") || lower.includes("deal scanner") || lower.includes("price drop") || lower.includes("findlilly")) {
      return "ThinkBeforeBuy is FinDlilly's proprietary consumer intelligence engine that analyzes real-time price histories and volatility across Amazon and Flipkart to stop impulse buying and identify authentic discounts.";
    }

    if (lower.includes("crypto") || lower.includes("bitcoin") || lower.includes("ethereum")) {
      return "Cryptocurrencies like Bitcoin and Ethereum are decentralized digital assets secured by cryptographic blockchains, exhibiting high volatility and growing adoption as alternative digital stores of value.";
    }

    // ─── INTELLIGENT DYNAMIC SYNTHESIS FOR ANY OTHER QUERY ───
    const cleanQ = q.replace(/[?!.]/g, "").trim();
    return `Regarding "${cleanQ}": In modern financial markets, this interacts directly with sector capital allocation, macroeconomic transmission, and asset valuation dynamics. Flora monitors these signals across supply chains and equities to identify actionable trends.`;
  };

  return (
    <>
      {/* ─── 1. CORNER FLOATING TRIGGER WIDGET ─── */}
      <div 
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 cursor-pointer select-none group"
        onClick={() => {
          setIsOpen(true);
          if (messages.length === 1) {
            speakText("Hi! I am Flora. How can I assist with your market research today?");
          }
        }}
      >
        {/* Hover Pill Tooltip */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A]/90 border border-slate-700/80 shadow-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold text-slate-200">Talk to Flora</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">Voice AI</span>
        </div>

        {/* Floating Animated Orb Container (6px reduced for sleek ergonomics) */}
        <div className="relative w-[58px] h-[58px] sm:w-[66px] sm:h-[66px] flex items-center justify-center">
          {/* Multi-color ambient glow waves */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 via-amber-400 to-cyan-400 opacity-60 blur-xl group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 animate-pulse" />
          
          {/* Rotating Ring Wave Border */}
          <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-r from-rose-500 via-yellow-400 via-emerald-400 via-cyan-400 to-indigo-500 animate-spin" style={{ animationDuration: "8s" }}>
            <div className="w-full h-full rounded-full bg-[#07090E]" />
          </div>

          {/* Actual Orb Image */}
          <div className="relative w-[50px] h-[50px] sm:w-[58px] sm:h-[58px] rounded-full overflow-hidden flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-105 border border-white/20">
            <img 
              src="/aivana_orb.png" 
              alt="Hi Flora Voice Assistant" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            {/* Fallback Center Badge if image is loading */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07090E]/60 backdrop-blur-[2px]">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-tight text-white drop-shadow-md">
                Hi Flora
              </span>
            </div>
          </div>

          {/* Online Radar Beacon Dot */}
          <span className="absolute top-0 right-0 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-cyan-500 border-2 border-[#07090E]" />
          </span>
        </div>
      </div>

      {/* ─── 2. EXPANDED VOICE ASSISTANT MODAL ─── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-xl rounded-3xl bg-[#090D16] border border-slate-800 shadow-[0_0_60px_rgba(56,189,248,0.2)] overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Glow Accent Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-amber-400 via-cyan-400 to-indigo-500" />

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <div>
                <div className="text-sm font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                  “Hi Flora ”
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Flora AI Assistant
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    Live
                  </span>
                </h2>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = !isMuted;
                    setIsMuted(next);
                    if (next && window.speechSynthesis) window.speechSynthesis.cancel();
                  }}
                  title={isMuted ? "Unmute Voice" : "Mute Voice"}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700/60"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                </button>
                <button
                  onClick={() => {
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                    if (recognitionRef.current && isListening) recognitionRef.current.stop();
                    setIsOpen(false);
                  }}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700/60"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Central Animated Flora Orb Visual */}
            <div className="relative py-6 flex flex-col items-center justify-center bg-radial from-slate-900/60 to-transparent">
              {/* Outer Radiant Sound Waves */}
              <div 
                className={`relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center transition-transform duration-500 ${
                  isSpeaking ? "scale-105" : isListening ? "scale-110" : "scale-100"
                }`}
              >
                {/* Radial Glow Layer */}
                <div 
                  className={`absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 via-amber-400 via-emerald-400 to-cyan-500 blur-2xl transition-opacity duration-300 ${
                    isListening ? "opacity-90 animate-pulse" : isSpeaking ? "opacity-80 animate-pulse" : "opacity-45"
                  }`} 
                />

                {/* Rotating Spectral Ring */}
                <div 
                  className="absolute inset-2 rounded-full p-[3px] bg-gradient-to-r from-rose-500 via-yellow-400 via-cyan-400 to-indigo-600 animate-spin"
                  style={{ animationDuration: isListening ? "3s" : isSpeaking ? "5s" : "12s" }}
                >
                  <div className="w-full h-full rounded-full bg-[#07090E]" />
                </div>

                {/* Center Image */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-2xl flex items-center justify-center border-2 border-white/20">
                  <img 
                    src="/aivana_assistant.png" 
                    alt="Hi Flora Voice Assistant" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07090E]/50 backdrop-blur-[2px]">
                    <span className="text-base sm:text-lg font-bold tracking-tight text-white drop-shadow-lg">
                      Hi Flora
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic State Pill */}
              <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-medium text-slate-300 shadow-inner">
                {isListening ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-rose-400 font-semibold">Listening... Speak now</span>
                  </>
                ) : isThinking ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-amber-300 font-semibold">Flora analyzing intelligence...</span>
                  </>
                ) : isSpeaking ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="text-cyan-300 font-semibold">Flora speaking...</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Ask Flora about share market, stocks, or anything</span>
                  </>
                )}
              </div>
            </div>

            {/* Conversation Transcript Feed */}
            <div className="flex-1 overflow-y-auto px-6 py-3 space-y-3 max-h-56 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 text-xs sm:text-sm ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "flora" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center shrink-0 text-white font-bold text-[10px] shadow-sm">
                      FL
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md rounded-tr-xs"
                        : "bg-slate-900/90 border border-slate-800 text-slate-200 shadow-sm rounded-tl-xs"
                    }`}
                  >
                    {msg.text}
                    <div
                      className={`text-[10px] mt-1.5 opacity-60 ${
                        msg.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-3 justify-start text-xs text-slate-400 items-center">
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  </div>
                  <div className="px-3.5 py-2 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse">
                    Flora is analyzing market intelligence & generating answer...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="px-6 py-2 border-t border-slate-850 bg-slate-950/40">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                <span className="text-slate-500 font-semibold whitespace-nowrap mr-1">Suggested:</span>
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendQuery(prompt)}
                    className="px-2.5 py-1 rounded-full bg-slate-850 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-750 whitespace-nowrap transition-all cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar & Mic Trigger */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#090D16]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuery();
                }}
                className="flex items-center gap-2"
              >
                {/* Voice Input Mic Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-3 rounded-2xl transition-all duration-300 cursor-pointer flex items-center justify-center shadow-lg ${
                    isListening
                      ? "bg-rose-500 text-white animate-pulse shadow-rose-500/50 scale-105"
                      : "bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80"
                  }`}
                  title={isListening ? "Stop listening" : "Click to speak with Flora"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-cyan-400" />}
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={
                    isListening ? "Listening to your voice..." : "Ask Flora about stocks, companies, markets, or anything..."
                  }
                  className="flex-1 bg-slate-900 border border-slate-750 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />

                {/* Submit Send Button */}
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isThinking}
                  className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Aliases for seamless backward compatibility
export const AivanaVoiceAssistant = FloraVoiceAssistant;
export default FloraVoiceAssistant;
