import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit } from "@/lib/os/api-utils";
import { renewalSchema } from "@/lib/validations/os";

export async function GET() {
  const auth = await requirePermission("finance.view");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const db = getDb();
  const renewals = await db.select().from(schema.renewals).orderBy(desc(schema.renewals.renewalDate));
  return NextResponse.json({ renewals });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("finance.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, renewalSchema);
  if (!parsed.ok) return parsed.response;

  const db = getDb();
  const [renewal] = await db
    .insert(schema.renewals)
    .values({
      clientId: parsed.data.clientId,
      serviceId: parsed.data.serviceId,
      renewalDate: new Date(parsed.data.renewalDate),
      amount: parsed.data.amount,
      status: parsed.data.status ?? "upcoming",
      notes: parsed.data.notes,
    })
    .returning();

  await logAudit(auth.user.id, "create", "renewal", renewal.id, {}, req);
  return NextResponse.json({ renewal }, { status: 201 });
}
