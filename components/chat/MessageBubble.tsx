import React from "react";
import type { Message } from "./types";

interface MessageBubbleProps {
  message: Message;
  isLastInGroup?: boolean;
}

/* ─── Assistant Avatar ───────────────────────────────────────────── */
function AssistantAvatar() {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl self-end"
      style={{
        background: "linear-gradient(135deg, #3b2f8f 0%, #1e1b4b 100%)",
        border: "1px solid rgba(124,106,247,0.3)",
        boxShadow: "0 0 12px rgba(124,106,247,0.2)",
      }}
      aria-hidden="true"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="14" stroke="#7c6af7" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="16" y1="5" x2="16" y2="27" stroke="#7c6af7" strokeWidth="0.8" strokeOpacity="0.5" />
        <line x1="5" y1="16" x2="27" y2="16" stroke="#7c6af7" strokeWidth="0.8" strokeOpacity="0.5" />
        <circle cx="16" cy="16" r="4" fill="#7c6af7" opacity="0.9" />
        <circle cx="16" cy="16" r="2" fill="white" opacity="0.9" />
      </svg>
    </div>
  );
}

/* ─── User Avatar ────────────────────────────────────────────────── */
function UserAvatar() {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl self-end text-xs font-semibold"
      style={{
        background: "linear-gradient(135deg, #4c1d95 0%, #2563eb 100%)",
        color: "#e2e8f0",
      }}
      aria-hidden="true"
    >
      U
    </div>
  );
}

/* ─── Message Content ────────────────────────────────────────────── */
function MessageContent({ content }: { content: string }) {
  // Render content with basic markdown-like formatting for bold (**text**)
  // and newlines → paragraphs. No markdown library needed.
  const lines = content.split("\n");
  const rendered: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line === "") {
      i++;
      continue;
    }

    // Bold section header (starts with **)
    const boldMatch = line.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      rendered.push(
        <p key={i} className="font-semibold mt-3 mb-1" style={{ color: "var(--nc-text-primary)" }}>
          {boldMatch[1]}
        </p>
      );
      i++;
      continue;
    }

    // Inline bold within text
    const inlineBold = line.includes("**");
    if (inlineBold) {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      rendered.push(
        <p key={i} className="leading-relaxed">
          {parts.map((part, idx) =>
            idx % 2 === 0 ? part : <strong key={idx} style={{ color: "var(--nc-text-primary)", fontWeight: 600 }}>{part}</strong>
          )}
        </p>
      );
      i++;
      continue;
    }

    rendered.push(
      <p key={i} className="leading-relaxed">
        {line}
      </p>
    );
    i++;
  }

  return <div className="flex flex-col gap-1.5 text-sm">{rendered}</div>;
}

/* ─── MessageBubble ──────────────────────────────────────────────── */
export function MessageBubble({ message, isLastInGroup = false }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={[
        "group flex items-end gap-2.5 max-w-[85%] md:max-w-[72%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto flex-row",
        isLastInGroup ? "mb-4" : "mb-1.5",
      ].join(" ")}
      role="article"
      aria-label={`${isUser ? "Your" : "Assistant"} message at ${message.timestamp}`}
    >
      {/* Avatar */}
      {isUser ? <UserAvatar /> : <AssistantAvatar />}

      {/* Bubble */}
      <div className="flex flex-col gap-1" style={{ maxWidth: "calc(100% - 44px)" }}>
        <div
          className="relative rounded-2xl px-4 py-3 transition-all duration-200"
          style={
            isUser
              ? {
                  background:
                    "linear-gradient(135deg, var(--nc-accent) 0%, #5b4fd4 100%)",
                  color: "#fff",
                  borderBottomRightRadius: "6px",
                  boxShadow: "0 2px 16px rgba(124,106,247,0.25)",
                }
              : {
                  background: "var(--nc-bg-elevated)",
                  border: "1px solid var(--nc-border)",
                  color: "var(--nc-text-secondary)",
                  borderBottomLeftRadius: "6px",
                }
          }
        >
          <MessageContent content={message.content} />
        </div>

        {/* Timestamp — shows on group hover */}
        <span
          className="text-xs px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{
            color: "var(--nc-text-muted)",
            textAlign: isUser ? "right" : "left",
          }}
          aria-label={`Sent at ${message.timestamp}`}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
