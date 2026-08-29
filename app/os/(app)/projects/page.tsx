import Link from "next/link";
import { isDbConfigured } from "@/lib/db";
import { getProjects } from "@/lib/os/module-queries";
import { OsModuleShell } from "@/components/os/OsModuleShell";
import { Badge } from "@/components/os/ui/badge";
import { ProgressBar } from "@/components/os/ui/stats";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Projects — Rkyves OS" };

export default async function ProjectsPage() {
  const items = isDbConfigured() ? await getProjects() : [];

  return (
    <OsModuleShell title="Projects" description="Track all client projects and progress" dbConfigured={isDbConfigured()} isEmpty={items.length === 0} emptyTitle="No projects">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(({ project, companyName }) => (
          <Link key={project.id} href={`/os/clients/${project.clientId}?tab=projects`} className="rounded-xl border border-border bg-surface-elevated/80 p-5 transition-colors hover:border-primary/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{project.name}</p>
                <p className="text-sm text-muted">{companyName}</p>
              </div>
              <Badge variant={project.status === "completed" ? "success" : project.status === "on_hold" ? "warning" : "info"}>{project.status.replace("_", " ")}</Badge>
            </div>
            <ProgressBar value={project.progress} className="mt-4" />
            <div className="mt-3 flex justify-between text-xs text-muted">
              <span>{project.progress}% complete</span>
              <span>Due {formatDate(project.deadline)}</span>
            </div>
          </Link>
        ))}
      </div>
    </OsModuleShell>
  );
}
