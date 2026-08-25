import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import HomeCta from "@/components/HomeCta";
import { carePlanNote, pricingPackages } from "@/lib/content/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Starter, Growth, and Operations packages from Rkyves — project-based quotes tailored to your scope, plus optional care plans.",
};

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-border bg-surface-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Pricing
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Packages that grow with your business
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            We quote on real scope — not one-size templates. These packages show
            typical engagement shapes; every project is tailored.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-3">
          {pricingPackages.map((pkg) => (
            <article
              key={pkg.id}
              className={`flex flex-col border bg-surface p-6 md:p-8 ${
                pkg.highlighted
                  ? "border-accent shadow-[0_0_0_1px_var(--accent)]"
                  : "border-border"
              }`}
            >
              {pkg.highlighted && (
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Most chosen
                </p>
              )}
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
                {pkg.name}
              </h2>
              <p className="mt-2 text-sm text-muted">{pkg.tagline}</p>
              <p className="mt-4 text-sm font-medium text-ink">
                Best for: {pkg.bestFor}
              </p>
              <p className="mt-6 font-display text-lg font-semibold text-accent">
                {pkg.range}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {pkg.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact#book" className="btn-primary mt-8 w-full">
                Request a quote
              </Link>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-3xl px-4 text-center text-sm leading-relaxed text-muted sm:px-6">
          {carePlanNote}
        </p>
      </section>

      <HomeCta />
    </>
  );
}
