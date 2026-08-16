import type { Conversation } from '../types/chat';

const KEYS = {
  CONVERSATIONS: 'nuravault_conversations',
  LEGACY_CONVERSATIONS: 'ai_brain_conversations',
  ACTIVE_CONVERSATION_ID: 'nuravault_active_id',
  LEGACY_ACTIVE_CONVERSATION_ID: 'ai_brain_active_conversation_id',
  BACKEND_URL: 'nuravault_backend_url',
  LEGACY_BACKEND_URL: 'ai_brain_backend_url',
  THEME: 'nuravault_theme',
  LEGACY_THEME: 'theme',
  FEEDBACK: 'nuravault_msg_feedback',
};

export const StorageUtil = {
  getTheme(): 'dark' | 'light' {
    try {
      const saved = localStorage.getItem(KEYS.THEME) || localStorage.getItem(KEYS.LEGACY_THEME);
      if (saved === 'light' || saved === 'dark') return saved;
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
      return 'dark';
    } catch {
      return 'dark';
    }
  },

  setTheme(theme: 'dark' | 'light'): void {
    try {
      localStorage.setItem(KEYS.THEME, theme);
      if (theme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    } catch (e) {
      console.error('Error saving theme to localStorage', e);
    }
  },

  getConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(KEYS.CONVERSATIONS) || localStorage.getItem(KEYS.LEGACY_CONVERSATIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading conversations from localStorage', e);
      return [];
    }
  },

  saveConversations(conversations: Conversation[]): void {
    try {
      localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(conversations));
    } catch (e) {
      console.error('Error saving conversations to localStorage', e);
    }
  },

  getActiveConversationId(): string | null {
    return localStorage.getItem(KEYS.ACTIVE_CONVERSATION_ID) || localStorage.getItem(KEYS.LEGACY_ACTIVE_CONVERSATION_ID);
  },

  setActiveConversationId(id: string | null): void {
    if (id) {
      localStorage.setItem(KEYS.ACTIVE_CONVERSATION_ID, id);
    } else {
      localStorage.removeItem(KEYS.ACTIVE_CONVERSATION_ID);
    }
  },

  getBackendUrl(): string | null {
    return localStorage.getItem(KEYS.BACKEND_URL) || localStorage.getItem(KEYS.LEGACY_BACKEND_URL);
  },

  setBackendUrl(url: string): void {
    localStorage.setItem(KEYS.BACKEND_URL, url);
  },

  getMessageFeedback(msgId: string): 'like' | 'dislike' | null {
    try {
      const raw = localStorage.getItem(KEYS.FEEDBACK);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed[msgId] || null;
    } catch {
      return null;
    }
  },

  setMessageFeedback(msgId: string, feedback: 'like' | 'dislike' | null): void {
    try {
      const raw = localStorage.getItem(KEYS.FEEDBACK);
      const parsed = raw ? JSON.parse(raw) : {};
      if (feedback === null) {
        delete parsed[msgId];
      } else {
        parsed[msgId] = feedback;
      }
      localStorage.setItem(KEYS.FEEDBACK, JSON.stringify(parsed));
    } catch (e) {
      console.error('Error saving message feedback to localStorage', e);
    }
  }
};
