import { formatCurrency, formatDate } from "@/lib/utils";

const brandColor = "#8b5cf6";

function layout(title: string, body: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#000;padding:24px 32px;">
          <span style="color:${brandColor};font-size:20px;font-weight:700;">Rkyves</span>
          <span style="color:#888;font-size:12px;display:block;margin-top:4px;">One Client. Everything Connected.</span>
        </td></tr>
        <tr><td style="padding:32px;">${body}</td></tr>
        <tr><td style="padding:20px 32px;background:#fafafa;border-top:1px solid #eee;">
          <p style="margin:0;color:#888;font-size:12px;">Rkyves Technologies · rkyves.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function welcomeClientEmail(clientName: string, contactPerson: string) {
  return layout(
    "Welcome to Rkyves",
    `<h2 style="margin:0 0 16px;color:#111;">Welcome, ${contactPerson}!</h2>
    <p style="color:#555;line-height:1.6;">Thank you for choosing Rkyves. We're excited to partner with <strong>${clientName}</strong>.</p>
    <p style="color:#555;line-height:1.6;">Your dedicated team is setting everything up. You can access your client portal to track projects, invoices, and support.</p>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://rkyves.com"}/portal" style="display:inline-block;margin-top:16px;padding:12px 24px;background:${brandColor};color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Open Client Portal</a>`
  );
}

export function paymentConfirmationEmail(clientName: string, amount: number, invoiceNumber?: string) {
  return layout(
    "Payment Received",
    `<h2 style="margin:0 0 16px;color:#111;">Payment Confirmed</h2>
    <p style="color:#555;line-height:1.6;">We've received your payment of <strong>${formatCurrency(amount)}</strong>${invoiceNumber ? ` for invoice <strong>${invoiceNumber}</strong>` : ""}.</p>
    <p style="color:#555;line-height:1.6;">Thank you, ${clientName}!</p>`
  );
}

export function invoiceEmail(
  clientName: string,
  invoiceNumber: string,
  total: number,
  dueDate: Date | null,
  pdfUrl?: string
) {
  return layout(
    `Invoice ${invoiceNumber}`,
    `<h2 style="margin:0 0 16px;color:#111;">Invoice ${invoiceNumber}</h2>
    <p style="color:#555;line-height:1.6;">Dear ${clientName},</p>
    <p style="color:#555;line-height:1.6;">Please find your invoice details below:</p>
    <table style="width:100%;margin:20px 0;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#888;">Amount Due</td><td style="padding:8px 0;text-align:right;font-weight:700;font-size:18px;color:#111;">${formatCurrency(total)}</td></tr>
      <tr><td style="padding:8px 0;color:#888;">Due Date</td><td style="padding:8px 0;text-align:right;color:#111;">${formatDate(dueDate)}</td></tr>
    </table>
    ${pdfUrl ? `<a href="${pdfUrl}" style="display:inline-block;padding:12px 24px;background:${brandColor};color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Download PDF</a>` : ""}`
  );
}

export function overdueInvoiceEmail(clientName: string, invoiceNumber: string, total: number, daysOverdue: number) {
  return layout(
    `Overdue: ${invoiceNumber}`,
    `<h2 style="margin:0 0 16px;color:#dc2626;">Payment Overdue</h2>
    <p style="color:#555;line-height:1.6;">Dear ${clientName},</p>
    <p style="color:#555;line-height:1.6;">Invoice <strong>${invoiceNumber}</strong> for <strong>${formatCurrency(total)}</strong> is ${daysOverdue} day(s) overdue.</p>
    <p style="color:#555;line-height:1.6;">Please arrange payment at your earliest convenience. Contact us if you need assistance.</p>`
  );
}

export function renewalReminderEmail(clientName: string, serviceName: string, renewalDate: Date, amount: number, daysLeft: number) {
  return layout(
    `Renewal Reminder: ${serviceName}`,
    `<h2 style="margin:0 0 16px;color:#111;">Service Renewal Due</h2>
    <p style="color:#555;line-height:1.6;">Dear ${clientName},</p>
    <p style="color:#555;line-height:1.6;">Your <strong>${serviceName}</strong> service renews in <strong>${daysLeft} days</strong> (${formatDate(renewalDate)}).</p>
    <p style="color:#555;line-height:1.6;">Renewal amount: <strong>${formatCurrency(amount)}</strong></p>
    <p style="color:#555;line-height:1.6;">Contact us to renew and avoid service interruption.</p>`
  );
}

export function ticketUpdateEmail(clientName: string, ticketNumber: string, subject: string, status: string) {
  return layout(
    `Ticket Update: ${ticketNumber}`,
    `<h2 style="margin:0 0 16px;color:#111;">Support Ticket Update</h2>
    <p style="color:#555;line-height:1.6;">Dear ${clientName},</p>
    <p style="color:#555;line-height:1.6;">Your ticket <strong>${ticketNumber}</strong> — "${subject}" — is now <strong>${status.replace(/_/g, " ")}</strong>.</p>`
  );
}

// WhatsApp message templates (shorter)
export function renewalWhatsApp(serviceName: string, daysLeft: number, amount: number) {
  return `🔔 *Rkyves Renewal Reminder*\n\nYour *${serviceName}* service renews in *${daysLeft} days*.\nAmount: *₹${amount.toLocaleString("en-IN")}*\n\nReply to this message or contact us to renew.`;
}

export function overdueWhatsApp(invoiceNumber: string, amount: number) {
  return `⚠️ *Rkyves Payment Reminder*\n\nInvoice *${invoiceNumber}* for *₹${amount.toLocaleString("en-IN")}* is overdue.\n\nPlease arrange payment or contact us for assistance.`;
}

export function paymentWhatsApp(amount: number) {
  return `✅ *Payment Received*\n\nThank you! We've received your payment of *₹${amount.toLocaleString("en-IN")}*.\n\n— Rkyves Team`;
}
