import {
  Globe,
  LayoutDashboard,
  Plug,
  MonitorSmartphone,
  Cloud,
  type LucideIcon,
} from "lucide-react";

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
      "We integrate essential services such as payment gateways, WhatsApp, SEO tools, product/catalogue migration and other business-specific functionality.",
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
      "Rkyves develops business software such as ERP and POS solutions to help businesses manage day-to-day operations more efficiently — inventory, sales, purchases, and reporting in one system.",
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
      "We take care of the technical infrastructure behind your digital presence, including hosting, deployment, maintenance and ongoing technical support — so your systems stay secure, monitored, and recoverable.",
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
