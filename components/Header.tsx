"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import RkyvesLogo from "@/components/RkyvesLogo";
import { navLinks } from "@/lib/content/site";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <RkyvesLogo size="sm" />

        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/contact#book" className="btn-primary text-sm">
            Book a call
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded p-2 text-ink lg:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          className="border-t border-border bg-surface px-4 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded px-3 py-3 text-sm font-medium text-ink hover:bg-surface-muted"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact#book"
              className="btn-primary mt-3 w-full"
              onClick={() => setMobileOpen(false)}
            >
              Book a call
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
