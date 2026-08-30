import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requirePermission, requireDb, parseBody, logAudit, apiError } from "@/lib/os/api-utils";
import { invoiceSchema } from "@/lib/validations/os";
import { getOrgSettings } from "@/lib/os/settings";

async function generateInvoiceNumber() {
  const org = await getOrgSettings();
  const prefix = org.invoicePrefix || "INV";
  const db = getDb();
  const count = await db.select().from(schema.invoices);
  return `${prefix}-${String(count.length + 1).padStart(5, "0")}`;
}

export async function GET() {
  const auth = await requirePermission("finance.view");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const db = getDb();
  const invoices = await db.select().from(schema.invoices).orderBy(desc(schema.invoices.createdAt));
  return NextResponse.json({ invoices });
}

export async function POST(req: NextRequest) {
  const auth = await requirePermission("finance.manage");
  if (!auth.ok) return auth.response;
  const dbErr = requireDb();
  if (dbErr) return dbErr;

  const parsed = await parseBody(req, invoiceSchema);
  if (!parsed.ok) return parsed.response;

  const db = getDb();
  const invoiceNumber = await generateInvoiceNumber();
  const items = parsed.data.items ?? [];
  const subtotal = items.reduce((sum, i) => sum + Number(i.unitPrice) * (i.quantity ?? 1), 0);
  const discount = Number(parsed.data.discount ?? 0);
  const tax = Number(parsed.data.tax ?? 0);
  const total = subtotal - discount + tax;

  const [invoice] = await db
    .insert(schema.invoices)
    .values({
      invoiceNumber,
      clientId: parsed.data.clientId,
      status: parsed.data.status ?? "draft",
      subtotal: String(subtotal),
      discount: String(discount),
      tax: String(tax),
      total: String(total),
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
      notes: parsed.data.notes,
      createdById: auth.user.id,
    })
    .returning();

  if (items.length > 0) {
    await db.insert(schema.invoiceItems).values(
      items.map((item) => ({
        invoiceId: invoice.id,
        description: item.description,
        quantity: item.quantity ?? 1,
        unitPrice: item.unitPrice,
        discount: item.discount ?? "0",
        tax: item.tax ?? "0",
        total: String(Number(item.unitPrice) * (item.quantity ?? 1)),
        serviceId: item.serviceId ?? undefined,
      }))
    );
  }

  await logAudit(auth.user.id, "create", "invoice", invoice.id, { invoiceNumber }, req);
  return NextResponse.json({ invoice }, { status: 201 });
}
