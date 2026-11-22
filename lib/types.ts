export type CompanyStatus = "Active" | "Trial" | "Suspended" | "Draft" | "Archived";
export type PlanName = "Starter" | "Growth" | "Enterprise";
export type BillingCycle = "Monthly" | "Annual";
export type HealthStatus = "Healthy" | "At risk" | "Critical";
export type PaymentStatus = "Paid" | "Pending" | "Overdue";

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  icon: string;
  enabled: boolean;
  companies: number;
  revenue: number;
  color: string;
}

export interface Plan {
  id: PlanName;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceAnnual: number;
  includedSeats: number;
  includedStorage: number;
  companies: number;
  popular?: boolean;
  features: string[];
}

export interface CompanyAdmin {
  name: string;
  designation: string;
  email: string;
  phone: string;
  username: string;
  lastLogin: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  description: string;
  actor: string;
  timestamp: string;
  type: "company" | "billing" | "support" | "security" | "domain" | "feature";
}

export interface Invoice {
  id: string;
  company: string;
  plan: PlanName;
  amount: number;
  cycle: BillingCycle;
  status: PaymentStatus;
  issued: string;
  due?: string;
}

export interface CompanyDraftData {
  name: string;
  companyEmail: string;
  companyPhone: string;
  logoFileName: string;
  industry: string;
  subdomain: string;
  website: string;
  city: string;
  address: string;
  logoColor: string;
  adminName: string;
  adminDesignation: string;
  adminEmail: string;
  adminPhone: string;
  adminUsername: string;
  plan: PlanName;
  cycle: BillingCycle;
  startDate: string;
  expiryDate: string;
  addons: string[];
  maxUsers: number;
  maxEmployees: number;
  maxLocations: number;
  storageLimit: number;
  apiLimit: number;
}

export interface Company {
  id: string;
  name: string;
  shortName: string;
  initials: string;
  logoColor: string;
  logoFileName?: string;
  industry: string;
  subdomain: string;
  customDomain?: string;
  sslStatus: "Active" | "Pending" | "Issued";
  admin: CompanyAdmin;
  plan: PlanName;
  billingCycle: BillingCycle;
  status: CompanyStatus;
  health: HealthStatus;
  paymentStatus: PaymentStatus;
  addons: string[];
  users: number;
  maxUsers: number;
  employees: number;
  maxEmployees: number;
  locations: number;
  maxLocations: number;
  storageUsed: number;
  storageLimit: number;
  apiCalls: number;
  apiLimit: number;
  mrr: number;
  subscriptionStart?: string;
  expiry: string;
  createdAt: string;
  lastActive: string;
  country: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  draftData?: CompanyDraftData;
}

export interface TicketMessage {
  id: string;
  author: string;
  role: string;
  body: string;
  timestamp: string;
  internal?: boolean;
}

export interface Ticket {
  id: string;
  subject: string;
  company: string;
  requester: string;
  priority: "Urgent" | "High" | "Medium" | "Low";
  status: "Open" | "In progress" | "Waiting on company" | "Resolved";
  category: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  target: string;
  ip: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
}

export interface LoginRecord {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  timestamp: string;
  status: "Success" | "Failed";
  current?: boolean;
}
