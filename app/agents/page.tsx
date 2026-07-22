import { PageShell } from "@/components/ui/PageShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agents — Neural Core",
  description: "Deploy and manage autonomous AI agents for complex multi-step tasks.",
};

export default function AgentsPage() {
  return (
    <PageShell
      id="agents-page"
      title="Agents"
      subtitle="Deploy autonomous agents that reason, plan, and execute complex multi-step tasks on your behalf."
      accentColor="#a78bfa"
      icon={
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" />
          <circle cx="19" cy="8" r="2" />
          <path d="M21 14c1.5.5 3 2 3 4" />
        </svg>
      }
    />
  );
}
