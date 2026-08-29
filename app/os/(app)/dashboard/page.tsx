import {
  Users,
  FolderKanban,
  CheckSquare,
  Headphones,
  IndianRupee,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  UserPlus,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isDbConfigured } from "@/lib/db";
import {
  getDashboardStats,
  getDashboardAlerts,
  getRecentActivities,
  getRecentPayments,
  getRecentLeads,
} from "@/lib/os/queries";
import { StatCard } from "@/components/os/ui/stats";
import { PageHeader } from "@/components/os/ui/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/card";
import { Badge } from "@/components/os/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SetupRequired } from "@/components/os/SetupRequired";

export const metadata = { title: "Dashboard — Rkyves OS" };

export default async function DashboardPage() {
  if (!isDbConfigured()) {
    return <SetupRequired />;
  }

  const [stats, alerts, activities, payments, leads] = await Promise.all([
    getDashboardStats(),
    getDashboardAlerts(),
    getRecentActivities(),
    getRecentPayments(),
    getRecentLeads(),
  ]);

  const alertCount =
    alerts.overdueInvoices.length +
    alerts.upcomingRenewals.length +
    alerts.highTickets.length +
    alerts.expiringDomains.length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your entire client ecosystem"
      />

      {alertCount > 0 && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">{alertCount} items need attention</span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {alerts.overdueInvoices.slice(0, 2).map((inv) => (
              <Link
                key={inv.id}
                href={`/os/invoices`}
                className="rounded-lg bg-surface px-3 py-2 text-sm hover:bg-white/5"
              >
                <span className="text-red-400">Overdue:</span> {inv.invoiceNumber}
              </Link>
            ))}
            {alerts.upcomingRenewals.slice(0, 2).map((r) => (
              <Link
                key={r.id}
                href="/os/renewals"
                className="rounded-lg bg-surface px-3 py-2 text-sm hover:bg-white/5"
              >
                <span className="text-amber-400">Renewal:</span> {formatDate(r.renewalDate)}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Clients" value={stats.totalClients} icon={Users} subtitle={`${stats.activeClients} active`} />
        <StatCard title="Active Projects" value={stats.activeProjects} icon={FolderKanban} subtitle={`${stats.pendingTasks} pending tasks`} />
        <StatCard title="Open Tickets" value={stats.openTickets} icon={Headphones} subtitle={`${stats.highPriorityTickets} high priority`} />
        <StatCard title="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue)} icon={IndianRupee} subtitle={`MRR ${formatCurrency(stats.mrr)}`} />
        <StatCard title="Outstanding" value={formatCurrency(stats.outstandingPayments)} icon={TrendingUp} subtitle={`${formatCurrency(stats.overduePayments)} overdue`} trend={{ value: `${stats.newClients} new clients this month`, positive: true }} />
        <StatCard title="Upcoming Renewals" value={stats.upcomingRenewals} icon={RefreshCw} subtitle={`${stats.expiredServices} expired`} />
        <StatCard title="Active Leads" value={stats.activeLeads} icon={UserPlus} subtitle={`Pipeline ${formatCurrency(stats.pipelineValue)}`} />
        <StatCard title="At-Risk Clients" value={stats.atRiskClients} icon={AlertTriangle} subtitle="Needs attention" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-sm text-muted">No recent activity</p>
            ) : (
              <ul className="space-y-4">
                {activities.map((a) => (
                  <li key={a.id} className="flex items-start gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted">
                        {a.companyName && (
                          <Link href={`/os/clients/${a.clientId}`} className="hover:text-primary">
                            {a.companyName}
                          </Link>
                        )}
                        {" · "}
                        {formatDate(a.createdAt)}
                      </p>
                    </div>
                    <Badge variant="purple">{a.type.replace("_", " ")}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {payments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{p.companyName}</p>
                      <p className="text-xs text-muted">{formatDate(p.paidAt)}</p>
                    </div>
                    <span className="font-medium text-emerald-400">{formatCurrency(Number(p.amount))}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {leads.map((l) => (
                  <li key={l.id} className="text-sm">
                    <Link href="/os/leads" className="font-medium hover:text-primary">
                      {l.name}
                    </Link>
                    <p className="text-xs text-muted">{l.company || l.email} · {l.stage}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
