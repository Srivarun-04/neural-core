"use client";

import React, { useEffect, useRef } from "react";
import type { Conversation, Message } from "./types";
import { MessageBubble } from "./MessageBubble";
import { EmptyState } from "./EmptyState";
import { ChatInput } from "./ChatInput";

interface ChatWindowProps {
  conversation: Conversation | null;
  onSendMessage: (content: string) => void;
}

/* ─── Typing Indicator ───────────────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 mr-auto mb-4" aria-label="Assistant is typing" aria-live="polite">
      {/* Avatar */}
      <div
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl"
        style={{
          background: "linear-gradient(135deg, #3b2f8f 0%, #1e1b4b 100%)",
          border: "1px solid rgba(124,106,247,0.3)",
        }}
        aria-hidden="true"
      >
        <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="4" fill="#7c6af7" opacity="0.9" />
          <circle cx="16" cy="16" r="2" fill="white" opacity="0.9" />
        </svg>
      </div>

      {/* Dot animation */}
      <div
        className="flex items-center gap-1 rounded-2xl px-4 py-3"
        style={{
          background: "var(--nc-bg-elevated)",
          border: "1px solid var(--nc-border)",
          borderBottomLeftRadius: "6px",
        }}
        aria-hidden="true"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-1.5 h-1.5 rounded-full"
            style={{
              background: "var(--nc-text-muted)",
              animation: `typing-dot 1.4s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes typing-dot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─── Chat Header ────────────────────────────────────────────────── */
function ChatHeader({ conversation }: { conversation: Conversation | null }) {
  if (!conversation) return null;

  return (
    <div
      className="flex items-center justify-between px-5 py-3 flex-shrink-0"
      style={{
        borderBottom: "1px solid var(--nc-border)",
        background: "rgba(8,11,18,0.6)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: "rgba(124,106,247,0.12)",
            border: "1px solid rgba(124,106,247,0.2)",
          }}
          aria-hidden="true"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7c6af7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h1
          className="text-sm font-semibold truncate"
          style={{ color: "var(--nc-text-primary)" }}
          id="active-conversation-title"
        >
          {conversation.title}
        </h1>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {[
          {
            label: "Export conversation",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            ),
          },
          {
            label: "More options",
            icon: (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
                <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
                <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
              </svg>
            ),
          },
        ].map(({ label, icon }) => (
          <button
            key={label}
            aria-label={label}
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 hover:bg-[var(--nc-bg-elevated)] cursor-pointer"
            style={{ color: "var(--nc-text-muted)" }}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── ChatWindow ─────────────────────────────────────────────────── */
export function ChatWindow({ conversation, onSendMessage }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = React.useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages, isTyping]);

  const handleSend = (content: string) => {
    onSendMessage(content);
    // Simulate assistant typing indicator
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1800);
  };

  const messages: Message[] = conversation?.messages ?? [];

  return (
    <div
      id="chat-window"
      className="flex flex-col flex-1 min-w-0 h-full"
      style={{ background: "var(--nc-bg-base)" }}
    >
      {/* Conversation header */}
      <ChatHeader conversation={conversation} />

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: "smooth" }}
        aria-label="Chat messages"
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="px-4 md:px-8 py-6 flex flex-col">
            {messages.map((msg, idx) => {
              const isLastInGroup =
                idx === messages.length - 1 ||
                messages[idx + 1]?.role !== msg.role;
              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isLastInGroup={isLastInGroup}
                />
              );
            })}

            {/* Typing indicator */}
            {isTyping && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* Chat input */}
      <ChatInput onSend={handleSend} disabled={false} />
    </div>
  );
}
