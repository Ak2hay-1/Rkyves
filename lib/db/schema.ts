import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  decimal,
  boolean,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "admin",
  "sales",
  "project_manager",
  "developer",
  "support",
  "finance",
  "viewer",
  "client",
]);

export const clientStatusEnum = pgEnum("client_status", [
  "lead",
  "active",
  "inactive",
  "churned",
  "at_risk",
]);

export const leadStageEnum = pgEnum("lead_stage", [
  "lead",
  "contacted",
  "requirement",
  "proposal",
  "negotiation",
  "won",
  "lost",
]);

export const serviceTypeEnum = pgEnum("service_type", [
  "website",
  "pos",
  "erp",
  "cullinos",
  "hosting",
  "domain",
  "seo",
  "whatsapp",
  "payment_gateway",
  "custom_development",
  "maintenance",
  "support",
  "other",
]);

export const serviceStatusEnum = pgEnum("service_status", [
  "active",
  "pending",
  "expired",
  "cancelled",
  "suspended",
]);

export const billingCycleEnum = pgEnum("billing_cycle", [
  "one_time",
  "monthly",
  "quarterly",
  "yearly",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "planning",
  "in_progress",
  "on_hold",
  "review",
  "completed",
  "cancelled",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "review",
  "completed",
]);

export const priorityEnum = pgEnum("priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "sent",
  "partially_paid",
  "paid",
  "overdue",
  "cancelled",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "bank_transfer",
  "upi",
  "card",
  "cash",
  "cheque",
  "razorpay",
  "other",
]);

export const ticketStatusEnum = pgEnum("ticket_status", [
  "new",
  "assigned",
  "in_progress",
  "waiting_client",
  "resolved",
  "closed",
]);

export const ticketCategoryEnum = pgEnum("ticket_category", [
  "general",
  "technical",
  "billing",
  "hosting",
  "website",
  "pos",
  "erp",
  "other",
]);

export const renewalStatusEnum = pgEnum("renewal_status", [
  "upcoming",
  "due_soon",
  "overdue",
  "renewed",
  "expired",
  "cancelled",
]);

export const activityTypeEnum = pgEnum("activity_type", [
  "call",
  "whatsapp",
  "email",
  "note",
  "meeting",
  "payment",
  "invoice",
  "project",
  "ticket",
  "service_change",
  "renewal",
  "decision",
  "system",
]);

export const documentCategoryEnum = pgEnum("document_category", [
  "contract",
  "proposal",
  "invoice",
  "gst",
  "requirement",
  "design",
  "project",
  "agreement",
  "other",
]);

export const communicationTypeEnum = pgEnum("communication_type", [
  "whatsapp",
  "email",
  "call",
  "note",
  "sms",
]);

export const websiteStatusEnum = pgEnum("website_status", [
  "online",
  "offline",
  "warning",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "lead",
  "client",
  "payment",
  "invoice",
  "renewal",
  "ticket",
  "project",
  "system",
  "cullinos",
]);

export const saasSubscriptionStatusEnum = pgEnum("saas_subscription_status", [
  "trial",
  "active",
  "past_due",
  "suspended",
  "cancelled",
]);

export const cullinosTenantStatusEnum = pgEnum("cullinos_tenant_status", [
  "provisioning",
  "active",
  "suspended",
  "cancelled",
]);

// ─── Users & Auth ────────────────────────────────────────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("viewer"),
    phone: varchar("phone", { length: 20 }),
    avatar: text("avatar"),
    isActive: boolean("is_active").notNull().default(true),
    clientId: uuid("client_id"),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email), index("users_role_idx").on(t.role)]
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 255 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("sessions_token_idx").on(t.token), index("sessions_user_idx").on(t.userId)]
);

// ─── Clients ─────────────────────────────────────────────────────────────────

export const clients = pgTable(
  "clients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyName: varchar("company_name", { length: 255 }).notNull(),
    contactPerson: varchar("contact_person", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    whatsapp: varchar("whatsapp", { length: 20 }),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    country: varchar("country", { length: 100 }).default("India"),
    gst: varchar("gst", { length: 20 }),
    pan: varchar("pan", { length: 20 }),
    industry: varchar("industry", { length: 100 }),
    businessType: varchar("business_type", { length: 100 }),
    status: clientStatusEnum("status").notNull().default("active"),
    healthScore: integer("health_score").default(100),
    assignedToId: uuid("assigned_to_id").references(() => users.id),
    notes: text("notes"),
    website: varchar("website", { length: 255 }),
    leadId: uuid("lead_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("clients_status_idx").on(t.status),
    index("clients_email_idx").on(t.email),
    index("clients_company_idx").on(t.companyName),
  ]
);

// ─── Leads ───────────────────────────────────────────────────────────────────

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    company: varchar("company", { length: 255 }),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 20 }),
    whatsapp: varchar("whatsapp", { length: 20 }),
    source: varchar("source", { length: 100 }),
    stage: leadStageEnum("stage").notNull().default("lead"),
    requirement: text("requirement"),
    expectedValue: decimal("expected_value", { precision: 12, scale: 2 }),
    probability: integer("probability").default(0),
    followUpDate: timestamp("follow_up_date", { withTimezone: true }),
    assignedToId: uuid("assigned_to_id").references(() => users.id),
    notes: text("notes"),
    proposalUrl: text("proposal_url"),
    lostReason: text("lost_reason"),
    convertedClientId: uuid("converted_client_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("leads_stage_idx").on(t.stage), index("leads_assigned_idx").on(t.assignedToId)]
);

// ─── Services ────────────────────────────────────────────────────────────────

export const services = pgTable(
  "services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    type: serviceTypeEnum("type").notNull(),
    plan: varchar("plan", { length: 100 }),
    startDate: timestamp("start_date", { withTimezone: true }),
    expiryDate: timestamp("expiry_date", { withTimezone: true }),
    price: decimal("price", { precision: 12, scale: 2 }).notNull().default("0"),
    billingCycle: billingCycleEnum("billing_cycle").notNull().default("yearly"),
    status: serviceStatusEnum("status").notNull().default("active"),
    assignedToId: uuid("assigned_to_id").references(() => users.id),
    projectId: uuid("project_id"),
    description: text("description"),
    notes: text("notes"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("services_client_idx").on(t.clientId),
    index("services_type_idx").on(t.type),
    index("services_status_idx").on(t.status),
    index("services_expiry_idx").on(t.expiryDate),
  ]
);

// ─── Projects ────────────────────────────────────────────────────────────────

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id").references(() => services.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    startDate: timestamp("start_date", { withTimezone: true }),
    deadline: timestamp("deadline", { withTimezone: true }),
    status: projectStatusEnum("status").notNull().default("planning"),
    progress: integer("progress").notNull().default(0),
    priority: priorityEnum("priority").notNull().default("medium"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("projects_client_idx").on(t.clientId),
    index("projects_status_idx").on(t.status),
  ]
);

export const projectMembers = pgTable(
  "project_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50 }).default("member"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("project_members_project_idx").on(t.projectId)]
);

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    status: taskStatusEnum("status").notNull().default("todo"),
    priority: priorityEnum("priority").notNull().default("medium"),
    assignedToId: uuid("assigned_to_id").references(() => users.id),
    dueDate: timestamp("due_date", { withTimezone: true }),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("tasks_project_idx").on(t.projectId),
    index("tasks_status_idx").on(t.status),
  ]
);

export const milestones = pgTable("milestones", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Billing ─────────────────────────────────────────────────────────────────

export const quotes = pgTable(
  "quotes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quoteNumber: varchar("quote_number", { length: 50 }).notNull(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    leadId: uuid("lead_id").references(() => leads.id),
    status: varchar("status", { length: 50 }).notNull().default("draft"),
    subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
    discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
    tax: decimal("tax", { precision: 12, scale: 2 }).default("0"),
    total: decimal("total", { precision: 12, scale: 2 }).notNull().default("0"),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    notes: text("notes"),
    createdById: uuid("created_by_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("quotes_number_idx").on(t.quoteNumber)]
);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    status: invoiceStatusEnum("status").notNull().default("draft"),
    subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
    discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
    tax: decimal("tax", { precision: 12, scale: 2 }).default("0"),
    total: decimal("total", { precision: 12, scale: 2 }).notNull().default("0"),
    amountPaid: decimal("amount_paid", { precision: 12, scale: 2 }).default("0"),
    dueDate: timestamp("due_date", { withTimezone: true }),
    isRecurring: boolean("is_recurring").default(false),
    recurringCycle: billingCycleEnum("recurring_cycle"),
    notes: text("notes"),
    createdById: uuid("created_by_id").references(() => users.id),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("invoices_number_idx").on(t.invoiceNumber),
    index("invoices_client_idx").on(t.clientId),
    index("invoices_status_idx").on(t.status),
    index("invoices_due_idx").on(t.dueDate),
  ]
);

export const invoiceItems = pgTable("invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id").references(() => services.id),
  description: varchar("description", { length: 500 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
});

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    invoiceId: uuid("invoice_id").references(() => invoices.id),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    method: paymentMethodEnum("method").notNull().default("bank_transfer"),
    reference: varchar("reference", { length: 255 }),
    notes: text("notes"),
    paidAt: timestamp("paid_at", { withTimezone: true }).notNull().defaultNow(),
    recordedById: uuid("recorded_by_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("payments_client_idx").on(t.clientId),
    index("payments_invoice_idx").on(t.invoiceId),
  ]
);

// ─── Renewals ────────────────────────────────────────────────────────────────

export const renewals = pgTable(
  "renewals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    renewalDate: timestamp("renewal_date", { withTimezone: true }).notNull(),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    status: renewalStatusEnum("status").notNull().default("upcoming"),
    reminderSent30: boolean("reminder_sent_30").default(false),
    reminderSent15: boolean("reminder_sent_15").default(false),
    reminderSent7: boolean("reminder_sent_7").default(false),
    reminderSent0: boolean("reminder_sent_0").default(false),
    renewedAt: timestamp("renewed_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("renewals_client_idx").on(t.clientId),
    index("renewals_date_idx").on(t.renewalDate),
    index("renewals_status_idx").on(t.status),
  ]
);

// ─── Support ─────────────────────────────────────────────────────────────────

export const tickets = pgTable(
  "tickets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ticketNumber: varchar("ticket_number", { length: 50 }).notNull(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    subject: varchar("subject", { length: 500 }).notNull(),
    description: text("description").notNull(),
    priority: priorityEnum("priority").notNull().default("medium"),
    category: ticketCategoryEnum("category").notNull().default("general"),
    status: ticketStatusEnum("status").notNull().default("new"),
    assignedToId: uuid("assigned_to_id").references(() => users.id),
    resolution: text("resolution"),
    slaHours: integer("sla_hours").default(24),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    createdById: uuid("created_by_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("tickets_number_idx").on(t.ticketNumber),
    index("tickets_client_idx").on(t.clientId),
    index("tickets_status_idx").on(t.status),
    index("tickets_priority_idx").on(t.priority),
  ]
);

// ─── Infrastructure ────────────────────────────────────────────────────────────

export const websites = pgTable(
  "websites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id").references(() => services.id),
    name: varchar("name", { length: 255 }).notNull(),
    domain: varchar("domain", { length: 255 }),
    domainExpiry: timestamp("domain_expiry", { withTimezone: true }),
    hosting: varchar("hosting", { length: 255 }),
    sslExpiry: timestamp("ssl_expiry", { withTimezone: true }),
    server: varchar("server", { length: 255 }),
    database: varchar("database", { length: 255 }),
    gitRepo: text("git_repo"),
    deployment: varchar("deployment", { length: 255 }),
    vercelProject: varchar("vercel_project", { length: 255 }),
    analytics: varchar("analytics", { length: 255 }),
    seoEnabled: boolean("seo_enabled").default(false),
    backupEnabled: boolean("backup_enabled").default(false),
    status: websiteStatusEnum("status").notNull().default("online"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("websites_client_idx").on(t.clientId)]
);

export const posDeployments = pgTable("pos_deployments", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id").references(() => services.id),
  version: varchar("version", { length: 50 }),
  terminals: integer("terminals").default(1),
  hardware: text("hardware"),
  printers: text("printers"),
  barcodeScanners: text("barcode_scanners"),
  server: varchar("server", { length: 255 }),
  installationNotes: text("installation_notes"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const erpDeployments = pgTable("erp_deployments", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id").references(() => services.id),
  version: varchar("version", { length: 50 }),
  modules: jsonb("modules").$type<string[]>(),
  users: integer("users").default(1),
  deployment: varchar("deployment", { length: 255 }),
  integrations: jsonb("integrations").$type<string[]>(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Cullinos SaaS ───────────────────────────────────────────────────────────

export const productPlans = pgTable(
  "product_plans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 50 }).notNull().unique(),
    description: text("description"),
    priceMonthly: decimal("price_monthly", { precision: 12, scale: 2 }).notNull().default("0"),
    priceYearly: decimal("price_yearly", { precision: 12, scale: 2 }).notNull().default("0"),
    maxOutlets: integer("max_outlets").notNull().default(1),
    maxTerminals: integer("max_terminals").notNull().default(2),
    modules: jsonb("modules").$type<string[]>().default([]),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  }
);

export const cullinosTenants = pgTable(
  "cullinos_tenants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id").references(() => services.id),
    planId: uuid("plan_id").references(() => productPlans.id),
    cullinosOrgId: varchar("cullinos_org_id", { length: 100 }),
    slug: varchar("slug", { length: 100 }),
    status: cullinosTenantStatusEnum("status").notNull().default("provisioning"),
    outletCount: integer("outlet_count").default(1),
    terminalCount: integer("terminal_count").default(1),
    gatewayStatus: varchar("gateway_status", { length: 50 }),
    lastSyncAt: timestamp("last_sync_at", { withTimezone: true }),
    provisionedAt: timestamp("provisioned_at", { withTimezone: true }),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("cullinos_tenants_client_idx").on(t.clientId),
    index("cullinos_tenants_status_idx").on(t.status),
    uniqueIndex("cullinos_tenants_org_idx").on(t.cullinosOrgId),
  ]
);

export const saasSubscriptions = pgTable(
  "saas_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id").references(() => services.id),
    tenantId: uuid("tenant_id").references(() => cullinosTenants.id),
    planId: uuid("plan_id").references(() => productPlans.id),
    status: saasSubscriptionStatusEnum("status").notNull().default("trial"),
    razorpaySubscriptionId: varchar("razorpay_subscription_id", { length: 100 }),
    trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    graceUntil: timestamp("grace_until", { withTimezone: true }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("saas_subscriptions_client_idx").on(t.clientId),
    index("saas_subscriptions_status_idx").on(t.status),
  ]
);

export const usageSnapshots = pgTable(
  "usage_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => cullinosTenants.id, { onDelete: "cascade" }),
    terminalsActive: integer("terminals_active").default(0),
    ordersMtd: integer("orders_mtd").default(0),
    metrics: jsonb("metrics").$type<Record<string, unknown>>(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("usage_snapshots_tenant_idx").on(t.tenantId)]
);

// ─── Documents & Credentials ─────────────────────────────────────────────────

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    category: documentCategoryEnum("category").notNull().default("other"),
    fileUrl: text("file_url"),
    fileSize: integer("file_size"),
    mimeType: varchar("mime_type", { length: 100 }),
    uploadedById: uuid("uploaded_by_id").references(() => users.id),
    isClientVisible: boolean("is_client_visible").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("documents_client_idx").on(t.clientId)]
);

export const credentials = pgTable(
  "credentials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    username: text("username"),
    encryptedPassword: text("encrypted_password"),
    encryptedData: text("encrypted_data"),
    url: text("url"),
    notes: text("notes"),
    createdById: uuid("created_by_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("credentials_client_idx").on(t.clientId)]
);

export const credentialAccessLogs = pgTable("credential_access_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  credentialId: uuid("credential_id")
    .notNull()
    .references(() => credentials.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  ipAddress: varchar("ip_address", { length: 45 }),
  accessedAt: timestamp("accessed_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Activity & Communication ────────────────────────────────────────────────

export const activities = pgTable(
  "activities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    type: activityTypeEnum("type").notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    userId: uuid("user_id").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("activities_client_idx").on(t.clientId),
    index("activities_type_idx").on(t.type),
    index("activities_created_idx").on(t.createdAt),
  ]
);

export const communications = pgTable(
  "communications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    type: communicationTypeEnum("type").notNull(),
    subject: varchar("subject", { length: 500 }),
    content: text("content").notNull(),
    direction: varchar("direction", { length: 20 }).default("outbound"),
    userId: uuid("user_id").references(() => users.id),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("communications_client_idx").on(t.clientId)]
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message"),
    link: text("link"),
    isRead: boolean("is_read").default(false),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("notifications_user_idx").on(t.userId), index("notifications_read_idx").on(t.isRead)]
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entity_type", { length: 50 }).notNull(),
    entityId: uuid("entity_id"),
    changes: jsonb("changes").$type<Record<string, unknown>>(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("audit_logs_user_idx").on(t.userId),
    index("audit_logs_entity_idx").on(t.entityType, t.entityId),
    index("audit_logs_created_idx").on(t.createdAt),
  ]
);

// ─── Relations ───────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const clientsRelations = relations(clients, ({ many, one }) => ({
  services: many(services),
  projects: many(projects),
  invoices: many(invoices),
  payments: many(payments),
  tickets: many(tickets),
  activities: many(activities),
  documents: many(documents),
  credentials: many(credentials),
  cullinosTenants: many(cullinosTenants),
  saasSubscriptions: many(saasSubscriptions),
  assignedTo: one(users, { fields: [clients.assignedToId], references: [users.id] }),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  client: one(clients, { fields: [services.clientId], references: [clients.id] }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, { fields: [projects.clientId], references: [clients.id] }),
  tasks: many(tasks),
  milestones: many(milestones),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  client: one(clients, { fields: [invoices.clientId], references: [clients.id] }),
  items: many(invoiceItems),
  payments: many(payments),
}));

export type User = typeof users.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Ticket = typeof tickets.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type ProductPlan = typeof productPlans.$inferSelect;
export type CullinosTenant = typeof cullinosTenants.$inferSelect;
export type SaasSubscription = typeof saasSubscriptions.$inferSelect;
export type UserRole = (typeof userRoleEnum.enumValues)[number];
