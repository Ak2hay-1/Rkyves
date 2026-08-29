import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { isDbConfigured } from "@/lib/db";
import { processOverdueInvoices, processRenewalReminders } from "@/lib/os/automation";

/** Cron endpoint for automation jobs. Protect with CRON_SECRET in production. */
export async function POST(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    const user = await getSessionUser();
    if (!user || !hasPermission(user.role, "settings.manage")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  await processOverdueInvoices();
  await processRenewalReminders();

  return NextResponse.json({
    success: true,
    processed: ["overdue_invoices", "renewal_reminders"],
    timestamp: new Date().toISOString(),
  });
}
