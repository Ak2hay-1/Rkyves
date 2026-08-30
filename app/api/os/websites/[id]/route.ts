import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit, apiError } from "@/lib/os/api-utils";
import { websiteSchema } from "@/lib/validations/os";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("infrastructure.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, websiteSchema.partial().omit({ clientId: true }));
  if (!parsed.ok) return parsed.response;

  const { id } = await params;
  const db = getDb();
  const updates: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
  if (parsed.data.domainExpiry) updates.domainExpiry = new Date(parsed.data.domainExpiry);
  if (parsed.data.sslExpiry) updates.sslExpiry = new Date(parsed.data.sslExpiry);

  const [website] = await db.update(schema.websites).set(updates).where(eq(schema.websites.id, id)).returning();
  if (!website) return apiError("Website not found", 404);
  await logAudit(auth.user.id, "update", "website", id, parsed.data, req);
  return NextResponse.json({ website });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("infrastructure.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const { id } = await params;
  const db = getDb();
  const [website] = await db.delete(schema.websites).where(eq(schema.websites.id, id)).returning();
  if (!website) return apiError("Website not found", 404);
  await logAudit(auth.user.id, "delete", "website", id, { name: website.name }, req);
  return NextResponse.json({ success: true });
}
