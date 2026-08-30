import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, logAudit, apiError } from "@/lib/os/api-utils";

const bodySchema = z.object({ tenantId: z.string().uuid() });

export async function POST(req: NextRequest) {
  const auth = await requirePermission("infrastructure.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const body = bodySchema.parse(await req.json());
  const db = getDb();
  const [tenant] = await db.delete(schema.cullinosTenants).where(eq(schema.cullinosTenants.id, body.tenantId)).returning();
  if (!tenant) return apiError("Tenant not found", 404);
  await logAudit(auth.user.id, "delete", "cullinos_tenant", body.tenantId, { slug: tenant.slug }, req);
  return NextResponse.json({ success: true });
}
