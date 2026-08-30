import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  IndianRupee,
  Briefcase,
  FolderKanban,
  Headphones,
  RefreshCw,
  FileText,
  Activity,
  MessageSquare,
  Server,
  AlertTriangle,
} from "lucide-react";
import { isDbConfigured } from "@/lib/db";
import { getClient360 } from "@/lib/os/queries";
import { Badge } from "@/components/os/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/card";
import { ProgressBar } from "@/components/os/ui/stats";
import { SetupRequired } from "@/components/os/SetupRequired";
import { CullinosProvisionForm, CullinosTenantActions } from "@/components/os/CullinosPanel";
import { ClientEditDelete } from "@/components/os/ClientEditDelete";
import { ProjectActions } from "@/components/os/ProjectForm";
import { ServiceActions } from "@/components/os/ServiceForm";
import { InvoiceActions } from "@/components/os/InvoiceForm";
import { PaymentActions } from "@/components/os/PaymentForm";
import { TicketActions } from "@/components/os/TicketForm";
import { CredentialsActions } from "@/components/os/CredentialsForm";
import { DocumentDeleteButton } from "@/components/os/DocumentDeleteButton";
import { RenewalActions } from "@/components/os/RenewalForm";
import { CommunicationFormButton } from "@/components/os/CommunicationForm";
import { WebsiteActions } from "@/components/os/InfraForm";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/os/clients/[id]">) {
  const { id } = await params;
  if (!isDbConfigured()) return { title: "Client — Rkyves OS" };
  const data = await getClient360(id);
  return { title: data ? `${data.client.companyName} — Client 360` : "Client — Rkyves OS" };
}

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "finance", label: "Finance" },
  { id: "support", label: "Support" },
  { id: "timeline", label: "Timeline" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "cullinos", label: "Cullinos" },
  { id: "documents", label: "Documents" },
];

export default async function Client360Page({
  params,
  searchParams,
}: PageProps<"/os/clients/[id]">) {
  if (!isDbConfigured()) return <SetupRequired />;

  const { id } = await params;
  const sp = await searchParams;
  const activeTab = typeof sp.tab === "string" ? sp.tab : "overview";

  const data = await getClient360(id);
  if (!data) notFound();

  const user = await getSessionUser();
  const perms = {
    editClient: user ? hasPermission(user.role, "clients.edit") : false,
    deleteClient: user ? hasPermission(user.role, "clients.delete") : false,
    manageProjects: user ? hasPermission(user.role, "projects.manage") : false,
    editServices: user ? hasPermission(user.role, "clients.edit") : false,
    manageFinance: user ? hasPermission(user.role, "finance.manage") : false,
    manageSupport: user ? hasPermission(user.role, "support.manage") : false,
    manageCredentials: user ? hasPermission(user.role, "credentials.manage") : false,
    manageDocuments: user ? hasPermission(user.role, "documents.manage") : false,
    manageInfra: user ? hasPermission(user.role, "infrastructure.manage") : false,
    manageComms: user ? hasPermission(user.role, "communications.manage") : false,
  };

  const { client, services, projects, invoices, payments, tickets, activities, documents, renewals, websites, communications, cullinosTenants, saasSubscriptions, financials, summary } = data;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 rounded-xl border border-border bg-surface-elevated/80 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold">{client.companyName}</h1>
                <Badge variant={client.status === "active" ? "success" : client.status === "at_risk" ? "danger" : "default"}>
                  {client.status.replace("_", " ")}
                </Badge>
                {client.healthScore !== null && client.healthScore < 70 && (
                  <Badge variant="warning">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    At risk
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-muted">{client.contactPerson} · {client.industry}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-light">
                {client.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" /> {client.email}
                  </span>
                )}
                {client.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" /> {client.phone}
                  </span>
                )}
                {client.city && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {[client.city, client.state].filter(Boolean).join(", ")}
                  </span>
                )}
                {client.website && (
                  <a href={client.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary">
                    <Globe className="h-4 w-4" /> Website
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <MiniStat label="Lifetime Value" value={formatCurrency(financials.lifetimeValue)} />
            <MiniStat label="Outstanding" value={formatCurrency(financials.outstanding)} danger={financials.outstanding > 0} />
            <MiniStat label="Active Services" value={summary.activeServices} />
            <MiniStat label="Open Tickets" value={summary.openTickets} danger={summary.openTickets > 0} />
          </div>
          <ClientEditDelete client={client} canEdit={perms.editClient} canDelete={perms.deleteClient} />
        </div>

        {/* Health bar */}
        <div className="mt-6">
          <div className="mb-1 flex justify-between text-xs text-muted">
            <span>Client Health</span>
            <span>{client.healthScore ?? 100}/100</span>
          </div>
          <ProgressBar value={client.healthScore ?? 100} />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border pb-px">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/os/clients/${id}?tab=${tab.id}`}
            className={cn(
              "whitespace-nowrap px-4 py-2 text-sm transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Financial Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <FinanceItem label="Total Billed" value={formatCurrency(financials.totalBilled)} />
                <FinanceItem label="Total Paid" value={formatCurrency(financials.totalPaid)} positive />
                <FinanceItem label="Outstanding" value={formatCurrency(financials.outstanding)} />
                <FinanceItem label="Overdue" value={formatCurrency(financials.overdue)} danger={financials.overdue > 0} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Quick Stats</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <QuickRow icon={Briefcase} label="Active Services" value={summary.activeServices} />
              <QuickRow icon={FolderKanban} label="Active Projects" value={summary.activeProjects} />
              <QuickRow icon={Headphones} label="Open Tickets" value={summary.openTickets} />
              <QuickRow icon={RefreshCw} label="Upcoming Renewals" value={summary.upcomingRenewals} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent>
              {activities.slice(0, 8).map((a) => (
                <div key={a.id} className="flex items-start gap-3 border-b border-border py-3 last:border-0">
                  <Activity className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted">{formatDate(a.createdAt)} · {a.type}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "services" && (
        <div>
          <div className="mb-4"><ServiceActions clientId={id} canManage={perms.editServices} /></div>
          <div className="grid gap-4 md:grid-cols-2">
          {services.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-muted capitalize">{s.type.replace("_", " ")} · {s.plan || "Standard"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={s.status === "active" ? "success" : s.status === "expired" ? "danger" : "warning"}>
                      {s.status}
                    </Badge>
                    <ServiceActions clientId={id} service={s} canManage={perms.editServices} />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted">Price:</span> {formatCurrency(Number(s.price))}</div>
                  <div><span className="text-muted">Cycle:</span> {s.billingCycle.replace("_", " ")}</div>
                  <div><span className="text-muted">Start:</span> {formatDate(s.startDate)}</div>
                  <div><span className="text-muted">Expires:</span> {formatDate(s.expiryDate)}</div>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>
      )}

      {activeTab === "projects" && (
        <div className="space-y-4">
          <ProjectActions clientId={id} canManage={perms.manageProjects} />
          {projects.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Link href={`/os/projects/${p.id}`} className="font-medium hover:text-primary">{p.name}</Link>
                    <p className="text-sm text-muted capitalize">{p.status.replace("_", " ")} · {p.priority} priority</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{p.progress}%</span>
                    <ProjectActions clientId={id} project={p} canManage={perms.manageProjects} />
                  </div>
                </div>
                <ProgressBar value={p.progress} className="mt-3" />
                <p className="mt-2 text-xs text-muted">Deadline: {formatDate(p.deadline)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "finance" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Invoices</CardTitle>
              <InvoiceActions clientId={id} canManage={perms.manageFinance} />
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted">
                    <th className="pb-2">Number</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Due</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-t border-border">
                      <td className="py-2">
                        <Link href={`/os/invoices/${inv.id}`} className="hover:text-primary">{inv.invoiceNumber}</Link>
                      </td>
                      <td className="py-2">{formatCurrency(Number(inv.total))}</td>
                      <td className="py-2"><Badge variant={inv.status === "paid" ? "success" : inv.status === "overdue" ? "danger" : "default"}>{inv.status.replace("_", " ")}</Badge></td>
                      <td className="py-2 text-muted">{formatDate(inv.dueDate)}</td>
                      <td className="py-2"><InvoiceActions clientId={id} invoice={inv} canManage={perms.manageFinance} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Payments</CardTitle>
              <PaymentActions clientId={id} canManage={perms.manageFinance} />
            </CardHeader>
            <CardContent>
              {payments.map((p) => (
                <div key={p.id} className="flex justify-between border-b border-border py-3 last:border-0">
                  <div>
                    <p className="font-medium text-emerald-400">{formatCurrency(Number(p.amount))}</p>
                    <p className="text-xs text-muted">{p.method.replace("_", " ")} · {formatDate(p.paidAt)}</p>
                  </div>
                  <PaymentActions clientId={id} payment={p} canManage={perms.manageFinance} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "support" && (
        <div className="space-y-3">
          <TicketActions clientId={id} canManage={perms.manageSupport} />
          {tickets.map((t) => (
            <Card key={t.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <Link href={`/os/tickets/${t.id}`} className="font-medium hover:text-primary">{t.ticketNumber}: {t.subject}</Link>
                  <p className="text-sm text-muted capitalize">{t.category} · {t.priority} priority</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={t.status === "closed" || t.status === "resolved" ? "success" : "info"}>{t.status.replace("_", " ")}</Badge>
                  <TicketActions clientId={id} ticket={t} canManage={perms.manageSupport} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "timeline" && (
        <div>
          <div className="mb-4"><CommunicationFormButton clientId={id} canManage={perms.manageComms} /></div>
        <Card>
          <CardContent className="p-6">
            <div className="relative space-y-0">
              {[...activities, ...communications.map(c => ({ ...c, type: c.type, title: c.subject || c.type, description: c.content, createdAt: c.createdAt, id: c.id }))].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()).map((item, i) => (
                <div key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
                  {i < activities.length - 1 && (
                    <div className="absolute left-[11px] top-6 h-full w-px bg-border" />
                  )}
                  <div className="relative z-10 mt-1 h-6 w-6 shrink-0 rounded-full border-2 border-primary bg-background" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    {"description" in item && item.description && (
                      <p className="mt-1 text-sm text-muted line-clamp-2">{item.description as string}</p>
                    )}
                    <p className="mt-1 text-xs text-muted">{formatDate(item.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
      )}

      {activeTab === "infrastructure" && (
        <div>
          <div className="mb-4"><WebsiteActions clientId={id} canManage={perms.manageInfra} /></div>
          <div className="grid gap-4 md:grid-cols-2">
          {websites.map((w) => (
            <Card key={w.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  <span className="font-medium">{w.name}</span>
                  <Badge variant={w.status === "online" ? "success" : w.status === "offline" ? "danger" : "warning"}>{w.status}</Badge>
                  </div>
                  <WebsiteActions clientId={id} website={w} canManage={perms.manageInfra} />
                </div>
                <div className="mt-3 space-y-1 text-sm">
                  <p><span className="text-muted">Domain:</span> {w.domain}</p>
                  <p><span className="text-muted">Hosting:</span> {w.hosting}</p>
                  <p><span className="text-muted">SSL Expiry:</span> {formatDate(w.sslExpiry)} {daysUntil(w.sslExpiry) !== null && daysUntil(w.sslExpiry)! <= 30 && <Badge variant="warning" className="ml-2">Soon</Badge>}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
          <div className="mt-6">
            <h3 className="mb-3 font-medium">Credentials</h3>
            <CredentialsActions clientId={id} canManage={perms.manageCredentials} />
          </div>
        </div>
      )}

      {activeTab === "cullinos" && (
        <div className="space-y-6">
          {cullinosTenants.length === 0 ? (
            <Card>
              <CardHeader><CardTitle>Provision Cullinos</CardTitle></CardHeader>
              <CardContent>
                <CullinosProvisionForm clientId={id} companyName={client.companyName} />
              </CardContent>
            </Card>
          ) : (
            cullinosTenants.map((tenant) => (
              <Card key={tenant.id}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{tenant.slug || tenant.cullinosOrgId}</p>
                      <p className="text-sm text-muted">Org ID: {tenant.cullinosOrgId || "pending"}</p>
                    </div>
                    <Badge variant={tenant.status === "active" ? "success" : tenant.status === "suspended" ? "danger" : "warning"}>
                      {tenant.status}
                    </Badge>
                  </div>
                  <div className="grid gap-2 text-sm sm:grid-cols-3">
                    <p><span className="text-muted">Outlets:</span> {tenant.outletCount}</p>
                    <p><span className="text-muted">Terminals:</span> {tenant.terminalCount}</p>
                    <p><span className="text-muted">Gateway:</span> {tenant.gatewayStatus || "—"}</p>
                  </div>
                  {saasSubscriptions[0] && (
                    <p className="text-sm text-muted">
                      Subscription: {saasSubscriptions[0].status}
                      {saasSubscriptions[0].trialEndsAt && ` · Trial ends ${formatDate(saasSubscriptions[0].trialEndsAt)}`}
                    </p>
                  )}
                  <CullinosTenantActions tenantId={tenant.id} status={tenant.status} />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "documents" && (
        <div className="grid gap-3">
          {documents.map((d) => (
            <Card key={d.id}>
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted" />
                <div>
                  <p className="font-medium">{d.name}</p>
                  <p className="text-xs text-muted capitalize">{d.category} · {formatDate(d.createdAt)}</p>
                </div>
                </div>
                <DocumentDeleteButton documentId={d.id} canManage={perms.manageDocuments} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, danger }: { label: string; value: string | number; danger?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className={cn("text-lg font-semibold", danger && "text-red-400")}>{value}</p>
    </div>
  );
}

function FinanceItem({ label, value, positive, danger }: { label: string; value: string; positive?: boolean; danger?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={cn("text-lg font-semibold", positive && "text-emerald-400", danger && "text-red-400")}>{value}</p>
    </div>
  );
}

function QuickRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-muted">
        <Icon className="h-4 w-4" /> {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
