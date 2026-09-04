import React from 'react';
import { ArrowRight, Sparkles, Code, Smartphone, CheckCircle, ShieldCheck, Clock } from 'lucide-react';
import { TechVisual } from './TechVisual';
import { BRAND_INFO } from '../data';

interface HeroProps {
  onGetStarted: () => void;
  onViewServices: () => void;
  onTrackOrder?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, onViewServices, onTrackOrder }) => {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Tagline / status badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-cyan-500/30 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300 font-mono">
                {BRAND_INFO.tagline}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.12] mb-6">
              Build Your Digital Future With{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 text-glow">
                NEXORA
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed mb-8">
              We turn your ideas into modern websites, apps and digital experiences.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-10">
              <button
                id="hero-get-started-btn"
                type="button"
                onClick={onGetStarted}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.55)] transition-all transform active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-view-services-btn"
                type="button"
                onClick={onViewServices}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.12] hover:border-cyan-400/40 hover:text-white transition-all transform active:scale-[0.98] cursor-pointer"
              >
                <span>View Services</span>
              </button>

              {onTrackOrder && (
                <button
                  id="hero-track-order-btn"
                  type="button"
                  onClick={onTrackOrder}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-cyan-300 bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 hover:border-cyan-400/60 transition-all transform active:scale-[0.98] cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Track My Order</span>
                </button>
              )}
            </div>

            {/* Trust highlights */}
            <div className="pt-6 border-t border-white/[0.08] w-full grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-400">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white block">Starting ₹1,499</span>
                  Transparent pricing
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded-md bg-purple-500/10 text-purple-400">
                  <Code className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white block">Modern Stack</span>
                  Clean, fast code
                </div>
              </div>

              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white block">Direct Connect</span>
                  {BRAND_INFO.instagram}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Abstract Technology Visual */}
          <div className="lg:col-span-5 w-full">
            <TechVisual />
          </div>
        </div>
      </div>
    </section>
  );
};
