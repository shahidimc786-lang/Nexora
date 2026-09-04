import React from 'react';
import { 
  Globe2, 
  Smartphone, 
  CheckCheck, 
  Headphones, 
  ShieldCheck, 
  Layers, 
  FileCode, 
  ArrowRight 
} from 'lucide-react';
import { DELIVERY_INFO_CARDS, BRAND_INFO } from '../data';

interface DeliveryInfoProps {
  onStartProject: () => void;
}

export const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ onStartProject }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Globe2':
        return <Globe2 className="w-6 h-6 text-cyan-400" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-sky-400" />;
      case 'CheckCheck':
        return <CheckCheck className="w-6 h-6 text-purple-400" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-indigo-400" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <section id="delivery-info" className="relative py-24 sm:py-32 bg-[#06080e] border-t border-white/[0.06] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Delivery & Handover Standard</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight mb-4">
            How Your Completed Project Is{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
              Delivered
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Transparent milestones from source code packaging to live deployment and ongoing support.
            You own 100% of your digital product.
          </p>
        </div>

        {/* 4 Feature Delivery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-14">
          {DELIVERY_INFO_CARDS.map((card, idx) => (
            <div
              key={card.id}
              id={`delivery-card-${card.id}`}
              className="relative p-7 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-white/[0.035] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.1] group-hover:scale-105 transition-transform">
                    {getIcon(card.iconName)}
                  </div>
                  <span className="text-xs font-mono text-slate-400 tracking-wider">
                    STAGE 0{idx + 1}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono block mb-1">
                    {card.subtitle}
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-cyan-300 transition-colors">
                    {card.title}
                  </h3>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06] space-y-2.5">
                {card.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-sky-950/20 to-purple-950/30 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
          <div className="text-left space-y-1">
            <h4 className="font-display font-bold text-xl text-white">
              Ready to bring your digital vision to life?
            </h4>
            <p className="text-sm text-slate-300">
              Submit your project requirements, track development in real-time, and get live within days.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              id="delivery-start-project-btn"
              onClick={onStartProject}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer active:scale-95"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
