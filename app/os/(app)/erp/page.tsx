import Link from "next/link";
import { eq } from "drizzle-orm";
import { isDbConfigured, getDb, schema } from "@/lib/db";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { SetupRequired } from "@/components/os/SetupRequired";

export const metadata = { title: "ERP — Rkyves OS" };

export default async function ErpPage() {
  if (!isDbConfigured()) return <SetupRequired />;

  const db = getDb();
  const items = await db
    .select({ erp: schema.erpDeployments, companyName: schema.clients.companyName })
    .from(schema.erpDeployments)
    .leftJoin(schema.clients, eq(schema.erpDeployments.clientId, schema.clients.id));

  return (
    <OsModuleShell title="ERP Management" description="Rkyves ERP deployments and modules" dbConfigured isEmpty={items.length === 0} emptyTitle="No ERP deployments">
      <OsTable
        headers={["Client", "Version", "Modules", "Users", "Deployment"]}
        rows={items.map(({ erp, companyName }) => [
          <Link key="c" href={`/os/clients/${erp.clientId}`} className="hover:text-primary">{companyName}</Link>,
          erp.version || "—",
          (erp.modules as string[] | null)?.join(", ") || "—",
          String(erp.users ?? "—"),
          erp.deployment || "—",
        ])}
      />
    </OsModuleShell>
  );
}
