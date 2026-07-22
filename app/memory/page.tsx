import { PageShell } from "@/components/ui/PageShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memory — Neural Core",
  description: "Persist context, recall facts, and build a long-term knowledge store.",
};

export default function MemoryPage() {
  return (
    <PageShell
      id="memory-page"
      title="Memory"
      subtitle="Persist context, recall facts, and build a long-term knowledge store across all your sessions."
      accentColor="#38bdf8"
      icon={
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
      }
    />
  );
}
