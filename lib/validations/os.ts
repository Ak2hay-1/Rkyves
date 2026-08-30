import { z } from "zod";

export const clientSchema = z.object({
  companyName: z.string().min(1),
  contactPerson: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  gst: z.string().optional(),
  pan: z.string().optional(),
  industry: z.string().optional(),
  businessType: z.string().optional(),
  status: z.enum(["lead", "active", "inactive", "churned", "at_risk"]).optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
});

export const projectSchema = z.object({
  clientId: z.string().uuid(),
  serviceId: z.string().uuid().optional().nullable(),
  name: z.string().min(1),
  description: z.string().optional(),
  startDate: z.string().optional(),
  deadline: z.string().optional(),
  status: z.enum(["planning", "in_progress", "on_hold", "review", "completed", "cancelled"]).optional(),
  progress: z.number().min(0).max(100).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
});

export const taskSchema = z.object({
  projectId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "review", "completed"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  assignedToId: z.string().uuid().optional().nullable(),
  dueDate: z.string().optional(),
  sortOrder: z.number().optional(),
});

export const serviceSchema = z.object({
  clientId: z.string().uuid(),
  name: z.string().min(1),
  type: z.enum(["website", "pos", "erp", "cullinos", "hosting", "domain", "seo", "whatsapp", "payment_gateway", "custom_development", "maintenance", "support", "other"]),
  plan: z.string().optional(),
  price: z.string().optional(),
  billingCycle: z.enum(["one_time", "monthly", "quarterly", "yearly"]).optional(),
  status: z.enum(["active", "pending", "expired", "cancelled", "suspended"]).optional(),
  expiryDate: z.string().optional(),
  startDate: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  projectId: z.string().uuid().optional().nullable(),
});

export const leadSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  source: z.string().optional(),
  stage: z.enum(["lead", "contacted", "requirement", "proposal", "negotiation", "won", "lost"]).optional(),
  requirement: z.string().optional(),
  expectedValue: z.string().optional(),
  probability: z.number().min(0).max(100).optional(),
  followUpDate: z.string().optional(),
  notes: z.string().optional(),
});

export const invoiceItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().min(1).optional(),
  unitPrice: z.string(),
  discount: z.string().optional(),
  tax: z.string().optional(),
  serviceId: z.string().uuid().optional().nullable(),
});

export const invoiceSchema = z.object({
  clientId: z.string().uuid(),
  status: z.enum(["draft", "sent", "partially_paid", "paid", "overdue", "cancelled"]).optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  discount: z.string().optional(),
  tax: z.string().optional(),
  items: z.array(invoiceItemSchema).optional(),
});

export const paymentSchema = z.object({
  clientId: z.string().uuid(),
  invoiceId: z.string().uuid().optional().nullable(),
  amount: z.string(),
  method: z.enum(["bank_transfer", "upi", "card", "cash", "cheque", "razorpay", "other"]).optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
  paidAt: z.string().optional(),
});

export const ticketSchema = z.object({
  clientId: z.string().uuid(),
  subject: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  category: z.enum(["general", "technical", "billing", "hosting", "website", "pos", "erp", "other"]).optional(),
  status: z.enum(["new", "assigned", "in_progress", "waiting_client", "resolved", "closed"]).optional(),
  assignedToId: z.string().uuid().optional().nullable(),
  resolution: z.string().optional(),
});

export const credentialSchema = z.object({
  clientId: z.string().uuid(),
  name: z.string().min(1),
  category: z.string().min(1),
  username: z.string().optional(),
  password: z.string().optional(),
  url: z.string().optional(),
  notes: z.string().optional(),
});

export const websiteSchema = z.object({
  clientId: z.string().uuid(),
  serviceId: z.string().uuid().optional().nullable(),
  name: z.string().min(1),
  domain: z.string().optional(),
  domainExpiry: z.string().optional(),
  hosting: z.string().optional(),
  sslExpiry: z.string().optional(),
  server: z.string().optional(),
  status: z.enum(["online", "offline", "warning"]).optional(),
  seoEnabled: z.boolean().optional(),
  backupEnabled: z.boolean().optional(),
});

export const posDeploymentSchema = z.object({
  clientId: z.string().uuid(),
  serviceId: z.string().uuid().optional().nullable(),
  version: z.string().optional(),
  terminals: z.number().optional(),
  hardware: z.string().optional(),
  server: z.string().optional(),
  installationNotes: z.string().optional(),
});

export const erpDeploymentSchema = z.object({
  clientId: z.string().uuid(),
  serviceId: z.string().uuid().optional().nullable(),
  version: z.string().optional(),
  users: z.number().optional(),
  deployment: z.string().optional(),
  modules: z.array(z.string()).optional(),
});

export const teamUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(["super_admin", "admin", "sales", "project_manager", "developer", "support", "finance", "viewer"]),
  phone: z.string().optional(),
  password: z.string().min(8),
});

export const renewalSchema = z.object({
  clientId: z.string().uuid(),
  serviceId: z.string().uuid(),
  renewalDate: z.string(),
  amount: z.string(),
  status: z.enum(["upcoming", "due_soon", "overdue", "renewed", "expired", "cancelled"]).optional(),
  notes: z.string().optional(),
});

export const communicationSchema = z.object({
  clientId: z.string().uuid(),
  type: z.enum(["whatsapp", "email", "call", "note", "sms"]),
  subject: z.string().optional(),
  content: z.string().min(1),
  direction: z.enum(["inbound", "outbound"]).optional(),
});

export const orgSettingsSchema = z.object({
  companyName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  gst: z.string().optional(),
  pan: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  logoUrl: z.string().optional(),
  invoicePrefix: z.string().optional(),
  paymentTerms: z.string().optional(),
  timezone: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export const userPreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
});
