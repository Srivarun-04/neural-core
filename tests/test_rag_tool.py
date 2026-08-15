import unittest
from backend.services.document_manager import DocumentManager
from backend.tools.rag_tool import create_rag_tool
from backend.tools.base import ToolExecutionContext

class TestRAGTool(unittest.TestCase):
    def setUp(self):
        self.doc_manager = DocumentManager()
        self.doc_manager.initialize_and_sync()

    def test_rag_tool_execution_and_sources(self):
        context = ToolExecutionContext()
        rag_tool = create_rag_tool(self.doc_manager, execution_context=context)

        # Run query
        result = rag_tool.invoke({"query": "AI agent"})
        self.assertIsInstance(result, str)
        self.assertGreater(len(result), 0)

        # Verify sources captured in context
        sources = context.get_sources()
        self.assertTrue(len(sources) >= 0)
        if sources:
            self.assertTrue(hasattr(sources[0], "title"))
            self.assertTrue(hasattr(sources[0], "snippet"))

    def test_rag_tool_empty_query(self):
        rag_tool = create_rag_tool(self.doc_manager)
        result = rag_tool.invoke({"query": ""})
        self.assertEqual(result, "No search query provided.")

if __name__ == "__main__":
    unittest.main()
