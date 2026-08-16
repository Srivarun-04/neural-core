import { useState } from 'react';
import { User, BookOpen, ExternalLink, AlertTriangle, Calculator, Wrench, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { Message } from '../../types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';
import { NuraVaultLogo } from '../common/NuraVaultLogo';
import { StorageUtil } from '../../utils/storage';

interface MessageItemProps {
  message: Message;
}

function getToolBadge(toolName: string) {
  const lower = toolName.toLowerCase();
  if (lower.includes('calc')) {
    return {
      icon: <Calculator className="w-3 h-3 text-emerald-400" />,
      label: 'Calculator',
      color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    };
  }
  if (lower.includes('knowledge') || lower.includes('rag') || lower.includes('document')) {
    return {
      icon: <BookOpen className="w-3 h-3 text-sky-400" />,
      label: 'Knowledge Vault',
      color: 'bg-sky-500/10 border-sky-500/20 text-sky-400'
    };
  }
  return {
    icon: <Wrench className="w-3 h-3 text-indigo-400" />,
    label: toolName,
    color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
  };
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(() =>
    StorageUtil.getMessageFeedback(message.id)
  );

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch (err) {
      console.error('Failed to copy response:', err);
    }
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    const newFeedback = feedback === type ? null : type;
    setFeedback(newFeedback);
    StorageUtil.setMessageFeedback(message.id, newFeedback);
  };

  return (
    <div
      className={`group relative flex gap-3.5 md:gap-4 p-4 md:p-5 rounded-2xl border transition-all ${
        isUser
          ? 'bg-sky-500/5 border-sky-500/15 ml-6 sm:ml-12'
          : isError
          ? 'bg-rose-950/20 border-rose-500/30 text-rose-200 mr-6 sm:mr-12'
          : 'bg-[var(--bg-card)] border-[var(--border-subtle)] mr-4 sm:mr-12 shadow-xs'
      }`}
    >
      {/* Avatar Icon */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs ${
          isUser
            ? 'bg-sky-600/15 border border-sky-500/30 text-sky-400'
            : isError
            ? 'bg-rose-950/40 border border-rose-500/40 text-rose-400'
            : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)]'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-sky-500" />
        ) : isError ? (
          <AlertTriangle className="w-4.5 h-4.5 text-rose-400" />
        ) : (
          <NuraVaultLogo size={20} showGlow={false} />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-2.5 min-w-0">
        {/* Header (Role, Badges, Timestamp) */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-bold tracking-tight ${
                isUser
                  ? 'text-sky-500'
                  : isError
                  ? 'text-rose-400'
                  : 'text-[var(--text-primary)]'
              }`}
            >
              {isUser ? 'You' : isError ? 'System Error' : 'NuraVault'}
            </span>

            {/* Tool Badges */}
            {!isUser && message.tools_used && message.tools_used.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {message.tools_used.map((tool, idx) => {
                  const badge = getToolBadge(tool);
                  return (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border ${badge.color}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <span className="text-[10px] text-[var(--text-muted)] flex-shrink-0 font-medium">
            {message.timestamp}
          </span>
        </div>

        {/* Message Body */}
        <div className="text-sm text-[var(--text-primary)] leading-relaxed break-words">
          {isUser || isError ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {/* AI Response Action Buttons Row (Thumbs Up, Thumbs Down, Copy) */}
        {!isUser && !isError && message.content && (
          <div className="flex items-center justify-between pt-2.5 text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] mt-3">
            <div className="flex items-center gap-1">
              {/* Thumbs Up */}
              <button
                onClick={() => handleFeedback('like')}
                type="button"
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                  feedback === 'like'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                }`}
                title="Helpful response"
                aria-label="Thumbs up"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                {feedback === 'like' && <span className="text-[10px] font-medium">Helpful</span>}
              </button>

              {/* Thumbs Down */}
              <button
                onClick={() => handleFeedback('dislike')}
                type="button"
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                  feedback === 'dislike'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                }`}
                title="Unhelpful response"
                aria-label="Thumbs down"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                {feedback === 'dislike' && <span className="text-[10px] font-medium">Reported</span>}
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyMessage}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all cursor-pointer"
              title="Copy entire response"
              aria-label="Copy entire response"
            >
              {copiedMessage ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* RAG Sources Citations Panel */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-secondary)] font-bold tracking-wider uppercase">
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Knowledge Sources ({message.sources.length})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {message.sources.map((src, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[var(--bg-elevated)]/60 border border-[var(--border-subtle)] hover:border-sky-500/30 rounded-xl flex flex-col justify-between gap-1.5 transition-all text-xs shadow-2xs"
                >
                  <div>
                    <div className="font-semibold text-[var(--text-primary)] flex items-center justify-between gap-2">
                      <span className="truncate">{src.title}</span>
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--text-muted)] hover:text-sky-400 transition-colors flex-shrink-0"
                          aria-label="Open source link"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                      {src.snippet}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
