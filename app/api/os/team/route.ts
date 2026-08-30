import { NextRequest, NextResponse } from "next/server";
import { eq, ne } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit } from "@/lib/os/api-utils";
import { teamUserSchema } from "@/lib/validations/os";
import { hashPassword } from "@/lib/os/auth/password";

export async function GET() {
  const auth = await requirePermission("team.view");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const db = getDb();
  const users = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      role: schema.users.role,
      phone: schema.users.phone,
      isActive: schema.users.isActive,
      lastLoginAt: schema.users.lastLoginAt,
      createdAt: schema.users.createdAt,
    })
    .from(schema.users)
    .where(ne(schema.users.role, "client"));

  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("team.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, teamUserSchema);
  if (!parsed.ok) return parsed.response;

  const db = getDb();
  const passwordHash = await hashPassword(parsed.data.password);
  const [user] = await db
    .insert(schema.users)
    .values({
      email: parsed.data.email,
      name: parsed.data.name,
      role: parsed.data.role,
      phone: parsed.data.phone,
      passwordHash,
    })
    .returning({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      role: schema.users.role,
    });

  await logAudit(auth.user.id, "create", "user", user.id, { email: user.email }, req);
  return NextResponse.json({ user }, { status: 201 });
}
