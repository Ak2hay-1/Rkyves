"use client";

import { useInView, useReducedMotion, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const CHART_PATH =
  "M0 80 Q 50 60 100 70 T 200 40 T 300 55 T 400 20";

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
        <path
          d={`${CHART_PATH} L 400 120 L 0 120 Z`}
          fill="url(#areaGrad)"
        />
        <motion.path
          d={CHART_PATH}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2"
          initial={{ pathLength: reduceMotion ? 1 : 0 }}
          animate={{ pathLength: inView || reduceMotion ? 1 : 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
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

export default function BentoGrid() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Stagger className="grid gap-4 md:grid-cols-2 md:gap-5">
          <StaggerItem>
            <div className="bento-card flex min-h-[280px] flex-col justify-end p-8 md:min-h-[320px] md:p-10">
              <h3 className="text-2xl font-bold leading-snug md:text-3xl lg:text-4xl">
                Bring visitors from
                <br />
                <span className="text-muted-light">different sources.</span>
              </h3>
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
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bento-card min-h-[280px] overflow-hidden p-3 md:min-h-[320px]">
              <div
                className="h-full min-h-[260px] rounded-[20px] bg-gradient-to-br from-amber-700/40 via-amber-900/30 to-black bg-cover bg-center md:min-h-[300px]"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(180,130,70,0.6) 0%, rgba(60,40,20,0.8) 100%)",
                }}
                role="img"
                aria-label="Business owner portrait"
              />
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
