/**
 * Wipe demo/operational data and create a production super admin.
 * Run: npm run db:prod-reset
 *
 * Keeps Cullinos product_plans (catalog). Clears everything else.
 * Prints a one-time password — save it immediately; it is not stored anywhere else.
 */
import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/db/schema";
import { hashPassword } from "../lib/os/auth/password";

const SUPER_ADMIN_EMAIL = "rkyves.com@gmail.com";
const SUPER_ADMIN_NAME = "Rkyves Super Admin";

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

function generateOneTimePassword() {
  return randomBytes(18).toString("base64url");
}

async function prodReset() {
  loadLocalEnv();

  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("DATABASE_URL is required. Add it to .env.local or export it in your shell.");
    process.exit(1);
  }

  const dbUrl = url;
  const isProd =
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_SITE_URL?.includes("rkyves.com");

  if (isProd && process.env.CONFIRM_PROD_RESET !== "yes") {
    console.error(
      "Production reset blocked. Set CONFIRM_PROD_RESET=yes to confirm wiping the database."
    );
    process.exit(1);
  }

  const sqlClient = neon(dbUrl);
  const db = drizzle(sqlClient, { schema });

  console.log("Resetting database for production...");

  await db.execute(sql`
    TRUNCATE TABLE
      credential_access_logs,
      credentials,
      activities,
      communications,
      documents,
      usage_snapshots,
      saas_subscriptions,
      cullinos_tenants,
      pos_deployments,
      erp_deployments,
      websites,
      invoice_items,
      payments,
      renewals,
      tickets,
      tasks,
      milestones,
      project_members,
      quotes,
      projects,
      services,
      invoices,
      leads,
      clients,
      notifications,
      sessions,
      audit_logs,
      users
    RESTART IDENTITY CASCADE
  `);

  console.log("  Cleared all operational data and credentials.");

  await db.insert(schema.productPlans).values([
    {
      name: "Starter",
      slug: "starter",
      description: "Single outlet — POS, KDS, Admin, GST",
      priceMonthly: "2999",
      priceYearly: "29990",
      maxOutlets: 1,
      maxTerminals: 2,
      modules: ["pos", "kds", "admin", "menu", "orders", "billing", "tax"],
    },
    {
      name: "Professional",
      slug: "professional",
      description: "Up to 3 outlets — Waiter, QR, inventory, CRM",
      priceMonthly: "7999",
      priceYearly: "79990",
      maxOutlets: 3,
      maxTerminals: 6,
      modules: ["waiter", "customer", "inventory", "crm", "loyalty"],
    },
    {
      name: "Enterprise",
      slug: "enterprise",
      description: "Chains — Management, franchise, hotel, analytics",
      priceMonthly: "19999",
      priceYearly: "199990",
      maxOutlets: 999,
      maxTerminals: 999,
      modules: ["management", "franchise", "hotel", "analytics"],
    },
  ]).onConflictDoNothing({ target: schema.productPlans.slug });

  const oneTimePassword = generateOneTimePassword();
  const passwordHash = await hashPassword(oneTimePassword);

  await db.insert(schema.users).values({
    email: SUPER_ADMIN_EMAIL,
    name: SUPER_ADMIN_NAME,
    passwordHash,
    role: "super_admin",
  });

  console.log("");
  console.log("✓ Production reset complete.");
  console.log("");
  console.log("  Super Admin login:");
  console.log(`    Email:    ${SUPER_ADMIN_EMAIL}`);
  console.log(`    Password: ${oneTimePassword}`);
  console.log("");
  console.log("  ⚠ Save this password now. It will not be shown again.");
  console.log("  Change it after your first login.");
}

prodReset().catch((err) => {
  console.error("Production reset failed:", err);
  process.exit(1);
});
