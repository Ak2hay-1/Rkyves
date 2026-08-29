import { NextRequest, NextResponse } from "next/server";
import { destroySession, getSessionUser } from "@/lib/os/auth/session";
import { logAudit } from "@/lib/os/api-utils";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (user) {
    await logAudit(user.id, "logout", "user", user.id, undefined, req);
  }
  await destroySession();
  return NextResponse.redirect(new URL("/os/login", req.url));
}
