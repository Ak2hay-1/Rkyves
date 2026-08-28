import { ExternalLink } from "lucide-react";
import type { ClientCaseStudy } from "@/lib/clients";

type ClientCardProps = {
  client: ClientCaseStudy;
};

export default function ClientCard({ client }: ClientCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-primary/30">
      <div
        className={`h-2 bg-gradient-to-r ${client.accent}`}
        aria-hidden="true"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">
              {client.industry}
            </p>
            <h3 className="mt-2 text-xl font-bold text-foreground">
              {client.name}
            </h3>
          </div>
          <a
            href={client.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-primary/40 hover:text-primary"
            aria-label={`Visit ${client.name} website`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        <p className="mt-4 font-medium text-foreground">{client.headline}</p>
        <p className="mt-2 flex-1 text-sm text-muted leading-relaxed">
          {client.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {client.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-foreground/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
