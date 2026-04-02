'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Terminal, Layers, Zap, Check } from 'lucide-react';

interface PromptFormProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
  isAuthenticated?: boolean;
}

export default function PromptForm({ onGenerate, isGenerating, setIsGenerating, isAuthenticated }: PromptFormProps) {
  const [mounted, setMounted] = useState(false);
  const [options, setOptions] = useState({
    purpose: 'Select a purpose',
    subject: '',
    details: '',
    tone: 'Professional',
    format: 'Paragraph',
    includeExamples: true,
    stepByStep: false,
    citeSources: false,
    targetModel: 'GPT-4'
  });

  useEffect(() => {
    setMounted(true);
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!options.subject && !options.details) return;

    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ userInput: options.subject || options.details, options })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate prompt');
      }
      
      if (data.prompt) {
        onGenerate(data.prompt);
      } else {
        throw new Error('No prompt returned from the server');
      }
    } catch (error: any) {
      console.error(error);
      onGenerate(`Error generating prompt:\n\n${error.message}\n\nPlease check your API key and connection.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-panel p-6 md:p-8 rounded-[2rem] space-y-8 flex flex-col relative group/panel">
      {/* Background ambient lighting for form */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover/panel:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]" />
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover/panel:opacity-100 transition-opacity duration-1000" />
      
      <div className="flex items-center justify-between pb-6 border-b border-white/[0.04] relative z-10">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-4 text-white">
          <div className="p-2.5 rounded-xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 text-white group-hover/panel:text-primary transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <Terminal size={20} />
          </div>
          Configuration
        </h2>
        <div className="flex gap-2 opacity-50">
          <div className="w-2 h-2 rounded-full bg-white/30 group-hover/panel:bg-primary/50 transition-colors" />
          <div className="w-2 h-2 rounded-full bg-white/30 group-hover/panel:bg-primary/50 transition-colors delay-75" />
          <div className="w-2 h-2 rounded-full bg-white/30 group-hover/panel:bg-primary/50 transition-colors delay-150" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7 flex-1 relative z-10">
        {/* Purpose */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary/50"></span> Base Purpose
          </label>
          <div className="relative group/input">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl blur opacity-0 group-hover/input:opacity-100 transition duration-500"></div>
            <select 
              value={options.purpose}
              onChange={(e) => setOptions({...options, purpose: e.target.value})}
              className="form-input-modern relative appearance-none pr-10 hover:bg-black/40"
            >
              <option className="bg-[#0f111a]">Select a purpose</option>
              <option className="bg-[#0f111a]">Answer a question</option>
              <option className="bg-[#0f111a]">Generate content</option>
              <option className="bg-[#0f111a]">Analyze data</option>
              <option className="bg-[#0f111a]">Summarize text</option>
              <option className="bg-[#0f111a]">Translate text</option>
              <option className="bg-[#0f111a]">Write code</option>
              <option className="bg-[#0f111a]">Creative writing</option>
              <option className="bg-[#0f111a]">Image generation</option>
              <option className="bg-[#0f111a]">Video generation</option>
              <option className="bg-[#0f111a]">3D model</option>
              <option className="bg-[#0f111a]">Other</option>
            </select>
            <Layers className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 group-hover/input:text-primary transition-colors pointer-events-none" size={18} />
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-secondary/50"></span> Subject / Context
          </label>
          <div className="relative group/input">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary/30 to-primary/30 rounded-xl blur opacity-0 group-hover/input:opacity-100 transition duration-500"></div>
            <input
              type="text"
              value={options.subject}
              onChange={(e) => setOptions({...options, subject: e.target.value})}
              className="form-input-modern relative hover:bg-black/40 text-[14px]"
              placeholder="e.g. Next.js performance optimization..."
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 flex-1 flex flex-col">
          <label className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-accent/50"></span> Specific Constraints
          </label>
          <div className="relative group/input flex-1 flex flex-col">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/30 to-secondary/30 rounded-xl blur opacity-0 group-hover/input:opacity-100 transition duration-500"></div>
            <textarea
              value={options.details}
              onChange={(e) => setOptions({...options, details: e.target.value})}
              className="form-input-modern relative h-36 md:h-44 resize-none hover:bg-black/40 text-[14px] leading-relaxed"
              placeholder="Describe constraints. E.g. 'Only use native browser APIs, avoid external packages'."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 py-2">
          {/* Tone */}
          <div className="space-y-3 relative group/input">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Style</label>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-white/10 rounded-xl blur opacity-0 group-hover/input:opacity-100 transition duration-500 top-6"></div>
            <select 
              value={options.tone}
              onChange={(e) => setOptions({...options, tone: e.target.value})}
              className="form-input-modern relative appearance-none text-sm px-4 hover:bg-black/40"
            >
              <option className="bg-[#0f111a]">Professional</option>
              <option className="bg-[#0f111a]">Academic</option>
              <option className="bg-[#0f111a]">Casual</option>
              <option className="bg-[#0f111a]">Friendly</option>
              <option className="bg-[#0f111a]">Humorous</option>
              <option className="bg-[#0f111a]">Persuasive</option>
              <option className="bg-[#0f111a]">Technical</option>
              <option className="bg-[#0f111a]">Photorealistic</option>
              <option className="bg-[#0f111a]">Anime</option>
              <option className="bg-[#0f111a]">Cinematic</option>
              <option className="bg-[#0f111a]">3D Render</option>
              <option className="bg-[#0f111a]">Digital Art</option>
              <option className="bg-[#0f111a]">Concept Art</option>
              <option className="bg-[#0f111a]">Creative</option>
            </select>
          </div>
          {/* Output Format */}
          <div className="space-y-3 relative group/input">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Format</label>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary/30 to-white/10 rounded-xl blur opacity-0 group-hover/input:opacity-100 transition duration-500 top-6"></div>
            <select 
              value={options.format}
              onChange={(e) => setOptions({...options, format: e.target.value})}
              className="form-input-modern relative appearance-none text-sm px-4 hover:bg-black/40"
            >
              <option className="bg-[#0f111a]">Paragraph</option>
              <option className="bg-[#0f111a]">Bullet Points</option>
              <option className="bg-[#0f111a]">Step-by-Step</option>
              <option className="bg-[#0f111a]">Clean Code</option>
            </select>
          </div>
        </div>

        {/* Checkbox Options */}
        <div className="pt-2 flex flex-wrap gap-5 bg-white/[0.02] p-4 rounded-xl border border-white/[0.03]">
          {[
            { id: 'includeExamples', label: 'Examples', field: 'includeExamples' },
            { id: 'stepByStep', label: 'Steps', field: 'stepByStep' },
            { id: 'citeSources', label: 'Sources', field: 'citeSources' }
          ].map(({ id, label, field }) => (
            <label key={id} className="flex items-center gap-3 cursor-pointer group hover:opacity-100 opacity-70 transition-opacity">
              <div className="relative w-5 h-5 rounded-[4px] border border-white/20 bg-black/40 flex items-center justify-center transition-all duration-300 group-hover:border-primary/50 overflow-hidden shadow-inner">
                <input 
                  type="checkbox" 
                  checked={(options as any)[field]}
                  onChange={(e) => setOptions({...options, [field]: e.target.checked})}
                  className="absolute opacity-0 w-0 h-0" 
                />
                <div className={`absolute inset-0 bg-gradient-to-br from-primary to-secondary transition-transform duration-300 ${((options as any)[field]) ? 'scale-100' : 'scale-0'}`} />
                {((options as any)[field]) && <Check size={14} className="relative z-10 text-white font-bold" strokeWidth={4} />}
              </div>
              <span className="text-[12px] font-bold text-white/80 uppercase tracking-widest leading-none mt-0.5">{label}</span>
            </label>
          ))}
        </div>

        <div className="pt-6 relative">
          <div className="absolute inset-x-0 -top-6 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          
          <button
            type="submit"
            disabled={isGenerating || (!options.subject && !options.details)}
            className="w-full relative group overflow-hidden py-4 bg-white text-bg-dark font-black rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:bg-white/5 disabled:text-white/40 disabled:hover:scale-100 border border-transparent disabled:border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] disabled:shadow-none"
          >
            {/* Button internal gradient hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-[#4cc9f0] opacity-0 group-hover:opacity-100 group-disabled:hidden transition-opacity duration-300" />
            
            <div className="relative flex items-center justify-center gap-3 z-10 uppercase tracking-[0.15em] text-[13px]">
              {isGenerating ? (
                <>
                  <Zap className="animate-pulse text-white" size={18} fill="currentColor" />
                  <span className="text-white">Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} className="transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                  <span>Generate Structure</span>
                </>
              )}
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
