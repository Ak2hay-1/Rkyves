import {
  Shield,
  Activity,
  DatabaseBackup,
  Rocket,
  Headphones,
  type LucideIcon,
} from "lucide-react";

export type InfrastructureLayer = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
  label: string;
};

export const infrastructureLayers: InfrastructureLayer[] = [
  {
    id: "security",
    title: "Security",
    label: "SSL/TLS · Firewall",
    description:
      "Threats don't wait for business hours. SSL certificates, firewall rules, patch management, and access controls run continuously in the background.",
    bullets: [
      "SSL/TLS and certificate renewal",
      "Firewall and DDoS protection",
      "Security patches and hardening",
    ],
    icon: Shield,
  },
  {
    id: "monitoring",
    title: "Monitoring",
    label: "Uptime · Alerts",
    description:
      "A website without monitoring fails silently. We track uptime, performance, and errors — and alert before your customers notice.",
    bullets: [
      "24/7 uptime monitoring",
      "Performance and error tracking",
      "Instant alert notifications",
    ],
    icon: Activity,
  },
  {
    id: "backups",
    title: "Backups",
    label: "Snapshots · Recovery",
    description:
      "Backups you never test aren't backups. Automated snapshots, off-site storage, and tested recovery paths protect your business data.",
    bullets: [
      "Automated daily snapshots",
      "Off-site backup storage",
      "Disaster recovery planning",
    ],
    icon: DatabaseBackup,
  },
  {
    id: "deployment",
    title: "Deployment",
    label: "CI/CD · Zero-downtime",
    description:
      "Updates shouldn't break production. Controlled deployments, staging environments, and rollback strategies keep your site live during changes.",
    bullets: [
      "Automated deployment pipelines",
      "Staging before production",
      "Zero-downtime updates",
    ],
    icon: Rocket,
  },
  {
    id: "support",
    title: "Support",
    label: "Maintenance · Scale",
    description:
      "Launch day is just the start. Ongoing maintenance, scaling, and technical support keep your digital operations running as you grow.",
    bullets: [
      "Regular maintenance and updates",
      "Performance optimization",
      "Ongoing technical support",
    ],
    icon: Headphones,
  },
];

export const realityCheckItems = [
  {
    id: "monitoring",
    headline: "A website without monitoring fails silently",
    detail:
      "Downtime, slow pages, and broken checkout flows cost sales before anyone tells you.",
  },
  {
    id: "backups",
    headline: "Backups you never test aren't backups",
    detail:
      "Data loss from a bad update or server failure can shut down operations overnight.",
  },
  {
    id: "security",
    headline: "Security isn't a one-time setup",
    detail:
      "Certificates expire, vulnerabilities emerge, and attacks increase as your business grows.",
  },
];
