import Link from "next/link";
import { eq } from "drizzle-orm";
import { isDbConfigured, getDb, schema } from "@/lib/db";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { SetupRequired } from "@/components/os/SetupRequired";
import { Badge } from "@/components/os/ui/badge";

export const metadata = { title: "Cullinos Tenants — Rkyves OS" };

export default async function CullinosTenantsPage() {
  if (!isDbConfigured()) return <SetupRequired />;

  const db = getDb();
  const tenants = await db
    .select({
      tenant: schema.cullinosTenants,
      companyName: schema.clients.companyName,
      planName: schema.productPlans.name,
    })
    .from(schema.cullinosTenants)
    .leftJoin(schema.clients, eq(schema.cullinosTenants.clientId, schema.clients.id))
    .leftJoin(schema.productPlans, eq(schema.cullinosTenants.planId, schema.productPlans.id))
    .orderBy(schema.cullinosTenants.createdAt);

  return (
    <OsModuleShell
      title="Cullinos Tenants"
      description="Live Cullinos restaurant OS tenants — provisioning, plans, and sync status"
      dbConfigured
      isEmpty={tenants.length === 0}
      emptyTitle="No Cullinos tenants"
    >
      <OsTable
        headers={["Client", "Slug", "Plan", "Outlets", "Terminals", "Gateway", "Status", "Last Sync"]}
        rows={tenants.map(({ tenant, companyName, planName }) => [
          <Link key="c" href={`/os/clients/${tenant.clientId}?tab=cullinos`} className="hover:text-primary">
            {companyName}
          </Link>,
          tenant.slug || "—",
          planName || "—",
          String(tenant.outletCount ?? "—"),
          String(tenant.terminalCount ?? "—"),
          tenant.gatewayStatus || "—",
          <Badge key="s" variant={tenant.status === "active" ? "success" : tenant.status === "suspended" ? "danger" : "default"}>
            {tenant.status}
          </Badge>,
          tenant.lastSyncAt ? new Date(tenant.lastSyncAt).toLocaleDateString() : "—",
        ])}
      />
    </OsModuleShell>
  );
}
