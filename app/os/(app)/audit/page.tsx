import { isDbConfigured } from "@/lib/db";
import { getAuditLogs } from "@/lib/os/module-queries";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { SetupRequired } from "@/components/os/SetupRequired";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Audit Logs — Rkyves OS" };

export default async function AuditPage() {
  if (!isDbConfigured()) return <SetupRequired />;

  const logs = await getAuditLogs();

  return (
    <OsModuleShell title="Audit Logs" description="Track all important system actions" dbConfigured isEmpty={logs.length === 0} emptyTitle="No audit logs">
      <OsTable
        headers={["User", "Action", "Entity", "IP", "Timestamp"]}
        rows={logs.map(({ log, userName }) => [
          userName || "System",
          <span key="a" className="font-medium">{log.action}</span>,
          `${log.entityType}${log.entityId ? ` · ${log.entityId.slice(0, 8)}` : ""}`,
          log.ipAddress || "—",
          formatDate(log.createdAt),
        ])}
      />
    </OsModuleShell>
  );
}
