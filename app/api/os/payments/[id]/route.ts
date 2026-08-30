import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit, apiError } from "@/lib/os/api-utils";
import { paymentSchema } from "@/lib/validations/os";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("finance.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, paymentSchema.partial().omit({ clientId: true }));
  if (!parsed.ok) return parsed.response;

  const { id } = await params;
  const db = getDb();
  const updates: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.amount) updates.amount = String(parsed.data.amount);
  if (parsed.data.paidAt) updates.paidAt = new Date(parsed.data.paidAt);

  const [payment] = await db.update(schema.payments).set(updates).where(eq(schema.payments.id, id)).returning();
  if (!payment) return apiError("Payment not found", 404);
  await logAudit(auth.user.id, "update", "payment", id, parsed.data, req);
  return NextResponse.json({ payment });
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
  const [payment] = await db.delete(schema.payments).where(eq(schema.payments.id, id)).returning();
  if (!payment) return apiError("Payment not found", 404);
  await logAudit(auth.user.id, "delete", "payment", id, { amount: payment.amount }, req);
  return NextResponse.json({ success: true });
}
