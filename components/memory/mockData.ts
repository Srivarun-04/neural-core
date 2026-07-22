import type {
  MemoryItem,
  MemoryCategory,
  MemoryOverviewStat,
  TimelineEvent,
} from "./types";

/* ─── Overview Stats ─────────────────────────────────────────────── */
export const MEMORY_OVERVIEW_STATS: MemoryOverviewStat[] = [
  {
    id: "total",
    label: "Total Memories",
    value: 2847,
    trend: 12,
    type: "total",
  },
  {
    id: "short_term",
    label: "Short-Term",
    value: 143,
    unit: "active",
    trend: 5,
    type: "short_term",
  },
  {
    id: "long_term",
    label: "Long-Term",
    value: 2609,
    trend: 8,
    type: "long_term",
  },
  {
    id: "semantic",
    label: "Semantic",
    value: 95,
    unit: "clusters",
    trend: -2,
    type: "semantic",
  },
];

/* ─── Recent Memories ─────────────────────────────────────────────── */
export const RECENT_MEMORIES: MemoryItem[] = [
  {
    id: "mem-001",
    title: "User prefers concise code responses with TypeScript",
    category: "Preferences",
    type: "long_term",
    tags: [
      { label: "coding", color: "#7c6af7" },
      { label: "typescript" },
      { label: "style" },
    ],
    preview:
      "The user has consistently requested shorter, type-safe code samples with explicit return types and minimal inline comments.",
    createdAt: "2026-07-20",
    updatedAt: "2026-07-22",
    importance: "high",
    source: "chat-session-4821",
  },
  {
    id: "mem-002",
    title: "Project: Neural Core monorepo architecture",
    category: "Learned Facts",
    type: "long_term",
    tags: [
      { label: "project", color: "#38bdf8" },
      { label: "architecture" },
      { label: "next.js" },
    ],
    preview:
      "Neural Core is a Next.js 15 frontend inside a monorepo. Backend will be FastAPI. Memory and Knowledge are core modules.",
    createdAt: "2026-07-22",
    updatedAt: "2026-07-22",
    importance: "critical",
    source: "chat-session-5102",
  },
  {
    id: "mem-003",
    title: "Dark mode is the preferred UI theme",
    category: "Preferences",
    type: "semantic",
    tags: [{ label: "ui" }, { label: "dark-mode" }, { label: "design" }],
    preview:
      "The user has always requested dark-first designs with purple accent colors. Glassmorphism elements are also preferred.",
    createdAt: "2026-07-18",
    updatedAt: "2026-07-20",
    importance: "medium",
    source: "inferred",
  },
  {
    id: "mem-004",
    title: "Conversation: Git push blocked by large files",
    category: "Conversations",
    type: "short_term",
    tags: [{ label: "git" }, { label: "debugging" }, { label: "resolved" }],
    preview:
      "Push was rejected because .next/ and node_modules/ were tracked in history. Fixed by git reset and git rm --cached.",
    createdAt: "2026-07-22",
    updatedAt: "2026-07-22",
    importance: "low",
    source: "chat-session-5098",
  },
  {
    id: "mem-005",
    title: "User timezone: Asia/Kolkata (IST, +5:30)",
    category: "User Profile",
    type: "long_term",
    tags: [{ label: "profile" }, { label: "timezone" }],
    preview:
      "User is located in India and works in IST. Morning sessions start around 16:00 UTC.",
    createdAt: "2026-07-15",
    updatedAt: "2026-07-15",
    importance: "medium",
    source: "system",
  },
  {
    id: "mem-006",
    title: "ESLint and TypeScript must pass before every commit",
    category: "Preferences",
    type: "long_term",
    tags: [{ label: "workflow" }, { label: "quality" }, { label: "ci" }],
    preview:
      "The user always wants linting and type-checking confirmed before any git commit or push operation.",
    createdAt: "2026-07-21",
    updatedAt: "2026-07-22",
    importance: "high",
    source: "inferred",
  },
];

/* ─── Memory Categories ───────────────────────────────────────────── */
export const MEMORY_CATEGORIES: MemoryCategory[] = [
  {
    id: "cat-profile",
    name: "User Profile",
    description: "Identity, preferences, and personal context",
    count: 38,
    icon: "profile",
    color: "#7c6af7",
  },
  {
    id: "cat-prefs",
    name: "Preferences",
    description: "Behavioral settings and style choices",
    count: 124,
    icon: "preferences",
    color: "#38bdf8",
  },
  {
    id: "cat-convs",
    name: "Conversations",
    description: "Key takeaways from past sessions",
    count: 1847,
    icon: "conversations",
    color: "#34d399",
  },
  {
    id: "cat-facts",
    name: "Learned Facts",
    description: "Domain knowledge extracted from interactions",
    count: 838,
    icon: "facts",
    color: "#f59e0b",
  },
];

/* ─── Timeline Events ─────────────────────────────────────────────── */
export const MOCK_TIMELINE: TimelineEvent[] = [
  { id: "t1", label: "Memory created", timestamp: "Jul 22, 16:33", type: "created" },
  { id: "t2", label: "Importance updated to High", timestamp: "Jul 22, 16:35", type: "updated" },
  { id: "t3", label: "Accessed by AI Orchestrator", timestamp: "Jul 22, 16:40", type: "accessed" },
  { id: "t4", label: "Tags added: typescript, style", timestamp: "Jul 22, 16:42", type: "updated" },
];
