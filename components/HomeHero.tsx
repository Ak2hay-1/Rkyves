import Link from "next/link";
import { homeContent } from "@/lib/content/home";
import { getWhatsAppUrl } from "@/lib/content/site";

export default function HomeHero() {
  const { hero } = homeContent;

  return (
    <section className="hero-plane min-h-[88vh] text-on-accent">
      <div className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 md:pb-24 md:pt-32">
        <p className="reveal font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {hero.brand}
        </p>
        <h1 className="reveal reveal-delay-1 mt-6 max-w-3xl font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl md:text-4xl">
          {hero.headline}
        </h1>
        <p className="reveal reveal-delay-2 mt-5 max-w-xl text-base leading-relaxed text-on-accent/85 md:text-lg">
          {hero.support}
        </p>
        <div className="reveal reveal-delay-2 mt-8 flex flex-wrap gap-3">
          <Link
            href={hero.primaryCta.href}
            className="btn-primary bg-on-accent text-ink hover:bg-surface"
          >
            {hero.primaryCta.label}
          </Link>
          <Link
            href={hero.secondaryCta.href}
            className="btn-secondary border-on-accent/40 bg-transparent text-on-accent hover:border-on-accent hover:bg-on-accent/10"
          >
            {hero.secondaryCta.label}
          </Link>
          <Link
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary border-on-accent/40 bg-transparent text-on-accent hover:border-on-accent hover:bg-on-accent/10"
          >
            WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}
