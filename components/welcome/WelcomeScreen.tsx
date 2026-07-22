"use client";

import React from "react";
import Link from "next/link";

/* ─── Quick Action Card ──────────────────────────────────────────── */

interface QuickCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  accentColor: string;
}

function QuickCard({ icon, title, description, href, accentColor }: QuickCardProps) {
  return (
    <Link
      href={href}
      id={`quick-action-${title.toLowerCase()}`}
      className="group relative flex flex-col gap-3 rounded-2xl p-5 transition-all duration-250 hover:-translate-y-0.5"
      style={{
        background: "var(--nc-bg-surface)",
        border: "1px solid var(--nc-border)",
        boxShadow: "0 0 0 0 transparent",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}55`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${accentColor}18`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--nc-border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 transparent";
      }}
      aria-label={`Go to ${title}`}
    >
      {/* Icon bubble */}
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl"
        style={{ background: `${accentColor}18`, color: accentColor }}
        aria-hidden="true"
      >
        {icon}
      </div>

      <div>
        <h3
          className="text-sm font-semibold mb-1 group-hover:text-white transition-colors duration-200"
          style={{ color: "var(--nc-text-primary)" }}
        >
          {title}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: "var(--nc-text-muted)" }}>
          {description}
        </p>
      </div>

      {/* Arrow indicator */}
      <span
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200"
        style={{ color: accentColor }}
        aria-hidden="true"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </Link>
  );
}

/* ─── Welcome Screen ─────────────────────────────────────────────── */

export function WelcomeScreen() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-full px-6 py-16 overflow-hidden"
      id="welcome-screen"
    >
      {/* ── Ambient background orbs ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Primary violet glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(124,106,247,0.14) 0%, rgba(124,106,247,0.04) 50%, transparent 75%)",
            animation: "pulse-glow 4s ease-in-out infinite",
          }}
        />
        {/* Blue accent orb */}
        <div
          className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 320,
            height: 320,
            background:
              "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
            animation: "pulse-glow 6s ease-in-out infinite 1.5s",
          }}
        />
        {/* Violet-pink lower orb */}
        <div
          className="absolute bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2 rounded-full"
          style={{
            width: 280,
            height: 280,
            background:
              "radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)",
            animation: "pulse-glow 5s ease-in-out infinite 3s",
          }}
        />

        {/* Grid lines overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124,106,247,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124,106,247,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full gap-6">

        {/* Status pill */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: "rgba(124,106,247,0.12)",
            border: "1px solid rgba(124,106,247,0.3)",
            color: "var(--nc-accent-text)",
          }}
          id="welcome-status-badge"
        >
          <span
            className="block w-1.5 h-1.5 rounded-full"
            style={{
              background: "var(--nc-accent)",
              animation: "pulse-dot 2s ease-in-out infinite",
            }}
            aria-hidden="true"
          />
          System Online
        </div>

        {/* Main heading */}
        <h1
          className="text-6xl sm:text-7xl font-bold tracking-tight leading-none"
          id="welcome-heading"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #e2e8f0 30%, var(--nc-accent-text) 65%, var(--nc-accent) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Neural Core
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl font-light tracking-widest uppercase"
          id="welcome-subtitle"
          style={{
            color: "var(--nc-text-secondary)",
            letterSpacing: "0.22em",
          }}
        >
          Persistent Intelligence Layer
        </p>

        {/* Description */}
        <p
          className="text-sm leading-relaxed max-w-md"
          style={{ color: "var(--nc-text-muted)" }}
        >
          Your AI-native operating layer. Persistent memory, contextual knowledge,
          autonomous agents, and intelligent tooling — unified.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center gap-3 flex-wrap justify-center mt-2">
          <Link
            href="/chat"
            id="welcome-cta-primary"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-100"
            style={{
              background: "var(--nc-accent)",
              color: "#fff",
              boxShadow: "0 0 24px rgba(124,106,247,0.35)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Start Chatting
          </Link>

          <Link
            href="/agents"
            id="welcome-cta-secondary"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-[var(--nc-bg-hover)]"
            style={{
              background: "var(--nc-bg-elevated)",
              border: "1px solid var(--nc-border)",
              color: "var(--nc-text-secondary)",
            }}
          >
            Explore Agents
          </Link>
        </div>

        {/* ── Quick action cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-6">
          <QuickCard
            href="/chat"
            title="Chat"
            description="Converse with your AI layer in real-time, with full memory context."
            accentColor="#7c6af7"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            }
          />
          <QuickCard
            href="/memory"
            title="Memory"
            description="Persist context, recall facts, and build a long-term knowledge store."
            accentColor="#38bdf8"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
                <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
              </svg>
            }
          />
          <QuickCard
            href="/agents"
            title="Agents"
            description="Deploy autonomous agents that act, reason, and complete tasks."
            accentColor="#a78bfa"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50%       { opacity: 0.7; transform: translate(-50%, -50%) scale(1.07); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
