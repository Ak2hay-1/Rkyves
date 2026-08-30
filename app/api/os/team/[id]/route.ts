import { NextRequest, NextResponse } from "next/server";
import { eq, ne } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit, apiError } from "@/lib/os/api-utils";

const teamUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(["super_admin", "admin", "sales", "project_manager", "developer", "support", "finance", "viewer"]).optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("team.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, teamUpdateSchema);
  if (!parsed.ok) return parsed.response;

  const { id } = await params;
  const db = getDb();
  const [user] = await db
    .update(schema.users)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.users.id, id))
    .returning({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      role: schema.users.role,
      isActive: schema.users.isActive,
    });

  if (!user) return apiError("User not found", 404);
  await logAudit(auth.user.id, "update", "user", id, parsed.data, req);
  return NextResponse.json({ user });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requirePermission("team.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const { id } = await params;
  if (id === auth.user.id) return apiError("Cannot deactivate yourself", 400);

  const db = getDb();
  const [user] = await db
    .update(schema.users)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(schema.users.id, id))
    .returning();

  if (!user) return apiError("User not found", 404);
  await logAudit(auth.user.id, "deactivate", "user", id, {}, req);
  return NextResponse.json({ success: true });
}
