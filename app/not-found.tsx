import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GradientWaves from "@/components/GradientWaves";
import RkyvesLogo from "@/components/RkyvesLogo";
import { cullinosProduct } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="hero-glow relative flex min-h-[80vh] flex-1 flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-36 text-center">
        <GradientWaves />
        <div className="relative flex flex-col items-center">
          <RkyvesLogo size="lg" href={undefined} />
          <p className="mt-10 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-7xl font-bold tracking-tight text-transparent md:text-8xl">
            404
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            This page isn&apos;t in our archives
          </h1>
          <p className="mt-4 max-w-md text-muted md:text-lg">
            The link may be outdated or the page has moved. Here are a few
            places to pick up from.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/"
              className="pill-btn-filled inline-flex min-h-12 items-center gap-2 px-7 py-3 text-sm font-medium text-foreground"
            >
              Back to home
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="pill-btn inline-flex min-h-12 items-center px-7 py-3 text-sm font-medium text-muted-light hover:text-foreground"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="pill-btn inline-flex min-h-12 items-center px-7 py-3 text-sm font-medium text-muted-light hover:text-foreground"
            >
              Contact
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted">
            Looking for restaurant software?{" "}
            <Link href="/cullinos" className="text-foreground underline underline-offset-4 hover:text-primary">
              Cullinos
            </Link>{" "}
            or visit{" "}
            <a
              href={cullinosProduct.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:text-primary"
            >
              cullinos.com
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
