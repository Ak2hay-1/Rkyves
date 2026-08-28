function ActivityChart() {
  return (
    <div className="relative mt-auto">
      <svg
        viewBox="0 0 400 120"
        className="w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <path
          d="M0 80 Q 50 60 100 70 T 200 40 T 300 55 T 400 20 L 400 120 L 0 120 Z"
          fill="url(#areaGrad)"
        />
        <path
          d="M0 80 Q 50 60 100 70 T 200 40 T 300 55 T 400 20"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2"
        />
        <circle cx="300" cy="55" r="4" fill="white" />
      </svg>
      <span className="absolute right-[20%] top-0 rounded-full border border-white/10 bg-[#1a1a1a] px-2.5 py-1 text-[10px] text-foreground md:text-xs">
        3.2K Active
      </span>
    </div>
  );
}

export default function BentoGrid() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <div className="bento-card flex min-h-[280px] flex-col justify-end p-8 md:min-h-[320px] md:p-10">
            <h3 className="text-2xl font-bold leading-snug md:text-3xl lg:text-4xl">
              Bring visitors from
              <br />
              <span className="text-muted-light">different sources.</span>
            </h3>
          </div>

          <div className="bento-card flex min-h-[280px] flex-col p-8 md:min-h-[320px] md:p-10">
            <p className="text-sm text-muted">Audience Online Activity</p>
            <p className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              4,235
            </p>
            <p className="mt-1 text-sm text-muted">Visiting now</p>
            <ActivityChart />
          </div>

          <div className="bento-card flex min-h-[280px] flex-col justify-end p-8 md:min-h-[320px] md:p-10">
            <h3 className="text-2xl font-bold leading-snug md:text-3xl lg:text-4xl">
              Acquire and retain
              <br />
              <span className="text-muted-light">more customers.</span>
            </h3>
          </div>

          <div className="bento-card min-h-[280px] overflow-hidden p-3 md:min-h-[320px]">
            <div
              className="h-full min-h-[260px] rounded-[20px] bg-gradient-to-br from-amber-700/40 via-amber-900/30 to-black bg-cover bg-center md:min-h-[300px]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgba(180,130,70,0.6) 0%, rgba(60,40,20,0.8) 100%)",
              }}
              role="img"
              aria-label="Business owner portrait"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
