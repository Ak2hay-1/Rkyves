import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import HomeCta from "@/components/HomeCta";
import { caseStudies } from "@/lib/content/cases";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected work from Rkyves — storefronts, admin systems, and custom business software for growing companies.",
};

export default function WorkPage() {
  return (
    <>
      <section className="border-b border-border bg-surface-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Work
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            Built for real businesses
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            Enterprise software and web — from storefront to back office. Case
            studies focus on outcomes and systems, not template marketing.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2">
          {caseStudies.map((study) => (
            <Link
              key={study.id}
              href={`/work/${study.id}`}
              className="group border border-border bg-surface p-6 transition-colors hover:border-accent md:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {study.industry}
              </p>
              <h2 className="mt-3 flex items-start justify-between gap-3 font-display text-2xl font-semibold text-ink group-hover:text-accent">
                {study.name}
                <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 opacity-40 group-hover:opacity-100" />
              </h2>
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
      </section>

      <HomeCta />
    </>
  );
}
