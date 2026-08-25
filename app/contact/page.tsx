import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import BookingEmbed from "@/components/BookingEmbed";
import {
  contactInfo,
  getMailtoUrl,
  getWhatsAppUrl,
} from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a call, message us on WhatsApp, or send an inquiry. We help growing businesses with websites, software, and infrastructure.",
};

type ContactPageProps = {
  searchParams: Promise<{ sent?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const sent = params.sent === "1";

  return (
    <>
      <section className="border-b border-border bg-surface-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Contact
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Let&apos;s talk about your business
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Tell us what you need — a website, store, admin tools, ERP/POS, or
            ongoing care. We&apos;ll respond with a practical next step.
          </p>
          {sent && (
            <p
              role="status"
              className="mt-6 max-w-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
            >
              Thank you — your message was sent. We&apos;ll get back to you soon.
            </p>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Send an inquiry
            </h2>
            <p className="mt-2 text-sm text-muted">
              Prefer email?{" "}
              <a href={getMailtoUrl()} className="font-medium text-accent hover:underline">
                {contactInfo.email}
              </a>
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-8">
            <div id="book" className="scroll-mt-28 border border-border bg-surface p-6 md:p-8">
              <h2 className="font-display text-2xl font-semibold text-ink">
                Book a call
              </h2>
              <p className="mt-2 text-sm text-muted">
                Pick a time that works for you. We&apos;ll discuss goals, scope,
                and whether we&apos;re a fit.
              </p>
              <div className="mt-6">
                <BookingEmbed />
              </div>
            </div>

            <div className="border border-border bg-surface p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold text-ink">
                Direct channels
              </h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li>
                  <Link
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-ink hover:text-accent"
                  >
                    <MessageCircle className="h-5 w-5 text-accent" aria-hidden />
                    WhatsApp {contactInfo.phone}
                  </Link>
                </li>
                <li>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="inline-flex items-center gap-3 text-ink hover:text-accent"
                  >
                    <Mail className="h-5 w-5 text-accent" aria-hidden />
                    {contactInfo.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-3 text-ink hover:text-accent"
                  >
                    <Phone className="h-5 w-5 text-accent" aria-hidden />
                    {contactInfo.phone}
                  </a>
                </li>
              </ul>
              <p className="mt-6 text-sm text-muted">{contactInfo.address}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
