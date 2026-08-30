import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit, apiError } from "@/lib/os/api-utils";
import { erpDeploymentSchema } from "@/lib/validations/os";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("infrastructure.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, erpDeploymentSchema.partial().omit({ clientId: true }));
  if (!parsed.ok) return parsed.response;

  const { id } = await params;
  const db = getDb();
  const [deployment] = await db
    .update(schema.erpDeployments)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.erpDeployments.id, id))
    .returning();

  if (!deployment) return apiError("Deployment not found", 404);
  await logAudit(auth.user.id, "update", "erp_deployment", id, parsed.data, req);
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
  const [deployment] = await db.delete(schema.erpDeployments).where(eq(schema.erpDeployments.id, id)).returning();
  if (!deployment) return apiError("Deployment not found", 404);
  await logAudit(auth.user.id, "delete", "erp_deployment", id, {}, req);
  return NextResponse.json({ success: true });
}
