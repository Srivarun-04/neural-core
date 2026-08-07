from fastapi import APIRouter
from backend.services.document_manager import DocumentManager

router = APIRouter(tags=["Health"])

def get_health_router(doc_manager: DocumentManager):
    @router.get("/health")
    def health_check():
        if doc_manager.vector_store_manager.vector_store is None:
            return {"status": "degraded", "detail": "Vector store not initialized"}
        return {"status": "healthy"}
    
    return router
