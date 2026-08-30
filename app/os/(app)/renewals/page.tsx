import Link from "next/link";
import { isDbConfigured } from "@/lib/db";
import { getRenewals } from "@/lib/os/module-queries";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { RenewalActions } from "@/components/os/RenewalForm";
import { Badge } from "@/components/os/ui/badge";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";

export const metadata = { title: "Renewals — Rkyves OS" };

export default async function RenewalsPage() {
  const items = isDbConfigured() ? await getRenewals() : [];
  const user = await getSessionUser();
  const canManage = user ? hasPermission(user.role, "finance.manage") : false;

  return (
    <OsModuleShell title="Renewal Center" description="Track and manage all service renewals" dbConfigured={isDbConfigured()} isEmpty={items.length === 0} emptyTitle="No renewals" actions={<RenewalActions canManage={canManage} />}>
      <OsTable
        headers={["Client", "Service", "Renewal Date", "Days Left", "Amount", "Status", ""]}
        rows={items.map(({ renewal, companyName, serviceName }) => {
          const days = daysUntil(renewal.renewalDate);
          return [
            <Link key="c" href={`/os/clients/${renewal.clientId}`} className="hover:text-primary">{companyName}</Link>,
            serviceName || "—",
            formatDate(renewal.renewalDate),
            days !== null ? (
              <Badge key="d" variant={days <= 7 ? "danger" : days <= 30 ? "warning" : "default"}>{days} days</Badge>
            ) : "—",
            formatCurrency(Number(renewal.amount)),
            <Badge key="s" variant={renewal.status === "expired" ? "danger" : renewal.status === "due_soon" ? "warning" : "info"}>{renewal.status.replace("_", " ")}</Badge>,
            <RenewalActions key="a" renewal={renewal} canManage={canManage} />,
          ];
        })}
      />
    </OsModuleShell>
  );
}
