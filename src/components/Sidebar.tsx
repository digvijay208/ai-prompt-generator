'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, History, Settings, LogOut,
  PanelLeftClose, PanelLeftOpen, Menu, Trash2, Sun, Moon, X
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface SidebarProps {
  history?: { title: string; prompt: string }[];
  onSelectHistory?: (prompt: string) => void;
  onNewPrompt?: () => void;
  onDeleteHistory?: (index: number) => void;
}

const drawerVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 32 },
  },
  closed: {
    x: '-110%',
    opacity: 0,
    transition: { type: 'spring' as const, stiffness: 320, damping: 36 },
  },
};

const backdropVariants = {
  open:   { opacity: 1, transition: { duration: 0.25 } },
  closed: { opacity: 0, transition: { duration: 0.2 } },
};

const floatingBtnVariants = {
  hidden:  { opacity: 0, x: -16, scale: 0.85 },
  visible: {
    opacity: 1, x: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 320, damping: 28, delay: 0.12 },
  },
  exit: { opacity: 0, x: -16, scale: 0.85, transition: { duration: 0.16 } },
};

export default function Sidebar({
  history = [],
  onSelectHistory,
  onNewPrompt,
  onDeleteHistory,
}: SidebarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);   // desktop: collapsed state
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

  useEffect(() => setMounted(true), []);

  // Close mobile drawer on route navigation
  const handleLogout = () => {
    setMobileOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const closeMobile = () => setMobileOpen(false);

  /** Shared sidebar content rendered inside both desktop panel & mobile drawer */
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-primary/10 to-transparent opacity-50 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="p-7 border-b border-white/[0.04] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4 font-bold text-xl tracking-tight text-white/90">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(0,245,212,0.3)] text-bg-dark border border-white/20">
            <Sparkles size={18} fill="currentColor" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            PromptGen
          </span>
        </div>

        {/* Close / collapse button */}
        <motion.button
          onClick={isMobile ? closeMobile : () => setIsOpen(false)}
          title={isMobile ? 'Close menu' : 'Collapse sidebar'}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,245,212,0.08)' }}
          whileTap={{ scale: 0.92 }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-primary border border-transparent hover:border-primary/20 transition-colors duration-200"
        >
          {isMobile ? <X size={17} /> : <PanelLeftClose size={17} />}
        </motion.button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
        <button
          onClick={() => { onNewPrompt && onNewPrompt(); closeMobile(); }}
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
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <button
                  onClick={() => { onSelectHistory && onSelectHistory(item.prompt); closeMobile(); }}
                  className="relative z-10 flex-1 flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.02] text-white/50 hover:text-primary transition-all text-[13px] text-left min-w-0"
                  aria-label={`Load ${item.title}`}
                >
                  <History size={16} className="opacity-40 group-hover/item:text-primary group-hover/item:opacity-100 transition-colors whitespace-nowrap min-w-[16px]" />
                  <span className="truncate flex-1 tracking-wide font-medium">{item.title}</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); if (onDeleteHistory) onDeleteHistory(i); }}
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

      {/* Footer */}
      <div className="p-6 border-t border-white/[0.04] space-y-2 relative z-10">
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
    </>
  );

  return (
    <>
      {/* ══════════ DESKTOP PANEL (lg+) ══════════ */}
      <motion.aside
        className="w-[320px] fixed h-[94vh] left-[1.5vw] top-[3vh] z-[1000] glass-panel rounded-[2rem] hidden lg:flex flex-col shadow-premium border-white/[0.04] overflow-hidden"
        variants={drawerVariants}
        initial="open"
        animate={isOpen ? 'open' : 'closed'}
      >
        <SidebarContent isMobile={false} />
      </motion.aside>

      {/* Desktop re-open pill */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="desktop-open-tab"
            variants={floatingBtnVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsOpen(true)}
            title="Open sidebar"
            className="hidden lg:flex fixed left-4 top-[3vh] z-[1001] items-center gap-2 px-3 py-2.5 rounded-xl bg-[#0d1117]/90 backdrop-blur border border-primary/25 text-primary text-sm font-semibold shadow-[0_0_18px_rgba(0,245,212,0.2)] hover:shadow-[0_0_28px_rgba(0,245,212,0.4)] hover:border-primary/50 hover:scale-105 transition-all duration-200"
          >
            <PanelLeftOpen size={17} />
            <span className="text-xs tracking-wide">Menu</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ══════════ MOBILE HAMBURGER BUTTON (< lg) ══════════ */}
      <AnimatePresence>
        {!mobileOpen && (
          <motion.button
            key="mobile-hamburger"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="lg:hidden fixed top-4 left-4 z-[1001] w-11 h-11 rounded-2xl bg-[#0d1117]/90 backdrop-blur-md border border-primary/25 flex items-center justify-center text-primary shadow-[0_0_16px_rgba(0,245,212,0.2)] hover:shadow-[0_0_24px_rgba(0,245,212,0.4)] hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Menu size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ══════════ MOBILE DRAWER + BACKDROP (< lg) ══════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark backdrop */}
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={closeMobile}
              className="lg:hidden fixed inset-0 z-[1002] bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.aside
              key="mobile-drawer"
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden fixed top-0 left-0 h-full w-[300px] z-[1003] glass-panel flex flex-col shadow-premium border-r border-white/[0.04] overflow-hidden rounded-r-[2rem]"
            >
              <SidebarContent isMobile={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
