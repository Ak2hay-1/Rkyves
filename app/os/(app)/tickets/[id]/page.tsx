import Link from "next/link";
import { notFound } from "next/navigation";
import { isDbConfigured } from "@/lib/db";
import { getTicketById } from "@/lib/os/module-queries";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { SetupRequired } from "@/components/os/SetupRequired";
import { TicketActions } from "@/components/os/TicketForm";
import { Badge } from "@/components/os/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/card";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/os/tickets/[id]">) {
  const { id } = await params;
  if (!isDbConfigured()) return { title: "Ticket — Rkyves OS" };
  const data = await getTicketById(id);
  return { title: data ? `${data.ticket.ticketNumber} — Rkyves OS` : "Ticket — Rkyves OS" };
}

export default async function TicketDetailPage({ params }: PageProps<"/os/tickets/[id]">) {
  if (!isDbConfigured()) return <SetupRequired />;

  const { id } = await params;
  const data = await getTicketById(id);
  if (!data) notFound();

  const user = await getSessionUser();
  const canManage = user ? hasPermission(user.role, "support.manage") : false;
  const { ticket, companyName } = data;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href={`/os/clients/${ticket.clientId}?tab=support`} className="text-sm text-muted hover:text-primary">
            ← {companyName}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">{ticket.ticketNumber}: {ticket.subject}</h1>
          <div className="mt-2 flex gap-2">
            <Badge variant={ticket.status === "resolved" || ticket.status === "closed" ? "success" : "info"}>
              {ticket.status.replace("_", " ")}
            </Badge>
            <Badge variant="default">{ticket.priority}</Badge>
            <Badge variant="default">{ticket.category}</Badge>
          </div>
        </div>
        <TicketActions clientId={ticket.clientId} ticket={ticket} canManage={canManage} />
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>Description</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-light whitespace-pre-wrap">{ticket.description}</CardContent>
      </Card>

      {ticket.resolution && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Resolution</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-light whitespace-pre-wrap">{ticket.resolution}</CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3 text-sm">
        <Card><CardContent className="p-4"><p className="text-muted">Created</p><p>{formatDate(ticket.createdAt)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-muted">Resolved</p><p>{formatDate(ticket.resolvedAt)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-muted">Closed</p><p>{formatDate(ticket.closedAt)}</p></CardContent></Card>
      </div>
    </div>
  );
}
