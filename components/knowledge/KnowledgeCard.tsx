import React from "react";
import type { KnowledgeItem, KnowledgeStatus, FileType } from "./types";

interface KnowledgeCardProps {
  item: KnowledgeItem;
  isActive?: boolean;
  onView?: () => void;
}

/** Status style mapping */
const STATUS_STYLES: Record<KnowledgeStatus, { bg: string; text: string; label: string }> = {
  indexed:    { bg: "rgba(52,211,153,0.1)",   text: "#34d399", label: "Indexed" },
  processing: { bg: "rgba(245,158,11,0.1)",   text: "#fbbf24", label: "Processing" },
  uploading:  { bg: "rgba(56,189,248,0.1)",   text: "#38bdf8", label: "Uploading" },
  failed:     { bg: "rgba(248,113,113,0.1)",  text: "#f87171", label: "Failed" },
  queued:     { bg: "rgba(148,163,184,0.08)", text: "#94a3b8", label: "Queued" },
};

/** File type badge colors */
const FILE_TYPE_COLORS: Record<FileType, { bg: string; text: string }> = {
  pdf:   { bg: "rgba(248,113,113,0.1)",  text: "#f87171" },
  docx:  { bg: "rgba(96,165,250,0.1)",   text: "#60a5fa" },
  md:    { bg: "rgba(167,139,250,0.1)",  text: "#a78bfa" },
  txt:   { bg: "rgba(148,163,184,0.08)", text: "#94a3b8" },
  image: { bg: "rgba(52,211,153,0.1)",   text: "#34d399" },
  other: { bg: "rgba(148,163,184,0.08)", text: "#94a3b8" },
};

/** Small file type icon */
function FileIcon({ type }: { type: FileType }) {
  const color = FILE_TYPE_COLORS[type].text;
  const props = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none" as const, stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };

  if (type === "image") {
    return (
      <svg {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

export function KnowledgeCard({ item, isActive = false, onView }: KnowledgeCardProps) {
  const status = STATUS_STYLES[item.status];
  const fileStyle = FILE_TYPE_COLORS[item.fileType];

  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-2xl transition-all duration-200"
      style={{
        background: isActive ? "var(--nc-bg-elevated)" : "var(--nc-bg-surface)",
        border: `1px solid ${isActive ? "rgba(52,211,153,0.3)" : "var(--nc-border)"}`,
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(52,211,153,0.2)";
          (e.currentTarget as HTMLElement).style.background = "var(--nc-bg-elevated)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--nc-border)";
          (e.currentTarget as HTMLElement).style.background = "var(--nc-bg-surface)";
        }
      }}
    >
      {/* Top row: file type + status */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* File type badge */}
        <span
          className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold uppercase"
          style={{ background: fileStyle.bg, color: fileStyle.text }}
        >
          <FileIcon type={item.fileType} />
          {item.fileType}
        </span>

        {/* Status badge */}
        <span
          className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
          style={{ background: status.bg, color: status.text }}
        >
          {item.status === "processing" || item.status === "uploading" ? (
            <span
              className="block w-1.5 h-1.5 rounded-full"
              style={{
                background: status.text,
                animation: "pulse-dot 1.4s ease-in-out infinite",
              }}
              aria-hidden="true"
            />
          ) : null}
          {status.label}
        </span>

        {/* Chunk count if indexed */}
        {item.chunks !== undefined && (
          <span className="ml-auto text-xs" style={{ color: "var(--nc-text-muted)" }}>
            {item.chunks} chunks
          </span>
        )}
      </div>

      {/* Title */}
      <p className="text-sm font-semibold leading-snug" style={{ color: "var(--nc-text-primary)" }}>
        {item.title}
      </p>

      {/* Preview */}
      {item.preview && (
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--nc-text-muted)" }}>
          {item.preview}
        </p>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded text-xs"
              style={{
                background: "var(--nc-bg-hover)",
                color: "var(--nc-text-secondary)",
                border: "1px solid var(--nc-border)",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs" style={{ color: "var(--nc-text-muted)" }}>
            {item.size} · {item.uploadDate}
          </span>
          <span className="text-xs" style={{ color: "var(--nc-text-muted)" }}>
            Source: {item.source}
          </span>
        </div>

        {/* View button */}
        <button
          onClick={onView}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-[var(--nc-bg-hover)] cursor-pointer"
          style={{
            border: "1px solid var(--nc-border)",
            color: "var(--nc-text-secondary)",
          }}
          aria-label={`View ${item.title}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View
        </button>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
