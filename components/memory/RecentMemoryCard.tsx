import React from "react";
import type { MemoryItem, MemoryImportance } from "./types";

interface RecentMemoryCardProps {
  memory: MemoryItem;
  isActive?: boolean;
  onClick?: () => void;
}

/** Importance badge color mapping */
const IMPORTANCE_STYLES: Record<
  MemoryImportance,
  { bg: string; text: string; label: string }
> = {
  critical: { bg: "rgba(239,68,68,0.12)",  text: "#f87171", label: "Critical" },
  high:     { bg: "rgba(245,158,11,0.12)", text: "#fbbf24", label: "High" },
  medium:   { bg: "rgba(52,211,153,0.12)", text: "#34d399", label: "Medium" },
  low:      { bg: "rgba(148,163,184,0.1)", text: "#94a3b8", label: "Low" },
};

/** Memory type label */
const TYPE_LABELS: Record<string, string> = {
  short_term: "Short-Term",
  long_term:  "Long-Term",
  semantic:   "Semantic",
};

export function RecentMemoryCard({ memory, isActive = false, onClick }: RecentMemoryCardProps) {
  const imp = IMPORTANCE_STYLES[memory.importance];

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left flex flex-col gap-2.5 p-4 rounded-2xl transition-all duration-200 cursor-pointer"
      style={{
        background: isActive ? "var(--nc-bg-elevated)" : "var(--nc-bg-surface)",
        border: `1px solid ${isActive ? "var(--nc-border-accent)" : "var(--nc-border)"}`,
        boxShadow: isActive ? "0 0 0 1px rgba(124,106,247,0.2)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,106,247,0.25)";
          (e.currentTarget as HTMLElement).style.background = "var(--nc-bg-elevated)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--nc-border)";
          (e.currentTarget as HTMLElement).style.background = "var(--nc-bg-surface)";
        }
      }}
      aria-pressed={isActive}
      aria-label={`Memory: ${memory.title}`}
    >
      {/* Top row: category + importance + type */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Category pill */}
        <span
          className="px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            background: "rgba(124,106,247,0.1)",
            color: "var(--nc-accent-text)",
            border: "1px solid rgba(124,106,247,0.2)",
          }}
        >
          {memory.category}
        </span>

        {/* Type badge */}
        <span
          className="px-2 py-0.5 rounded-full text-xs"
          style={{
            background: "var(--nc-bg-hover)",
            color: "var(--nc-text-muted)",
            border: "1px solid var(--nc-border)",
          }}
        >
          {TYPE_LABELS[memory.type] ?? memory.type}
        </span>

        {/* Importance badge — pushed right */}
        <span className="ml-auto flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: imp.bg, color: imp.text }}
        >
          {imp.label}
        </span>
      </div>

      {/* Title */}
      <p
        className="text-sm font-medium leading-snug line-clamp-2"
        style={{ color: "var(--nc-text-primary)" }}
      >
        {memory.title}
      </p>

      {/* Preview */}
      <p
        className="text-xs leading-relaxed line-clamp-2"
        style={{ color: "var(--nc-text-muted)" }}
      >
        {memory.preview}
      </p>

      {/* Tags */}
      {memory.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {memory.tags.map((tag) => (
            <span
              key={tag.label}
              className="px-1.5 py-0.5 rounded text-xs"
              style={{
                background: "var(--nc-bg-hover)",
                color: tag.color ?? "var(--nc-text-secondary)",
                border: "1px solid var(--nc-border)",
              }}
            >
              #{tag.label}
            </span>
          ))}
        </div>
      )}

      {/* Footer: date + source */}
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-xs" style={{ color: "var(--nc-text-muted)" }}>
          {memory.createdAt}
        </span>
        {memory.source && (
          <span className="text-xs" style={{ color: "var(--nc-text-muted)" }}>
            {memory.source}
          </span>
        )}
      </div>
    </button>
  );
}
