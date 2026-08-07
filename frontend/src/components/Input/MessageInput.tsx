import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
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
    <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-gray-900/60 border border-gray-800 rounded-xl p-2 focus-within:border-purple-500/50 transition-all">
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything (e.g. Remote stipend policy...)"
        disabled={disabled}
        className="flex-1 max-h-[200px] resize-none bg-transparent border-0 outline-0 ring-0 text-sm text-white placeholder-gray-500 px-3 py-2 focus:ring-0 focus:outline-none min-h-[38px] leading-relaxed"
      />
      
      <div className="flex items-center gap-1.5 pr-1.5 pb-1">
        <span className="hidden md:flex items-center gap-1 text-[10px] text-gray-500 bg-gray-950/40 px-2 py-1 rounded-md border border-gray-800/40">
          <span>Enter</span>
          <CornerDownLeft className="w-2.5 h-2.5" />
        </span>
        <button
          type="submit"
          disabled={!text.trim() || disabled}
          className={`p-2 rounded-lg transition-all flex items-center justify-center cursor-pointer ${
            text.trim() && !disabled
              ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-md shadow-purple-900/10'
              : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
