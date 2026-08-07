import os
from typing import List
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from backend.config.settings import CHUNK_SIZE, CHUNK_OVERLAP

class DocumentSplitter:
    """
    Splits documents into chunks and enriches each chunk with metadata.
    """
    def __init__(self, chunk_size: int = CHUNK_SIZE, chunk_overlap: int = CHUNK_OVERLAP):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

    def split_and_enrich(self, documents: List[Document], filename: str) -> List[Document]:
        """
        Splits documents and injects metadata into each chunk:
        - filename
        - document_type
        - source
        - chunk_number
        - total_chunks
        """
        chunks = self.splitter.split_documents(documents)
        total_chunks = len(chunks)
        ext = os.path.splitext(filename)[1].lower().replace('.', '')

        for idx, chunk in enumerate(chunks):
            chunk.metadata["filename"] = filename
            chunk.metadata["document_type"] = ext
            chunk.metadata["source"] = filename
            chunk.metadata["chunk_number"] = idx + 1
            chunk.metadata["total_chunks"] = total_chunks

        return chunks
