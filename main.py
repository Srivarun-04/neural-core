from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.sqlite_db import db_manager
from backend.services.document_manager import DocumentManager
from backend.services.conversation_service import ConversationService
from backend.services.memory_service import MemoryService
from backend.rag.chain import RAGChain
from backend.api.health import get_health_router
from backend.api.chat import get_chat_router
from backend.api.chats import get_chats_router
from backend.api.documents import get_documents_router
from backend.api.upload import get_upload_router

# Initialize FastAPI App
app = FastAPI(
    title="AI Brain Operating System API",
    version="0.3",
    description="Production-ready AI Brain with SQLite Session Storage, Conversational Memory, RAG, and SSE Streaming."
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize core services
db_manager.init_db()
doc_manager = DocumentManager()
conv_service = ConversationService(db_manager)
memory_service = MemoryService(conv_service)
rag_chain = RAGChain()

# Startup event
@app.on_event("startup")
def startup_event():
    print("\n" + "="*60)
    print("🚀 Initializing AI Brain v0.3 Conversation System...")
    db_manager.init_db()
    doc_manager.initialize_and_sync()
    print("✨ AI Brain Core v0.3 Ready!")
    print("="*60 + "\n")

# Mount API Routers
app.include_router(get_health_router(doc_manager))
app.include_router(get_chats_router(conv_service))
app.include_router(get_chat_router(doc_manager, rag_chain, conv_service, memory_service))
app.include_router(get_documents_router(doc_manager))
app.include_router(get_upload_router(doc_manager))

@app.get("/")
def read_root():
    return {
        "message": "AI Brain v0.3 API is running.",
        "status": "healthy",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
