import time
import json
from typing import AsyncGenerator, Optional
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
            # Auto-create chat if not provided or doesn't exist
            new_chat = conv_service.create_chat(title=question[:30] + ("..." if len(question) > 30 else ""))
            chat_id = new_chat.id

        # 1. Save User Message to SQLite
        conv_service.add_message(chat_id=chat_id, role="user", content=question)

        # 2. Retrieve formatted conversation memory history
        chat_history = memory_service.get_formatted_history_text(chat_id)

        try:
            # 3. Execute NeuralAgent (handles tool selection, RAG, calculator, web search)
            ai_answer, sources_list, agent_latency = agent.invoke(
                question=question,
                chat_history=chat_history
            )
            total_latency = round(time.time() - start_time, 3)

            # 4. Save Assistant Message with collected sources to SQLite
            sources_dict_list = [s.dict() for s in sources_list]
            conv_service.add_message(
                chat_id=chat_id,
                role="assistant",
                content=ai_answer,
                sources=sources_dict_list,
                model=LLM_MODEL,
                latency=total_latency
            )

            return ChatResponse(
                chat_id=chat_id,
                response=ai_answer,
                sources=sources_list
            )

        except Exception as e:
            print(f"[CHAT ERROR] Exception handling query: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    @router.post("/chat/stream")
    async def chat_stream_endpoint(request: ChatRequest):
        """
        Streaming endpoint returning Server-Sent Events (SSE).
        Streams LLM tokens live while dynamically resolving tool calls and persisting full output to SQLite.
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
            accumulated_response = []
            try:
                # Execute agent stream generator
                token_gen, execution_context = agent.stream_agent(
                    question=question,
                    chat_history=chat_history
                )

                sources_list = execution_context.get_sources()

                # Send initial session metadata event with any upfront/discovered sources
                init_event = {
                    "type": "init",
                    "chat_id": chat_id,
                    "sources": [s.dict() for s in sources_list]
                }
                yield f"data: {json.dumps(init_event)}\n\n"

                # Stream response tokens
                for token in token_gen:
                    accumulated_response.append(token)
                    chunk_event = {
                        "type": "token",
                        "token": token
                    }
                    yield f"data: {json.dumps(chunk_event)}\n\n"

                full_text = "".join(accumulated_response)
                total_latency = round(time.time() - start_time, 3)

                # Persist completed assistant response to SQLite
                final_sources = execution_context.get_sources()
                sources_dict_list = [s.dict() for s in final_sources]
                conv_service.add_message(
                    chat_id=chat_id,
                    role="assistant",
                    content=full_text,
                    sources=sources_dict_list,
                    model=LLM_MODEL,
                    latency=total_latency
                )

                done_event = {
                    "type": "done",
                    "chat_id": chat_id,
                    "latency": total_latency,
                    "sources": sources_dict_list
                }
                yield f"data: {json.dumps(done_event)}\n\n"

            except Exception as stream_err:
                error_event = {
                    "type": "error",
                    "detail": str(stream_err)
                }
                yield f"data: {json.dumps(error_event)}\n\n"

        return StreamingResponse(sse_generator(), media_type="text/event-stream")

    return router
