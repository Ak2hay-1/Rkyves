"use client";

import Link from "next/link";
import { ChevronRight, Trophy } from "lucide-react";
import GradientWaves from "@/components/GradientWaves";
import DashboardPreview from "@/components/DashboardPreview";
import { surfaceVsDepth } from "@/lib/constants";
import FadeIn from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const [headlineFirst, headlineSecond] = surfaceVsDepth.headline.split(". ");

export default function LandingHero() {
  return (
    <section className="hero-glow relative min-h-screen overflow-hidden pt-28 md:pt-32">
      <GradientWaves />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Stagger onMount>
          <StaggerItem>
            <div className="pill-btn mx-auto inline-flex items-center gap-2 px-4 py-1.5 text-xs text-muted-light">
              <Trophy className="h-3.5 w-3.5 text-primary" />
              Trusted technology partner for growing businesses
            </div>
          </StaggerItem>

          <StaggerItem>
            <h1 className="mt-8 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-foreground">{headlineFirst}.</span>
              <br />
              <span className="text-muted-light">{headlineSecond}.</span>
            </h1>
          </StaggerItem>

          <StaggerItem>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
              {surfaceVsDepth.subheadline}
            </p>
          </StaggerItem>

          <StaggerItem>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/contact"
                className="pill-btn-filled inline-flex min-h-12 items-center gap-2 px-7 py-3 text-sm font-medium text-foreground"
              >
                Get in Touch
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="pill-btn inline-flex min-h-12 items-center px-7 py-3 text-sm font-medium text-muted-light hover:text-foreground"
              >
                Our Services
              </Link>
            </div>
          </StaggerItem>

          <StaggerItem>
            <p className="mt-5 text-xs text-muted">
              No long-term contracts &bull; Cancel anytime
            </p>
          </StaggerItem>
        </Stagger>
      </div>

      <FadeIn className="relative mx-auto mt-16 max-w-5xl px-4 sm:px-6 md:mt-20" delay={0.4}>
        <div className="animate-float overflow-hidden rounded-t-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-purple-500/10">
          <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 rounded-md border border-white/5 bg-black/50 px-3 py-1.5">
              <p className="truncate text-center text-xs text-muted">rkyves.com</p>
            </div>
          </div>
          <DashboardPreview />
        </div>
      </FadeIn>
    </section>
  );
}
