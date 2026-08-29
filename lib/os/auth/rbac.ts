import type { UserRole } from "@/lib/db/schema";

export type Permission =
  | "dashboard.view"
  | "clients.view"
  | "clients.create"
  | "clients.edit"
  | "clients.delete"
  | "leads.view"
  | "leads.manage"
  | "services.view"
  | "services.manage"
  | "projects.view"
  | "projects.manage"
  | "finance.view"
  | "finance.manage"
  | "support.view"
  | "support.manage"
  | "infrastructure.view"
  | "infrastructure.manage"
  | "documents.view"
  | "documents.manage"
  | "credentials.view"
  | "credentials.manage"
  | "communications.view"
  | "communications.manage"
  | "analytics.view"
  | "team.view"
  | "team.manage"
  | "audit.view"
  | "settings.manage";

const ROLE_PERMISSIONS: Record<UserRole, Permission[] | "*"> = {
  super_admin: "*",
  admin: "*",
  sales: [
    "dashboard.view",
    "clients.view",
    "clients.create",
    "clients.edit",
    "leads.view",
    "leads.manage",
    "services.view",
    "projects.view",
    "finance.view",
    "communications.view",
    "communications.manage",
    "analytics.view",
  ],
  project_manager: [
    "dashboard.view",
    "clients.view",
    "clients.edit",
    "services.view",
    "projects.view",
    "projects.manage",
    "documents.view",
    "documents.manage",
    "communications.view",
    "communications.manage",
    "infrastructure.view",
  ],
  developer: [
    "dashboard.view",
    "clients.view",
    "services.view",
    "projects.view",
    "projects.manage",
    "infrastructure.view",
    "infrastructure.manage",
    "credentials.view",
    "documents.view",
  ],
  support: [
    "dashboard.view",
    "clients.view",
    "services.view",
    "support.view",
    "support.manage",
    "communications.view",
    "communications.manage",
    "documents.view",
  ],
  finance: [
    "dashboard.view",
    "clients.view",
    "finance.view",
    "finance.manage",
    "analytics.view",
    "documents.view",
  ],
  viewer: [
    "dashboard.view",
    "clients.view",
    "services.view",
    "projects.view",
    "finance.view",
    "support.view",
    "analytics.view",
  ],
  client: [
    "dashboard.view",
    "clients.view",
    "services.view",
    "projects.view",
    "finance.view",
    "support.view",
    "support.manage",
    "documents.view",
  ],
};

export function hasPermission(role: UserRole, permission: Permission) {
  const perms = ROLE_PERMISSIONS[role];
  if (perms === "*") return true;
  return perms.includes(permission);
}

export function canAccessOs(role: UserRole) {
  return role !== "client";
}

export function canAccessPortal(role: UserRole) {
  return role === "client" || role === "super_admin" || role === "admin";
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  sales: "Sales",
  project_manager: "Project Manager",
  developer: "Developer",
  support: "Support",
  finance: "Finance",
  viewer: "Viewer",
  client: "Client",
};
