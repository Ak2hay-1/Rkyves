import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit } from "@/lib/os/api-utils";
import { posDeploymentSchema } from "@/lib/validations/os";

export async function GET() {
  const auth = await requirePermission("infrastructure.view");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const db = getDb();
  const deployments = await db.select().from(schema.posDeployments).orderBy(desc(schema.posDeployments.updatedAt));
  return NextResponse.json({ deployments });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("infrastructure.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, posDeploymentSchema);
  if (!parsed.ok) return parsed.response;

  const db = getDb();
  const [deployment] = await db
    .insert(schema.posDeployments)
    .values({
      clientId: parsed.data.clientId,
      serviceId: parsed.data.serviceId ?? undefined,
      version: parsed.data.version,
      terminals: parsed.data.terminals,
      hardware: parsed.data.hardware,
      server: parsed.data.server,
      installationNotes: parsed.data.installationNotes,
    })
    .returning();

  await logAudit(auth.user.id, "create", "pos_deployment", deployment.id, {}, req);
  return NextResponse.json({ deployment }, { status: 201 });
}
