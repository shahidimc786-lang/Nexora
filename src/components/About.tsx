import React from 'react';
import { Check, Code2, MonitorCheck, Sparkles, HeartHandshake, Instagram, ArrowUpRight } from 'lucide-react';
import { BRAND_INFO, ABOUT_POINTS } from '../data';

export const About: React.FC = () => {
  const getPointIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
      case 1:
        return <MonitorCheck className="w-5 h-5 text-purple-400" />;
      case 2:
        return <Code2 className="w-5 h-5 text-blue-400" />;
      case 3:
        return <HeartHandshake className="w-5 h-5 text-emerald-400" />;
      default:
        return <Check className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-[#080c16] border-t border-white/[0.06]">
      <div className="absolute top-1/2 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Brand Story & Mission */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-wider mb-4">
              About Us
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-6">
              Why NEXORA?
            </h2>

            {/* Requested description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
              NEXORA helps individuals, creators and small businesses establish a strong online presence through modern digital solutions.
            </p>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-8">
              In an era crowded with clunky website builders and slow templates, NEXORA crafts lightweight, fast-loading, and visually captivating digital products. From single-page launch sites to tailored Android mobile applications, each project is built with care, modern tooling, and direct communication without unnecessary middlemen.
            </p>

            {/* Creator / Management highlight card */}
            <div className="w-full p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-300">
                  N
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-mono">Managed by</span>
                  <span className="font-semibold text-white text-sm sm:text-base">
                    {BRAND_INFO.instagram}
                  </span>
                </div>
              </div>

              <a
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>Instagram</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Right Column: 4 Points */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            {ABOUT_POINTS.map((point, index) => (
              <div
                key={index}
                id={`about-point-${index}`}
                className="group p-5 sm:p-6 rounded-2xl bg-[#0d1424]/70 border border-white/[0.08] hover:border-cyan-500/30 backdrop-blur-md transition-all duration-300 hover:-translate-x-1"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] group-hover:scale-105 transition-transform flex-shrink-0">
                    {getPointIcon(index)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold text-sm">✓</span>
                      <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-200 transition-colors">
                        {point.title}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-slate-300 text-sm leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
