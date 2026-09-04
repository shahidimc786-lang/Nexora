import React from 'react';
import {
  Instagram,
  ArrowUp,
  MessageCircle,
  Mail,
  Lock,
  Clock,
  Sparkles,
  Phone
} from 'lucide-react';
import { BRAND_INFO } from '../data';

interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenTracking?: () => void;
  onStartProject?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenTracking,
  onStartProject,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="main-footer" className="relative bg-[#05070c] border-t border-white/[0.08] pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/[0.08]">
          {/* Brand Info & Mission */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 text-cyan-300 font-extrabold font-display">
                N
              </div>
              <span className="font-display font-extrabold text-2xl tracking-wider text-white">
                {BRAND_INFO.name}
              </span>
            </div>
            <p className="text-sm text-cyan-300/90 font-mono">
              &ldquo;{BRAND_INFO.tagline}&rdquo;
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Modern websites, mobile applications, and digital solutions crafted with precision and care.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Platform Navigation
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <a
                id="footer-nav-services"
                href="#services"
                onClick={(e) => scrollToSection(e, 'services')}
                className="hover:text-cyan-300 transition-colors"
              >
                Services
              </a>
              <a
                id="footer-nav-pricing"
                href="#pricing"
                onClick={(e) => scrollToSection(e, 'pricing')}
                className="hover:text-cyan-300 transition-colors"
              >
                Pricing
              </a>
              <a
                id="footer-nav-process"
                href="#process"
                onClick={(e) => scrollToSection(e, 'process')}
                className="hover:text-cyan-300 transition-colors"
              >
                Process
              </a>
              <a
                id="footer-nav-delivery"
                href="#delivery-info"
                onClick={(e) => scrollToSection(e, 'delivery-info')}
                className="hover:text-cyan-300 transition-colors"
              >
                Delivery Info
              </a>
              <a
                id="footer-nav-about"
                href="#about"
                onClick={(e) => scrollToSection(e, 'about')}
                className="hover:text-cyan-300 transition-colors"
              >
                About
              </a>
              <a
                id="footer-nav-contact"
                href="#contact"
                onClick={(e) => scrollToSection(e, 'contact')}
                className="hover:text-cyan-300 transition-colors"
              >
                Contact
              </a>

              {onOpenTracking && (
                <button
                  type="button"
                  onClick={onOpenTracking}
                  className="text-left text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Clock className="w-3 h-3" />
                  <span>Track My Order</span>
                </button>
              )}

              {onStartProject && (
                <button
                  type="button"
                  onClick={onStartProject}
                  className="text-left text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Order Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Contact Details & Direct Connect */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Direct Contact
            </span>

            <div className="space-y-2 text-xs">
              <a
                href={BRAND_INFO.getWhatsAppChatUrl('Hello Nexora, I want to order a website/app.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: <strong className="font-mono text-white">{BRAND_INFO.whatsapp}</strong></span>
              </a>

              <a
                href={BRAND_INFO.getEmailMailtoUrl()}
                className="flex items-center gap-2 text-slate-300 hover:text-cyan-300 transition-colors"
              >
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Email: <strong className="font-mono text-white">{BRAND_INFO.email}</strong></span>
              </a>

              <a
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-pink-400 transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <span>Instagram: <strong className="font-mono text-white">{BRAND_INFO.instagram}</strong></span>
              </a>
            </div>

            <div className="pt-2 flex items-center gap-3">
              {onOpenAdmin && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-purple-300 bg-white/[0.03] hover:bg-purple-950/30 border border-white/[0.08] hover:border-purple-500/40 transition-colors cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-purple-400" />
                  <span>Admin Workspace</span>
                </button>
              )}

              <button
                id="footer-scroll-top-btn"
                type="button"
                onClick={scrollToTop}
                aria-label="Scroll back to top"
                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar with exact required text */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} {BRAND_INFO.name}. All rights reserved.
          </div>

          <div
            id="footer-management-text"
            className="font-mono text-cyan-300/90 bg-white/[0.02] px-4 py-1.5 rounded-full border border-white/[0.07] text-center"
          >
            Managed by {BRAND_INFO.instagram} • WhatsApp: {BRAND_INFO.whatsapp} • Email: {BRAND_INFO.email}
          </div>
        </div>
      </div>
    </footer>
  );
};
