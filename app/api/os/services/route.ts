import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";

const serviceSchema = z.object({
  clientId: z.string().uuid(),
  name: z.string().min(1),
  type: z.enum(["website", "pos", "erp", "cullinos", "hosting", "domain", "seo", "whatsapp", "payment_gateway", "custom_development", "maintenance", "support", "other"]),
  plan: z.string().optional(),
  price: z.string().optional(),
  billingCycle: z.enum(["one_time", "monthly", "quarterly", "yearly"]).optional(),
  status: z.enum(["active", "pending", "expired", "cancelled", "suspended"]).optional(),
  expiryDate: z.string().optional(),
  description: z.string().optional(),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "clients.view")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured()) return NextResponse.json({ services: [] });

  const db = getDb();
  const services = await db.select().from(schema.services).orderBy(schema.services.createdAt);
  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "clients.edit")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isDbConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  try {
    const body = serviceSchema.parse(await req.json());
    const db = getDb();
    const [service] = await db
      .insert(schema.services)
      .values({
        clientId: body.clientId,
        name: body.name,
        type: body.type,
        plan: body.plan,
        price: body.price ?? "0",
        billingCycle: body.billingCycle ?? "monthly",
        status: body.status ?? "active",
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
        description: body.description,
      })
      .returning();

    if (body.expiryDate && body.billingCycle !== "one_time") {
      await db.insert(schema.renewals).values({
        clientId: body.clientId,
        serviceId: service.id,
        renewalDate: new Date(body.expiryDate),
        amount: body.price ?? "0",
        status: "upcoming",
      });
    }

    return NextResponse.json({ service });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Invalid data" }, { status: 400 });
  }
}
