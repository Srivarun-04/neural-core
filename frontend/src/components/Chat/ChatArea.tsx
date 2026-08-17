import { useEffect, useRef } from 'react';
import { Loader2, Sparkles, BookOpen, Calculator, Brain, Shield } from 'lucide-react';
import type { Conversation } from '../../types/chat';
import { MessageItem } from '../Message/MessageItem';
import { MessageInput } from '../Input/MessageInput';
import { NuraVaultLogo } from '../common/NuraVaultLogo';

interface ChatAreaProps {
  activeConversation: Conversation | null;
  loading: boolean;
  isThinking?: boolean;
  statusMessage?: string;
  onSendMessage: (content: string) => void;
  status: 'connected' | 'disconnected' | 'connecting';
}

const STARTER_PROMPTS = [
  {
    icon: <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
    title: 'Query Knowledge Vault',
    prompt: 'Summarize the key information stored in my indexed documents.',
  },
  {
    icon: <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    title: 'Compute Calculation',
    prompt: 'Calculate compound interest on $10,000 at 7% annual return over 5 years.',
  },
  {
    icon: <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
    title: 'Conversation Memory',
    prompt: 'What topics and questions have we discussed so far in this session?',
  },
  {
    icon: <Shield className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
    title: 'Explore Capabilities',
    prompt: 'What are NuraVault\'s core features for document retrieval and tool execution?',
  },
];

export function ChatArea({
  activeConversation,
  loading,
  isThinking,
  statusMessage,
  onSendMessage,
  status,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, loading, isThinking, statusMessage]);

  return (
    <main className="flex-1 flex flex-col bg-[var(--bg-app)] relative overflow-hidden h-full">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
        {!activeConversation || activeConversation.messages.length === 0 ? (
          /* Empty / Welcome View */
          <div className="max-w-2xl mx-auto min-h-[65vh] flex flex-col items-center justify-center text-center gap-6 py-8">
            <div className="relative">
              <NuraVaultLogo size={64} showGlow={true} />
            </div>

            <div className="space-y-2 max-w-lg">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                NuraVault Assistant
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                Your AI workspace for knowledge, memory, and intelligent conversations. Ask questions, execute calculations, or query your secure document vault.
              </p>
            </div>

            {/* Quick Starter Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl text-left mt-2">
              {STARTER_PROMPTS.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(card.prompt)}
                  disabled={status === 'disconnected'}
                  className="p-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-sky-500/40 hover:bg-[var(--bg-elevated)] transition-all cursor-pointer text-left group shadow-xs hover:shadow-md"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded-lg bg-[var(--bg-elevated)] group-hover:bg-sky-500/15 transition-colors">
                      {card.icon}
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {card.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {card.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages List */
          <div className="max-w-3xl mx-auto space-y-5">
            {activeConversation.messages.map((message) => {
              // Hide empty assistant placeholder message if isThinking is active
              if (message.role === 'assistant' && !message.content && isThinking) {
                return null;
              }
              return <MessageItem key={message.id} message={message} />;
            })}

            {/* Thinking & Live Tool Status Indicator */}
            {isThinking && (
              <div className="flex gap-4 p-4 rounded-2xl bg-[var(--bg-card)] border border-sky-500/35 mr-6 sm:mr-12 animate-pulse shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-4 h-4 text-sky-600 dark:text-sky-400 animate-spin" />
                </div>
                <div className="flex-1 space-y-1.5 pt-0.5">
                  <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{statusMessage || 'NuraVault is thinking...'}</span>
                  </div>
                  <div className="flex gap-1.5 items-center py-1">
                    <span className="w-2 h-2 bg-sky-600 dark:bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-sky-500 dark:bg-sky-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-sky-400 dark:bg-sky-300 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input Bottom Panel */}
      <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3.5 md:px-8">
        <div className="max-w-3xl mx-auto">
          <MessageInput
            onSend={onSendMessage}
            disabled={loading || isThinking || status === 'disconnected'}
          />
          <p className="text-[10px] text-[var(--text-muted)] text-center mt-2 font-medium">
            NuraVault v1.0 — AI Knowledge &amp; Conversation Engine with Memory, RAG &amp; Tools.
          </p>
        </div>
      </div>
    </main>
  );
}
