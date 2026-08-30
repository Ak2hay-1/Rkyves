import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit, apiError } from "@/lib/os/api-utils";
import { ticketSchema } from "@/lib/validations/os";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("support.view");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const { id } = await params;
  const db = getDb();
  const [ticket] = await db.select().from(schema.tickets).where(eq(schema.tickets.id, id)).limit(1);
  if (!ticket) return apiError("Ticket not found", 404);
  return NextResponse.json({ ticket });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("support.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, ticketSchema.partial().omit({ clientId: true, description: true }));
  if (!parsed.ok) return parsed.response;

  const { id } = await params;
  const db = getDb();
  const updates: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
  if (parsed.data.status === "resolved") updates.resolvedAt = new Date();
  if (parsed.data.status === "closed") updates.closedAt = new Date();

  const [ticket] = await db.update(schema.tickets).set(updates).where(eq(schema.tickets.id, id)).returning();
  if (!ticket) return apiError("Ticket not found", 404);
  await logAudit(auth.user.id, "update", "ticket", id, parsed.data, req);
  return NextResponse.json({ ticket });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("support.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const { id } = await params;
  const db = getDb();
  const [ticket] = await db.delete(schema.tickets).where(eq(schema.tickets.id, id)).returning();
  if (!ticket) return apiError("Ticket not found", 404);
  await logAudit(auth.user.id, "delete", "ticket", id, { ticketNumber: ticket.ticketNumber }, req);
  return NextResponse.json({ success: true });
}
