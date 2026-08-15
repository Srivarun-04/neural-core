import { useEffect, useRef } from 'react';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import type { Conversation } from '../../types/chat';
import { MessageItem } from '../Message/MessageItem';
import { MessageInput } from '../Input/MessageInput';

interface ChatAreaProps {
  activeConversation: Conversation | null;
  loading: boolean;
  isThinking?: boolean;
  statusMessage?: string;
  onSendMessage: (content: string) => void;
  status: 'connected' | 'disconnected' | 'connecting';
}

export function ChatArea({
  activeConversation,
  loading,
  isThinking,
  statusMessage,
  onSendMessage,
  status
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
    <main className="flex-1 flex flex-col bg-[#080B14] relative overflow-hidden h-full">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
        {!activeConversation || activeConversation.messages.length === 0 ? (
          /* Empty/Welcome View */
          <div className="max-w-2xl mx-auto h-[60vh] flex flex-col items-center justify-center text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shadow-lg shadow-purple-500/5 animate-pulse">
              <Bot className="w-8 h-8 text-purple-400" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Neural Core Agent</h2>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Ask questions, compute calculations, converse naturally, or query your indexed document knowledge base.
              </p>
            </div>
          </div>
        ) : (
          /* Messages List */
          <div className="max-w-3xl mx-auto space-y-6">
            {activeConversation.messages.map((message) => {
              // Hide empty assistant placeholder message if isThinking is active
              if (message.role === 'assistant' && !message.content && isThinking) {
                return null;
              }
              return <MessageItem key={message.id} message={message} />;
            })}
            
            {/* Thinking & Live Tool Status Indicator */}
            {isThinking && (
              <div className="flex gap-4 p-4 rounded-xl bg-gray-900/40 border border-purple-500/20 mr-12 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-gray-800/80 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                </div>
                <div className="flex-1 space-y-1.5 pt-1">
                  <div className="text-xs font-semibold text-purple-300 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>{statusMessage || 'Neural Core is thinking...'}</span>
                  </div>
                  <div className="flex gap-1.5 items-center py-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input Bottom Panel */}
      <div className="border-t border-gray-800/50 bg-[#080B14]/80 backdrop-blur-md px-4 py-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <MessageInput onSend={onSendMessage} disabled={loading || isThinking || status === 'disconnected'} />
          <p className="text-[10px] text-gray-500 text-center mt-2.5">
            Neural Core Engine v0.4 — Tool-Calling AI Agent with RAG, Calculator & Memory.
          </p>
        </div>
      </div>
    </main>
  );
}
