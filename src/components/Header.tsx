import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Clock,
  Lock,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { BRAND_INFO } from '../data';

interface HeaderProps {
  activeSection: string;
  onNavigateToContact: (service?: string) => void;
  onStartProject?: () => void;
  onTrackOrder?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigateToContact,
  onStartProject,
  onTrackOrder,
  onOpenAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Pricing', href: '#pricing', id: 'pricing' },
    { label: 'Process', href: '#process', id: 'process' },
    { label: 'Delivery', href: '#delivery-info', id: 'delivery-info' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#07090e]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <a
            href="#home"
            id="header-logo-link"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-3 group cursor-pointer focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-purple-600/20 border border-cyan-500/30 group-hover:border-cyan-400/60 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span className="font-display font-extrabold text-lg text-cyan-400 tracking-wider">N</span>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-xl tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                  {BRAND_INFO.name}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                  Dev
                </span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wider hidden sm:block">
                {BRAND_INFO.tagline}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 rounded-full backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-3 py-1.5 text-xs xl:text-sm font-medium transition-all rounded-full ${
                    isActive
                      ? 'text-cyan-300 bg-white/[0.08] shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Track Order Button */}
            {onTrackOrder && (
              <button
                id="header-track-button"
                type="button"
                onClick={onTrackOrder}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-white/[0.03] hover:bg-cyan-950/30 border border-white/[0.1] hover:border-cyan-500/40 rounded-xl transition-all cursor-pointer"
                title="Track Project Status"
              >
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Track Order</span>
              </button>
            )}

            {/* Order Now / Start Your Project Button */}
            <button
              id="header-cta-button"
              type="button"
              onClick={onStartProject || (() => onNavigateToContact())}
              className="relative inline-flex items-center justify-center gap-2 px-4.5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Order Now</span>
            </button>

            {/* Admin Workspace Lock Icon */}
            {onOpenAdmin && (
              <button
                id="header-admin-button"
                type="button"
                onClick={onOpenAdmin}
                className="p-2 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-white/[0.04] border border-transparent hover:border-purple-500/30 transition-colors cursor-pointer"
                title="Admin Workspace (Restricted)"
                aria-label="Admin Workspace"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {onTrackOrder && (
              <button
                type="button"
                onClick={onTrackOrder}
                className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-cyan-400 text-xs flex items-center gap-1 cursor-pointer"
                aria-label="Track Order"
              >
                <Clock className="w-4 h-4" />
              </button>
            )}

            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden fixed inset-x-0 top-[65px] bg-[#07090e]/98 backdrop-blur-2xl border-b border-white/[0.1] shadow-2xl transition-all p-5 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  id={`mobile-link-${link.id}`}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                </a>
              );
            })}

            <div className="pt-3 border-t border-white/[0.08] mt-2 flex flex-col gap-2.5">
              <button
                id="mobile-order-now-button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onStartProject) onStartProject();
                  else onNavigateToContact();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Order Now (Start Project)</span>
              </button>

              {onTrackOrder && (
                <button
                  id="mobile-track-button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onTrackOrder();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-cyan-300 bg-white/[0.03] border border-white/[0.1] hover:bg-cyan-950/30 cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Track Existing Order</span>
                </button>
              )}

              {onOpenAdmin && (
                <button
                  id="mobile-admin-button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-purple-300 bg-white/[0.02] border border-white/[0.05] cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin Workspace</span>
                </button>
              )}
              
              <div className="text-center pt-1 text-xs text-slate-400 flex items-center justify-center gap-3">
                <a
                  href={BRAND_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-400"
                >
                  {BRAND_INFO.instagram}
                </a>
                <span>•</span>
                <a
                  href={BRAND_INFO.getWhatsAppChatUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 font-mono"
                >
                  {BRAND_INFO.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
