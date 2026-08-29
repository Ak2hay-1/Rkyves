import { redirect, notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { isDbConfigured, getDb, schema } from "@/lib/db";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { requirePortalAccess } from "@/lib/portal/auth";

export const metadata = { title: "Services — Client Portal" };

export default async function PortalServicesPage() {
  if (!isDbConfigured()) redirect("/portal");

  const { user, clientId } = await requirePortalAccess();

  const db = getDb();
  const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, clientId)).limit(1);
  const services = await db.select().from(schema.services).where(eq(schema.services.clientId, clientId));

  return (
    <PortalLayout user={user} client={client!} active="services">
      <h2 className="mb-4 text-xl font-semibold">Your Services</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((s) => (
          <div key={s.id} className="rounded-xl border border-border bg-surface-elevated/80 p-5">
            <p className="font-medium">{s.name}</p>
            <p className="text-sm capitalize text-muted">{s.type.replace("_", " ")} · {s.status}</p>
            {s.plan && <p className="mt-2 text-sm text-muted">Plan: {s.plan}</p>}
            {s.type === "cullinos" && (
              <a href="https://admin.cullinos.com" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-primary hover:underline">
                Open Cullinos Admin →
              </a>
            )}
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
