import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/os/auth/session";
import { getPortalClientId } from "@/lib/portal/queries";

/** Require portal access — clients only, or redirect team to OS */
export async function requirePortalAccess() {
  const user = await getSessionUser();
  if (!user) redirect("/portal/login");

  if (user.role !== "client") {
    redirect("/os/dashboard");
  }

  const clientId = await getPortalClientId(user);
  if (!clientId) redirect("/portal/login");

  return { user, clientId };
}
