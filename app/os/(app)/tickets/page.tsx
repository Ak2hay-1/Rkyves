import Link from "next/link";
import { isDbConfigured } from "@/lib/db";
import { getTickets } from "@/lib/os/module-queries";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { TicketActions } from "@/components/os/TicketForm";
import { Badge } from "@/components/os/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Tickets — Rkyves OS" };

export default async function TicketsPage() {
  const items = isDbConfigured() ? await getTickets() : [];
  const user = await getSessionUser();
  const canManage = user ? hasPermission(user.role, "support.manage") : false;

  return (
    <OsModuleShell title="Support Tickets" description="Manage client support requests" dbConfigured={isDbConfigured()} isEmpty={items.length === 0} emptyTitle="No tickets" actions={<TicketActions canManage={canManage} />}>
      <OsTable
        headers={["Ticket #", "Subject", "Client", "Priority", "Category", "Status", "Created"]}
        rows={items.map(({ ticket, companyName }) => [
          <Link key="n" href={`/os/tickets/${ticket.id}`} className="font-medium hover:text-primary">{ticket.ticketNumber}</Link>,
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
