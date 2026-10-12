import React from "react";
import { 
  ArrowRight, 
  Play, 
  FileText, 
  BarChart3, 
  Globe2, 
  GitFork, 
  Building2, 
  Car, 
  Building, 
  Laptop, 
  Fuel, 
  Plane, 
  Truck, 
  Factory, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Landmark, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus
} from "lucide-react";

interface LandingPageProps {
  onEnter: () => void;
  onSelectScenario?: (id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onSelectScenario }) => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased selection:bg-orange-500 selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* ─── 1. TOP NAVIGATION BAR ─── */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-5 flex items-center justify-between z-20">
        {/* Brand Logo */}
        <div 
          onClick={onEnter} 
          className="flex items-center gap-1 cursor-pointer select-none group"
        >
          <span className="font-extrabold text-2xl tracking-tight text-[#0A1128]">
            Fin<span className="text-[#EA580C]">D</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] mt-2 group-hover:scale-125 transition-transform" />
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#product" className="hover:text-slate-900 transition-colors">Product</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it Works</a>
          <a href="#use-cases" className="hover:text-slate-900 transition-colors">Use Cases</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-5">
          <button 
            onClick={onEnter}
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Sign in
          </button>
          <button 
            onClick={onEnter}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0A1128] hover:bg-slate-850 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:scale-[1.02] cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </header>

      {/* ─── 2. HERO SECTION ─── */}
      <section className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 pt-6 pb-20 overflow-hidden">
        {/* Subtle Decorative Faint Globe Arc Background in Top-Right */}
        <div className="absolute -top-10 -right-20 w-[680px] h-[680px] rounded-full bg-gradient-to-br from-orange-100/40 via-blue-50/30 to-transparent pointer-events-none -z-10 blur-2xl" />
        
        {/* Ambient SVG Orbital Wire Lines */}
        <svg 
          className="absolute top-0 right-0 w-[620px] h-[580px] opacity-25 pointer-events-none -z-10" 
          viewBox="0 0 620 580" 
          fill="none"
        >
          <circle cx="480" cy="220" r="260" stroke="#EA580C" strokeWidth="1.2" strokeDasharray="4 6" />
          <circle cx="480" cy="220" r="320" stroke="#0284C7" strokeWidth="1" strokeOpacity="0.4" />
          <path d="M 120 220 Q 300 100 480 220" stroke="#EA580C" strokeWidth="1.5" strokeOpacity="0.6" />
          <circle cx="360" cy="140" r="4" fill="#EA580C" />
          <circle cx="210" cy="180" r="3.5" fill="#0284C7" />
          <circle cx="540" cy="380" r="4.5" fill="#EA580C" />
        </svg>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Subtitle, and CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            {/* Kicker Tag */}
            <div className="text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase text-slate-400 mb-3.5">
              STRUCTURED FINANCIAL INTELLIGENCE
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#0A1128] tracking-tight leading-[1.08] mb-6">
              From News to <br />
              What Actually <br />
              <span className="text-[#EA580C]">Matters.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-lg mb-8 font-normal">
              FinD turns scattered financial news into structured, analytical insights — helping you see the real impact on markets, sectors and the economy.
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <button 
                onClick={onEnter}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#0A1128] hover:bg-slate-850 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={onEnter}
                className="flex items-center justify-center gap-3 px-5 py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold transition-all shadow-2xs hover:shadow-sm cursor-pointer"
              >
                <span className="w-6 h-6 rounded-full bg-[#EA580C] text-white flex items-center justify-center shadow-xs">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </span>
                <span>See How It Works</span>
              </button>
            </div>

            {/* Quick Feature Badges Row */}
            <div className="flex items-center gap-6 sm:gap-8 pt-3 border-t border-slate-100 w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-semibold text-slate-700 leading-tight">
                  Structured <br /> News
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-semibold text-slate-700 leading-tight">
                  Impact <br /> Analysis
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Globe2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-semibold text-slate-700 leading-tight">
                  Global <br /> Coverage
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Interactive Cards Overlaid on Global Graph */}
          <div className="lg:col-span-6 relative flex flex-col gap-6 items-center lg:items-end w-full">
            
            {/* Decorative Globe Illustration Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <div className="w-[420px] h-[420px] rounded-full border border-orange-200/50 bg-gradient-to-tr from-orange-50/60 to-blue-50/40" />
            </div>

            {/* ── CARD 1: MONETARY POLICY (RBI) ── */}
            <div 
              onClick={() => onSelectScenario ? onSelectScenario("rbi-rate-decision") : onEnter()}
              className="flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-lg cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
            >
              {/* Event Card (Left) */}
              <div className="flex-1 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
                  <Landmark className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mb-0.5">
                    Monetary Policy
                  </span>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                    RBI keeps policy rate unchanged at 6.5%
                  </h4>
                  <span className="text-[10px] text-slate-400 mt-1">2h ago</span>
                </div>
              </div>

              {/* Potential Impact Card (Right) */}
              <div className="w-full sm:w-44 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col justify-between">
                <div className="text-[11px] font-bold text-slate-900 text-left mb-2">
                  Potential Impact
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-orange-500" /> Banking
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Car className="w-3 h-3 text-orange-500" /> Auto
                    </span>
                    <ArrowDownRight className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Building className="w-3 h-3 text-orange-500" /> Real Estate
                    </span>
                    <Minus className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Laptop className="w-3 h-3 text-orange-500" /> IT
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Curved Connector SVG between Card 1 and Card 2 */}
            <div className="w-full max-w-lg flex justify-start pl-16 -my-3 pointer-events-none">
              <svg width="40" height="30" viewBox="0 0 40 30" fill="none">
                <path d="M 10 0 C 10 20, 30 10, 30 30" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
            </div>

            {/* ── CARD 2: GLOBAL EVENT (CRUDE OIL) ── */}
            <div 
              onClick={() => onSelectScenario ? onSelectScenario("scenario_oil_shock") : onEnter()}
              className="flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-lg cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
            >
              {/* Event Card (Left) */}
              <div className="flex-1 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-900/10 flex items-center justify-center shrink-0 overflow-hidden border border-amber-200">
                  <Fuel className="w-6 h-6 text-amber-700" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                    Global Event
                  </span>
                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                    Tensions ease as crude oil prices decline
                  </h4>
                  <span className="text-[10px] text-slate-400 mt-1">4h ago</span>
                </div>
              </div>

              {/* Potential Impact Card (Right) */}
              <div className="w-full sm:w-44 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col justify-between">
                <div className="text-[11px] font-bold text-slate-900 text-left mb-2">
                  Potential Impact
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Fuel className="w-3 h-3 text-orange-500" /> Oil & Gas
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Plane className="w-3 h-3 text-orange-500" /> Aviation
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3 h-3 text-orange-500" /> Logistics
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Factory className="w-3 h-3 text-orange-500" /> Manufacturing
                    </span>
                    <Minus className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. KEY CAPABILITIES SECTION ─── */}
      <section id="product" className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-16 text-center">
        {/* Kicker */}
        <div className="text-xs font-bold tracking-[0.16em] uppercase text-slate-400 mb-2">
          KEY CAPABILITIES
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1128] tracking-tight mb-3">
          More than just headlines
        </h2>

        {/* Section Subtitle */}
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto mb-12">
          Go beyond news. Understand the connections, identify impact, and get a clearer view of the bigger financial picture.
        </p>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: News to Insights */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-left flex flex-col items-start group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              News to Insights
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Convert unstructured news into clean, structured data.
            </p>
          </div>

          {/* Card 2: Impact Mapping */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-left flex flex-col items-start group">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Impact Mapping
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              See how events affect sectors, markets and economies.
            </p>
          </div>

          {/* Card 3: Analytical View */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-left flex flex-col items-start group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Analytical View
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Track trends, correlations and emerging risks.
            </p>
          </div>

          {/* Card 4: Global Perspective */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-left flex flex-col items-start group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Global Perspective
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Covering economies, policies, commodities and more.
            </p>
          </div>

        </div>
      </section>

      {/* ─── 4. WHY FIND (INTERACTIVE DATA CONVERGENCE DIAGRAM) ─── */}
      <section id="how-it-works" className="w-full bg-[#F0F7FF] py-20 px-6 sm:px-10 my-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading and Description */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="text-xs font-bold tracking-[0.16em] uppercase text-slate-400 mb-2.5">
              WHY FIND
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0A1128] tracking-tight leading-tight mb-5">
              See the bigger <br />
              picture, <span className="text-[#EA580C]">effortlessly.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-8 max-w-md">
              FinD connects global events, policy changes and economic developments to show what they mean across different sectors and markets.
            </p>
            <button 
              onClick={onEnter}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0A1128] hover:bg-slate-850 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>Explore Use Cases</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Column: Node Convergence & Dispersion Network */}
          <div className="lg:col-span-7 relative flex items-center justify-center w-full py-6">
            
            {/* SVG Connecting Curves */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 600 320" 
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Converging inputs (Left to Center) */}
              <path d="M 170 70 C 230 70, 240 160, 290 160" stroke="#CBD5E1" strokeWidth="1.8" fill="none" />
              <path d="M 170 160 C 220 160, 240 160, 290 160" stroke="#CBD5E1" strokeWidth="1.8" fill="none" />
              <path d="M 170 250 C 230 250, 240 160, 290 160" stroke="#CBD5E1" strokeWidth="1.8" fill="none" />

              {/* Diverging outputs (Center to Right) */}
              <path d="M 310 160 C 360 160, 370 50, 420 50" stroke="#38BDF8" strokeWidth="1.8" fill="none" />
              <path d="M 310 160 C 360 160, 370 120, 420 120" stroke="#38BDF8" strokeWidth="1.8" fill="none" />
              <path d="M 310 160 C 360 160, 370 200, 420 200" stroke="#FB923C" strokeWidth="1.8" fill="none" />
              <path d="M 310 160 C 360 160, 370 270, 420 270" stroke="#FB923C" strokeWidth="1.8" fill="none" />
            </svg>

            <div className="relative z-10 w-full flex items-center justify-between max-w-2xl gap-4">
              
              {/* Left Input Nodes Column */}
              <div className="flex flex-col gap-5 w-44">
                <div className="p-3 px-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                  <Landmark className="w-4 h-4 text-slate-500" />
                  <span>Policy Changes</span>
                </div>
                <div className="p-3 px-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                  <Globe2 className="w-4 h-4 text-blue-500" />
                  <span>Global Events</span>
                </div>
                <div className="p-3 px-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                  <BarChart3 className="w-4 h-4 text-amber-500" />
                  <span>Economic Data</span>
                </div>
              </div>

              {/* Center FinD Nucleus Circle */}
              <div className="w-20 h-20 rounded-full bg-white border-2 border-slate-200 shadow-lg flex items-center justify-center shrink-0">
                <span className="font-extrabold text-lg text-[#0A1128] tracking-tight">
                  Fin<span className="text-[#EA580C]">D</span>
                </span>
              </div>

              {/* Right Output Nodes Column */}
              <div className="flex flex-col gap-4 w-44">
                <div className="p-2.5 px-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>Sector Impact</span>
                </div>
                <div className="p-2.5 px-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <TrendingUp className="w-4 h-4 text-sky-500" />
                  <span>Market Trends</span>
                </div>
                <div className="p-2.5 px-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Risk Indicators</span>
                </div>
                <div className="p-2.5 px-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <Lightbulb className="w-4 h-4 text-orange-500" />
                  <span>Actionable Insights</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─── 5. BOTTOM CTA BANNER ─── */}
      <section className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 py-20 text-center overflow-hidden">
        
        {/* Subtle Bottom Wave Lines with Nodes Background */}
        <svg 
          className="absolute bottom-0 left-0 right-0 w-full h-32 opacity-35 pointer-events-none" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          fill="none"
        >
          <path d="M 0 80 Q 300 20 600 80 T 1200 60" stroke="#EA580C" strokeWidth="1.2" />
          <path d="M 0 100 Q 400 40 800 100 T 1200 90" stroke="#0284C7" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx="150" cy="65" r="4" fill="#EA580C" />
          <circle cx="320" cy="85" r="3.5" fill="#0284C7" />
          <circle cx="580" cy="78" r="4" fill="#EA580C" />
          <circle cx="850" cy="98" r="3" fill="#EA580C" />
          <circle cx="1020" cy="70" r="4" fill="#0284C7" />
        </svg>

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Kicker */}
          <div className="text-xs font-bold tracking-[0.16em] uppercase text-slate-400 mb-3">
            READY TO GET STARTED?
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0A1128] tracking-tight mb-4">
            Make sense of financial news <br />
            with <span className="text-[#EA580C]">FinD.</span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto mb-8">
            Join and start exploring structured insights from global financial events.
          </p>

          {/* Final CTA Button */}
          <button 
            onClick={onEnter}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0A1128] hover:bg-slate-850 text-white text-base font-semibold transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </section>

      {/* Subtle Footer Bar */}
      <footer className="w-full border-t border-slate-100 py-6 px-6 sm:px-10 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 font-bold text-slate-700">
            <span>Fin<span className="text-[#EA580C]">D</span></span>
            <span className="text-slate-400 font-normal">© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#about" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#about" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            <a href="#about" className="hover:text-slate-600 transition-colors">Documentation</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
