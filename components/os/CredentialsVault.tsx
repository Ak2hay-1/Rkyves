"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/os/ui/button";
import { Badge } from "@/components/os/ui/badge";

import { CredentialsActions } from "@/components/os/CredentialsForm";

type Credential = {
  id: string;
  clientId: string;
  name: string;
  category: string;
  username: string | null;
  url: string | null;
  hasPassword: boolean;
};

export function CredentialsVault({ credentials, clients, canManage = false }: { credentials: Credential[]; clients: Record<string, string>; canManage?: boolean }) {
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  async function revealPassword(id: string) {
    if (revealed[id]) {
      setRevealed((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    setLoading(id);
    try {
      const res = await fetch(`/api/os/credentials/${id}?reveal=true`);
      const data = await res.json();
      if (res.ok) {
        setRevealed((prev) => ({ ...prev, [id]: data.credential.password }));
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      {credentials.map((c) => (
        <div key={c.id} className="rounded-xl border border-border bg-surface-elevated/80 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-muted">
                  <Link href={`/os/clients/${c.clientId}`} className="hover:text-primary">
                    {clients[c.clientId] || "Client"}
                  </Link>
                  {" · "}
                  <span className="capitalize">{c.category}</span>
                </p>
                {c.username && <p className="mt-1 text-sm">User: {c.username}</p>}
                {c.url && (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-primary hover:underline">
                    {c.url}
                  </a>
                )}
                {revealed[c.id] && (
                  <p className="mt-2 rounded bg-surface px-2 py-1 font-mono text-sm text-amber-400">
                    {revealed[c.id]}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="purple"><Lock className="mr-1 h-3 w-3" />Encrypted</Badge>
              {canManage && <CredentialsActions clientId={c.clientId} credential={c} canManage={canManage} />}
              {c.hasPassword && (
                <Button size="sm" variant="secondary" onClick={() => revealPassword(c.id)} disabled={loading === c.id}>
                  {loading === c.id ? "..." : revealed[c.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
