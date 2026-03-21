'use client';

import { useState } from 'react';
import { Layers, Copy, Check, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultPanelProps {
  prompt: string;
  isGenerating: boolean;
}

export default function ResultPanel({ prompt, isGenerating }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-6 md:p-8 rounded-[2rem] space-y-8 min-h-[600px] flex flex-col relative group/panel">
      
      <div className="absolute inset-0 bg-gradient-to-bl from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover/panel:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover/panel:opacity-100 transition-opacity duration-1000" />

      <div className="flex items-center justify-between pb-6 border-b border-white/[0.04] relative z-10">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-4 text-white">
          <div className="p-2.5 rounded-xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 text-white group-hover/panel:text-secondary transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <Layers size={20} />
          </div>
          Output Generation
        </h2>
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-pulse shadow-[0_0_10px_rgba(0,245,212,0.5)]" />
        </div>
      </div>

      <div className="flex-1 relative z-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div 
              key="generating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col items-center justify-center space-y-8"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full border border-white/5 bg-white/[0.02] shadow-inner" />
                <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin shadow-[0_0_20px_rgba(0,245,212,0.3)]" />
                <div className="absolute inset-0 border-b-2 border-secondary rounded-full animate-spin animation-delay-500 shadow-[0_0_20px_rgba(157,78,221,0.3)]" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="text-white animate-pulse" size={28} />
                </div>
              </div>
              <div className="text-center space-y-4 flex flex-col items-center">
                <p className="text-white text-[11px] font-bold tracking-[0.4em] uppercase opacity-80 text-shadow-glow-cyan">
                  Synthesizing Architecture
                </p>
                <div className="h-1 w-64 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
                  />
                </div>
              </div>
            </motion.div>
          ) : prompt ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col space-y-6"
            >
              <div className="flex-1 relative group/code bg-black/50 border border-white/[0.06] rounded-[1.5rem] p-6 lg:p-8 font-mono text-[13px] leading-relaxed text-slate-300 whitespace-pre-wrap selection:bg-primary/30 selection:text-white shadow-inner overflow-auto max-h-[550px] custom-scrollbar z-10 transition-colors hover:border-white/[0.1] hover:bg-black/60">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] pointer-events-none" />
                {prompt}
              </div>
              
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={handleCopy}
                  className="flex-1 relative group overflow-hidden flex items-center justify-center gap-3 py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 rounded-xl transition-all font-bold text-[11px] tracking-[0.15em] uppercase text-white shadow-sm"
                >
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {copied ? <Check className="text-success scale-110 transition-transform" size={18} /> : <Copy size={18} className="group-hover:scale-110 transition-transform" />}
                  {copied ? 'Copied to Clipboard' : 'Copy Architecture'}
                </button>
                <button className="px-6 flex items-center justify-center bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 rounded-xl transition-all group shadow-sm text-white">
                  <RefreshCw className="group-hover:rotate-180 transition-transform duration-700 text-white/50 group-hover:text-white" size={18} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center select-none"
            >
               <div className="relative mb-8">
                 <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full" />
                 <div className="p-8 rounded-full bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.08] shadow-[0_0_30px_rgba(255,255,255,0.02)] relative z-10 dark:shadow-[0_0_30px_rgba(255,255,255,0.02)] light:shadow-none">
                   <Sparkles size={48} className="text-white/20 dark:text-white/20 text-[#6F4114]" strokeWidth={1.5} />
                 </div>
               </div>
               <p className="text-[11px] font-bold tracking-[0.4em] text-white/30 dark:text-white/30 text-[#6F4114] uppercase">System Ready</p>
               <div className="mt-4 flex gap-1.5 opacity-20 dark:opacity-20 opacity-60">
                 <div className="w-1 h-3 bg-white dark:bg-white bg-[#341F09] rounded-full animate-pulse" />
                 <div className="w-1 h-2 bg-white dark:bg-white bg-[#341F09] rounded-full animate-pulse delay-75" />
                 <div className="w-1 h-4 bg-white dark:bg-white bg-[#341F09] rounded-full animate-pulse delay-150" />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
