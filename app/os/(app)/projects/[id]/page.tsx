import Link from "next/link";
import { notFound } from "next/navigation";
import { isDbConfigured } from "@/lib/db";
import { getProjectById } from "@/lib/os/module-queries";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { SetupRequired } from "@/components/os/SetupRequired";
import { ProjectActions } from "@/components/os/ProjectForm";
import { TaskActions } from "@/components/os/TaskForm";
import { Badge } from "@/components/os/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/card";
import { ProgressBar } from "@/components/os/ui/stats";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/os/projects/[id]">) {
  const { id } = await params;
  if (!isDbConfigured()) return { title: "Project — Rkyves OS" };
  const data = await getProjectById(id);
  return { title: data ? `${data.project.name} — Rkyves OS` : "Project — Rkyves OS" };
}

export default async function ProjectDetailPage({ params }: PageProps<"/os/projects/[id]">) {
  if (!isDbConfigured()) return <SetupRequired />;

  const { id } = await params;
  const data = await getProjectById(id);
  if (!data) notFound();

  const user = await getSessionUser();
  const canManage = user ? hasPermission(user.role, "projects.manage") : false;
  const { project, companyName, tasks } = data;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href={`/os/clients/${project.clientId}?tab=projects`} className="text-sm text-muted hover:text-primary">
            ← {companyName}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold">{project.name}</h1>
          <p className="text-sm text-muted capitalize">{project.status.replace("_", " ")} · {project.priority} priority</p>
        </div>
        <ProjectActions clientId={project.clientId} project={project} canManage={canManage} />
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted">Progress</p>
            <ProgressBar value={project.progress} className="mt-2" />
            <p className="mt-1 text-sm">{project.progress}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted">Start Date</p>
            <p className="font-medium">{formatDate(project.startDate)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted">Deadline</p>
            <p className="font-medium">{formatDate(project.deadline)}</p>
          </CardContent>
        </Card>
      </div>

      {project.description && (
        <Card className="mb-8">
          <CardContent className="p-5 text-sm text-muted-light">{project.description}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Tasks</CardTitle>
          <TaskActions projectId={project.id} canManage={canManage} />
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.length === 0 && <p className="text-sm text-muted">No tasks yet.</p>}
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-muted">Due {formatDate(task.dueDate)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={task.status === "completed" ? "success" : "info"}>{task.status.replace("_", " ")}</Badge>
                <TaskActions projectId={project.id} task={task} canManage={canManage} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
