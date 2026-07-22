import type { Metadata } from "next";
import { MemoryDashboard } from "@/components/memory/MemoryDashboard";

export const metadata: Metadata = {
  title: "Memory — Neural Core",
  description:
    "Manage and explore your AI's persistent memory layer: short-term, long-term, and semantic memories.",
};

export default function MemoryPage() {
  return <MemoryDashboard />;
}
