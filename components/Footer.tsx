import Link from "next/link";
import RkyvesLogo from "@/components/RkyvesLogo";
import { siteConfig } from "@/lib/constants";

const footerLinks = {
  Company: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ],
  Product: [
    { label: "Cullinos Restaurant OS", href: "/cullinos" },
    { label: "Websites & Stores", href: "/services" },
    { label: "Admin Panel", href: "/services" },
    { label: "Hosting", href: "/services" },
  ],
  Resources: [
    { label: "Case Studies", href: "/#clients" },
    { label: "Why Rkyves", href: "/about" },
  ],
  Services: [
    { label: "Book a Demo", href: "/contact" },
    { label: "Contact", href: "/contact" },
    { label: "WhatsApp", href: "/contact" },
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
                    <Link
                      href={link.href}
                      className="footer-link text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
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
