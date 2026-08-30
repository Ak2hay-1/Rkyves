import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit, apiError } from "@/lib/os/api-utils";
import { taskSchema } from "@/lib/validations/os";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("projects.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, taskSchema.partial().omit({ projectId: true }));
  if (!parsed.ok) return parsed.response;

  const { id } = await params;
  const db = getDb();
  const updates: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
  if (parsed.data.dueDate) updates.dueDate = new Date(parsed.data.dueDate);

  const [task] = await db.update(schema.tasks).set(updates).where(eq(schema.tasks.id, id)).returning();
  if (!task) return apiError("Task not found", 404);
  await logAudit(auth.user.id, "update", "task", id, parsed.data, req);
  return NextResponse.json({ task });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("projects.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const { id } = await params;
  const db = getDb();
  const [task] = await db.delete(schema.tasks).where(eq(schema.tasks.id, id)).returning();
  if (!task) return apiError("Task not found", 404);
  await logAudit(auth.user.id, "delete", "task", id, { title: task.title }, req);
  return NextResponse.json({ success: true });
}
