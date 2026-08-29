import Link from "next/link";
import { isDbConfigured } from "@/lib/db";
import { getServices } from "@/lib/os/module-queries";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { Badge } from "@/components/os/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Services — Rkyves OS" };

export default async function ServicesPage() {
  const items = isDbConfigured() ? await getServices() : [];

  return (
    <OsModuleShell title="Services" description="All client services across Rkyves" dbConfigured={isDbConfigured()} isEmpty={items.length === 0} emptyTitle="No services">
      <OsTable
        headers={["Service", "Client", "Type", "Plan", "Price", "Status", "Expiry"]}
        rows={items.map(({ service, companyName }) => [
          <span key="n" className="font-medium">{service.name}</span>,
          <Link key="c" href={`/os/clients/${service.clientId}`} className="hover:text-primary">{companyName}</Link>,
          <span key="t" className="capitalize">{service.type.replace("_", " ")}</span>,
          service.plan || "—",
          formatCurrency(Number(service.price)),
          <Badge key="s" variant={service.status === "active" ? "success" : service.status === "expired" ? "danger" : "warning"}>{service.status}</Badge>,
          formatDate(service.expiryDate),
        ])}
      />
    </OsModuleShell>
  );
}
