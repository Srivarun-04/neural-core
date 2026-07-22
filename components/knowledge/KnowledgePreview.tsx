import React from "react";
import type { KnowledgeItem } from "./types";

interface KnowledgePreviewProps {
  item: KnowledgeItem | null;
}

export function KnowledgePreview({ item }: KnowledgePreviewProps) {
  return (
    <aside
      id="knowledge-preview-panel"
      className="flex flex-col h-full overflow-y-auto"
      style={{
        width: 280,
        flexShrink: 0,
        background: "var(--nc-bg-surface)",
        borderLeft: "1px solid var(--nc-border)",
      }}
      aria-label="Knowledge preview panel"
    >
      {/* Panel header */}
      <div
        className="px-4 pt-4 pb-3 flex items-center justify-between flex-shrink-0"
        style={{ borderBottom: "1px solid var(--nc-border)" }}
      >
        <h2 className="text-sm font-semibold" style={{ color: "var(--nc-text-primary)" }}>
          Document Preview
        </h2>
        {item && (
          <button
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:bg-[var(--nc-bg-elevated)] cursor-pointer"
            style={{
              border: "1px solid rgba(52,211,153,0.35)",
              color: "#34d399",
            }}
            aria-label="Download this document"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
        )}
      </div>

      {/* Empty state */}
      {!item ? (
        <div className="flex flex-col items-center justify-center flex-1 px-4 py-12 text-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(52,211,153,0.08)",
              border: "1px solid rgba(52,211,153,0.15)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <p className="text-xs" style={{ color: "var(--nc-text-muted)" }}>
            Select a document to preview its content and metadata.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 px-4 py-4">
          {/* Document preview placeholder */}
          <div
            className="rounded-xl overflow-hidden flex flex-col items-center justify-center gap-3 py-10"
            style={{
              background: "var(--nc-bg-elevated)",
              border: "1px solid var(--nc-border)",
            }}
            aria-label="Document preview"
          >
            {/* Simulated page lines */}
            <div className="flex flex-col gap-1.5 w-3/4" aria-hidden="true">
              {[1, 0.9, 0.7, 0.85, 0.6, 0.75, 0.5].map((w, i) => (
                <div
                  key={i}
                  className="rounded-sm h-1.5"
                  style={{
                    width: `${w * 100}%`,
                    background: "var(--nc-bg-hover)",
                  }}
                />
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--nc-text-muted)" }}>
              Preview not available in demo
            </p>
          </div>

          {/* Metadata */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--nc-text-muted)" }}>
              Metadata
            </p>
            <div
              className="rounded-xl p-3 grid grid-cols-2 gap-x-4 gap-y-3 text-xs"
              style={{
                background: "var(--nc-bg-elevated)",
                border: "1px solid var(--nc-border)",
              }}
            >
              {[
                { label: "File Type", value: item.fileType.toUpperCase() },
                { label: "Size",      value: item.size },
                { label: "Status",    value: item.status },
                { label: "Source",    value: item.source },
                { label: "Uploaded",  value: item.uploadDate },
                { label: "Chunks",    value: item.chunks?.toString() ?? "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ color: "var(--nc-text-muted)" }}>{label}</p>
                  <p className="font-medium mt-0.5 truncate capitalize" style={{ color: "var(--nc-text-secondary)" }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--nc-text-muted)" }}>
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-lg text-xs"
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
            </div>
          )}

          {/* Delete */}
          <button
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:opacity-80 cursor-pointer mt-2"
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.2)",
              color: "#f87171",
            }}
            aria-label="Delete this document"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" /><path d="M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
            Delete Document
          </button>
        </div>
      )}
    </aside>
  );
}
