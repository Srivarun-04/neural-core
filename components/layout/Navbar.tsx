import React from "react";
import { Logo } from "@/components/ui/Logo";
import { SearchBar } from "@/components/ui/SearchBar";
import { Avatar } from "@/components/ui/Avatar";

export function Navbar() {
  return (
    <header
      id="top-navbar"
      className="fixed top-0 right-0 z-20 flex items-center gap-4 px-5"
      style={{
        left: "var(--sidebar-width-collapsed)",
        height: "var(--navbar-height)",
        background: "rgba(8, 11, 18, 0.85)",
        backdropFilter: "blur(16px) saturate(1.5)",
        WebkitBackdropFilter: "blur(16px) saturate(1.5)",
        borderBottom: "1px solid var(--nc-border)",
        transition: "left 0.3s ease",
      }}
      aria-label="Top navigation bar"
    >
      {/* Logo / Wordmark */}
      <div className="flex-shrink-0 hidden sm:block">
        <Logo size="sm" showWordmark />
      </div>

      {/* Separator */}
      <div
        className="hidden sm:block h-5 w-px flex-shrink-0"
        style={{ background: "var(--nc-border)" }}
        aria-hidden="true"
      />

      {/* Search — grows to fill */}
      <div className="flex-1 max-w-md">
        <SearchBar />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
        {/* Notification bell */}
        <button
          id="notification-btn"
          className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 hover:bg-[var(--nc-bg-elevated)] cursor-pointer"
          style={{ color: "var(--nc-text-muted)" }}
          aria-label="Notifications"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {/* Unread dot */}
          <span
            className="absolute top-2 right-2 block w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--nc-accent)" }}
            aria-label="Unread notifications"
          />
        </button>

        {/* Profile avatar */}
        <Avatar size="md" initials="NC" />
      </div>
    </header>
  );
}
