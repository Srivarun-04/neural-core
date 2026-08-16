import time
import json
from typing import AsyncGenerator, Optional, List
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from backend.models.schemas import ChatRequest, ChatResponse, SourceSchema
from backend.services.document_manager import DocumentManager
from backend.services.conversation_service import ConversationService
from backend.services.memory_service import MemoryService
from backend.agents.neural_agent import NeuralAgent
from backend.config.settings import LLM_MODEL

router = APIRouter(tags=["Chat"])

def get_chat_router(
    agent: NeuralAgent,
    conv_service: ConversationService,
    memory_service: MemoryService
):
    @router.post("/chat", response_model=ChatResponse)
    async def chat_endpoint(request: ChatRequest):
        start_time = time.time()
        question = request.message.strip()
        if not question:
            raise HTTPException(status_code=400, detail="Question cannot be empty.")

        # Ensure active chat session
        chat_id = request.chat_id
        if not chat_id or not conv_service.get_chat(chat_id, include_messages=False):
            new_chat = conv_service.create_chat(title=question[:30] + ("..." if len(question) > 30 else ""))
            chat_id = new_chat.id

        # 1. Save User Message to SQLite
        conv_service.add_message(chat_id=chat_id, role="user", content=question)

        # 2. Retrieve formatted conversation memory history
        chat_history = memory_service.get_formatted_history_text(chat_id)

        try:
            # 3. Execute NeuralAgent (handles tool selection, RAG, calculator)
            ai_answer, sources_list, tools_used, agent_latency = agent.invoke(
                question=question,
                chat_history=chat_history
            )
            total_latency = round(time.time() - start_time, 3)

            # 4. Save Assistant Message with collected sources & tools_used to SQLite
            sources_dict_list = [s.dict() for s in sources_list]
            conv_service.add_message(
                chat_id=chat_id,
                role="assistant",
                content=ai_answer,
                sources=sources_dict_list,
                tools_used=tools_used,
                model=LLM_MODEL,
                latency=total_latency
            )

            return ChatResponse(
                chat_id=chat_id,
                response=ai_answer,
                sources=sources_list,
                tools_used=tools_used
            )

        except Exception as e:
            print(f"[CHAT ERROR] Exception handling query: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    @router.post("/chat/stream")
    async def chat_stream_endpoint(request: ChatRequest):
        """
        Streaming endpoint returning Server-Sent Events (SSE).
        Streams status events ('Searching knowledge base...', 'Calculating...'),
        live token generation, and persists completed message with tool badges to SQLite.
        """
        start_time = time.time()
        question = request.message.strip()
        if not question:
            raise HTTPException(status_code=400, detail="Question cannot be empty.")

        # Ensure active chat session
        chat_id = request.chat_id
        if not chat_id or not conv_service.get_chat(chat_id, include_messages=False):
            new_chat = conv_service.create_chat(title=question[:30] + ("..." if len(question) > 30 else ""))
            chat_id = new_chat.id

        # 1. Save User Message to SQLite
        conv_service.add_message(chat_id=chat_id, role="user", content=question)

        # 2. Retrieve formatted conversation memory history
        chat_history = memory_service.get_formatted_history_text(chat_id)

        async def sse_generator() -> AsyncGenerator[str, None]:
            accumulated_tokens: List[str] = []
            collected_sources: List[SourceSchema] = []
            collected_tools: List[str] = []
            init_sent = False

            try:
                # Initial handshake event
                init_event = {
                    "type": "init",
                    "chat_id": chat_id,
                    "sources": []
                }
                yield f"data: {json.dumps(init_event)}\n\n"
                init_sent = True

                # Process agent stream events
                for event in agent.stream_agent_events(question=question, chat_history=chat_history):
                    ev_type = event.get("type")

                    if ev_type == "status":
                        status_event = {
                            "type": "status",
                            "message": event.get("message", "Processing...")
                        }
                        yield f"data: {json.dumps(status_event)}\n\n"

                    elif ev_type == "context":
                        collected_sources = event.get("sources", [])
                        collected_tools = event.get("tools_used", [])

                    elif ev_type == "token":
                        token_str = event.get("token", "")
                        accumulated_tokens.append(token_str)
                        chunk_event = {
                            "type": "token",
                            "token": token_str
                        }
                        yield f"data: {json.dumps(chunk_event)}\n\n"

                full_text = "".join(accumulated_tokens)
                total_latency = round(time.time() - start_time, 3)

                # Persist completed assistant message to SQLite
                sources_dict_list = [s.dict() for s in collected_sources]
                conv_service.add_message(
                    chat_id=chat_id,
                    role="assistant",
                    content=full_text,
                    sources=sources_dict_list,
                    tools_used=collected_tools,
                    model=LLM_MODEL,
                    latency=total_latency
                )

                # Final done event
                done_event = {
                    "type": "done",
                    "chat_id": chat_id,
                    "latency": total_latency,
                    "sources": sources_dict_list,
                    "tools_used": collected_tools
                }
                yield f"data: {json.dumps(done_event)}\n\n"

            except Exception as stream_err:
                print(f"[STREAM ERROR] Exception during SSE generation: {stream_err}")
                error_event = {
                    "type": "error",
                    "detail": str(stream_err)
                }
                yield f"data: {json.dumps(error_event)}\n\n"

        return StreamingResponse(sse_generator(), media_type="text/event-stream")

    return router
