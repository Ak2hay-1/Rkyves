import Link from "next/link";
import type { Service } from "@/lib/constants";

type ServiceCardProps = {
  service: Service;
  showLink?: boolean;
};

export default function ServiceCard({ service, showLink = true }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-foreground">
        {service.title}
      </h3>
      <p className="mb-4 flex-1 text-muted leading-relaxed">
        {service.shortDescription}
      </p>
      {showLink && (
        <Link
          href="/services"
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-hover transition-colors"
        >
          Learn more
          <span className="ml-1 transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </article>
  );
}
