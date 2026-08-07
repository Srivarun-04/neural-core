import { useState, useEffect, useCallback } from 'react';
import type { Conversation, Message, RAGSource } from '../types/chat';
import { ApiService } from '../services/api';

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [initialFetchDone, setInitialFetchDone] = useState<boolean>(false);

  // 1. Initial Load of Sessions from SQLite Backend
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const serverChats = await ApiService.fetchChats();
      setConversations(serverChats);

      if (serverChats.length > 0) {
        setActiveId(serverChats[0].id);
        // Load messages for the first active chat
        const fullChat = await ApiService.getChat(serverChats[0].id);
        setConversations(prev => prev.map(c => c.id === fullChat.id ? fullChat : c));
      }
    } catch (err) {
      console.warn('Failed to load session chats from backend:', err);
    } finally {
      setLoading(false);
      setInitialFetchDone(true);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const activeConversation = conversations.find(c => c.id === activeId) || null;

  // 2. Select Chat & Load Full Messages from SQLite
  const selectChat = async (id: string) => {
    setActiveId(id);
    try {
      const fullChat = await ApiService.getChat(id);
      setConversations(prev => prev.map(c => c.id === id ? fullChat : c));
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  // 3. Create New Chat Session
  const createNewChat = async () => {
    try {
      const newChat = await ApiService.createChat('New Conversation');
      setConversations(prev => [newChat, ...prev]);
      setActiveId(newChat.id);
    } catch (err) {
      console.error('Failed to create new chat session:', err);
    }
  };

  // 4. Rename Chat Session
  const renameChat = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    try {
      await ApiService.renameChat(id, newTitle);
      setConversations(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
    } catch (err) {
      console.error('Failed to rename chat session:', err);
    }
  };

  // 5. Delete Chat Session
  const deleteChat = async (id: string) => {
    try {
      await ApiService.deleteChat(id);
      const filtered = conversations.filter(c => c.id !== id);
      setConversations(filtered);
      if (activeId === id) {
        const nextActive = filtered.length > 0 ? filtered[0].id : null;
        setActiveId(nextActive);
        if (nextActive) selectChat(nextActive);
      }
    } catch (err) {
      console.error('Failed to delete chat session:', err);
    }
  };

  // 6. Send Message with SSE Token Streaming & Typing Indicator
  const sendMessage = async (content: string) => {
    if (!content.trim() || loading || isThinking) return;

    let targetChatId = activeId;
    let targetChat = activeConversation;

    // Create session if none exists
    if (!targetChatId || !targetChat) {
      try {
        const newChat = await ApiService.createChat(content.substring(0, 30));
        setConversations(prev => [newChat, ...prev]);
        setActiveId(newChat.id);
        targetChatId = newChat.id;
        targetChat = newChat;
      } catch (err) {
        console.error('Failed to auto-create session for prompt:', err);
        return;
      }
    }

    const userMsgId = crypto.randomUUID();
    const userMessage: Message = {
      id: userMsgId,
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const assistantMsgId = crypto.randomUUID();
    const assistantPlaceholderMessage: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: []
    };

    // Optimistically update conversation state
    setConversations(prev => prev.map(c => {
      if (c.id === targetChatId) {
        const updatedMsgs = [...c.messages, userMessage, assistantPlaceholderMessage];
        return {
          ...c,
          title: c.messages.length === 0 ? content.substring(0, 30) : c.title,
          messages: updatedMsgs,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    setIsThinking(true);
    setLoading(true);

    let accumulatedContent = '';

    await ApiService.streamChatMessage(
      content,
      targetChatId,
      // onInit
      (initData) => {
        setIsThinking(false);
        setConversations(prev => prev.map(c => {
          if (c.id === targetChatId) {
            return {
              ...c,
              messages: c.messages.map(m => m.id === assistantMsgId ? { ...m, sources: initData.sources } : m)
            };
          }
          return c;
        }));
      },
      // onToken
      (token) => {
        setIsThinking(false);
        accumulatedContent += token;
        setConversations(prev => prev.map(c => {
          if (c.id === targetChatId) {
            return {
              ...c,
              messages: c.messages.map(m => m.id === assistantMsgId ? { ...m, content: accumulatedContent } : m)
            };
          }
          return c;
        }));
      },
      // onDone
      (doneData) => {
        setIsThinking(false);
        setLoading(false);
      },
      // onError
      (error) => {
        console.error('Streaming error:', error);
        setIsThinking(false);
        setLoading(false);
        setConversations(prev => prev.map(c => {
          if (c.id === targetChatId) {
            return {
              ...c,
              messages: c.messages.map(m => m.id === assistantMsgId ? {
                ...m,
                content: m.content || '⚠️ Connection error generating response. Please check server logs.',
                isError: true
              } : m)
            };
          }
          return c;
        }));
      }
    );
  };

  return {
    conversations,
    activeConversation,
    activeId,
    loading,
    isThinking,
    initialFetchDone,
    createNewChat,
    selectChat,
    renameChat,
    deleteChat,
    sendMessage,
  };
}
