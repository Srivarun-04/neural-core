import type { Message, RAGSource } from '../types/chat';

export interface ChatRequest {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export interface ChatResponse {
  response: string;
  sources?: RAGSource[];
}

const DEFAULT_BACKEND_URL = 'http://localhost:8000';

/**
 * Service to manage REST communication with the FastAPI backend.
 */
export class ApiService {
  private static getBackendUrl(): string {
    // Allows dynamic configuration via environment variables or settings
    return (import.meta.env.VITE_API_URL as string) || localStorage.getItem('backend_url') || DEFAULT_BACKEND_URL;
  }

  /**
   * Sends a user chat message to the FastAPI backend.
   * If the request fails (e.g. backend offline), it throws an error.
   */
  static async sendChatMessage(message: string, history?: Message[]): Promise<ChatResponse> {
    const url = `${this.getBackendUrl()}/chat`;
    
    // Format history if the API supports it in the future
    const formattedHistory = history?.map(m => ({
      role: m.role,
      content: m.content
    })) || [];

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: formattedHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        response: data.response || '',
        sources: data.sources || []
      };
    } catch (error) {
      console.error('API Error in sendChatMessage:', error);
      throw error;
    }
  }

  /**
   * Generates a local mock response for testing when backend is offline.
   */
  static generateMockResponse(message: string): Promise<ChatResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const query = message.toLowerCase();
        let reply = "I am your AI Brain helper. I received your message: \"" + message + "\". This is a response from the service layer mock.";
        let mockSources: RAGSource[] = [
          {
            title: "RAG Setup Guide",
            snippet: "Retrieval-Augmented Generation (RAG) integrates LLM reasoning with custom search engines, query retrievers, and external files.",
            url: "https://langchain.com/docs/rag"
          }
        ];

        if (query.includes('remote') || query.includes('expense') || query.includes('policy')) {
          reply = "According to Acme Innovations' Remote Work and Expense Policy (Effective August 1, 2026), full-time employees are provided with a one-time ergonomic home office stipend of $850. Fully remote employees can expense up to $75/month for internet and $40/month for phone plans. Hybrid employees can expense up to $40/month for internet.";
          mockSources = [
            {
              title: "notes.txt: Section 3 & 4 (Home Office & Internet)",
              snippet: "Acme Innovations provides a one-time stipend of $850 for ergonomic home office set up. Fully Remote: up to $75/mo internet and $40/mo mobile. Hybrid: up to $40/mo internet."
            }
          ];
        }

        resolve({
          response: reply,
          sources: mockSources
        });
      }, 800); // realistic network delay
    });
  }
}
