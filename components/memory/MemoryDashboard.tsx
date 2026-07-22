"use client";

import React, { useState, useMemo } from "react";
import { MemoryHeader } from "./MemoryHeader";
import { MemoryOverviewCard } from "./MemoryOverviewCard";
import { RecentMemoryCard } from "./RecentMemoryCard";
import { MemoryCategoryCard } from "./MemoryCategoryCard";
import { MemoryDetailsPanel } from "./MemoryDetailsPanel";
import {
  MEMORY_OVERVIEW_STATS,
  RECENT_MEMORIES,
  MEMORY_CATEGORIES,
  MOCK_TIMELINE,
} from "./mockData";
import type { MemoryItem } from "./types";

export function MemoryDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMemoryId, setActiveMemoryId] = useState<string | null>(
    RECENT_MEMORIES[0]?.id ?? null
  );

  /** Filter memories by search */
  const filteredMemories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return RECENT_MEMORIES;
    return RECENT_MEMORIES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.tags.some((t) => t.label.toLowerCase().includes(q)) ||
        m.preview.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeMemory: MemoryItem | null =
    RECENT_MEMORIES.find((m) => m.id === activeMemoryId) ?? null;

  const totalCount = MEMORY_OVERVIEW_STATS.find((s) => s.type === "total")?.value ?? 0;

  return (
    <div
      id="memory-dashboard"
      className="flex flex-col h-full"
      style={{ minHeight: "calc(100vh - var(--navbar-height))" }}
    >
      {/* Header */}
      <MemoryHeader
        totalCount={totalCount}
        onSearch={setSearchQuery}
        onFilter={() => { /* future: open filter drawer */ }}
      />

      {/* Body: two-column layout */}
      <div className="flex flex-1 min-h-0">
        {/* Main content — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-8">

          {/* ── Section 1: Overview Cards ── */}
          <section aria-labelledby="overview-heading">
            <h2
              id="overview-heading"
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--nc-text-muted)" }}
            >
              Overview
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {MEMORY_OVERVIEW_STATS.map((stat) => (
                <MemoryOverviewCard key={stat.id} stat={stat} />
              ))}
            </div>
          </section>

          {/* ── Section 2: Recent Memories ── */}
          <section aria-labelledby="recent-heading">
            <div className="flex items-center justify-between mb-3">
              <h2
                id="recent-heading"
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--nc-text-muted)" }}
              >
                Recent Memories
              </h2>
              <span className="text-xs px-1.5 py-0.5 rounded-md"
                style={{
                  background: "rgba(124,106,247,0.1)",
                  color: "var(--nc-accent-text)",
                  border: "1px solid rgba(124,106,247,0.2)",
                }}
              >
                {filteredMemories.length}
              </span>
            </div>

            {filteredMemories.length === 0 ? (
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
                <p className="text-sm font-medium" style={{ color: "var(--nc-text-secondary)" }}>No memories match your search</p>
                <p className="text-xs" style={{ color: "var(--nc-text-muted)" }}>Try different keywords or clear the filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {filteredMemories.map((memory) => (
                  <RecentMemoryCard
                    key={memory.id}
                    memory={memory}
                    isActive={memory.id === activeMemoryId}
                    onClick={() => setActiveMemoryId(memory.id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── Section 3: Memory Categories ── */}
          <section aria-labelledby="categories-heading">
            <h2
              id="categories-heading"
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--nc-text-muted)" }}
            >
              Memory Categories
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {MEMORY_CATEGORIES.map((cat) => (
                <MemoryCategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </section>
        </div>

        {/* Right details panel */}
        <MemoryDetailsPanel memory={activeMemory} timeline={MOCK_TIMELINE} />
      </div>
    </div>
  );
}
