/**
 * Remove [TEST]-prefixed records created by Playwright functional tests.
 * Run: npm run test:cleanup
 */
import { existsSync, readFileSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { neon } from "@neondatabase/serverless";
import { eq, inArray, ilike, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../lib/db/schema";
import { TEST_PREFIX } from "../tests/shared/test-data";

const LEAD_STAGES = ["lead", "contacted", "requirement", "proposal", "negotiation", "won", "lost"];

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

type CreatedIdsRegistry = {
  clients?: string[];
  tickets?: string[];
  documents?: string[];
  leadStages?: { id: string; originalStage: string }[];
};

function loadRegistry(): CreatedIdsRegistry {
  const registryPath = "test-results/created-ids.json";
  if (!existsSync(registryPath)) return {};
  try {
    return JSON.parse(readFileSync(registryPath, "utf8")) as CreatedIdsRegistry;
  } catch {
    return {};
  }
}

async function cleanup() {
  loadLocalEnv();

  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("DATABASE_URL is required for test cleanup");
    process.exit(1);
  }

  const sql = neon(url);
  const db = drizzle(sql, { schema });
  const registry = loadRegistry();

  console.log("Cleaning up test data...");

  // Revert lead stages changed during tests
  for (const { id, originalStage } of registry.leadStages ?? []) {
    const stage = originalStage.replace(/^→\s*/, "").trim();
    if (!LEAD_STAGES.includes(stage)) {
      console.warn(`  Skipping invalid lead stage revert: ${originalStage}`);
      continue;
    }
    await db
      .update(schema.leads)
      .set({ stage: stage as typeof schema.leads.$inferSelect.stage, updatedAt: new Date() })
      .where(eq(schema.leads.id, id));
    console.log(`  Reverted lead ${id} → ${stage}`);
  }

  // Delete registered documents
  const documentIds = registry.documents ?? [];
  if (documentIds.length > 0) {
    await db.delete(schema.documents).where(inArray(schema.documents.id, documentIds));
    console.log(`  Deleted ${documentIds.length} registered document(s)`);
  }

  // Delete documents by [TEST] name prefix
  const testDocs = await db
    .select({ id: schema.documents.id })
    .from(schema.documents)
    .where(ilike(schema.documents.name, `${TEST_PREFIX}%`));
  if (testDocs.length > 0) {
    await db.delete(schema.documents).where(inArray(schema.documents.id, testDocs.map((d) => d.id)));
    console.log(`  Deleted ${testDocs.length} [TEST] document(s) by name`);
  }

  // Delete registered tickets
  const ticketIds = registry.tickets ?? [];
  if (ticketIds.length > 0) {
    await db.delete(schema.tickets).where(inArray(schema.tickets.id, ticketIds));
    console.log(`  Deleted ${ticketIds.length} registered ticket(s)`);
  }

  // Delete tickets by [TEST] subject prefix
  const testTickets = await db
    .select({ id: schema.tickets.id })
    .from(schema.tickets)
    .where(ilike(schema.tickets.subject, `${TEST_PREFIX}%`));
  if (testTickets.length > 0) {
    await db.delete(schema.tickets).where(inArray(schema.tickets.id, testTickets.map((t) => t.id)));
    console.log(`  Deleted ${testTickets.length} [TEST] ticket(s) by subject`);
  }

  // Delete registered clients (cascade removes related rows)
  const clientIds = registry.clients ?? [];
  if (clientIds.length > 0) {
    await db.delete(schema.clients).where(inArray(schema.clients.id, clientIds));
    console.log(`  Deleted ${clientIds.length} registered client(s)`);
  }

  // Delete clients by [TEST] company name prefix
  const testClients = await db
    .select({ id: schema.clients.id })
    .from(schema.clients)
    .where(ilike(schema.clients.companyName, `${TEST_PREFIX}%`));
  if (testClients.length > 0) {
    await db.delete(schema.clients).where(inArray(schema.clients.id, testClients.map((c) => c.id)));
    console.log(`  Deleted ${testClients.length} [TEST] client(s) by company name`);
  }

  // Delete test leads by company/name prefix (if any were created)
  const testLeads = await db
    .select({ id: schema.leads.id })
    .from(schema.leads)
    .where(
      or(
        ilike(schema.leads.company, `${TEST_PREFIX}%`),
        ilike(schema.leads.name, `${TEST_PREFIX}%`)
      )
    );
  if (testLeads.length > 0) {
    await db.delete(schema.leads).where(inArray(schema.leads.id, testLeads.map((l) => l.id)));
    console.log(`  Deleted ${testLeads.length} [TEST] lead(s)`);
  }

  console.log("Test cleanup complete.");
}

cleanup().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
