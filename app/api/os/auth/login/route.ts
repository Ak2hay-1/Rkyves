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
    return NextResponse.json(
      { error: "Database not configured. Set DATABASE_URL in .env.local" },
      { status: 503 }
    );
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

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.role === "client") {
      return NextResponse.json(
        { error: "Clients should sign in at /portal/login" },
        { status: 403 }
      );
    }

    await db
      .update(schema.users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.users.id, user.id));

    await createSession(user.id, getClientIp(req), req.headers.get("user-agent") ?? undefined);
    await logAudit(user.id, "login", "user", user.id, undefined, req);

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
