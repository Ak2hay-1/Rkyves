import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { logAudit, getClientIp } from "@/lib/os/api-utils";

const clientSchema = z.object({
  companyName: z.string().min(1),
  contactPerson: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  gst: z.string().optional(),
  pan: z.string().optional(),
  industry: z.string().optional(),
  businessType: z.string().optional(),
  status: z.enum(["lead", "active", "inactive", "churned", "at_risk"]).optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "clients.view")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ clients: [] });
  }

  const db = getDb();
  const clients = await db.select().from(schema.clients).orderBy(schema.clients.companyName);
  return NextResponse.json({ clients });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "clients.create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const body = clientSchema.parse(await req.json());
    const db = getDb();

    const [client] = await db
      .insert(schema.clients)
      .values({
        ...body,
        assignedToId: user.id,
      })
      .returning();

    await db.insert(schema.activities).values({
      clientId: client.id,
      type: "system",
      title: "Client created",
      description: `${client.companyName} added to Rkyves OS`,
      userId: user.id,
    });

    await logAudit(user.id, "create", "client", client.id, { companyName: client.companyName }, req);

    const { emitAutomationEvent } = await import("@/lib/os/automation");
    await emitAutomationEvent("client.created", {
      userId: user.id,
      clientId: client.id,
      metadata: { createProject: false },
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
