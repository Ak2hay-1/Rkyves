import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { isDbConfigured, getDb, schema } from "@/lib/db";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { requirePortalAccess } from "@/lib/portal/auth";
import { Badge } from "@/components/os/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Invoices — Client Portal" };

export default async function PortalInvoicesPage() {
  if (!isDbConfigured()) redirect("/portal");
  const { user, clientId } = await requirePortalAccess();

  const db = getDb();
  const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, clientId)).limit(1);
  const invoices = await db.select().from(schema.invoices).where(eq(schema.invoices.clientId, clientId));

  return (
    <PortalLayout user={user} client={client!} active="invoices">
      <h2 className="mb-4 text-xl font-semibold">Invoices</h2>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-elevated">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted">Invoice</th>
              <th className="px-4 py-3 text-left font-medium text-muted">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted">Due</th>
              <th className="px-4 py-3 text-left font-medium text-muted">PDF</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{inv.invoiceNumber}</td>
                <td className="px-4 py-3">{formatCurrency(Number(inv.total))}</td>
                <td className="px-4 py-3">
                  <Badge variant={inv.status === "paid" ? "success" : inv.status === "overdue" ? "danger" : "default"}>
                    {inv.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(inv.dueDate)}</td>
                <td className="px-4 py-3">
                  <Link href={`/api/os/invoices/${inv.id}/pdf`} target="_blank" className="text-primary hover:underline">
                    Download
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalLayout>
  );
}
