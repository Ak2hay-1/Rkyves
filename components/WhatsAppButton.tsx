"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/constants";

type WhatsAppButtonProps = {
  floating?: boolean;
  className?: string;
  label?: string;
};

export default function WhatsAppButton({
  floating = true,
  className = "",
  label = "Chat on WhatsApp",
}: WhatsAppButtonProps) {
  const pathname = usePathname();

  if (floating && pathname === "/contact") {
    return null;
  }

  const baseClasses = floating
    ? "fixed bottom-6 right-6 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl whatsapp-pulse"
    : "inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1fb855]";

  return (
    <Link
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${className}`}
      aria-label={label}
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className={floating ? "hidden sm:inline" : ""}>{label}</span>
    </Link>
  );
}
