import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import { contactInfo, siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms governing use of the ${siteConfig.name} website and related services.`,
};

const lastUpdated = "August 24, 2026";

export default function TermsPage() {
  return (
    <>
      <Hero
        compact
        title="Terms & Conditions"
        subtitle={`Please read these terms carefully before using the ${siteConfig.name} website or engaging our services.`}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-10 px-4 text-muted leading-relaxed sm:px-6">
          <p className="text-sm text-muted-light">Last updated: {lastUpdated}</p>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Agreement</h2>
            <p>
              By accessing{" "}
              <Link href="/" className="text-primary hover:underline">
                {siteConfig.url}
              </Link>{" "}
              or contacting us for services, you agree to these Terms &amp; Conditions and our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              . If you do not agree, do not use the site.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. Who we are</h2>
            <p>
              {siteConfig.name} provides technology and digital solutions for businesses. Contact:{" "}
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-primary hover:underline"
              >
                {contactInfo.email}
              </a>
              . Location: {contactInfo.address}.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. Website use</h2>
            <p>
              Content on this website is for general information about our company and offerings.
              You may not use the site to attempt unauthorised access, disrupt service, scrape
              content at scale, or misuse contact channels for spam or unlawful purposes.
            </p>
            <p>
              We may change, suspend, or discontinue any part of the site without notice. We do not
              guarantee uninterrupted or error-free availability.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Services and proposals</h2>
            <p>
              Descriptions of services on this website are summaries only. Binding scope, timeline,
              fees, and deliverables for any project are set out in a separate proposal, statement
              of work, invoice, or written agreement between you and {siteConfig.name}.
            </p>
            <p>
              Quotes and estimates are valid only for the period stated (or a reasonable period if
              none is stated) and may change if requirements change.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">5. Client responsibilities</h2>
            <p>When you engage us for a project, you agree to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide accurate information, content, and access needed for delivery</li>
              <li>Obtain rights to materials you supply (logos, copy, images, data)</li>
              <li>Respond to review and approval requests within agreed timelines</li>
              <li>Pay fees according to the agreed payment schedule</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">6. Intellectual property</h2>
            <p>
              Site design, branding, copy, and materials owned by {siteConfig.name} remain our
              property unless transferred in writing. Client project deliverables are licensed or
              assigned as stated in the project agreement. Until full payment, we may retain rights
              or withhold final assets as agreed in writing.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">7. Third-party services</h2>
            <p>
              Projects may rely on third-party platforms (hosting, domains, payment gateways,
              analytics, email providers, and similar). Those services are governed by their own
              terms. We are not responsible for outages, policy changes, or fees charged by third
              parties unless our agreement expressly says otherwise.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">8. Disclaimer</h2>
            <p>
              The website and its content are provided &quot;as is&quot; without warranties of any
              kind, express or implied, to the fullest extent permitted by law. We do not warrant
              that information on the site is complete, current, or suitable for a particular
              purpose.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">9. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, {siteConfig.name} is not liable for indirect,
              incidental, special, consequential, or punitive damages, or for loss of profits,
              data, or business opportunity, arising from use of the website or our services.
              Liability for paid project work is limited as set out in the applicable project
              agreement; if none applies, our aggregate liability related to the website is limited
              to the amount you paid us (if any) for the specific service giving rise to the claim
              in the three months before the claim.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">10. Governing law</h2>
            <p>
              These terms are governed by the laws of India, without regard to conflict-of-law
              rules. Courts in India shall have exclusive jurisdiction, subject to any mandatory
              consumer protections that apply where you live.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">11. Changes</h2>
            <p>
              We may update these Terms &amp; Conditions from time to time. The &quot;Last
              updated&quot; date will change when we do. Continued use of the site after changes
              constitutes acceptance of the revised terms. Project agreements already signed are
              not changed by website terms alone unless both parties agree in writing.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">12. Contact</h2>
            <p>
              Questions about these terms:{" "}
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-primary hover:underline"
              >
                {contactInfo.email}
              </a>{" "}
              or our{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact
              </Link>{" "}
              page.
            </p>
          </div>

          <p className="border-t border-border pt-8 text-sm">
            See also our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
