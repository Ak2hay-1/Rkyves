import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { isDbConfigured, getDb, schema } from "@/lib/db";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { requirePortalAccess } from "@/lib/portal/auth";
import { ProgressBar } from "@/components/os/ui/stats";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Projects — Client Portal" };

export default async function PortalProjectsPage() {
  if (!isDbConfigured()) redirect("/portal");
  const { user, clientId } = await requirePortalAccess();

  const db = getDb();
  const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, clientId)).limit(1);
  const projects = await db.select().from(schema.projects).where(eq(schema.projects.clientId, clientId));

  return (
    <PortalLayout user={user} client={client!} active="projects">
      <h2 className="mb-4 text-xl font-semibold">Your Projects</h2>
      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-surface-elevated/80 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm capitalize text-muted">{p.status.replace("_", " ")}</p>
              </div>
              <span className="text-sm font-medium">{p.progress}%</span>
            </div>
            <ProgressBar value={p.progress} className="mt-3" />
            {p.deadline && <p className="mt-2 text-xs text-muted">Deadline: {formatDate(p.deadline)}</p>}
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
