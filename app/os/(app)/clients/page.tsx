import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { isDbConfigured } from "@/lib/db";
import { getClients } from "@/lib/os/queries";
import { PageHeader, EmptyState } from "@/components/os/ui/stats";
import { Badge } from "@/components/os/ui/badge";
import { Button } from "@/components/os/ui/button";
import { SetupRequired } from "@/components/os/SetupRequired";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Clients — Rkyves OS" };

const statusVariant: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  active: "success",
  inactive: "default",
  at_risk: "danger",
  churned: "danger",
  lead: "info",
};

export default async function ClientsPage({
  searchParams,
}: PageProps<"/os/clients">) {
  if (!isDbConfigured()) return <SetupRequired />;

  const params = await searchParams;
  const search = typeof params.q === "string" ? params.q : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const clients = await getClients(search, status);

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Manage all Rkyves clients in one place"
        actions={
          <Link href="/os/clients/new">
            <Button>
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <form className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={search}
            placeholder="Search clients..."
            className="h-10 w-full rounded-lg border border-border bg-surface pl-10 pr-4 text-sm"
          />
        </form>
        <div className="flex gap-2">
          {["all", "active", "at_risk", "inactive"].map((s) => (
            <Link
              key={s}
              href={`/os/clients${s === "all" ? "" : `?status=${s}`}`}
              className={`rounded-lg px-3 py-2 text-sm capitalize ${
                (status || "all") === s
                  ? "bg-primary/15 text-primary"
                  : "text-muted hover:bg-white/5"
              }`}
            >
              {s.replace("_", " ")}
            </Link>
          ))}
        </div>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          title="No clients found"
          description="Add your first client to get started."
          action={
            <Link href="/os/clients/new">
              <Button>Add Client</Button>
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface-elevated">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted">Company</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Contact</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Industry</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Health</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Updated</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-border last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/os/clients/${client.id}`}
                      className="font-medium hover:text-primary"
                    >
                      {client.companyName}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div>{client.contactPerson}</div>
                    <div className="text-xs text-muted">{client.email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted">{client.industry || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[client.status] || "default"}>
                      {client.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${client.healthScore ?? 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted">{client.healthScore ?? 100}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(client.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
