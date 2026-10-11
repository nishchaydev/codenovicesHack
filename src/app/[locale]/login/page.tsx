'use client';

import React, { useState } from 'react';
import { useTranslations } from '@/i18n/useTranslations';
import { useRouter } from '@/i18n/routing';
import { signIn } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { Shield, Lock, Mail, Key, User, ArrowRight, Check, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const tAuth = useTranslations('auth');
  const router = useRouter();

  // Active Tab State: 'institutional' | 'researcher'
  const [activeTab, setActiveTab] = useState<'institutional' | 'researcher'>('institutional');

  // Form Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: activeTab === 'institutional' ? email : undefined,
        password: activeTab === 'institutional' ? password : undefined,
        apiKey: activeTab === 'researcher' ? apiKey : undefined,
      });

      if (res?.error) {
        setErrorMessage('Invalid credentials. Please check your inputs.');
        setIsLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      router.push('/dashboard');
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (err) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-clay-bg text-clay-text selection:bg-clay-accent selection:text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="clay-card max-w-lg w-full p-6 sm:p-10 space-y-8 relative overflow-hidden backdrop-blur-xl border border-clay-border/80 shadow-2xl">
          {/* Header Icon & Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl clay-badge text-clay-accent mb-2 shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-clay-text">
              {tAuth('signInTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-clay-muted font-medium">
              Systemic Risk Network & Financial Intelligence Platform
            </p>
          </div>

          {/* Tactile Clay Tab Buttons */}
          <div className="clay-inset p-1.5 flex items-center rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('institutional')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'institutional'
                  ? 'clay-btn-accent text-white shadow-md scale-[1.02]'
                  : 'text-clay-muted hover:text-clay-text'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Institutional Access</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('researcher')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'researcher'
                  ? 'clay-btn-accent text-white shadow-md scale-[1.02]'
                  : 'text-clay-muted hover:text-clay-text'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Researcher Key</span>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold text-center">
                {errorMessage}
              </div>
            )}

            {activeTab === 'institutional' ? (
              <>
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clay-muted uppercase tracking-wider pl-1">
                    {tAuth('emailLabel')}
                  </label>
                  <div className="clay-input p-3.5 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-clay-accent" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="analyst@investmentbank.com"
                      className="w-full bg-transparent border-none text-sm text-clay-text focus:outline-none placeholder:text-clay-muted/50 font-medium"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between pl-1">
                    <label className="text-xs font-bold text-clay-muted uppercase tracking-wider">
                      {tAuth('passwordLabel')}
                    </label>
                    <a href="#" className="text-[11px] font-semibold text-clay-accent hover:underline">
                      {tAuth('forgotPassword')}
                    </a>
                  </div>
                  <div className="clay-input p-3.5 flex items-center gap-3">
                    <Lock className="w-4 h-4 text-clay-accent" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-transparent border-none text-sm text-clay-text focus:outline-none placeholder:text-clay-muted/50 font-medium"
                    />
                  </div>
                </div>
              </>
            ) : (
              /* Researcher Key Field */
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-clay-muted uppercase tracking-wider pl-1">
                  API Key / Secret Token
                </label>
                <div className="clay-input p-3.5 flex items-center gap-3">
                  <Key className="w-4 h-4 text-clay-accent" />
                  <input
                    type="password"
                    required
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="fg_live_sk_892347982347..."
                    className="w-full bg-transparent border-none text-sm text-clay-text focus:outline-none placeholder:text-clay-muted/50 font-mono"
                  />
                </div>
                <p className="text-[11px] text-clay-muted pl-1">
                  Use your institutional API key for direct programmatic access.
                </p>
              </div>
            )}

            {/* Clay Toggle for 'Remember Device' */}
            <div className="flex items-center justify-between pt-1 pl-1">
              <span className="text-xs font-semibold text-clay-text flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-clay-accent" />
                Remember Device & Session
              </span>
              <button
                type="button"
                onClick={() => setRememberDevice(!rememberDevice)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative shadow-inner ${
                  rememberDevice ? 'bg-clay-accent' : 'bg-black/10 dark:bg-white/10'
                }`}
                role="switch"
                aria-checked={rememberDevice}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                    rememberDevice ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {rememberDevice && <Check className="w-2.5 h-2.5 text-clay-accent" />}
                </div>
              </button>
            </div>

            {/* Full-Width Tactile Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full clay-btn-accent py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{tAuth('signInBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-clay-border w-full" />
            <span className="bg-clay-surface px-3 text-[10px] text-clay-muted font-bold uppercase tracking-widest absolute">
              Single Sign-On
            </span>
          </div>

          {/* Mock OAuth Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              className="clay-btn w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-90 transition-transform"
              title="Sign in with Google"
              aria-label="Google SSO"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('github')}
              className="clay-btn w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-90 transition-transform"
              title="Sign in with GitHub"
              aria-label="GitHub SSO"
            >
              <svg className="w-5 h-5 fill-clay-text" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
