"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/content/site";
import { trackEvent } from "@/lib/analytics";

export default function WhatsAppButton() {
  return (
    <Link
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click")}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded bg-accent px-4 py-3 text-sm font-semibold text-on-accent shadow-lg transition-transform hover:scale-[1.02] hover:bg-accent-hover md:bottom-8 md:right-8"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span className="hidden sm:inline">WhatsApp</span>
    </Link>
  );
}
