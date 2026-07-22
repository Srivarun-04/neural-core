import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex h-full" style={{ background: "var(--nc-bg-base)" }} suppressHydrationWarning>
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Content column — offset by collapsed sidebar width */}
      <div
        className="flex flex-col flex-1 min-h-0 transition-all duration-300"
        style={{ marginLeft: "var(--sidebar-width-collapsed)" }}
        suppressHydrationWarning
      >
        {/* Fixed top navbar */}
        <Navbar />

        {/* Scrollable main content area */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
          style={{
            marginTop: "var(--navbar-height)",
            background: "var(--nc-bg-base)",
          }}
          aria-label="Main content area"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
