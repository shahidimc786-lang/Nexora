import React, { useState } from 'react';
import { 
  Code2, 
  Smartphone, 
  Globe, 
  Layers, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Shield, 
  Database
} from 'lucide-react';

export const TechVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stack' | 'architecture' | 'code'>('stack');

  return (
    <div id="tech-visual-container" className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Background radial glow accents */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glass Console Card */}
      <div className="relative rounded-2xl bg-[#0d1322]/85 border border-white/[0.1] shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden p-5 sm:p-6">
        {/* Top Console Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs font-mono text-slate-400">nexora-engine://v2.4.production</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>ACTIVE BUILD</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mb-4 bg-white/[0.03] p-1 rounded-xl border border-white/[0.05]">
          <button
            type="button"
            id="tab-tech-stack"
            onClick={() => setActiveTab('stack')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'stack'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Tech Matrix</span>
          </button>
          <button
            type="button"
            id="tab-tech-architecture"
            onClick={() => setActiveTab('architecture')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'architecture'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </button>
          <button
            type="button"
            id="tab-tech-code"
            onClick={() => setActiveTab('code')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'code'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Clean Code</span>
          </button>
        </div>

        {/* Content View Based on Tab */}
        {activeTab === 'stack' && (
          <div className="space-y-4">
            {/* Center Visual Diagram */}
            <div className="relative p-4 rounded-xl bg-slate-950/60 border border-white/[0.06] overflow-hidden">
              <div className="absolute inset-0 tech-grid-bg opacity-40" />

              {/* Central Core Hub */}
              <div className="relative z-10 flex flex-col items-center justify-center py-2">
                <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 via-blue-600/20 to-purple-600/30 border border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
                  <Zap className="w-8 h-8 text-cyan-300 animate-pulse" />
                  <div className="absolute -inset-1 rounded-2xl border border-cyan-400/20 animate-ping opacity-25" />
                </div>
                <div className="mt-2 text-center">
                  <span className="font-display font-semibold text-sm text-white">NEXORA CORE</span>
                  <p className="text-[11px] text-slate-400">High-Performance Digital Framework</p>
                </div>
              </div>

              {/* Connecting Nodes */}
              <div className="relative z-10 grid grid-cols-2 gap-2.5 mt-3">
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-cyan-500/30 transition-colors">
                  <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-200">Modern Web</div>
                    <div className="text-[10px] text-slate-400">React • Next • Tailwind</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-purple-500/30 transition-colors">
                  <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-200">Android Apps</div>
                    <div className="text-[10px] text-slate-400">Kotlin • Hybrid • UI</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-blue-500/30 transition-colors">
                  <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-200">Robust Logic</div>
                    <div className="text-[10px] text-slate-400">Fast APIs • Database</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-emerald-500/30 transition-colors">
                  <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-200">Secure & Clean</div>
                    <div className="text-[10px] text-slate-400">Zero Bloat • Optimized</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.06] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <span className="text-slate-400">Presentation Layer</span>
              <span className="text-cyan-300">Glassmorphism UI • 60 FPS</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <span className="text-slate-400">Client Engine</span>
              <span className="text-purple-300">Fast Bundling • 0ms Lag</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <span className="text-slate-400">Responsiveness</span>
              <span className="text-emerald-300">Mobile + Tablet + Desktop</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <span className="text-slate-400">Direct Inquiries</span>
              <span className="text-amber-300">WhatsApp & Direct Forms</span>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.06] font-mono-code text-[11px] leading-relaxed text-slate-300 overflow-x-auto">
            <p className="text-purple-400">// NEXORA digital product manifest</p>
            <p><span className="text-pink-400">const</span> <span className="text-cyan-300">project</span> = &#123;</p>
            <p className="pl-4">brand: <span className="text-emerald-300">&apos;NEXORA&apos;</span>,</p>
            <p className="pl-4">tagline: <span className="text-emerald-300">&apos;Build. Innovate. Grow.&apos;</span>,</p>
            <p className="pl-4">services: [<span className="text-amber-300">&apos;Web&apos;</span>, <span className="text-amber-300">&apos;Apps&apos;</span>, <span className="text-amber-300">&apos;Branding&apos;</span>],</p>
            <p className="pl-4">quality: <span className="text-cyan-300">&apos;Production-Ready&apos;</span>,</p>
            <p className="pl-4">support: <span className="text-purple-300">true</span></p>
            <p>&#125;;</p>
            <p className="text-emerald-400 mt-1.5">&#10003; Compilation succeeded in 0.24s</p>
          </div>
        )}

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/[0.08]">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Performance</div>
            <div className="font-display font-bold text-sm text-cyan-300 mt-0.5">100%</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Cross-Device</div>
            <div className="font-display font-bold text-sm text-purple-300 mt-0.5">Fluid</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Dev Direct</div>
            <div className="font-display font-bold text-sm text-emerald-300 mt-0.5">@aabidd_26</div>
          </div>
        </div>

        {/* Floating status banner */}
        <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-slate-900/40 border border-cyan-500/20 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="text-slate-300">Ready to transform your idea into reality</span>
          </div>
          <span className="font-mono text-[11px] text-cyan-300 font-semibold hidden sm:inline">2026 Ready</span>
        </div>
      </div>
    </div>
  );
};
