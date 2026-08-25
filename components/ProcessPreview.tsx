import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { processSteps } from "@/lib/content/process";
import { homeContent } from "@/lib/content/home";

export default function ProcessPreview() {
  return (
    <section className="section-rule py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title={homeContent.process.title}
            subtitle={homeContent.process.subtitle}
          />
          <Link
            href="/process"
            className="text-sm font-semibold text-accent hover:text-accent-hover"
          >
            Full process
          </Link>
        </div>

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <li key={step.id}>
              <p className="font-display text-4xl font-semibold text-accent/40">
                {String(step.step).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
