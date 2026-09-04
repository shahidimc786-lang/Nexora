import React from 'react';
import { Globe, Smartphone, Palette, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { SERVICES } from '../data';

interface ServicesProps {
  onSelectService: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-6 h-6 text-cyan-400" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6 text-purple-400" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-pink-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      default:
        return <Globe className="w-6 h-6 text-cyan-400" />;
    }
  };

  const getGlowColor = (index: number) => {
    switch (index) {
      case 0:
        return 'group-hover:border-cyan-500/40 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.18)]';
      case 1:
        return 'group-hover:border-purple-500/40 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.18)]';
      case 2:
        return 'group-hover:border-pink-500/40 group-hover:shadow-[0_0_30px_rgba(244,114,182,0.18)]';
      case 3:
        return 'group-hover:border-emerald-500/40 group-hover:shadow-[0_0_30px_rgba(52,211,153,0.18)]';
      default:
        return 'group-hover:border-cyan-500/40';
    }
  };

  return (
    <section id="services" className="relative py-24 sm:py-32 bg-[#070a12] border-t border-white/[0.06]">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-wider mb-4">
            Capabilities
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            What We Do
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            High-caliber digital development crafted specifically for modern creators, independent brands, and growing businesses.
          </p>
        </div>

        {/* 4 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className={`group relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#0c1222]/80 border border-white/[0.08] backdrop-blur-xl transition-all duration-300 ${getGlowColor(
                index
              )} hover:-translate-y-1`}
            >
              {/* Card top */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] shadow-inner group-hover:scale-105 transition-transform">
                    {getIcon(service.iconName)}
                  </div>
                  {service.badge && (
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-slate-300">
                      {service.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-cyan-200 transition-colors">
                  {service.title}
                </h3>

                <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>

                {/* Features list */}
                <ul className="mt-6 space-y-2.5 pt-6 border-t border-white/[0.06]">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card bottom: Price & Inquiry button */}
              <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block">Starting from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-extrabold text-2xl text-white tracking-tight">
                      {service.startingPrice}
                    </span>
                    {service.priceSuffix && (
                      <span className="text-xs text-slate-400 font-mono">{service.priceSuffix}</span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  id={`service-inquire-btn-${service.id}`}
                  onClick={() => onSelectService(service.title)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-white/[0.05] hover:bg-cyan-500 hover:text-white border border-white/[0.1] hover:border-cyan-400 transition-all cursor-pointer group/btn"
                >
                  <span>Inquire Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
