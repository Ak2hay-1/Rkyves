import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import type { SessionUser } from "@/lib/os/auth/session";

export async function getPortalClientId(user: SessionUser): Promise<string | null> {
  if (user.role === "client" && user.clientId) return user.clientId;
  return null;
}

export async function getPortalClient(clientId: string) {
  const db = getDb();
  const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, clientId)).limit(1);
  return client ?? null;
}
