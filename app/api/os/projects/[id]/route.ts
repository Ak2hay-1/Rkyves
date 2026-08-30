import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit, apiError } from "@/lib/os/api-utils";
import { projectSchema } from "@/lib/validations/os";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("projects.view");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const { id } = await params;
  const db = getDb();
  const [project] = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
  if (!project) return apiError("Project not found", 404);

  const tasks = await db.select().from(schema.tasks).where(eq(schema.tasks.projectId, id));
  return NextResponse.json({ project, tasks });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("projects.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, projectSchema.partial().omit({ clientId: true }));
  if (!parsed.ok) return parsed.response;

  const { id } = await params;
  const db = getDb();
  const updates: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
  if (parsed.data.startDate) updates.startDate = new Date(parsed.data.startDate);
  if (parsed.data.deadline) updates.deadline = new Date(parsed.data.deadline);

  const [project] = await db.update(schema.projects).set(updates).where(eq(schema.projects.id, id)).returning();
  if (!project) return apiError("Project not found", 404);
  await logAudit(auth.user.id, "update", "project", id, parsed.data, req);
  return NextResponse.json({ project });
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
  const [project] = await db.delete(schema.projects).where(eq(schema.projects.id, id)).returning();
  if (!project) return apiError("Project not found", 404);
  await logAudit(auth.user.id, "delete", "project", id, { name: project.name }, req);
  return NextResponse.json({ success: true });
}
