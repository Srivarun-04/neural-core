from pydantic import BaseModel
from typing import List, Optional

class SourceSchema(BaseModel):
    title: str
    snippet: str
    url: Optional[str] = None

class MessageSchema(BaseModel):
    id: str
    chat_id: str
    role: str
    content: str
    timestamp: str
    sources: Optional[List[SourceSchema]] = []
    tools_used: Optional[List[str]] = []
    model: Optional[str] = None
    latency: Optional[float] = None

class ChatSessionSchema(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: str
    messages: Optional[List[MessageSchema]] = []

class CreateChatRequest(BaseModel):
    title: Optional[str] = "New Conversation"

class RenameChatRequest(BaseModel):
    title: str

class ChatRequest(BaseModel):
    message: str
    chat_id: Optional[str] = None

class ChatResponse(BaseModel):
    chat_id: str
    response: str
    sources: List[SourceSchema] = []
    tools_used: List[str] = []

class DocumentInfo(BaseModel):
    filename: str
    document_type: str
    chunk_count: int
    file_size_bytes: int
    indexed_at: str

class SystemStatsResponse(BaseModel):
    document_count: int
    total_chunks: int
    embedding_model: str
    vector_store_status: str
    status: str

class UploadResponse(BaseModel):
    message: str
    filename: str
    chunks_added: int
    total_chunks: int
