export type WhatsAppPayload = {
  to: string;
  message: string;
};

/** Normalize phone to E.164-ish format (digits only, with country code) */
export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export async function sendWhatsApp(payload: WhatsAppPayload): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  const apiUrl = process.env.WHATSAPP_API_URL;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  const to = normalizePhone(payload.to);

  // Option 1: Generic webhook (Make, Zapier, n8n)
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, message: payload.message }),
      });
      if (!res.ok) {
        return { success: false, error: `Webhook returned ${res.status}` };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  // Option 2: Meta WhatsApp Cloud API
  if (apiUrl && accessToken) {
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: payload.message },
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        return { success: false, error: body };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }

  console.log("[WhatsApp] Skipped (not configured):", payload.message.slice(0, 60), "→", to);
  return { success: false, error: "WhatsApp not configured" };
}

export function isWhatsAppConfigured() {
  return Boolean(process.env.WHATSAPP_WEBHOOK_URL || (process.env.WHATSAPP_API_URL && process.env.WHATSAPP_ACCESS_TOKEN));
}
