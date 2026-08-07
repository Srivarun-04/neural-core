import { Plus, MessageSquare, Trash2, Brain } from 'lucide-react';
import type { Conversation } from '../../types/chat';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onCreateNewChat: () => void;
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  onSelectChat,
  onDeleteChat,
  onCreateNewChat,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-20 w-72 border-r border-gray-800 bg-[#0B0F19] flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Sidebar Header */}
      <div className="h-16 px-6 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <span className="font-semibold text-white tracking-tight">AI Brain Workspace</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 md:hidden text-gray-400 hover:text-white">
            ✕
          </button>
        )}
      </div>

      {/* Action Button */}
      <div className="p-4">
        <button
          onClick={onCreateNewChat}
          className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all shadow-md shadow-purple-900/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 py-2">
        {conversations.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs text-gray-500">No chats started yet.</p>
          </div>
        ) : (
          conversations.map((chat) => {
            const isActive = chat.id === activeId;
            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gray-800/80 text-white font-medium border border-gray-700/50'
                    : 'text-gray-400 hover:bg-gray-900/50 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-purple-400' : 'text-gray-500'}`} />
                  <span className="truncate pr-2">{chat.title}</span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-rose-400 rounded-md hover:bg-gray-800 transition-all cursor-pointer"
                  title="Delete Chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
