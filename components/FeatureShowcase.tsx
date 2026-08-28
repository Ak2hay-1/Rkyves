const chartData = [
  { height: 35, label: "" },
  { height: 55, label: "" },
  { height: 40, label: "" },
  { height: 70, label: "" },
  { height: 50, label: "" },
  { height: 85, label: "412 Sales", highlight: true },
  { height: 60, label: "" },
  { height: 45, label: "" },
];

export default function FeatureShowcase() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="bento-card grid gap-8 p-8 md:grid-cols-2 md:gap-12 md:p-12 lg:p-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              Get proper data &amp;{" "}
              <span className="text-muted-light">business insights.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
              Gain actionable analytics and real-time monitoring, empowering you
              to make data-driven decisions and grow your business with
              confidence.
            </p>
          </div>

          <div className="bento-card chart-glow p-6 md:p-8">
            <p className="text-sm text-muted">Sales Overtime</p>
            <div className="mt-8 flex h-48 items-end justify-between gap-2 md:h-56 md:gap-3">
              {chartData.map((bar, i) => (
                <div
                  key={i}
                  className="relative flex flex-1 flex-col items-center justify-end"
                >
                  {bar.highlight && bar.label && (
                    <span className="absolute -top-8 whitespace-nowrap rounded-full border border-white/10 bg-[#1a1a1a] px-2.5 py-1 text-[10px] text-foreground md:text-xs">
                      {bar.label}
                    </span>
                  )}
                  <div
                    className={`w-full max-w-[28px] rounded-t-md ${
                      bar.highlight ? "gradient-bar" : "bg-white/10"
                    }`}
                    style={{ height: `${bar.height}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-[10px] text-muted md:text-xs">
              <span>0</span>
              <span>100</span>
              <span>200</span>
              <span>300</span>
              <span>400</span>
              <span>500</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
