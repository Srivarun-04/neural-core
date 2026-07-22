import React from "react";
import type { MemoryItem, TimelineEvent } from "./types";

interface MemoryDetailsPanelProps {
  memory: MemoryItem | null;
  timeline: TimelineEvent[];
}

const TIMELINE_COLORS: Record<TimelineEvent["type"], string> = {
  created:  "#34d399",
  updated:  "#7c6af7",
  accessed: "#38bdf8",
  deleted:  "#f87171",
};

/** Skeleton shimmer block */
function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className ?? ""}`}
      style={{ background: "var(--nc-bg-hover)" }}
    />
  );
}

export function MemoryDetailsPanel({ memory, timeline }: MemoryDetailsPanelProps) {
  return (
    <aside
      id="memory-details-panel"
      className="flex flex-col h-full overflow-y-auto"
      style={{
        width: 280,
        flexShrink: 0,
        background: "var(--nc-bg-surface)",
        borderLeft: "1px solid var(--nc-border)",
      }}
      aria-label="Memory details panel"
    >
      {/* Panel header */}
      <div
        className="px-4 pt-4 pb-3 flex items-center justify-between flex-shrink-0"
        style={{ borderBottom: "1px solid var(--nc-border)" }}
      >
        <h2 className="text-sm font-semibold" style={{ color: "var(--nc-text-primary)" }}>
          Memory Details
        </h2>
        {memory && (
          <button
            id="edit-memory-btn"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-[var(--nc-bg-elevated)] cursor-pointer"
            style={{
              border: "1px solid var(--nc-border-accent)",
              color: "var(--nc-accent-text)",
            }}
            aria-label="Edit this memory"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
        )}
      </div>

      {/* Content */}
      {!memory ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center flex-1 px-4 py-12 text-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(124,106,247,0.08)",
              border: "1px solid rgba(124,106,247,0.15)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c6af7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p className="text-xs" style={{ color: "var(--nc-text-muted)" }}>
            Select a memory to see details, metadata, and history.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 px-4 py-4">
          {/* Title */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--nc-text-muted)" }}>
              Title
            </p>
            <p className="text-sm font-medium leading-snug" style={{ color: "var(--nc-text-primary)" }}>
              {memory.title}
            </p>
          </div>

          {/* Metadata grid */}
          <div
            className="rounded-xl p-3 grid grid-cols-2 gap-x-4 gap-y-3 text-xs"
            style={{
              background: "var(--nc-bg-elevated)",
              border: "1px solid var(--nc-border)",
            }}
          >
            {[
              { label: "Category", value: memory.category },
              { label: "Type", value: memory.type.replace("_", "-") },
              { label: "Importance", value: memory.importance },
              { label: "Source", value: memory.source ?? "—" },
              { label: "Created", value: memory.createdAt },
              { label: "Updated", value: memory.updatedAt },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ color: "var(--nc-text-muted)" }}>{label}</p>
                <p className="font-medium mt-0.5 truncate" style={{ color: "var(--nc-text-secondary)" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Tags */}
          {memory.tags.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--nc-text-muted)" }}>
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {memory.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className="px-2 py-0.5 rounded-lg text-xs"
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
            </div>
          )}

          {/* Timeline */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--nc-text-muted)" }}>
              Timeline
            </p>
            <ol className="flex flex-col gap-0" aria-label="Memory event timeline">
              {timeline.map((event, idx) => (
                <li key={event.id} className="flex gap-3">
                  {/* Line + dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                      style={{ background: TIMELINE_COLORS[event.type] }}
                      aria-hidden="true"
                    />
                    {idx < timeline.length - 1 && (
                      <div
                        className="flex-1 w-px mt-1"
                        style={{ background: "var(--nc-border)", minHeight: 20 }}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-4">
                    <p className="text-xs font-medium" style={{ color: "var(--nc-text-secondary)" }}>
                      {event.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--nc-text-muted)" }}>
                      {event.timestamp}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Delete button */}
          <button
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:opacity-80 cursor-pointer mt-2"
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.2)",
              color: "#f87171",
            }}
            aria-label="Delete this memory"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
            Delete Memory
          </button>
        </div>
      )}

      {/* Skeleton loading example (hidden but structurally present for future use) */}
      {!memory && (
        <div className="sr-only" aria-hidden="true">
          <Shimmer className="h-4 w-3/4 m-4" />
        </div>
      )}
    </aside>
  );
}
