export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  startingPrice: string;
  priceSuffix?: string;
  features: string[];
  iconName: string;
  badge?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  popular?: boolean;
  features: string[];
  description: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  whatsapp: string;
  service: string;
  projectDetails: string;
}

export type ProjectStatus =
  | 'received'
  | 'payment_verified'
  | 'requirement_review'
  | 'development'
  | 'testing'
  | 'ready_for_delivery'
  | 'completed';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type ProjectType =
  | 'website'
  | 'mobile_app'
  | 'combo'
  | 'branding'
  | 'maintenance';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: 'logo' | 'photos' | 'documents' | 'references';
  dataUrl?: string; // base64 preview
}

export interface StatusHistoryItem {
  status: ProjectStatus;
  note?: string;
  updatedAt: string;
}

export interface ProjectOrder {
  id: string;
  customerName: string;
  whatsapp: string;
  email: string;
  brandName?: string;
  projectType: ProjectType;
  projectTypeName: string;
  projectConcept: string;
  requirements: string;
  features: string[];
  deliveryDate: string;
  budget: string;
  referenceLinks?: string;
  files: UploadedFile[];
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentTransactionId?: string;
  projectStatus: ProjectStatus;
  statusHistory: StatusHistoryItem[];
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicOrderTracking {
  id: string;
  projectTypeName: string;
  projectType: ProjectType;
  createdAt: string;
  deliveryDate: string;
  paymentStatus: PaymentStatus;
  projectStatus: ProjectStatus;
  statusHistory: StatusHistoryItem[];
}
