from fastapi import APIRouter
from typing import Optional
from backend.services.document_manager import DocumentManager
from backend.agents.neural_agent import NeuralAgent

router = APIRouter(tags=["Health"])

def get_health_router(doc_manager: DocumentManager, agent: Optional[NeuralAgent] = None):
    @router.get("/health")
    def health_check():
        tools_available = []
        if agent and hasattr(agent, "registry"):
            tools_available = [t["name"] for t in agent.registry.get_tool_metadata()]

        vector_status = "initialized" if doc_manager.vector_store_manager.vector_store is not None else "empty_or_loading"
        
        return {
            "status": "healthy",
            "version": "0.4",
            "vector_store": vector_status,
            "tools": tools_available
        }
    
    return router
