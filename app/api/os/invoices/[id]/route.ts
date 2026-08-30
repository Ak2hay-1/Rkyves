import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit, apiError } from "@/lib/os/api-utils";
import { invoiceSchema } from "@/lib/validations/os";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("finance.view");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const { id } = await params;
  const db = getDb();
  const [invoice] = await db.select().from(schema.invoices).where(eq(schema.invoices.id, id)).limit(1);
  if (!invoice) return apiError("Invoice not found", 404);

  const items = await db.select().from(schema.invoiceItems).where(eq(schema.invoiceItems.invoiceId, id));
  return NextResponse.json({ invoice, items });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("finance.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, invoiceSchema.partial().omit({ clientId: true, items: true }));
  if (!parsed.ok) return parsed.response;

  const { id } = await params;
  const db = getDb();
  const updates: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
  if (parsed.data.dueDate) updates.dueDate = new Date(parsed.data.dueDate);

  const [invoice] = await db.update(schema.invoices).set(updates).where(eq(schema.invoices.id, id)).returning();
  if (!invoice) return apiError("Invoice not found", 404);
  await logAudit(auth.user.id, "update", "invoice", id, parsed.data, req);
  return NextResponse.json({ invoice });
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
  const [invoice] = await db.select().from(schema.invoices).where(eq(schema.invoices.id, id)).limit(1);
  if (!invoice) return apiError("Invoice not found", 404);
  if (invoice.status === "paid") return apiError("Cannot delete paid invoice", 400);

  await db.delete(schema.invoices).where(eq(schema.invoices.id, id));
  await logAudit(auth.user.id, "delete", "invoice", id, { invoiceNumber: invoice.invoiceNumber }, req);
  return NextResponse.json({ success: true });
}
