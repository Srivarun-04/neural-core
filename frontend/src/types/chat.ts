export interface RAGSource {
  title: string;
  snippet: string;
  url?: string;
  score?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: RAGSource[];
  tools_used?: string[];
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  backendUrl: string;
  systemPrompt?: string;
}
