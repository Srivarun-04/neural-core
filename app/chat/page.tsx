import type { Metadata } from "next";
import { ChatLayout } from "@/components/chat/ChatLayout";

export const metadata: Metadata = {
  title: "Chat — Neural Core",
  description:
    "Converse with your AI layer in real-time with full memory and context persistence.",
};

export default function ChatPage() {
  return <ChatLayout />;
}
