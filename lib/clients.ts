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
    tags: ["Storefront", "Admin Panel", "Cullinos POS", "Cullinos ERP"],
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
  {
    id: "cullinos",
    name: "Cullinos",
    url: "https://cullinos.com",
    industry: "Restaurant OS",
    headline: "POS, kitchen, and inventory in one platform",
    description:
      "All-in-one restaurant operating system — POS, kitchen display, waiter app, guest ordering, inventory, and GST billing from a single cloud backend.",
    tags: ["POS", "Kitchen Display", "QR Ordering", "GST Billing"],
    accent: "from-amber-500/20 to-primary/10",
  },
];
