import Link from "next/link";
import RkyvesLogo from "@/components/RkyvesLogo";
import { contactInfo, getWhatsAppUrl, siteConfig } from "@/lib/content/site";
import { services } from "@/lib/content/services";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const resourceLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Book a call", href: "/contact#book" },
  { label: "WhatsApp", href: getWhatsAppUrl() },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="section-rule mt-auto bg-surface-muted/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="max-w-md">
          <RkyvesLogo size="lg" />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {siteConfig.tagline} We build and maintain the technology behind
            growing businesses — from the first website to full operations.
          </p>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink/80 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Services
            </h3>
            <ul className="mt-4 space-y-3">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services#${service.id}`}
                    className="text-sm text-ink/80 transition-colors hover:text-accent"
                  >
                    {service.title.replace("Professional ", "").split("&")[0].trim()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink/80 transition-colors hover:text-accent"
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-ink/80">
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-accent"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} className="hover:text-accent">
                  {contactInfo.phone}
                </a>
              </li>
              <li>{contactInfo.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-muted sm:flex-row sm:items-center">
          <p>
            Copyright &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-ink">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
