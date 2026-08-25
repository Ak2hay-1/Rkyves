import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactInfo, siteConfig } from "@/lib/content/site";
import { contactFormSchema } from "@/lib/validations";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count += 1;
  return false;
}

async function postLeadWebhook(payload: Record<string, unknown>) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "rkyves-website",
        receivedAt: new Date().toISOString(),
        ...payload,
      }),
    });
  } catch (error) {
    console.error("Lead webhook error:", error);
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot trip — pretend success
    if (typeof body.website === "string" && body.website.length > 0) {
      return NextResponse.json({
        message: "Thank you! Your message has been sent successfully.",
      });
    }

    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = String(issue.path[0] ?? "form");
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      return NextResponse.json(
        {
          error: "Invalid form data. Please check your inputs.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, serviceInterest, message } = result.data;

    const apiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL ?? contactInfo.email;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Contact form is not configured yet. Please email us directly or use WhatsApp.",
        },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);

    const serviceLabel =
      serviceInterest && serviceInterest !== ""
        ? serviceInterest
        : "Not specified";

    const { error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ??
        "Rkyves Website <onboarding@resend.dev>",
      to: contactEmail,
      replyTo: email,
      subject: `New inquiry from ${name} — ${siteConfig.name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Service Interest: ${serviceLabel}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    await postLeadWebhook({
      name,
      email,
      phone: phone || null,
      serviceInterest: serviceLabel,
      message,
    });

    return NextResponse.json({
      message: "Thank you! Your message has been sent successfully.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
