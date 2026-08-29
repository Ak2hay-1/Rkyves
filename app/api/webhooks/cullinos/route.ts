import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-webhook-secret");
  if (secret !== process.env.CULLINOS_WEBHOOK_SECRET && secret !== process.env.RKYVES_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = await req.json();
  const { event, organizationId, rkyvesClientId, slug, adminEmail } = body;
  const db = getDb();

  if (event === "tenant.ready" && rkyvesClientId) {
    await db
      .update(schema.cullinosTenants)
      .set({ status: "active", cullinosOrgId: organizationId, slug, provisionedAt: new Date() })
      .where(eq(schema.cullinosTenants.clientId, rkyvesClientId));
  }

  if (event === "usage.daily" && organizationId) {
    const [tenant] = await db
      .select()
      .from(schema.cullinosTenants)
      .where(eq(schema.cullinosTenants.cullinosOrgId, organizationId))
      .limit(1);
    if (tenant) {
      await db.insert(schema.usageSnapshots).values({
        tenantId: tenant.id,
        terminalsActive: body.terminalsActive ?? 0,
        ordersMtd: body.ordersMtd ?? 0,
        metrics: body.metrics ?? {},
      });
      await db
        .update(schema.cullinosTenants)
        .set({
          terminalCount: body.terminalsActive ?? tenant.terminalCount,
          lastSyncAt: new Date(),
          gatewayStatus: body.gatewayStatus ?? tenant.gatewayStatus,
        })
        .where(eq(schema.cullinosTenants.id, tenant.id));
    }
  }

  if (event === "sync.failure" && organizationId) {
    const [tenant] = await db
      .select()
      .from(schema.cullinosTenants)
      .where(eq(schema.cullinosTenants.cullinosOrgId, organizationId))
      .limit(1);
    if (tenant) {
      await db.update(schema.cullinosTenants).set({ gatewayStatus: "error" }).where(eq(schema.cullinosTenants.id, tenant.id));
    }
  }

  return NextResponse.json({ received: true, event, adminEmail });
}
