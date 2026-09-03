import { clientCaseStudies } from "@/lib/clients";
import Reveal from "@/components/motion/Reveal";

/** Enough sets so one animated half stays wider than typical viewports. */
const SET_COUNT = 8;

export default function TrustedBy() {
  const names = clientCaseStudies.map((c) => c.name);
  const marqueeItems = Array.from({ length: SET_COUNT }, () => names).flat();

  return (
    <section className="border-y border-white/5 py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="text-sm text-muted md:text-base">
            Trusted by growing businesses &amp; entrepreneurs
          </p>
        </Reveal>
      </div>

      <div className="marquee-fade relative mt-10 overflow-hidden">
        <div className="marquee-track flex gap-12 px-4" aria-hidden="true">
          {marqueeItems.map((name, index) => (
            <span
              key={`${name}-${index}`}
              className="shrink-0 text-lg font-semibold tracking-tight text-white/20 md:text-xl"
            >
              {name}
            </span>
          ))}
        </div>
        <ul className="sr-only">
          {names.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
