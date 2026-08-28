import Link from "next/link";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
};

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-10 md:mb-14 ${centered ? "text-center" : ""} ${className}`}
    >
      <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-lg text-muted mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
