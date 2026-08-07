from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    message: str

class SourceSchema(BaseModel):
    title: str
    snippet: str
    url: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[SourceSchema]

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
