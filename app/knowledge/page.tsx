import { PageShell } from "@/components/ui/PageShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge — Neural Core",
  description: "Structured knowledge base for documents, embeddings, and semantic search.",
};

export default function KnowledgePage() {
  return (
    <PageShell
      id="knowledge-page"
      title="Knowledge"
      subtitle="Ingest documents, build embeddings, and power your AI with structured contextual knowledge."
      accentColor="#34d399"
      icon={
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="9" y1="12" x2="13" y2="12" />
        </svg>
      }
    />
  );
}
