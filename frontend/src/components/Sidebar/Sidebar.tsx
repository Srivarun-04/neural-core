import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, Brain } from 'lucide-react';
import type { Conversation } from '../../types/chat';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
  onCreateNewChat: () => void;
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  onCreateNewChat,
  isOpen,
  onClose,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  const handleStartRename = (e: React.MouseEvent, chat: Conversation) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditingTitle(chat.title);
  };

  const handleSaveRename = (e: React.MouseEvent | React.FormEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (editingTitle.trim()) {
      onRenameChat(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-20 w-72 border-r border-gray-800/80 bg-[#0B0F19] flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Sidebar Header */}
      <div className="h-16 px-6 border-b border-gray-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <span className="font-semibold text-white tracking-tight text-sm">Neural Core OS</span>
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
          className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all shadow-lg shadow-purple-900/20 cursor-pointer active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 py-2">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          Conversations ({conversations.length})
        </div>
        {conversations.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs text-gray-500">No chats started yet.</p>
          </div>
        ) : (
          conversations.map((chat) => {
            const isActive = chat.id === activeId;
            const isEditing = chat.id === editingId;

            return (
              <div
                key={chat.id}
                onClick={() => !isEditing && onSelectChat(chat.id)}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gray-800/80 text-white font-medium border border-gray-700/60 shadow-sm'
                    : 'text-gray-400 hover:bg-gray-900/60 hover:text-gray-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-purple-400' : 'text-gray-500'}`} />

                  {isEditing ? (
                    <form onSubmit={(e) => handleSaveRename(e, chat.id)} className="flex items-center gap-1 flex-1 min-w-0">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="w-full bg-gray-900 border border-purple-500/50 rounded text-xs px-2 py-1 text-white focus:outline-none"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button type="submit" onClick={(e) => handleSaveRename(e, chat.id)} className="p-1 text-emerald-400 hover:text-emerald-300">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={handleCancelRename} className="p-1 text-gray-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <span className="truncate text-xs tracking-tight">{chat.title}</span>
                  )}
                </div>

                {!isEditing && (
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <button
                      onClick={(e) => handleStartRename(e, chat)}
                      className="p-1 text-gray-400 hover:text-purple-300 rounded hover:bg-gray-800 transition-all cursor-pointer"
                      title="Rename Chat"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="p-1 text-gray-400 hover:text-rose-400 rounded hover:bg-gray-800 transition-all cursor-pointer"
                      title="Delete Chat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
