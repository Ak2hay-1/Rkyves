import { isDbConfigured, getDb, schema } from "@/lib/db";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { PageHeader } from "@/components/os/ui/stats";
import { SetupRequired } from "@/components/os/SetupRequired";
import { CredentialsVault } from "@/components/os/CredentialsVault";
import { CredentialsActions } from "@/components/os/CredentialsForm";

export const metadata = { title: "Credentials Vault — Rkyves OS" };

export default async function CredentialsPage() {
  if (!isDbConfigured()) return <SetupRequired />;

  const db = getDb();
  const credentials = await db.select().from(schema.credentials);
  const clients = await db.select({ id: schema.clients.id, name: schema.clients.companyName }).from(schema.clients);
  const clientMap = Object.fromEntries(clients.map((c) => [c.id, c.name]));
  const user = await getSessionUser();
  const canManage = user ? hasPermission(user.role, "credentials.manage") : false;

  return (
    <div>
      <PageHeader
        title="Credentials Vault"
        description="Securely stored client infrastructure credentials. All access is audited."
        actions={canManage && clients[0] ? <CredentialsActions clientId={clients[0].id} canManage={canManage} /> : undefined}
      />
      <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-400">
        Credentials are encrypted at rest with AES-256-GCM. Add credentials from a client&apos;s Infrastructure tab or below.
      </div>
      {credentials.length === 0 ? (
        <p className="text-muted">No credentials stored yet.</p>
      ) : (
        <CredentialsVault credentials={credentials.map((c) => ({
          id: c.id,
          clientId: c.clientId,
          name: c.name,
          category: c.category,
          username: c.username,
          url: c.url,
          hasPassword: Boolean(c.encryptedPassword),
        }))} clients={clientMap} canManage={canManage} />
      )}
    </div>
  );
}
