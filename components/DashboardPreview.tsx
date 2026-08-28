import RkyvesLogo from "@/components/RkyvesLogo";

export default function DashboardPreview() {
  return (
    <div className="bg-[#0d0d0d] p-6 md:p-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <RkyvesLogo size="sm" href={undefined} />
        <span className="text-sm text-muted">Dashboard</span>
      </div>
      <p className="mt-4 text-xs text-muted">Today, January 16, 2024</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Revenue", value: "₹2.4L" },
          { label: "Orders", value: "847" },
          { label: "Uptime", value: "99.97%" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
          >
            <p className="text-xs text-muted">{stat.label}</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="h-24 rounded-xl border border-white/5 bg-white/[0.02]" />
        <div className="h-24 rounded-xl border border-white/5 bg-white/[0.02]" />
      </div>
    </div>
  );
}
