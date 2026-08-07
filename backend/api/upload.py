import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.config.settings import DATA_DIR
from backend.models.schemas import UploadResponse
from backend.services.document_manager import DocumentManager
from backend.rag.loaders import DocumentLoaderFactory

router = APIRouter(tags=["Upload"])

def get_upload_router(doc_manager: DocumentManager):
    @router.post("/upload", response_model=UploadResponse)
    async def upload_document(file: UploadFile = File(...)):
        filename = file.filename
        if not filename or not DocumentLoaderFactory.is_supported(filename):
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type for '{filename}'. Allowed extensions: .txt, .md, .pdf, .docx"
            )

        destination_path = os.path.join(DATA_DIR, filename)

        try:
            # 1. Save uploaded file to data/ directory
            with open(destination_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # 2. Compute file hash
            file_hash = doc_manager._compute_hash(destination_path)

            # 3. Index new file and update FAISS index dynamically
            chunks_added = doc_manager.index_single_file(filename, destination_path, file_hash)

            total_chunks = doc_manager.manifest.get("total_chunks", 0)

            return UploadResponse(
                message=f"Document '{filename}' successfully uploaded and indexed!",
                filename=filename,
                chunks_added=chunks_added,
                total_chunks=total_chunks
            )

        except Exception as e:
            print(f"[UPLOAD ERROR] Error uploading/indexing file {filename}: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    return router
