export default function GradientWaves() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute bottom-0 left-0 w-full opacity-60"
        viewBox="0 0 1440 600"
        fill="none"
        preserveAspectRatio="xMidYMax slice"
      >
        <path
          d="M-100 500 Q 300 200 700 350 T 1540 280"
          stroke="url(#wave1)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M-50 550 Q 400 250 800 400 T 1600 320"
          stroke="url(#wave2)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M0 580 Q 500 300 900 450 T 1500 380"
          stroke="url(#wave3)"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="30%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#ec4899" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="40%" stopColor="#c084fc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
