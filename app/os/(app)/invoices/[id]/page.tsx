import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { isDbConfigured, getDb, schema } from "@/lib/db";
import { SetupRequired } from "@/components/os/SetupRequired";
import { PageHeader } from "@/components/os/ui/stats";
import { InvoiceActions } from "@/components/os/InvoiceActions";

export async function generateMetadata({ params }: PageProps<"/os/invoices/[id]">) {
  const { id } = await params;
  if (!isDbConfigured()) return { title: "Invoice — Rkyves OS" };
  const db = getDb();
  const [inv] = await db.select().from(schema.invoices).where(eq(schema.invoices.id, id)).limit(1);
  return { title: inv ? `${inv.invoiceNumber} — Rkyves OS` : "Invoice — Rkyves OS" };
}

export default async function InvoiceDetailPage({ params }: PageProps<"/os/invoices/[id]">) {
  if (!isDbConfigured()) return <SetupRequired />;

  const { id } = await params;
  const db = getDb();

  const [invoice] = await db
    .select({
      invoice: schema.invoices,
      companyName: schema.clients.companyName,
      contactPerson: schema.clients.contactPerson,
      email: schema.clients.email,
    })
    .from(schema.invoices)
    .leftJoin(schema.clients, eq(schema.invoices.clientId, schema.clients.id))
    .where(eq(schema.invoices.id, id))
    .limit(1);

  if (!invoice) notFound();

  return (
    <div>
      <PageHeader title={invoice.invoice.invoiceNumber} description={`Invoice for ${invoice.companyName}`} />
      <InvoiceActions
        invoice={{
          ...invoice.invoice,
          companyName: invoice.companyName || "",
          contactPerson: invoice.contactPerson || "",
          email: invoice.email || "",
        }}
      />
    </div>
  );
}
