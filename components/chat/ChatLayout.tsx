"use client";

import React, { useState } from "react";
import type { Conversation, Message } from "./types";
import { MOCK_CONVERSATIONS } from "./mockData";
import { ConversationSidebar } from "./ConversationSidebar";
import { ChatWindow } from "./ChatWindow";

export function ChatLayout() {
  const [conversations, setConversations] =
    useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(
    MOCK_CONVERSATIONS[0]?.id ?? null
  );

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  /* Start a new empty conversation */
  const handleNewChat = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: "New conversation",
      lastMessage: "",
      timestamp: "Just now",
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
  };

  /* Add user message then a placeholder assistant reply */
  const handleSendMessage = (content: string) => {
    if (!activeId) return;

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content,
      timestamp: now,
    };

    // Simulated assistant response (static — no backend)
    const assistantMessage: Message = {
      id: `msg-${Date.now()}-assistant`,
      role: "assistant",
      content:
        "I've received your message and I'm processing it through the Neural Core intelligence layer. This is a UI-only demonstration — connect the API gateway to enable live responses from the model router.",
      timestamp: now,
    };

    // Optimistically append the user message
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== activeId) return conv;
        return {
          ...conv,
          messages: [...conv.messages, userMessage],
          lastMessage: content.slice(0, 80),
          timestamp: "Just now",
          // Auto-title from first user message if the conversation is new
          title:
            conv.title === "New conversation" && conv.messages.length === 0
              ? content.slice(0, 48) + (content.length > 48 ? "..." : "")
              : conv.title,
        };
      })
    );

    // Append assistant reply after typing indicator delay (1800ms in ChatWindow)
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== activeId) return conv;
          return {
            ...conv,
            messages: [...conv.messages, assistantMessage],
            lastMessage: assistantMessage.content.slice(0, 80),
          };
        })
      );
    }, 1900);
  };

  return (
    <div
      id="chat-layout"
      className="flex"
      style={{ height: "calc(100vh - var(--navbar-height))" }}
    >
      {/* Left panel — conversation sidebar */}
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNewChat={handleNewChat}
      />

      {/* Center panel — chat window */}
      <ChatWindow
        conversation={activeConversation}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
