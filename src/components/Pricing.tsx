import React from 'react';
import { Check, Sparkles, ArrowRight, Info } from 'lucide-react';
import { PRICING_PLANS } from '../data';

interface PricingProps {
  onSelectPlan: (planName: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  return (
    <section id="pricing" className="relative py-24 sm:py-32 bg-[#06080e] border-t border-white/[0.06]">
      {/* Background ambient illumination */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-purple-300 uppercase tracking-wider mb-4">
            Transparent Rates
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            Plans & Investment
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Straightforward pricing tailored to your scale. No inflated corporate overheads.
          </p>

          {/* Mandatory requirement callout */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs sm:text-sm text-slate-300">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span className="font-medium">Final price depends on project requirements.</span>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const isPopular = plan.popular;
            return (
              <div
                key={plan.id}
                id={`pricing-card-${plan.id}`}
                className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 ${
                  isPopular
                    ? 'bg-[#0f172a]/90 border-2 border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.2)] lg:-translate-y-2'
                    : 'bg-[#0c111e]/80 border border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                {/* Popular Pill badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-[11px] font-bold tracking-wider uppercase text-white shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display font-bold text-xl text-white tracking-wider">
                      {plan.name}
                    </h3>
                    <span className="text-[11px] font-mono text-cyan-400 uppercase bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      Tier
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 mb-6 min-h-[38px]">
                    {plan.description}
                  </p>

                  <div className="mb-6 pb-6 border-b border-white/[0.08]">
                    <span className="text-xs text-slate-400 block font-mono">Starting from</span>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="font-display font-extrabold text-4xl text-white tracking-tight">
                        {plan.price}
                      </span>
                    </div>
                  </div>

                  {/* Included features */}
                  <div className="space-y-3 mb-8">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      What&apos;s Included
                    </span>
                    <ul className="space-y-3">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-sm text-slate-200">
                          <div className="p-0.5 rounded-full bg-cyan-500/10 text-cyan-400 mt-0.5 flex-shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Button */}
                <button
                  type="button"
                  id={`pricing-select-btn-${plan.id}`}
                  onClick={() => onSelectPlan(plan.name)}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isPopular
                      ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] hover:border-cyan-400/40'
                  }`}
                >
                  <span>Choose {plan.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Reassurance note */}
        <div className="mt-12 text-center">
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Need a tailored mobile app, custom enterprise portal, or specialized backend?{' '}
            <button
              type="button"
              onClick={() => onSelectPlan('Custom Plan')}
              className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-4 cursor-pointer"
            >
              Contact us for a tailored quote
            </button>
            .
          </p>
        </div>
      </div>
    </section>
  );
};
