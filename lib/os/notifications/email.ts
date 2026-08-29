import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.log("[Email] Skipped (no RESEND_API_KEY):", payload.subject, "→", payload.to);
    return { success: false, error: "Email not configured" };
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "Rkyves OS <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    replyTo: payload.replyTo,
  });

  if (error) {
    console.error("[Email] Failed:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}
