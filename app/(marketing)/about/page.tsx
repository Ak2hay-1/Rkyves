import type { Metadata } from "next";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import {
  aboutContent,
  approachItems,
  siteConfig,
  whyRkyves,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Rkyves — a technology company building accessible digital solutions for growing businesses.",
};

export default function AboutPage() {
  return (
    <>
      <Hero
        compact
        title="About Rkyves"
        subtitle="We build technology that understands how your business actually operates — and grows with you."
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground">
              {aboutContent.whatIs.title}
            </h2>
            <div className="mt-6 space-y-4 text-muted leading-relaxed text-lg">
              {aboutContent.whatIs.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-16 md:py-24 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground">
              {whyRkyves.title}
            </h2>
            <div className="mt-6 space-y-4 text-muted leading-relaxed">
              {whyRkyves.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Approach"
            subtitle="Your Business → Our Technology → Your Growth"
          />
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {approachItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-border bg-surface p-5 shadow-sm"
              >
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            {aboutContent.vision.title}
          </h2>
          <blockquote className="mx-auto mt-6 max-w-2xl text-xl font-medium text-white/90 md:text-2xl">
            &ldquo;{aboutContent.vision.quote}&rdquo;
          </blockquote>
          <p className="mx-auto mt-6 max-w-2xl text-white/70 leading-relaxed">
            {aboutContent.vision.description}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Growing With Your Business"
            subtitle="Start simple. Scale when you're ready."
          />
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {aboutContent.ecosystem.map((item, index) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-border bg-surface p-6 text-center shadow-sm"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-semibold text-foreground">{item.step}</h3>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-lg font-medium text-foreground">
            {siteConfig.tagline}
          </p>
        </div>
      </section>
    </>
  );
}
