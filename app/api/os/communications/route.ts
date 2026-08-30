import { NextRequest, NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit } from "@/lib/os/api-utils";
import { communicationSchema } from "@/lib/validations/os";

export async function POST(req: NextRequest) {
  const auth = await requirePermission("communications.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, communicationSchema);
  if (!parsed.ok) return parsed.response;

  const db = getDb();
  const [communication] = await db
    .insert(schema.communications)
    .values({
      clientId: parsed.data.clientId,
      type: parsed.data.type,
      subject: parsed.data.subject,
      content: parsed.data.content,
      direction: parsed.data.direction ?? "outbound",
      userId: auth.user.id,
    })
    .returning();

  await db.insert(schema.activities).values({
    clientId: parsed.data.clientId,
    type: parsed.data.type === "call" ? "call" : parsed.data.type === "email" ? "email" : parsed.data.type === "whatsapp" ? "whatsapp" : "note",
    title: parsed.data.subject || `${parsed.data.type} logged`,
    description: parsed.data.content,
    userId: auth.user.id,
  });

  await logAudit(auth.user.id, "create", "communication", communication.id, {}, req);
  return NextResponse.json({ communication }, { status: 201 });
}
