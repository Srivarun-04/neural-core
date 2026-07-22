"use client";

import React, { useState } from "react";

interface MemoryHeaderProps {
  totalCount: number;
  onSearch: (query: string) => void;
  onFilter: () => void;
}

export function MemoryHeader({ totalCount, onSearch, onFilter }: MemoryHeaderProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div
      id="memory-header"
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6 pt-6 pb-4"
      style={{ borderBottom: "1px solid var(--nc-border)" }}
    >
      {/* Title group */}
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
          style={{
            background: "rgba(56,189,248,0.12)",
            border: "1px solid rgba(56,189,248,0.25)",
          }}
          aria-hidden="true"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
            <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
          </svg>
        </div>

        <div>
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--nc-text-primary)" }}
          >
            Memory
          </h1>
          <p className="text-xs" style={{ color: "var(--nc-text-muted)" }}>
            Manage persistent AI memory ·{" "}
            <span style={{ color: "var(--nc-accent-text)" }}>
              {totalCount.toLocaleString()} records
            </span>
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search */}
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--nc-text-muted)" }}
            aria-hidden="true"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            id="memory-search"
            type="search"
            value={query}
            onChange={handleChange}
            placeholder="Search memories..."
            className="pl-8 pr-3 py-2 rounded-xl text-xs outline-none transition-all duration-200 w-48"
            style={{
              background: "var(--nc-bg-elevated)",
              border: "1px solid var(--nc-border)",
              color: "var(--nc-text-secondary)",
              caretColor: "var(--nc-accent)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(56,189,248,0.4)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(56,189,248,0.08)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--nc-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
            aria-label="Search memories"
          />
        </div>

        {/* Filter button */}
        <button
          id="memory-filter-btn"
          onClick={onFilter}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:bg-[var(--nc-bg-elevated)] cursor-pointer"
          style={{
            background: "var(--nc-bg-surface)",
            border: "1px solid var(--nc-border)",
            color: "var(--nc-text-secondary)",
          }}
          aria-label="Filter memories"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filter
        </button>

        {/* New Memory button */}
        <button
          id="new-memory-btn"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:opacity-90 cursor-pointer"
          style={{
            background: "var(--nc-accent)",
            color: "#fff",
            boxShadow: "0 0 16px rgba(124,106,247,0.25)",
          }}
          aria-label="Create new memory"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Memory
        </button>
      </div>
    </div>
  );
}
