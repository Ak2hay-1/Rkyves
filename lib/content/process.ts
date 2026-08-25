export type ProcessStep = {
  id: string;
  step: number;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    id: "discovery",
    step: 1,
    title: "Discovery",
    description:
      "We learn how your business actually works — products, workflows, customers, and constraints — before recommending tools or design.",
  },
  {
    id: "build",
    step: 2,
    title: "Build",
    description:
      "We design and develop around your brand and operations: website, store, admin tools, integrations, or business software as needed.",
  },
  {
    id: "launch",
    step: 3,
    title: "Launch",
    description:
      "We deploy carefully, migrate data when required, train your team, and make sure the go-live path is stable — not a one-day dump.",
  },
  {
    id: "care",
    step: 4,
    title: "Care",
    description:
      "Security, monitoring, backups, updates, and support keep systems healthy after launch. DIY tools give you the surface; we own the depth.",
  },
];

export const processIntro = {
  title: "How we work with you",
  subtitle:
    "A clear path from first conversation to long-term operations — built for retailers, manufacturers, service businesses, and growing brands in India.",
};
