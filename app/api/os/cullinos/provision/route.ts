import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { logAudit } from "@/lib/os/api-utils";
import { provisionCullinosTenant } from "@/lib/os/cullinos";
import { emitAutomationEvent } from "@/lib/os/automation";

const provisionSchema = z.object({
  clientId: z.string().uuid(),
  planSlug: z.enum(["starter", "professional", "enterprise"]).default("starter"),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(8),
  outletName: z.string().min(1),
  adminName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "clients.edit")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const body = provisionSchema.parse(await req.json());
    const db = getDb();

    const [client] = await db
      .select()
      .from(schema.clients)
      .where(eq(schema.clients.id, body.clientId))
      .limit(1);
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const [plan] = await db
      .select()
      .from(schema.productPlans)
      .where(eq(schema.productPlans.slug, body.planSlug))
      .limit(1);

    const result = await provisionCullinosTenant({
      rkyvesClientId: body.clientId,
      companyName: client.companyName,
      planSlug: body.planSlug,
      adminEmail: body.adminEmail,
      adminPassword: body.adminPassword,
      outletName: body.outletName,
      adminName: body.adminName,
    });

    const [service] = await db
      .insert(schema.services)
      .values({
        clientId: body.clientId,
        name: "Cullinos",
        type: "cullinos",
        plan: body.planSlug,
        price: plan?.priceMonthly ?? "2999",
        billingCycle: "monthly",
        status: "active",
        metadata: { cullinosOrgId: result.organizationId },
      })
      .returning();

    const [tenant] = await db
      .insert(schema.cullinosTenants)
      .values({
        clientId: body.clientId,
        serviceId: service.id,
        planId: plan?.id,
        cullinosOrgId: result.organizationId,
        slug: result.slug,
        status: "active",
        provisionedAt: new Date(),
      })
      .returning();

    const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await db.insert(schema.saasSubscriptions).values({
      clientId: body.clientId,
      serviceId: service.id,
      tenantId: tenant.id,
      planId: plan?.id,
      status: "trial",
      trialEndsAt: trialEnd,
      currentPeriodStart: new Date(),
      currentPeriodEnd: trialEnd,
    });

    await db.insert(schema.renewals).values({
      clientId: body.clientId,
      serviceId: service.id,
      renewalDate: trialEnd,
      amount: plan?.priceMonthly ?? "2999",
      status: "upcoming",
    });

    await logAudit(user.id, "cullinos.provisioned", "cullinos_tenant", tenant.id, { orgId: result.organizationId }, req);
    await emitAutomationEvent("client.updated", { clientId: body.clientId, userId: user.id, metadata: { cullinosProvisioned: true } });

    return NextResponse.json({ tenant, service, provision: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Provision failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
