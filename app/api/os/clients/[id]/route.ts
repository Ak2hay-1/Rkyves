import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit, apiError } from "@/lib/os/api-utils";
import { clientSchema } from "@/lib/validations/os";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("clients.view");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const { id } = await params;
  const db = getDb();
  const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, id)).limit(1);
  if (!client) return apiError("Client not found", 404);
  return NextResponse.json({ client });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("clients.edit");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, clientSchema.partial());
  if (!parsed.ok) return parsed.response;

  const { id } = await params;
  const db = getDb();
  const [client] = await db
    .update(schema.clients)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.clients.id, id))
    .returning();

  if (!client) return apiError("Client not found", 404);
  await logAudit(auth.user.id, "update", "client", id, parsed.data, req);
  return NextResponse.json({ client });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("clients.delete");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const { id } = await params;
  const db = getDb();
  const [client] = await db.delete(schema.clients).where(eq(schema.clients.id, id)).returning();
  if (!client) return apiError("Client not found", 404);
  await logAudit(auth.user.id, "delete", "client", id, { companyName: client.companyName }, req);
  return NextResponse.json({ success: true });
}
