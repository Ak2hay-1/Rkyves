import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit, apiError } from "@/lib/os/api-utils";
import { renewalSchema } from "@/lib/validations/os";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("finance.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, renewalSchema.partial().omit({ clientId: true, serviceId: true }));
  if (!parsed.ok) return parsed.response;

  const { id } = await params;
  const db = getDb();
  const updates: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
  if (parsed.data.renewalDate) updates.renewalDate = new Date(parsed.data.renewalDate);
  if (parsed.data.status === "renewed") updates.renewedAt = new Date();

  const [renewal] = await db.update(schema.renewals).set(updates).where(eq(schema.renewals.id, id)).returning();
  if (!renewal) return apiError("Renewal not found", 404);
  await logAudit(auth.user.id, "update", "renewal", id, parsed.data, req);
  return NextResponse.json({ renewal });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("finance.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const { id } = await params;
  const db = getDb();
  const [renewal] = await db.delete(schema.renewals).where(eq(schema.renewals.id, id)).returning();
  if (!renewal) return apiError("Renewal not found", 404);
  await logAudit(auth.user.id, "delete", "renewal", id, {}, req);
  return NextResponse.json({ success: true });
}
