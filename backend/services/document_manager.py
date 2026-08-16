import os
import json
import hashlib
from datetime import datetime
from typing import Dict, Any, List, Optional
from backend.config.settings import (
    DATA_DIR,
    MANIFEST_PATH,
    EMBEDDING_MODEL_NAME,
    SYSTEM_KNOWLEDGE_PATH
)
from backend.database.vector_store import VectorStoreManager
from backend.rag.embeddings import get_embeddings_model
from backend.rag.loaders import DocumentLoaderFactory
from backend.rag.splitter import DocumentSplitter

SYSTEM_DOC_NAME = "NuraVault System Knowledge"

class DocumentManager:
    """
    Manages the indexing lifecycle of documents in data/ and canonical system knowledge,
    tracking manifest metadata, and triggering FAISS persistent updates and complete document deletions.
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
                    data = json.load(f)
                    if "documents" not in data:
                        data["documents"] = {}
                    return data
            except Exception as e:
                print(f"[DOCUMENT MANAGER] Error loading manifest: {e}")
        return {"documents": {}, "system_knowledge": None, "total_chunks": 0, "embedding_model": EMBEDDING_MODEL_NAME}

    def _save_manifest(self):
        """Saves index manifest to disk."""
        os.makedirs(os.path.dirname(MANIFEST_PATH), exist_ok=True)
        # Recalculate total chunks
        user_chunks = sum(doc["chunk_count"] for doc in self.manifest.get("documents", {}).values())
        sys_chunks = self.manifest.get("system_knowledge", {}).get("chunk_count", 0) if self.manifest.get("system_knowledge") else 0
        self.manifest["total_chunks"] = user_chunks + sys_chunks
        self.manifest["embedding_model"] = EMBEDDING_MODEL_NAME

        with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
            json.dump(self.manifest, f, indent=2)

    def _compute_hash(self, file_path: str) -> str:
        """Computes SHA256 hash of a file."""
        hasher = hashlib.sha256()
        with open(file_path, 'rb') as f:
            while chunk := f.read(8192):
                hasher.update(chunk)
        return hasher.hexdigest()

    def is_system_document(self, filename: str) -> bool:
        """Checks if a given filename corresponds to protected system knowledge."""
        if not filename:
            return False
        clean = filename.strip().lower()
        return (
            clean == SYSTEM_DOC_NAME.lower()
            or clean == "system_knowledge.md"
            or clean == "nuravault system knowledge"
        )

    def _get_system_knowledge_chunks(self) -> List[Any]:
        """Loads and splits the canonical system knowledge file."""
        if not os.path.exists(SYSTEM_KNOWLEDGE_PATH):
            print(f"[DOCUMENT MANAGER] System knowledge file not found at {SYSTEM_KNOWLEDGE_PATH}")
            return []

        raw_docs = DocumentLoaderFactory.load_document(SYSTEM_KNOWLEDGE_PATH)
        chunks = self.splitter.split_and_enrich(raw_docs, SYSTEM_DOC_NAME)

        for chunk in chunks:
            chunk.metadata["filename"] = SYSTEM_DOC_NAME
            chunk.metadata["source"] = SYSTEM_DOC_NAME
            chunk.metadata["document_name"] = SYSTEM_DOC_NAME
            chunk.metadata["document_type"] = "system_knowledge"
            chunk.metadata["is_system"] = True
            chunk.metadata["source_type"] = "system"

        return chunks

    def _ensure_system_knowledge(self) -> bool:
        """
        Ensures canonical system knowledge is indexed into FAISS.
        Idempotent: skips re-indexing if hash matches and vector store index exists.
        """
        if not os.path.exists(SYSTEM_KNOWLEDGE_PATH):
            print(f"[DOCUMENT MANAGER] Canonical system knowledge file missing at {SYSTEM_KNOWLEDGE_PATH}")
            return False

        sys_hash = self._compute_hash(SYSTEM_KNOWLEDGE_PATH)
        existing_sys = self.manifest.get("system_knowledge")

        # If already indexed and vector store is active on disk, verify hash
        if (
            existing_sys
            and existing_sys.get("hash") == sys_hash
            and self.vector_store_manager.index_exists()
        ):
            print("[DOCUMENT MANAGER] System knowledge is already indexed and up to date.")
            return False

        print("[DOCUMENT MANAGER] Indexing canonical NuraVault System Knowledge...")
        chunks = self._get_system_knowledge_chunks()
        if not chunks:
            print("[DOCUMENT MANAGER] No chunks generated from system knowledge.")
            return False

        # Add to vector store
        self.vector_store_manager.add_documents(chunks)

        # Update manifest record
        file_size = os.path.getsize(SYSTEM_KNOWLEDGE_PATH)
        self.manifest["system_knowledge"] = {
            "filename": SYSTEM_DOC_NAME,
            "document_type": "markdown",
            "hash": sys_hash,
            "chunk_count": len(chunks),
            "file_size_bytes": file_size,
            "indexed_at": datetime.now().isoformat(),
            "is_system": True,
            "source_type": "system"
        }
        self._save_manifest()
        print(f"[DOCUMENT MANAGER] Successfully indexed System Knowledge ({len(chunks)} chunks).")
        return True

    def initialize_and_sync(self):
        """
        On startup:
        1. Loads existing vector index from disk if present.
        2. Ensures canonical system knowledge is indexed (idempotent).
        3. Scans data/ directory for user documents and indexes any un-indexed/updated ones.
        """
        # Step 1: Attempt to load FAISS index from disk
        self.vector_store_manager.load_index()

        # Step 2: Ensure canonical system knowledge is embedded
        self._ensure_system_knowledge()

        # Step 3: Scan data/ folder and identify user files needing indexing
        unindexed_files = []
        if os.path.exists(DATA_DIR):
            for fname in os.listdir(DATA_DIR):
                fpath = os.path.join(DATA_DIR, fname)
                if os.path.isfile(fpath) and DocumentLoaderFactory.is_supported(fpath):
                    fhash = self._compute_hash(fpath)
                    doc_meta = self.manifest.get("documents", {}).get(fname)
                    if not doc_meta or doc_meta.get("hash") != fhash:
                        unindexed_files.append((fname, fpath, fhash))

        if not unindexed_files:
            print("[DOCUMENT MANAGER] All user documents in data/ are up to date! Index is synchronized.")
            self._save_manifest()
            return

        print(f"[DOCUMENT MANAGER] Found {len(unindexed_files)} new/updated user document(s) to index...")
        for fname, fpath, fhash in unindexed_files:
            self.index_single_file(fname, fpath, fhash)

    def index_single_file(self, filename: str, file_path: str, file_hash: str) -> int:
        """
        Loads, splits, enriches metadata, embeds, and updates FAISS index for a single user file.
        """
        print(f"[DOCUMENT MANAGER] Indexing user file: {filename}...")
        raw_docs = DocumentLoaderFactory.load_document(file_path)
        chunks = self.splitter.split_and_enrich(raw_docs, filename)
        
        if not chunks:
            print(f"[DOCUMENT MANAGER] No text chunks extracted from {filename}.")
            return 0

        # Mark as user document
        for chunk in chunks:
            chunk.metadata["is_system"] = False
            chunk.metadata["source_type"] = "user"

        # Add chunks to persistent vector store
        self.vector_store_manager.add_documents(chunks)

        # Update manifest record
        file_size = os.path.getsize(file_path)
        ext = os.path.splitext(filename)[1].lower().replace('.', '')
        
        if "documents" not in self.manifest:
            self.manifest["documents"] = {}

        self.manifest["documents"][filename] = {
            "filename": filename,
            "document_type": ext,
            "hash": file_hash,
            "chunk_count": len(chunks),
            "file_size_bytes": file_size,
            "indexed_at": datetime.now().isoformat(),
            "is_system": False,
            "source_type": "user"
        }

        self._save_manifest()
        print(f"[DOCUMENT MANAGER] Successfully indexed {filename} ({len(chunks)} chunks).")
        return len(chunks)

    def rebuild_full_index(self):
        """
        Reconstructs the FAISS vector index from canonical system knowledge and all remaining supported user files in data/.
        """
        all_chunks = []

        # 1. Add canonical system knowledge chunks
        sys_chunks = self._get_system_knowledge_chunks()
        if sys_chunks:
            all_chunks.extend(sys_chunks)
            if os.path.exists(SYSTEM_KNOWLEDGE_PATH):
                self.manifest["system_knowledge"] = {
                    "filename": SYSTEM_DOC_NAME,
                    "document_type": "markdown",
                    "hash": self._compute_hash(SYSTEM_KNOWLEDGE_PATH),
                    "chunk_count": len(sys_chunks),
                    "file_size_bytes": os.path.getsize(SYSTEM_KNOWLEDGE_PATH),
                    "indexed_at": datetime.now().isoformat(),
                    "is_system": True,
                    "source_type": "system"
                }

        # 2. Add user document chunks
        if os.path.exists(DATA_DIR):
            for fname in os.listdir(DATA_DIR):
                fpath = os.path.join(DATA_DIR, fname)
                if os.path.isfile(fpath) and DocumentLoaderFactory.is_supported(fpath) and fname in self.manifest.get("documents", {}):
                    raw_docs = DocumentLoaderFactory.load_document(fpath)
                    file_chunks = self.splitter.split_and_enrich(raw_docs, fname)
                    for chunk in file_chunks:
                        chunk.metadata["is_system"] = False
                        chunk.metadata["source_type"] = "user"
                    all_chunks.extend(file_chunks)

        if all_chunks:
            self.vector_store_manager.create_and_save(all_chunks)
        else:
            self.vector_store_manager.clear_index()

        self._save_manifest()

    def delete_document(self, filename: str) -> bool:
        """
        Completely purges a user document:
        1. Protects system knowledge from deletion.
        2. Deletes raw file from data/
        3. Removes manifest record
        4. Rebuilds FAISS index with system knowledge and remaining user documents
        """
        if self.is_system_document(filename):
            print(f"[DOCUMENT MANAGER] Blocked deletion attempt on protected system knowledge '{filename}'.")
            return False

        filename = os.path.basename(filename.strip())
        file_path = os.path.join(DATA_DIR, filename)

        found = False
        # 1. Remove physical file from data/
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"[DOCUMENT MANAGER] Deleted physical file: {file_path}")
                found = True
            except Exception as e:
                print(f"[DOCUMENT MANAGER] Error removing file {file_path}: {e}")

        # 2. Remove entry from manifest
        if filename in self.manifest.get("documents", {}):
            del self.manifest["documents"][filename]
            found = True

        if not found:
            return False

        # 3. Rebuild vector store with system knowledge + remaining user documents
        self.rebuild_full_index()
        print(f"[DOCUMENT MANAGER] Successfully purged document {filename} and synchronized vector index.")
        return True

    def get_documents_list(self) -> List[Dict[str, Any]]:
        """Returns list of indexed document information including System Knowledge and User Documents."""
        docs = []
        if self.manifest.get("system_knowledge"):
            docs.append(self.manifest["system_knowledge"])
        docs.extend(list(self.manifest.get("documents", {}).values()))
        return docs

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
