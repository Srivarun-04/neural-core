import React from "react";

interface PageShellProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor?: string;
  id: string;
}

export function PageShell({
  title,
  subtitle,
  icon,
  accentColor = "var(--nc-accent)",
  id,
}: PageShellProps) {
  return (
    <div
      id={id}
      className="flex flex-col items-center justify-center min-h-full px-8 py-20 text-center"
    >
      {/* Icon bubble */}
      <div
        className="flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
        style={{
          background: `color-mix(in srgb, ${accentColor} 15%, transparent)`,
          border: `1px solid color-mix(in srgb, ${accentColor} 30%, transparent)`,
          color: accentColor,
        }}
        aria-hidden="true"
      >
        {icon}
      </div>

      <h1
        className="text-3xl font-bold mb-3 tracking-tight"
        style={{ color: "var(--nc-text-primary)" }}
      >
        {title}
      </h1>

      <p
        className="text-sm mb-6 max-w-xs leading-relaxed"
        style={{ color: "var(--nc-text-muted)" }}
      >
        {subtitle}
      </p>

      {/* Coming soon badge */}
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
        style={{
          background: "var(--nc-bg-elevated)",
          border: "1px solid var(--nc-border)",
          color: "var(--nc-text-secondary)",
        }}
      >
        <span
          className="block w-1 h-1 rounded-full"
          style={{ background: "var(--nc-accent)" }}
          aria-hidden="true"
        />
        Coming soon
      </span>
    </div>
  );
}
