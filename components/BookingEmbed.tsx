"use client";

import Link from "next/link";
import { contactInfo, getWhatsAppUrl } from "@/lib/content/site";
import { trackEvent } from "@/lib/analytics";

export default function BookingEmbed() {
  const url = contactInfo.calUrl;

  if (!url) {
    return (
      <div className="border border-dashed border-border-strong bg-surface-muted/50 p-6 text-sm text-muted">
        <p className="leading-relaxed">
          Prefer a live conversation? Reach us on WhatsApp or send the inquiry
          form — we typically reply within one business day.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm"
            onClick={() => trackEvent("book_click", { via: "whatsapp_fallback" })}
          >
            WhatsApp us
          </Link>
          <a
            href={`mailto:${contactInfo.email}`}
            className="btn-secondary text-sm"
            onClick={() => trackEvent("book_click", { via: "email_fallback" })}
          >
            Email sales
          </a>
        </div>
        <p className="mt-4 text-xs text-muted-light">
          To enable an embedded calendar, set{" "}
          <code className="text-ink">NEXT_PUBLIC_CAL_URL</code> in your
          environment.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-border">
      <iframe
        src={url}
        title="Book a call with Rkyves"
        className="h-[620px] w-full"
        onLoad={() => trackEvent("book_click")}
      />
    </div>
  );
}
