'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PromptForm from '@/components/PromptForm';
import ResultPanel from '@/components/ResultPanel';

export default function Dashboard() {
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<{title: string, prompt: string}[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token) {
      router.push('/login');
    }

    const historyKey = userId ? `prompt_history_${userId}` : 'prompt_history';
    const savedHistory = localStorage.getItem(historyKey);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, [router]);

  const handleGenerate = (prompt: string) => {
    if (!prompt) return;
    
    setGeneratedPrompt(prompt);
    
    // Create a title based on the first few words of the prompt
    let title = typeof prompt === 'string' ? prompt.split(' ').slice(0, 4).join(' ').replace(/[^a-zA-Z0-9 ]/g, '') : 'New Prompt';
    if (!title) title = 'New Prompt';
    
    // Update history
    const newHistory = [{ title, prompt }, ...history].slice(0, 15);
    setHistory(newHistory);
    const userId = localStorage.getItem('userId');
    const historyKey = userId ? `prompt_history_${userId}` : 'prompt_history';
    localStorage.setItem(historyKey, JSON.stringify(newHistory));
  };

  const handleDeleteHistory = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    const userId = localStorage.getItem('userId');
    const historyKey = userId ? `prompt_history_${userId}` : 'prompt_history';
    localStorage.setItem(historyKey, JSON.stringify(newHistory));
  };

  return (
    <main className="min-h-screen flex selection:bg-primary/30 selection:text-white relative z-0">
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none z-0" />
      <div className="fixed top-[-10%] left-[20%] w-[50%] h-[50%] bg-secondary/10 blur-[150px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
      <div className="fixed bottom-[-10%] right-[10%] w-[40%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />

      <Sidebar 
        history={history} 
        onSelectHistory={(prompt) => setGeneratedPrompt(prompt)} 
        onNewPrompt={() => setGeneratedPrompt('')} 
        onDeleteHistory={handleDeleteHistory}
      />
      
      <div className="flex-1 ml-0 lg:ml-[320px] p-6 lg:p-12 transition-all duration-500 overflow-y-auto z-10 relative">
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 pt-16 lg:pt-4 relative">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-bold text-white/70 tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.02)] animate-float">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                INTELLIGENT UI v2.0
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white mb-4">
                Prompt<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#4cc9f0] to-secondary drop-shadow-[0_0_30px_rgba(0,245,212,0.3)]">Generator</span>
              </h1>
              <p className="text-white/40 text-[11px] font-bold tracking-[0.3em] uppercase max-w-xl border-l-2 border-primary/50 pl-4 py-1">
                Engineer the perfect context architecture for any LLM
              </p>
            </div>
            
            <div className="status-badge shrink-0 mt-4 sm:mt-0">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              SYSTEM ONLINE
            </div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-8 xl:gap-10 items-stretch pb-24 relative z-10">
            <PromptForm 
               onGenerate={handleGenerate} 
               isGenerating={isGenerating}
               setIsGenerating={setIsGenerating}
            />
            <ResultPanel 
              prompt={generatedPrompt} 
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
