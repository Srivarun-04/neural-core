import time
import re
from typing import List, Dict, Any, Optional, Tuple, Generator, Callable
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, ToolMessage, BaseMessage
from langchain_core.tools import BaseTool
from backend.config.settings import OPENROUTER_API_KEY, LLM_MODEL, AGENT_MAX_ITERATIONS
from backend.models.schemas import SourceSchema
from backend.tools.base import ToolRegistry, ToolExecutionContext, get_tool_status_message
from backend.tools.calculator_tool import calculator_tool
from backend.tools.rag_tool import create_rag_tool, RAGSearchTool
from backend.services.document_manager import DocumentManager
from backend.agents.prompts import SYSTEM_AGENT_PROMPT

def clean_agent_output(text: str) -> str:
    """
    Cleans up any lingering meta-prefixes, system annotations,
    or internal tags from the model output.
    """
    if not text:
        return ""
    # Strip common meta labels like '- **Direct reply from conversation history**'
    text = re.sub(r'^\s*-\s*\*\*Direct reply[^\n]*\*\*\s*\n*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^\s*\*\*Direct reply[^\n]*\*\*\s*\n*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^\s*-\s*Direct reply[^\n]*\n*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'^\s*-\s*\*\*Reasoning[^\n]*\*\*\s*\n*', '', text, flags=re.IGNORECASE)
    return text.strip()

class NeuralAgent:
    """
    Intelligent Tool-Calling Agent for NuraVault.
    Coordinates memory, tool selection (RAG, Calculator),
    and response generation with full streaming and source citation tracking.
    """
    def __init__(self, doc_manager: Optional[DocumentManager] = None):
        self.doc_manager = doc_manager
        self.api_key = OPENROUTER_API_KEY or "missing_key_placeholder"
        
        self.llm = ChatOpenAI(
            model=LLM_MODEL,
            api_key=self.api_key,
            base_url="https://openrouter.ai/api/v1",
            temperature=0.3,
            streaming=True
        )

        self.registry = ToolRegistry()
        self._setup_tools()

    def _setup_tools(self):
        """Initializes and registers standard tools."""
        # 1. Calculator Tool
        self.registry.register("calculator_tool", calculator_tool, "Perform exact mathematical operations and conversions")

        # 2. RAG Tool (if document manager provided)
        if self.doc_manager:
            rag_tool = create_rag_tool(self.doc_manager)
            self.registry.register("knowledge_base_search", rag_tool, rag_tool.description)

    def get_tools_list(self, execution_context: Optional[ToolExecutionContext] = None) -> List[Any]:
        """Returns list of LangChain-compatible tools bound to the execution context."""
        tools = []
        # Calculator
        tools.append(calculator_tool)

        # RAG Tool with attached execution context
        if self.doc_manager:
            tools.append(create_rag_tool(self.doc_manager, execution_context=execution_context))

        return tools

    def _prepare_initial_messages(self, question: str, chat_history: str = "") -> List[BaseMessage]:
        messages: List[BaseMessage] = [
            SystemMessage(content=SYSTEM_AGENT_PROMPT)
        ]
        if chat_history and chat_history.strip() and chat_history != "No previous conversation history.":
            messages.append(SystemMessage(content=f"Conversation Context & Past History:\n{chat_history}"))
        messages.append(HumanMessage(content=question))
        return messages

    def invoke(
        self,
        question: str,
        chat_history: str = "",
        max_iterations: int = AGENT_MAX_ITERATIONS
    ) -> Tuple[str, List[SourceSchema], List[str], float]:
        """
        Executes the agent synchronously with tool calling.
        Returns (response_text, sources, tools_used, latency).
        """
        start_time = time.time()
        context = ToolExecutionContext()
        tools = self.get_tools_list(execution_context=context)
        tool_map = {t.name: t for t in tools}

        llm_with_tools = self.llm.bind_tools(tools)
        messages = self._prepare_initial_messages(question, chat_history)

        iteration = 0
        final_answer = ""

        try:
            while iteration < max_iterations:
                iteration += 1
                ai_msg: AIMessage = llm_with_tools.invoke(messages)
                messages.append(ai_msg)

                tool_calls = getattr(ai_msg, "tool_calls", None)
                if not tool_calls:
                    final_answer = ai_msg.content
                    break

                # Execute requested tools
                for tool_call in tool_calls:
                    tool_name = tool_call.get("name", "")
                    tool_args = tool_call.get("args", {})
                    call_id = tool_call.get("id", f"call_{iteration}")

                    selected_tool = tool_map.get(tool_name)
                    if selected_tool:
                        try:
                            tool_result = selected_tool.invoke(tool_args)
                        except Exception as tool_err:
                            tool_result = f"Tool execution notice: {str(tool_err)}"
                    else:
                        tool_result = f"Tool '{tool_name}' is currently unavailable."

                    tool_msg = ToolMessage(
                        content=str(tool_result),
                        tool_call_id=call_id,
                        name=tool_name
                    )
                    messages.append(tool_msg)

            if not final_answer and messages:
                final_ai = self.llm.invoke(messages)
                final_answer = final_ai.content

        except Exception as e:
            print(f"[AGENT ERROR] Agent invocation failed: {e}")
            final_answer = f"I encountered an issue processing your request: {str(e)}"

        clean_answer = clean_agent_output(final_answer)
        latency = round(time.time() - start_time, 3)
        return clean_answer, context.get_sources(), context.get_tools_used(), latency

    def stream_agent_events(
        self,
        question: str,
        chat_history: str = "",
        max_iterations: int = AGENT_MAX_ITERATIONS
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Executes intermediate tool calls yielding live status events ('Searching knowledge base...',
        'Calculating...', etc.) and then yields tokens for the synthesized response.
        Yields event dicts:
          {"type": "status", "message": "..."}
          {"type": "token", "token": "..."}
          {"type": "context", "sources": [...], "tools_used": [...]}
        """
        context = ToolExecutionContext()
        tools = self.get_tools_list(execution_context=context)
        tool_map = {t.name: t for t in tools}

        llm_with_tools = self.llm.bind_tools(tools)
        messages = self._prepare_initial_messages(question, chat_history)

        iteration = 0
        while iteration < max_iterations:
            iteration += 1
            ai_msg: AIMessage = llm_with_tools.invoke(messages)
            messages.append(ai_msg)

            tool_calls = getattr(ai_msg, "tool_calls", None)
            if not tool_calls:
                # Direct answer reached
                yield {"type": "status", "message": "Generating response..."}
                yield {"type": "context", "sources": context.get_sources(), "tools_used": context.get_tools_used()}
                
                # Stream synthesis
                if ai_msg.content:
                    yield {"type": "token", "token": clean_agent_output(ai_msg.content)}
                else:
                    for chunk in self.llm.stream(messages[:-1]):
                        if chunk.content:
                            yield {"type": "token", "token": chunk.content}
                return

            # Execute tool calls with live status notifications
            for tool_call in tool_calls:
                tool_name = tool_call.get("name", "")
                tool_args = tool_call.get("args", {})
                call_id = tool_call.get("id", f"call_{iteration}")

                status_text = get_tool_status_message(tool_name)
                yield {"type": "status", "message": status_text}

                selected_tool = tool_map.get(tool_name)
                if selected_tool:
                    try:
                        tool_result = selected_tool.invoke(tool_args)
                    except Exception as tool_err:
                        tool_result = f"Tool execution notice: {str(tool_err)}"
                else:
                    tool_result = f"Tool '{tool_name}' is currently unavailable."

                tool_msg = ToolMessage(
                    content=str(tool_result),
                    tool_call_id=call_id,
                    name=tool_name
                )
                messages.append(tool_msg)

        # After tool execution, synthesize final response
        yield {"type": "status", "message": "Generating response..."}
        yield {"type": "context", "sources": context.get_sources(), "tools_used": context.get_tools_used()}

        for chunk in self.llm.stream(messages):
            if chunk.content:
                yield {"type": "token", "token": chunk.content}
