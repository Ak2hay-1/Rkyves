"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { OsSidebar, OsTopbar } from "@/components/os/OsShell";
import type { SessionUser } from "@/lib/os/auth/session";

export function OsLayoutClient({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <OsSidebar
        user={user}
        pathname={pathname}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col lg:pl-0">
        <OsTopbar user={user} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
