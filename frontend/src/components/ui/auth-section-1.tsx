"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import loginBg from "../../assets/login.jpeg";

const formFields = [
  { label: "First Name", value: "Harshit", type: "text" },
  { label: "Last Name", value: "Sharma", type: "text" },
];

const termsText = (
  <>
    By creating an account, you agree to our{" "}
    <a
      href="#terms"
      onClick={(e) => e.preventDefault()}
      className="font-medium text-black/45 underline underline-offset-2 dark:text-white/45"
    >
      Terms and Services
    </a>{" "}
    and{" "}
    <a
      href="#privacy"
      onClick={(e) => e.preventDefault()}
      className="font-medium text-black/45 underline underline-offset-2 dark:text-white/45"
    >
      Privacy Policy
    </a>
  </>
);

export interface AuthSectionOneProps {
  onLogin?: (email?: string, name?: string) => void;
  onClose?: () => void;
}

export default function AuthSectionOne({ onLogin, onClose }: AuthSectionOneProps = {}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onLogin) {
      const displayName = isSignUp && (firstName || lastName)
        ? `${firstName} ${lastName}`.trim()
        : email ? email.split("@")[0] : "Institutional Analyst";
      onLogin(email || "analyst@fingraph.institution", displayName);
    }
  };

  const handleQuickDemo = () => {
    if (onLogin) {
      onLogin("demo.analyst@fingraph.institution", "Guest Quantitative Analyst");
    }
  };

  return (
    <section className="min-h-screen bg-white p-3 text-black antialiased [font-synthesis:none] dark:bg-[#050505] dark:text-white relative">
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="absolute top-6 right-6 z-50 px-4 py-2 rounded-full bg-slate-900/75 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/20 shadow-md transition-all cursor-pointer flex items-center gap-2 text-sm font-medium"
          title="Return to Landing Page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Landing</span>
        </button>
      )}

      <div className="grid min-h-[calc(100vh-1.5rem)] gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        <div className="flex min-h-[760px] items-start rounded-md border border-black/20 bg-white px-6 py-12 sm:px-10 dark:border-white/10 dark:bg-[#0a0a0a] lg:min-h-0 lg:px-14 lg:py-24 xl:px-20">
          <div className="mx-auto w-full max-w-[590px]">
            <div>
              <h1 className="whitespace-nowrap text-3xl font-medium tracking-[-0.04em] sm:text-4xl lg:text-[42px] lg:leading-[1.05] xl:text-[50px]">
                {isSignUp ? "Create an account" : "Sign in to account"}
              </h1>
              <p className="mt-3 whitespace-nowrap text-lg leading-snug text-black/60 dark:text-white/55 sm:text-xl lg:text-2xl xl:text-3xl">
                {isSignUp ? "Brainstorm in chat, build in cowork" : "Autonomous Causal Market Intelligence"}
              </p>
            </div>

            {/* Toggle between Log In and Sign Up */}
            <div className="mt-8 flex items-center gap-6 border-b border-black/10 pb-3 dark:border-white/10">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`text-lg font-medium transition-colors cursor-pointer ${
                  !isSignUp
                    ? "border-b-2 border-black pb-3 text-black dark:border-white dark:text-white"
                    : "text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`text-lg font-medium transition-colors cursor-pointer ${
                  isSignUp
                    ? "border-b-2 border-black pb-3 text-black dark:border-white dark:text-white"
                    : "text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Quick Demo Login Option */}
            <button
              type="button"
              onClick={handleQuickDemo}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] border border-emerald-500/40 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-500/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50 text-base font-semibold transition-all cursor-pointer shadow-xs"
            >
              <span>⚡ Quick Demo Login (Skip directly to Dashboard)</span>
            </button>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <SocialButton
                onClick={() => handleSubmit()}
                icon={<GoogleIcon />}
                label={isSignUp ? "Sign up with Google" : "Sign in with Google"}
              />
              <SocialButton
                onClick={() => handleSubmit()}
                icon={<AppleIcon />}
                label={isSignUp ? "Sign up with Apple" : "Sign in with Apple"}
              />
            </div>

            <div className="my-8 text-center text-xl font-medium text-black/60 dark:text-white/50">
              or
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <FieldBox
                    label="First Name"
                    value={firstName}
                    onChangeVal={setFirstName}
                  />
                  <FieldBox
                    label="Last Name"
                    value={lastName}
                    onChangeVal={setLastName}
                  />
                </div>
              )}

              <FieldBox
                label="Email"
                value={email}
                type="email"
                onChangeVal={setEmail}
              />
              <FieldBox
                label="Password"
                value={password}
                type="password"
                onChangeVal={setPassword}
              />

              <div className="space-y-4 pt-2 text-sm leading-5 text-black/30 dark:text-white/35 sm:text-[15px]">
                <CheckboxLine>
                  I don't want to receive emails about solaceui feature updates
                </CheckboxLine>
                <CheckboxLine>{termsText}</CheckboxLine>
              </div>

              <button
                type="submit"
                className="mt-9 flex h-12 w-full items-center justify-center rounded-[10px] border border-black/40 bg-black text-xl font-medium text-white transition-colors hover:bg-black/85 dark:border-white/40 dark:bg-white dark:text-black dark:hover:bg-white/85 cursor-pointer"
              >
                {isSignUp ? "Sign Up" : "Submit"}
              </button>

              <div className="pt-3 text-center text-sm text-black/60 dark:text-white/60">
                {isSignUp ? (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(false)}
                      className="font-medium underline underline-offset-2 text-black dark:text-white cursor-pointer"
                    >
                      Log in
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(true)}
                      className="font-medium underline underline-offset-2 text-black dark:text-white cursor-pointer"
                    >
                      Sign up
                    </button>
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="relative flex min-h-[720px] overflow-hidden rounded-md bg-black text-white lg:min-h-0 border border-black/10 dark:border-white/10 shadow-xs">
          <img
            src={loginBg}
            alt="Findy - Financial news, that helps you see the bigger picture."
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}

function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 items-center justify-center gap-2 rounded-[10px] border border-black/25 bg-white px-3 text-sm leading-none text-black transition-colors hover:bg-black/[0.03] dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 xl:text-[19px] cursor-pointer"
    >
      <span className="shrink-0">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function FieldBox({
  label,
  value,
  type = "text",
  onChangeVal,
}: {
  label: string;
  value: string;
  type?: string;
  onChangeVal?: (v: string) => void;
}) {
  const [inputValue, setInputValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <label className="flex h-14 items-center justify-between gap-4 rounded-[10px] border border-black/25 bg-white px-5 text-lg leading-none dark:border-white/15 dark:bg-white/5 xl:text-xl">
      <input
        type={type}
        value={inputValue}
        aria-label={label}
        onFocus={() => {
          if (!isEditing) {
            setInputValue("");
            setIsEditing(true);
          }
        }}
        onChange={(event) => {
          setInputValue(event.target.value);
          setIsEditing(true);
          if (onChangeVal) onChangeVal(event.target.value);
        }}
        className="min-w-0 flex-1 truncate bg-transparent text-black/30 outline-none placeholder:text-black/30 dark:text-white/35 dark:placeholder:text-white/35"
      />
      {!isEditing && (
        <span className="shrink-0 text-black dark:text-white">{label}</span>
      )}
    </label>
  );
}

function CheckboxLine({ children }: { children: ReactNode }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <span className="relative mt-1 size-3.5 shrink-0">
        <input
          type="checkbox"
          className="peer size-full appearance-none rounded-[2px] border border-black/25 bg-white checked:border-black checked:bg-black dark:border-white/30 dark:bg-white/5 dark:checked:border-white dark:checked:bg-white"
        />
        <svg
          viewBox="0 0 12 12"
          className="pointer-events-none absolute inset-0 hidden size-full p-0.5 text-white peer-checked:block dark:text-black"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 6.2 5 8.1 9 3.9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{children}</span>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
        fill="#EB4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.05 12.54c-.03-3.02 2.47-4.47 2.58-4.54-1.41-2.06-3.6-2.34-4.38-2.37-1.86-.19-3.64 1.1-4.58 1.1-.95 0-2.42-1.07-3.98-1.04-2.05.03-3.94 1.19-4.99 3.02-2.13 3.69-.54 9.16 1.53 12.15 1.01 1.46 2.22 3.1 3.81 3.04 1.53-.06 2.11-.99 3.96-.99s2.37.99 3.99.96c1.65-.03 2.69-1.49 3.69-2.96 1.16-1.69 1.64-3.33 1.66-3.41-.04-.02-3.2-1.23-3.24-4.87ZM14.03 3.66c.84-1.02 1.41-2.43 1.25-3.84-1.21.05-2.68.81-3.55 1.83-.78.9-1.46 2.34-1.28 3.72 1.35.1 2.73-.69 3.58-1.71Z" />
    </svg>
  );
}

function WindowsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 4.7 10.7 3.6v7.7H3V4.7Zm8.8-1.25L21 2.1v9.2h-9.2V3.45ZM3 12.7h7.7v7.7L3 19.3v-6.6Zm8.8 0H21v9.2l-9.2-1.3v-7.9Z" />
    </svg>
  );
}
