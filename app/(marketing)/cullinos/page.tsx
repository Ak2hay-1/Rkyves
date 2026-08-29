import Link from "next/link";
import { cullinosProduct, getWhatsAppUrl } from "@/lib/constants";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export const metadata = {
  title: "Cullinos — Restaurant Operating System by Rkyves",
  description: cullinosProduct.description,
};

export default function CullinosPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 md:p-12"
            style={{ borderColor: "#D4A01733" }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(212,160,23,0.15), transparent 70%)",
              }}
            />
            <div className="relative">
              <p className="text-sm font-medium" style={{ color: "#D4A017" }}>
                Product by Rkyves
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
                {cullinosProduct.name}
              </h1>
              <p className="mt-2 text-xl text-muted">{cullinosProduct.tagline}</p>
              <p className="mt-6 max-w-2xl text-lg text-muted-light">
                {cullinosProduct.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/contact" className="pill-btn-filled">
                  Book a Cullinos demo
                </Link>
                <a
                  href={cullinosProduct.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-btn"
                >
                  Visit cullinos.com
                </a>
                <a
                  href={getWhatsAppUrl("Hello Rkyves, I'd like a Cullinos demo.")}
                  className="pill-btn"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl font-bold">Everything in one platform</h2>
            <ul className="mt-6 space-y-3 text-muted-light">
              {cullinosProduct.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span style={{ color: "#D4A017" }}>✓</span> {f}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-2xl font-bold">Plans</h2>
            <Stagger className="mt-6 space-y-4">
              {cullinosProduct.plans.map((plan) => (
                <StaggerItem key={plan.name}>
                  <div className="rounded-2xl border border-border bg-surface p-5">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">{plan.name}</h3>
                      <span className="font-medium" style={{ color: "#D4A017" }}>
                        {plan.price}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted">
                      {plan.outlets} outlet(s) · {plan.terminals} terminal(s)
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
        </div>

        <Reveal className="mt-12 text-center" delay={0.15}>
          <p className="text-sm text-muted">
            Cullinos is built by{" "}
            <Link href="/about" className="hover:text-primary">
              Rkyves
            </Link>{" "}
            — technology built around your business.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
