import Link from "next/link";
import { ChevronRight } from "lucide-react";
import LandingHero from "@/components/LandingHero";
import TrustedBy from "@/components/TrustedBy";
import ClientShowcase from "@/components/ClientShowcase";
import FeatureShowcase from "@/components/FeatureShowcase";
import BentoGrid from "@/components/BentoGrid";
import Testimonials from "@/components/Testimonials";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import {
  approachItems,
  services,
  surfaceVsDepth,
  whyRkyves,
} from "@/lib/constants";

const orderedServices = [
  ...services.filter((s) => s.id === "hosting"),
  ...services.filter((s) => s.id !== "hosting"),
];

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <TrustedBy />
      <ClientShowcase />
      <FeatureShowcase />
      <BentoGrid />
      <Testimonials />

      <section id="services" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            title={surfaceVsDepth.servicesHeading}
            subtitle={surfaceVsDepth.servicesSubheading}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orderedServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="bento-card grid gap-10 p-8 md:grid-cols-2 md:p-12 lg:p-16">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {whyRkyves.title}
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-muted">
                {whyRkyves.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="bento-card p-8">
              <p className="text-sm font-medium text-primary">
                Our Approach
              </p>
              <p className="mt-3 text-2xl font-bold text-foreground">
                Your Business &rarr; Our Technology &rarr; Your Growth
              </p>
              <ul className="mt-6 space-y-3">
                {approachItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-light">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 pt-8 md:pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="bento-card relative overflow-hidden px-8 py-12 text-center md:px-16 md:py-16">
            <div className="pointer-events-none absolute inset-0 chart-glow" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                {surfaceVsDepth.ctaHeading}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted">
                {surfaceVsDepth.ctaSubheading}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/contact"
                  className="pill-btn-filled inline-flex min-h-12 items-center gap-2 px-7 py-3 text-sm font-medium text-foreground"
                >
                  Contact Us
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/about"
                  className="pill-btn inline-flex min-h-12 items-center px-7 py-3 text-sm font-medium text-muted-light hover:text-foreground"
                >
                  Learn About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
