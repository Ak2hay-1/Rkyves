import { eq, and, sql, desc, gte, lte, inArray, or, ilike, count } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";

export async function getDashboardStats() {
  const db = getDb();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [
    clientStats,
    projectStats,
    taskStats,
    ticketStats,
    paymentStats,
    renewalStats,
    leadStats,
  ] = await Promise.all([
    db
      .select({
        total: count(),
        active: sql<number>`count(*) filter (where ${schema.clients.status} = 'active')`,
        newThisMonth: sql<number>`count(*) filter (where ${schema.clients.createdAt} >= ${monthStart})`,
        atRisk: sql<number>`count(*) filter (where ${schema.clients.status} = 'at_risk')`,
      })
      .from(schema.clients),
    db
      .select({
        active: sql<number>`count(*) filter (where ${schema.projects.status} in ('planning', 'in_progress', 'review'))`,
      })
      .from(schema.projects),
    db
      .select({
        pending: sql<number>`count(*) filter (where ${schema.tasks.status} in ('todo', 'in_progress', 'review'))`,
      })
      .from(schema.tasks),
    db
      .select({
        open: sql<number>`count(*) filter (where ${schema.tickets.status} not in ('resolved', 'closed'))`,
        highPriority: sql<number>`count(*) filter (where ${schema.tickets.priority} in ('high', 'urgent') and ${schema.tickets.status} not in ('resolved', 'closed'))`,
      })
      .from(schema.tickets),
    db
      .select({
        outstanding: sql<number>`coalesce(sum((${schema.invoices.total})::numeric - (${schema.invoices.amountPaid})::numeric), 0)`,
        overdue: sql<number>`coalesce(sum((${schema.invoices.total})::numeric - (${schema.invoices.amountPaid})::numeric) filter (where ${schema.invoices.status} = 'overdue'), 0)`,
        monthlyRevenue: sql<number>`coalesce(sum((${schema.payments.amount})::numeric) filter (where ${schema.payments.paidAt} >= ${monthStart}), 0)`,
      })
      .from(schema.invoices)
      .leftJoin(schema.payments, eq(schema.payments.invoiceId, schema.invoices.id)),
    db
      .select({
        upcoming: sql<number>`count(*) filter (where ${schema.renewals.renewalDate} <= ${in30Days} and ${schema.renewals.status} = 'upcoming')`,
        expired: sql<number>`count(*) filter (where ${schema.renewals.status} = 'expired')`,
      })
      .from(schema.renewals),
    db
      .select({
        total: sql<number>`count(*) filter (where ${schema.leads.stage} not in ('won', 'lost'))`,
        pipelineValue: sql<number>`coalesce(sum((${schema.leads.expectedValue})::numeric) filter (where ${schema.leads.stage} not in ('won', 'lost')), 0)`,
      })
      .from(schema.leads),
  ]);

  const mrrResult = await db
    .select({
      mrr: sql<number>`coalesce(sum(case when ${schema.services.billingCycle} = 'monthly' then (${schema.services.price})::numeric when ${schema.services.billingCycle} = 'yearly' then (${schema.services.price})::numeric / 12 when ${schema.services.billingCycle} = 'quarterly' then (${schema.services.price})::numeric / 3 else 0 end), 0)`,
    })
    .from(schema.services)
    .where(eq(schema.services.status, "active"));

  return {
    totalClients: Number(clientStats[0]?.total ?? 0),
    activeClients: Number(clientStats[0]?.active ?? 0),
    newClients: Number(clientStats[0]?.newThisMonth ?? 0),
    atRiskClients: Number(clientStats[0]?.atRisk ?? 0),
    activeProjects: Number(projectStats[0]?.active ?? 0),
    pendingTasks: Number(taskStats[0]?.pending ?? 0),
    openTickets: Number(ticketStats[0]?.open ?? 0),
    highPriorityTickets: Number(ticketStats[0]?.highPriority ?? 0),
    outstandingPayments: Number(paymentStats[0]?.outstanding ?? 0),
    overduePayments: Number(paymentStats[0]?.overdue ?? 0),
    monthlyRevenue: Number(paymentStats[0]?.monthlyRevenue ?? 0),
    mrr: Number(mrrResult[0]?.mrr ?? 0),
    upcomingRenewals: Number(renewalStats[0]?.upcoming ?? 0),
    expiredServices: Number(renewalStats[0]?.expired ?? 0),
    activeLeads: Number(leadStats[0]?.total ?? 0),
    pipelineValue: Number(leadStats[0]?.pipelineValue ?? 0),
  };
}

export async function getDashboardAlerts() {
  const db = getDb();
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [overdueInvoices, upcomingRenewals, highTickets, expiringDomains] =
    await Promise.all([
      db
        .select({
          id: schema.invoices.id,
          invoiceNumber: schema.invoices.invoiceNumber,
          clientId: schema.invoices.clientId,
          total: schema.invoices.total,
          dueDate: schema.invoices.dueDate,
        })
        .from(schema.invoices)
        .where(eq(schema.invoices.status, "overdue"))
        .orderBy(desc(schema.invoices.dueDate))
        .limit(5),
      db
        .select({
          id: schema.renewals.id,
          renewalDate: schema.renewals.renewalDate,
          amount: schema.renewals.amount,
          clientId: schema.renewals.clientId,
          serviceId: schema.renewals.serviceId,
        })
        .from(schema.renewals)
        .where(
          and(
            lte(schema.renewals.renewalDate, in30Days),
            inArray(schema.renewals.status, ["upcoming", "due_soon"])
          )
        )
        .orderBy(schema.renewals.renewalDate)
        .limit(5),
      db
        .select({
          id: schema.tickets.id,
          ticketNumber: schema.tickets.ticketNumber,
          subject: schema.tickets.subject,
          priority: schema.tickets.priority,
          clientId: schema.tickets.clientId,
        })
        .from(schema.tickets)
        .where(
          and(
            inArray(schema.tickets.priority, ["high", "urgent"]),
            sql`${schema.tickets.status} not in ('resolved', 'closed')`
          )
        )
        .limit(5),
      db
        .select({
          id: schema.websites.id,
          name: schema.websites.name,
          domain: schema.websites.domain,
          domainExpiry: schema.websites.domainExpiry,
          sslExpiry: schema.websites.sslExpiry,
          clientId: schema.websites.clientId,
        })
        .from(schema.websites)
        .where(
          or(
            lte(schema.websites.domainExpiry, in30Days),
            lte(schema.websites.sslExpiry, in7Days)
          )
        )
        .limit(5),
    ]);

  return { overdueInvoices, upcomingRenewals, highTickets, expiringDomains };
}

export async function getRecentActivities(limit = 10) {
  const db = getDb();
  return db
    .select({
      id: schema.activities.id,
      type: schema.activities.type,
      title: schema.activities.title,
      description: schema.activities.description,
      clientId: schema.activities.clientId,
      createdAt: schema.activities.createdAt,
      companyName: schema.clients.companyName,
    })
    .from(schema.activities)
    .leftJoin(schema.clients, eq(schema.activities.clientId, schema.clients.id))
    .orderBy(desc(schema.activities.createdAt))
    .limit(limit);
}

export async function getRecentPayments(limit = 5) {
  const db = getDb();
  return db
    .select({
      id: schema.payments.id,
      amount: schema.payments.amount,
      method: schema.payments.method,
      paidAt: schema.payments.paidAt,
      companyName: schema.clients.companyName,
      clientId: schema.payments.clientId,
    })
    .from(schema.payments)
    .leftJoin(schema.clients, eq(schema.payments.clientId, schema.clients.id))
    .orderBy(desc(schema.payments.paidAt))
    .limit(limit);
}

export async function getRecentLeads(limit = 5) {
  const db = getDb();
  return db
    .select()
    .from(schema.leads)
    .where(sql`${schema.leads.stage} not in ('won', 'lost')`)
    .orderBy(desc(schema.leads.createdAt))
    .limit(limit);
}

export async function getClients(search?: string, status?: string) {
  const db = getDb();
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        ilike(schema.clients.companyName, `%${search}%`),
        ilike(schema.clients.contactPerson, `%${search}%`),
        ilike(schema.clients.email, `%${search}%`),
        ilike(schema.clients.phone, `%${search}%`)
      )
    );
  }
  if (status && status !== "all") {
    conditions.push(eq(schema.clients.status, status as typeof schema.clients.status.enumValues[number]));
  }

  return db
    .select()
    .from(schema.clients)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(schema.clients.updatedAt));
}

export async function getClient360(clientId: string) {
  const db = getDb();

  const [client] = await db
    .select()
    .from(schema.clients)
    .where(eq(schema.clients.id, clientId))
    .limit(1);

  if (!client) return null;

  const [
    services,
    projects,
    invoices,
    payments,
    tickets,
    activities,
    documents,
    renewals,
    websites,
    communications,
    cullinosTenants,
    saasSubscriptions,
  ] = await Promise.all([
    db.select().from(schema.services).where(eq(schema.services.clientId, clientId)),
    db.select().from(schema.projects).where(eq(schema.projects.clientId, clientId)),
    db
      .select()
      .from(schema.invoices)
      .where(eq(schema.invoices.clientId, clientId))
      .orderBy(desc(schema.invoices.createdAt)),
    db
      .select()
      .from(schema.payments)
      .where(eq(schema.payments.clientId, clientId))
      .orderBy(desc(schema.payments.paidAt)),
    db
      .select()
      .from(schema.tickets)
      .where(eq(schema.tickets.clientId, clientId))
      .orderBy(desc(schema.tickets.createdAt)),
    db
      .select()
      .from(schema.activities)
      .where(eq(schema.activities.clientId, clientId))
      .orderBy(desc(schema.activities.createdAt))
      .limit(50),
    db.select().from(schema.documents).where(eq(schema.documents.clientId, clientId)),
    db
      .select({
        renewal: schema.renewals,
        serviceName: schema.services.name,
      })
      .from(schema.renewals)
      .leftJoin(schema.services, eq(schema.renewals.serviceId, schema.services.id))
      .where(eq(schema.renewals.clientId, clientId))
      .orderBy(schema.renewals.renewalDate),
    db.select().from(schema.websites).where(eq(schema.websites.clientId, clientId)),
    db
      .select()
      .from(schema.communications)
      .where(eq(schema.communications.clientId, clientId))
      .orderBy(desc(schema.communications.createdAt))
      .limit(20),
    db.select().from(schema.cullinosTenants).where(eq(schema.cullinosTenants.clientId, clientId)),
    db.select().from(schema.saasSubscriptions).where(eq(schema.saasSubscriptions.clientId, clientId)),
  ]);

  const totalBilled = invoices.reduce((s, i) => s + Number(i.total), 0);
  const totalPaid = payments.reduce((s, p) => s + Number(p.amount), 0);
  const outstanding = invoices.reduce(
    (s, i) => s + (Number(i.total) - Number(i.amountPaid)),
    0
  );
  const overdue = invoices
    .filter((i) => i.status === "overdue")
    .reduce((s, i) => s + (Number(i.total) - Number(i.amountPaid)), 0);

  const openTickets = tickets.filter((t) => !["resolved", "closed"].includes(t.status));
  const activeProjects = projects.filter((p) =>
    ["planning", "in_progress", "review"].includes(p.status)
  );

  return {
    client,
    services,
    projects,
    invoices,
    payments,
    tickets,
    activities,
    documents,
    renewals,
    websites,
    communications,
    cullinosTenants,
    saasSubscriptions,
    financials: {
      totalBilled,
      totalPaid,
      outstanding,
      overdue,
      lifetimeValue: totalPaid,
    },
    summary: {
      openTickets: openTickets.length,
      activeProjects: activeProjects.length,
      activeServices: services.filter((s) => s.status === "active").length,
      upcomingRenewals: renewals.filter(
        (r) => r.renewal.status === "upcoming" || r.renewal.status === "due_soon"
      ).length,
    },
  };
}

export async function globalSearch(query: string) {
  const db = getDb();
  const q = `%${query}%`;

  const [clientResults, invoiceResults, projectResults, ticketResults] =
    await Promise.all([
      db
        .select({
          id: schema.clients.id,
          title: schema.clients.companyName,
          subtitle: schema.clients.email,
          type: sql<string>`'client'`,
        })
        .from(schema.clients)
        .where(
          or(
            ilike(schema.clients.companyName, q),
            ilike(schema.clients.email, q),
            ilike(schema.clients.phone, q)
          )
        )
        .limit(5),
      db
        .select({
          id: schema.invoices.id,
          title: schema.invoices.invoiceNumber,
          subtitle: schema.invoices.status,
          type: sql<string>`'invoice'`,
        })
        .from(schema.invoices)
        .where(ilike(schema.invoices.invoiceNumber, q))
        .limit(5),
      db
        .select({
          id: schema.projects.id,
          title: schema.projects.name,
          subtitle: schema.projects.status,
          type: sql<string>`'project'`,
        })
        .from(schema.projects)
        .where(ilike(schema.projects.name, q))
        .limit(5),
      db
        .select({
          id: schema.tickets.id,
          title: schema.tickets.ticketNumber,
          subtitle: schema.tickets.subject,
          type: sql<string>`'ticket'`,
        })
        .from(schema.tickets)
        .where(
          or(
            ilike(schema.tickets.ticketNumber, q),
            ilike(schema.tickets.subject, q)
          )
        )
        .limit(5),
    ]);

  return [...clientResults, ...invoiceResults, ...projectResults, ...ticketResults];
}
