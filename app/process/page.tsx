import type { Metadata } from "next";
import HomeCta from "@/components/HomeCta";
import { processIntro, processSteps } from "@/lib/content/process";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How Rkyves works with you — discovery, build, launch, and ongoing care for growing businesses.",
};

export default function ProcessPage() {
  return (
    <>
      <section className="border-b border-border bg-surface-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Process
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            {processIntro.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            {processIntro.subtitle}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ol className="space-y-10">
            {processSteps.map((step) => (
              <li
                key={step.id}
                className="grid gap-6 border-b border-border pb-10 last:border-0 last:pb-0 md:grid-cols-[8rem_1fr]"
              >
                <p className="font-display text-5xl font-semibold text-accent/35">
                  {String(step.step).padStart(2, "0")}
                </p>
                <div>
                  <h2 className="font-display text-3xl font-semibold text-ink">
                    {step.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <HomeCta />
    </>
  );
}
