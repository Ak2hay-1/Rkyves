import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/content/site";

type RkyvesLogoProps = {
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
};

const sizes = {
  sm: { height: 28, width: 120, text: "text-lg" },
  md: { height: 36, width: 150, text: "text-xl" },
  lg: { height: 44, width: 180, text: "text-2xl" },
};

export default function RkyvesLogo({
  size = "md",
  variant = "dark",
}: RkyvesLogoProps) {
  const s = sizes[size];
  const src = variant === "light" ? "/logo-light.png" : "/logo-dark.png";

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-ink transition-opacity hover:opacity-80"
      aria-label={`${siteConfig.name} home`}
    >
      <Image
        src={src}
        alt=""
        width={s.height}
        height={s.height}
        className="h-[1.1em] w-auto"
        priority
      />
      <span className={`font-display font-semibold tracking-tight ${s.text}`}>
        {siteConfig.name}
      </span>
    </Link>
  );
}
