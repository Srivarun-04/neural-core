from fastapi import APIRouter
from typing import List
from backend.models.schemas import DocumentInfo, SystemStatsResponse
from backend.services.document_manager import DocumentManager

router = APIRouter(tags=["Documents & Stats"])

def get_documents_router(doc_manager: DocumentManager):
    @router.get("/documents", response_model=List[DocumentInfo])
    def list_documents():
        """Returns indexed documents metadata."""
        docs = doc_manager.get_documents_list()
        return docs

    @router.get("/stats", response_model=SystemStatsResponse)
    def system_stats():
        """Returns Knowledge Base system statistics."""
        return doc_manager.get_system_stats()

    return router
