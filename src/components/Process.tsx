import React from 'react';
import { MessageSquareText, LayoutGrid, Code2, Rocket, ArrowRight } from 'lucide-react';
import { PROCESS_STEPS } from '../data';

interface ProcessProps {
  onStartProcess: () => void;
}

export const Process: React.FC<ProcessProps> = ({ onStartProcess }) => {
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquareText':
        return <MessageSquareText className="w-5 h-5 text-cyan-400" />;
      case 'LayoutGrid':
        return <LayoutGrid className="w-5 h-5 text-purple-400" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-sky-400" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-emerald-400" />;
      default:
        return <Code2 className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="process" className="relative py-24 sm:py-32 bg-[#070a12] border-t border-white/[0.06]">
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/30 text-xs font-mono text-blue-300 uppercase tracking-wider mb-4">
            Workflow
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            How We Work
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            A clear, collaborative 4-step path from initial concept to a deployed digital experience.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {PROCESS_STEPS.map((item, index) => (
            <div
              key={item.step}
              id={`process-step-${item.step}`}
              className="relative p-6 sm:p-7 rounded-2xl bg-[#0c1220]/80 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono font-bold text-2xl sm:text-3xl text-cyan-400/80 group-hover:text-cyan-300 transition-colors">
                    {item.step}
                  </span>
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] group-hover:scale-105 transition-transform">
                    {getStepIcon(item.iconName)}
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-3 group-hover:text-cyan-200 transition-colors">
                  {item.title}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Phase {index + 1}</span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform inline-flex items-center">
                  &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action prompt */}
        <div className="mt-14 text-center">
          <button
            type="button"
            onClick={onStartProcess}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-white/[0.05] hover:bg-cyan-500/20 border border-white/[0.12] hover:border-cyan-400/40 transition-all cursor-pointer"
          >
            <span>Ready to start Step 01? Tell Us Your Idea</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
