import { GlobalSearch } from "@/components/os/GlobalSearch";
import { NotificationCenter } from "@/components/os/NotificationCenter";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Briefcase,
  FolderKanban,
  Receipt,
  CreditCard,
  Headphones,
  Globe,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  Settings,
  RefreshCw,
  Server,
  Monitor,
  Database,
  ClipboardList,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/os/auth/rbac";
import type { SessionUser } from "@/lib/os/auth/session";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; href: string }[];
};

export const osNavigation: NavItem[] = [
  { label: "Dashboard", href: "/os/dashboard", icon: LayoutDashboard },
  {
    label: "Sales",
    href: "/os/leads",
    icon: UserPlus,
    children: [
      { label: "Leads", href: "/os/leads" },
      { label: "Pipeline", href: "/os/leads/pipeline" },
    ],
  },
  {
    label: "Clients",
    href: "/os/clients",
    icon: Users,
    children: [
      { label: "All Clients", href: "/os/clients" },
    ],
  },
  {
    label: "Services",
    href: "/os/services",
    icon: Briefcase,
    children: [
      { label: "All Services", href: "/os/services" },
      { label: "Renewals", href: "/os/renewals" },
    ],
  },
  {
    label: "Projects",
    href: "/os/projects",
    icon: FolderKanban,
    children: [
      { label: "Projects", href: "/os/projects" },
      { label: "Tasks", href: "/os/tasks" },
    ],
  },
  {
    label: "Finance",
    href: "/os/invoices",
    icon: Receipt,
    children: [
      { label: "Invoices", href: "/os/invoices" },
      { label: "Payments", href: "/os/payments" },
      { label: "Outstanding", href: "/os/invoices?status=outstanding" },
    ],
  },
  {
    label: "Support",
    href: "/os/tickets",
    icon: Headphones,
    children: [
      { label: "Tickets", href: "/os/tickets" },
    ],
  },
  {
    label: "Infrastructure",
    href: "/os/websites",
    icon: Server,
    children: [
      { label: "Websites", href: "/os/websites" },
      { label: "Cullinos Tenants", href: "/os/cullinos" },
      { label: "ERP", href: "/os/erp" },
    ],
  },
  { label: "Documents", href: "/os/documents", icon: FileText },
  { label: "Credentials", href: "/os/credentials", icon: Shield },
  { label: "Communication", href: "/os/communications", icon: MessageSquare },
  { label: "Analytics", href: "/os/analytics", icon: BarChart3 },
  { label: "Team", href: "/os/team", icon: Users },
  { label: "Audit Logs", href: "/os/audit", icon: ClipboardList },
  { label: "Settings", href: "/os/settings", icon: Settings },
];

export function OsSidebar({
  user,
  pathname,
  mobileOpen,
  onMobileClose,
}: {
  user: SessionUser;
  pathname: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/os/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <span className="text-sm font-bold text-primary">R</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Rkyves OS</p>
              <p className="text-[10px] text-muted">One Client. Everything Connected.</p>
            </div>
          </Link>
          <button className="lg:hidden" onClick={onMobileClose}>
            <X className="h-5 w-5 text-muted" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {osNavigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary/15 text-primary"
                        : "text-muted-light hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                  {item.children && isActive && (
                    <ul className="ml-7 mt-1 space-y-0.5 border-l border-border pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onMobileClose}
                            className={cn(
                              "block rounded-md px-2 py-1.5 text-xs transition-colors",
                              pathname === child.href
                                ? "text-primary"
                                : "text-muted hover:text-foreground"
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>
          <form action="/api/os/auth/logout" method="POST" className="mt-3">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

export function OsTopbar({
  user,
  onMenuClick,
}: {
  user: SessionUser;
  onMenuClick?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <button className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </button>

      <GlobalSearch />

      <div className="flex items-center gap-2">
        <Link
          href="/os/renewals"
          className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-foreground sm:flex"
        >
          <RefreshCw className="h-4 w-4" />
          Renewals
        </Link>
        <NotificationCenter />
        <div className="hidden items-center gap-2 rounded-lg border border-border px-3 py-1.5 sm:flex">
          <span className="text-sm">{user.name.split(" ")[0]}</span>
          <ChevronDown className="h-4 w-4 text-muted" />
        </div>
      </div>
    </header>
  );
}

export {
  Globe,
  Monitor,
  Database,
  CreditCard,
  Shield,
  BarChart3,
};
