import unittest
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

if __name__ == "__main__":
    unittest.main()
