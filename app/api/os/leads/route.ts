import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit } from "@/lib/os/api-utils";
import { leadSchema } from "@/lib/validations/os";

export async function GET() {
  const auth = await requirePermission("leads.view");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const db = getDb();
  const leads = await db.select().from(schema.leads).orderBy(desc(schema.leads.updatedAt));
  return NextResponse.json({ leads });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("leads.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, leadSchema);
  if (!parsed.ok) return parsed.response;

  const db = getDb();
  const [lead] = await db
    .insert(schema.leads)
    .values({
      name: parsed.data.name,
      company: parsed.data.company,
      email: parsed.data.email || undefined,
      phone: parsed.data.phone,
      whatsapp: parsed.data.whatsapp,
      source: parsed.data.source,
      stage: parsed.data.stage ?? "lead",
      requirement: parsed.data.requirement,
      expectedValue: parsed.data.expectedValue,
      probability: parsed.data.probability,
      followUpDate: parsed.data.followUpDate ? new Date(parsed.data.followUpDate) : undefined,
      notes: parsed.data.notes,
      assignedToId: auth.user.id,
    })
    .returning();

  await logAudit(auth.user.id, "create", "lead", lead.id, { name: lead.name }, req);
  return NextResponse.json({ lead }, { status: 201 });
}
