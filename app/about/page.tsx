import type { Metadata } from "next";
import { aboutContent, whyRkyves, approachItems } from "@/lib/content/home";
import HomeCta from "@/components/HomeCta";

export const metadata: Metadata = {
  title: "About",
  description:
    "Rkyves helps growing businesses build, manage, and grow their digital presence — websites, e-commerce, admin tools, ERP, POS, and infrastructure care.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-surface-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            About
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            {aboutContent.whatIs.title}
          </h1>
          <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-muted">
            {aboutContent.whatIs.paragraphs.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section-rule py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold text-ink">
                {whyRkyves.title}
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-muted">
                {whyRkyves.paragraphs.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
            </div>
            <div className="border border-border bg-surface p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                Our approach
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

      <section className="section-rule py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-ink">
            {aboutContent.vision.title}
          </h2>
          <blockquote className="mt-6 max-w-3xl border-l-2 border-accent pl-6 font-display text-2xl font-medium leading-snug text-ink md:text-3xl">
            {aboutContent.vision.quote}
          </blockquote>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted">
            {aboutContent.vision.description}
          </p>

          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {aboutContent.ecosystem.map((item, index) => (
              <li
                key={item.step}
                className="border border-border bg-surface p-6"
              >
                <p className="font-display text-3xl font-semibold text-accent/35">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                  {item.step}
                </h3>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <HomeCta />
    </>
  );
}
