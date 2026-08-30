import Link from "next/link";
import { isDbConfigured } from "@/lib/db";
import { getServices } from "@/lib/os/module-queries";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { ServiceActions } from "@/components/os/ServiceForm";
import { Badge } from "@/components/os/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Services — Rkyves OS" };

export default async function ServicesPage() {
  const items = isDbConfigured() ? await getServices() : [];
  const user = await getSessionUser();
  const canManage = user ? hasPermission(user.role, "clients.edit") : false;

  return (
    <OsModuleShell title="Services" description="All client services across Rkyves" dbConfigured={isDbConfigured()} isEmpty={items.length === 0} emptyTitle="No services" actions={<p className="text-sm text-muted">Add services from a client&apos;s Services tab</p>}>
      <OsTable
        headers={["Service", "Client", "Type", "Plan", "Price", "Status", "Expiry", ""]}
        rows={items.map(({ service, companyName }) => [
          <span key="n" className="font-medium">{service.name}</span>,
          <Link key="c" href={`/os/clients/${service.clientId}`} className="hover:text-primary">{companyName}</Link>,
          <span key="t" className="capitalize">{service.type.replace("_", " ")}</span>,
          service.plan || "—",
          formatCurrency(Number(service.price)),
          <Badge key="s" variant={service.status === "active" ? "success" : service.status === "expired" ? "danger" : "warning"}>{service.status}</Badge>,
          formatDate(service.expiryDate),
          <ServiceActions key="a" clientId={service.clientId} service={service} canManage={canManage} />,
        ])}
      />
    </OsModuleShell>
  );
}
