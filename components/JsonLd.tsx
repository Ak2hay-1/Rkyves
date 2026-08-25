import { contactInfo, siteConfig } from "@/lib/content/site";
import { services } from "@/lib/content/services";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        email: contactInfo.email,
        telephone: contactInfo.phone,
        description: siteConfig.description,
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
          addressLocality: contactInfo.address,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
      ...services.map((service) => ({
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: { "@id": `${siteConfig.url}/#organization` },
        url: `${siteConfig.url}/services#${service.id}`,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
