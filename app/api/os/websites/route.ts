import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit } from "@/lib/os/api-utils";
import { websiteSchema } from "@/lib/validations/os";

export async function GET() {
  const auth = await requirePermission("infrastructure.view");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const db = getDb();
  const websites = await db.select().from(schema.websites).orderBy(desc(schema.websites.updatedAt));
  return NextResponse.json({ websites });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("infrastructure.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, websiteSchema);
  if (!parsed.ok) return parsed.response;

  const db = getDb();
  const [website] = await db
    .insert(schema.websites)
    .values({
      clientId: parsed.data.clientId,
      serviceId: parsed.data.serviceId ?? undefined,
      name: parsed.data.name,
      domain: parsed.data.domain,
      domainExpiry: parsed.data.domainExpiry ? new Date(parsed.data.domainExpiry) : undefined,
      hosting: parsed.data.hosting,
      sslExpiry: parsed.data.sslExpiry ? new Date(parsed.data.sslExpiry) : undefined,
      server: parsed.data.server,
      status: parsed.data.status ?? "online",
      seoEnabled: parsed.data.seoEnabled,
      backupEnabled: parsed.data.backupEnabled,
    })
    .returning();

  await logAudit(auth.user.id, "create", "website", website.id, { name: website.name }, req);
  return NextResponse.json({ website }, { status: 201 });
}
