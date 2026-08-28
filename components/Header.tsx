"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, ChevronRight } from "lucide-react";
import RkyvesLogo from "@/components/RkyvesLogo";
import { navLinks } from "@/lib/constants";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-5 md:pt-6">
      <div className="pill-nav flex w-full max-w-4xl items-center justify-between rounded-full px-4 py-2.5 md:px-5 md:py-3">
        <RkyvesLogo size="sm" />

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-light transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/contact"
            className="pill-btn inline-flex min-h-9 items-center gap-1 px-4 py-2 text-sm font-medium text-foreground"
          >
            Get in Touch
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full p-2 text-foreground md:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <nav
          className="absolute left-4 right-4 top-[calc(100%+0.5rem)] rounded-2xl border border-border-light bg-surface/95 p-4 backdrop-blur-xl md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-sm text-foreground hover:bg-white/5"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="pill-btn-filled mt-2 inline-flex min-h-11 items-center justify-center gap-1 px-4 py-3 text-sm font-medium text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Get in Touch
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
