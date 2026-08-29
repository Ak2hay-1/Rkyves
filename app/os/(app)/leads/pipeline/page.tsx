import { isDbConfigured } from "@/lib/db";
import { getLeads } from "@/lib/os/module-queries";
import { OsModuleShell } from "@/components/os/OsModuleShell";
import { Badge } from "@/components/os/ui/badge";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Pipeline — Rkyves OS" };

const pipelineStages = ["lead", "contacted", "requirement", "proposal", "negotiation", "won", "lost"] as const;

export default async function PipelinePage() {
  const leads = isDbConfigured() ? await getLeads() : [];

  const columns = pipelineStages.map((stage) => ({
    stage,
    leads: leads.filter((l) => l.stage === stage),
    value: leads.filter((l) => l.stage === stage).reduce((s, l) => s + Number(l.expectedValue || 0), 0),
  }));

  return (
    <OsModuleShell
      title="Sales Pipeline"
      description="Visual pipeline from lead to close"
      dbConfigured={isDbConfigured()}
      isEmpty={leads.length === 0}
      emptyTitle="No pipeline data"
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.filter((c) => c.stage !== "lost").map((col) => (
          <div key={col.stage} className="min-w-[220px] flex-1 rounded-xl border border-border bg-surface-elevated/50">
            <div className="border-b border-border p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{col.stage.replace("_", " ")}</span>
                <Badge variant="default">{col.leads.length}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted">{formatCurrency(col.value)}</p>
            </div>
            <div className="space-y-2 p-3">
              {col.leads.map((l) => (
                <div key={l.id} className="rounded-lg border border-border bg-surface p-3">
                  <p className="text-sm font-medium">{l.name}</p>
                  <p className="text-xs text-muted">{l.company}</p>
                  <p className="mt-1 text-xs text-primary">{formatCurrency(Number(l.expectedValue || 0))}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </OsModuleShell>
  );
}
