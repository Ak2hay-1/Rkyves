import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { globalSearch } from "@/lib/os/queries";
import { isDbConfigured } from "@/lib/db";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "dashboard.view")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ results: [] });
  }

  const q = req.nextUrl.searchParams.get("q");
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = await globalSearch(q);
  return NextResponse.json({ results });
}
