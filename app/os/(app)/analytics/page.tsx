import { isDbConfigured } from "@/lib/db";
import { getAnalytics } from "@/lib/os/module-queries";
import { OsModuleShell } from "@/components/os/OsModuleShell";
import { StatCard } from "@/components/os/ui/stats";
import { SetupRequired } from "@/components/os/SetupRequired";
import { formatCurrency } from "@/lib/utils";
import { Users, IndianRupee, TrendingUp, UserPlus, Headphones, RefreshCw } from "lucide-react";

export const metadata = { title: "Analytics — Rkyves OS" };

export default async function AnalyticsPage() {
  if (!isDbConfigured()) return <SetupRequired />;

  const stats = await getAnalytics();
  const arr = stats.mrr * 12;

  return (
    <OsModuleShell title="Analytics" description="Business intelligence for Rkyves" dbConfigured isEmpty={false} emptyTitle="">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue)} icon={IndianRupee} />
        <StatCard title="MRR" value={formatCurrency(stats.mrr)} icon={TrendingUp} subtitle={`ARR ${formatCurrency(arr)}`} />
        <StatCard title="Total Clients" value={stats.totalClients} icon={Users} subtitle={`${stats.activeClients} active`} />
        <StatCard title="Pipeline Value" value={formatCurrency(stats.pipelineValue)} icon={UserPlus} subtitle={`${stats.activeLeads} active leads`} />
        <StatCard title="Outstanding" value={formatCurrency(stats.outstandingPayments)} icon={IndianRupee} subtitle={`${formatCurrency(stats.overduePayments)} overdue`} />
        <StatCard title="Renewal Revenue" value={formatCurrency(stats.upcomingRenewals * 5000)} icon={RefreshCw} subtitle={`${stats.upcomingRenewals} upcoming`} />
        <StatCard title="Open Tickets" value={stats.openTickets} icon={Headphones} />
        <StatCard title="At-Risk Clients" value={stats.atRiskClients} icon={Users} />
        <StatCard title="Active Projects" value={stats.activeProjects} icon={TrendingUp} subtitle={`${stats.pendingTasks} pending tasks`} />
      </div>
    </OsModuleShell>
  );
}
