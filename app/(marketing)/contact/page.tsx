import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import Hero from "@/components/Hero";
import ContactForm from "@/components/ContactForm";
import {
  contactInfo,
  getMailtoUrl,
  getWhatsAppUrl,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Rkyves. Send us a message, email us, or chat on WhatsApp to discuss your project.",
};

export default function ContactPage() {
  return (
    <>
      <Hero
        compact
        title="Contact Us"
        subtitle="Tell us about your business and what you need. We'll get back to you as soon as possible."
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground">
                Get in touch directly
              </h2>
              <p className="mt-4 text-muted leading-relaxed">
                Prefer a quick conversation? Reach us on WhatsApp or email.
                We&apos;re happy to discuss websites, e-commerce, integrations,
                ERP/POS, or hosting.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-[#25D366]/40 hover:bg-[#25D366]/5"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#25D366]/10 text-[#25D366]">
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">WhatsApp</p>
                    <p className="text-sm text-muted">{contactInfo.whatsapp}</p>
                  </div>
                </a>

                <a
                  href={getMailtoUrl()}
                  className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted">{contactInfo.email}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-sm text-muted">{contactInfo.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-bold text-foreground">
                  Send us a message
                </h2>
                <p className="mt-2 text-muted">
                  Fill out the form below and we&apos;ll respond within 1–2
                  business days.
                </p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
