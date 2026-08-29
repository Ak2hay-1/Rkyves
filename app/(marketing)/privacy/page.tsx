import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import { contactInfo, siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects your information.`,
};

const lastUpdated = "August 24, 2026";

export default function PrivacyPage() {
  return (
    <>
      <Hero
        compact
        title="Privacy Policy"
        subtitle={`How ${siteConfig.name} collects, uses, and protects information when you use our website and services.`}
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl space-y-10 px-4 text-muted leading-relaxed sm:px-6">
          <p className="text-sm text-muted-light">Last updated: {lastUpdated}</p>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Who we are</h2>
            <p>
              {siteConfig.name} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website at{" "}
              <Link href="/" className="text-primary hover:underline">
                {siteConfig.url}
              </Link>
              . We provide technology and digital solutions for businesses, including websites,
              stores, admin tools, and related services.
            </p>
            <p>
              Contact:{" "}
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-primary hover:underline"
              >
                {contactInfo.email}
              </a>
              {contactInfo.phone ? (
                <>
                  {" "}
                  ·{" "}
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                    className="text-primary hover:underline"
                  >
                    {contactInfo.phone}
                  </a>
                </>
              ) : null}
              . Location: {contactInfo.address}.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. Information we collect</h2>
            <p>We may collect:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="text-foreground/90">Contact details</span> you submit through our
                contact form or by email/WhatsApp — such as name, email address, phone number, and
                message content.
              </li>
              <li>
                <span className="text-foreground/90">Service interest</span> if you indicate which
                offering you want to discuss.
              </li>
              <li>
                <span className="text-foreground/90">Technical data</span> that may be collected
                automatically by our hosting provider (for example IP address, browser type, and
                pages visited) for security, performance, and analytics.
              </li>
            </ul>
            <p>We do not knowingly collect personal information from children under 16.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. How we use information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Respond to inquiries and provide quotes or project discussions</li>
              <li>Deliver and improve our website and services</li>
              <li>Send follow-up communications related to your request</li>
              <li>Maintain security, prevent abuse, and meet legal obligations</li>
            </ul>
            <p>We do not sell your personal information.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Sharing and processors</h2>
            <p>
              We may share information with trusted service providers who help us operate the site
              — for example email delivery (Resend), hosting (Vercel), and domain/DNS providers.
              These parties process data only as needed to provide their services.
            </p>
            <p>
              We may also disclose information if required by law, or to protect the rights, safety,
              and security of {siteConfig.name}, our users, or others.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">5. Retention</h2>
            <p>
              We keep inquiry and contact records for as long as needed to respond to you, manage
              ongoing work, and meet legal or accounting requirements. You may ask us to delete
              your contact details where we are not required to retain them.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">6. Security</h2>
            <p>
              We take reasonable technical and organisational measures to protect personal data.
              No method of transmission or storage is completely secure; please use strong unique
              passwords for any accounts we provide as part of a project.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">7. Your choices</h2>
            <p>
              You may request access to, correction of, or deletion of personal information we hold
              about you, or ask questions about this policy, by emailing{" "}
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-primary hover:underline"
              >
                {contactInfo.email}
              </a>
              . Depending on your location, additional rights may apply under applicable law.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">8. External links</h2>
            <p>
              Our site may link to third-party websites (including client projects). We are not
              responsible for the privacy practices of those sites. Review their policies before
              sharing information with them.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">9. Changes</h2>
            <p>
              We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date
              at the top of this page will change when we do. Continued use of the site after
              changes means you accept the updated policy.
            </p>
          </div>

          <p className="border-t border-border pt-8 text-sm">
            See also our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
