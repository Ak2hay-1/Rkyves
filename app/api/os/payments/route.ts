import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { isDbConfigured, getDb, schema } from "@/lib/db";
import { emitAutomationEvent } from "@/lib/os/automation";
import { logAudit } from "@/lib/os/api-utils";
import { z } from "zod";

const paymentSchema = z.object({
  clientId: z.string().uuid(),
  invoiceId: z.string().uuid().optional(),
  amount: z.string().or(z.number()),
  method: z.enum(["bank_transfer", "upi", "card", "cash", "cheque", "razorpay", "other"]).optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "finance.manage")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const body = paymentSchema.parse(await req.json());
    const db = getDb();

    const [payment] = await db
      .insert(schema.payments)
      .values({
        clientId: body.clientId,
        invoiceId: body.invoiceId,
        amount: String(body.amount),
        method: body.method || "bank_transfer",
        reference: body.reference,
        notes: body.notes,
        recordedById: user.id,
      })
      .returning();

    await emitAutomationEvent("payment.received", {
      userId: user.id,
      clientId: body.clientId,
      paymentId: payment.id,
    });

    await logAudit(user.id, "create", "payment", payment.id, { amount: body.amount }, req);

    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}

export async function GET() {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "finance.view")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ payments: [] });
  }

  const { getPayments } = await import("@/lib/os/module-queries");
  const payments = await getPayments();
  return NextResponse.json({ payments });
}
