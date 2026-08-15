from fastapi import APIRouter, HTTPException, status
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

    @router.delete("/documents/{filename}")
    def delete_document(filename: str):
        """
        Permanently deletes a document from data/, removes manifest record,
        and synchronizes/rebuilds the FAISS vector index.
        """
        success = doc_manager.delete_document(filename)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Document '{filename}' not found in Knowledge Base."
            )
        return {
            "message": f"Document '{filename}' successfully deleted and purged from index.",
            "filename": filename
        }

    return router
