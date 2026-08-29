import Link from "next/link";
import { isDbConfigured } from "@/lib/db";
import { getWebsites } from "@/lib/os/module-queries";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { Badge } from "@/components/os/ui/badge";
import { formatDate, daysUntil } from "@/lib/utils";

export const metadata = { title: "Websites — Rkyves OS" };

export default async function WebsitesPage() {
  const items = isDbConfigured() ? await getWebsites() : [];

  return (
    <OsModuleShell title="Website Management" description="Monitor all client websites and infrastructure" dbConfigured={isDbConfigured()} isEmpty={items.length === 0} emptyTitle="No websites">
      <OsTable
        headers={["Website", "Client", "Domain", "Hosting", "Status", "SSL Expiry", "Domain Expiry"]}
        rows={items.map(({ website, companyName }) => [
          <span key="n" className="font-medium">{website.name}</span>,
          <Link key="c" href={`/os/clients/${website.clientId}?tab=infrastructure`} className="hover:text-primary">{companyName}</Link>,
          website.domain || "—",
          website.hosting || "—",
          <Badge key="s" variant={website.status === "online" ? "success" : website.status === "offline" ? "danger" : "warning"}>{website.status}</Badge>,
          <>
            {formatDate(website.sslExpiry)}
            {daysUntil(website.sslExpiry) !== null && daysUntil(website.sslExpiry)! <= 30 && (
              <Badge variant="warning" className="ml-2">Soon</Badge>
            )}
          </>,
          formatDate(website.domainExpiry),
        ])}
      />
    </OsModuleShell>
  );
}
