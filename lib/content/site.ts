export const siteConfig = {
  name: "Rkyves",
  tagline: "Technology built around your business.",
  description:
    "Rkyves is a technology and digital solutions company that helps businesses build, manage, and grow their digital presence — from websites and stores to ERP, POS, and ongoing infrastructure care.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rkyves.com",
  pronunciation: "archives",
};

export const contactInfo = {
  email: "sales@rkyves.com",
  phone: "+91 74992 49403",
  whatsapp: "+917499249403",
  whatsappMessage: "Hello Rkyves, I would like to discuss a project.",
  address: "India",
  /** Set NEXT_PUBLIC_CAL_URL to enable the booking embed on /contact */
  calUrl: process.env.NEXT_PUBLIC_CAL_URL ?? "",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const serviceInterestOptions = [
  { value: "", label: "Select a service (optional)" },
  { value: "websites", label: "Websites & Online Stores" },
  { value: "admin-panel", label: "Admin Panel" },
  { value: "integrations", label: "Business Integrations" },
  { value: "erp-pos", label: "ERP / POS Software" },
  { value: "hosting", label: "Hosting & Infrastructure" },
  { value: "other", label: "Other / Not sure yet" },
];

export function getWhatsAppUrl(message?: string) {
  const phone = contactInfo.whatsapp.replace(/\D/g, "");
  const text = encodeURIComponent(message ?? contactInfo.whatsappMessage);
  return `https://wa.me/${phone}?text=${text}`;
}

export function getMailtoUrl(subject = "Inquiry from Rkyves Website") {
  return `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}`;
}
