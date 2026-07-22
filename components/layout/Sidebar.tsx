"use client";

import React, { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { NavItem, navItems, settingsItem } from "@/components/ui/NavItem";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <>
      {/* Sidebar panel */}
      <aside
        id="main-sidebar"
        className="fixed left-0 top-0 bottom-0 z-30 flex flex-col transition-all duration-300 ease-out"
        style={{
          width: collapsed
            ? "var(--sidebar-width-collapsed)"
            : "var(--sidebar-width-expanded)",
          background: "var(--nc-bg-surface)",
          borderRight: "1px solid var(--nc-border)",
        }}
        aria-label="Main navigation"
      >
        {/* Logo area */}
        <div
          className="flex items-center h-[var(--navbar-height)] px-3 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--nc-border)" }}
        >
          <Logo size="sm" showWordmark={!collapsed} />
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-[4.5rem] z-10 flex items-center justify-center w-6 h-6 rounded-full cursor-pointer transition-all duration-200 hover:scale-110"
          style={{
            background: "var(--nc-bg-elevated)",
            border: "1px solid var(--nc-border)",
            color: "var(--nc-text-muted)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          id="sidebar-toggle-btn"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="currentColor"
            className={`transition-transform duration-300 ${collapsed ? "" : "rotate-180"}`}
            aria-hidden="true"
          >
            <path d="M3.5 2L6.5 5L3.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>

        {/* Main nav items */}
        <nav className="flex-1 flex flex-col gap-1 px-2 py-3 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <NavItem key={item.href} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Divider */}
        <hr
          className="mx-3 mb-1 border-0"
          style={{ height: "1px", background: "var(--nc-border)" }}
          aria-hidden="true"
        />

        {/* Settings pinned at bottom */}
        <footer className="px-2 py-3 flex-shrink-0">
          <NavItem item={settingsItem} collapsed={collapsed} />
        </footer>
      </aside>

      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
          onClick={() => setCollapsed(true)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
