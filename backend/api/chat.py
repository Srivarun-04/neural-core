import time
import json
from typing import AsyncGenerator
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from backend.models.schemas import ChatRequest, ChatResponse, SourceSchema
from backend.services.document_manager import DocumentManager
from backend.services.conversation_service import ConversationService
from backend.services.memory_service import MemoryService
from backend.rag.chain import RAGChain
from backend.config.settings import LLM_MODEL

router = APIRouter(tags=["Chat"])

def get_chat_router(
    doc_manager: DocumentManager,
    rag_chain: RAGChain,
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

        # 2. Retrieve top matching vector store chunks (if index exists)
        context = ""
        sources_list = []
        if doc_manager.vector_store_manager.vector_store is None:
            doc_manager.vector_store_manager.load_index()

        if doc_manager.vector_store_manager.vector_store is not None:
            try:
                retriever = doc_manager.vector_store_manager.get_retriever()
                docs = retriever.invoke(question)
                context = "\n\n".join(doc.page_content for doc in docs)

                for doc in docs:
                    filename = doc.metadata.get("filename", doc.metadata.get("source", "Document"))
                    chunk_num = doc.metadata.get("chunk_number")
                    title_str = f"{filename} (Chunk #{chunk_num})" if chunk_num else filename
                    sources_list.append(SourceSchema(
                        title=title_str,
                        snippet=doc.page_content
                    ))
            except Exception as e:
                print(f"[RAG RETRIEVAL WARNING] Failed to retrieve context: {e}")

        # 3. Retrieve formatted conversation memory history
        chat_history = memory_service.get_formatted_history_text(chat_id)

        try:
            # 4. Generate response using RAGChain
            ai_answer = rag_chain.generate_response(
                context=context,
                question=question,
                chat_history=chat_history
            )
            latency = round(time.time() - start_time, 3)

            # 5. Save Assistant Message to SQLite
            sources_dict_list = [s.dict() for s in sources_list]
            conv_service.add_message(
                chat_id=chat_id,
                role="assistant",
                content=ai_answer,
                sources=sources_dict_list,
                model=LLM_MODEL,
                latency=latency
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
        Streams LLM tokens live to the frontend while persisting full output to SQLite.
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

        # 2. Retrieve vector store documents
        context = ""
        sources_list = []
        if doc_manager.vector_store_manager.vector_store is not None:
            try:
                retriever = doc_manager.vector_store_manager.get_retriever()
                docs = retriever.invoke(question)
                context = "\n\n".join(doc.page_content for doc in docs)

                for doc in docs:
                    filename = doc.metadata.get("filename", doc.metadata.get("source", "Document"))
                    chunk_num = doc.metadata.get("chunk_number")
                    title_str = f"{filename} (Chunk #{chunk_num})" if chunk_num else filename
                    sources_list.append(SourceSchema(
                        title=title_str,
                        snippet=doc.page_content
                    ))
            except Exception as e:
                print(f"[RAG STREAM RETRIEVAL WARNING] Failed to retrieve context: {e}")

        # 3. Retrieve formatted conversation memory history
        chat_history = memory_service.get_formatted_history_text(chat_id)

        async def sse_generator() -> AsyncGenerator[str, None]:
            # First send session initialization metadata event
            init_event = {
                "type": "init",
                "chat_id": chat_id,
                "sources": [s.dict() for s in sources_list]
            }
            yield f"data: {json.dumps(init_event)}\n\n"

            accumulated_response = []
            try:
                for token in rag_chain.stream_response(
                    context=context,
                    question=question,
                    chat_history=chat_history
                ):
                    accumulated_response.append(token)
                    chunk_event = {
                        "type": "token",
                        "token": token
                    }
                    yield f"data: {json.dumps(chunk_event)}\n\n"

                full_text = "".join(accumulated_response)
                latency = round(time.time() - start_time, 3)

                # Persist completed assistant response to SQLite
                sources_dict_list = [s.dict() for s in sources_list]
                conv_service.add_message(
                    chat_id=chat_id,
                    role="assistant",
                    content=full_text,
                    sources=sources_dict_list,
                    model=LLM_MODEL,
                    latency=latency
                )

                done_event = {
                    "type": "done",
                    "chat_id": chat_id,
                    "latency": latency
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
