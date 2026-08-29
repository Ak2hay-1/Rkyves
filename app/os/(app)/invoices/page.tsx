import Link from "next/link";
import { isDbConfigured } from "@/lib/db";
import { getInvoices } from "@/lib/os/module-queries";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { Badge } from "@/components/os/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Invoices — Rkyves OS" };

export default async function InvoicesPage({ searchParams }: PageProps<"/os/invoices">) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "all";
  const items = isDbConfigured() ? await getInvoices(status) : [];

  return (
    <OsModuleShell title="Invoices" description="Manage billing and invoices" dbConfigured={isDbConfigured()} isEmpty={items.length === 0} emptyTitle="No invoices">
      <div className="mb-4 flex gap-2">
        {["all", "outstanding", "paid", "overdue", "draft"].map((s) => (
          <Link key={s} href={`/os/invoices${s === "all" ? "" : `?status=${s}`}`} className={`rounded-lg px-3 py-1.5 text-sm capitalize ${status === s ? "bg-primary/15 text-primary" : "text-muted hover:bg-white/5"}`}>{s}</Link>
        ))}
      </div>
      <OsTable
        headers={["Invoice #", "Client", "Total", "Paid", "Status", "Due Date"]}
        rows={items.map(({ invoice, companyName }) => [
          <Link key="n" href={`/os/invoices/${invoice.id}`} className="font-medium hover:text-primary">{invoice.invoiceNumber}</Link>,
          <Link key="c" href={`/os/clients/${invoice.clientId}?tab=finance`} className="hover:text-primary">{companyName}</Link>,
          formatCurrency(Number(invoice.total)),
          formatCurrency(Number(invoice.amountPaid)),
          <Badge key="s" variant={invoice.status === "paid" ? "success" : invoice.status === "overdue" ? "danger" : "default"}>{invoice.status.replace("_", " ")}</Badge>,
          formatDate(invoice.dueDate),
        ])}
      />
    </OsModuleShell>
  );
}
