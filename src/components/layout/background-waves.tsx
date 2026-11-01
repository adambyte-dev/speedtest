export function BackgroundWaves() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10 select-none">
      {/* Subtle modern tech grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#881337_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.035] dark:opacity-[0.06]" />

      {/* Ambient top maroon bloom */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-rose-900/15 via-red-950/10 to-transparent dark:from-rose-950/25 dark:via-red-950/15 dark:to-transparent rounded-full blur-3xl" />

      {/* Left organic maroon wave */}
      <div className="absolute left-0 bottom-0 top-1/4 w-[500px] max-w-[45vw] opacity-75 dark:opacity-20 transition-opacity">
        <svg
          viewBox="0 0 500 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          <path
            d="M-40 800 C 160 690, 210 540, 130 410 C 50 280, 190 170, 60 40 L -40 40 Z"
            fill="url(#leftMaroonGrad)"
          />
          <defs>
            <linearGradient id="leftMaroonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#BE123C" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#881337" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FFE4E6" stopOpacity="0.02" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Right organic maroon wave */}
      <div className="absolute right-0 bottom-0 top-1/3 w-[550px] max-w-[50vw] opacity-75 dark:opacity-20 transition-opacity">
        <svg
          viewBox="0 0 500 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          <path
            d="M540 800 C 310 670, 270 490, 380 370 C 490 250, 370 110, 470 20 L 540 20 Z"
            fill="url(#rightMaroonGrad)"
          />
          <defs>
            <linearGradient id="rightMaroonGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9F1239" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#881337" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFE4E6" stopOpacity="0.02" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Center gauge ambient maroon glow */}
      <div className="absolute top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-rose-900/10 dark:bg-rose-950/20 rounded-full blur-3xl" />
    </div>
  );
}
