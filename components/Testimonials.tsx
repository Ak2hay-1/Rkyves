import { testimonials } from "@/lib/content/testimonials";

/** Renders only when real, permissioned quotes exist in lib/content/testimonials.ts */
export default function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="section-rule py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          What clients say
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.id}
              className="border border-border bg-surface p-6 md:p-8"
            >
              <p className="text-base leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-6 text-sm text-muted">
                <span className="font-semibold text-ink">{t.name}</span>
                <span className="block">
                  {t.role}, {t.company}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
