import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const featured = {
  quote:
    "Rkyves transformed our entire digital operation. From website to ERP and POS, everything just works — and we finally stopped worrying about downtime.",
  name: "Jerzy Thomas",
  role: "Founder, Jerzyfy — Kochi",
  image: "/testimonials/jerzy-thomas.jpg",
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
    image: "/testimonials/yathartha-founder.jpg",
  },
  {
    quote:
      "Cullinos tied our POS, kitchen display, and QR ordering together. Service is smoother on busy weekends, and GST billing stopped being a nightly headache.",
    name: "Arjun Nair",
    role: "Owner, SpiceRoute Kitchen — Thrissur",
    image: "/testimonials/arjun-nair.jpg",
  },
  {
    quote:
      "Our online catalogue and storefront finally match what customers see in the shop. Rkyves handled hosting and security so we can focus on sales, not servers.",
    name: "Ramesh Sharma",
    role: "Proprietor, Sharma Electronics — Jaipur",
    image: "/testimonials/ramesh-sharma.jpg",
  },
  {
    quote:
      "From the first website to WhatsApp enquiries landing in one place, everything feels built for a small Indian business — not a generic foreign template.",
    name: "Meera Desai",
    role: "Founder, Lotus Leaf Cafe — Mumbai",
    image: "/testimonials/meera-desai.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="bento-card grid gap-8 p-6 md:grid-cols-2 md:gap-10 md:p-10">
            <div className="relative min-h-[320px] overflow-hidden rounded-2xl md:min-h-[400px]">
              <Image
                src={featured.image}
                alt={`${featured.name}, ${featured.role}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
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
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover object-top"
                      sizes="40px"
                    />
                  </div>
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
