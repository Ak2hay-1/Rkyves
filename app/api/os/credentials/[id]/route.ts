import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { decrypt, maskSecret } from "@/lib/os/encryption";
import { logAudit } from "@/lib/os/api-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "credentials.view")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { id } = await params;
  const reveal = req.nextUrl.searchParams.get("reveal") === "true";
  const db = getDb();

  const [credential] = await db
    .select()
    .from(schema.credentials)
    .where(eq(schema.credentials.id, id))
    .limit(1);

  if (!credential) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Audit every access
  await db.insert(schema.credentialAccessLogs).values({
    credentialId: id,
    userId: user.id,
    ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0],
  });

  await logAudit(user.id, "access", "credential", id, { reveal }, req);

  let password: string | undefined;
  if (reveal && credential.encryptedPassword) {
    password = decrypt(credential.encryptedPassword);
  }

  return NextResponse.json({
    credential: {
      id: credential.id,
      name: credential.name,
      category: credential.category,
      username: credential.username,
      url: credential.url,
      password: password ?? (credential.encryptedPassword ? maskSecret("hidden") : null),
      notes: credential.notes,
    },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "credentials.manage")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { id } = await params;
  const body = await req.json();
  const db = getDb();

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (body.name) updates.name = body.name;
  if (body.category) updates.category = body.category;
  if (body.username !== undefined) updates.username = body.username;
  if (body.url !== undefined) updates.url = body.url;
  if (body.notes !== undefined) updates.notes = body.notes;
  if (body.password) updates.encryptedPassword = (await import("@/lib/os/encryption")).encrypt(body.password);

  const [credential] = await db.update(schema.credentials).set(updates).where(eq(schema.credentials.id, id)).returning();
  if (!credential) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await logAudit(user.id, "update", "credential", id, { name: credential.name }, req);
  return NextResponse.json({ credential: { id: credential.id, name: credential.name } });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "credentials.manage")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { id } = await params;
  const db = getDb();
  const [credential] = await db.delete(schema.credentials).where(eq(schema.credentials.id, id)).returning();
  if (!credential) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await logAudit(user.id, "delete", "credential", id, { name: credential.name }, req);
  return NextResponse.json({ success: true });
}
