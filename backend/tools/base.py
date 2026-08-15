from typing import List, Dict, Any, Optional, Callable
from pydantic import BaseModel, Field
from backend.models.schemas import SourceSchema
import time

class ToolExecutionRecord(BaseModel):
    tool_name: str
    input_args: Dict[str, Any]
    output: str
    sources: List[SourceSchema] = []
    latency: float = 0.0

class ToolExecutionContext:
    """
    Context manager to track tool calls, gathered sources, and execution details
    during a single agent run.
    """
    def __init__(self):
        self.records: List[ToolExecutionRecord] = []
        self.sources: List[SourceSchema] = []

    def add_record(self, tool_name: str, input_args: Dict[str, Any], output: str, sources: Optional[List[SourceSchema]] = None, latency: float = 0.0):
        sources = sources or []
        record = ToolExecutionRecord(
            tool_name=tool_name,
            input_args=input_args,
            output=output,
            sources=sources,
            latency=latency
        )
        self.records.append(record)
        for s in sources:
            # Deduplicate sources based on title + snippet preview
            if not any(existing.title == s.title and existing.snippet[:50] == s.snippet[:50] for existing in self.sources):
                self.sources.append(s)

    def get_sources(self) -> List[SourceSchema]:
        return self.sources

    def clear(self):
        self.records.clear()
        self.sources.clear()

class ToolRegistry:
    """
    Central registry for Neural Core tools. Enables dynamic registration,
    inspection, and conversion to LangChain tools.
    """
    def __init__(self):
        self._tools: Dict[str, Any] = {}
        self._tool_descriptions: Dict[str, str] = {}

    def register(self, name: str, tool_instance: Any, description: str = ""):
        self._tools[name] = tool_instance
        self._tool_descriptions[name] = description or getattr(tool_instance, "description", "")

    def unregister(self, name: str):
        if name in self._tools:
            del self._tools[name]
            del self._tool_descriptions[name]

    def get_tool(self, name: str) -> Optional[Any]:
        return self._tools.get(name)

    def get_all_tools(self) -> List[Any]:
        return list(self._tools.values())

    def get_tool_metadata(self) -> List[Dict[str, str]]:
        return [
            {"name": name, "description": desc}
            for name, desc in self._tool_descriptions.items()
        ]
