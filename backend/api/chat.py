import json
from fastapi import APIRouter, HTTPException
from backend.models.schemas import ChatRequest, ChatResponse, SourceSchema
from backend.services.document_manager import DocumentManager
from backend.rag.chain import RAGChain

router = APIRouter(tags=["Chat"])

def get_chat_router(doc_manager: DocumentManager, rag_chain: RAGChain):
    @router.post("/chat", response_model=ChatResponse)
    async def chat_endpoint(request: ChatRequest):
        question = request.message.strip()
        if not question:
            raise HTTPException(status_code=400, detail="Question cannot be empty.")

        if doc_manager.vector_store_manager.vector_store is None:
            raise HTTPException(
                status_code=503,
                detail="The vector database is offline or uninitialized. Check server logs."
            )

        try:
            # 1. Retrieve top matching chunks
            retriever = doc_manager.vector_store_manager.get_retriever()
            docs = retriever.invoke(question)

            # 2. Stringify context
            context = "\n\n".join(doc.page_content for doc in docs)

            # 3. Generate answer via LCEL RAG Chain
            ai_answer = rag_chain.generate_response(context=context, question=question)

            # 4. Extract citations from metadata
            sources_list = []
            for doc in docs:
                filename = doc.metadata.get("filename", doc.metadata.get("source", "Document"))
                chunk_num = doc.metadata.get("chunk_number")
                title_str = f"{filename} (Chunk #{chunk_num})" if chunk_num else filename
                
                sources_list.append(SourceSchema(
                    title=title_str,
                    snippet=doc.page_content
                ))

            res_payload = {
                "response": ai_answer,
                "sources": [s.dict() for s in sources_list]
            }
            print(f"\n[CHAT RESPONSE]\n{json.dumps(res_payload, indent=2)}\n")

            return ChatResponse(
                response=ai_answer,
                sources=sources_list
            )

        except Exception as e:
            print(f"[CHAT ERROR] Exception handling query: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    return router
