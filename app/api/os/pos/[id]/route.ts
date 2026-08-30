import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit, apiError } from "@/lib/os/api-utils";
import { posDeploymentSchema } from "@/lib/validations/os";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("infrastructure.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, posDeploymentSchema.partial().omit({ clientId: true }));
  if (!parsed.ok) return parsed.response;

  const { id } = await params;
  const db = getDb();
  const [deployment] = await db
    .update(schema.posDeployments)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.posDeployments.id, id))
    .returning();

  if (!deployment) return apiError("Deployment not found", 404);
  await logAudit(auth.user.id, "update", "pos_deployment", id, parsed.data, req);
  return NextResponse.json({ deployment });
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
  const [deployment] = await db.delete(schema.posDeployments).where(eq(schema.posDeployments.id, id)).returning();
  if (!deployment) return apiError("Deployment not found", 404);
  await logAudit(auth.user.id, "delete", "pos_deployment", id, {}, req);
  return NextResponse.json({ success: true });
}
