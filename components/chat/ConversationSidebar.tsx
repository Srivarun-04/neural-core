"use client";

import React, { useState } from "react";
import type { Conversation } from "./types";
import { ConversationItem } from "./ConversationItem";

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
}: ConversationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = searchQuery.trim()
    ? conversations.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  const pinned = filtered.filter((c) => c.isPinned);
  const recent = filtered.filter((c) => !c.isPinned);

  return (
    <aside
      id="conversation-sidebar"
      className="flex flex-col flex-shrink-0 h-full"
      style={{
        width: 320,
        background: "var(--nc-bg-surface)",
        borderRight: "1px solid var(--nc-border)",
      }}
      aria-label="Conversations"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--nc-border)" }}
      >
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--nc-text-primary)" }}
        >
          Conversations
        </h2>
        <span
          className="text-xs px-1.5 py-0.5 rounded-md"
          style={{
            background: "rgba(124,106,247,0.12)",
            color: "var(--nc-accent-text)",
            border: "1px solid rgba(124,106,247,0.2)",
          }}
          aria-label={`${conversations.length} conversations`}
        >
          {conversations.length}
        </span>
      </div>

      {/* New Chat + Search */}
      <div className="px-3 pt-3 pb-2 flex flex-col gap-2 flex-shrink-0">
        {/* New Chat button */}
        <button
          id="new-chat-btn"
          onClick={onNewChat}
          className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-medium transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          style={{
            background: "var(--nc-accent)",
            color: "#fff",
            boxShadow: "0 0 20px rgba(124,106,247,0.3)",
          }}
          aria-label="Start a new chat"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>

        {/* Search */}
        <div className="relative">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--nc-text-muted)" }}
            aria-hidden="true"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            id="conversation-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8 pr-3 py-2 rounded-xl text-xs outline-none transition-all duration-200"
            style={{
              background: "var(--nc-bg-elevated)",
              border: "1px solid var(--nc-border)",
              color: "var(--nc-text-secondary)",
              caretColor: "var(--nc-accent)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(124,106,247,0.4)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(124,106,247,0.08)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--nc-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
            aria-label="Search conversations"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div
        className="flex-1 overflow-y-auto px-2 pb-4"
        role="list"
        aria-label="Conversation list"
      >
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 text-center px-4"
            role="status"
            aria-live="polite"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-3"
              style={{ color: "var(--nc-text-muted)" }}
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: "var(--nc-text-secondary)" }}
            >
              No conversations found
            </p>
            <p className="text-xs" style={{ color: "var(--nc-text-muted)" }}>
              Try a different search term
            </p>
          </div>
        ) : (
          <>
            {/* Pinned section */}
            {pinned.length > 0 && (
              <div className="mb-2">
                <p
                  className="text-xs font-semibold uppercase tracking-wider px-3 py-2"
                  style={{ color: "var(--nc-text-muted)" }}
                >
                  Pinned
                </p>
                <div role="group" aria-label="Pinned conversations">
                  {pinned.map((conv) => (
                    <div key={conv.id} role="listitem">
                      <ConversationItem
                        conversation={conv}
                        isActive={conv.id === activeId}
                        onClick={() => onSelect(conv.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent section */}
            {recent.length > 0 && (
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider px-3 py-2"
                  style={{ color: "var(--nc-text-muted)" }}
                >
                  Recent
                </p>
                <div role="group" aria-label="Recent conversations">
                  {recent.map((conv) => (
                    <div key={conv.id} role="listitem">
                      <ConversationItem
                        conversation={conv}
                        isActive={conv.id === activeId}
                        onClick={() => onSelect(conv.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
