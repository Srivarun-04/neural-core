"use client";

import React, { useState, useMemo } from "react";
import { KnowledgeHeader } from "./KnowledgeHeader";
import { UploadZone } from "./UploadZone";
import { KnowledgeCard } from "./KnowledgeCard";
import { KnowledgePreview } from "./KnowledgePreview";
import { ProcessingQueue } from "./ProcessingQueue";
import { KNOWLEDGE_ITEMS, PROCESSING_JOBS } from "./mockData";
import type { KnowledgeItem } from "./types";

export function KnowledgeDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItemId, setActiveItemId] = useState<string | null>(
    KNOWLEDGE_ITEMS[0]?.id ?? null
  );

  /** Filter knowledge items by search */
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return KNOWLEDGE_ITEMS;
    return KNOWLEDGE_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.fileType.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const activeItem: KnowledgeItem | null =
    KNOWLEDGE_ITEMS.find((item) => item.id === activeItemId) ?? null;

  return (
    <div
      id="knowledge-dashboard"
      className="flex flex-col h-full"
      style={{ minHeight: "calc(100vh - var(--navbar-height))" }}
    >
      {/* Header */}
      <KnowledgeHeader
        totalDocs={KNOWLEDGE_ITEMS.length}
        onUpload={() => { /* future: open upload modal */ }}
        onSearch={setSearchQuery}
      />

      {/* Body: two-column layout */}
      <div className="flex flex-1 min-h-0">
        {/* Main content — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-8">

          {/* ── Upload Zone ── */}
          <section aria-labelledby="upload-heading">
            <h2
              id="upload-heading"
              className="sr-only"
            >
              Upload Documents
            </h2>
            <UploadZone />
          </section>

          {/* ── Knowledge Cards ── */}
          <section aria-labelledby="docs-heading">
            <div className="flex items-center justify-between mb-3">
              <h2
                id="docs-heading"
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--nc-text-muted)" }}
              >
                Documents
              </h2>
              <span
                className="text-xs px-1.5 py-0.5 rounded-md"
                style={{
                  background: "rgba(52,211,153,0.1)",
                  color: "#34d399",
                  border: "1px solid rgba(52,211,153,0.2)",
                }}
              >
                {filteredItems.length}
              </span>
            </div>

            {filteredItems.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-12 rounded-2xl text-center gap-2"
                style={{ background: "var(--nc-bg-surface)", border: "1px solid var(--nc-border)" }}
                role="status"
                aria-live="polite"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--nc-text-muted)" }} aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p className="text-sm font-medium" style={{ color: "var(--nc-text-secondary)" }}>
                  No documents match your search
                </p>
                <p className="text-xs" style={{ color: "var(--nc-text-muted)" }}>
                  Try different keywords or upload a new file
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {filteredItems.map((item) => (
                  <KnowledgeCard
                    key={item.id}
                    item={item}
                    isActive={item.id === activeItemId}
                    onView={() => setActiveItemId(item.id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── Processing Queue ── */}
          <ProcessingQueue jobs={PROCESSING_JOBS} />
        </div>

        {/* Right preview panel */}
        <KnowledgePreview item={activeItem} />
      </div>
    </div>
  );
}
