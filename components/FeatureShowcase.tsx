"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import Reveal from "@/components/motion/Reveal";
import { easeOutExpo } from "@/lib/motion";

const chartData = [
  { height: 35, period: "Jan" },
  { height: 55, period: "Feb" },
  { height: 40, period: "Mar" },
  { height: 70, period: "Apr" },
  { height: 50, period: "May" },
  { height: 85, period: "Jun", label: "412 Sales", highlight: true },
  { height: 60, period: "Jul" },
  { height: 45, period: "Aug" },
];

export default function FeatureShowcase() {
  const chartRef = useRef<HTMLDivElement>(null);
  const inView = useInView(chartRef, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="bento-card grid gap-8 p-8 md:grid-cols-2 md:gap-12 md:p-12 lg:p-16">
          <Reveal className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              Get proper data &amp;{" "}
              <span className="text-muted-light">business insights.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
              Gain actionable analytics and real-time monitoring, empowering you
              to make data-driven decisions and grow your business with
              confidence.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div ref={chartRef} className="bento-card chart-glow p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted">Sales Over Time</p>
                  <p className="mt-1 text-xs text-muted-light">
                    Orders this quarter — sample retail outlet
                  </p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-muted-light md:text-xs">
                  Live sync
                </span>
              </div>
              <div className="mt-8 flex h-48 items-end justify-between gap-2 md:h-56 md:gap-3">
                {chartData.map((bar, i) => (
                  <div
                    key={bar.period}
                    className="relative flex flex-1 flex-col items-center justify-end"
                  >
                    {bar.highlight && bar.label && (
                      <span className="absolute -top-8 whitespace-nowrap rounded-full border border-white/10 bg-[#1a1a1a] px-2.5 py-1 text-[10px] text-foreground md:text-xs">
                        {bar.label}
                      </span>
                    )}
                    <motion.div
                      className={`w-full max-w-[28px] rounded-t-md ${
                        bar.highlight ? "gradient-bar" : "bg-white/30"
                      }`}
                      initial={{
                        height: reduceMotion
                          ? `${bar.height}%`
                          : `${Math.max(12, bar.height * 0.2)}%`,
                      }}
                      animate={{
                        height:
                          inView || reduceMotion
                            ? `${bar.height}%`
                            : `${Math.max(12, bar.height * 0.2)}%`,
                      }}
                      transition={{
                        duration: 0.6,
                        ease: easeOutExpo,
                        delay: reduceMotion ? 0 : i * 0.06,
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[10px] text-muted md:text-xs">
                {chartData.map((bar) => (
                  <span key={bar.period} className="flex-1 text-center">
                    {bar.period}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
