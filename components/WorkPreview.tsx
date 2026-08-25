import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { caseStudies } from "@/lib/content/cases";
import { homeContent } from "@/lib/content/home";

export default function WorkPreview() {
  return (
    <section id="clients" className="section-rule py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title={homeContent.proof.title}
            subtitle={homeContent.proof.subtitle}
          />
          <Link
            href="/work"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-hover"
          >
            View all work
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {caseStudies.map((study) => (
            <Link
              key={study.id}
              href={`/work/${study.id}`}
              className="group border border-border bg-surface p-6 transition-colors hover:border-accent md:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {study.industry}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-ink group-hover:text-accent">
                {study.name}
              </h3>
              <p className="mt-2 text-base font-medium text-ink/90">
                {study.headline}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {study.description}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {study.tags.map((tag) => (
                  <li
                    key={tag}
                    className="border border-border px-2.5 py-1 text-xs text-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
