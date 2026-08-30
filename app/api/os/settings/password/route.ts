import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireAuth, requireDb, parseBody, logAudit } from "@/lib/os/api-utils";
import { passwordChangeSchema } from "@/lib/validations/os";
import { hashPassword, verifyPassword } from "@/lib/os/auth/password";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, passwordChangeSchema);
  if (!parsed.ok) return parsed.response;

  const db = getDb();
  const [user] = await db
    .select({ passwordHash: schema.users.passwordHash })
    .from(schema.users)
    .where(eq(schema.users.id, auth.user.id))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await db
    .update(schema.users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(schema.users.id, auth.user.id));

  await logAudit(auth.user.id, "update", "password", auth.user.id, {}, req);
  return NextResponse.json({ success: true });
}
