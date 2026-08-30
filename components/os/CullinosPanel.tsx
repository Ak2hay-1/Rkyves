"use client";

import { useState } from "react";

type Props = {
  clientId: string;
  companyName: string;
};

export function CullinosProvisionForm({ clientId, companyName }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function provision(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/os/cullinos/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          planSlug: form.get("planSlug"),
          adminEmail: form.get("adminEmail"),
          adminPassword: form.get("adminPassword"),
          outletName: form.get("outletName") || companyName,
          adminName: form.get("adminName"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Provision failed");
      setMessage(`Tenant provisioned: ${data.provision?.slug}`);
      window.location.reload();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Provision failed");
    } finally {
      setLoading(false);
    }
  }

  async function suspend(tenantId: string) {
    await fetch("/api/os/cullinos/suspend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId }),
    });
    window.location.reload();
  }

  async function reactivate(tenantId: string) {
    await fetch("/api/os/cullinos/reactivate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId }),
    });
    window.location.reload();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={provision} className="grid gap-3 max-w-md">
        <select name="planSlug" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" defaultValue="starter">
          <option value="starter">Starter</option>
          <option value="professional">Professional</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <input name="adminEmail" type="email" placeholder="Admin email" required className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <input name="adminPassword" type="password" placeholder="Admin password (min 8)" required minLength={8} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <input name="outletName" type="text" placeholder="Outlet name" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
        <button type="submit" disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
          {loading ? "Provisioning…" : "Provision Cullinos Tenant"}
        </button>
      </form>
      {message && <p className="text-sm text-muted">{message}</p>}
    </div>
  );
}

export function CullinosTenantActions({ tenantId, status }: { tenantId: string; status: string }) {
  const [loading, setLoading] = useState(false);

  async function action(type: "suspend" | "reactivate") {
    setLoading(true);
    await fetch(`/api/os/cullinos/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId }),
    });
    window.location.reload();
  }

  async function deprovision() {
    if (!confirm("Remove this Cullinos tenant record?")) return;
    setLoading(true);
    await fetch("/api/os/cullinos/deprovision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId }),
    });
    window.location.reload();
  }

  return (
    <div className="flex gap-2">
      {status === "active" ? (
        <button onClick={() => action("suspend")} disabled={loading} className="rounded-lg border border-border px-3 py-1.5 text-sm">
          Suspend
        </button>
      ) : (
        <button onClick={() => action("reactivate")} disabled={loading} className="rounded-lg bg-primary px-3 py-1.5 text-sm text-white">
          Reactivate
        </button>
      )}
      <button onClick={deprovision} disabled={loading} className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-400">
        Deprovision
      </button>
      <a href="https://admin.cullinos.com" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-3 py-1.5 text-sm">
        Open Admin
      </a>
    </div>
  );
}
