import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

const sizeMap = {
  sm: { mark: 24, font: "text-sm" },
  md: { mark: 32, font: "text-base" },
  lg: { mark: 40, font: "text-lg" },
};

export function Logo({ size = "md", showWordmark = true }: LogoProps) {
  const { mark, font } = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Neural node mark */}
      <svg
        width={mark}
        height={mark}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Neural Core logo mark"
      >
        {/* Glow filter */}
        <defs>
          <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="logo-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a89cfa" />
            <stop offset="100%" stopColor="#7c6af7" />
          </radialGradient>
        </defs>

        {/* Outer ring */}
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="url(#logo-grad)"
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Connection lines */}
        <line x1="16" y1="4" x2="16" y2="28" stroke="#7c6af7" strokeWidth="0.5" strokeOpacity="0.3" />
        <line x1="4" y1="16" x2="28" y2="16" stroke="#7c6af7" strokeWidth="0.5" strokeOpacity="0.3" />
        <line x1="7.5" y1="7.5" x2="24.5" y2="24.5" stroke="#7c6af7" strokeWidth="0.5" strokeOpacity="0.3" />
        <line x1="24.5" y1="7.5" x2="7.5" y2="24.5" stroke="#7c6af7" strokeWidth="0.5" strokeOpacity="0.3" />

        {/* Satellite nodes */}
        <circle cx="16" cy="4"  r="2" fill="#7c6af7" opacity="0.7" />
        <circle cx="16" cy="28" r="2" fill="#7c6af7" opacity="0.7" />
        <circle cx="4"  cy="16" r="2" fill="#7c6af7" opacity="0.7" />
        <circle cx="28" cy="16" r="2" fill="#7c6af7" opacity="0.7" />
        <circle cx="8"  cy="8"  r="1.5" fill="#a89cfa" opacity="0.6" />
        <circle cx="24" cy="8"  r="1.5" fill="#a89cfa" opacity="0.6" />
        <circle cx="8"  cy="24" r="1.5" fill="#a89cfa" opacity="0.6" />
        <circle cx="24" cy="24" r="1.5" fill="#a89cfa" opacity="0.6" />

        {/* Core node */}
        <circle
          cx="16"
          cy="16"
          r="4"
          fill="url(#logo-grad)"
          filter="url(#logo-glow)"
        />
        <circle cx="16" cy="16" r="2" fill="white" opacity="0.9" />
      </svg>

      {showWordmark && (
        <span
          className={`${font} font-semibold tracking-tight`}
          style={{ color: "var(--nc-text-primary)" }}
        >
          Neural{" "}
          <span style={{ color: "var(--nc-accent-text)" }}>Core</span>
        </span>
      )}
    </div>
  );
}
