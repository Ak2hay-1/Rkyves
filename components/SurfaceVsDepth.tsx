"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Globe, ShoppingBag, LayoutDashboard } from "lucide-react";
import { infraLayers, surfaceVsDepth } from "@/lib/constants";
import { easeOutExpo } from "@/lib/motion";
import Reveal from "@/components/motion/Reveal";

type View = "client" | "infra";

export default function SurfaceVsDepth() {
  const [view, setView] = useState<View>("client");
  const reduceMotion = useReducedMotion();

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {surfaceVsDepth.layersHeadline}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted md:text-lg">
            {surfaceVsDepth.layersSubheadline}
          </p>
        </Reveal>

        <Reveal className="mt-10 flex justify-center" delay={0.1}>
          <div className="pill-nav inline-flex rounded-full p-1">
            <button
              type="button"
              onClick={() => setView("client")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                view === "client"
                  ? "bg-white/10 text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {surfaceVsDepth.toggleClient}
            </button>
            <button
              type="button"
              onClick={() => setView("infra")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                view === "infra"
                  ? "bg-white/10 text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {surfaceVsDepth.toggleInfra}
            </button>
          </div>
        </Reveal>

        <div className="relative mt-10 min-h-[420px]">
          <AnimatePresence mode="wait">
            {view === "client" ? (
              <motion.div
                key="client"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
                className="bento-card overflow-hidden p-8 md:p-12"
              >
                <div className="mx-auto max-w-lg">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                      <Globe className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted">yourbusiness.com</span>
                    </div>
                    <div className="mt-6 space-y-4">
                      <div className="h-8 w-3/4 rounded-lg bg-white/10" />
                      <div className="h-4 w-full rounded bg-white/5" />
                      <div className="h-4 w-5/6 rounded bg-white/5" />
                      <div className="mt-6 grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                          <ShoppingBag className="h-5 w-5 text-primary" />
                          <span className="text-xs text-muted">Store</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                          <LayoutDashboard className="h-5 w-5 text-primary" />
                          <span className="text-xs text-muted">Dashboard</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                          <Globe className="h-5 w-5 text-primary" />
                          <span className="text-xs text-muted">Pages</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 text-center text-sm text-muted">
                    The polished storefront your customers interact with every day.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="infra"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
                className="bento-card p-8 md:p-12"
              >
                <div className="mx-auto max-w-xl space-y-3">
                  {infraLayers.map((layer, index) => {
                    const Icon = layer.icon;
                    return (
                      <motion.div
                        key={layer.label}
                        initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: easeOutExpo,
                          delay: reduceMotion ? 0 : index * 0.08,
                        }}
                        className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4"
                      >
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{layer.label}</p>
                          <p className="mt-1 text-sm text-muted">{layer.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Reveal className="mt-10 text-center" delay={0.15}>
          <p className="mx-auto max-w-2xl text-lg text-muted-light">
            {surfaceVsDepth.realityPivot}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
