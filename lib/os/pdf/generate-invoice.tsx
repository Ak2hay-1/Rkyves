import { eq } from "drizzle-orm";
import { renderToBuffer } from "@react-pdf/renderer";
import { getDb, schema } from "@/lib/db";
import { InvoicePdfDocument, type InvoicePdfData } from "./invoice-pdf";
import { formatDate } from "@/lib/utils";

import { getOrgSettings } from "@/lib/os/settings";

export async function generateInvoicePdf(invoiceId: string): Promise<Buffer> {
  const db = getDb();
  const org = await getOrgSettings();

  const [invoice] = await db
    .select()
    .from(schema.invoices)
    .where(eq(schema.invoices.id, invoiceId))
    .limit(1);

  if (!invoice) throw new Error("Invoice not found");

  const [client] = await db
    .select()
    .from(schema.clients)
    .where(eq(schema.clients.id, invoice.clientId))
    .limit(1);

  if (!client) throw new Error("Client not found");

  const items = await db
    .select()
    .from(schema.invoiceItems)
    .where(eq(schema.invoiceItems.invoiceId, invoiceId));

  const pdfData: InvoicePdfData = {
    invoiceNumber: invoice.invoiceNumber,
    status: invoice.status,
    issueDate: formatDate(invoice.createdAt),
    dueDate: formatDate(invoice.dueDate),
    org: {
      companyName: org.companyName || "Rkyves",
      address: org.address,
      city: org.city,
      gst: org.gst,
      email: org.email,
      phone: org.phone,
    },
    client: {
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      gst: client.gst,
    },
    items: items.length > 0
      ? items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          total: Number(item.total),
        }))
      : [{ description: "Services rendered", quantity: 1, unitPrice: Number(invoice.subtotal), total: Number(invoice.subtotal) }],
    subtotal: Number(invoice.subtotal),
    discount: Number(invoice.discount || 0),
    tax: Number(invoice.tax || 0),
    total: Number(invoice.total),
    amountPaid: Number(invoice.amountPaid || 0),
    notes: invoice.notes,
  };

  const buffer = await renderToBuffer(<InvoicePdfDocument data={pdfData} />);
  return Buffer.from(buffer);
}
