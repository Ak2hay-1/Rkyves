import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { getSessionUser } from "@/lib/os/auth/session";
import { isDbConfigured, getDb, schema } from "@/lib/db";

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ notifications: [] });
  }

  const db = getDb();
  const unreadOnly = req.nextUrl.searchParams.get("unread") === "true";

  const notifications = await db
    .select()
    .from(schema.notifications)
    .where(eq(schema.notifications.userId, user.id))
    .orderBy(desc(schema.notifications.createdAt))
    .limit(20);

  const filtered = unreadOnly ? notifications.filter((n) => !n.isRead) : notifications;

  return NextResponse.json({
    notifications: filtered,
    unreadCount: notifications.filter((n) => !n.isRead).length,
  });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await req.json();
  const db = getDb();

  if (body.markAllRead) {
    await db
      .update(schema.notifications)
      .set({ isRead: true })
      .where(eq(schema.notifications.userId, user.id));
    return NextResponse.json({ success: true });
  }

  if (body.id) {
    await db
      .update(schema.notifications)
      .set({ isRead: true })
      .where(eq(schema.notifications.id, body.id));
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
