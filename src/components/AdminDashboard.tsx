import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
  Mail,
  FileText,
  Trash2,
  RefreshCw,
  LogOut,
  ChevronDown,
  ChevronUp,
  Download,
  AlertCircle,
  ShieldCheck,
  Tag,
  DollarSign
} from 'lucide-react';
import { PROJECT_STATUS_STEPS, BRAND_INFO } from '../data';
import { ProjectOrder, ProjectStatus, PaymentStatus } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('nexora_admin_token'));
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Orders and filtering
  const [orders, setOrders] = useState<ProjectOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Expanded order ID
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');

  useEffect(() => {
    if (token && isOpen) {
      fetchOrders();
    }
  }, [token, isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid admin credentials');
      }

      setToken(data.token);
      sessionStorage.setItem('nexora_admin_token', data.token);
      setPassword('');
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    if (token) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    setToken(null);
    sessionStorage.removeItem('nexora_admin_token');
    setOrders([]);
  };

  const fetchOrders = async () => {
    if (!token) return;
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newProjectStatus?: ProjectStatus,
    newPaymentStatus?: PaymentStatus
  ) => {
    if (!token) return;
    setUpdatingOrderId(orderId);

    try {
      const body: any = {};
      if (newProjectStatus) body.projectStatus = newProjectStatus;
      if (newPaymentStatus) body.paymentStatus = newPaymentStatus;
      if (statusUpdateNote.trim()) {
        body.statusNote = statusUpdateNote.trim();
      }

      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, ...data.order } : o))
        );
        setStatusUpdateNote('');
      }
    } catch (err) {
      console.error('Error updating order:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!token) return;
    if (!confirm(`Are you sure you want to delete order ${orderId}?`)) return;

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      }
    } catch (err) {
      console.error('Delete order error:', err);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    // Search query
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.email.toLowerCase().includes(q) ||
      order.whatsapp.includes(q) ||
      (order.brandName && order.brandName.toLowerCase().includes(q));

    // Type filter
    const matchesType =
      typeFilter === 'all' || order.projectType === typeFilter;

    // Payment filter
    const matchesPayment =
      paymentFilter === 'all' || order.paymentStatus === paymentFilter;

    // Status filter
    const matchesStatus =
      statusFilter === 'all' || order.projectStatus === statusFilter;

    return matchesSearch && matchesType && matchesPayment && matchesStatus;
  });

  return (
    <div
      id="admin-dashboard-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="admin-dashboard-modal-container"
        className="relative w-full max-w-5xl my-6 bg-[#07090f] border border-white/[0.1] rounded-2xl sm:rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white flex items-center gap-2">
                <span>NEXORA Admin Workspace</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40">
                  Private
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Managed by {BRAND_INFO.instagram}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}

            <button
              id="admin-modal-close-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated: Login View */}
        {!token ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full my-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="font-display font-bold text-2xl text-white">
                Admin Authentication
              </h4>
              <p className="text-xs sm:text-sm text-slate-400">
                Enter your admin authorization password to access customer orders and sprint controls.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Admin Password
                </label>
                <input
                  id="admin-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-cyan-400 focus:outline-none text-white text-sm"
                  autoFocus
                />
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  Default credentials: <span className="text-cyan-400">nexora@admin2026</span>
                </p>
              </div>

              <button
                id="admin-login-btn"
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? 'Verifying...' : 'Access Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">Total Orders</span>
                <span className="font-display font-extrabold text-2xl text-white">{orders.length}</span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">Pending Payment</span>
                <span className="font-display font-extrabold text-2xl text-amber-400">
                  {orders.filter((o) => o.paymentStatus === 'pending').length}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">In Development</span>
                <span className="font-display font-extrabold text-2xl text-purple-400">
                  {orders.filter((o) => ['requirement_review', 'development', 'testing'].includes(o.projectStatus)).length}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">Completed</span>
                <span className="font-display font-extrabold text-2xl text-emerald-400">
                  {orders.filter((o) => o.projectStatus === 'completed').length}
                </span>
              </div>
            </div>

            {/* Search & Filters Bar */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Order ID, Customer Name, Email, WhatsApp..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] focus:border-cyan-400 focus:outline-none text-white text-xs"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  type="button"
                  onClick={fetchOrders}
                  disabled={isLoadingOrders}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  title="Refresh Orders"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* Type Filter */}
                <div>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0e121d] border border-white/[0.1] text-slate-300 text-xs"
                  >
                    <option value="all">Project Type: All</option>
                    <option value="website">Website</option>
                    <option value="mobile_app">Mobile App</option>
                    <option value="combo">Combo (Web + App)</option>
                    <option value="branding">Logo & Branding</option>
                  </select>
                </div>

                {/* Payment Status Filter */}
                <div>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0e121d] border border-white/[0.1] text-slate-300 text-xs"
                  >
                    <option value="all">Payment Status: All</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                {/* Project Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0e121d] border border-white/[0.1] text-slate-300 text-xs"
                  >
                    <option value="all">Project Stage: All</option>
                    {PROJECT_STATUS_STEPS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.stepNumber}. {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Showing {filteredOrders.length} of {orders.length} orders</span>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-white/[0.01] border border-white/[0.04] rounded-2xl">
                  <p className="text-sm">No orders match the selected filters.</p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-500/30 transition-all overflow-hidden"
                    >
                      {/* Summary Row */}
                      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-bold text-sm text-cyan-300 tracking-wider">
                              {order.id}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.1] text-white font-medium">
                              {order.projectTypeName}
                            </span>
                            <span
                              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                                order.paymentStatus === 'paid'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : order.paymentStatus === 'failed'
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              Payment: {order.paymentStatus}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                            <span>
                              Client: <strong className="text-white">{order.customerName}</strong>
                              {order.brandName && ` (${order.brandName})`}
                            </span>
                            <span className="text-slate-400 font-mono">
                              Ordered: {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-cyan-400/90 font-mono">
                              Target: {order.deliveryDate}
                            </span>
                            <span className="text-white font-mono font-bold">
                              ₹{order.totalAmount?.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Status Dropdown & Actions */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {/* Quick Project Status Selector */}
                          <select
                            value={order.projectStatus}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, e.target.value as ProjectStatus)
                            }
                            disabled={updatingOrderId === order.id}
                            className="px-3 py-1.5 rounded-lg bg-[#0b0e18] border border-cyan-500/40 text-xs font-semibold text-cyan-300 cursor-pointer focus:outline-none"
                          >
                            {PROJECT_STATUS_STEPS.map((s) => (
                              <option key={s.key} value={s.key}>
                                Stage {s.stepNumber}: {s.label}
                              </option>
                            ))}
                          </select>

                          {/* Quick Payment Status Toggle */}
                          <select
                            value={order.paymentStatus}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, undefined, e.target.value as PaymentStatus)
                            }
                            disabled={updatingOrderId === order.id}
                            className="px-2.5 py-1.5 rounded-lg bg-[#0b0e18] border border-white/[0.1] text-xs font-medium text-slate-200 cursor-pointer focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                          </select>

                          {/* Expand Details Toggle */}
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedOrderId(isExpanded ? null : order.id)
                            }
                            className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Toggle Full Order Details"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Deep Drawer */}
                      {isExpanded && (
                        <div className="p-5 border-t border-white/[0.06] bg-black/30 space-y-5 animate-in fade-in duration-150">
                          {/* Quick Client Action Bar */}
                          <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-white/[0.06]">
                            <a
                              href={`https://wa.me/91${order.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hello ${order.customerName}, this is Nexora regarding your Order ID: ${order.id}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp Client ({order.whatsapp})</span>
                            </a>

                            <a
                              href={`mailto:${order.email}?subject=${encodeURIComponent(
                                `Nexora Project Update - Order ${order.id}`
                              )}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email ({order.email})</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="ml-auto inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Delete Order Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>

                          {/* Requirements & Concept */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-slate-400 uppercase font-mono block mb-1">
                                Concept & Idea
                              </span>
                              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-slate-200 leading-relaxed">
                                {order.projectConcept}
                              </div>
                            </div>

                            <div>
                              <span className="text-slate-400 uppercase font-mono block mb-1">
                                Requirements & Pages
                              </span>
                              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-slate-200 leading-relaxed">
                                {order.requirements || 'No extra page specs provided.'}
                              </div>
                            </div>
                          </div>

                          {/* Selected Features */}
                          {order.features && order.features.length > 0 && (
                            <div>
                              <span className="text-slate-400 uppercase font-mono text-xs block mb-1.5">
                                Requested Features
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {order.features.map((feat) => (
                                  <span
                                    key={feat}
                                    className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] text-cyan-300"
                                  >
                                    {feat}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Reference Links */}
                          {order.referenceLinks && (
                            <div>
                              <span className="text-slate-400 uppercase font-mono text-xs block mb-1">
                                Reference Links
                              </span>
                              <a
                                href={order.referenceLinks}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1"
                              >
                                <span>{order.referenceLinks}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}

                          {/* Attached Files & Assets */}
                          <div>
                            <span className="text-slate-400 uppercase font-mono text-xs block mb-2">
                              Client Uploaded Files ({order.files?.length || 0})
                            </span>
                            {!order.files || order.files.length === 0 ? (
                              <p className="text-xs text-slate-400 italic">No files attached by client.</p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {order.files.map((file) => (
                                  <div
                                    key={file.id}
                                    className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-2"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      {file.dataUrl && file.type.startsWith('image/') ? (
                                        <img
                                          src={file.dataUrl}
                                          alt={file.name}
                                          className="w-8 h-8 rounded object-cover border border-white/[0.1] shrink-0"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded bg-white/[0.05] flex items-center justify-center text-cyan-400 shrink-0">
                                          <FileText className="w-4 h-4" />
                                        </div>
                                      )}
                                      <div className="min-w-0">
                                        <p className="text-xs text-white truncate font-medium">
                                          {file.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-mono capitalize">
                                          {file.category}
                                        </p>
                                      </div>
                                    </div>

                                    {file.dataUrl && (
                                      <a
                                        href={file.dataUrl}
                                        download={file.name}
                                        className="p-1.5 rounded text-slate-400 hover:text-white transition-colors"
                                        title="Download File"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Status History Timeline */}
                          {order.statusHistory && order.statusHistory.length > 0 && (
                            <div>
                              <span className="text-slate-400 uppercase font-mono text-xs block mb-1.5">
                                Milestone Log History
                              </span>
                              <div className="space-y-1.5 text-xs text-slate-300">
                                {order.statusHistory.map((item, i) => (
                                  <div
                                    key={i}
                                    className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-start justify-between gap-2"
                                  >
                                    <div>
                                      <span className="font-semibold text-white capitalize block">
                                        {item.status.replace(/_/g, ' ')}
                                      </span>
                                      {item.note && <span className="text-slate-400 text-[11px]">{item.note}</span>}
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                      {new Date(item.updatedAt).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
