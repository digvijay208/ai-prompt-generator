'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Sparkles, History, Settings, LogOut, ChevronLeft, Trash2, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface SidebarProps {
  history?: { title: string; prompt: string }[];
  onSelectHistory?: (prompt: string) => void;
  onNewPrompt?: () => void;
  onDeleteHistory?: (index: number) => void;
}

export default function Sidebar({ history = [], onSelectHistory, onNewPrompt, onDeleteHistory }: SidebarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
  };
  return (
    <aside className="w-[320px] fixed h-[94vh] left-[1.5vw] top-[3vh] z-[1000] glass-panel rounded-[2rem] hidden lg:flex flex-col animate-in fade-in slide-in-from-left-8 duration-700 shadow-premium border-white/[0.04]">
      
      {/* Sidebar background glow */}
      <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-primary/10 to-transparent opacity-50 blur-2xl pointer-events-none" />

      <div className="p-8 border-b border-white/[0.04] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4 font-bold text-xl tracking-tight text-white/90">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(0,245,212,0.3)] text-bg-dark border border-white/20">
            <Sparkles size={18} fill="currentColor" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">PromptGen</span>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
        <button 
          onClick={() => onNewPrompt && onNewPrompt()}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-primary to-[#4cc9f0] text-bg-dark font-black rounded-2xl shadow-[0_5px_20px_rgba(0,245,212,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(0,245,212,0.4)] active:scale-[0.98] text-[12px] tracking-[0.1em] uppercase mb-8"
        >
          <Sparkles size={16} fill="currentColor" />
          Initialize New
        </button>

        <div className="pt-2 px-3 text-[10px] font-black text-white/20 tracking-[0.25em] uppercase mb-4">
          Session History
        </div>
        
        <div className="space-y-1.5">
          {history.length > 0 ? (
            history.map((item, i) => (
              <div key={i} className="flex items-center w-full group/item relative overflow-hidden rounded-xl">
                {/* Background hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <button 
                  onClick={() => onSelectHistory && onSelectHistory(item.prompt)}
                  className="relative z-10 flex-1 flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] text-white/50 hover:text-primary transition-all text-[13px] text-left min-w-0"
                  aria-label={`Load ${item.title}`}
                >
                  <History size={16} className="opacity-40 group-hover/item:text-primary group-hover/item:opacity-100 transition-colors whitespace-nowrap min-w-[16px]" />
                  <span className="truncate flex-1 tracking-wide font-medium">{item.title}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDeleteHistory) onDeleteHistory(i);
                  }}
                  className="relative z-10 px-4 py-3.5 hover:bg-error/10 text-white/20 hover:text-error transition-all opacity-0 group-hover/item:opacity-100 flex-shrink-0"
                  title="Delete prompt"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-xs text-white/20 italic text-center bg-white/[0.01] rounded-2xl border border-white/[0.02] mt-4">
              No previous architectures found
            </div>
          )}
        </div>
      </nav>

      <div className="p-6 border-t border-white/[0.04] space-y-2 background-blur-md relative z-10">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/[0.03] text-white/50 hover:text-white transition-all text-sm font-semibold tracking-wide border border-transparent hover:border-white/[0.05]"
        >
          {mounted ? (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />) : <div className="w-[18px] h-[18px]" />}
          {mounted ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : 'Toggle Theme'}
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-white/[0.03] text-white/50 hover:text-white transition-all text-sm font-semibold tracking-wide border border-transparent hover:border-white/[0.05]">
          <Settings size={18} />
          System Config
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-error/10 text-white/50 hover:text-error transition-all text-sm font-semibold tracking-wide border border-transparent hover:border-error/20"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
