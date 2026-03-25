'use client';

import { useState } from 'react';
import { Sparkles, Mail, Lock, User, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (email && password && name) {
      setIsLoading(true);
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name })
        });
        
        const data = await res.json();
        
        if (res.ok) {
          localStorage.setItem('token', data.token);
          if (data.userId) {
            localStorage.setItem('userId', data.userId);
          }
          router.push('/');
        } else {
          setError(data.message || 'Registration failed');
        }
      } catch (err) {
        setError('An error occurred during registration');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="login-card glass-panel p-12 rounded-[32px] w-full max-w-md space-y-8 animate-entrance z-10">
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(0,210,255,0.4)]">
            <UserPlus size={24} className="text-black" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            Create Account
          </h1>
          <p className="text-[10px] tracking-[0.2em] font-bold text-text-secondary uppercase">
            JOIN THE CONVERSATION
          </p>
        </div>

        {error && (<div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm text-center">{error}</div>)}<form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-white/5 border border-glass-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-glass-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white/5 border border-glass-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-text-secondary">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-black font-black rounded-xl shadow-[0_0_30px_rgba(0,210,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-sm mt-4"
          >
            SIGN UP
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-text-secondary">
            Already have an account? <Link href="/login" className="text-primary hover:underline font-bold">SIGN IN</Link>
          </p>
        </div>
      </div>

      <div className="fixed inset-0 bg-midnight-flow -z-10" />
    </main>
  );
}
