import sys
import os
from pathlib import Path

# Ensure project root is in sys.path for seamless imports across local & cloud environments
ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database.sqlite_db import db_manager
from backend.services.document_manager import DocumentManager
from backend.services.conversation_service import ConversationService
from backend.config.settings import CORS_ORIGINS
from backend.services.memory_service import MemoryService
from backend.agents.neural_agent import NeuralAgent
from backend.api.health import get_health_router
from backend.api.chat import get_chat_router
from backend.api.chats import get_chats_router
from backend.api.documents import get_documents_router
from backend.api.upload import get_upload_router

# Initialize FastAPI App
app = FastAPI(
    title="Neural Core Engine API",
    version="0.4",
    description="Production-ready Neural Core Engine with AI Agent Tool Calling (RAG & Safe Calculator), SQLite Session Storage, Conversational Memory, and SSE Streaming."
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize core services & agent
db_manager.init_db()
doc_manager = DocumentManager()
conv_service = ConversationService(db_manager)
memory_service = MemoryService(conv_service)
agent = NeuralAgent(doc_manager=doc_manager)

# Startup event
@app.on_event("startup")
def startup_event():
    print("\n" + "="*60)
    print("🚀 Initializing Neural Core Engine v0.4 (Agent & Tool Calling)...")
    db_manager.init_db()
    doc_manager.initialize_and_sync()
    print("✨ Neural Core Agent Ready with Tools:")
    for tool_meta in agent.registry.get_tool_metadata():
        print(f"   • [{tool_meta['name']}] - {tool_meta['description']}")
    print("="*60 + "\n")

# Mount API Routers
app.include_router(get_health_router(doc_manager, agent))
app.include_router(get_chats_router(conv_service))
app.include_router(get_chat_router(agent, conv_service, memory_service))
app.include_router(get_documents_router(doc_manager))
app.include_router(get_upload_router(doc_manager))

@app.get("/")
def read_root():
    return {
        "message": "Neural Core v0.4 API is running.",
        "status": "healthy",
        "version": "0.4",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host=host, port=port, reload=False)
