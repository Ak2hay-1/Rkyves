import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";

export async function getOrgSettings() {
  const db = getDb();
  const [settings] = await db.select().from(schema.orgSettings).limit(1);
  if (settings) return settings;

  const [created] = await db
    .insert(schema.orgSettings)
    .values({ companyName: "Rkyves" })
    .returning();
  return created;
}

export async function getUserPreferences(userId: string) {
  const db = getDb();
  const [prefs] = await db
    .select()
    .from(schema.userPreferences)
    .where(eq(schema.userPreferences.userId, userId))
    .limit(1);

  if (prefs) return prefs;

  const [created] = await db
    .insert(schema.userPreferences)
    .values({ userId })
    .returning();
  return created;
}
