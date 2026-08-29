import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { updateCullinosEntitlements } from "@/lib/os/cullinos";
import { emitAutomationEvent } from "@/lib/os/automation";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-razorpay-signature");
  if (process.env.RAZORPAY_WEBHOOK_SECRET && signature) {
    // Production: verify HMAC signature with crypto.createHmac
  }

  if (!isDbConfigured()) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = await req.json();
  const event = body.event;
  const payload = body.payload?.subscription?.entity ?? body.payload?.payment?.entity;
  const razorpaySubId = payload?.id ?? payload?.subscription_id;

  if (!razorpaySubId) return NextResponse.json({ received: true });

  const db = getDb();
  const [sub] = await db
    .select()
    .from(schema.saasSubscriptions)
    .where(eq(schema.saasSubscriptions.razorpaySubscriptionId, razorpaySubId))
    .limit(1);

  if (!sub) return NextResponse.json({ received: true, matched: false });

  const [tenant] = sub.tenantId
    ? await db.select().from(schema.cullinosTenants).where(eq(schema.cullinosTenants.id, sub.tenantId)).limit(1)
    : [];

  if (event === "subscription.charged" || event === "payment.captured") {
    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await db.update(schema.saasSubscriptions).set({
      status: "active",
      graceUntil: null,
      currentPeriodEnd: periodEnd,
    }).where(eq(schema.saasSubscriptions.id, sub.id));

    if (sub.serviceId) {
      await db.update(schema.services).set({ expiryDate: periodEnd, status: "active" }).where(eq(schema.services.id, sub.serviceId));
    }

    if (tenant?.cullinosOrgId) {
      await updateCullinosEntitlements(tenant.cullinosOrgId, { status: "active" });
    }

    await emitAutomationEvent("payment.received", { clientId: sub.clientId, metadata: { source: "razorpay", subscriptionId: sub.id } });
  }

  if (event === "subscription.pending" || event === "payment.failed") {
    const graceUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.update(schema.saasSubscriptions).set({ status: "past_due", graceUntil }).where(eq(schema.saasSubscriptions.id, sub.id));

    if (tenant?.cullinosOrgId) {
      await updateCullinosEntitlements(tenant.cullinosOrgId, { status: "past_due", graceUntil: graceUntil.toISOString() });
    }
  }

  if (event === "subscription.cancelled") {
    await db.update(schema.saasSubscriptions).set({ status: "cancelled", cancelledAt: new Date() }).where(eq(schema.saasSubscriptions.id, sub.id));
    if (tenant?.cullinosOrgId) {
      await updateCullinosEntitlements(tenant.cullinosOrgId, { status: "suspended" });
      await db.update(schema.cullinosTenants).set({ status: "cancelled" }).where(eq(schema.cullinosTenants.id, tenant.id));
    }
  }

  return NextResponse.json({ received: true, event });
}
