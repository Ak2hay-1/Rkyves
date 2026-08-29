import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const featured = {
  quote:
    "Rkyves transformed our entire digital operation. From website to ERP, everything just works — and we finally stopped worrying about downtime.",
  name: "David Miller",
  role: "CEO, SmallBizCo",
  stats: [
    { value: "10k", label: "New customers" },
    { value: "20%", label: "Market share" },
  ],
};

const testimonials = [
  {
    quote:
      "The admin panel alone saved us hours every week. We manage products, orders, and inventory without calling a developer.",
    name: "Michael Johnson",
    role: "VP of Marketing, RetailCo",
    initials: "MJ",
  },
  {
    quote:
      "Our e-commerce store went live in weeks, not months. The infrastructure support means we sleep better at night.",
    name: "Sarah Chen",
    role: "Founder, TechStart",
    initials: "SC",
  },
  {
    quote:
      "From POS integration to hosting, Rkyves handles everything underneath. We focus on customers, they handle the tech.",
    name: "Raj Patel",
    role: "Owner, FoodHub",
    initials: "RP",
  },
  {
    quote:
      "Security, backups, monitoring — things we never thought about until Rkyves showed us what we were missing.",
    name: "Emily Watson",
    role: "Director, MediCare+",
    initials: "EW",
  },
];

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white">
      {initials}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="bento-card grid gap-8 p-6 md:grid-cols-2 md:gap-10 md:p-10">
            <div
              className="min-h-[320px] rounded-2xl bg-gradient-to-br from-amber-600/50 via-yellow-700/30 to-amber-900/40 md:min-h-[400px]"
              role="img"
              aria-label={`${featured.name} portrait`}
            />
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
                  <Avatar initials={t.initials} />
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
