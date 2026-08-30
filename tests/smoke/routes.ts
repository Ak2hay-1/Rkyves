/** Public marketing pages */
export const marketingRoutes = [
  { path: "/", name: "Home" },
  { path: "/services", name: "Services" },
  { path: "/about", name: "About" },
  { path: "/contact", name: "Contact" },
  { path: "/cullinos", name: "Cullinos" },
  { path: "/terms", name: "Terms" },
  { path: "/privacy", name: "Privacy" },
];

/** Rkyves OS modules (mirrors components/os/OsShell.tsx navigation) */
export const osRoutes = [
  { path: "/os/dashboard", name: "Dashboard" },
  { path: "/os/leads", name: "Leads" },
  { path: "/os/leads/pipeline", name: "Lead Pipeline" },
  { path: "/os/clients", name: "Clients" },
  { path: "/os/clients/new", name: "New Client" },
  { path: "/os/services", name: "Services" },
  { path: "/os/renewals", name: "Renewals" },
  { path: "/os/projects", name: "Projects" },
  { path: "/os/tasks", name: "Tasks" },
  { path: "/os/invoices", name: "Invoices" },
  { path: "/os/invoices?status=outstanding", name: "Outstanding Invoices" },
  { path: "/os/payments", name: "Payments" },
  { path: "/os/tickets", name: "Tickets" },
  { path: "/os/websites", name: "Websites" },
  { path: "/os/cullinos", name: "Cullinos Tenants" },
  { path: "/os/erp", name: "ERP" },
  { path: "/os/documents", name: "Documents" },
  { path: "/os/credentials", name: "Credentials" },
  { path: "/os/communications", name: "Communications" },
  { path: "/os/analytics", name: "Analytics" },
  { path: "/os/team", name: "Team" },
  { path: "/os/audit", name: "Audit Logs" },
  { path: "/os/settings", name: "Settings" },
];

/** Client portal pages */
export const portalRoutes = [
  { path: "/portal", name: "Portal Home" },
  { path: "/portal/invoices", name: "Portal Invoices" },
  { path: "/portal/services", name: "Portal Services" },
  { path: "/portal/projects", name: "Portal Projects" },
  { path: "/portal/tickets", name: "Portal Tickets" },
];
