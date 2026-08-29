import Link from "next/link";
import { isDbConfigured } from "@/lib/db";
import { getPayments } from "@/lib/os/module-queries";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Payments — Rkyves OS" };

export default async function PaymentsPage() {
  const items = isDbConfigured() ? await getPayments() : [];

  return (
    <OsModuleShell title="Payments" description="Payment history across all clients" dbConfigured={isDbConfigured()} isEmpty={items.length === 0} emptyTitle="No payments">
      <OsTable
        headers={["Client", "Amount", "Method", "Invoice", "Date", "Reference"]}
        rows={items.map(({ payment, companyName, invoiceNumber }) => [
          <Link key="c" href={`/os/clients/${payment.clientId}?tab=finance`} className="hover:text-primary">{companyName}</Link>,
          <span key="a" className="font-medium text-emerald-400">{formatCurrency(Number(payment.amount))}</span>,
          <span key="m" className="capitalize">{payment.method.replace("_", " ")}</span>,
          invoiceNumber || "—",
          formatDate(payment.paidAt),
          payment.reference || "—",
        ])}
      />
    </OsModuleShell>
  );
}
