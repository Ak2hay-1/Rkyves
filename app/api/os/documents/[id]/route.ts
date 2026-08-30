import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, logAudit, apiError } from "@/lib/os/api-utils";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("documents.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const { id } = await params;
  const db = getDb();
  const [doc] = await db.delete(schema.documents).where(eq(schema.documents.id, id)).returning();
  if (!doc) return apiError("Document not found", 404);
  await logAudit(auth.user.id, "delete", "document", id, { name: doc.name }, req);
  return NextResponse.json({ success: true });
}
