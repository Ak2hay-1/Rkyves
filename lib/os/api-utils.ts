import { NextRequest, NextResponse } from "next/server";
import type { SessionUser } from "@/lib/os/auth/session";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission, canAccessOs, type Permission } from "@/lib/os/auth/rbac";

export async function withAuth(
  handler: (req: NextRequest, user: SessionUser) => Promise<NextResponse>,
  permission?: Permission
) {
  return async (req: NextRequest) => {
    try {
      const user = await getSessionUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (!canAccessOs(user.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (permission && !hasPermission(user.role, permission)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return handler(req, user);
    } catch {
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}

export function getClientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined
  );
}

export async function logAudit(
  userId: string | null,
  action: string,
  entityType: string,
  entityId?: string,
  changes?: Record<string, unknown>,
  req?: NextRequest
) {
  if (!process.env.DATABASE_URL) return;
  const { getDb, schema } = await import("@/lib/db");
  const db = getDb();
  await db.insert(schema.auditLogs).values({
    userId: userId ?? undefined,
    action,
    entityType,
    entityId,
    changes,
    ipAddress: req ? getClientIp(req) : undefined,
    userAgent: req?.headers.get("user-agent") ?? undefined,
  });
}
