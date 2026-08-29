import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/os/auth/session";
import { hasPermission } from "@/lib/os/auth/rbac";
import { isDbConfigured, getDb, schema } from "@/lib/db";
import { notifyInvoiceSent } from "@/lib/os/notifications";
import { logAudit } from "@/lib/os/api-utils";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "finance.manage")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { id } = await params;
  const db = getDb();

  const [invoice] = await db
    .select()
    .from(schema.invoices)
    .where(eq(schema.invoices.id, id))
    .limit(1);

  if (!invoice) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const pdfUrl = `${siteUrl}/api/os/invoices/${id}/pdf`;

  // Update status to sent
  await db
    .update(schema.invoices)
    .set({ status: invoice.status === "draft" ? "sent" : invoice.status, sentAt: new Date(), updatedAt: new Date() })
    .where(eq(schema.invoices.id, id));

  // Send email + WhatsApp
  await notifyInvoiceSent(
    invoice.clientId,
    invoice.invoiceNumber,
    Number(invoice.total),
    invoice.dueDate,
    pdfUrl
  );

  await db.insert(schema.activities).values({
    clientId: invoice.clientId,
    type: "invoice",
    title: `Invoice ${invoice.invoiceNumber} sent to client`,
    userId: user.id,
    metadata: { invoiceId: id },
  });

  await logAudit(user.id, "send", "invoice", id, { invoiceNumber: invoice.invoiceNumber }, req);

  return NextResponse.json({ success: true, message: "Invoice sent to client" });
}
