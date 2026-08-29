import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { decrypt, encrypt } from "@/lib/os/encryption";
import { logAudit, getClientIp } from "@/lib/os/api-utils";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "credentials.view")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ credentials: [] });
  }

  const clientId = req.nextUrl.searchParams.get("clientId");
  const db = getDb();

  const credentials = clientId
    ? await db.select().from(schema.credentials).where(eq(schema.credentials.clientId, clientId))
    : await db.select().from(schema.credentials);

  // Never return decrypted passwords in list view
  const safe = credentials.map((c) => ({
    id: c.id,
    clientId: c.clientId,
    name: c.name,
    category: c.category,
    username: c.username,
    url: c.url,
    hasPassword: Boolean(c.encryptedPassword),
    createdAt: c.createdAt,
  }));

  return NextResponse.json({ credentials: safe });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "credentials.manage")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const schema_ = z.object({
    clientId: z.string().uuid(),
    name: z.string().min(1),
    category: z.string().min(1),
    username: z.string().optional(),
    password: z.string().optional(),
    url: z.string().optional(),
    notes: z.string().optional(),
  });

  try {
    const body = schema_.parse(await req.json());
    const db = getDb();

    const [credential] = await db
      .insert(schema.credentials)
      .values({
        clientId: body.clientId,
        name: body.name,
        category: body.category,
        username: body.username,
        encryptedPassword: body.password ? encrypt(body.password) : undefined,
        url: body.url,
        notes: body.notes,
        createdById: user.id,
      })
      .returning();

    await logAudit(user.id, "create", "credential", credential.id, { name: body.name }, req);

    return NextResponse.json({ credential: { id: credential.id, name: credential.name } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to store credential" }, { status: 500 });
  }
}
