import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nexora@admin2026';

// Keep active admin session tokens in memory
const activeAdminTokens = new Set<string>();

// Ensure data folder and orders.json exist
function ensureDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

interface OrderRecord {
  id: string;
  customerName: string;
  whatsapp: string;
  email: string;
  brandName?: string;
  projectType: string;
  projectTypeName: string;
  projectConcept: string;
  requirements: string;
  features: string[];
  deliveryDate: string;
  budget: string;
  referenceLinks?: string;
  files: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    category: string;
    dataUrl?: string;
  }>;
  totalAmount: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod?: string;
  paymentTransactionId?: string;
  projectStatus:
    | 'received'
    | 'payment_verified'
    | 'requirement_review'
    | 'development'
    | 'testing'
    | 'ready_for_delivery'
    | 'completed';
  statusHistory: Array<{
    status: string;
    note?: string;
    updatedAt: string;
  }>;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

function readOrders(): OrderRecord[] {
  ensureDatabase();
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw) as OrderRecord[];
  } catch (err) {
    console.error('Error reading orders file:', err);
    return [];
  }
}

function writeOrders(orders: OrderRecord[]): boolean {
  ensureDatabase();
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing orders file:', err);
    return false;
  }
}

function generateOrderId(existingOrders: OrderRecord[]): string {
  const year = new Date().getFullYear();
  // Generate random 4 digit string, check for uniqueness
  for (let i = 0; i < 50; i++) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const candidateId = `NEX-${year}-${randomNum}`;
    if (!existingOrders.some((o) => o.id === candidateId)) {
      return candidateId;
    }
  }
  return `NEX-${year}-${Date.now().toString().slice(-4)}`;
}

// Authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication token required' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!activeAdminTokens.has(token)) {
    res.status(401).json({ success: false, error: 'Session expired or invalid token. Please log in again.' });
    return;
  }
  next();
}

async function startServer() {
  ensureDatabase();

  // Support JSON bodies with generous limit for client-uploaded base64 file previews
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'NEXORA Platform API', timestamp: new Date().toISOString() });
  });

  // 1. Create New Order (Customer)
  app.post('/api/orders', (req, res) => {
    try {
      const {
        customerName,
        whatsapp,
        email,
        brandName,
        projectType,
        projectTypeName,
        projectConcept,
        requirements,
        features,
        deliveryDate,
        budget,
        referenceLinks,
        files,
        totalAmount,
      } = req.body;

      if (!customerName || !whatsapp || !email || !projectType || !projectConcept) {
        res.status(400).json({
          success: false,
          error: 'Please fill in all required fields (Name, WhatsApp, Email, Project Type, and Concept).',
        });
        return;
      }

      const orders = readOrders();
      const orderId = generateOrderId(orders);
      const now = new Date().toISOString();

      const newOrder: OrderRecord = {
        id: orderId,
        customerName: String(customerName).trim(),
        whatsapp: String(whatsapp).trim(),
        email: String(email).trim().toLowerCase(),
        brandName: brandName ? String(brandName).trim() : undefined,
        projectType: String(projectType),
        projectTypeName: projectTypeName || 'Digital Project',
        projectConcept: String(projectConcept).trim(),
        requirements: String(requirements || '').trim(),
        features: Array.isArray(features) ? features : [],
        deliveryDate: deliveryDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        budget: budget || '₹1,499+',
        referenceLinks: referenceLinks ? String(referenceLinks).trim() : undefined,
        files: Array.isArray(files) ? files : [],
        totalAmount: Number(totalAmount) || 1499,
        currency: 'INR',
        paymentStatus: 'pending',
        projectStatus: 'received',
        statusHistory: [
          {
            status: 'received',
            note: 'Order placed online. Requirements saved in Nexora private database.',
            updatedAt: now,
          },
        ],
        adminNotes: '',
        createdAt: now,
        updatedAt: now,
      };

      orders.unshift(newOrder);
      writeOrders(orders);

      res.status(201).json({
        success: true,
        orderId: newOrder.id,
        order: {
          id: newOrder.id,
          customerName: newOrder.customerName,
          projectTypeName: newOrder.projectTypeName,
          totalAmount: newOrder.totalAmount,
          currency: newOrder.currency,
          paymentStatus: newOrder.paymentStatus,
          projectStatus: newOrder.projectStatus,
          createdAt: newOrder.createdAt,
          deliveryDate: newOrder.deliveryDate,
        },
      });
    } catch (err: any) {
      console.error('Error creating order:', err);
      res.status(500).json({ success: false, error: 'Internal server error processing order.' });
    }
  });

  // 2. Track Order by ID (Customer - STRICT PRIVACY PRESERVED)
  app.get('/api/orders/track/:orderId', (req, res) => {
    try {
      const { orderId } = req.params;
      if (!orderId) {
        res.status(400).json({ success: false, error: 'Order ID is required' });
        return;
      }

      const orders = readOrders();
      const cleanSearch = orderId.trim().toUpperCase();
      const order = orders.find((o) => o.id.toUpperCase() === cleanSearch);

      if (!order) {
        res.status(404).json({
          success: false,
          error: `No project found matching Order ID "${orderId}". Please verify your ID or contact support.`,
        });
        return;
      }

      // PRIVACY MANDATE: Return ONLY public tracking fields.
      // Do NOT expose customer personal data, other orders, or admin notes to public tracking.
      const publicTracking = {
        id: order.id,
        projectTypeName: order.projectTypeName,
        projectType: order.projectType,
        createdAt: order.createdAt,
        deliveryDate: order.deliveryDate,
        paymentStatus: order.paymentStatus,
        projectStatus: order.projectStatus,
        statusHistory: order.statusHistory,
      };

      res.json({
        success: true,
        tracking: publicTracking,
      });
    } catch (err) {
      console.error('Error tracking order:', err);
      res.status(500).json({ success: false, error: 'Internal server error checking order status.' });
    }
  });

  // 3. Update Payment Status (Payment simulation / gateway webhook / test action)
  app.post('/api/orders/:orderId/payment', (req, res) => {
    try {
      const { orderId } = req.params;
      const { status, paymentMethod, transactionId } = req.body;

      if (!['pending', 'paid', 'failed'].includes(status)) {
        res.status(400).json({ success: false, error: 'Invalid payment status' });
        return;
      }

      const orders = readOrders();
      const cleanSearch = orderId.trim().toUpperCase();
      const index = orders.findIndex((o) => o.id.toUpperCase() === cleanSearch);

      if (index === -1) {
        res.status(404).json({ success: false, error: 'Order not found' });
        return;
      }

      const order = orders[index];
      const now = new Date().toISOString();

      order.paymentStatus = status;
      if (paymentMethod) order.paymentMethod = paymentMethod;
      if (transactionId) order.paymentTransactionId = transactionId;
      order.updatedAt = now;

      // If payment is successful and project is currently 'received', automatically advance to 'payment_verified'
      if (status === 'paid' && order.projectStatus === 'received') {
        order.projectStatus = 'payment_verified';
        order.statusHistory.push({
          status: 'payment_verified',
          note: `Payment of ₹${order.totalAmount} verified via ${order.paymentMethod || 'online transfer'}. Project queued for sprint.`,
          updatedAt: now,
        });
      } else if (status === 'failed') {
        order.statusHistory.push({
          status: order.projectStatus,
          note: 'Payment attempt was unsuccessful or cancelled. Pending resolution.',
          updatedAt: now,
        });
      }

      orders[index] = order;
      writeOrders(orders);

      res.json({
        success: true,
        order: {
          id: order.id,
          paymentStatus: order.paymentStatus,
          projectStatus: order.projectStatus,
          updatedAt: order.updatedAt,
        },
      });
    } catch (err) {
      console.error('Error updating payment:', err);
      res.status(500).json({ success: false, error: 'Payment processing error' });
    }
  });

  // 4. Admin Login
  app.post('/api/admin/login', (req, res) => {
    try {
      const { password } = req.body;
      if (!password || String(password) !== ADMIN_PASSWORD) {
        res.status(401).json({ success: false, error: 'Invalid admin authorization password.' });
        return;
      }

      // Generate a cryptographically secure session token
      const token = crypto.randomBytes(32).toString('hex');
      activeAdminTokens.add(token);

      res.json({
        success: true,
        token,
        message: 'Admin access granted.',
      });
    } catch (err) {
      console.error('Error during admin login:', err);
      res.status(500).json({ success: false, error: 'Login error' });
    }
  });

  // 5. Admin Token Verification
  app.get('/api/admin/verify', requireAdmin, (req, res) => {
    res.json({ success: true, authenticated: true });
  });

  // 6. Admin Logout
  app.post('/api/admin/logout', requireAdmin, (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      activeAdminTokens.delete(token);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // 7. Get All Orders (Admin only)
  app.get('/api/admin/orders', requireAdmin, (req, res) => {
    try {
      const orders = readOrders();
      res.json({ success: true, orders });
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      res.status(500).json({ success: false, error: 'Failed to retrieve orders.' });
    }
  });

  // 8. Update Order Project / Payment Status & Notes (Admin only)
  app.patch('/api/admin/orders/:orderId', requireAdmin, (req, res) => {
    try {
      const { orderId } = req.params;
      const { projectStatus, paymentStatus, adminNotes, statusNote } = req.body;

      const orders = readOrders();
      const cleanSearch = orderId.trim().toUpperCase();
      const index = orders.findIndex((o) => o.id.toUpperCase() === cleanSearch);

      if (index === -1) {
        res.status(404).json({ success: false, error: 'Order not found' });
        return;
      }

      const order = orders[index];
      const now = new Date().toISOString();

      if (projectStatus && projectStatus !== order.projectStatus) {
        order.projectStatus = projectStatus;
        order.statusHistory.push({
          status: projectStatus,
          note: statusNote || `Status updated to ${projectStatus.replace(/_/g, ' ')} by Nexora Admin`,
          updatedAt: now,
        });
      }

      if (paymentStatus && paymentStatus !== order.paymentStatus) {
        order.paymentStatus = paymentStatus;
      }

      if (typeof adminNotes === 'string') {
        order.adminNotes = adminNotes;
      }

      order.updatedAt = now;
      orders[index] = order;
      writeOrders(orders);

      res.json({
        success: true,
        order,
      });
    } catch (err) {
      console.error('Error updating order:', err);
      res.status(500).json({ success: false, error: 'Failed to update order' });
    }
  });

  // 9. Delete Order (Admin only)
  app.delete('/api/admin/orders/:orderId', requireAdmin, (req, res) => {
    try {
      const { orderId } = req.params;
      const orders = readOrders();
      const cleanSearch = orderId.trim().toUpperCase();
      const filtered = orders.filter((o) => o.id.toUpperCase() !== cleanSearch);

      if (filtered.length === orders.length) {
        res.status(404).json({ success: false, error: 'Order not found' });
        return;
      }

      writeOrders(filtered);
      res.json({ success: true, message: `Order ${orderId} removed.` });
    } catch (err) {
      console.error('Error deleting order:', err);
      res.status(500).json({ success: false, error: 'Failed to delete order' });
    }
  });

  // --- Vite / Frontend Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nexora Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
