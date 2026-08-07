from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

# Import the core LangChain modules you used in 06_rag_chain.py
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# Load environment variables from absolute path
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
load_dotenv(dotenv_path=dotenv_path)

# Verify key loading
api_key = os.getenv("OPENROUTER_API_KEY")
if api_key:
    print(f"[KEY] OPENROUTER_API_KEY loaded successfully")
else:
    print("[ERROR] OPENROUTER_API_KEY is missing or empty in .env!")

# Initialize FastAPI App
app = FastAPI(title="AI Brain Backend", version="1.0")

# Configure CORS so the React frontend (running on port 5173) can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development; adjust for production
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request & Response Schemas
class ChatRequest(BaseModel):
    message: str

class SourceSchema(BaseModel):
    title: str
    snippet: str
    url: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[SourceSchema]

# ----------------- Initialize RAG Core -----------------
# This runs once on startup, making endpoints fast because the vector store is already cached in memory.

try:
    # Initialize the LLM using OpenRouter (as configured in 06_rag_chain.py)
    llm = ChatOpenAI(
        model="openrouter/free",
        api_key=os.getenv("OPENROUTER_API_KEY"),
        base_url="https://openrouter.ai/api/v1",
    )

    # Load notes context
    loader = TextLoader("notes.txt")
    documents = loader.load()

    # Split into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=300,
        chunk_overlap=50,
    )
    chunks = splitter.split_documents(documents)

    # Embeddings
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    # In-memory FAISS Vector Store
    vector_store = FAISS.from_documents(chunks, embeddings)
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})

    # Chat Template Prompt
    prompt = ChatPromptTemplate.from_template(
        """
You are an Advisor, Answer based on Token Optimization.

Answer ONLY using the provided context.

Context:
{context}

Question:
{question}
"""
    )
    
    # Establish LCEL Chain
    chain = prompt | llm

    print("[SUCCESS] RAG Core Initialized Successfully!")

except Exception as e:
    print(f"[ERROR] Error during RAG Initialization: {e}")
    # We don't crash the server start, but we track the status
    chain = None
    retriever = None

# ----------------- API Endpoints -----------------

@app.get("/")
def read_root():
    return {"message": "AI Brain RAG Backend is running. Access the workspace UI at http://localhost:5173"}

@app.get("/health")
def health_check():
    """
    Used by the frontend to display the connection status dot.
    """
    if chain is None or retriever is None:
        return {"status": "degraded", "detail": "RAG pipeline failed to initialize"}
    return {"status": "healthy"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Handles user prompts, retrieves context from FAISS, and streams to LLM.
    """
    
    # Pretty print request JSON in console
    req_payload = {"message": request.message}

    if chain is None or retriever is None:
        raise HTTPException(
            status_code=503, 
            detail="The RAG core is currently offline or failed to initialize. Check server logs."
        )
    
    question = request.message
    if not question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        # 1. Retrieve matching document chunks
        docs = retriever.invoke(question)
        
        # 2. Stringify context
        context = "\n\n".join(doc.page_content for doc in docs)
        
        # 3. Invoke LLM Chain
        response = chain.invoke({
            "context": context,
            "question": question
        })

        # 4. Format RAG Sources for frontend citations
        sources_list = []
        for doc in docs:
            # Try to grab metadata or use file name
            src_title = doc.metadata.get("source", "notes.txt")
            # Create a source schema
            sources_list.append(SourceSchema(
                title=src_title,
                snippet=doc.page_content
            ))

        # Pretty print response JSON in console
        res_payload = {
            "response": response.content,
            "sources": [{"title": s.title, "snippet": s.snippet, "url": s.url} for s in sources_list]
        }

        return ChatResponse(
            response=response.content,
            sources=sources_list
        )

    except Exception as e:
        print(f"Error handling chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
