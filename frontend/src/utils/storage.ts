import type { Conversation } from '../types/chat';

const KEYS = {
  CONVERSATIONS: 'ai_brain_conversations',
  ACTIVE_CONVERSATION_ID: 'ai_brain_active_conversation_id',
  BACKEND_URL: 'ai_brain_backend_url',
};

export const StorageUtil = {
  getConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(KEYS.CONVERSATIONS);
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
    return localStorage.getItem(KEYS.ACTIVE_CONVERSATION_ID);
  },

  setActiveConversationId(id: string | null): void {
    if (id) {
      localStorage.setItem(KEYS.ACTIVE_CONVERSATION_ID, id);
    } else {
      localStorage.removeItem(KEYS.ACTIVE_CONVERSATION_ID);
    }
  },

  getBackendUrl(): string | null {
    return localStorage.getItem(KEYS.BACKEND_URL);
  },

  setBackendUrl(url: string): void {
    localStorage.setItem(KEYS.BACKEND_URL, url);
  },
};
