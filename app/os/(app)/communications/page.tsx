import Link from "next/link";
import { isDbConfigured, getDb, schema } from "@/lib/db";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { SetupRequired } from "@/components/os/SetupRequired";
import { formatDate } from "@/lib/utils";
import { eq } from "drizzle-orm";

export const metadata = { title: "Communication — Rkyves OS" };

export default async function CommunicationsPage() {
  if (!isDbConfigured()) return <SetupRequired />;

  const db = getDb();
  const items = await db
    .select({ comm: schema.communications, companyName: schema.clients.companyName })
    .from(schema.communications)
    .leftJoin(schema.clients, eq(schema.communications.clientId, schema.clients.id))
    .orderBy(schema.communications.createdAt);

  return (
    <OsModuleShell title="Communication" description="WhatsApp, email, calls, and notes" dbConfigured isEmpty={items.length === 0} emptyTitle="No communications">
      <OsTable
        headers={["Type", "Client", "Subject", "Direction", "Date"]}
        rows={items.map(({ comm, companyName }) => [
          <span key="t" className="capitalize">{comm.type}</span>,
          <Link key="c" href={`/os/clients/${comm.clientId}?tab=timeline`} className="hover:text-primary">{companyName}</Link>,
          comm.subject || comm.content.slice(0, 50) + "...",
          comm.direction || "outbound",
          formatDate(comm.createdAt),
        ])}
      />
    </OsModuleShell>
  );
}
