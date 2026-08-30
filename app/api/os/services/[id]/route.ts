import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit, apiError } from "@/lib/os/api-utils";
import { serviceSchema } from "@/lib/validations/os";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("services.view");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const { id } = await params;
  const db = getDb();
  const [service] = await db.select().from(schema.services).where(eq(schema.services.id, id)).limit(1);
  if (!service) return apiError("Service not found", 404);
  return NextResponse.json({ service });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("clients.edit");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, serviceSchema.partial().omit({ clientId: true }));
  if (!parsed.ok) return parsed.response;

  const { id } = await params;
  const db = getDb();
  const updates: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
  if (parsed.data.expiryDate) updates.expiryDate = new Date(parsed.data.expiryDate);
  if (parsed.data.startDate) updates.startDate = new Date(parsed.data.startDate);

  const [service] = await db.update(schema.services).set(updates).where(eq(schema.services.id, id)).returning();
  if (!service) return apiError("Service not found", 404);
  await logAudit(auth.user.id, "update", "service", id, parsed.data, req);
  return NextResponse.json({ service });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("clients.edit");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const { id } = await params;
  const db = getDb();
  const [service] = await db.delete(schema.services).where(eq(schema.services.id, id)).returning();
  if (!service) return apiError("Service not found", 404);
  await logAudit(auth.user.id, "delete", "service", id, { name: service.name }, req);
  return NextResponse.json({ success: true });
}
