import type { Metadata } from "next";
import { Check } from "lucide-react";
import HomeCta from "@/components/HomeCta";
import { services } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Websites, online stores, admin panels, integrations, ERP/POS, and hosting & infrastructure — technology built around your business.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-border bg-surface-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Services
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Everything under the surface — and the surface itself
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            From your first professional website to ERP, POS, and ongoing
            infrastructure care. We design around how your business operates.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="space-y-20">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <section
                key={service.id}
                id={service.id}
                className="scroll-mt-28 grid gap-8 border-b border-border pb-20 last:border-0 last:pb-0 lg:grid-cols-[1fr_1.2fr]"
              >
                <div>
                  <Icon className="h-8 w-8 text-accent" aria-hidden />
                  <h2 className="mt-4 font-display text-3xl font-semibold text-ink">
                    {service.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-muted">
                    {service.description}
                  </p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 border border-border bg-surface p-4 text-sm text-ink"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                        aria-hidden
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      <HomeCta />
    </>
  );
}
