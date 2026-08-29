import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { getSessionUser } from "@/lib/os/auth/session";
import { emitAutomationEvent } from "@/lib/os/automation";

const ticketSchema = z.object({
  clientId: z.string().uuid(),
  subject: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  category: z.enum(["general", "technical", "billing", "hosting", "website", "pos", "erp", "other"]).optional(),
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const body = ticketSchema.parse(await req.json());

    if (user.role === "client" && user.clientId !== body.clientId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const db = getDb();

    const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;

    const [ticket] = await db
      .insert(schema.tickets)
      .values({
        ticketNumber,
        clientId: body.clientId,
        subject: body.subject,
        description: body.description,
        priority: body.priority || "medium",
        category: body.category || "general",
        status: "new",
        createdById: user.id,
      })
      .returning();

    await emitAutomationEvent("ticket.created", {
      userId: user.id,
      clientId: body.clientId,
      ticketId: ticket.id,
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
