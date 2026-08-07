from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.services.document_manager import DocumentManager
from backend.rag.chain import RAGChain
from backend.api.health import get_health_router
from backend.api.chat import get_chat_router
from backend.api.documents import get_documents_router
from backend.api.upload import get_upload_router

# Initialize FastAPI App
app = FastAPI(
    title="AI Brain Production RAG API",
    version="0.2",
    description="Production-ready persistent RAG pipeline with multi-format support, document management, and live dynamic indexing."
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
doc_manager = DocumentManager()
rag_chain = RAGChain()

# Startup event to synchronize persistent FAISS index and data/ directory
@app.on_event("startup")
def startup_event():
    print("\n" + "="*60)
    print("🚀 Initializing AI Brain v0.2 Production RAG...")
    doc_manager.initialize_and_sync()
    print("✨ AI Brain Core Ready!")
    print("="*60 + "\n")

# Mount API Routers
app.include_router(get_health_router(doc_manager))
app.include_router(get_chat_router(doc_manager, rag_chain))
app.include_router(get_documents_router(doc_manager))
app.include_router(get_upload_router(doc_manager))

@app.get("/")
def read_root():
    return {
        "message": "AI Brain v0.2 Production RAG API is running.",
        "status": "healthy",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
