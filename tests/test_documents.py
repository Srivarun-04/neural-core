import unittest
import io
from fastapi.testclient import TestClient
from main import app

class TestDocumentsEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_documents_list_endpoint(self):
        response = self.client.get("/documents")
        self.assertEqual(response.status_code, 200)
        docs = response.json()
        self.assertIsInstance(docs, list)

    def test_stats_endpoint(self):
        response = self.client.get("/stats")
        self.assertEqual(response.status_code, 200)
        stats = response.json()
        self.assertIn("document_count", stats)
        self.assertIn("total_chunks", stats)
        self.assertIn("embedding_model", stats)
        self.assertIn("status", stats)

    def test_document_lifecycle_upload_and_delete(self):
        # 1. Upload a test document
        test_filename = "test_lifecycle_doc.txt"
        file_content = b"NuraVault document lifecycle test: Deletion removes all chunks completely."
        file_obj = io.BytesIO(file_content)

        upload_res = self.client.post(
            "/upload",
            files={"file": (test_filename, file_obj, "text/plain")}
        )
        self.assertEqual(upload_res.status_code, 200)

        # 2. Verify it is present in /documents
        docs_res = self.client.get("/documents")
        filenames = [d["filename"] for d in docs_res.json()]
        self.assertIn(test_filename, filenames)

        # 3. Delete the document
        del_res = self.client.delete(f"/documents/{test_filename}")
        self.assertEqual(del_res.status_code, 200)

        # 4. Verify it is no longer in /documents
        docs_after_del = self.client.get("/documents")
        filenames_after = [d["filename"] for d in docs_after_del.json()]
        self.assertNotIn(test_filename, filenames_after)

        # 5. Subsequent delete returns 404
        del_again = self.client.delete(f"/documents/{test_filename}")
        self.assertEqual(del_again.status_code, 404)

if __name__ == "__main__":
    unittest.main()
