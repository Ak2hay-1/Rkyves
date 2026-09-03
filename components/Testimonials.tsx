import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const featured = {
  quote:
    "Rkyves transformed our entire digital operation. From website to ERP and POS, everything just works — and we finally stopped worrying about downtime.",
  name: "Jerzy Thomas",
  role: "Founder, Jerzyfy — Kochi",
  brand: "Jerzyfy",
  brandLetter: "J",
  brandAccent: "from-blue-500 to-sky-400",
  stats: [
    { value: "3×", label: "Faster order flow" },
    { value: "99.9%", label: "Uptime since launch" },
  ],
};

const testimonials = [
  {
    quote:
      "Recipe tracking and inventory used to be spreadsheets and guesswork. Now our production team sees exact levels in real time — enterprise software that fits how we actually work.",
    name: "Dr. Ananya Rao",
    role: "Director, Yathartha Foods — Bengaluru",
    brand: "YF",
    brandAccent: "from-emerald-500 to-teal-400",
  },
  {
    quote:
      "Cullinos tied our POS, kitchen display, and QR ordering together. Service is smoother on busy weekends, and GST billing stopped being a nightly headache.",
    name: "Arjun Nair",
    role: "Owner, SpiceRoute Kitchen — Thrissur",
    brand: "SR",
    brandAccent: "from-amber-500 to-orange-400",
  },
  {
    quote:
      "Our online catalogue and storefront finally match what customers see in the shop. Rkyves handled hosting and security so we can focus on sales, not servers.",
    name: "Ramesh Sharma",
    role: "Proprietor, Sharma Electronics — Jaipur",
    brand: "SE",
    brandAccent: "from-sky-500 to-indigo-400",
  },
  {
    quote:
      "From the first website to WhatsApp enquiries landing in one place, everything feels built for a small Indian business — not a generic foreign template.",
    name: "Meera Desai",
    role: "Founder, Lotus Leaf Cafe — Mumbai",
    brand: "LL",
    brandAccent: "from-rose-500 to-pink-400",
  },
];

function BrandMark({
  letter,
  accent,
  size = "sm",
}: {
  letter: string;
  accent: string;
  size?: "sm" | "lg";
}) {
  const sizeClass =
    size === "lg"
      ? "h-20 w-20 text-3xl md:h-24 md:w-24 md:text-4xl"
      : "h-10 w-10 text-xs";

  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} font-bold text-white shadow-lg ${sizeClass}`}
      aria-hidden="true"
    >
      {letter}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="bento-card grid gap-8 p-6 md:grid-cols-2 md:gap-10 md:p-10">
            <div className="relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.18),_transparent_55%),linear-gradient(160deg,#0c0c0c,#141414)] md:min-h-[360px]">
              <BrandMark
                letter={featured.brandLetter}
                accent={featured.brandAccent}
                size="lg"
              />
              <p className="mt-5 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {featured.brand}
              </p>
              <p className="mt-2 text-sm text-muted">Client since 2024</p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {["Storefront", "ERP", "POS"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-base leading-relaxed text-muted-light md:text-lg">
                &ldquo;{featured.quote}&rdquo;
              </p>
              <p className="mt-6 text-lg font-semibold text-foreground">
                {featured.name}
              </p>
              <p className="text-sm text-muted">{featured.role}</p>
              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/5 pt-8">
                {featured.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl font-bold text-foreground md:text-4xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Stagger className="mt-5 grid gap-4 md:grid-cols-2 md:gap-5">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <article className="bento-card h-full p-6 md:p-8">
                <p className="text-sm leading-relaxed text-muted-light md:text-base">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <BrandMark letter={t.brand} accent={t.brandAccent} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
