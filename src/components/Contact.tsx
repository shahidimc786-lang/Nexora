import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  Instagram, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Lock,
  ExternalLink,
  Mail,
  Phone
} from 'lucide-react';
import { BRAND_INFO, SERVICES } from '../data';
import { ContactFormData } from '../types';

interface ContactProps {
  initialService?: string;
  onClearService?: () => void;
}

export const Contact: React.FC<ContactProps> = ({ initialService, onClearService }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    whatsapp: '',
    service: initialService || 'Website Development',
    projectDetails: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState<ContactFormData | null>(null);

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, service: initialService }));
    }
  }, [initialService]);

  const baseServiceOptions = [
    'Website Development',
    'Mobile App Development',
    'Logo & Branding',
    'Website Maintenance',
    'Starter Website Plan (₹1,499+)',
    'Business Website Plan (₹2,999+)',
    'Premium Website Plan (₹4,999+)',
    'Custom Digital Solution',
  ];

  const serviceOptions = Array.from(new Set([...baseServiceOptions, formData.service]));

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    const phoneClean = formData.whatsapp.replace(/[^0-9+]/g, '');
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'Please provide your WhatsApp number.';
    } else if (phoneClean.length < 8) {
      newErrors.whatsapp = 'Please enter a valid phone number (at least 8 digits).';
    }

    if (!formData.service) {
      newErrors.service = 'Please choose a service.';
    }

    if (!formData.projectDetails.trim()) {
      newErrors.projectDetails = 'Please briefly share what you would like to build.';
    } else if (formData.projectDetails.trim().length < 10) {
      newErrors.projectDetails = 'Please provide a bit more detail (at least 10 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const getEncodedWhatsAppUrl = (data: ContactFormData) => {
    const message = `Hello NEXORA! 🚀\nI would like to discuss a new project:\n\n👤 *Name:* ${data.name}\n✉️ *Email:* ${data.email}\n📱 *WhatsApp:* ${data.whatsapp}\n🛠️ *Service:* ${data.service}\n\n📝 *Project Details:*\n${data.projectDetails}\n\nLooking forward to hearing from you!`;
    return BRAND_INFO.getWhatsAppChatUrl(message);
  };

  const getDirectWhatsAppUrl = () => {
    return BRAND_INFO.getWhatsAppChatUrl('Hello Nexora, I want to order a website/app.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate reliable inquiry processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setLastSubmittedData({ ...formData });
      // Reset form
      setFormData({
        name: '',
        email: '',
        whatsapp: '',
        service: 'Website Development',
        projectDetails: '',
      });
      if (onClearService) onClearService();
    }, 600);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-[#06080e] border-t border-white/[0.06]">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-wider mb-4">
            Get In Touch
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
            Have an Idea? Let&apos;s Build It.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Fill out the form below or message directly on WhatsApp. We typically respond within a few hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Direct Connect & WhatsApp Action */}
          <div className="lg:col-span-5 space-y-6">
            {/* Prominent WhatsApp Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#0c181f] via-[#09151c] to-[#070b12] border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                    Fastest Response • Phone / WhatsApp
                  </span>
                  <h3 className="font-display font-bold text-xl text-white">
                    {BRAND_INFO.whatsapp}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Connect with us directly on WhatsApp to order a website or mobile app, discuss custom features, and get an immediate consultation.
              </p>

              <a
                id="prominent-whatsapp-btn"
                href={getDirectWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Chat on WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Email Contact Card */}
            <div className="p-6 rounded-2xl bg-[#0c1220]/80 border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-mono">Official Email</span>
                  <h4 className="font-display font-bold text-base sm:text-lg text-white font-mono truncate">
                    {BRAND_INFO.email}
                  </h4>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mb-4">
                Prefer formal project proposals or send detailed documentation? Send us an email anytime.
              </p>

              <a
                id="contact-email-btn"
                href={BRAND_INFO.getEmailMailtoUrl(
                  'Website / App Development Order - Nexora',
                  'Hello Nexora team,\n\nI want to order a website/app for my brand. Here are some brief details:'
                )}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Send Email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Instagram & Management Card */}
            <div className="p-6 rounded-2xl bg-[#0c1220]/80 border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-mono">Direct Developer</span>
                  <h4 className="font-display font-bold text-lg text-white">
                    {BRAND_INFO.instagram}
                  </h4>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mb-4">
                Follow and message our official Instagram handle for development previews, new releases, and direct collaboration.
              </p>

              <a
                id="contact-instagram-link"
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
              >
                <span>Visit Instagram profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Privacy & Direct Attention note */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Quick turnaround: typically under 4-6 hours.</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Your project idea and contact details are kept strictly private.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0c1220]/90 border border-white/[0.1] backdrop-blur-xl shadow-2xl">
              {isSuccess ? (
                <div id="contact-success-state" className="py-8 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-white mb-2">
                    Request Received!
                  </h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
                    Thank you! Your project details have been safely noted. We will reach out shortly to your email and WhatsApp number.
                  </p>

                  {/* WhatsApp Quick Forward Button */}
                  {lastSubmittedData && (
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-6 text-left">
                      <span className="text-xs text-slate-400 block font-mono mb-2">
                        Want an instant response?
                      </span>
                      <a
                        href={getEncodedWhatsAppUrl(lastSubmittedData)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Send this inquiry directly to WhatsApp now</span>
                      </a>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form id="nexora-contact-form" onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Your Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="name-input"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.name
                            ? 'border-rose-500 focus:ring-rose-500/30'
                            : 'border-white/[0.1] focus:border-cyan-400 focus:ring-cyan-500/20'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="email-input"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. john@example.com"
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.email
                            ? 'border-rose-500 focus:ring-rose-500/30'
                            : 'border-white/[0.1] focus:border-cyan-400 focus:ring-cyan-500/20'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* WhatsApp Number & Service Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="whatsapp-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        WhatsApp Number <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="whatsapp-input"
                        name="whatsapp"
                        type="tel"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="e.g. +91 98765 43210"
                        className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.whatsapp
                            ? 'border-rose-500 focus:ring-rose-500/30'
                            : 'border-white/[0.1] focus:border-cyan-400 focus:ring-cyan-500/20'
                        }`}
                      />
                      {errors.whatsapp && (
                        <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{errors.whatsapp}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="service-select" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                        Service Required <span className="text-rose-400">*</span>
                      </label>
                      <select
                        id="service-select"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl bg-[#0a0f1b] border text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors.service
                            ? 'border-rose-500 focus:ring-rose-500/30'
                            : 'border-white/[0.1] focus:border-cyan-400 focus:ring-cyan-500/20'
                        }`}
                      >
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#0b0f19] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                      {errors.service && (
                        <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span>{errors.service}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="project-details-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Project Details <span className="text-rose-400">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {formData.projectDetails.length} characters
                      </span>
                    </div>
                    <textarea
                      id="project-details-input"
                      name="projectDetails"
                      rows={4}
                      value={formData.projectDetails}
                      onChange={handleChange}
                      placeholder="Describe your vision, target audience, reference websites, or specific features you need..."
                      className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all resize-y min-h-[110px] ${
                        errors.projectDetails
                          ? 'border-rose-500 focus:ring-rose-500/30'
                          : 'border-white/[0.1] focus:border-cyan-400 focus:ring-cyan-500/20'
                      }`}
                    />
                    {errors.projectDetails && (
                      <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>{errors.projectDetails}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      id="send-request-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
