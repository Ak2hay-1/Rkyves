import Link from "next/link";
import { eq } from "drizzle-orm";
import { isDbConfigured, getDb, schema } from "@/lib/db";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { SetupRequired } from "@/components/os/SetupRequired";

export const metadata = { title: "POS — Rkyves OS" };

export default async function PosPage() {
  if (!isDbConfigured()) return <SetupRequired />;

  const db = getDb();
  const items = await db
    .select({ pos: schema.posDeployments, companyName: schema.clients.companyName })
    .from(schema.posDeployments)
    .leftJoin(schema.clients, eq(schema.posDeployments.clientId, schema.clients.id));

  return (
    <OsModuleShell title="POS Management" description="Rkyves POS deployments and hardware" dbConfigured isEmpty={items.length === 0} emptyTitle="No POS deployments">
      <OsTable
        headers={["Client", "Version", "Terminals", "Hardware", "Server"]}
        rows={items.map(({ pos, companyName }) => [
          <Link key="c" href={`/os/clients/${pos.clientId}`} className="hover:text-primary">{companyName}</Link>,
          pos.version || "—",
          String(pos.terminals ?? "—"),
          pos.hardware || "—",
          pos.server || "—",
        ])}
      />
    </OsModuleShell>
  );
}
