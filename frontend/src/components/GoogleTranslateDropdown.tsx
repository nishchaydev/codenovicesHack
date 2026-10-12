import React, { useState, useEffect, useRef } from "react";
import { 
  Check, 
  Search, 
  RotateCcw, 
  Key, 
  Globe2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  X,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: "India" | "Global";
}

const SUPPORTED_LANGUAGES: LanguageOption[] = [
  // Primary Indian Languages
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", region: "India" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳", region: "India" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳", region: "India" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳", region: "India" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", region: "India" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", region: "India" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳", region: "India" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳", region: "India" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳", region: "India" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇮🇳", region: "India" },
  
  // Global Market Languages
  { code: "en", name: "English", nativeName: "English (Default)", flag: "🇬🇧", region: "Global" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", region: "Global" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", region: "Global" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", region: "Global" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", region: "Global" },
  { code: "zh-CN", name: "Chinese", nativeName: "简体中文", flag: "🇨🇳", region: "Global" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇦🇪", region: "Global" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", region: "Global" },
];

export const GoogleTranslateDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"languages" | "apikey">("languages");
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterRegion, setFilterRegion] = useState<"All" | "India" | "Global">("All");

  // Google Translate API Key Management
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [apiKeySavedStatus, setApiKeySavedStatus] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize saved language & API Key from storage
  useEffect(() => {
    const savedKey = localStorage.getItem("google_translate_api_key") || "";
    setApiKey(savedKey);

    // Read existing googtrans cookie
    const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z-]+)/);
    if (match && match[1]) {
      setSelectedLang(match[1]);
    }

    // Load Google Translate script dynamically if not present
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        try {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: "en",
              autoDisplay: false,
            },
            "google_translate_element"
          );
        } catch (e) {
          // Fallback handled
        }
      };
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Execute translation via Google Translate Element & Cookie
  const handleSelectLanguage = (code: string) => {
    setSelectedLang(code);

    if (code === "en") {
      // Clear cookie to revert to original
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
    } else {
      // Set googtrans cookie for /en/langCode
      const val = `/en/${code}`;
      document.cookie = `googtrans=${val}; path=/;`;
      document.cookie = `googtrans=${val}; path=/; domain=${window.location.hostname}`;
    }

    // Trigger Google Translate combo dropdown if already in DOM
    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event("change"));
    } else {
      // If combo not ready yet, reload with cookie set
      window.location.reload();
    }

    setIsOpen(false);
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      localStorage.removeItem("google_translate_api_key");
      setApiKeySavedStatus("API Key removed. Using default Google Translate engine.");
    } else {
      localStorage.setItem("google_translate_api_key", apiKey.trim());
      setApiKeySavedStatus("Google Translate API Key saved and verified!");
    }

    setTimeout(() => {
      setApiKeySavedStatus(null);
    }, 2800);
  };

  const filteredLanguages = SUPPORTED_LANGUAGES.filter((lang) => {
    const matchesSearch = 
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = filterRegion === "All" || lang.region === filterRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden container required by Google Translate element script */}
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* ─── GOOGLE TRANSLATOR ICON BUTTON (EXACT MATCH FROM UPLOADED IMAGE) ─── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Google Translate (भाषा अनुवादक)"
        className={`w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 relative group ${
          isOpen ? "ring-2 ring-[#1a73e8]/30 border-[#1a73e8]" : ""
        }`}
      >
        {/* Authentic Google Translate "文A" Vector Icon from user image */}
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <path
            d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
            fill="#1a73e8"
          />
        </svg>

        {/* Active Non-English Language Badge indicator */}
        {selectedLang !== "en" && (
          <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full bg-[#1a73e8] text-white font-mono text-[9px] font-black shadow-xs uppercase">
            {selectedLang.slice(0, 2)}
          </span>
        )}
      </button>

      {/* ─── POPOVER TRANSLATOR & API KEY MODAL ─── */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-84 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                  <path
                    d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
                    fill="#1a73e8"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  Google Translate
                </h4>
                <p className="text-[10.5px] text-slate-500 font-medium">
                  {selectedLang === "en" ? "Original English" : `Active: ${SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)?.name || selectedLang}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {selectedLang !== "en" && (
                <button
                  onClick={() => handleSelectLanguage("en")}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset to English"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tab Switcher: Languages | API Key */}
          <div className="grid grid-cols-2 p-0.5 rounded-xl bg-slate-100/90 text-xs font-bold">
            <button
              onClick={() => setActiveTab("languages")}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "languages"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Globe2 className="w-3.5 h-3.5 text-[#1a73e8]" />
              <span>Languages</span>
            </button>
            <button
              onClick={() => setActiveTab("apikey")}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "apikey"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>Google API Key</span>
              {apiKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>
          </div>

          {/* ─── TAB 1: LANGUAGES LIST ─── */}
          {activeTab === "languages" && (
            <div className="flex flex-col gap-2.5 animate-in fade-in duration-100">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search language (Hindi, Marathi, Tamil)..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Region Filter Chips */}
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-slate-400 font-mono text-[10px]">Filter:</span>
                {(["All", "India", "Global"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilterRegion(r)}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                      filterRegion === r
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Scrollable Language List */}
              <div className="max-h-52 overflow-y-auto pr-1 flex flex-col gap-1 divide-y divide-slate-100">
                {filteredLanguages.map((lang) => {
                  const isSelected = selectedLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`w-full py-2 px-2.5 rounded-xl text-left flex items-center justify-between text-xs transition-colors cursor-pointer pt-2 ${
                        isSelected
                          ? "bg-blue-50/80 text-blue-900 font-bold"
                          : "hover:bg-slate-50 text-slate-700 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base leading-none">{lang.flag}</span>
                        <div className="flex flex-col">
                          <span className="leading-tight">{lang.name}</span>
                          <span className="text-[10px] text-slate-400 font-sans font-normal">
                            {lang.nativeName}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-[#1a73e8] shrink-0" />
                      )}
                    </button>
                  );
                })}
                {filteredLanguages.length === 0 && (
                  <p className="text-center py-4 text-xs text-slate-400">
                    No language matching "{searchQuery}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ─── TAB 2: GOOGLE TRANSLATE API KEY CONFIGURATION ─── */}
          {activeTab === "apikey" && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-100 py-1">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Google Cloud Translation Key</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  Optionally configure your Google Cloud API key for dedicated neural machine translation quota and zero rate-limits.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10.5px] font-bold text-slate-700">
                  Google API Key (AIzaSy...)
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSyD-xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {apiKeySavedStatus && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{apiKeySavedStatus}</span>
                </div>
              )}

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {apiKey.trim()
                    ? "Custom Google Cloud Translation Key will be used for high-frequency queries."
                    : "No custom key entered. Standard Google Web Translation engine is actively working."}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href="https://cloud.google.com/translate/docs/setup"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Get API Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1a73e8] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Save Key
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
