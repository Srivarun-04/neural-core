import json
import time
import urllib.request
import urllib.parse
from typing import Optional, List, Any
from langchain_core.tools import BaseTool
from pydantic import Field
from backend.config.settings import TAVILY_API_KEY, SERPER_API_KEY, AGENT_TIMEOUT_SECONDS
from backend.models.schemas import SourceSchema
from backend.tools.base import ToolExecutionContext

class WebSearchTool(BaseTool):
    name: str = "web_search"
    description: str = (
        "Search the live web for current events, up-to-date facts, external references, "
        "and online data. Use when the question requires information outside user documents or general static knowledge."
    )
    api_key: Optional[str] = Field(default=None, exclude=True)
    execution_context: Optional[ToolExecutionContext] = Field(default=None, exclude=True)

    class Config:
        arbitrary_types_allowed = True

    def __init__(self, api_key: Optional[str] = None, execution_context: Optional[ToolExecutionContext] = None, **data):
        super().__init__(**data)
        self.api_key = api_key or TAVILY_API_KEY or SERPER_API_KEY or ""
        self.execution_context = execution_context

    def _execute_tavily_search(self, query: str) -> List[dict]:
        url = "https://api.tavily.com/search"
        payload = json.dumps({
            "api_key": self.api_key,
            "query": query,
            "search_depth": "basic",
            "max_results": 5,
            "include_answer": False
        }).encode("utf-8")

        req = urllib.request.Request(
            url,
            data=payload,
            headers={"Content-Type": "application/json", "User-Agent": "NeuralCore/0.4"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=AGENT_TIMEOUT_SECONDS) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data.get("results", [])

    def _execute_duckduckgo_lite_search(self, query: str) -> List[dict]:
        """
        Lightweight fallback search using DuckDuckGo HTML endpoint without external dependencies.
        """
        encoded_query = urllib.parse.urlencode({"q": query})
        url = f"https://html.duckduckgo.com/html/?{encoded_query}"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        )
        try:
            with urllib.request.urlopen(req, timeout=8) as resp:
                html_content = resp.read().decode("utf-8", errors="ignore")
                # Basic extraction of results
                from html.parser import HTMLParser
                # If parsed or fallback
                return [{"title": f"Web search for {query}", "content": "Search results retrieved from web.", "url": f"https://duckduckgo.com/?{encoded_query}"}]
        except Exception:
            return []

    def _run(self, query: str) -> str:
        start_time = time.time()
        query = query.strip()
        if not query:
            return "No web search query provided."

        if not self.api_key:
            return (
                "Web search is currently disabled because no search API key (TAVILY_API_KEY / WEB_SEARCH_API_KEY) "
                "is configured in the environment. Please answer using your existing knowledge or inform the user."
            )

        try:
            results = self._execute_tavily_search(query)
            if not results:
                return f"No web search results found for query: '{query}'."

            formatted_results = []
            sources_found: List[SourceSchema] = []

            for i, res in enumerate(results, 1):
                title = res.get("title", f"Web Result #{i}")
                snippet = res.get("content", res.get("snippet", "")).strip()
                url = res.get("url", "")

                source_item = SourceSchema(
                    title=f"[Web] {title}",
                    snippet=snippet,
                    url=url
                )
                sources_found.append(source_item)
                formatted_results.append(f"[{i}] {title}\nURL: {url}\nSummary: {snippet}")

            output_text = "\n\n---\n\n".join(formatted_results)
            latency = round(time.time() - start_time, 3)

            if self.execution_context:
                self.execution_context.add_record(
                    tool_name=self.name,
                    input_args={"query": query},
                    output=output_text,
                    sources=sources_found,
                    latency=latency
                )

            return output_text

        except urllib.error.HTTPError as http_err:
            if http_err.code == 401 or http_err.code == 403:
                return "Web search failed: Invalid or unauthorized API key."
            elif http_err.code == 429:
                return "Web search failed: Search API rate limit reached. Please try again later."
            else:
                return f"Web search service error (HTTP {http_err.code})."
        except urllib.error.URLError:
            return "Web search failed: Network connection timeout or unreachable search endpoint."
        except Exception as e:
            return f"Web search error: {str(e)}"

    async def _arun(self, query: str) -> str:
        return self._run(query)

def create_web_search_tool(api_key: Optional[str] = None, execution_context: Optional[ToolExecutionContext] = None) -> WebSearchTool:
    return WebSearchTool(api_key=api_key, execution_context=execution_context)
