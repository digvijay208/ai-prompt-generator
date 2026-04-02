'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, LogIn, UserPlus, X, Zap, Shield } from 'lucide-react';

interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
  generatedPrompt?: string;
}

export default function AuthPopup({ isOpen, onClose, generatedPrompt }: AuthPopupProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger CSS transition
      requestAnimationFrame(() => {
        setIsVisible(true);
        setIsAnimating(true);
      });
    } else {
      setIsVisible(false);
      setTimeout(() => setIsAnimating(false), 400);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-xl transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Animated ambient glows behind the popup */}
      <div className={`absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 blur-[150px] rounded-full transition-all duration-1000 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`} />
      <div className={`absolute bottom-1/4 right-1/3 w-80 h-80 bg-secondary/20 blur-[120px] rounded-full transition-all duration-1000 delay-200 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`} />

      {/* Popup Card */}
      <div
        className={`relative w-full max-w-lg transform transition-all duration-500 ease-out ${
          isVisible
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-8 scale-95 opacity-0'
        }`}
      >
        <div className="glass-panel rounded-[2rem] p-8 md:p-10 space-y-8 relative overflow-hidden">
          {/* Internal gradient shimmer */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-secondary/[0.06] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/15 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/15 blur-[80px] rounded-full pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-300 z-20"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="text-center space-y-5 relative z-10">
            {/* Animated icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_40px_rgba(0,245,212,0.3)] animate-bounce-slow">
              <Sparkles size={28} className="text-black" />
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-black tracking-tighter text-white">
                You&apos;re on <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">fire!</span> 🔥
              </h2>
              <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto">
                Your first prompt was generated successfully. Create an account to unlock <span className="text-primary font-semibold">unlimited generations</span> and save your history.
              </p>
            </div>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 relative z-10">
            {[
              { icon: Zap, label: 'Unlimited Prompts' },
              { icon: Shield, label: 'Save History' },
              { icon: Sparkles, label: 'Premium Features' },
            ].map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold text-white/60 tracking-wider uppercase"
                style={{ animationDelay: `${i * 100 + 300}ms` }}
              >
                <Icon size={12} className="text-primary" />
                {label}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 relative z-10">
            {/* Primary CTA - Create Account */}
            <button
              onClick={handleRegister}
              className="w-full relative group overflow-hidden py-4 bg-white text-bg-dark font-black rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-[#4cc9f0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-3 z-10 uppercase tracking-[0.15em] text-[13px]">
                <UserPlus size={18} className="transition-transform duration-500 group-hover:scale-110" />
                <span>Create Free Account</span>
              </div>
            </button>

            {/* Secondary CTA - Sign In */}
            <button
              onClick={handleLogin}
              className="w-full py-4 bg-white/[0.04] border border-white/[0.08] text-white/80 font-bold rounded-xl transition-all duration-300 hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-white hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center justify-center gap-3 uppercase tracking-[0.15em] text-[13px]">
                <LogIn size={18} />
                <span>Already have an account? Sign In</span>
              </div>
            </button>
          </div>

          {/* Skip option */}
          <div className="text-center relative z-10">
            <button
              onClick={onClose}
              className="text-[11px] text-white/30 hover:text-white/60 transition-colors tracking-wider uppercase font-medium"
            >
              Maybe later — continue exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
