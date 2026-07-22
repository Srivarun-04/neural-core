import type { Metadata } from "next";
import { KnowledgeDashboard } from "@/components/knowledge/KnowledgeDashboard";

export const metadata: Metadata = {
  title: "Knowledge — Neural Core",
  description:
    "Manage your AI knowledge base: upload documents, track processing, and explore indexed content.",
};

export default function KnowledgePage() {
  return <KnowledgeDashboard />;
}
