/**
 * Seed Rkyves OS with realistic sample data (development only).
 * Run: npm run db:seed
 *
 * For production, use: CONFIRM_PROD_RESET=yes npm run db:prod-reset
 */
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/db/schema";
import { hashPassword } from "../lib/os/auth/password";
import { encrypt } from "../lib/os/encryption";

function loadLocalEnv() {
  for (const file of [".env", ".env.local"]) {
    if (!existsSync(file)) continue;
    try {
      loadEnvFile(file);
    } catch {
      // Ignore missing or unreadable env files.
    }
  }
}

loadLocalEnv();

const SAMPLE_INVOICE_NUMBER = "INV-JER-001";

function printLoginHints() {
  console.log("  OS Login: admin@rkyves.com / admin123");
  console.log("  Portal Login: contact@jerzyfy.in / client123");
  console.log("  Clients: Jerzyfy, Yathartha Foods, QuickBite Cafe");
  console.log("  Team: sales@, pm@, dev@, support@, finance@rkyves.com (same password)");
}

async function seed() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("DATABASE_URL is required. Add it to .env.local or export it in your shell.");
    process.exit(1);
  }
  if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY.length < 32) {
    console.error("ENCRYPTION_KEY (min 32 chars) is required for credential encryption");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql, { schema });

  console.log("Seeding Rkyves OS...");

  // Cullinos product plans
  await db.insert(schema.productPlans).values([
    { name: "Starter", slug: "starter", description: "Single outlet — POS, KDS, Admin, GST", priceMonthly: "2999", priceYearly: "29990", maxOutlets: 1, maxTerminals: 2, modules: ["pos", "kds", "admin", "menu", "orders", "billing", "tax"] },
    { name: "Professional", slug: "professional", description: "Up to 3 outlets — Waiter, QR, inventory, CRM", priceMonthly: "7999", priceYearly: "79990", maxOutlets: 3, maxTerminals: 6, modules: ["waiter", "customer", "inventory", "crm", "loyalty"] },
    { name: "Enterprise", slug: "enterprise", description: "Chains — Management, franchise, hotel, analytics", priceMonthly: "19999", priceYearly: "199990", maxOutlets: 999, maxTerminals: 999, modules: ["management", "franchise", "hotel", "analytics"] },
  ]).onConflictDoNothing({ target: schema.productPlans.slug });

  const passwordHash = await hashPassword("admin123");

  const [admin] = await db
    .insert(schema.users)
    .values({
      email: "admin@rkyves.com",
      name: "Rkyves Admin",
      passwordHash,
      role: "super_admin",
      phone: "+91 9876543210",
    })
    .onConflictDoNothing()
    .returning();

  let userId: string;
  if (admin?.id) {
    userId = admin.id;
  } else {
    const [existing] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, "admin@rkyves.com"))
      .limit(1);
    if (!existing) {
      console.error("Could not create admin user");
      process.exit(1);
    }
    userId = existing.id;
    console.log("Admin already exists, skipping user creation...");
  }

  const [sampleInvoice] = await db
    .select({ id: schema.invoices.id })
    .from(schema.invoices)
    .where(eq(schema.invoices.invoiceNumber, SAMPLE_INVOICE_NUMBER))
    .limit(1);

  if (sampleInvoice) {
    console.log("Sample data already present, skipping demo records...");
    const clientPasswordHash = await hashPassword("client123");
    const [jerzyfy] = await db
      .select()
      .from(schema.clients)
      .where(eq(schema.clients.email, "contact@jerzyfy.in"))
      .limit(1);
    if (jerzyfy) {
      await db
        .insert(schema.users)
        .values({
          email: "contact@jerzyfy.in",
          name: "Jerzy Thomas",
          passwordHash: clientPasswordHash,
          role: "client",
          clientId: jerzyfy.id,
          phone: "+91 9876500001",
        })
        .onConflictDoNothing();
    }
    console.log("✓ Seed complete (already seeded)!");
    printLoginHints();
    return;
  }

  // Team members
  await db.insert(schema.users).values([
    { email: "sales@rkyves.com", name: "Priya Sharma", passwordHash, role: "sales", phone: "+91 9876543211" },
    { email: "pm@rkyves.com", name: "Arjun Mehta", passwordHash, role: "project_manager" },
    { email: "dev@rkyves.com", name: "Rahul Kumar", passwordHash, role: "developer" },
    { email: "support@rkyves.com", name: "Sneha Patel", passwordHash, role: "support" },
    { email: "finance@rkyves.com", name: "Kavita Singh", passwordHash, role: "finance" },
  ]).onConflictDoNothing();

  const team = await db.select().from(schema.users);
  const salesId = team.find((u) => u.role === "sales")?.id ?? userId;
  const pmId = team.find((u) => u.role === "project_manager")?.id ?? userId;
  const devId = team.find((u) => u.role === "developer")?.id ?? userId;
  const supportId = team.find((u) => u.role === "support")?.id ?? userId;

  // Leads
  const [lead1] = await db.insert(schema.leads).values({
    name: "Rajesh Verma",
    company: "FreshMart Grocery",
    email: "rajesh@freshmart.in",
    phone: "+91 9123456780",
    source: "Website",
    stage: "proposal",
    requirement: "E-commerce website with POS integration for 3 stores",
    expectedValue: "250000",
    probability: 60,
    assignedToId: salesId,
    followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  }).returning();

  await db.insert(schema.leads).values([
    { name: "Anita Desai", company: "StyleHub Boutique", email: "anita@stylehub.in", source: "Referral", stage: "requirement", expectedValue: "150000", assignedToId: salesId },
    { name: "Vikram Reddy", company: "TechParts India", email: "vikram@techparts.in", source: "WhatsApp", stage: "contacted", expectedValue: "80000", assignedToId: salesId },
    { name: "Meera Joshi", company: "GreenLeaf Organics", email: "meera@greenleaf.in", source: "Google Ads", stage: "negotiation", expectedValue: "320000", probability: 75, assignedToId: salesId },
  ]);

  // Client: Jerzyfy
  const [jerzyfy] = await db.insert(schema.clients).values({
    companyName: "Jerzyfy",
    contactPerson: "Jerzy Thomas",
    email: "contact@jerzyfy.in",
    phone: "+91 9876500001",
    whatsapp: "+91 9876500001",
    city: "Kochi",
    state: "Kerala",
    country: "India",
    industry: "Retail / Sportswear",
    businessType: "E-commerce + Retail",
    status: "active",
    healthScore: 92,
    website: "https://www.jerzyfy.in/",
    gst: "32AABCU9603R1ZM",
    assignedToId: pmId,
    notes: "Full-stack client — website, ERP, POS integrated",
  }).returning();

  // Client: Yathartha Foods
  const [yathartha] = await db.insert(schema.clients).values({
    companyName: "Yathartha Foods",
    contactPerson: "Dr. Yathartha",
    email: "info@yatharthafoods.in",
    phone: "+91 9876500002",
    whatsapp: "+91 9876500002",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    industry: "Food Production",
    businessType: "Manufacturing",
    status: "active",
    healthScore: 88,
    website: "https://yatharthafoods.in/",
    assignedToId: pmId,
    notes: "Enterprise recipe management and inventory system",
  }).returning();

  // Client: At-risk
  const [atRisk] = await db.insert(schema.clients).values({
    companyName: "QuickBite Cafe",
    contactPerson: "Sanjay Nair",
    email: "sanjay@quickbite.in",
    phone: "+91 9876500003",
    city: "Chennai",
    state: "Tamil Nadu",
    industry: "Food & Beverage",
    status: "at_risk",
    healthScore: 45,
    assignedToId: supportId,
    notes: "Payment overdue, SSL expiring soon",
  }).returning();

  for (const client of [jerzyfy, yathartha, atRisk]) {
    // Services
    const serviceData = client.id === jerzyfy.id ? [
      { name: "E-commerce Website", type: "website" as const, plan: "Premium", price: "85000", billingCycle: "one_time" as const, status: "active" as const },
      { name: "Cloud Hosting", type: "hosting" as const, plan: "Business", price: "12000", billingCycle: "yearly" as const, status: "active" as const, expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) },
      { name: "Rkyves POS", type: "pos" as const, plan: "3 Terminals", price: "45000", billingCycle: "one_time" as const, status: "active" as const },
      { name: "Rkyves ERP", type: "erp" as const, plan: "Standard", price: "65000", billingCycle: "one_time" as const, status: "active" as const },
      { name: "Domain - jerzyfy.in", type: "domain" as const, price: "999", billingCycle: "yearly" as const, status: "active" as const, expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) },
      { name: "Maintenance & Support", type: "maintenance" as const, price: "5000", billingCycle: "monthly" as const, status: "active" as const },
    ] : client.id === yathartha.id ? [
      { name: "Enterprise Web Application", type: "custom_development" as const, plan: "Enterprise", price: "350000", billingCycle: "one_time" as const, status: "active" as const },
      { name: "Cloud Hosting", type: "hosting" as const, price: "24000", billingCycle: "yearly" as const, status: "active" as const, expiryDate: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000) },
      { name: "SEO Package", type: "seo" as const, price: "15000", billingCycle: "monthly" as const, status: "active" as const },
    ] : [
      { name: "Restaurant Website", type: "website" as const, price: "35000", billingCycle: "one_time" as const, status: "active" as const },
      { name: "Hosting", type: "hosting" as const, price: "6000", billingCycle: "yearly" as const, status: "active" as const, expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) },
    ];

    for (const s of serviceData) {
      const [service] = await db.insert(schema.services).values({
        clientId: client.id,
        name: s.name,
        type: s.type,
        plan: "plan" in s ? s.plan : undefined,
        price: s.price,
        billingCycle: s.billingCycle,
        status: s.status,
        startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        expiryDate: "expiryDate" in s ? s.expiryDate : undefined,
        assignedToId: pmId,
      }).returning();

      if (s.expiryDate) {
        await db.insert(schema.renewals).values({
          clientId: client.id,
          serviceId: service.id,
          renewalDate: s.expiryDate,
          amount: s.price,
          status: new Date(s.expiryDate).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000 ? "due_soon" : "upcoming",
        });
      }
    }

    // Project
    const [project] = await db.insert(schema.projects).values({
      clientId: client.id,
      name: client.id === jerzyfy.id ? "Jerzyfy Platform Integration" : client.id === yathartha.id ? "Recipe Management System" : "QuickBite Website Revamp",
      description: "Full project delivery",
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: client.id === atRisk.id ? "on_hold" : "in_progress",
      progress: client.id === jerzyfy.id ? 85 : client.id === yathartha.id ? 70 : 40,
      priority: client.id === atRisk.id ? "high" : "medium",
    }).returning();

    const taskTitles = client.id === jerzyfy.id
      ? ["Requirements", "UI Design", "Development", "Product Migration", "Payment Gateway", "WhatsApp Integration", "SEO", "UAT", "Deployment", "Go Live"]
      : ["Requirements", "Architecture", "Development", "Testing", "Deployment"];

    for (let i = 0; i < taskTitles.length; i++) {
      await db.insert(schema.tasks).values({
        projectId: project.id,
        title: taskTitles[i]!,
        status: i < Math.floor(taskTitles.length * (project.progress / 100)) ? "completed" : i === Math.floor(taskTitles.length * (project.progress / 100)) ? "in_progress" : "todo",
        sortOrder: i,
        assignedToId: devId,
      });
    }

    // Invoices
    const invoiceNumber = `INV-${client.companyName.slice(0, 3).toUpperCase()}-001`;
    await db
      .insert(schema.invoices)
      .values({
        invoiceNumber,
        clientId: client.id,
        status: client.id === atRisk.id ? "overdue" : "paid",
        subtotal: client.id === jerzyfy.id ? "185000" : client.id === yathartha.id ? "350000" : "35000",
        tax: client.id === jerzyfy.id ? "33300" : client.id === yathartha.id ? "63000" : "6300",
        total: client.id === jerzyfy.id ? "218300" : client.id === yathartha.id ? "413000" : "41300",
        amountPaid: client.id === atRisk.id ? "20000" : client.id === jerzyfy.id ? "218300" : "413000",
        dueDate: client.id === atRisk.id ? new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        createdById: userId,
        sentAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      })
      .onConflictDoNothing({ target: schema.invoices.invoiceNumber });

    const [invoice] = await db
      .select()
      .from(schema.invoices)
      .where(eq(schema.invoices.invoiceNumber, invoiceNumber))
      .limit(1);

    if (!invoice) {
      console.error(`Could not create or find invoice ${invoiceNumber}`);
      process.exit(1);
    }

    if (client.id !== atRisk.id) {
      await db.insert(schema.payments).values({
        clientId: client.id,
        invoiceId: invoice.id,
        amount: invoice.total!,
        method: "bank_transfer",
        reference: "TXN-" + Date.now(),
        recordedById: userId,
        paidAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      });
    }

    // Tickets
    const ticketNumber =
      client.id === atRisk.id
        ? "TKT-QB-001"
        : `TKT-${client.companyName.slice(0, 2).toUpperCase()}-001`;

    await db
      .insert(schema.tickets)
      .values(
        client.id === atRisk.id
          ? {
              ticketNumber,
              clientId: client.id,
              subject: "Website loading slowly",
              description: "Homepage takes 8+ seconds to load",
              priority: "high",
              category: "website",
              status: "in_progress",
              assignedToId: supportId,
              createdById: userId,
            }
          : {
              ticketNumber,
              clientId: client.id,
              subject: "Feature request: export reports",
              description: "Need PDF export for monthly reports",
              priority: "medium",
              category: "general",
              status: "resolved",
              assignedToId: supportId,
              resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              createdById: userId,
            }
      )
      .onConflictDoNothing({ target: schema.tickets.ticketNumber });

    // Activities
    await db.insert(schema.activities).values([
      { clientId: client.id, type: "system", title: "Client onboarded", userId },
      { clientId: client.id, type: "project", title: `Project started: ${project.name}`, userId },
      { clientId: client.id, type: "invoice", title: `Invoice ${invoice.invoiceNumber} sent`, userId },
      ...(client.id !== atRisk.id ? [{ clientId: client.id, type: "payment" as const, title: `Payment received — ₹${invoice.total}`, userId }] : []),
      { clientId: client.id, type: "call", title: "Quarterly review call", description: "Discussed upcoming renewals and new features", userId },
    ]);

    // Website infrastructure
    if (client.website) {
      await db.insert(schema.websites).values({
        clientId: client.id,
        name: client.companyName + " Website",
        domain: client.website.replace(/https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
        domainExpiry: client.id === atRisk.id ? new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
        hosting: "Vercel",
        sslExpiry: client.id === atRisk.id ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        deployment: "Vercel Production",
        vercelProject: client.companyName.toLowerCase().replace(/\s/g, "-"),
        gitRepo: `github.com/rkyves/${client.companyName.toLowerCase()}`,
        status: client.id === atRisk.id ? "warning" : "online",
        seoEnabled: true,
        backupEnabled: true,
      });
    }

    // POS for Jerzyfy
    if (client.id === jerzyfy.id) {
      await db.insert(schema.posDeployments).values({
        clientId: client.id,
        version: "2.4.1",
        terminals: 3,
        hardware: "Sunmi V2 Pro x3",
        printers: "Epson TM-T82 x2",
        barcodeScanners: "Honeywell Voyager x2",
        server: "AWS Mumbai",
        installationNotes: "Installed at 3 retail locations in Kochi",
      });
      await db.insert(schema.erpDeployments).values({
        clientId: client.id,
        version: "1.8.0",
        modules: ["Inventory", "Sales", "Purchase", "Accounting", "HR"],
        users: 12,
        deployment: "AWS Mumbai",
        integrations: ["POS", "Payment Gateway", "WhatsApp"],
      });
    }

    // Credentials
    await db.insert(schema.credentials).values({
      clientId: client.id,
      name: "Hosting Panel",
      category: "hosting",
      username: "admin@" + client.companyName.toLowerCase().replace(/\s/g, "") + ".in",
      encryptedPassword: encrypt("SecurePass123!"),
      url: "https://vercel.com/dashboard",
      createdById: userId,
    });

    // Documents
    await db.insert(schema.documents).values([
      { clientId: client.id, name: "Service Agreement", category: "contract", uploadedById: userId },
      { clientId: client.id, name: "Project Requirements", category: "requirement", uploadedById: userId },
    ]);

    // Communications
    await db.insert(schema.communications).values({
      clientId: client.id,
      type: "whatsapp",
      subject: "Project update",
      content: "Hi! Your project is progressing well. We're at " + project.progress + "% completion.",
      direction: "outbound",
      userId: salesId,
    });
  }

  // Notifications
  await db.insert(schema.notifications).values([
    { userId, type: "renewal", title: "Domain renewal due", message: "jerzyfy.in expires in 45 days", link: "/os/renewals" },
    { userId, type: "invoice", title: "Overdue invoice", message: "QuickBite Cafe has an overdue payment", link: "/os/invoices" },
    { userId, type: "ticket", title: "High priority ticket", message: "QuickBite website performance issue", link: "/os/tickets" },
    { userId, type: "lead", title: "New lead", message: "FreshMart Grocery — ₹2.5L opportunity", link: "/os/leads" },
  ]);

  // Audit log
  await db.insert(schema.auditLogs).values({
    userId,
    action: "seed",
    entityType: "system",
    changes: { message: "Database seeded with sample data" },
  });

  // Client portal user for Jerzyfy
  const clientPasswordHash = await hashPassword("client123");
  await db.insert(schema.users).values({
    email: "contact@jerzyfy.in",
    name: "Jerzy Thomas",
    passwordHash: clientPasswordHash,
    role: "client",
    clientId: jerzyfy.id,
    phone: "+91 9876500001",
  }).onConflictDoNothing();

  console.log("✓ Seed complete!");
  printLoginHints();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
