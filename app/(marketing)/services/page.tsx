import type { Metadata } from "next";
import Hero from "@/components/Hero";
import { services } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Professional websites, e-commerce, admin panels, business integrations, ERP/POS software, and hosting — all from Rkyves.",
};

export default function ServicesPage() {
  return (
    <>
      <Hero
        compact
        title="Our Services"
        subtitle="From your first website to full business management — Rkyves provides the digital solutions your business needs to grow."
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;

              return (
                <article
                  key={service.id}
                  id={service.id}
                  className={`grid gap-8 lg:grid-cols-2 lg:items-center ${
                    !isEven ? "lg:[&>div:first-child]:order-2" : ""
                  }`}
                >
                  <div>
                    <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                      {service.title}
                    </h2>
                    <p className="mt-4 text-muted leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                      Capabilities
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-foreground/80"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
