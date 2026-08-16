import os
import unittest
from fastapi.testclient import TestClient
from backend.config.settings import SYSTEM_KNOWLEDGE_PATH
from backend.services.document_manager import DocumentManager, SYSTEM_DOC_NAME
from main import app

class TestSystemKnowledge(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.doc_manager = DocumentManager()
        cls.doc_manager.initialize_and_sync()

    def test_system_knowledge_file_exists(self):
        """Verify that canonical system knowledge file exists on disk and is non-empty."""
        self.assertTrue(
            os.path.exists(SYSTEM_KNOWLEDGE_PATH),
            f"System knowledge file must exist at {SYSTEM_KNOWLEDGE_PATH}"
        )
        self.assertGreater(
            os.path.getsize(SYSTEM_KNOWLEDGE_PATH),
            100,
            "System knowledge file must contain documentation"
        )

    def test_system_knowledge_chunk_metadata(self):
        """Verify that system chunks are enriched with system metadata."""
        chunks = self.doc_manager._get_system_knowledge_chunks()
        self.assertGreater(len(chunks), 0)
        for chunk in chunks:
            self.assertEqual(chunk.metadata.get("filename"), SYSTEM_DOC_NAME)
            self.assertTrue(chunk.metadata.get("is_system"))
            self.assertEqual(chunk.metadata.get("source_type"), "system")
            self.assertEqual(chunk.metadata.get("document_type"), "system_knowledge")

    def test_system_knowledge_idempotency(self):
        """Verify system knowledge is indexed without creating duplicate chunks."""
        # Ensure indexed
        self.doc_manager._ensure_system_knowledge()
        initial_chunks = self.doc_manager.manifest.get("system_knowledge", {}).get("chunk_count", 0)
        self.assertGreater(initial_chunks, 0)

        # Call again - should return False (already up-to-date) and keep chunk count identical
        reindexed = self.doc_manager._ensure_system_knowledge()
        self.assertFalse(reindexed)
        self.assertEqual(
            self.doc_manager.manifest.get("system_knowledge", {}).get("chunk_count"),
            initial_chunks
        )

    def test_system_knowledge_delete_protection_service(self):
        """Verify that DocumentManager rejects deleting system knowledge."""
        self.doc_manager._ensure_system_knowledge()
        result = self.doc_manager.delete_document(SYSTEM_DOC_NAME)
        self.assertFalse(result, "Service must reject deleting system knowledge")
        self.assertIsNotNone(self.doc_manager.manifest.get("system_knowledge"))

    def test_system_knowledge_delete_protection_api(self):
        """Verify that DELETE /documents/{SYSTEM_DOC_NAME} returns HTTP 403 Forbidden."""
        response = self.client.delete(f"/documents/{SYSTEM_DOC_NAME}")
        self.assertEqual(response.status_code, 403)
        self.assertIn("protected canonical system knowledge", response.json()["detail"])

    def test_system_knowledge_in_documents_list(self):
        """Verify GET /documents includes system knowledge tagged as is_system=True."""
        response = self.client.get("/documents")
        self.assertEqual(response.status_code, 200)
        docs = response.json()
        system_doc = next((d for d in docs if d["filename"] == SYSTEM_DOC_NAME), None)
        self.assertIsNotNone(system_doc, "System knowledge must be returned in document list")
        self.assertTrue(system_doc.get("is_system"))

    def test_system_knowledge_retrieval(self):
        """Verify vector retriever retrieves system knowledge for architecture queries."""
        self.doc_manager._ensure_system_knowledge()
        retriever = self.doc_manager.vector_store_manager.get_retriever(k=3)
        docs = retriever.invoke("What embedding model does NuraVault use?")
        self.assertGreater(len(docs), 0)
        found_sys = any(d.metadata.get("filename") == SYSTEM_DOC_NAME for d in docs)
        self.assertTrue(found_sys, "Retriever must find relevant chunks from system knowledge")

if __name__ == "__main__":
    unittest.main()
