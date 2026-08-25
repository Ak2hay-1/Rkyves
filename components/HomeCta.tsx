import Link from "next/link";
import { homeContent } from "@/lib/content/home";
import { getWhatsAppUrl } from "@/lib/content/site";

export default function HomeCta() {
  const { cta } = homeContent;

  return (
    <section className="section-rule py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border border-border bg-ink px-6 py-12 text-on-accent md:px-12 md:py-16">
          <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {cta.title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-on-accent/80 md:text-lg">
            {cta.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={cta.primaryCta.href}
              className="btn-primary bg-on-accent text-ink hover:bg-surface"
            >
              {cta.primaryCta.label}
            </Link>
            <Link
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary border-on-accent/40 bg-transparent text-on-accent hover:border-on-accent hover:bg-on-accent/10"
            >
              WhatsApp us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
