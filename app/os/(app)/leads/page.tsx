import { isDbConfigured } from "@/lib/db";
import { getLeads } from "@/lib/os/module-queries";
import { OsModuleShell } from "@/components/os/OsModuleShell";
import { LeadCard } from "@/components/os/LeadActions";
import { SetupRequired } from "@/components/os/SetupRequired";

export const metadata = { title: "Leads — Rkyves OS" };

const stages = ["all", "lead", "contacted", "requirement", "proposal", "negotiation", "won", "lost"];

export default async function LeadsPage({ searchParams }: PageProps<"/os/leads">) {
  if (!isDbConfigured()) return <SetupRequired />;

  const params = await searchParams;
  const stage = typeof params.stage === "string" ? params.stage : "all";
  const leads = await getLeads(stage);

  return (
    <OsModuleShell
      title="Leads"
      description="Track prospects through your sales pipeline"
      dbConfigured
      isEmpty={leads.length === 0}
      emptyTitle="No leads yet"
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {stages.map((s) => (
          <a
            key={s}
            href={`/os/leads${s === "all" ? "" : `?stage=${s}`}`}
            className={`rounded-lg px-3 py-1.5 text-sm capitalize ${stage === s ? "bg-primary/15 text-primary" : "text-muted hover:bg-white/5"}`}
          >
            {s}
          </a>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </OsModuleShell>
  );
}
