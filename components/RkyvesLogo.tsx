import Link from "next/link";

type RkyvesLogoProps = {
  size?: "sm" | "md" | "lg";
  href?: string;
};

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill="url(#logo-gradient)"
      />
      <defs>
        <linearGradient id="logo-gradient" x1="2" y1="2" x2="22" y2="22">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function RkyvesLogo({
  size = "md",
  href = "/",
}: RkyvesLogoProps) {
  const sizes = {
    sm: { icon: "h-5 w-5", text: "text-sm" },
    md: { icon: "h-6 w-6", text: "text-base" },
    lg: { icon: "h-8 w-8", text: "text-2xl" },
  };

  const s = sizes[size];

  const content = (
    <span className="inline-flex items-center gap-2">
      <LogoIcon className={s.icon} />
      <span className={`font-semibold tracking-tight text-foreground ${s.text}`}>
        Rkyves
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="shrink-0">
        {content}
      </Link>
    );
  }

  return content;
}
