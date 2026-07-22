import React from "react";
import type { Conversation } from "./types";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex flex-col gap-1 rounded-xl px-3 py-2.5 transition-all duration-200 group cursor-pointer"
      style={{
        background: isActive ? "rgba(124,106,247,0.12)" : "transparent",
        border: isActive
          ? "1px solid rgba(124,106,247,0.25)"
          : "1px solid transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background =
            "var(--nc-bg-elevated)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }
      }}
      aria-current={isActive ? "page" : undefined}
      aria-label={`Conversation: ${conversation.title}`}
      id={`conv-item-${conversation.id}`}
    >
      {/* Title row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Pinned indicator */}
          {conversation.isPinned && (
            <span
              className="flex-shrink-0 w-1 h-1 rounded-full"
              style={{ background: "var(--nc-accent)" }}
              aria-label="Pinned"
            />
          )}
          <span
            className="text-sm font-medium truncate"
            style={{
              color: isActive
                ? "var(--nc-text-primary)"
                : "var(--nc-text-secondary)",
            }}
          >
            {conversation.title}
          </span>
        </div>

        <span
          className="text-xs flex-shrink-0"
          style={{ color: "var(--nc-text-muted)" }}
        >
          {conversation.timestamp}
        </span>
      </div>

      {/* Last message preview */}
      <p
        className="text-xs leading-relaxed line-clamp-2"
        style={{ color: "var(--nc-text-muted)" }}
      >
        {conversation.lastMessage}
      </p>
    </button>
  );
}
