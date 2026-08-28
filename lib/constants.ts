import {
  Globe,
  LayoutDashboard,
  Plug,
  MonitorSmartphone,
  Cloud,
  type LucideIcon,
} from "lucide-react";

export const siteConfig = {
  name: "Rkyves",
  tagline: "Technology built around your business.",
  description:
    "Rkyves is a technology and digital solutions company that helps businesses build, manage, and grow their digital presence.",
  url: "https://rkyves.com",
  pronunciation: "archives",
};

export const surfaceVsDepth = {
  headline: "Building a website is easy. Keeping it alive is not.",
  subheadline:
    "Templates get you online in an afternoon. Security, monitoring, backups, and uptime — that's where businesses actually struggle. Rkyves handles the part nobody sees.",
  toggleClient: "What clients see",
  toggleInfra: "What we manage",
  layersHeadline: "This is what happens after launch",
  layersSubheadline:
    "Every layer below the surface requires expertise, tooling, and ongoing attention.",
  realityPivot:
    "DIY tools give you the surface. Rkyves owns the depth — so you can focus on your business.",
  clientsHeading: "Built for real businesses",
  clientsSubheading:
    "Enterprise software and web — from storefront to back office.",
  servicesHeading: "We handle what DIY tools don't",
  servicesSubheading:
    "The visible website is just the beginning. We manage everything underneath.",
  ctaHeading: "Stop managing infrastructure. Start growing.",
  ctaSubheading:
    "Let Rkyves build and maintain the technology behind your business — from your first website to full enterprise operations.",
};

export const contactInfo = {
  email: "sales@rkyves.com",
  phone: "+91 74992 49403",
  whatsapp: "+917499249403",
  whatsappMessage: "Hello Rkyves, I would like to discuss a project.",
  address: "India",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export type Service = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: LucideIcon;
  features: string[];
};

export const services: Service[] = [
  {
    id: "websites",
    title: "Professional Websites & Online Stores",
    shortDescription:
      "Modern, mobile-friendly websites and e-commerce stores tailored to your brand.",
    description:
      "We create modern, mobile-friendly and professionally designed websites and e-commerce stores tailored to each business. Your website is designed around your brand, products, and customers — not around a fixed template.",
    icon: Globe,
    features: [
      "Custom design tailored to your brand",
      "Mobile-first responsive layouts",
      "E-commerce and online store setup",
      "Product catalogues and collections",
      "SEO-friendly structure",
    ],
  },
  {
    id: "admin-panel",
    title: "Powerful Admin Panel",
    shortDescription:
      "Manage products, orders, content and business data without technical knowledge.",
    description:
      "Every website can be connected to an easy-to-use administration system where you can manage products, catalogues, orders, content and other business information without needing technical knowledge.",
    icon: LayoutDashboard,
    features: [
      "Product and catalogue management",
      "Order tracking and fulfillment",
      "Content and page management",
      "User-friendly dashboard",
      "No coding required",
    ],
  },
  {
    id: "integrations",
    title: "Business Integrations",
    shortDescription:
      "Payment gateways, WhatsApp, SEO tools, and business-specific functionality.",
    description:
      "We can integrate essential services such as payment gateways, WhatsApp, SEO tools, product/catalogue migration and other business-specific functionality.",
    icon: Plug,
    features: [
      "Payment gateway integration",
      "WhatsApp business connectivity",
      "SEO tools and optimization",
      "Product and catalogue migration",
      "Custom business workflows",
    ],
  },
  {
    id: "erp-pos",
    title: "Business Software & ERP/POS",
    shortDescription:
      "ERP and POS solutions to manage day-to-day operations efficiently.",
    description:
      "Rkyves also develops business software such as ERP and POS solutions to help businesses manage their day-to-day operations more efficiently.",
    icon: MonitorSmartphone,
    features: [
      "Inventory management",
      "Point of sale systems",
      "Sales and purchase tracking",
      "Reporting and analytics",
      "Multi-location support",
    ],
  },
  {
    id: "hosting",
    title: "Hosting & Infrastructure",
    shortDescription:
      "Hosting, deployment, maintenance and ongoing technical support.",
    description:
      "We take care of the technical infrastructure behind your digital presence, including hosting, deployment, maintenance and ongoing technical support.",
    icon: Cloud,
    features: [
      "Reliable cloud hosting",
      "Automated deployment",
      "Regular maintenance and updates",
      "Performance monitoring",
      "Ongoing technical support",
    ],
  },
];

export const approachItems = [
  "Custom design instead of generic templates",
  "Simple and practical business management",
  "Scalable technology",
  "Reliable hosting and infrastructure",
  "Continuous improvements and support",
  "Solutions tailored to your business requirements",
];

export const whyRkyves = {
  title: "Why Rkyves?",
  paragraphs: [
    "We don't believe in simply delivering a website and leaving you to figure everything out yourself.",
    "Our approach is to understand how your business actually operates and then provide technology that supports that workflow.",
    "Whether you are a retailer, manufacturer, service provider, restaurant, startup or growing business, we aim to provide a solution that can grow with you.",
  ],
};

export const aboutContent = {
  whatIs: {
    title: "What is Rkyves?",
    paragraphs: [
      "Rkyves is a technology and digital solutions company that helps businesses build, manage, and grow their digital presence.",
      "We believe that a business should not have to depend on multiple complicated tools, developers, and platforms to manage its online operations. Rkyves brings the essential digital solutions together into one reliable ecosystem.",
    ],
  },
  vision: {
    title: "Our Vision",
    quote:
      "To make professional technology accessible to every growing business.",
    description:
      "Rkyves is building a long-term technology ecosystem where a business can start with a website and gradually add e-commerce, business management, ERP, POS and other digital capabilities as it grows.",
  },
  ecosystem: [
    { step: "Website", description: "Start with a professional online presence" },
    { step: "E-commerce", description: "Add online selling capabilities" },
    { step: "Admin Panel", description: "Manage everything from one place" },
    { step: "ERP / POS", description: "Scale with business management tools" },
  ],
};

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
