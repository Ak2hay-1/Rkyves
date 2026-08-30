import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { SessionUser } from "@/lib/os/auth/session";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission, canAccessOs, type Permission } from "@/lib/os/auth/rbac";
import { isDbConfigured } from "@/lib/db";

export type AuthResult =
  | { ok: true; user: SessionUser }
  | { ok: false; response: NextResponse };

export async function requirePermission(permission: Permission): Promise<AuthResult> {
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!canAccessOs(user.role)) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  if (!hasPermission(user.role, permission)) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true, user };
}

export async function requireAuth(): Promise<AuthResult> {
  const user = await getSessionUser();
  if (!user || !canAccessOs(user.role)) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true, user };
}

export function requireDb() {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  return null;
}

export async function parseBody<T extends z.ZodType>(
  req: NextRequest,
  schema: T
): Promise<{ ok: true; data: z.infer<T> } | { ok: false; response: NextResponse }> {
  try {
    const data = schema.parse(await req.json());
    return { ok: true, data };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        ok: false,
        response: NextResponse.json({ error: "Invalid input", details: err.issues }, { status: 400 }),
      };
    }
    return { ok: false, response: NextResponse.json({ error: "Invalid request body" }, { status: 400 }) };
  }
}

export function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

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
