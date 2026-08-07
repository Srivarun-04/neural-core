import os
from typing import Optional, List
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from backend.config.settings import VECTORSTORE_DIR, RETRIEVAL_K

class VectorStoreManager:
    """
    Manages FAISS persistence to and from disk.
    """
    def __init__(self, embeddings_model):
        self.embeddings = embeddings_model
        self.vector_store: Optional[FAISS] = None
        self.index_path = VECTORSTORE_DIR

    def index_exists(self) -> bool:
        """Check if FAISS index files exist on disk."""
        faiss_file = os.path.join(self.index_path, "index.faiss")
        pkl_file = os.path.join(self.index_path, "index.pkl")
        return os.path.exists(faiss_file) and os.path.exists(pkl_file)

    def load_index(self) -> Optional[FAISS]:
        """Loads FAISS index from disk if it exists."""
        if self.index_exists():
            print(f"[FAISS] Loading existing index from disk ({self.index_path})...")
            self.vector_store = FAISS.load_local(
                folder_path=self.index_path,
                embeddings=self.embeddings,
                allow_dangerous_deserialization=True
            )
            print("[FAISS] Vector store successfully loaded from disk!")
            return self.vector_store
        return None

    def create_and_save(self, documents: List[Document]) -> FAISS:
        """Creates a new FAISS vector store from documents and saves to disk."""
        print(f"[FAISS] Creating new index from {len(documents)} document chunks...")
        self.vector_store = FAISS.from_documents(documents, self.embeddings)
        self.save_index()
        return self.vector_store

    def save_index(self):
        """Persists current FAISS vector store to disk."""
        if self.vector_store:
            self.vector_store.save_local(self.index_path)
            print(f"[FAISS] Index saved to disk at {self.index_path}")

    def add_documents(self, documents: List[Document]):
        """Adds new documents to existing index and saves to disk."""
        if self.vector_store is None:
            self.create_and_save(documents)
        else:
            self.vector_store.add_documents(documents)
            self.save_index()

    def get_retriever(self, k: int = RETRIEVAL_K):
        """Returns retriever interface from active vector store."""
        if self.vector_store is None:
            raise ValueError("Vector store is not initialized.")
        return self.vector_store.as_retriever(search_kwargs={"k": k})
