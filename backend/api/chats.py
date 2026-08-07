from fastapi import APIRouter, HTTPException, status
from typing import List
from backend.models.schemas import (
    ChatSessionSchema,
    CreateChatRequest,
    RenameChatRequest,
    MessageSchema
)
from backend.services.conversation_service import ConversationService

router = APIRouter(prefix="/chats", tags=["Conversations"])

def get_chats_router(conv_service: ConversationService):

    @router.get("", response_model=List[ChatSessionSchema])
    async def list_chats():
        return conv_service.list_chats()

    @router.post("", response_model=ChatSessionSchema, status_code=status.HTTP_201_CREATED)
    async def create_chat(request: CreateChatRequest):
        return conv_service.create_chat(title=request.title)

    @router.get("/{chat_id}", response_model=ChatSessionSchema)
    async def get_chat(chat_id: str):
        chat = conv_service.get_chat(chat_id, include_messages=True)
        if not chat:
            raise HTTPException(status_code=404, detail=f"Chat session '{chat_id}' not found.")
        return chat

    @router.patch("/{chat_id}", response_model=ChatSessionSchema)
    async def rename_chat(chat_id: str, request: RenameChatRequest):
        if not request.title.strip():
            raise HTTPException(status_code=400, detail="Title cannot be empty.")
        chat = conv_service.rename_chat(chat_id, request.title)
        if not chat:
            raise HTTPException(status_code=404, detail=f"Chat session '{chat_id}' not found.")
        return chat

    @router.delete("/{chat_id}", status_code=status.HTTP_200_OK)
    async def delete_chat(chat_id: str):
        deleted = conv_service.delete_chat(chat_id)
        if not deleted:
            raise HTTPException(status_code=404, detail=f"Chat session '{chat_id}' not found.")
        return {"message": "Chat session deleted successfully.", "chat_id": chat_id}

    @router.get("/{chat_id}/messages", response_model=List[MessageSchema])
    async def get_chat_messages(chat_id: str):
        chat = conv_service.get_chat(chat_id, include_messages=False)
        if not chat:
            raise HTTPException(status_code=404, detail=f"Chat session '{chat_id}' not found.")
        return conv_service.get_messages(chat_id)

    return router
