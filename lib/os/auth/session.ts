import { cookies } from "next/headers";
import { eq, and, gt } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import type { UserRole } from "@/lib/db/schema";

export const SESSION_COOKIE = "rkyves_session";
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  clientId: string | null;
};

export async function createSession(
  userId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const db = getDb();
  const token = crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(schema.sessions).values({
    userId,
    token,
    expiresAt,
    ipAddress,
    userAgent,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const db = getDb();
    await db.delete(schema.sessions).where(eq(schema.sessions.token, token));
    cookieStore.delete(SESSION_COOKIE);
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!process.env.DATABASE_URL) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const db = getDb();
  const now = new Date();

  const [session] = await db
    .select()
    .from(schema.sessions)
    .where(and(eq(schema.sessions.token, token), gt(schema.sessions.expiresAt, now)))
    .limit(1);

  if (!session) return null;

  const [user] = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      role: schema.users.role,
      clientId: schema.users.clientId,
      isActive: schema.users.isActive,
    })
    .from(schema.users)
    .where(eq(schema.users.id, session.userId))
    .limit(1);

  if (!user || !user.isActive) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    clientId: user.clientId,
  };
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
