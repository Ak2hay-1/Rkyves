"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/os/ui/button";
import { Badge } from "@/components/os/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

type Lead = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  stage: string;
  expectedValue: string | null;
  probability: number | null;
  followUpDate: Date | null;
  requirement: string | null;
  convertedClientId: string | null;
};

export function LeadActions({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function convertToClient() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/os/leads/${lead.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ createProject: true, createPortalAccess: !!lead.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Conversion failed");
        return;
      }
      router.push(`/os/clients/${data.client.id}`);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function updateStage(stage: string) {
    await fetch(`/api/os/leads/${lead.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    router.refresh();
  }

  if (lead.convertedClientId) {
    return (
      <Link href={`/os/clients/${lead.convertedClientId}`}>
        <Button variant="secondary" size="sm">View Client</Button>
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {lead.stage !== "won" && lead.stage !== "lost" && (
          <>
            <Button size="sm" onClick={convertToClient} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
              Convert to Client
            </Button>
            {["contacted", "requirement", "proposal", "negotiation"]
              .filter((s) => lead.stage !== s)
              .map((s) => (
                <Button key={s} size="sm" variant="ghost" onClick={() => updateStage(s)} className="capitalize">
                  → {s}
                </Button>
              ))}
            <Button size="sm" variant="destructive" onClick={() => updateStage("lost")}>
              Mark Lost
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="rounded-xl border border-border bg-surface-elevated/80 p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{lead.name}</h3>
          <p className="text-sm text-muted">{lead.company || lead.email}</p>
        </div>
        <Badge variant={lead.stage === "won" ? "success" : lead.stage === "lost" ? "danger" : "info"}>
          {lead.stage}
        </Badge>
      </div>
      {lead.requirement && (
        <p className="mt-3 text-sm text-muted-light line-clamp-2">{lead.requirement}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <span>{formatCurrency(Number(lead.expectedValue || 0))}</span>
        <span className="text-muted">{lead.probability ?? 0}% probability</span>
        {lead.followUpDate && (
          <span className="text-muted">Follow-up: {formatDate(lead.followUpDate)}</span>
        )}
      </div>
      <div className="mt-4">
        <LeadActions lead={lead} />
      </div>
    </div>
  );
}
