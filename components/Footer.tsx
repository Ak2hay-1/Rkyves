import Link from "next/link";
import RkyvesLogo from "@/components/RkyvesLogo";
import { getWhatsAppUrl, siteConfig } from "@/lib/constants";

const footerLinks = {
  Company: [
    { label: "About", href: "/about", external: false },
    { label: "Services", href: "/services", external: false },
    { label: "Contact", href: "/contact", external: false },
  ],
  Product: [
    { label: "Cullinos Restaurant OS", href: "/cullinos", external: false },
    { label: "Websites & Stores", href: "/services", external: false },
    { label: "Admin Panel", href: "/services", external: false },
    { label: "Hosting", href: "/services", external: false },
  ],
  Resources: [
    { label: "Case Studies", href: "/#clients", external: false },
    { label: "Why Rkyves", href: "/about", external: false },
  ],
  Services: [
    { label: "Book a Demo", href: "/contact", external: false },
    { label: "Contact", href: "/contact", external: false },
    { label: "WhatsApp", href: getWhatsAppUrl(), external: true },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <RkyvesLogo size="lg" />

        <div className="mt-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-medium text-muted">{heading}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link text-sm text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="footer-link text-sm text-foreground/80 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-muted sm:flex-row">
          <p>
            Copyright &copy; {year} {siteConfig.name}. All Rights Reserved
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="footer-link hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="footer-link hover:text-foreground">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
