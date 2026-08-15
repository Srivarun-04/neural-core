import time
from typing import Optional, List, Dict, Any, Callable
from langchain_core.tools import BaseTool
from pydantic import Field
from backend.services.document_manager import DocumentManager
from backend.models.schemas import SourceSchema
from backend.tools.base import ToolExecutionContext

class RAGSearchTool(BaseTool):
    name: str = "knowledge_base_search"
    description: str = (
        "Search and retrieve information, facts, policies, and details from uploaded documents "
        "and files stored in the knowledge base. Always use this tool when the user asks questions "
        "about their documents, leave policy, uploaded files, or internal knowledge."
    )
    doc_manager: Any = Field(default=None, exclude=True)
    execution_context: Optional[ToolExecutionContext] = Field(default=None, exclude=True)

    class Config:
        arbitrary_types_allowed = True

    def _run(self, query: str) -> str:
        start_time = time.time()
        query = query.strip()
        if not query:
            return "No search query provided."

        if self.doc_manager is None:
            return "Knowledge base document manager is not initialized."

        # Ensure vector store index is loaded
        if self.doc_manager.vector_store_manager.vector_store is None:
            self.doc_manager.vector_store_manager.load_index()

        if self.doc_manager.vector_store_manager.vector_store is None:
            return "No documents are currently indexed in the knowledge base."

        try:
            retriever = self.doc_manager.vector_store_manager.get_retriever()
            docs = retriever.invoke(query)
            
            if not docs:
                return f"No relevant document chunks found matching the query: '{query}'."

            sources_found: List[SourceSchema] = []
            formatted_chunks = []

            for i, doc in enumerate(docs, 1):
                filename = doc.metadata.get("filename", doc.metadata.get("source", "Document"))
                chunk_num = doc.metadata.get("chunk_number")
                title_str = f"{filename} (Chunk #{chunk_num})" if chunk_num else filename
                content = doc.page_content.strip()

                source_item = SourceSchema(
                    title=title_str,
                    snippet=content
                )
                sources_found.append(source_item)
                formatted_chunks.append(f"[Source {i}: {title_str}]\n{content}")

            output_text = "\n\n---\n\n".join(formatted_chunks)
            latency = round(time.time() - start_time, 3)

            # Record in execution context if attached
            if self.execution_context:
                self.execution_context.add_record(
                    tool_name=self.name,
                    input_args={"query": query},
                    output=output_text,
                    sources=sources_found,
                    latency=latency
                )

            return output_text

        except Exception as e:
            return f"Error retrieving from knowledge base: {str(e)}"

    async def _arun(self, query: str) -> str:
        return self._run(query)

def create_rag_tool(doc_manager: DocumentManager, execution_context: Optional[ToolExecutionContext] = None) -> RAGSearchTool:
    """Factory helper to instantiate RAGSearchTool with dependencies."""
    return RAGSearchTool(doc_manager=doc_manager, execution_context=execution_context)
