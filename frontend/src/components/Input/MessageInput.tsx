import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  disabled,
  placeholder = 'Ask NuraVault anything (e.g. document analysis, calculations, knowledge queries)...',
}: MessageInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textbox
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-end gap-2 bg-[var(--bg-card)] border border-[var(--border-subtle)] focus-within:border-sky-500/60 focus-within:ring-2 focus-within:ring-sky-500/20 rounded-2xl p-2 md:p-2.5 transition-all shadow-xs"
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 max-h-[200px] resize-none bg-transparent border-0 outline-0 ring-0 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] px-3 py-1.5 focus:ring-0 focus:outline-none min-h-[40px] leading-relaxed"
      />

      <div className="flex items-center gap-1.5 pr-1 pb-1">
        <span className="hidden sm:flex items-center gap-1 text-[10px] text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2 py-1 rounded-lg border border-[var(--border-subtle)] font-mono select-none">
          <span>Enter</span>
          <CornerDownLeft className="w-2.5 h-2.5" />
        </span>
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
            text.trim() && !disabled
              ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-md shadow-sky-600/20 active:scale-95'
              : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed opacity-50'
          }`}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
