"use client";

import { useState } from "react";
import { homeContent } from "@/lib/content/home";
import { infrastructureLayers } from "@/lib/content/infrastructure";

export default function SurfaceDepth() {
  const [mode, setMode] = useState<"surface" | "depth">("surface");
  const { surfaceDepth } = homeContent;

  return (
    <section className="section-rule py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMode("surface")}
            className={`rounded px-4 py-2 text-sm font-semibold transition-colors ${
              mode === "surface"
                ? "bg-accent text-on-accent"
                : "border border-border bg-surface text-muted hover:text-ink"
            }`}
          >
            {surfaceDepth.surfaceLabel}
          </button>
          <button
            type="button"
            onClick={() => setMode("depth")}
            className={`rounded px-4 py-2 text-sm font-semibold transition-colors ${
              mode === "depth"
                ? "bg-accent text-on-accent"
                : "border border-border bg-surface text-muted hover:text-ink"
            }`}
          >
            {surfaceDepth.depthLabel}
          </button>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              {mode === "surface"
                ? surfaceDepth.surfaceTitle
                : surfaceDepth.depthTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
              {mode === "surface"
                ? surfaceDepth.surfaceBody
                : surfaceDepth.depthBody}
            </p>
            <p className="mt-6 border-l-2 border-accent pl-4 text-base font-medium text-ink">
              {surfaceDepth.pivot}
            </p>
          </div>

          <div className="border border-border bg-surface p-6 md:p-8">
            {mode === "surface" ? (
              <div className="space-y-4">
                <div className="h-3 w-24 rounded bg-accent/30" />
                <div className="h-8 w-3/4 rounded bg-surface-muted" />
                <div className="h-4 w-full rounded bg-surface-muted" />
                <div className="h-4 w-5/6 rounded bg-surface-muted" />
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded border border-border bg-surface-muted"
                    />
                  ))}
                </div>
                <p className="pt-4 text-sm text-muted">
                  Brand, layout, and customer-facing experience — the part
                  everyone notices.
                </p>
              </div>
            ) : (
              <ul className="space-y-5">
                {infrastructureLayers.map((layer) => {
                  const Icon = layer.icon;
                  return (
                    <li key={layer.id} className="flex gap-4">
                      <Icon
                        className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                        aria-hidden
                      />
                      <div>
                        <p className="font-semibold text-ink">{layer.title}</p>
                        <p className="text-xs uppercase tracking-wide text-muted">
                          {layer.label}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          {layer.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
