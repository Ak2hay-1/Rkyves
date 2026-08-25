import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import HomeCta from "@/components/HomeCta";
import { caseStudies, getCaseStudy } from "@/lib/content/cases";
import { siteConfig } from "@/lib/content/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Case study" };
  return {
    title: `${study.name} — Case study`,
    description: study.description,
    openGraph: {
      title: `${study.name} | ${siteConfig.name}`,
      description: study.description,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CaseStudy",
    name: study.name,
    description: study.description,
    url: `${siteConfig.url}/work/${study.id}`,
    about: study.industry,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-border bg-surface-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link
            href="/work"
            className="text-sm font-semibold text-accent hover:text-accent-hover"
          >
            ← All work
          </Link>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted">
            {study.industry}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink md:text-5xl">
            {study.name}
          </h1>
          <p className="mt-4 max-w-2xl text-xl font-medium text-ink/90">
            {study.headline}
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            {study.description}
          </p>
          <a
            href={study.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-hover"
          >
            Visit live site
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">
                Challenge
              </h2>
              <p className="mt-3 leading-relaxed text-muted">{study.challenge}</p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">
                Solution
              </h2>
              <p className="mt-3 leading-relaxed text-muted">{study.solution}</p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">
                Outcomes
              </h2>
              <ul className="mt-4 space-y-3">
                {study.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex items-start gap-3 text-muted"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="border border-border bg-surface p-6 h-fit">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Stack
            </h2>
            <ul className="mt-4 space-y-2">
              {study.stack.map((item) => (
                <li key={item} className="text-sm text-ink">
                  {item}
                </li>
              ))}
            </ul>
            <h2 className="mt-8 text-xs font-semibold uppercase tracking-wider text-muted">
              Tags
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-border px-2.5 py-1 text-xs text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <HomeCta />
    </>
  );
}
