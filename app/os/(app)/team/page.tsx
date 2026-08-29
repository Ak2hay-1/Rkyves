import { isDbConfigured } from "@/lib/db";
import { getTeam } from "@/lib/os/module-queries";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { SetupRequired } from "@/components/os/SetupRequired";
import { Badge } from "@/components/os/ui/badge";
import { ROLE_LABELS } from "@/lib/os/auth/rbac";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Team — Rkyves OS" };

export default async function TeamPage() {
  if (!isDbConfigured()) return <SetupRequired />;

  const team = await getTeam();

  return (
    <OsModuleShell title="Team" description="Manage Rkyves team members and roles" dbConfigured isEmpty={team.length === 0} emptyTitle="No team members">
      <OsTable
        headers={["Name", "Email", "Role", "Phone", "Status", "Last Login"]}
        rows={team.map((u) => [
          <span key="n" className="font-medium">{u.name}</span>,
          u.email,
          <Badge key="r" variant="purple">{ROLE_LABELS[u.role]}</Badge>,
          u.phone || "—",
          <Badge key="s" variant={u.isActive ? "success" : "danger"}>{u.isActive ? "Active" : "Inactive"}</Badge>,
          formatDate(u.lastLoginAt),
        ])}
      />
    </OsModuleShell>
  );
}
