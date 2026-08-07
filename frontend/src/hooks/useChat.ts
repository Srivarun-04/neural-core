import { useState, useEffect } from 'react';
import type { Conversation, Message } from '../types/chat';
import { StorageUtil } from '../utils/storage';
import { ApiService } from '../services/api';

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    const stored = StorageUtil.getConversations();
    const storedActive = StorageUtil.getActiveConversationId();
    
    setConversations(stored);
    
    if (storedActive && stored.some(c => c.id === storedActive)) {
      setActiveId(storedActive);
    } else if (stored.length > 0) {
      setActiveId(stored[0].id);
      StorageUtil.setActiveConversationId(stored[0].id);
    }
  }, []);

  // Save conversations whenever state changes
  useEffect(() => {
    if (conversations.length > 0) {
      StorageUtil.saveConversations(conversations);
    }
  }, [conversations]);

  const activeConversation = conversations.find(c => c.id === activeId) || null;

  const createNewChat = () => {
    const newChat: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setConversations(prev => [newChat, ...prev]);
    setActiveId(newChat.id);
    StorageUtil.setActiveConversationId(newChat.id);
  };

  const selectChat = (id: string) => {
    setActiveId(id);
    StorageUtil.setActiveConversationId(id);
  };

  const deleteChat = (id: string) => {
    const filtered = conversations.filter(c => c.id !== id);
    setConversations(filtered);
    StorageUtil.saveConversations(filtered);

    if (activeId === id) {
      const nextActive = filtered.length > 0 ? filtered[0].id : null;
      setActiveId(nextActive);
      StorageUtil.setActiveConversationId(nextActive);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    let currentConversation = activeConversation;
    
    // Create chat on the fly if none is active
    if (!currentConversation) {
      const newChat: Conversation = {
        id: crypto.randomUUID(),
        title: content.substring(0, 30) || 'New Conversation',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setConversations(prev => [newChat, ...prev]);
      setActiveId(newChat.id);
      StorageUtil.setActiveConversationId(newChat.id);
      currentConversation = newChat;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update state with user message
    const updatedMessages = [...currentConversation.messages, userMessage];
    
    setConversations(prev => prev.map(c => {
      if (c.id === currentConversation!.id) {
        return {
          ...c,
          title: c.messages.length === 0 ? content.substring(0, 30) : c.title,
          messages: updatedMessages,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    setLoading(true);

    try {
      // Send the query to the FastAPI Python server
      const apiResponse = await ApiService.sendChatMessage(content, updatedMessages);
      
      const botMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: apiResponse.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: apiResponse.sources
      };

      setConversations(prev => prev.map(c => {
        if (c.id === currentConversation!.id) {
          return {
            ...c,
            messages: [...updatedMessages, botMessage],
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      }));
    } catch (error: any) {
      console.warn('Backend connection failed. Falling back to local offline mock...', error);
      
      // Fallback to local Mock Response so the UI stays fully interactive
      try {
        const mockResponse = await ApiService.generateMockResponse(content);
        const botMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `⚠️ [Local Mock Fallback - Backend Offline]\n\n${mockResponse.response}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: mockResponse.sources
        };

        setConversations(prev => prev.map(c => {
          if (c.id === currentConversation!.id) {
            return {
              ...c,
              messages: [...updatedMessages, botMessage],
              updatedAt: new Date().toISOString()
            };
          }
          return c;
        }));
      } catch (mockError) {
        // Fallback warning message
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Error: Failed to connect to the backend server. Please verify that your FastAPI Python server is running.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        };

        setConversations(prev => prev.map(c => {
          if (c.id === currentConversation!.id) {
            return {
              ...c,
              messages: [...updatedMessages, errorMessage],
              updatedAt: new Date().toISOString()
            };
          }
          return c;
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    conversations,
    activeConversation,
    activeId,
    loading,
    createNewChat,
    selectChat,
    deleteChat,
    sendMessage,
  };
}
