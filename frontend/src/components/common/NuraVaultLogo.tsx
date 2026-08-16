interface NuraVaultLogoProps {
  size?: number | string;
  className?: string;
  showGlow?: boolean;
}

export function NuraVaultLogo({ size = 32, className = '', showGlow = true }: NuraVaultLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 transition-transform duration-200 ${className}`}
      aria-label="NuraVault Logo"
    >
      <defs>
        {/* Shield Outer Gradient */}
        <linearGradient id="nvShieldBorder" x1="15" y1="10" x2="85" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>

        {/* Shield Inner Dark Surface Gradient */}
        <linearGradient id="nvShieldBg" x1="50" y1="10" x2="50" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B1329" />
          <stop offset="50%" stopColor="#070C1C" />
          <stop offset="100%" stopColor="#040711" />
        </linearGradient>

        {/* Neural Brain Gradient */}
        <linearGradient id="nvBrainGlow" x1="30" y1="20" x2="70" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        {/* Waves Gradient */}
        <linearGradient id="nvWaveGrad" x1="20" y1="65" x2="80" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        {/* Glow Filter */}
        {showGlow && (
          <filter id="nvGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* Outer Shield Backing / Bevel */}
      <path
        d="M50 8 L84 22 C84 52 70 78 50 92 C30 78 16 52 16 22 L50 8 Z"
        fill="url(#nvShieldBorder)"
        stroke="#38BDF8"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* Inner Shield Cavity */}
      <path
        d="M50 14 L78 26 C78 50 66 72 50 84 C34 72 22 50 22 26 L50 14 Z"
        fill="url(#nvShieldBg)"
        stroke="#0284C7"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Inner Shield Rim Highlight */}
      <path
        d="M50 18 L74 29 C74 48 64 67 50 78 C36 67 26 48 26 29 L50 18 Z"
        fill="none"
        stroke="#38BDF8"
        strokeWidth="0.75"
        strokeOpacity="0.4"
      />

      {/* Neural Network Brain - Connections */}
      <g stroke="url(#nvBrainGlow)" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85">
        {/* Left Hemisphere Synapses */}
        <line x1="50" y1="26" x2="41" y2="30" />
        <line x1="41" y1="30" x2="33" y2="38" />
        <line x1="33" y1="38" x2="35" y2="48" />
        <line x1="35" y1="48" x2="44" y2="52" />
        <line x1="44" y1="52" x2="50" y2="47" />
        <line x1="50" y1="26" x2="47" y2="38" />
        <line x1="47" y1="38" x2="44" y2="52" />
        <line x1="41" y1="30" x2="47" y2="38" />
        <line x1="33" y1="38" x2="47" y2="38" />
        <line x1="35" y1="48" x2="47" y2="38" />

        {/* Right Hemisphere Synapses */}
        <line x1="50" y1="26" x2="59" y2="30" />
        <line x1="59" y1="30" x2="67" y2="38" />
        <line x1="67" y1="38" x2="65" y2="48" />
        <line x1="65" y1="48" x2="56" y2="52" />
        <line x1="56" y1="52" x2="50" y2="47" />
        <line x1="50" y1="26" x2="53" y2="38" />
        <line x1="53" y1="38" x2="56" y2="52" />
        <line x1="59" y1="30" x2="53" y2="38" />
        <line x1="67" y1="38" x2="53" y2="38" />
        <line x1="65" y1="48" x2="53" y2="38" />

        {/* Central Bridge */}
        <line x1="47" y1="38" x2="53" y2="38" />
        <line x1="44" y1="52" x2="56" y2="52" />
        <line x1="50" y1="47" x2="50" y2="58" />
      </g>

      {/* Neural Network Brain - Nodes */}
      <g fill="#E0F2FE" filter={showGlow ? 'url(#nvGlowFilter)' : undefined}>
        {/* Central Top Node */}
        <circle cx="50" cy="26" r="2.4" fill="#38BDF8" />
        <circle cx="50" cy="26" r="1.4" fill="#FFFFFF" />

        {/* Left Nodes */}
        <circle cx="41" cy="30" r="2" fill="#38BDF8" />
        <circle cx="41" cy="30" r="1.1" fill="#FFFFFF" />

        <circle cx="33" cy="38" r="2.2" fill="#38BDF8" />
        <circle cx="33" cy="38" r="1.2" fill="#FFFFFF" />

        <circle cx="35" cy="48" r="2" fill="#38BDF8" />
        <circle cx="35" cy="48" r="1.1" fill="#FFFFFF" />

        <circle cx="44" cy="52" r="2.2" fill="#38BDF8" />
        <circle cx="44" cy="52" r="1.2" fill="#FFFFFF" />

        <circle cx="47" cy="38" r="2.4" fill="#67E8F9" />
        <circle cx="47" cy="38" r="1.4" fill="#FFFFFF" />

        {/* Right Nodes */}
        <circle cx="59" cy="30" r="2" fill="#38BDF8" />
        <circle cx="59" cy="30" r="1.1" fill="#FFFFFF" />

        <circle cx="67" cy="38" r="2.2" fill="#38BDF8" />
        <circle cx="67" cy="38" r="1.2" fill="#FFFFFF" />

        <circle cx="65" cy="48" r="2" fill="#38BDF8" />
        <circle cx="65" cy="48" r="1.1" fill="#FFFFFF" />

        <circle cx="56" cy="52" r="2.2" fill="#38BDF8" />
        <circle cx="56" cy="52" r="1.2" fill="#FFFFFF" />

        <circle cx="53" cy="38" r="2.4" fill="#67E8F9" />
        <circle cx="53" cy="38" r="1.4" fill="#FFFFFF" />

        {/* Central Lower Node */}
        <circle cx="50" cy="47" r="2.2" fill="#38BDF8" />
        <circle cx="50" cy="47" r="1.2" fill="#FFFFFF" />
      </g>

      {/* Vault Waves - Bottom of Shield */}
      <path
        d="M26 62 Q38 56 50 63 Q62 70 74 62"
        fill="none"
        stroke="url(#nvWaveGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M29 69 Q40 64 50 70 Q60 76 71 69"
        fill="none"
        stroke="url(#nvWaveGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M34 76 Q42 72 50 77 Q58 82 66 76"
        fill="none"
        stroke="url(#nvWaveGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
