import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit } from "@/lib/os/api-utils";
import { orgSettingsSchema } from "@/lib/validations/os";
import { getOrgSettings } from "@/lib/os/settings";

export async function GET() {
  const auth = await requirePermission("settings.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const settings = await getOrgSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const auth = await requirePermission("settings.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, orgSettingsSchema);
  if (!parsed.ok) return parsed.response;

  const db = getDb();
  const existing = await getOrgSettings();
  const [settings] = await db
    .update(schema.orgSettings)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.orgSettings.id, existing.id))
    .returning();

  await logAudit(auth.user.id, "update", "org_settings", settings.id, parsed.data, req);
  return NextResponse.json({ settings });
}
