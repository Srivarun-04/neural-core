from typing import List, Dict, Any, Optional
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from backend.services.conversation_service import ConversationService
from backend.config.settings import MEMORY_MAX_MESSAGES

class MemoryService:
    """
    Service for managing conversation context, sliding window history,
    and message formatting for RAG LLM prompts.
    """

    def __init__(self, conv_service: ConversationService, max_messages: int = MEMORY_MAX_MESSAGES):
        self.conv_service = conv_service
        self.max_messages = max_messages

    def get_sliding_history(self, chat_id: str) -> List[Dict[str, Any]]:
        """
        Retrieves the last N messages for a chat session.
        """
        messages = self.conv_service.get_messages(chat_id, limit=self.max_messages)
        return [
            {
                "role": m.role,
                "content": m.content
            }
            for m in messages
        ]

    def get_formatted_history_text(self, chat_id: str) -> str:
        """
        Formats recent conversation turns as plain text for prompt templates.
        """
        history = self.get_sliding_history(chat_id)
        if not history:
            return "No previous conversation history."

        formatted_turns = []
        for msg in history:
            role_label = "User" if msg["role"] == "user" else "Assistant"
            formatted_turns.append(f"{role_label}: {msg['content']}")

        return "\n".join(formatted_turns)

    def get_langchain_messages(self, chat_id: str) -> List[BaseMessage]:
        """
        Converts past history to LangChain BaseMessage objects.
        """
        history = self.get_sliding_history(chat_id)
        lc_messages = []
        for msg in history:
            if msg["role"] == "user":
                lc_messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                lc_messages.append(AIMessage(content=msg["content"]))
        return lc_messages
