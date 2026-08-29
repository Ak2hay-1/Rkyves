import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { isDbConfigured, getDb, schema } from "@/lib/db";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { requirePortalAccess } from "@/lib/portal/auth";
import { Badge } from "@/components/os/ui/badge";
import { PortalTicketForm } from "@/components/portal/PortalTicketForm";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Support — Client Portal" };

export default async function PortalTicketsPage() {
  if (!isDbConfigured()) redirect("/portal");
  const { user, clientId } = await requirePortalAccess();

  const db = getDb();
  const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, clientId)).limit(1);
  const tickets = await db
    .select()
    .from(schema.tickets)
    .where(eq(schema.tickets.clientId, clientId))
    .orderBy(desc(schema.tickets.createdAt));

  return (
    <PortalLayout user={user} client={client!} active="tickets">
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Raise a Ticket</h2>
        <PortalTicketForm clientId={clientId} />
      </div>
      <h2 className="mb-4 text-xl font-semibold">Your Tickets</h2>
      <div className="space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className="rounded-xl border border-border bg-surface-elevated/80 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t.ticketNumber}: {t.subject}</p>
                <p className="text-xs text-muted">{formatDate(t.createdAt)}</p>
              </div>
              <Badge variant={t.status === "resolved" || t.status === "closed" ? "success" : "info"}>
                {t.status.replace("_", " ")}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
