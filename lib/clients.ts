export type ClientCaseStudy = {
  id: string;
  name: string;
  url: string;
  industry: string;
  headline: string;
  description: string;
  tags: string[];
  accent: string;
};

export const clientCaseStudies: ClientCaseStudy[] = [
  {
    id: "jerzyfy",
    name: "Jerzyfy",
    url: "https://www.jerzyfy.in/",
    industry: "Retail / Sportswear",
    headline: "From online store to full retail operations",
    description:
      "End-to-end digital setup for a football jersey brand — storefront, admin panel, ERP, and POS working as one unified system.",
    tags: ["Storefront", "Admin Panel", "ERP", "POS"],
    accent: "from-blue-600/20 to-primary/10",
  },
  {
    id: "yathartha-foods",
    name: "Yathartha Foods",
    url: "https://yatharthafoods.in/",
    industry: "Food Production",
    headline: "Recipe-driven inventory at enterprise scale",
    description:
      "Custom recipe management and inventory-level tracking built for food production — enterprise-grade software, not off-the-shelf templates.",
    tags: ["Recipe Management", "Inventory", "Custom Software", "Enterprise Web"],
    accent: "from-emerald-600/20 to-primary/10",
  },
];
