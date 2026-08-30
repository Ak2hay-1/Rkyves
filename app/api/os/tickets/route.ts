import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit } from "@/lib/os/api-utils";
import { ticketSchema } from "@/lib/validations/os";

async function generateTicketNumber() {
  const db = getDb();
  const count = await db.select().from(schema.tickets);
  return `TKT-${String(count.length + 1).padStart(5, "0")}`;
}

export async function GET() {
  const auth = await requirePermission("support.view");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const db = getDb();
  const tickets = await db.select().from(schema.tickets).orderBy(desc(schema.tickets.createdAt));
  return NextResponse.json({ tickets });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("support.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, ticketSchema);
  if (!parsed.ok) return parsed.response;

  const db = getDb();
  const ticketNumber = await generateTicketNumber();
  const [ticket] = await db
    .insert(schema.tickets)
    .values({
      ticketNumber,
      clientId: parsed.data.clientId,
      subject: parsed.data.subject,
      description: parsed.data.description,
      priority: parsed.data.priority ?? "medium",
      category: parsed.data.category ?? "general",
      status: parsed.data.status ?? "new",
      assignedToId: parsed.data.assignedToId ?? undefined,
      createdById: auth.user.id,
    })
    .returning();

  await db.insert(schema.activities).values({
    clientId: ticket.clientId,
    type: "ticket",
    title: "Ticket created",
    description: ticket.subject,
    userId: auth.user.id,
  });

  await logAudit(auth.user.id, "create", "ticket", ticket.id, { ticketNumber }, req);
  return NextResponse.json({ ticket }, { status: 201 });
}
