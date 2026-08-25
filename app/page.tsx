import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import HomeHero from "@/components/HomeHero";
import SurfaceDepth from "@/components/SurfaceDepth";
import WorkPreview from "@/components/WorkPreview";
import ProcessPreview from "@/components/ProcessPreview";
import HomeCta from "@/components/HomeCta";
import Testimonials from "@/components/Testimonials";
import { homeContent, whyRkyves, approachItems } from "@/lib/content/home";
import { services } from "@/lib/content/services";

const orderedServices = [
  ...services.filter((s) => s.id === "hosting"),
  ...services.filter((s) => s.id !== "hosting"),
];

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <SurfaceDepth />
      <WorkPreview />
      <Testimonials />

      <section id="services" className="section-rule py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              title={homeContent.services.title}
              subtitle={homeContent.services.subtitle}
            />
            <Link
              href="/services"
              className="text-sm font-semibold text-accent hover:text-accent-hover"
            >
              All services
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orderedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <ProcessPreview />

      <section className="section-rule py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 border border-border bg-surface p-8 md:grid-cols-2 md:p-12">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                {whyRkyves.title}
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-muted">
                {whyRkyves.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="border border-border bg-surface-muted/50 p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                Our approach
              </p>
              <p className="mt-3 font-display text-2xl font-semibold text-ink">
                Your business → our technology → your growth
              </p>
              <ul className="mt-6 space-y-3">
                {approachItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <HomeCta />
    </>
  );
}
