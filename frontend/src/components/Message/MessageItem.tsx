import { Bot, User, BookOpen, ExternalLink, AlertTriangle } from 'lucide-react';
import type { Message } from '../../types/chat';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';
  const isError = message.isError;

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
          <span className={`text-xs font-semibold ${
            isUser ? 'text-purple-400' : isError ? 'text-rose-400' : 'text-purple-400'
          }`}>
            {isUser ? 'You' : isError ? 'System Error' : 'AI Core'}
          </span>
          <span className="text-[10px] text-gray-500">{message.timestamp}</span>
        </div>
        
        <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {/* RAG Sources Citations Panel */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-800/60 space-y-2">
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
