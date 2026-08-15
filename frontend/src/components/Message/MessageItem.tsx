import { useState } from 'react';
import { Bot, User, BookOpen, ExternalLink, AlertTriangle, Calculator, Wrench, Copy, Check } from 'lucide-react';
import type { Message } from '../../types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MessageItemProps {
  message: Message;
}

function getToolBadgeIcon(toolName: string) {
  const lower = toolName.toLowerCase();
  if (lower.includes('calc')) {
    return <Calculator className="w-3 h-3 text-emerald-400" />;
  }
  if (lower.includes('knowledge') || lower.includes('rag') || lower.includes('document')) {
    return <BookOpen className="w-3 h-3 text-purple-400" />;
  }
  return <Wrench className="w-3 h-3 text-purple-400" />;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const [copiedMessage, setCopiedMessage] = useState(false);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch (err) {
      console.error('Failed to copy response:', err);
    }
  };

  return (
    <div className={`flex gap-4 p-4.5 rounded-xl border transition-all ${
      isUser 
        ? 'bg-purple-950/5 border-purple-900/10 ml-12' 
        : isError
        ? 'bg-rose-950/10 border-rose-500/20 text-rose-200 mr-12'
        : 'bg-gray-900/30 border-gray-800/40 mr-12'
    }`}>
      {/* Icon Area */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-purple-600/10 border border-purple-500/20' 
          : isError
          ? 'bg-rose-950/40 border border-rose-500/30'
          : 'bg-gray-800 border border-gray-700/50'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-purple-400" />
        ) : isError ? (
          <AlertTriangle className="w-4.5 h-4.5 text-rose-400" />
        ) : (
          <Bot className="w-4.5 h-4.5 text-purple-400" />
        )}
      </div>

      {/* Main Text Content */}
      <div className="flex-1 space-y-3 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold ${
              isUser ? 'text-purple-400' : isError ? 'text-rose-400' : 'text-purple-400'
            }`}>
              {isUser ? 'You' : isError ? 'System Error' : 'Neural Core'}
            </span>

            {/* Tools Used Badges */}
            {!isUser && message.tools_used && message.tools_used.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {message.tools_used.map((tool, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-800/80 border border-gray-700/60 text-gray-300"
                  >
                    {getToolBadgeIcon(tool)}
                    <span>Used: {tool}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <span className="text-[10px] text-gray-500">{message.timestamp}</span>
        </div>
        
        {/* Render Content */}
        <div className="text-sm text-gray-200 leading-relaxed break-words">
          {isUser || isError ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {/* AI Response Action Buttons Bar (Copy) */}
        {!isUser && !isError && message.content && (
          <div className="flex items-center justify-end pt-2 text-xs text-gray-500 border-t border-gray-800/40 mt-3">
            <button
              onClick={handleCopyMessage}
              type="button"
              className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all cursor-pointer"
              title="Copy entire response"
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
          <div className="mt-4 pt-3 border-t border-gray-800/60 space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reference Sources ({message.sources.length})</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {message.sources.map((src, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-gray-950/40 border border-gray-800/60 hover:border-gray-700/50 rounded-lg flex flex-col justify-between gap-1.5 transition-all text-xs"
                >
                  <div>
                    <div className="font-semibold text-gray-300 flex items-center justify-between gap-2">
                      <span className="truncate">{src.title}</span>
                      {src.url && (
                        <a 
                          href={src.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-gray-500 hover:text-purple-400 transition-colors flex-shrink-0"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
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
