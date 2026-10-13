import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Page not found</h1>
        <p className="mt-4 max-w-md text-muted">
          That link may be outdated or the page moved. Try one of these instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="pill-btn-filled">
            Home
          </Link>
          <Link href="/services" className="pill-btn">
            Services
          </Link>
          <Link href="/contact" className="pill-btn">
            Contact
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
