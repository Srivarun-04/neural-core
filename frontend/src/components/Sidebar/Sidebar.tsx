import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, Database, Search, Sun, Moon, Settings } from 'lucide-react';
import type { Conversation } from '../../types/chat';
import { NuraVaultLogo } from '../common/NuraVaultLogo';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onDeleteChat: (id: string) => void;
  onCreateNewChat: () => void;
  currentView: 'chat' | 'knowledge';
  onViewChange: (view: 'chat' | 'knowledge') => void;
  isOpen: boolean;
  onClose?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onSettingsClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Sidebar({
  conversations,
  activeId,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  onCreateNewChat,
  currentView,
  onViewChange,
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  onSettingsClick,
  searchQuery = '',
  onSearchChange,
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

  const filteredConversations = conversations.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 px-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <NuraVaultLogo size={28} />
          <div className="flex flex-col">
            <span className="font-bold text-[var(--text-primary)] tracking-tight text-sm">
              NuraVault
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-medium">
              AI Knowledge Vault
            </span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 md:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-card)] cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="p-3.5 pb-2">
        <button
          onClick={() => {
            onCreateNewChat();
            onViewChange('chat');
          }}
          className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-medium text-xs tracking-wide transition-all shadow-md shadow-sky-600/20 cursor-pointer active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Main Feature Navigation Links */}
      <div className="px-3 py-1.5 space-y-1">
        <button
          onClick={() => onViewChange('chat')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            currentView === 'chat'
              ? 'bg-[var(--bg-card)] text-sky-400 font-semibold border border-sky-500/20'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-sky-400" />
          <span>Chat Workspace</span>
        </button>

        <button
          onClick={() => onViewChange('knowledge')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            currentView === 'knowledge'
              ? 'bg-[var(--bg-card)] text-sky-400 font-semibold border border-sky-500/20'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-sky-400" />
            <span>Knowledge Base</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 font-semibold">
            Vault
          </span>
        </button>
      </div>

      {/* Divider */}
      <div className="px-4 py-2">
        <div className="h-px bg-[var(--border-subtle)]" />
      </div>

      {/* Search Filter for Chats */}
      {onSearchChange && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter chats..."
              className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg pl-8 pr-7 py-1 text-[11px] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-sky-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 py-1">
        <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between">
          <span>Conversations</span>
          <span>{filteredConversations.length}</span>
        </div>

        {filteredConversations.length === 0 ? (
          <div className="h-28 flex flex-col items-center justify-center text-center p-3">
            <p className="text-xs text-[var(--text-muted)]">
              {searchQuery ? 'No matching chats' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          filteredConversations.map((chat) => {
            const isActive = chat.id === activeId && currentView === 'chat';
            const isEditing = chat.id === editingId;

            return (
              <div
                key={chat.id}
                onClick={() => {
                  if (!isEditing) {
                    onSelectChat(chat.id);
                    onViewChange('chat');
                  }
                }}
                className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--bg-card)] text-[var(--text-primary)] font-medium border border-sky-500/30 shadow-xs'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      isActive ? 'text-sky-400' : 'text-[var(--text-muted)]'
                    }`}
                  />

                  {isEditing ? (
                    <form
                      onSubmit={(e) => handleSaveRename(e, chat.id)}
                      className="flex items-center gap-1 flex-1 min-w-0"
                    >
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="w-full bg-[var(--bg-elevated)] border border-sky-500/50 rounded px-1.5 py-0.5 text-xs text-[var(--text-primary)] focus:outline-none"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        type="submit"
                        onClick={(e) => handleSaveRename(e, chat.id)}
                        className="p-1 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                        aria-label="Save title"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelRename}
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                        aria-label="Cancel rename"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </form>
                  ) : (
                    <span className="truncate text-xs tracking-tight">{chat.title}</span>
                  )}
                </div>

                {!isEditing && (
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                    <button
                      onClick={(e) => handleStartRename(e, chat)}
                      className="p-1 text-[var(--text-muted)] hover:text-sky-400 rounded hover:bg-[var(--bg-elevated)] transition-all cursor-pointer"
                      title="Rename Chat"
                      aria-label="Rename Chat"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="p-1 text-[var(--text-muted)] hover:text-rose-400 rounded hover:bg-[var(--bg-elevated)] transition-all cursor-pointer"
                      title="Delete Chat"
                      aria-label="Delete Chat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)] bg-[var(--bg-card)]/50">
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-sky-600" />
                <span>Dark</span>
              </>
            )}
          </button>
        )}

        {onSettingsClick && (
          <button
            onClick={onSettingsClick}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
            title="Backend Settings"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        )}
      </div>
    </aside>
  );
}
