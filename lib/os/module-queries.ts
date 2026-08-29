import { eq, desc, sql } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";

export async function getLeads(stage?: string) {
  const db = getDb();
  if (stage && stage !== "all") {
    return db.select().from(schema.leads).where(eq(schema.leads.stage, stage as typeof schema.leads.stage.enumValues[number])).orderBy(desc(schema.leads.updatedAt));
  }
  return db.select().from(schema.leads).orderBy(desc(schema.leads.updatedAt));
}

export async function getServices() {
  const db = getDb();
  return db
    .select({
      service: schema.services,
      companyName: schema.clients.companyName,
    })
    .from(schema.services)
    .leftJoin(schema.clients, eq(schema.services.clientId, schema.clients.id))
    .orderBy(desc(schema.services.updatedAt));
}

export async function getProjects() {
  const db = getDb();
  return db
    .select({
      project: schema.projects,
      companyName: schema.clients.companyName,
    })
    .from(schema.projects)
    .leftJoin(schema.clients, eq(schema.projects.clientId, schema.clients.id))
    .orderBy(desc(schema.projects.updatedAt));
}

export async function getTasks() {
  const db = getDb();
  return db
    .select({
      task: schema.tasks,
      projectName: schema.projects.name,
      companyName: schema.clients.companyName,
    })
    .from(schema.tasks)
    .leftJoin(schema.projects, eq(schema.tasks.projectId, schema.projects.id))
    .leftJoin(schema.clients, eq(schema.projects.clientId, schema.clients.id))
    .where(sql`${schema.tasks.status} != 'completed'`)
    .orderBy(schema.tasks.dueDate);
}

export async function getInvoices(status?: string) {
  const db = getDb();
  const dbInst = getDb();
  let query = dbInst
    .select({
      invoice: schema.invoices,
      companyName: schema.clients.companyName,
    })
    .from(schema.invoices)
    .leftJoin(schema.clients, eq(schema.invoices.clientId, schema.clients.id));

  if (status === "outstanding") {
    return db
      .select({
        invoice: schema.invoices,
        companyName: schema.clients.companyName,
      })
      .from(schema.invoices)
      .leftJoin(schema.clients, eq(schema.invoices.clientId, schema.clients.id))
      .where(sql`${schema.invoices.status} in ('sent', 'partially_paid', 'overdue')`)
      .orderBy(desc(schema.invoices.dueDate));
  }

  if (status && status !== "all") {
    return db
      .select({
        invoice: schema.invoices,
        companyName: schema.clients.companyName,
      })
      .from(schema.invoices)
      .leftJoin(schema.clients, eq(schema.invoices.clientId, schema.clients.id))
      .where(eq(schema.invoices.status, status as typeof schema.invoices.status.enumValues[number]))
      .orderBy(desc(schema.invoices.createdAt));
  }

  return db
    .select({
      invoice: schema.invoices,
      companyName: schema.clients.companyName,
    })
    .from(schema.invoices)
    .leftJoin(schema.clients, eq(schema.invoices.clientId, schema.clients.id))
    .orderBy(desc(schema.invoices.createdAt));
}

export async function getPayments() {
  const db = getDb();
  return db
    .select({
      payment: schema.payments,
      companyName: schema.clients.companyName,
      invoiceNumber: schema.invoices.invoiceNumber,
    })
    .from(schema.payments)
    .leftJoin(schema.clients, eq(schema.payments.clientId, schema.clients.id))
    .leftJoin(schema.invoices, eq(schema.payments.invoiceId, schema.invoices.id))
    .orderBy(desc(schema.payments.paidAt));
}

export async function getTickets(status?: string) {
  const db = getDb();
  if (status === "open") {
    return db
      .select({
        ticket: schema.tickets,
        companyName: schema.clients.companyName,
      })
      .from(schema.tickets)
      .leftJoin(schema.clients, eq(schema.tickets.clientId, schema.clients.id))
      .where(sql`${schema.tickets.status} not in ('resolved', 'closed')`)
      .orderBy(desc(schema.tickets.createdAt));
  }
  return db
    .select({
      ticket: schema.tickets,
      companyName: schema.clients.companyName,
    })
    .from(schema.tickets)
    .leftJoin(schema.clients, eq(schema.tickets.clientId, schema.clients.id))
    .orderBy(desc(schema.tickets.createdAt));
}

export async function getRenewals() {
  const db = getDb();
  return db
    .select({
      renewal: schema.renewals,
      companyName: schema.clients.companyName,
      serviceName: schema.services.name,
    })
    .from(schema.renewals)
    .leftJoin(schema.clients, eq(schema.renewals.clientId, schema.clients.id))
    .leftJoin(schema.services, eq(schema.renewals.serviceId, schema.services.id))
    .orderBy(schema.renewals.renewalDate);
}

export async function getWebsites() {
  const db = getDb();
  return db
    .select({
      website: schema.websites,
      companyName: schema.clients.companyName,
    })
    .from(schema.websites)
    .leftJoin(schema.clients, eq(schema.websites.clientId, schema.clients.id));
}

export async function getTeam() {
  const db = getDb();
  return db.select().from(schema.users).where(sql`${schema.users.role} != 'client'`).orderBy(schema.users.name);
}

export async function getAuditLogs() {
  const db = getDb();
  return db
    .select({
      log: schema.auditLogs,
      userName: schema.users.name,
    })
    .from(schema.auditLogs)
    .leftJoin(schema.users, eq(schema.auditLogs.userId, schema.users.id))
    .orderBy(desc(schema.auditLogs.createdAt))
    .limit(100);
}

export async function getAnalytics() {
  const db = getDb();
  const stats = await getDashboardStats();
  return stats;
}

async function getDashboardStats() {
  const { getDashboardStats: gds } = await import("@/lib/os/queries");
  return gds();
}
