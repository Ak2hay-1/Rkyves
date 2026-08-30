import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit, apiError } from "@/lib/os/api-utils";
import { taskSchema } from "@/lib/validations/os";

export async function GET(req: NextRequest) {
  const auth = await requirePermission("projects.view");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const projectId = req.nextUrl.searchParams.get("projectId");
  const db = getDb();

  const tasks = projectId
    ? await db.select().from(schema.tasks).where(eq(schema.tasks.projectId, projectId)).orderBy(schema.tasks.sortOrder)
    : await db.select().from(schema.tasks).orderBy(desc(schema.tasks.updatedAt));

  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("projects.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, taskSchema);
  if (!parsed.ok) return parsed.response;

  const db = getDb();
  const [task] = await db
    .insert(schema.tasks)
    .values({
      projectId: parsed.data.projectId,
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status ?? "todo",
      priority: parsed.data.priority ?? "medium",
      assignedToId: parsed.data.assignedToId ?? undefined,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      sortOrder: parsed.data.sortOrder ?? 0,
    })
    .returning();

  await logAudit(auth.user.id, "create", "task", task.id, { title: task.title }, req);
  return NextResponse.json({ task }, { status: 201 });
}
