import Link from "next/link";
import { eq, desc } from "drizzle-orm";
import { isDbConfigured, getDb, schema } from "@/lib/db";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { requirePortalAccess } from "@/lib/portal/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Client Portal — Rkyves" };

export default async function PortalPage() {
  if (!isDbConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-xl font-semibold">Portal unavailable</h1>
          <p className="mt-2 text-muted">Database is not configured yet.</p>
          <Link href="/" className="mt-4 inline-block text-primary hover:underline">← Back to website</Link>
        </div>
      </div>
    );
  }

  const { user, clientId } = await requirePortalAccess();

  const db = getDb();
  const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, clientId)).limit(1);
  const services = await db.select().from(schema.services).where(eq(schema.services.clientId, clientId)).limit(3);
  const projects = await db.select().from(schema.projects).where(eq(schema.projects.clientId, clientId)).limit(3);
  const invoices = await db.select().from(schema.invoices).where(eq(schema.invoices.clientId, clientId)).orderBy(desc(schema.invoices.createdAt)).limit(3);
  const tickets = await db.select().from(schema.tickets).where(eq(schema.tickets.clientId, clientId)).limit(3);

  const outstanding = invoices.reduce((s, i) => s + (Number(i.total) - Number(i.amountPaid)), 0);

  return (
    <PortalLayout user={user} client={client!} active="home">
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Active Services</p>
            <p className="text-2xl font-semibold">{services.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Active Projects</p>
            <p className="text-2xl font-semibold">{projects.filter((p) => p.status !== "completed").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted">Outstanding</p>
            <p className="text-2xl font-semibold">{formatCurrency(outstanding)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent Invoices</CardTitle></CardHeader>
          <CardContent>
            {invoices.map((inv) => (
              <div key={inv.id} className="flex justify-between border-b border-border py-2 last:border-0 text-sm">
                <span>{inv.invoiceNumber}</span>
                <span>{formatCurrency(Number(inv.total))}</span>
              </div>
            ))}
            <Link href="/portal/invoices" className="mt-3 block text-sm text-primary hover:underline">View all invoices →</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Support Tickets</CardTitle></CardHeader>
          <CardContent>
            {tickets.map((t) => (
              <div key={t.id} className="border-b border-border py-2 last:border-0 text-sm">
                <p className="font-medium">{t.subject}</p>
                <p className="text-xs text-muted capitalize">{t.status.replace("_", " ")} · {formatDate(t.createdAt)}</p>
              </div>
            ))}
            <Link href="/portal/tickets" className="mt-3 block text-sm text-primary hover:underline">Raise a ticket →</Link>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
