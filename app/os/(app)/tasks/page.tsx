import Link from "next/link";
import { isDbConfigured } from "@/lib/db";
import { getTasks } from "@/lib/os/module-queries";
import { OsModuleShell, OsTable } from "@/components/os/OsModuleShell";
import { Badge } from "@/components/os/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Tasks — Rkyves OS" };

export default async function TasksPage() {
  const items = isDbConfigured() ? await getTasks() : [];

  return (
    <OsModuleShell title="Tasks" description="All pending project tasks" dbConfigured={isDbConfigured()} isEmpty={items.length === 0} emptyTitle="No pending tasks">
      <OsTable
        headers={["Task", "Project", "Client", "Status", "Priority", "Due"]}
        rows={items.map(({ task, projectName, companyName }) => [
          <span key="t" className="font-medium">{task.title}</span>,
          projectName || "—",
          <Link key="c" href={`/os/clients/${task.projectId}`} className="hover:text-primary">{companyName}</Link>,
          <Badge key="s" variant={task.status === "completed" ? "success" : task.status === "in_progress" ? "info" : "default"}>{task.status.replace("_", " ")}</Badge>,
          <span key="p" className="capitalize">{task.priority}</span>,
          formatDate(task.dueDate),
        ])}
      />
    </OsModuleShell>
  );
}
