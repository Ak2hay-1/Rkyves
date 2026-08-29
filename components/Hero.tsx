"use client";

import Link from "next/link";
import FadeIn from "@/components/motion/FadeIn";

type HeroProps = {
  title: string;
  subtitle: string;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  compact?: boolean;
};

export default function Hero({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  compact = false,
}: HeroProps) {
  return (
    <section
      className={`relative overflow-hidden border-b border-border ${
        compact ? "py-16 md:py-20" : "py-20 md:py-28"
      }`}
    >
      <div className="absolute inset-0 glow-radial" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {title}
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-muted md:text-xl">
              {subtitle}
            </p>
          </FadeIn>
          {(primaryCta || secondaryCta) && (
            <FadeIn delay={0.2}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                {primaryCta && (
                  <Link
                    href={primaryCta.href}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-hover"
                  >
                    {primaryCta.label}
                  </Link>
                )}
                {secondaryCta && (
                  <Link
                    href={secondaryCta.href}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-surface px-6 py-3 text-base font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {secondaryCta.label}
                  </Link>
                )}
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}
