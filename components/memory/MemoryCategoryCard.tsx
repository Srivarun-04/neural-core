import React from "react";
import type { MemoryCategory } from "./types";

interface MemoryCategoryCardProps {
  category: MemoryCategory;
}

/** SVG icon per category icon key */
function CategoryIcon({ icon, color }: { icon: MemoryCategory["icon"]; color: string }) {
  const props = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (icon) {
    case "profile":
      return (
        <svg {...props}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "preferences":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "conversations":
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "facts":
      return (
        <svg {...props}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
  }
}

export function MemoryCategoryCard({ category }: MemoryCategoryCardProps) {
  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
      style={{
        background: "var(--nc-bg-surface)",
        border: "1px solid var(--nc-border)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `color-mix(in srgb, ${category.color} 40%, transparent)`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px color-mix(in srgb, ${category.color} 10%, transparent)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--nc-border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
      role="button"
      tabIndex={0}
      aria-label={`${category.name}: ${category.count} memories`}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl"
        style={{
          background: `color-mix(in srgb, ${category.color} 12%, transparent)`,
          border: `1px solid color-mix(in srgb, ${category.color} 25%, transparent)`,
        }}
      >
        <CategoryIcon icon={category.icon} color={category.color} />
      </div>

      {/* Count */}
      <div>
        <p
          className="text-xl font-bold"
          style={{ color: "var(--nc-text-primary)" }}
        >
          {category.count.toLocaleString()}
        </p>
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--nc-text-primary)" }}
        >
          {category.name}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--nc-text-muted)" }}>
          {category.description}
        </p>
      </div>

      {/* Arrow hint */}
      <div className="flex items-center gap-1 mt-auto">
        <span className="text-xs" style={{ color: category.color }}>
          View all
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={category.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    </div>
  );
}
