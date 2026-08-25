import Link from "next/link";
import type { Service } from "@/lib/content/services";

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <Link
      href={`/services#${service.id}`}
      className="group block border border-border bg-surface p-6 transition-colors hover:border-accent"
    >
      <Icon className="h-6 w-6 text-accent" aria-hidden />
      <h3 className="mt-4 font-display text-lg font-semibold text-ink group-hover:text-accent">
        {service.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {service.shortDescription}
      </p>
    </Link>
  );
}
