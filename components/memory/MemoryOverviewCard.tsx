import React from "react";
import type { MemoryOverviewStat } from "./types";

interface MemoryOverviewCardProps {
  stat: MemoryOverviewStat;
}

/** Returns the icon SVG for each stat type */
function StatIcon({ type }: { type: MemoryOverviewStat["type"] }) {
  switch (type) {
    case "total":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
      );
    case "short_term":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "long_term":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "semantic":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      );
  }
}

/** Returns the accent color for each type */
function getTypeColor(type: MemoryOverviewStat["type"]): string {
  switch (type) {
    case "total":       return "#7c6af7";
    case "short_term":  return "#38bdf8";
    case "long_term":   return "#34d399";
    case "semantic":    return "#f59e0b";
  }
}

export function MemoryOverviewCard({ stat }: MemoryOverviewCardProps) {
  const color = getTypeColor(stat.type);
  const isPositive = (stat.trend ?? 0) >= 0;

  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-default"
      style={{
        background: "var(--nc-bg-surface)",
        border: "1px solid var(--nc-border)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `color-mix(in srgb, ${color} 40%, transparent)`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px color-mix(in srgb, ${color} 12%, transparent)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--nc-border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
      aria-label={`${stat.label}: ${stat.value.toLocaleString()}${stat.unit ? " " + stat.unit : ""}`}
    >
      {/* Icon + trend row */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{
            background: `color-mix(in srgb, ${color} 14%, transparent)`,
            color,
            border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
          }}
        >
          <StatIcon type={stat.type} />
        </div>

        {stat.trend !== undefined && (
          <span
            className="flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-lg"
            style={{
              background: isPositive ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
              color: isPositive ? "#34d399" : "#f87171",
            }}
            aria-label={`${isPositive ? "Up" : "Down"} ${Math.abs(stat.trend)}%`}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {isPositive
                ? <><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></>
                : <><line x1="7" y1="7" x2="17" y2="17" /><polyline points="17 7 7 7 7 17" /></>
              }
            </svg>
            {Math.abs(stat.trend)}%
          </span>
        )}
      </div>

      {/* Value */}
      <div>
        <p
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--nc-text-primary)" }}
        >
          {stat.value.toLocaleString()}
          {stat.unit && (
            <span className="text-sm font-normal ml-1" style={{ color: "var(--nc-text-muted)" }}>
              {stat.unit}
            </span>
          )}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--nc-text-muted)" }}>
          {stat.label}
        </p>
      </div>
    </div>
  );
}
