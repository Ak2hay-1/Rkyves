import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { sendEmail } from "./email";
import { sendWhatsApp } from "./whatsapp";
import * as templates from "./templates";

export type NotifyClientOptions = {
  clientId: string;
  emailSubject?: string;
  emailHtml?: string;
  whatsappMessage?: string;
  skipEmail?: boolean;
  skipWhatsApp?: boolean;
};

/** Send email and/or WhatsApp to a client using their contact info */
export async function notifyClient(opts: NotifyClientOptions) {
  const db = getDb();
  const [client] = await db
    .select()
    .from(schema.clients)
    .where(eq(schema.clients.id, opts.clientId))
    .limit(1);

  if (!client) return { email: false, whatsapp: false };

  const results = { email: false, whatsapp: false };

  if (!opts.skipEmail && opts.emailHtml && client.email) {
    const r = await sendEmail({
      to: client.email,
      subject: opts.emailSubject || "Message from Rkyves",
      html: opts.emailHtml,
    });
    results.email = r.success;
  }

  const whatsappNumber = client.whatsapp || client.phone;
  if (!opts.skipWhatsApp && opts.whatsappMessage && whatsappNumber) {
    const r = await sendWhatsApp({ to: whatsappNumber, message: opts.whatsappMessage });
    results.whatsapp = r.success;
  }

  // Log communication
  if (opts.emailHtml) {
    await db.insert(schema.communications).values({
      clientId: opts.clientId,
      type: "email",
      subject: opts.emailSubject,
      content: opts.emailSubject || "Email sent",
      direction: "outbound",
    });
  }
  if (opts.whatsappMessage) {
    await db.insert(schema.communications).values({
      clientId: opts.clientId,
      type: "whatsapp",
      content: opts.whatsappMessage,
      direction: "outbound",
    });
  }

  return results;
}

export async function notifyWelcome(clientId: string) {
  const db = getDb();
  const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, clientId)).limit(1);
  if (!client) return;

  return notifyClient({
    clientId,
    emailSubject: `Welcome to Rkyves, ${client.contactPerson}!`,
    emailHtml: templates.welcomeClientEmail(client.companyName, client.contactPerson),
    whatsappMessage: `Welcome to Rkyves, ${client.contactPerson}! 🎉\n\nWe're excited to work with ${client.companyName}. Access your portal: ${process.env.NEXT_PUBLIC_SITE_URL || "https://rkyves.com"}/portal`,
  });
}

export async function notifyPaymentReceived(clientId: string, amount: number, invoiceNumber?: string) {
  const db = getDb();
  const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, clientId)).limit(1);
  if (!client) return;

  return notifyClient({
    clientId,
    emailSubject: "Payment Received — Rkyves",
    emailHtml: templates.paymentConfirmationEmail(client.companyName, amount, invoiceNumber),
    whatsappMessage: templates.paymentWhatsApp(amount),
  });
}

export async function notifyInvoiceSent(clientId: string, invoiceNumber: string, total: number, dueDate: Date | null, pdfUrl?: string) {
  const db = getDb();
  const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, clientId)).limit(1);
  if (!client) return;

  return notifyClient({
    clientId,
    emailSubject: `Invoice ${invoiceNumber} from Rkyves`,
    emailHtml: templates.invoiceEmail(client.companyName, invoiceNumber, total, dueDate, pdfUrl),
    whatsappMessage: `📄 *Invoice ${invoiceNumber}*\n\nAmount: *₹${total.toLocaleString("en-IN")}*\nDue: ${dueDate ? dueDate.toLocaleDateString("en-IN") : "On receipt"}\n\n— Rkyves`,
  });
}

export async function notifyInvoiceOverdue(clientId: string, invoiceNumber: string, total: number, daysOverdue: number) {
  const db = getDb();
  const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, clientId)).limit(1);
  if (!client) return;

  return notifyClient({
    clientId,
    emailSubject: `Overdue: Invoice ${invoiceNumber}`,
    emailHtml: templates.overdueInvoiceEmail(client.companyName, invoiceNumber, total, daysOverdue),
    whatsappMessage: templates.overdueWhatsApp(invoiceNumber, total),
  });
}

export async function notifyRenewalReminder(
  clientId: string,
  serviceName: string,
  renewalDate: Date,
  amount: number,
  daysLeft: number
) {
  const db = getDb();
  const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, clientId)).limit(1);
  if (!client) return;

  return notifyClient({
    clientId,
    emailSubject: `Renewal Reminder: ${serviceName}`,
    emailHtml: templates.renewalReminderEmail(client.companyName, serviceName, renewalDate, amount, daysLeft),
    whatsappMessage: templates.renewalWhatsApp(serviceName, daysLeft, amount),
  });
}

export async function notifyTicketUpdate(clientId: string, ticketNumber: string, subject: string, status: string) {
  const db = getDb();
  const [client] = await db.select().from(schema.clients).where(eq(schema.clients.id, clientId)).limit(1);
  if (!client) return;

  return notifyClient({
    clientId,
    emailSubject: `Ticket Update: ${ticketNumber}`,
    emailHtml: templates.ticketUpdateEmail(client.companyName, ticketNumber, subject, status),
    whatsappMessage: `🎫 Ticket *${ticketNumber}* updated to *${status.replace(/_/g, " ")}*\n\n"${subject}"\n\n— Rkyves Support`,
  });
}

export { sendEmail, sendWhatsApp };
