"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { easeOutExpo } from "@/lib/motion";

const CHART_PATH = "M0 80 Q 50 60 100 70 T 200 40 T 300 55 T 400 20";

const sourceChannels = [
  { label: "Organic", value: 42, color: "bg-primary" },
  { label: "Ads", value: 28, color: "bg-fuchsia-400" },
  { label: "Referral", value: 18, color: "bg-sky-400" },
  { label: "Direct", value: 12, color: "bg-emerald-400" },
];

const retentionPoints = [
  { week: "W1", value: 92 },
  { week: "W2", value: 84 },
  { week: "W3", value: 78 },
  { week: "W4", value: 86 },
  { week: "W5", value: 91 },
  { week: "W6", value: 95 },
];

function ActivityChart() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mt-auto">
      <svg
        ref={ref}
        viewBox="0 0 400 120"
        className="w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <path d={`${CHART_PATH} L 400 120 L 0 120 Z`} fill="url(#areaGrad)" />
        <motion.path
          d={CHART_PATH}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2"
          initial={{ pathLength: reduceMotion ? 1 : 0 }}
          animate={{ pathLength: inView || reduceMotion ? 1 : 0 }}
          transition={{ duration: 1.2, ease: easeOutExpo }}
        />
        <circle cx="300" cy="55" r="4" fill="white" />
      </svg>
      <span className="absolute right-[20%] top-0 rounded-full border border-white/10 bg-[#1a1a1a] px-2.5 py-1 text-[10px] text-foreground md:text-xs">
        3.2K Active
      </span>
    </div>
  );
}

function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;

    if (reduceMotion) {
      ref.current.textContent = target.toLocaleString();
      return;
    }

    const start = performance.now();
    const duration = 1500;

    function frame(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      if (ref.current) {
        ref.current.textContent = value.toLocaleString();
      }
      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }, [inView, reduceMotion, target]);

  return (
    <p ref={ref} className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
      0
    </p>
  );
}

function TrafficSources() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();

  return (
    <div ref={ref} className="mt-6 space-y-3">
      {sourceChannels.map((channel, i) => (
        <div key={channel.label}>
          <div className="mb-1 flex items-center justify-between text-xs text-muted-light">
            <span>{channel.label}</span>
            <span>{channel.value}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className={`h-full rounded-full ${channel.color}`}
              initial={{ width: reduceMotion ? `${channel.value}%` : "0%" }}
              animate={{
                width: inView || reduceMotion ? `${channel.value}%` : "0%",
              }}
              transition={{
                duration: 0.7,
                ease: easeOutExpo,
                delay: reduceMotion ? 0 : i * 0.08,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function RetentionPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const max = Math.max(...retentionPoints.map((p) => p.value));

  return (
    <div ref={ref} className="flex h-full min-h-[260px] flex-col rounded-[20px] border border-white/5 bg-black/40 p-6 md:min-h-[300px] md:p-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">Customer retention</p>
          <p className="mt-1 text-xs text-muted-light">Repeat orders · last 6 weeks</p>
        </div>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300 md:text-xs">
          +12% MoM
        </span>
      </div>

      <div className="mt-8 flex flex-1 items-end gap-2 md:gap-3">
        {retentionPoints.map((point, i) => (
          <div key={point.week} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              className="w-full max-w-[36px] rounded-t-md bg-gradient-to-t from-primary/40 to-primary"
              initial={{
                height: reduceMotion
                  ? `${(point.value / max) * 100}%`
                  : "18%",
              }}
              animate={{
                height:
                  inView || reduceMotion
                    ? `${(point.value / max) * 100}%`
                    : "18%",
              }}
              transition={{
                duration: 0.55,
                ease: easeOutExpo,
                delay: reduceMotion ? 0 : i * 0.07,
              }}
              style={{ minHeight: 24 }}
            />
            <span className="text-[10px] text-muted md:text-xs">{point.week}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/5 pt-4 text-center">
        <div>
          <p className="text-lg font-semibold text-foreground">68%</p>
          <p className="text-[10px] text-muted">Returning</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">₹2.4L</p>
          <p className="text-[10px] text-muted">LTV avg</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">4.8★</p>
          <p className="text-[10px] text-muted">CSAT</p>
        </div>
      </div>
    </div>
  );
}

export default function BentoGrid() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Stagger className="grid gap-4 md:grid-cols-2 md:gap-5">
          <StaggerItem>
            <div className="bento-card flex min-h-[280px] flex-col justify-between p-8 md:min-h-[320px] md:p-10">
              <h3 className="text-2xl font-bold leading-snug md:text-3xl lg:text-4xl">
                Bring visitors from
                <br />
                <span className="text-muted-light">different sources.</span>
              </h3>
              <TrafficSources />
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bento-card flex min-h-[280px] flex-col p-8 md:min-h-[320px] md:p-10">
              <p className="text-sm text-muted">Audience Online Activity</p>
              <CountUp target={4235} />
              <p className="mt-1 text-sm text-muted">Visiting now</p>
              <ActivityChart />
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bento-card flex min-h-[280px] flex-col justify-end p-8 md:min-h-[320px] md:p-10">
              <h3 className="text-2xl font-bold leading-snug md:text-3xl lg:text-4xl">
                Acquire and retain
                <br />
                <span className="text-muted-light">more customers.</span>
              </h3>
              <p className="mt-4 max-w-sm text-sm text-muted-light">
                Track repeat buyers, lifetime value, and satisfaction from one
                live dashboard — not scattered spreadsheets.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bento-card min-h-[280px] overflow-hidden p-3 md:min-h-[320px]">
              <RetentionPanel />
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
