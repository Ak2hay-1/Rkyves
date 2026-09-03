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

  if (!floating) {
    return (
      <Link
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex w-fit max-w-fit items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1fb855] ${className}`}
        aria-label={label}
      >
        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-all duration-300 hover:w-auto hover:gap-2 hover:px-5 hover:shadow-[0_10px_36px_rgba(37,211,102,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 ${className}`}
    >
      <MessageCircle className="h-6 w-6 shrink-0" aria-hidden="true" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[10rem] group-hover:opacity-100 group-focus-visible:max-w-[10rem] group-focus-visible:opacity-100">
        {label}
      </span>
    </Link>
  );
}
