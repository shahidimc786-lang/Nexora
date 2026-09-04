import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Layers,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { PROJECT_STATUS_STEPS, BRAND_INFO } from '../data';
import { PublicOrderTracking, ProjectStatus } from '../types';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  onClose,
  initialOrderId,
}) => {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<PublicOrderTracking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialOrderId) {
      setOrderIdInput(initialOrderId);
      fetchTracking(initialOrderId);
    }
  }, [initialOrderId]);

  if (!isOpen) return null;

  const fetchTracking = async (idToSearch: string) => {
    const clean = idToSearch.trim().toUpperCase();
    if (!clean) {
      setErrorMessage('Please enter an Order ID (e.g. NEX-2026-0001)');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(clean)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setTrackingData(null);
        setErrorMessage(
          data.error || `No project found matching "${clean}". Check for typos or contact support.`
        );
      } else {
        setTrackingData(data.tracking);
        setErrorMessage(null);
      }
    } catch (err: any) {
      console.error('Tracking fetch error:', err);
      setErrorMessage('Unable to reach tracker service. Please check your connection or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderIdInput);
  };

  const getStepIndex = (status: ProjectStatus): number => {
    const idx = PROJECT_STATUS_STEPS.findIndex((s) => s.key === status);
    return idx !== -1 ? idx : 0;
  };

  const currentStepIdx = trackingData ? getStepIndex(trackingData.projectStatus) : 0;

  return (
    <div
      id="track-order-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="track-order-modal-container"
        className="relative w-full max-w-2xl my-8 bg-[#080b12] border border-white/[0.1] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white">
                Track Project Status
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Nexora Private Milestone Tracker
              </p>
            </div>
          </div>

          <button
            id="track-modal-close-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Close Tracking Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Section */}
        <div className="p-6 border-b border-white/[0.06] bg-white/[0.01]">
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Enter Your Order ID
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="track-order-id-input"
                  type="text"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="e.g. NEX-2026-0001"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-cyan-400 focus:outline-none text-white text-sm font-mono uppercase tracking-wider"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <button
                id="track-search-btn"
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Quick Demo Helper */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Try sample test order:</span>
              <button
                type="button"
                onClick={() => {
                  setOrderIdInput('NEX-2026-0001');
                  fetchTracking('NEX-2026-0001');
                }}
                className="font-mono text-cyan-400 hover:underline cursor-pointer"
              >
                NEX-2026-0001
              </button>
            </div>
          </form>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Order Not Found</p>
                <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {!trackingData && !errorMessage && !isLoading && (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                Track your active website or app project
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Enter the unique Order ID you received during checkout to see development stages, payment status, and delivery schedules.
              </p>
            </div>
          )}

          {trackingData && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Top Overview Card */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400 block">
                      Order Reference
                    </span>
                    <h4 className="font-mono font-bold text-xl text-white tracking-wider">
                      {trackingData.id}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {trackingData.projectTypeName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                        trackingData.paymentStatus === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : trackingData.paymentStatus === 'failed'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      Payment: {trackingData.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Order Placed</span>
                    <span className="text-white font-mono">
                      {new Date(trackingData.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Estimated Delivery</span>
                    <span className="text-cyan-300 font-mono font-semibold">
                      {trackingData.deliveryDate}
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block mb-0.5">Current Stage</span>
                    <span className="text-white font-semibold capitalize">
                      {trackingData.projectStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 7-Step Progress Tracker */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Project Milestones (7-Stage Workflow)
                  </span>
                  <span className="text-xs font-mono text-cyan-400">
                    Stage {currentStepIdx + 1} of {PROJECT_STATUS_STEPS.length}
                  </span>
                </div>

                <div className="space-y-3 relative before:absolute before:left-[17px] before:top-3 before:bottom-3 before:w-[2px] before:bg-white/[0.08]">
                  {PROJECT_STATUS_STEPS.map((step, idx) => {
                    const isPassed = idx < currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div
                        key={step.key}
                        className={`relative flex items-start gap-4 p-3.5 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-cyan-950/30 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                            : isPassed
                            ? 'bg-white/[0.02] border-white/[0.06] opacity-90'
                            : 'bg-white/[0.01] border-white/[0.03] opacity-40'
                        }`}
                      >
                        {/* Step Marker Dot */}
                        <div
                          className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 border ${
                            isCurrent
                              ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                              : isPassed
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : 'bg-white/[0.04] text-slate-400 border-white/[0.1]'
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <span>{step.stepNumber}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5
                              className={`text-sm font-semibold ${
                                isCurrent
                                  ? 'text-cyan-300'
                                  : isPassed
                                  ? 'text-white'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step.label}
                            </h5>
                            {isCurrent && (
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                In Progress
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                            {step.shortDesc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status History Logs */}
              {trackingData.statusHistory && trackingData.statusHistory.length > 0 && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Milestone Activity Log
                  </span>
                  <div className="space-y-2">
                    {trackingData.statusHistory.map((item, hIdx) => (
                      <div
                        key={hIdx}
                        className="text-xs text-slate-300 flex items-start justify-between gap-3 pb-2 border-b border-white/[0.03] last:border-0 last:pb-0"
                      >
                        <div>
                          <span className="font-semibold text-white capitalize block">
                            {item.status.replace(/_/g, ' ')}
                          </span>
                          {item.note && <span className="text-slate-400">{item.note}</span>}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Help & WhatsApp Inquiry Button */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left space-y-0.5">
                  <p className="text-xs font-semibold text-white">
                    Need live development updates or want to discuss changes?
                  </p>
                  <p className="text-[11px] text-emerald-300/80">
                    Connect directly with Nexora developer @aabidd_26 on WhatsApp.
                  </p>
                </div>

                <a
                  href={BRAND_INFO.getWhatsAppChatUrl(
                    `Hello Nexora, inquiring about my project Order ID: ${trackingData.id}. Could you share the latest development update?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-[0_0_12px_rgba(16,185,129,0.3)] flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
