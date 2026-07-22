import React from "react";

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = "Search anything..." }: SearchBarProps) {
  return (
    <div
      className="relative flex items-center w-full max-w-xs"
      role="search"
    >
      {/* Search icon */}
      <span
        className="absolute left-3 flex-shrink-0 pointer-events-none"
        style={{ color: "var(--nc-text-muted)" }}
        aria-hidden="true"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      {/* Input */}
      <input
        id="global-search"
        type="search"
        readOnly
        placeholder={placeholder}
        className="w-full pl-9 pr-16 py-2 text-sm rounded-xl outline-none cursor-pointer transition-all duration-200"
        style={{
          background: "var(--nc-bg-elevated)",
          border: "1px solid var(--nc-border)",
          color: "var(--nc-text-secondary)",
          caretColor: "var(--nc-accent)",
        }}
        aria-label="Global search"
      />

      {/* Keyboard shortcut badge */}
      <kbd
        className="absolute right-2.5 flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded-md pointer-events-none select-none"
        style={{
          background: "var(--nc-bg-surface)",
          border: "1px solid var(--nc-border)",
          color: "var(--nc-text-muted)",
          fontFamily: "inherit",
        }}
        aria-label="Keyboard shortcut: Command K"
      >
        <span className="text-xs">⌘</span>
        <span>K</span>
      </kbd>
    </div>
  );
}
