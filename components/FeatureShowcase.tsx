"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import Reveal from "@/components/motion/Reveal";
import { easeOutExpo } from "@/lib/motion";

const chartData = [
  { height: 38, period: "Jan", sales: 168 },
  { height: 52, period: "Feb", sales: 241 },
  { height: 44, period: "Mar", sales: 198 },
  { height: 68, period: "Apr", sales: 312 },
  { height: 58, period: "May", sales: 276 },
  { height: 88, period: "Jun", sales: 412, label: "412 Sales", highlight: true },
  { height: 72, period: "Jul", sales: 348 },
  { height: 64, period: "Aug", sales: 301 },
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
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
              <div>
                <dt className="text-xs text-muted">Avg order</dt>
                <dd className="mt-1 text-lg font-semibold text-foreground">₹1,840</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Conversion</dt>
                <dd className="mt-1 text-lg font-semibold text-foreground">3.8%</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Growth</dt>
                <dd className="mt-1 text-lg font-semibold text-emerald-400">+24%</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <div ref={chartRef} className="bento-card chart-glow p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted">Sales Over Time</p>
                  <p className="mt-1 text-xs text-muted-light">
                    Orders this year — sample retail outlet
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-300 md:text-xs">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
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
                      <motion.span
                        className="absolute -top-9 whitespace-nowrap rounded-full border border-white/15 bg-[#1a1a1a] px-2.5 py-1 text-[10px] text-foreground shadow-lg md:text-xs"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{
                          opacity: inView || reduceMotion ? 1 : 0,
                          y: inView || reduceMotion ? 0 : 6,
                        }}
                        transition={{ delay: reduceMotion ? 0 : 0.45, duration: 0.35 }}
                      >
                        {bar.label}
                      </motion.span>
                    )}
                    <motion.div
                      className={`w-full max-w-[32px] rounded-t-md ${
                        bar.highlight
                          ? "gradient-bar shadow-[0_0_18px_rgba(168,85,247,0.45)]"
                          : "bg-gradient-to-t from-white/15 to-white/45"
                      }`}
                      title={`${bar.sales} sales`}
                      initial={{
                        height: reduceMotion
                          ? `${bar.height}%`
                          : `${Math.max(16, bar.height * 0.25)}%`,
                      }}
                      animate={{
                        height:
                          inView || reduceMotion
                            ? `${bar.height}%`
                            : `${Math.max(16, bar.height * 0.25)}%`,
                      }}
                      transition={{
                        duration: 0.65,
                        ease: easeOutExpo,
                        delay: reduceMotion ? 0 : i * 0.05,
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
