import React from "react";

interface KnowledgeHeaderProps {
  totalDocs: number;
  onUpload: () => void;
  onSearch: (query: string) => void;
}

export function KnowledgeHeader({ totalDocs, onUpload, onSearch }: KnowledgeHeaderProps) {
  return (
    <div
      id="knowledge-header"
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 pt-6 pb-4"
      style={{ borderBottom: "1px solid var(--nc-border)" }}
    >
      {/* Title group */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
          style={{
            background: "rgba(52,211,153,0.12)",
            border: "1px solid rgba(52,211,153,0.25)",
          }}
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="9" y1="12" x2="13" y2="12" />
          </svg>
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--nc-text-primary)" }}>
            Knowledge
          </h1>
          <p className="text-xs" style={{ color: "var(--nc-text-muted)" }}>
            Documents and knowledge sources ·{" "}
            <span style={{ color: "#34d399" }}>{totalDocs} documents</span>
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--nc-text-muted)" }} aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            id="knowledge-search"
            type="search"
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search documents..."
            className="pl-8 pr-3 py-2 rounded-xl text-xs outline-none transition-all duration-200 w-48"
            style={{
              background: "var(--nc-bg-elevated)",
              border: "1px solid var(--nc-border)",
              color: "var(--nc-text-secondary)",
              caretColor: "#34d399",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(52,211,153,0.4)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(52,211,153,0.08)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--nc-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
            aria-label="Search knowledge base"
          />
        </div>

        {/* Upload button */}
        <button
          id="knowledge-upload-btn"
          onClick={onUpload}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:opacity-90 cursor-pointer"
          style={{
            background: "#34d399",
            color: "#0a1a13",
            boxShadow: "0 0 16px rgba(52,211,153,0.2)",
          }}
          aria-label="Upload a document"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload
        </button>
      </div>
    </div>
  );
}
