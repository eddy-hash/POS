'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ScanLine, PackageSearch, Receipt } from "lucide-react";

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20.4H24v7.2h11.3c-1.6 4.6-6 7.9-11.3 7.9-6.9 0-12.5-5.6-12.5-12.5S17.1 10.5 24 10.5c3.2 0 6.1 1.2 8.3 3.2l5.1-5.1C34.5 5.4 29.5 3.4 24 3.4 12.7 3.4 3.4 12.7 3.4 24S12.7 44.6 24 44.6c11 0 21-8 21-20.6 0-1.2-.1-2.4-.4-3.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l5.9 4.3C13.8 15.2 18.6 12.4 24 12.4c3.2 0 6.1 1.2 8.3 3.2l5.1-5.1C34.5 7.4 29.5 5.4 24 5.4c-7.6 0-14.1 4.3-17.7 10.6z"
    />
    <path
      fill="#4CAF50"
      d="M24 44.6c5.4 0 10.3-1.9 14-5.1l-5.6-4.9c-2 1.5-4.7 2.6-8.4 2.6-5.3 0-9.7-3.3-11.3-7.9l-5.9 4.5c3.5 6.3 10.1 10.8 17.2 10.8z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20.4H24v7.2h11.3c-.8 2.2-2.2 4.1-4 5.4l5.6 4.9c-.4.3 5.6-4.4 5.6-13.5 0-1.2-.1-2.4-.4-3.5z"
    />
  </svg>
);

const Barcode: React.FC<{ className?: string; scan?: boolean }> = ({ className = "", scan = false }) => {
  const widths = [2, 1, 3, 1, 1, 2, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 1, 4, 1, 2, 3, 1, 1, 2, 1, 3];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="flex h-full items-stretch gap-[2px]">
        {widths.map((w, i) => (
          <div key={i} style={{ width: `${w * 2}px` }} className="bg-current" />
        ))}
      </div>
      {scan && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-transparent via-[#D9A62E]/80 to-transparent animate-[scan_2.6s_ease-in-out_infinite]" />
      )}
    </div>
  );
};

interface TallyLoginFormProps {
  onSubmit: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export default function TallyLoginForm({ onSubmit, loading = false, error = null }: TallyLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || loading) return;
    setIsLoading(true);
    try {
      await onSubmit(email, password, rememberMe);
    } catch (err) {
      // Error handled by parent
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitting = isLoading || loading;

  return (
    <div className="min-h-screen w-full bg-[#EFEFE6] flex items-center justify-center p-4">
      <style>{`
        @keyframes scan {
          0% { transform: translateX(-10%); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateX(1050%); opacity: 0; }
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rise { animation: riseIn 0.5s ease-out both; }
      `}</style>

      <div className="w-full max-w-4xl grid md:grid-cols-[1.05fr_1fr] rounded-[28px] overflow-hidden shadow-[0_30px_80px_-30px_rgba(18,35,28,0.45)] bg-white">
        {/* Brand panel */}
        <div className="relative hidden md:flex flex-col justify-between bg-[#12231C] text-[#F3F1E7] p-10 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06]"
               style={{ backgroundImage: "radial-gradient(circle, #FFFFFF 1px, transparent 1px)", backgroundSize: "16px 16px" }} />

          <div className="relative">
            <div className="flex items-center gap-2 text-[#D9A62E]">
              <Receipt className="h-5 w-5" />
              <span className="font-mono tracking-[0.2em] text-xs uppercase">Tally</span>
            </div>
            <h1 className="mt-8 font-bold text-3xl leading-tight">
              Every sale,<br />tracked to the cent.
            </h1>
            <p className="mt-3 text-sm text-[#C9D2C7] max-w-xs">
              Point of sale and inventory, kept on one ledger — from the till to the stockroom.
            </p>
          </div>

          <div className="relative rise" style={{ animationDelay: "120ms" }}>
            <div className="rounded-xl bg-[#0E1B15] border border-white/10 p-4 font-mono text-xs text-[#C9D2C7]">
              <div className="flex justify-between text-[#8FA396] uppercase tracking-wider text-[10px] mb-2">
                <span>Today's tally</span>
                <span>Live</span>
              </div>
              <div className="flex justify-between py-1 border-t border-white/5">
                <span>Net sales</span>
                <span className="text-[#F3F1E7]">$4,281.50</span>
              </div>
              <div className="flex justify-between py-1 border-t border-white/5">
                <span>Transactions</span>
                <span className="text-[#F3F1E7]">96</span>
              </div>
              <div className="flex justify-between py-1 border-t border-white/5 text-[#E7B84B]">
                <span className="flex items-center gap-1"><PackageSearch className="h-3 w-3" /> Low stock</span>
                <span>6 items</span>
              </div>
            </div>
          </div>

          <div className="relative mt-6 flex items-center gap-3 text-[#F3F1E7]/70">
            <Barcode className="h-8 flex-1" scan />
            <span className="font-mono text-[10px] tracking-widest">STAFF-ACCESS</span>
          </div>
        </div>

        {/* Sign-in card */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="rise">
            <span className="font-mono text-[11px] tracking-[0.25em] text-[#1F6F54] uppercase">
              Staff sign in
            </span>
            <h2 className="mt-2 font-bold text-2xl text-[#14181C]">
              Open your register
            </h2>
          </div>

          {error && (
            <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div className="rise" style={{ animationDelay: "160ms" }}>
              <label htmlFor="email" className="block text-xs font-medium text-[#4B5147] mb-1.5">
                Work email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F86]" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourshop.com"
                  className="w-full rounded-xl border border-[#14181C]/15 bg-[#F8F9F4] pl-10 pr-3 py-3 text-sm text-[#14181C] placeholder:text-[#8A8F86] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F54] focus:border-[#1F6F54] focus:bg-white"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="rise" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-[#4B5147]">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-[#1F6F54] hover:text-[#164F3C]">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F86]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#14181C]/15 bg-[#F8F9F4] pl-10 pr-10 py-3 text-sm text-[#14181C] placeholder:text-[#8A8F86] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F54] focus:border-[#1F6F54] focus:bg-white"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8F86] hover:text-[#14181C] focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 pt-1 rise" style={{ animationDelay: "230ms" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#14181C]/25 text-[#1F6F54] focus:ring-[#1F6F54]"
                disabled={isSubmitting}
              />
              <span className="text-xs text-[#4B5147]">Keep this register signed in</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rise w-full flex items-center justify-center gap-2 rounded-xl bg-[#14181C] px-4 py-3 text-sm font-semibold text-[#F3F1E7] transition hover:bg-[#1F6F54] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F54] focus-visible:ring-offset-2 disabled:opacity-70"
              style={{ animationDelay: "260ms" }}
            >
              {isSubmitting ? (
                <>
                  <ScanLine className="h-4 w-4 animate-pulse" />
                  Scanning credentials…
                </>
              ) : (
                <>
                  Open register
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 rise" style={{ animationDelay: "280ms" }}>
            <div className="h-px flex-1 border-t border-dashed border-[#14181C]/15" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8F86]">
              or continue with
            </span>
            <div className="h-px flex-1 border-t border-dashed border-[#14181C]/15" />
          </div>

          <button
            onClick={() => {}}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-[#14181C]/15 bg-white px-4 py-3 text-sm font-medium text-[#14181C] transition hover:border-[#14181C]/30 hover:bg-[#F8F9F4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6F54] focus-visible:ring-offset-2 disabled:opacity-60 rise"
            style={{ animationDelay: "300ms" }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs text-[#8A8F86] rise" style={{ animationDelay: "330ms" }}>
            New to Tally?{" "}
            <Link href="/register" className="font-medium text-[#1F6F54] hover:text-[#164F3C]">
              Set up your shop
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
