import { clientCaseStudies } from "@/lib/clients";

export default function TrustedBy() {
  return (
    <section className="border-y border-white/5 py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <p className="text-sm text-muted md:text-base">
          Trusted by growing businesses &amp; entrepreneurs
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
          {clientCaseStudies.map((client) => (
            <span
              key={client.id}
              className="text-lg font-semibold tracking-tight text-white/20 md:text-xl"
            >
              {client.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
