"use client";

import React, { useRef, useState, useCallback } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const MAX_ROWS = 8;
const LINE_HEIGHT = 24; // px
const BASE_HEIGHT = 44; // px — single line

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* Auto-grow textarea up to MAX_ROWS lines */
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxHeight = LINE_HEIGHT * MAX_ROWS;
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustHeight();
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = `${BASE_HEIGHT}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div
      className="px-4 pb-4 pt-2 flex-shrink-0"
      style={{ borderTop: "1px solid var(--nc-border)" }}
    >
      {/* Hint */}
      <p
        className="text-xs mb-2 text-center"
        style={{ color: "var(--nc-text-muted)" }}
        aria-hidden="true"
      >
        Press{" "}
        <kbd
          className="px-1 py-0.5 rounded text-xs"
          style={{
            background: "var(--nc-bg-elevated)",
            border: "1px solid var(--nc-border)",
            fontFamily: "inherit",
          }}
        >
          Enter
        </kbd>{" "}
        to send ·{" "}
        <kbd
          className="px-1 py-0.5 rounded text-xs"
          style={{
            background: "var(--nc-bg-elevated)",
            border: "1px solid var(--nc-border)",
            fontFamily: "inherit",
          }}
        >
          Shift+Enter
        </kbd>{" "}
        for newline
      </p>

      {/* Input container */}
      <div
        className="relative flex items-end gap-2 rounded-2xl px-3 py-2 transition-all duration-200"
        style={{
          background: "var(--nc-bg-elevated)",
          border: "1px solid var(--nc-border)",
        }}
        onFocusCapture={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(124,106,247,0.5)";
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 0 0 3px rgba(124,106,247,0.08)";
        }}
        onBlurCapture={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor =
            "var(--nc-border)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/* Attach button */}
        <button
          id="chat-attach-btn"
          type="button"
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl mb-0.5 transition-all duration-200 hover:bg-[var(--nc-bg-hover)] cursor-pointer"
          style={{ color: "var(--nc-text-muted)" }}
          aria-label="Attach file"
          disabled={disabled}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        {/* Textarea */}
        <textarea
          id="chat-input-textarea"
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask Neural Core anything..."
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-sm resize-none outline-none leading-6 py-1"
          style={{
            color: "var(--nc-text-primary)",
            minHeight: `${LINE_HEIGHT}px`,
            maxHeight: `${LINE_HEIGHT * MAX_ROWS}px`,
            overflowY: "auto",
            caretColor: "var(--nc-accent)",
          }}
          aria-label="Chat input"
          aria-multiline="true"
        />

        {/* Send button */}
        <button
          id="chat-send-btn"
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl mb-0.5 transition-all duration-200 cursor-pointer"
          style={{
            background: canSend ? "var(--nc-accent)" : "var(--nc-bg-hover)",
            color: canSend ? "#fff" : "var(--nc-text-muted)",
            boxShadow: canSend ? "0 0 16px rgba(124,106,247,0.35)" : "none",
            transform: canSend ? "scale(1)" : "scale(0.95)",
          }}
          aria-label="Send message"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
