export type CaseStudy = {
  id: string;
  name: string;
  url: string;
  industry: string;
  headline: string;
  description: string;
  challenge: string;
  solution: string;
  outcomes: string[];
  stack: string[];
  tags: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "jerzyfy",
    name: "Jerzyfy",
    url: "https://www.jerzyfy.in/",
    industry: "Retail / Sportswear",
    headline: "From online store to full retail operations",
    description:
      "End-to-end digital setup for a football jersey brand — storefront, admin panel, ERP, and POS working as one unified system.",
    challenge:
      "Jerzyfy needed more than a template storefront. Inventory, orders, and in-store sales had to stay in sync as the brand grew across channels.",
    solution:
      "Rkyves delivered a custom storefront with an admin panel, then connected ERP and POS so retail and online operations share one source of truth.",
    outcomes: [
      "Unified storefront and back-office operations",
      "Admin tools for catalogue and order management",
      "ERP and POS integrated with the online channel",
    ],
    stack: ["Custom storefront", "Admin panel", "ERP", "POS"],
    tags: ["Storefront", "Admin Panel", "ERP", "POS"],
  },
  {
    id: "yathartha-foods",
    name: "Yathartha Foods",
    url: "https://yatharthafoods.in/",
    industry: "Food Production",
    headline: "Recipe-driven inventory at production scale",
    description:
      "Custom recipe management and inventory-level tracking built for food production — enterprise-grade software, not off-the-shelf templates.",
    challenge:
      "Food production depends on recipes, batch yields, and inventory accuracy. Generic tools could not model how Yathartha Foods actually operates.",
    solution:
      "Rkyves built custom software for recipe management and inventory tracking, designed around production workflows rather than generic e-commerce assumptions.",
    outcomes: [
      "Recipe-driven inventory tracking",
      "Software aligned to production workflows",
      "A foundation that can grow with the business",
    ],
    stack: ["Custom web app", "Recipe management", "Inventory"],
    tags: ["Recipe Management", "Inventory", "Custom Software", "Enterprise Web"],
  },
];

export function getCaseStudy(id: string) {
  return caseStudies.find((c) => c.id === id);
}
