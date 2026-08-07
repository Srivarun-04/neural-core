import os
import json
import hashlib
from datetime import datetime
from typing import Dict, Any, List
from backend.config.settings import DATA_DIR, MANIFEST_PATH, EMBEDDING_MODEL_NAME
from backend.database.vector_store import VectorStoreManager
from backend.rag.embeddings import get_embeddings_model
from backend.rag.loaders import DocumentLoaderFactory
from backend.rag.splitter import DocumentSplitter

class DocumentManager:
    """
    Manages the indexing lifecycle of documents in data/, tracking manifest metadata,
    and triggering FAISS persistent updates.
    """
    def __init__(self):
        self.embeddings = get_embeddings_model()
        self.vector_store_manager = VectorStoreManager(self.embeddings)
        self.splitter = DocumentSplitter()
        self.manifest: Dict[str, Any] = self._load_manifest()

    def _load_manifest(self) -> Dict[str, Any]:
        """Loads index manifest from disk if it exists."""
        if os.path.exists(MANIFEST_PATH):
            try:
                with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"[DOCUMENT MANAGER] Error loading manifest: {e}")
        return {"documents": {}, "total_chunks": 0, "embedding_model": EMBEDDING_MODEL_NAME}

    def _save_manifest(self):
        """Saves index manifest to disk."""
        os.makedirs(os.path.dirname(MANIFEST_PATH), exist_ok=True)
        with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
            json.dump(self.manifest, f, indent=2)

    def _compute_hash(self, file_path: str) -> str:
        """Computes SHA256 hash of a file."""
        hasher = hashlib.sha256()
        with open(file_path, 'rb') as f:
            while chunk := f.read(8192):
                hasher.update(chunk)
        return hasher.hexdigest()

    def initialize_and_sync(self):
        """
        On startup:
        1. Loads existing vector index from disk if present.
        2. Scans data/ directory.
        3. Indexes any un-indexed or updated documents.
        """
        # Step 1: Attempt to load FAISS index from disk
        self.vector_store_manager.load_index()

        # Step 2: Ensure default document exists in data/ if empty
        self._ensure_default_data()

        # Step 3: Scan data/ folder and identify files needing indexing
        unindexed_files = []
        if os.path.exists(DATA_DIR):
            for fname in os.listdir(DATA_DIR):
                fpath = os.path.join(DATA_DIR, fname)
                if os.path.isfile(fpath) and DocumentLoaderFactory.is_supported(fpath):
                    fhash = self._compute_hash(fpath)
                    doc_meta = self.manifest["documents"].get(fname)
                    if not doc_meta or doc_meta.get("hash") != fhash:
                        unindexed_files.append((fname, fpath, fhash))

        if not unindexed_files:
            print("[DOCUMENT MANAGER] All documents in data/ are up to date! Index is synchronized.")
            return

        print(f"[DOCUMENT MANAGER] Found {len(unindexed_files)} new/updated document(s) to index...")
        for fname, fpath, fhash in unindexed_files:
            self.index_single_file(fname, fpath, fhash)

    def _ensure_default_data(self):
        """Move or copy notes.txt to data/notes.txt if data/ is empty."""
        notes_src = os.path.join(os.path.dirname(DATA_DIR), "notes.txt")
        notes_dst = os.path.join(DATA_DIR, "notes.txt")
        if not os.path.exists(notes_dst) and os.path.exists(notes_src):
            import shutil
            shutil.copy(notes_src, notes_dst)
            print("[DOCUMENT MANAGER] Copied initial notes.txt into data/ directory.")

    def index_single_file(self, filename: str, file_path: str, file_hash: str) -> int:
        """
        Loads, splits, enriches metadata, embeds, and updates FAISS index for a single file.
        """
        print(f"[DOCUMENT MANAGER] Indexing file: {filename}...")
        raw_docs = DocumentLoaderFactory.load_document(file_path)
        chunks = self.splitter.split_and_enrich(raw_docs, filename)
        
        if not chunks:
            print(f"[DOCUMENT MANAGER] No text chunks extracted from {filename}.")
            return 0

        # Add chunks to persistent vector store
        self.vector_store_manager.add_documents(chunks)

        # Update manifest record
        file_size = os.path.getsize(file_path)
        ext = os.path.splitext(filename)[1].lower().replace('.', '')
        
        self.manifest["documents"][filename] = {
            "filename": filename,
            "document_type": ext,
            "hash": file_hash,
            "chunk_count": len(chunks),
            "file_size_bytes": file_size,
            "indexed_at": datetime.now().isoformat()
        }

        # Recalculate total chunk count
        self.manifest["total_chunks"] = sum(
            doc["chunk_count"] for doc in self.manifest["documents"].values()
        )
        self.manifest["embedding_model"] = EMBEDDING_MODEL_NAME
        self._save_manifest()

        print(f"[DOCUMENT MANAGER] Successfully indexed {filename} ({len(chunks)} chunks).")
        return len(chunks)

    def get_documents_list(self) -> List[Dict[str, Any]]:
        """Returns list of indexed document information."""
        return list(self.manifest.get("documents", {}).values())

    def get_system_stats(self) -> Dict[str, Any]:
        """Returns system metrics for Knowledge Base display."""
        docs = self.get_documents_list()
        vector_status = "Persisted (FAISS)" if self.vector_store_manager.index_exists() else "Not Ready"
        return {
            "document_count": len(docs),
            "total_chunks": self.manifest.get("total_chunks", 0),
            "embedding_model": EMBEDDING_MODEL_NAME,
            "vector_store_status": vector_status,
            "status": "healthy"
        }
