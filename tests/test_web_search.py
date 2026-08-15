import unittest
from backend.tools.web_search_tool import WebSearchTool, create_web_search_tool
from backend.tools.base import ToolExecutionContext

class TestWebSearchTool(unittest.TestCase):
    def test_missing_api_key_graceful_fallback(self):
        # Explicitly pass empty API key
        search_tool = WebSearchTool(api_key="")
        result = search_tool.invoke({"query": "latest AI news"})
        self.assertIn("Web search is currently disabled", result)

    def test_empty_query_handling(self):
        search_tool = WebSearchTool(api_key="mock_key")
        result = search_tool.invoke({"query": "   "})
        self.assertEqual(result, "No web search query provided.")

    def test_search_context_sources_structure(self):
        context = ToolExecutionContext()
        search_tool = WebSearchTool(api_key="", execution_context=context)
        res = search_tool.invoke({"query": "test query"})
        self.assertIsInstance(res, str)

if __name__ == "__main__":
    unittest.main()
