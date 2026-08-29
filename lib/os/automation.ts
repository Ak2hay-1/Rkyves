/**
 * Rkyves OS Automation Engine
 * Event-driven architecture for client lifecycle automation.
 * Designed to be extended with additional rules.
 */

import { eq, inArray } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { hashPassword } from "@/lib/os/auth/password";
import { notifyPaymentReceived, notifyInvoiceOverdue, notifyRenewalReminder, notifyWelcome, notifyTicketUpdate } from "@/lib/os/notifications";

export type AutomationEvent =
  | "client.created"
  | "client.updated"
  | "lead.won"
  | "payment.received"
  | "invoice.overdue"
  | "renewal.upcoming"
  | "ticket.created"
  | "ticket.resolved";

export type AutomationContext = {
  userId?: string;
  clientId?: string;
  leadId?: string;
  invoiceId?: string;
  paymentId?: string;
  ticketId?: string;
  metadata?: Record<string, unknown>;
};

export async function emitAutomationEvent(
  event: AutomationEvent,
  context: AutomationContext
) {
  if (!process.env.DATABASE_URL) return;

  const handlers: Record<AutomationEvent, (ctx: AutomationContext) => Promise<void>> = {
    "client.created": handleClientCreated,
    "client.updated": handleClientUpdated,
    "lead.won": handleLeadWon,
    "payment.received": handlePaymentReceived,
    "invoice.overdue": handleInvoiceOverdue,
    "renewal.upcoming": handleRenewalUpcoming,
    "ticket.created": handleTicketCreated,
    "ticket.resolved": handleTicketResolved,
  };

  const handler = handlers[event];
  if (handler) {
    try {
      await handler(context);
    } catch (error) {
      console.error(`Automation handler failed for ${event}:`, error);
    }
  }
}

async function handleClientCreated(ctx: AutomationContext) {
  if (!ctx.clientId || !ctx.userId) return;
  const db = getDb();

  // Log activity
  const [client] = await db
    .select()
    .from(schema.clients)
    .where(eq(schema.clients.id, ctx.clientId))
    .limit(1);

  if (!client) return;

  await db.insert(schema.activities).values({
    clientId: ctx.clientId,
    type: "system",
    title: "Client onboarded",
    description: `${client.companyName} was added to Rkyves OS`,
    userId: ctx.userId,
  });

  // Notify team
  const admins = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.role, "super_admin"));

  for (const admin of admins) {
    await db.insert(schema.notifications).values({
      userId: admin.id,
      type: "client",
      title: "New client added",
      message: `${client.companyName} has been onboarded`,
      link: `/os/clients/${ctx.clientId}`,
    });
  }

  // Send welcome email + WhatsApp
  await notifyWelcome(ctx.clientId);

  // Create default project if requested via metadata
  if (ctx.metadata?.createProject) {
    const [project] = await db
      .insert(schema.projects)
      .values({
        clientId: ctx.clientId,
        name: `${client.companyName} — Onboarding`,
        description: "Default onboarding project",
        status: "planning",
        progress: 0,
        priority: "medium",
        startDate: new Date(),
      })
      .returning();

    const defaultTasks = [
      "Requirements gathering",
      "Kickoff meeting",
      "Service setup",
      "Documentation",
      "Go live",
    ];

    for (let i = 0; i < defaultTasks.length; i++) {
      await db.insert(schema.tasks).values({
        projectId: project.id,
        title: defaultTasks[i]!,
        status: "todo",
        sortOrder: i,
      });
    }

    await db.insert(schema.activities).values({
      clientId: ctx.clientId,
      type: "project",
      title: `Project created: ${project.name}`,
      userId: ctx.userId,
      metadata: { projectId: project.id },
    });
  }
}

async function handleClientUpdated(_ctx: AutomationContext) {
  // Placeholder for future sync logic
}

async function handleLeadWon(ctx: AutomationContext) {
  // Handled by convertLeadToClient — this is for post-conversion hooks
  if (!ctx.clientId || !ctx.userId) return;
  await handleClientCreated({
    ...ctx,
    metadata: { ...ctx.metadata, createProject: true },
  });
}

async function handlePaymentReceived(ctx: AutomationContext) {
  if (!ctx.paymentId || !ctx.clientId) return;
  const db = getDb();

  const [payment] = await db
    .select()
    .from(schema.payments)
    .where(eq(schema.payments.id, ctx.paymentId))
    .limit(1);

  if (!payment) return;

  // Update invoice if linked
  if (payment.invoiceId) {
    const [invoice] = await db
      .select()
      .from(schema.invoices)
      .where(eq(schema.invoices.id, payment.invoiceId))
      .limit(1);

    if (invoice) {
      const newPaid = Number(invoice.amountPaid) + Number(payment.amount);
      const total = Number(invoice.total);
      let status: typeof invoice.status = invoice.status;

      if (newPaid >= total) status = "paid";
      else if (newPaid > 0) status = "partially_paid";

      await db
        .update(schema.invoices)
        .set({ amountPaid: String(newPaid), status, updatedAt: new Date() })
        .where(eq(schema.invoices.id, invoice.id));
    }
  }

  await db.insert(schema.activities).values({
    clientId: ctx.clientId,
    type: "payment",
    title: `Payment received — ₹${payment.amount}`,
    userId: ctx.userId,
    metadata: { paymentId: ctx.paymentId },
  });

  // Notify finance team
  const financeUsers = await db.select().from(schema.users);
  for (const user of financeUsers.filter((u) => ["finance", "admin", "super_admin"].includes(u.role))) {
    await db.insert(schema.notifications).values({
      userId: user.id,
      type: "payment",
      title: "Payment received",
      message: `₹${payment.amount} payment recorded`,
      link: `/os/payments`,
    });
  }

  const [invoice] = payment.invoiceId
    ? await db.select().from(schema.invoices).where(eq(schema.invoices.id, payment.invoiceId)).limit(1)
    : [null];

  await notifyPaymentReceived(ctx.clientId, Number(payment.amount), invoice?.invoiceNumber);
}

async function handleInvoiceOverdue(ctx: AutomationContext) {
  if (!ctx.invoiceId || !ctx.clientId) return;
  const db = getDb();

  const [invoice] = await db
    .select()
    .from(schema.invoices)
    .where(eq(schema.invoices.id, ctx.invoiceId))
    .limit(1);

  if (!invoice) return;

  await db
    .update(schema.invoices)
    .set({ status: "overdue", updatedAt: new Date() })
    .where(eq(schema.invoices.id, ctx.invoiceId));

  await db.insert(schema.activities).values({
    clientId: ctx.clientId,
    type: "invoice",
    title: `Invoice ${invoice.invoiceNumber} is overdue`,
    metadata: { invoiceId: ctx.invoiceId },
  });

  const admins = await db.select().from(schema.users);
  for (const user of admins.filter((u) => ["finance", "admin", "super_admin"].includes(u.role))) {
    await db.insert(schema.notifications).values({
      userId: user.id,
      type: "invoice",
      title: "Overdue invoice",
      message: `${invoice.invoiceNumber} is overdue`,
      link: `/os/invoices`,
    });
  }

  const daysOverdue = invoice.dueDate
    ? Math.ceil((Date.now() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  await notifyInvoiceOverdue(ctx.clientId, invoice.invoiceNumber, Number(invoice.total), Math.max(daysOverdue, 1));
}

async function handleRenewalUpcoming(ctx: AutomationContext) {
  if (!ctx.clientId) return;
  const db = getDb();
  const daysLeft = (ctx.metadata?.days as number) || 30;

  const admins = await db.select().from(schema.users);
  for (const user of admins.filter((u) => ["admin", "super_admin", "sales"].includes(u.role))) {
    await db.insert(schema.notifications).values({
      userId: user.id,
      type: "renewal",
      title: "Renewal reminder",
      message: ctx.metadata?.message as string || "A service renewal is coming up",
      link: "/os/renewals",
    });
  }

  // Notify client via email + WhatsApp
  const serviceId = ctx.metadata?.serviceId as string | undefined;
  if (serviceId) {
    const [service] = await db.select().from(schema.services).where(eq(schema.services.id, serviceId)).limit(1);
    if (service?.expiryDate) {
      await notifyRenewalReminder(
        ctx.clientId,
        service.name,
        new Date(service.expiryDate),
        Number(service.price),
        daysLeft
      );
    }
  }
}

async function handleTicketCreated(ctx: AutomationContext) {
  if (!ctx.ticketId || !ctx.clientId) return;
  const db = getDb();

  const [ticket] = await db
    .select()
    .from(schema.tickets)
    .where(eq(schema.tickets.id, ctx.ticketId))
    .limit(1);

  if (!ticket) return;

  await db.insert(schema.activities).values({
    clientId: ctx.clientId,
    type: "ticket",
    title: `Ticket opened: ${ticket.subject}`,
    metadata: { ticketId: ctx.ticketId },
  });

  if (ticket.priority === "high" || ticket.priority === "urgent") {
    const supportUsers = await db.select().from(schema.users);
    for (const user of supportUsers.filter((u) => ["support", "admin", "super_admin"].includes(u.role))) {
      await db.insert(schema.notifications).values({
        userId: user.id,
        type: "ticket",
        title: "High priority ticket",
        message: ticket.subject,
        link: `/os/tickets`,
      });
    }
  }
}

async function handleTicketResolved(ctx: AutomationContext) {
  if (!ctx.ticketId || !ctx.clientId) return;
  const db = getDb();

  const [ticket] = await db
    .select()
    .from(schema.tickets)
    .where(eq(schema.tickets.id, ctx.ticketId))
    .limit(1);

  await db.insert(schema.activities).values({
    clientId: ctx.clientId,
    type: "ticket",
    title: "Ticket resolved",
    userId: ctx.userId,
    metadata: { ticketId: ctx.ticketId },
  });

  if (ticket) {
    await notifyTicketUpdate(ctx.clientId, ticket.ticketNumber, ticket.subject, "resolved");
  }
}

/** Convert a won lead into a full client with optional portal access */
export async function convertLeadToClient(
  leadId: string,
  userId: string,
  options?: { createPortalAccess?: boolean; createProject?: boolean }
) {
  const db = getDb();

  const [lead] = await db
    .select()
    .from(schema.leads)
    .where(eq(schema.leads.id, leadId))
    .limit(1);

  if (!lead) throw new Error("Lead not found");
  if (lead.stage === "won" && lead.convertedClientId) {
    throw new Error("Lead already converted");
  }

  const [client] = await db
    .insert(schema.clients)
    .values({
      companyName: lead.company || lead.name,
      contactPerson: lead.name,
      email: lead.email || `${lead.name.toLowerCase().replace(/\s/g, ".")}@placeholder.local`,
      phone: lead.phone,
      whatsapp: lead.whatsapp,
      status: "active",
      industry: lead.source ? `Via ${lead.source}` : undefined,
      assignedToId: lead.assignedToId || userId,
      notes: lead.requirement || lead.notes,
      leadId: lead.id,
    })
    .returning();

  await db
    .update(schema.leads)
    .set({
      stage: "won",
      convertedClientId: client.id,
      updatedAt: new Date(),
    })
    .where(eq(schema.leads.id, leadId));

  await db.insert(schema.activities).values({
    clientId: client.id,
    type: "decision",
    title: `Lead converted to client`,
    description: `${lead.name} is now a Rkyves client`,
    userId,
    metadata: { leadId },
  });

  // Create portal user if requested
  if (options?.createPortalAccess && lead.email) {
    const passwordHash = await hashPassword(crypto.randomUUID().slice(0, 12));
    await db.insert(schema.users).values({
      email: lead.email,
      name: lead.name,
      passwordHash,
      role: "client",
      clientId: client.id,
    }).onConflictDoNothing();
  }

  await emitAutomationEvent("lead.won", {
    userId,
    clientId: client.id,
    leadId,
    metadata: { createProject: options?.createProject ?? true },
  });

  return client;
}

/** Check and mark overdue invoices — run via cron or manual trigger */
export async function processOverdueInvoices() {
  const db = getDb();
  const now = new Date();

  const overdue = await db
    .select()
    .from(schema.invoices)
    .where(eq(schema.invoices.status, "sent"));

  for (const invoice of overdue) {
    if (invoice.dueDate && new Date(invoice.dueDate) < now) {
      await emitAutomationEvent("invoice.overdue", {
        clientId: invoice.clientId,
        invoiceId: invoice.id,
      });
    }
  }
}

/** Check renewals and send reminders */
export async function processRenewalReminders() {
  const db = getDb();
  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const in15 = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
  const in7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const renewals = await db
    .select()
    .from(schema.renewals)
    .where(inArray(schema.renewals.status, ["upcoming", "due_soon"]));

  for (const renewal of renewals) {
    const date = new Date(renewal.renewalDate);
    const updates: Partial<typeof renewal> = {};

    if (date <= in30 && !renewal.reminderSent30) {
      updates.reminderSent30 = true;
      await emitAutomationEvent("renewal.upcoming", {
        clientId: renewal.clientId,
        metadata: { message: "Renewal in 30 days", days: 30, serviceId: renewal.serviceId },
      });
    }
    if (date <= in15 && !renewal.reminderSent15) {
      updates.reminderSent15 = true;
      await emitAutomationEvent("renewal.upcoming", {
        clientId: renewal.clientId,
        metadata: { message: "Renewal in 15 days", days: 15, serviceId: renewal.serviceId },
      });
    }
    if (date <= in7 && !renewal.reminderSent7) {
      updates.reminderSent7 = true;
      updates.status = "due_soon";
      await emitAutomationEvent("renewal.upcoming", {
        clientId: renewal.clientId,
        metadata: { message: "Renewal in 7 days", days: 7, serviceId: renewal.serviceId },
      });
    }
    if (date <= now && !renewal.reminderSent0) {
      updates.reminderSent0 = true;
      updates.status = "overdue";
      await emitAutomationEvent("renewal.upcoming", {
        clientId: renewal.clientId,
        metadata: { message: "Renewal due today", days: 0, serviceId: renewal.serviceId },
      });
    }
    if (date < now && renewal.status !== "expired") {
      updates.status = "expired";
      if (renewal.serviceId) {
        await db.update(schema.services).set({ status: "expired", updatedAt: new Date() }).where(eq(schema.services.id, renewal.serviceId));
      }
    }

    if (Object.keys(updates).length > 0) {
      await db
        .update(schema.renewals)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(schema.renewals.id, renewal.id));
    }
  }

  // Suspend Cullinos tenants after SaaS grace period
  const pastDueSubs = await db
    .select()
    .from(schema.saasSubscriptions)
    .where(eq(schema.saasSubscriptions.status, "past_due"));

  for (const sub of pastDueSubs) {
    if (sub.graceUntil && new Date(sub.graceUntil) < now && sub.tenantId) {
      const { updateCullinosEntitlements } = await import("@/lib/os/cullinos");
      const [tenant] = await db.select().from(schema.cullinosTenants).where(eq(schema.cullinosTenants.id, sub.tenantId)).limit(1);
      if (tenant?.cullinosOrgId) {
        await updateCullinosEntitlements(tenant.cullinosOrgId, { status: "suspended" });
        await db.update(schema.cullinosTenants).set({ status: "suspended" }).where(eq(schema.cullinosTenants.id, tenant.id));
        await db.update(schema.saasSubscriptions).set({ status: "suspended" }).where(eq(schema.saasSubscriptions.id, sub.id));
      }
    }
  }
}
