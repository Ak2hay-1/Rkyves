export type PricingPackage = {
  id: string;
  name: string;
  tagline: string;
  bestFor: string;
  range: string;
  includes: string[];
  highlighted?: boolean;
};

export const pricingPackages: PricingPackage[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "A professional online presence you can grow from.",
    bestFor: "New brands and local businesses launching their first site",
    range: "Project-based — quote on scope",
    includes: [
      "Custom marketing website",
      "Mobile-first responsive design",
      "Contact / inquiry flows",
      "Basic SEO structure",
      "Launch support and handover",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Sell online and manage day-to-day without a developer.",
    bestFor: "Retailers and brands ready for e-commerce and admin tools",
    range: "Project-based — quote on scope",
    highlighted: true,
    includes: [
      "Everything in Starter",
      "E-commerce or catalogue storefront",
      "Admin panel for products and orders",
      "Payment / WhatsApp integrations as needed",
      "Training for your team",
    ],
  },
  {
    id: "operations",
    name: "Operations",
    tagline: "Website plus the systems that run the business.",
    bestFor: "Growing companies that need ERP, POS, or custom software",
    range: "Custom engagement",
    includes: [
      "Everything in Growth",
      "ERP / POS or custom business software",
      "Workflow and inventory integrations",
      "Hosting and infrastructure setup",
      "Ongoing care plan options",
    ],
  },
];

export const carePlanNote =
  "After launch, optional care plans cover hosting, monitoring, backups, security updates, and technical support — so the system stays alive while you focus on the business.";
