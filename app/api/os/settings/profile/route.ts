import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireAuth, requireDb, parseBody, logAudit } from "@/lib/os/api-utils";
import { profileSchema } from "@/lib/validations/os";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const db = getDb();
  const [user] = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      phone: schema.users.phone,
      avatar: schema.users.avatar,
      role: schema.users.role,
    })
    .from(schema.users)
    .where(eq(schema.users.id, auth.user.id))
    .limit(1);

  return NextResponse.json({ profile: user });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, profileSchema);
  if (!parsed.ok) return parsed.response;

  const db = getDb();
  const [profile] = await db
    .update(schema.users)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.users.id, auth.user.id))
    .returning({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      phone: schema.users.phone,
      avatar: schema.users.avatar,
      role: schema.users.role,
    });

  await logAudit(auth.user.id, "update", "profile", profile.id, parsed.data, req);
  return NextResponse.json({ profile });
}
