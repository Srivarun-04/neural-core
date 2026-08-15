import unittest
from backend.agents.neural_agent import NeuralAgent
from backend.services.document_manager import DocumentManager
from fastapi.testclient import TestClient
from main import app

class TestNeuralAgent(unittest.TestCase):
    def setUp(self):
        self.doc_manager = DocumentManager()
        self.agent = NeuralAgent(doc_manager=self.doc_manager)
        self.client = TestClient(app)

    def test_agent_tool_registry(self):
        tools = self.agent.registry.get_all_tools()
        self.assertGreaterEqual(len(tools), 2)
        tool_names = [t["name"] for t in self.agent.registry.get_tool_metadata()]
        self.assertIn("calculator_tool", tool_names)
        self.assertIn("knowledge_base_search", tool_names)
        self.assertIn("web_search", tool_names)

    def test_health_with_tools_reported(self):
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["version"], "0.4")
        self.assertIn("calculator_tool", data["tools"])
        self.assertIn("knowledge_base_search", data["tools"])

if __name__ == "__main__":
    unittest.main()
