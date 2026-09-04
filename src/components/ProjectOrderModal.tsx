import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  Calendar,
  CreditCard,
  QrCode,
  ShieldCheck,
  Sparkles,
  Copy,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Smartphone,
  Globe,
  Layers,
  Palette
} from 'lucide-react';
import { ORDER_PROJECT_TYPES, POPULAR_FEATURES_LIST, BRAND_INFO } from '../data';
import { ProjectType, UploadedFile, ProjectOrder } from '../types';

interface ProjectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectType?: string;
  onOpenTracking: (orderId: string) => void;
}

export const ProjectOrderModal: React.FC<ProjectOrderModalProps> = ({
  isOpen,
  onClose,
  initialProjectType,
  onOpenTracking,
}) => {
  // Steps: 1 = Client Info, 2 = Project Scope & Features, 3 = Files & Assets, 4 = Review Summary, 5 = Payment & Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [brandName, setBrandName] = useState('');

  const [projectType, setProjectType] = useState<ProjectType>(() => {
    if (initialProjectType === 'Mobile App Development') return 'mobile_app';
    if (initialProjectType === 'Logo & Branding') return 'branding';
    if (initialProjectType === 'Website + App Combo') return 'combo';
    return 'website';
  });

  const [projectConcept, setProjectConcept] = useState('');
  const [requirements, setRequirements] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Mobile & Desktop Responsive UI',
    'WhatsApp Live Chat Integration',
    'Contact / Lead Capture Form',
    'Fast Loading & Performance Tuning',
  ]);
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [budget, setBudget] = useState('₹1,499 (Starter Plan)');
  const [referenceLinks, setReferenceLinks] = useState('');

  // Uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [activeUploadCategory, setActiveUploadCategory] = useState<
    'logo' | 'photos' | 'documents' | 'references'
  >('logo');

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Created Order Result (for Step 5)
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'failed'>('pending');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank' | 'card'>('upi');
  const [copiedId, setCopiedId] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  if (!isOpen) return null;

  // Selected project type info
  const currentTypeObj = ORDER_PROJECT_TYPES.find((t) => t.id === projectType) || ORDER_PROJECT_TYPES[0];

  // Base calculated price
  const calculateTotal = (): number => {
    let base = currentTypeObj.startingPrice;
    if (budget.includes('2,999')) base = 2999;
    if (budget.includes('4,999')) base = 4999;
    if (budget.includes('5,999')) base = 5999;
    return base;
  };

  const handleToggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile: UploadedFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          category: activeUploadCategory,
          dataUrl: event.target?.result as string,
        };
        setUploadedFiles((prev) => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
    // Reset input
    e.target.value = '';
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Step 1 validation
  const validateStep1 = () => {
    if (!customerName.trim() || customerName.trim().length < 2) {
      setSubmitError('Please enter your full name (minimum 2 characters).');
      return false;
    }
    const cleanPhone = whatsapp.replace(/[^0-9+]/g, '');
    if (!whatsapp.trim() || cleanPhone.length < 8) {
      setSubmitError('Please enter a valid WhatsApp number (at least 8 digits).');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setSubmitError('Please provide a valid email address.');
      return false;
    }
    setSubmitError(null);
    return true;
  };

  // Step 2 validation
  const validateStep2 = () => {
    if (!projectConcept.trim() || projectConcept.trim().length < 10) {
      setSubmitError('Please describe your project idea or concept (at least 10 characters).');
      return false;
    }
    if (!requirements.trim()) {
      setSubmitError('Please mention your requirements or key pages needed.');
      return false;
    }
    setSubmitError(null);
    return true;
  };

  // Submit order to backend API
  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const orderPayload = {
      customerName: customerName.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim().toLowerCase(),
      brandName: brandName.trim() || undefined,
      projectType,
      projectTypeName: currentTypeObj.title,
      projectConcept: projectConcept.trim(),
      requirements: requirements.trim(),
      features: selectedFeatures,
      deliveryDate,
      budget,
      referenceLinks: referenceLinks.trim() || undefined,
      files: uploadedFiles,
      totalAmount: calculateTotal(),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order. Please try again.');
      }

      setCreatedOrder(data.order);
      setPaymentStatus('pending');
      setCurrentStep(5); // Advance to Payment & Confirmation
    } catch (err: any) {
      console.error('Order submit error:', err);
      setSubmitError(err.message || 'Error communicating with server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate payment confirmation (marks as paid on server)
  const handleConfirmPayment = async (status: 'paid' | 'failed' | 'pending') => {
    if (!createdOrder?.id) return;
    setIsUpdatingPayment(true);
    try {
      const res = await fetch(`/api/orders/${createdOrder.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          paymentMethod: paymentMethod === 'upi' ? 'UPI Transfer' : paymentMethod === 'bank' ? 'Bank Wire' : 'Card / Online',
          transactionId: `TXN-${Date.now().toString().slice(-6)}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentStatus(status);
      }
    } catch (err) {
      console.error('Payment update error:', err);
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  const copyOrderId = () => {
    if (!createdOrder?.id) return;
    navigator.clipboard.writeText(createdOrder.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div
      id="project-order-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="project-order-modal-container"
        className="relative w-full max-w-3xl my-8 bg-[#080b12] border border-white/[0.1] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-display text-sm">
              N
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white">
                Start Your Project with NEXORA
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {currentStep < 5 ? `Step ${currentStep} of 4 • Project Order Form` : 'Order Confirmed & Payment'}
              </p>
            </div>
          </div>

          <button
            id="order-modal-close-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Close Order Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar (Steps 1 to 4) */}
        {currentStep < 5 && (
          <div className="px-6 pt-4 pb-2 border-b border-white/[0.04] bg-white/[0.01]">
            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              <div
                className={`flex items-center gap-1.5 pb-2 border-b-2 transition-colors ${
                  currentStep >= 1 ? 'border-cyan-400 text-cyan-300' : 'border-white/[0.1] text-slate-400'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center text-[10px] border border-cyan-800">
                  1
                </span>
                <span className="truncate">Contact</span>
              </div>
              <div
                className={`flex items-center gap-1.5 pb-2 border-b-2 transition-colors ${
                  currentStep >= 2 ? 'border-cyan-400 text-cyan-300' : 'border-white/[0.1] text-slate-400'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center text-[10px] border border-cyan-800">
                  2
                </span>
                <span className="truncate">Scope</span>
              </div>
              <div
                className={`flex items-center gap-1.5 pb-2 border-b-2 transition-colors ${
                  currentStep >= 3 ? 'border-cyan-400 text-cyan-300' : 'border-white/[0.1] text-slate-400'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center text-[10px] border border-cyan-800">
                  3
                </span>
                <span className="truncate">Files</span>
              </div>
              <div
                className={`flex items-center gap-1.5 pb-2 border-b-2 transition-colors ${
                  currentStep >= 4 ? 'border-cyan-400 text-cyan-300' : 'border-white/[0.1] text-slate-400'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center text-[10px] border border-cyan-800">
                  4
                </span>
                <span className="truncate">Review</span>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {submitError && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* STEP 1: Customer Information */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h4 className="font-display font-bold text-xl text-white">
                  Customer Information
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Tell us who we are building this for. We use WhatsApp for active progress updates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="order-customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-cyan-400 focus:outline-none text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    WhatsApp Number <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="order-customer-whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g. 9709429070"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-cyan-400 focus:outline-none text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Email Address <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="order-customer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-cyan-400 focus:outline-none text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Brand / Business Name <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    id="order-brand-name"
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Quantum Studio"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-cyan-400 focus:outline-none text-white text-sm"
                  />
                </div>
              </div>

              {/* Privacy reminder */}
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300/90 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Your project data & requirements remain 100% private to Nexora. We never disclose client details.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Project Details & Scope */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h4 className="font-display font-bold text-xl text-white">
                  Project Type & Requirements
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Select your digital development package and share what you want us to create.
                </p>
              </div>

              {/* Project Type selector cards */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Select Project Type <span className="text-cyan-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ORDER_PROJECT_TYPES.map((type) => {
                    const isSelected = projectType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setProjectType(type.id as ProjectType)}
                        className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                            : 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.2]'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected ? 'bg-cyan-500 text-black' : 'bg-white/[0.06] text-cyan-400'
                          }`}
                        >
                          {type.id === 'website' && <Globe className="w-4 h-4" />}
                          {type.id === 'mobile_app' && <Smartphone className="w-4 h-4" />}
                          {type.id === 'combo' && <Layers className="w-4 h-4" />}
                          {type.id === 'branding' && <Palette className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-white truncate">
                              {type.title}
                            </span>
                            <span className="text-xs font-mono text-cyan-300 font-bold ml-1">
                              {type.formattedPrice}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                            {type.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Project Concept / Idea */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Project Concept / Idea <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  id="order-project-concept"
                  rows={3}
                  value={projectConcept}
                  onChange={(e) => setProjectConcept(e.target.value)}
                  placeholder="Explain what your business or project does, your target audience, and the main visual vibe you want..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-cyan-400 focus:outline-none text-white text-sm"
                />
              </div>

              {/* Specific Requirements & Pages Needed */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Specific Requirements & Pages Needed <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  id="order-requirements"
                  rows={3}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="List the required sections or pages (e.g. Home, Services, Pricing, Portfolio, Booking Form, About, FAQ)..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-cyan-400 focus:outline-none text-white text-sm"
                />
              </div>

              {/* Key Features Needed */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Key Features Needed <span className="text-slate-400">(Select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {POPULAR_FEATURES_LIST.map((feature) => {
                    const isChecked = selectedFeatures.includes(feature);
                    return (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => handleToggleFeature(feature)}
                        className={`px-3 py-2 rounded-lg text-xs text-left border transition-all flex items-center gap-2 cursor-pointer ${
                          isChecked
                            ? 'bg-cyan-500/15 border-cyan-400 text-white font-medium'
                            : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? 'bg-cyan-400 border-cyan-400 text-black'
                              : 'border-white/[0.2] bg-black/40'
                          }`}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="truncate">{feature}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Date & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Preferred Delivery Date</span>
                  </label>
                  <input
                    id="order-delivery-date"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-cyan-400 focus:outline-none text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Estimated Budget Tier
                  </label>
                  <select
                    id="order-budget-select"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0e121d] border border-white/[0.1] focus:border-cyan-400 focus:outline-none text-white text-sm"
                  >
                    <option value="₹1,499 (Starter Plan)">₹1,499 (Starter Plan)</option>
                    <option value="₹2,999 (Business Plan)">₹2,999 (Business Plan - Recommended)</option>
                    <option value="₹4,999 (Premium Plan)">₹4,999 (Premium Plan)</option>
                    <option value="₹5,999+ (Combo App + Web)">₹5,999+ (Combo App + Web)</option>
                    <option value="Custom Quote (Discuss on WhatsApp)">Custom Quote (Discuss on WhatsApp)</option>
                  </select>
                </div>
              </div>

              {/* Reference Links */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Reference Website / App Links <span className="text-slate-400">(Optional)</span>
                </label>
                <input
                  id="order-reference-links"
                  type="text"
                  value={referenceLinks}
                  onChange={(e) => setReferenceLinks(e.target.value)}
                  placeholder="e.g. https://example.com, https://dribbble.com/shots/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-cyan-400 focus:outline-none text-white text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 3: File Uploads with Preview */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h4 className="font-display font-bold text-xl text-white">
                  Upload Brand Assets & References
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Upload your logo, reference screenshots, text documents, or product pictures. You can preview and remove them before submission.
                </p>
              </div>

              {/* Upload Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'logo', label: 'Brand Logo' },
                  { id: 'photos', label: 'Photos / Images' },
                  { id: 'documents', label: 'Documents / Text' },
                  { id: 'references', label: 'Reference Screenshots' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveUploadCategory(cat.id as any)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeUploadCategory === cat.id
                        ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                        : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Drag & Drop / File Input Box */}
              <div className="relative border-2 border-dashed border-white/[0.15] hover:border-cyan-400/60 rounded-2xl p-6 sm:p-8 text-center transition-colors bg-white/[0.01]">
                <input
                  id="order-file-input"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Click to browse or drag & drop files
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Tagging as <span className="text-cyan-400 font-mono capitalize">{activeUploadCategory}</span> • PNG, JPG, PDF, DOCX up to 25MB
                  </span>
                </div>
              </div>

              {/* Uploaded Files Preview Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Uploaded Files ({uploadedFiles.length})
                  </span>
                  {uploadedFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setUploadedFiles([])}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {uploadedFiles.length === 0 ? (
                  <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-xs text-slate-400">
                    No files uploaded yet. You can also share files directly via WhatsApp after placing the order.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {uploadedFiles.map((f) => (
                      <div
                        key={f.id}
                        className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {f.dataUrl && f.type.startsWith('image/') ? (
                            <img
                              src={f.dataUrl}
                              alt={f.name}
                              className="w-10 h-10 rounded-lg object-cover border border-white/[0.1] shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-cyan-400 shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">
                              {f.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono capitalize">
                              {f.category} • {(f.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(f.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Order Summary & Review */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h4 className="font-display font-bold text-xl text-white">
                  Order Summary & Review
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Please review your project details before we generate your private Order ID and payment invoice.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.1] space-y-4">
                {/* Header row */}
                <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
                  <div>
                    <span className="text-xs font-mono uppercase text-cyan-400 block mb-1">
                      Target Project
                    </span>
                    <h5 className="font-display font-bold text-lg text-white">
                      {currentTypeObj.title}
                    </h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Client: <span className="text-slate-200 font-medium">{customerName}</span>{' '}
                      {brandName && `(${brandName})`}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block mb-1">Estimated Total</span>
                    <span className="font-display font-extrabold text-2xl text-cyan-300">
                      ₹{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">WhatsApp & Contact</span>
                    <p className="text-white font-mono">{whatsapp}</p>
                    <p className="text-slate-400">{email}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Target Delivery</span>
                    <p className="text-white font-medium">{deliveryDate}</p>
                    <p className="text-cyan-400/80 font-mono">Budget: {budget}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block mb-1">Concept Overview</span>
                    <p className="text-slate-200 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/[0.05]">
                      {projectConcept}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block mb-1">Selected Features ({selectedFeatures.length})</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedFeatures.map((feat) => (
                        <span
                          key={feat}
                          className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] text-slate-300"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 block mb-1">Attached Assets</span>
                      <p className="text-cyan-300 text-xs font-mono">
                        {uploadedFiles.length} file(s) attached for Nexora design team.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Review & revisions included before sign-off</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Direct developer support on WhatsApp</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Payment & Order Confirmation */}
          {currentStep === 5 && createdOrder && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Success Badge Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-sky-950/30 to-purple-950/40 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-white">
                      Order Successfully Placed!
                    </h4>
                    <p className="text-xs text-slate-300">
                      Your requirements are safely registered in the Nexora private database.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-black/40 px-3.5 py-2 rounded-xl border border-white/[0.1] shrink-0">
                  <span className="text-xs font-mono text-slate-400">Order ID:</span>
                  <span className="font-mono font-bold text-sm text-cyan-300 tracking-wider">
                    {createdOrder.id}
                  </span>
                  <button
                    type="button"
                    onClick={copyOrderId}
                    className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                    title="Copy Order ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copiedId && <span className="text-[10px] text-emerald-400 font-mono">Copied!</span>}
                </div>
              </div>

              {/* Payment Section */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.1] space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div>
                    <h5 className="font-display font-bold text-base text-white">
                      Payment Details
                    </h5>
                    <p className="text-xs text-slate-400">
                      Choose your preferred payment method to verify your order sprint.
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Payable Amount</span>
                    <span className="font-display font-extrabold text-xl text-white">
                      ₹{createdOrder.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-xs text-slate-300 font-medium">Payment Status</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                      paymentStatus === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : paymentStatus === 'failed'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    {paymentStatus}
                  </span>
                </div>

                {/* Payment Options */}
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'bg-cyan-500/15 border-cyan-400 text-white'
                          : 'bg-white/[0.02] border-white/[0.08] text-slate-400'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-cyan-400" />
                      <span>UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'bank'
                          ? 'bg-cyan-500/15 border-cyan-400 text-white'
                          : 'bg-white/[0.02] border-white/[0.08] text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-sky-400" />
                      <span>Bank Wire</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'bg-cyan-500/15 border-cyan-400 text-white'
                          : 'bg-white/[0.02] border-white/[0.08] text-slate-400'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span>Gateway / Card</span>
                    </button>
                  </div>

                  {/* Payment Details Card */}
                  {paymentMethod === 'upi' && (
                    <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-2 text-xs">
                      <p className="text-white font-medium">Direct UPI Transfer:</p>
                      <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg font-mono text-cyan-300">
                        <span>9709429070@upi</span>
                        <span className="text-slate-400 text-[10px]">(Google Pay / PhonePe / Paytm)</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Please add Order ID <strong className="text-white">{createdOrder.id}</strong> in remark.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'bank' && (
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1.5 text-xs text-slate-300">
                      <p className="text-white font-medium">Direct Bank Transfer:</p>
                      <p>Account Name: NEXORA Digital Services</p>
                      <p>Account Number: Available upon request via WhatsApp (9709429070)</p>
                      <p className="text-slate-400 text-[11px]">Ref: {createdOrder.id}</p>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 space-y-2">
                      <p className="text-white font-medium">Payment Gateway Integration Structure:</p>
                      <p className="text-slate-400">
                        Gateway ready (Razorpay / Stripe). Use simulated actions below to test status transitions.
                      </p>
                    </div>
                  )}

                  {/* Test Payment Simulation Controls */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleConfirmPayment('paid')}
                      disabled={isUpdatingPayment}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer disabled:opacity-50"
                    >
                      {isUpdatingPayment ? 'Updating...' : 'Simulate / Confirm Payment (Mark Paid)'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleConfirmPayment('pending')}
                      disabled={isUpdatingPayment}
                      className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.08] transition-colors cursor-pointer"
                    >
                      Reset to Pending
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Track Order & WhatsApp Connect */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTracking(createdOrder.id);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>Track My Order Now</span>
                </button>

                <a
                  href={BRAND_INFO.getWhatsAppChatUrl(
                    `Hello Nexora, I just placed an order! Order ID: ${createdOrder.id}. Project: ${currentTypeObj.title}. Looking forward to discussing details.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-emerald-600/90 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all cursor-pointer text-center"
                >
                  <span>Share on WhatsApp</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Controls (Steps 1 to 4) */}
        {currentStep < 5 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-white/[0.02]">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setSubmitError(null);
                  setCurrentStep((prev) => (prev - 1) as any);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !validateStep1()) return;
                  if (currentStep === 2 && !validateStep2()) return;
                  setSubmitError(null);
                  setCurrentStep((prev) => (prev + 1) as any);
                }}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="order-submit-final-btn"
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitOrder}
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isSubmitting ? (
                  <span>Saving Order...</span>
                ) : (
                  <>
                    <span>Submit & Proceed to Payment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
