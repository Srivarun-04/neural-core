/* ─── Memory Domain Types ─────────────────────────────────────────── */

export type MemoryImportance = "critical" | "high" | "medium" | "low";
export type MemoryType = "short_term" | "long_term" | "semantic";

export interface MemoryTag {
  label: string;
  color?: string;
}

export interface MemoryItem {
  id: string;
  title: string;
  category: string;
  type: MemoryType;
  tags: MemoryTag[];
  preview: string;
  createdAt: string;
  updatedAt: string;
  importance: MemoryImportance;
  source?: string;
}

export interface MemoryCategory {
  id: string;
  name: string;
  description: string;
  count: number;
  icon: "profile" | "preferences" | "conversations" | "facts";
  color: string;
}

export interface MemoryOverviewStat {
  id: string;
  label: string;
  value: number;
  unit?: string;
  trend?: number; // percent change, positive = up
  type: "total" | "short_term" | "long_term" | "semantic";
}

export interface TimelineEvent {
  id: string;
  label: string;
  timestamp: string;
  type: "created" | "updated" | "accessed" | "deleted";
}
