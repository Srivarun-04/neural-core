"use client";

import React from "react";

export function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center flex-1 px-8 py-20 text-center select-none"
      id="chat-empty-state"
      aria-label="Start a new conversation"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          width: 320,
          height: 320,
          background:
            "radial-gradient(circle, rgba(124,106,247,0.1) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Icon */}
      <div
        className="relative flex items-center justify-center w-20 h-20 rounded-3xl mb-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,106,247,0.18) 0%, rgba(56,189,248,0.1) 100%)",
          border: "1px solid rgba(124,106,247,0.2)",
          boxShadow: "0 0 40px rgba(124,106,247,0.12)",
        }}
        aria-hidden="true"
      >
        {/* Neural spark icon */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="url(#empty-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <linearGradient
              id="empty-grad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#a89cfa" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>

        {/* Orbiting dot */}
        <span
          aria-hidden="true"
          className="absolute top-2 right-2 w-2 h-2 rounded-full"
          style={{
            background: "var(--nc-accent)",
            boxShadow: "0 0 6px var(--nc-accent)",
            animation: "pulse-dot 2.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Heading */}
      <h2
        className="text-2xl font-semibold mb-3 tracking-tight"
        style={{ color: "var(--nc-text-primary)" }}
      >
        How can{" "}
        <span style={{ color: "var(--nc-accent-text)" }}>Neural Core</span>{" "}
        help today?
      </h2>

      {/* Description */}
      <p
        className="text-sm leading-relaxed max-w-xs"
        style={{ color: "var(--nc-text-muted)" }}
      >
        Start a new conversation or select one from the sidebar. Your AI layer
        is ready with persistent memory and full context.
      </p>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2 mt-8 justify-center max-w-md">
        {[
          "Explain a concept",
          "Analyze my data",
          "Write code",
          "Summarize a document",
          "Plan a project",
          "Debug an issue",
        ].map((chip) => (
          <button
            key={chip}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
            style={{
              background: "var(--nc-bg-elevated)",
              border: "1px solid var(--nc-border)",
              color: "var(--nc-text-secondary)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(124,106,247,0.4)";
              (e.currentTarget as HTMLElement).style.color =
                "var(--nc-accent-text)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--nc-border)";
              (e.currentTarget as HTMLElement).style.color =
                "var(--nc-text-secondary)";
            }}
            aria-label={`Suggestion: ${chip}`}
          >
            {chip}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}
