import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit, apiError } from "@/lib/os/api-utils";
import { projectSchema } from "@/lib/validations/os";

export async function GET() {
  const auth = await requirePermission("projects.view");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const db = getDb();
  const projects = await db.select().from(schema.projects).orderBy(desc(schema.projects.updatedAt));
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("projects.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, projectSchema);
  if (!parsed.ok) return parsed.response;

  const db = getDb();
  const [project] = await db
    .insert(schema.projects)
    .values({
      clientId: parsed.data.clientId,
      serviceId: parsed.data.serviceId ?? undefined,
      name: parsed.data.name,
      description: parsed.data.description,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : undefined,
      status: parsed.data.status ?? "planning",
      progress: parsed.data.progress ?? 0,
      priority: parsed.data.priority ?? "medium",
    })
    .returning();

  await db.insert(schema.activities).values({
    clientId: project.clientId,
    type: "project",
    title: "Project created",
    description: project.name,
    userId: auth.user.id,
  });

  await logAudit(auth.user.id, "create", "project", project.id, { name: project.name }, req);
  return NextResponse.json({ project }, { status: 201 });
}
