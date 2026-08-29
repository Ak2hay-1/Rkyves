import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/os/auth/session";
import { canAccessOs } from "@/lib/os/auth/rbac";
import { OsLayoutClient } from "@/components/os/OsLayoutClient";

export default async function OsLayout({ children }: LayoutProps<"/os">) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/os/login");
  }

  if (!canAccessOs(user.role)) {
    redirect("/portal");
  }

  return <OsLayoutClient user={user}>{children}</OsLayoutClient>;
}
