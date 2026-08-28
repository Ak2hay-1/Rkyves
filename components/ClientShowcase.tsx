import SectionHeading from "@/components/SectionHeading";
import ClientCard from "@/components/ClientCard";
import { clientCaseStudies } from "@/lib/clients";
import { surfaceVsDepth } from "@/lib/constants";

export default function ClientShowcase() {
  return (
    <section id="clients" className="bg-surface py-16 md:py-24 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={surfaceVsDepth.clientsHeading}
          subtitle={surfaceVsDepth.clientsSubheading}
        />
        <div className="grid gap-6 md:grid-cols-2">
          {clientCaseStudies.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      </div>
    </section>
  );
}
