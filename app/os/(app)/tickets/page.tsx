import Link from "next/link";
import { isDbConfigured } from "@/lib/db";
import { getTickets } from "@/lib/os/module-queries";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { Badge } from "@/components/os/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Tickets — Rkyves OS" };

export default async function TicketsPage() {
  const items = isDbConfigured() ? await getTickets() : [];

  return (
    <OsModuleShell title="Support Tickets" description="Manage client support requests" dbConfigured={isDbConfigured()} isEmpty={items.length === 0} emptyTitle="No tickets">
      <OsTable
        headers={["Ticket #", "Subject", "Client", "Priority", "Category", "Status", "Created"]}
        rows={items.map(({ ticket, companyName }) => [
          <span key="n" className="font-medium">{ticket.ticketNumber}</span>,
          ticket.subject,
          <Link key="c" href={`/os/clients/${ticket.clientId}?tab=support`} className="hover:text-primary">{companyName}</Link>,
          <Badge key="p" variant={ticket.priority === "urgent" || ticket.priority === "high" ? "danger" : "default"}>{ticket.priority}</Badge>,
          <span key="cat" className="capitalize">{ticket.category}</span>,
          <Badge key="s" variant={ticket.status === "closed" || ticket.status === "resolved" ? "success" : "info"}>{ticket.status.replace("_", " ")}</Badge>,
          formatDate(ticket.createdAt),
        ])}
      />
    </OsModuleShell>
  );
}
