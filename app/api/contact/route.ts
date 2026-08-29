import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactInfo, siteConfig } from "@/lib/constants";
import { contactFormSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data. Please check your inputs." },
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
      from: process.env.RESEND_FROM_EMAIL ?? "Rkyves Website <onboarding@resend.dev>",
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

    // Also create lead in Rkyves OS if database is configured
    if (process.env.DATABASE_URL) {
      try {
        const { getDb, schema } = await import("@/lib/db");
        const db = getDb();
        await db.insert(schema.leads).values({
          name,
          email,
          phone: phone || undefined,
          source: "Website Contact Form",
          stage: "lead",
          requirement: message,
          notes: `Service interest: ${serviceLabel}`,
        });
      } catch (leadError) {
        console.error("Failed to create lead:", leadError);
      }
    }
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
