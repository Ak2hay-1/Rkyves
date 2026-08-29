import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { updateCullinosEntitlements } from "@/lib/os/cullinos";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "clients.edit")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isDbConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const { tenantId } = await req.json();
  const db = getDb();

  const [tenant] = await db
    .select()
    .from(schema.cullinosTenants)
    .where(eq(schema.cullinosTenants.id, tenantId))
    .limit(1);
  if (!tenant?.cullinosOrgId) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

  await updateCullinosEntitlements(tenant.cullinosOrgId, { status: "active" });
  await db.update(schema.cullinosTenants).set({ status: "active" }).where(eq(schema.cullinosTenants.id, tenantId));
  await db.update(schema.saasSubscriptions).set({ status: "active", graceUntil: null }).where(eq(schema.saasSubscriptions.tenantId, tenantId));

  return NextResponse.json({ ok: true });
}
