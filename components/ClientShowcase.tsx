import SectionHeading from "@/components/SectionHeading";
import ClientCard from "@/components/ClientCard";
import { clientCaseStudies } from "@/lib/clients";
import { surfaceVsDepth } from "@/lib/constants";
import Reveal from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

export default function ClientShowcase() {
  return (
    <section id="clients" className="border-y border-border bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            title={surfaceVsDepth.clientsHeading}
            subtitle={surfaceVsDepth.clientsSubheading}
          />
        </Reveal>
        <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clientCaseStudies.map((client) => (
            <StaggerItem key={client.id}>
              <ClientCard client={client} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
