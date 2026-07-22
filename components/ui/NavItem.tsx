"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

/* ─── Icon Components ────────────────────────────────────────────── */

function IconChat({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      {active && <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />}
      {active && <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />}
      {active && <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />}
    </svg>
  );
}

function IconMemory() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </svg>
  );
}

function IconKnowledge() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="9" y1="12" x2="13" y2="12" />
    </svg>
  );
}

function IconAgents() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
      <circle cx="19" cy="8" r="2" />
      <path d="M21 14c1.5.5 3 2 3 4" />
    </svg>
  );
}

function IconTools() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

/* ─── Nav Item Data ──────────────────────────────────────────────── */

export interface NavItemConfig {
  label: string;
  href: string;
  icon: React.ComponentType<{ active?: boolean }>;
}

export const navItems: NavItemConfig[] = [
  { label: "Chat",      href: "/chat",      icon: IconChat },
  { label: "Memory",    href: "/memory",    icon: IconMemory },
  { label: "Knowledge", href: "/knowledge", icon: IconKnowledge },
  { label: "Agents",    href: "/agents",    icon: IconAgents },
  { label: "Tools",     href: "/tools",     icon: IconTools },
];

export const settingsItem: NavItemConfig = {
  label: "Settings",
  href: "/settings",
  icon: IconSettings,
};

/* ─── NavItem Component ──────────────────────────────────────────── */

interface NavItemProps {
  item: NavItemConfig;
  collapsed: boolean;
}

export function NavItem({ item, collapsed }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={[
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nc-accent)]",
        isActive
          ? "bg-[var(--nc-accent-glow)] text-[var(--nc-accent-text)]"
          : "text-[var(--nc-text-secondary)] hover:bg-[var(--nc-bg-hover)] hover:text-[var(--nc-text-primary)]",
      ].join(" ")}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full"
          style={{ backgroundColor: "var(--nc-accent)" }}
          aria-hidden="true"
        />
      )}

      {/* Icon */}
      <span
        className={[
          "flex-shrink-0 transition-colors duration-200",
          isActive
            ? "text-[var(--nc-accent)]"
            : "text-[var(--nc-text-muted)] group-hover:text-[var(--nc-text-secondary)]",
        ].join(" ")}
      >
        <Icon active={isActive} />
      </span>

      {/* Label */}
      {!collapsed && (
        <span className="text-sm font-medium leading-none truncate">
          {item.label}
        </span>
      )}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <span
          className={[
            "pointer-events-none absolute left-full ml-3 z-50",
            "rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap",
            "opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0",
            "transition-all duration-150",
          ].join(" ")}
          style={{
            background: "var(--nc-bg-elevated)",
            color: "var(--nc-text-primary)",
            border: "1px solid var(--nc-border)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
          role="tooltip"
        >
          {item.label}
        </span>
      )}
    </Link>
  );
}
