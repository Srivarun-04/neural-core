import type { RAGSource, Conversation } from '../types/chat';

export interface ChatRequest {
  message: string;
  chat_id?: string;
}

export interface ChatResponse {
  chat_id: string;
  response: string;
  sources?: RAGSource[];
  tools_used?: string[];
}

const DEFAULT_BACKEND_URL = 'http://localhost:8000';

export class ApiService {
  private static getBackendUrl(): string {
    const url = (import.meta.env.VITE_API_URL as string) || localStorage.getItem('backend_url') || DEFAULT_BACKEND_URL;
    return url.replace(/\/+$/, '');
  }

  // --- Session Management APIs (SQLite Persistence) ---

  static async fetchChats(): Promise<Conversation[]> {
    const url = `${this.getBackendUrl()}/chats`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch chats: ${res.statusText}`);
    const data = await res.json();
    return data.map((c: any) => ({
      id: c.id,
      title: c.title,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      messages: (c.messages || []).map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: m.sources || [],
        tools_used: m.tools_used || []
      }))
    }));
  }

  static async createChat(title?: string): Promise<Conversation> {
    const url = `${this.getBackendUrl()}/chats`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title || 'New Conversation' })
    });
    if (!res.ok) throw new Error(`Failed to create chat: ${res.statusText}`);
    const c = await res.json();
    return {
      id: c.id,
      title: c.title,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      messages: []
    };
  }

  static async getChat(chatId: string): Promise<Conversation> {
    const url = `${this.getBackendUrl()}/chats/${chatId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch chat details: ${res.statusText}`);
    const c = await res.json();
    return {
      id: c.id,
      title: c.title,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      messages: (c.messages || []).map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: m.sources || [],
        tools_used: m.tools_used || []
      }))
    };
  }

  static async renameChat(chatId: string, title: string): Promise<void> {
    const url = `${this.getBackendUrl()}/chats/${chatId}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    if (!res.ok) throw new Error(`Failed to rename chat: ${res.statusText}`);
  }

  static async deleteChat(chatId: string): Promise<void> {
    const url = `${this.getBackendUrl()}/chats/${chatId}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete chat: ${res.statusText}`);
  }

  // --- Synchronous Chat API ---

  static async sendChatMessage(message: string, chatId?: string): Promise<ChatResponse> {
    const url = `${this.getBackendUrl()}/chat`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, chat_id: chatId }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      chat_id: data.chat_id,
      response: data.response || '',
      sources: data.sources || [],
      tools_used: data.tools_used || []
    };
  }

  // --- SSE Streaming Chat API with Tool Status & Badge Support ---

  static async streamChatMessage(
    message: string,
    chatId: string | null,
    onInit: (data: { chat_id: string; sources: RAGSource[] }) => void,
    onStatus: (statusMessage: string) => void,
    onToken: (token: string) => void,
    onDone: (data: { chat_id: string; latency: number; sources?: RAGSource[]; tools_used?: string[] }) => void,
    onError: (err: any) => void
  ): Promise<void> {
    const url = `${this.getBackendUrl()}/chat/stream`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, chat_id: chatId }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Streaming failed: HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const rawData = trimmed.replace(/^data:\s*/, '');
            if (!rawData) continue;

            try {
              const eventPayload = JSON.parse(rawData);
              if (eventPayload.type === 'init') {
                onInit(eventPayload);
              } else if (eventPayload.type === 'status') {
                onStatus(eventPayload.message || 'Processing...');
              } else if (eventPayload.type === 'token') {
                onToken(eventPayload.token);
              } else if (eventPayload.type === 'done') {
                onDone(eventPayload);
              } else if (eventPayload.type === 'error') {
                onError(new Error(eventPayload.detail));
              }
            } catch (pErr) {
              console.warn('Failed to parse SSE JSON chunk:', pErr, rawData);
            }
          }
        }
      }
    } catch (err) {
      onError(err);
    }
  }
}
