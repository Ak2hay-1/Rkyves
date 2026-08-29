import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { convertLeadToClient } from "@/lib/os/automation";
import { logAudit } from "@/lib/os/api-utils";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "leads.manage")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { id } = await params;

  try {
    const body = await req.json().catch(() => ({}));
    const client = await convertLeadToClient(id, user.id, {
      createPortalAccess: body.createPortalAccess ?? false,
      createProject: body.createProject ?? true,
    });

    await logAudit(user.id, "convert", "lead", id, { clientId: client.id }, req);

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Conversion failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "leads.manage")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  const [lead] = await db
    .update(schema.leads)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(schema.leads.id, id))
    .returning();

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  await logAudit(user.id, "update", "lead", id, body, req);
  return NextResponse.json({ lead });
}
