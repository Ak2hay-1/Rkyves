import Link from "next/link";

export function PortalLayout({
  user,
  client,
  active,
  children,
}: {
  user: { name: string };
  client: { companyName: string };
  active: string;
  children: React.ReactNode;
}) {
  const links = [
    { id: "home", href: "/portal", label: "Home" },
    { id: "services", href: "/portal/services", label: "Services" },
    { id: "projects", href: "/portal/projects", label: "Projects" },
    { id: "invoices", href: "/portal/invoices", label: "Invoices" },
    { id: "tickets", href: "/portal/tickets", label: "Support" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="text-sm text-muted">Rkyves Client Portal</p>
            <h1 className="text-lg font-semibold">{client.companyName}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">{user.name}</span>
            <form action="/api/os/auth/logout" method="POST">
              <button type="submit" className="text-sm text-muted hover:text-foreground">Sign out</button>
            </form>
          </div>
        </div>
        <nav className="mx-auto mt-4 flex max-w-5xl gap-1 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm ${active === l.id ? "bg-primary/15 text-primary" : "text-muted hover:text-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  );
}
