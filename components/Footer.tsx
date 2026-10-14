import Link from "next/link";
import RkyvesLogo from "@/components/RkyvesLogo";
import {
  contactInfo,
  cullinosProduct,
  getMailtoUrl,
  getTelUrl,
  getWhatsAppUrl,
  services,
  siteConfig,
} from "@/lib/constants";

type FooterLink = { label: string; href: string };

const footerLinks: Record<string, FooterLink[]> = {
  Company: [
    { label: "About", href: "/about" },
    { label: "Case Studies", href: "/#clients" },
    { label: "Why Rkyves", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Services: services.map((service) => ({
    label: service.title,
    href: `/services#${service.id}`,
  })),
  Products: [
    { label: "Cullinos Restaurant OS", href: "/cullinos" },
    { label: "cullinos.com", href: cullinosProduct.url },
  ],
  "Get in touch": [
    { label: "Book a Demo", href: "/contact" },
    { label: contactInfo.email, href: getMailtoUrl() },
    { label: contactInfo.phone, href: getTelUrl() },
    { label: "WhatsApp", href: getWhatsAppUrl() },
  ],
};

const linkClass =
  "footer-link text-sm text-foreground/80 transition-colors hover:text-foreground";

function FooterAnchor({ label, href }: FooterLink) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={linkClass}>
        {label}
      </Link>
    );
  }

  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={`${linkClass} break-words`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 pb-28 pt-12 md:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <RkyvesLogo size="lg" />

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-12 md:grid-cols-4">
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-medium text-muted">{heading}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <FooterAnchor {...link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-center text-xs text-muted sm:flex-row sm:text-left md:mt-12">
          <p>
            Copyright &copy; {year} {siteConfig.name}. All Rights Reserved
            <span className="mx-2 hidden sm:inline" aria-hidden="true">
              ·
            </span>
            <a
              href={cullinosProduct.url}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link mt-1 block hover:text-foreground sm:mt-0 sm:inline"
            >
              Cullinos, by Rkyves
            </a>
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
