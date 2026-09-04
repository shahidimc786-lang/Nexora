import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BRAND_INFO } from '../data';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating button once user scrolls down a bit
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    'Hello NEXORA! 👋 I am interested in building a project and would like to discuss details.'
  )}`;

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Instant WhatsApp Assistance"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b121e]/95 border border-emerald-500/30 text-xs text-slate-200 shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Quick inquiry on WhatsApp</span>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white ml-1 p-0.5"
            aria-label="Close tooltip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <a
        id="floating-whatsapp-action"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with NEXORA on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] transition-all transform hover:scale-105 active:scale-95 group"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#07090e] animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-[#07090e]" />
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </aside>
  );
};
