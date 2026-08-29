import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, isDbConfigured, schema } from "@/lib/db";
import { verifyPassword } from "@/lib/os/auth/password";
import { createSession } from "@/lib/os/auth/session";
import { getClientIp, logAudit } from "@/lib/os/api-utils";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);
    const db = getDb();

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase()))
      .limit(1);

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Portal login: client role only (admins can preview via OS login)
    if (user.role !== "client") {
      return NextResponse.json(
        { error: "This login is for clients only. Team members should use /os/login" },
        { status: 403 }
      );
    }

    if (!user.clientId) {
      return NextResponse.json({ error: "Account not linked to a client" }, { status: 403 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await db
      .update(schema.users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.users.id, user.id));

    await createSession(user.id, getClientIp(req), req.headers.get("user-agent") ?? undefined);
    await logAudit(user.id, "portal_login", "user", user.id, undefined, req);

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, clientId: user.clientId },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
