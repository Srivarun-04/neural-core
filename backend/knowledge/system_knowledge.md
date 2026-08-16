# NuraVault Technical Documentation & System Knowledge

## 1. Project Overview
NuraVault is a production-grade AI Knowledge Vault and conversational intelligence workspace. It combines Retrieval-Augmented Generation (RAG), persistent conversational memory, tool-calling agents, document ingestion, and mathematical computation into a unified, secure application.

---

## 2. Architecture Overview
NuraVault is structured into a modern client-server architecture:
- **Frontend**: Single-page application built with React 19, TypeScript, Vite, Tailwind CSS, Lucide React icons, and React Markdown. It supports dynamic Dark and Light themes with zero-flash persistence and responsive desktop and mobile layouts.
- **Backend**: High-performance asynchronous API built with FastAPI, Python, and Uvicorn.
- **AI & RAG Engine**: LangChain-powered agent coordinating tool execution, embeddings, vector retrieval, and conversational memory.
- **Vector Database**: Meta FAISS (Facebook AI Similarity Search) with disk-persisted vector indexes.
- **Relational Storage**: SQLite database for persisting multi-turn conversation sessions, message history, tool invocations, and user feedback.

---

## 3. Core Features & Capabilities
1. **Intelligent Conversational Agent**: Context-aware AI assistant capable of direct reasoning, contextual memory recall, and automatic tool execution.
2. **Knowledge Base & RAG Pipeline**: Document indexing and semantic retrieval for internal system documentation and user-uploaded files.
3. **Multi-Turn Conversation Memory**: Persistent session memory that retains context across message exchanges using SQLite.
4. **Tool Calling Ecosystem**:
   - `knowledge_base_search(query)`: Semantic search over indexed documents and system knowledge.
   - `calculator_tool(expression)`: Deterministic, safe mathematical evaluator for arithmetic, percentages, and conversions.
5. **Real-Time Streaming**: Server-Sent Events (SSE) streaming token-by-token responses alongside real-time tool execution status updates.
6. **Dual Knowledge Layer**:
   - **System Knowledge**: Global, immutable, read-only documentation describing NuraVault that is always indexed and protected from deletion.
   - **User Knowledge**: User-uploaded documents that can be added, searched, and deleted on demand.
7. **AI Response Actions**: User feedback controls (Thumbs Up, Thumbs Down) and one-click code/response copying.

---

## 4. RAG Pipeline & Vector Search
- **Embedding Model**: `sentence-transformers/all-MiniLM-L6-v2` generating 384-dimensional dense vector embeddings.
- **Chunking Strategy**: LangChain `RecursiveCharacterTextSplitter` configured with a chunk size of 300 characters and a chunk overlap of 50 characters.
- **Vector Index**: FAISS L2/Cosine similarity index stored in the `vectorstore/` directory.
- **Retrieval Parameters**: Top-k semantic similarity retrieval (default `k = 3`).
- **Supported Document Formats**: PDF (`.pdf`), Plain Text (`.txt`), Word Documents (`.docx`), and Markdown (`.md`).
- **Source Citations**: Every retrieved chunk includes metadata indicating the document title, chunk number, and text snippet.

---

## 5. Storage & Persistence
- **SQLite Database (`brain_memory.db`)**:
  - `chats`: Stores chat session identifiers, titles, creation timestamps, and update timestamps.
  - `messages`: Stores message role (user/assistant), content, timestamp, citations, tools used, feedback, and latency.
- **Vector Manifest (`manifest.json`)**: Tracks indexed files, hashes (SHA-256 for change detection), chunk counts, and file sizes.
- **Document Store (`data/`)**: Stores user-uploaded document files.

---

## 6. Available Tools & Decision Rules
- `knowledge_base_search(query)`: Called automatically when queries involve NuraVault's architecture, features, uploaded files, company policies, or internal facts.
- `calculator_tool(expression)`: Called automatically for exact arithmetic calculations, compound interest, percentage equations, or unit conversions.
- **Direct Reasoning**: Greetings, general programming questions, and conversational memory queries are answered directly without tool calls.

---

## 7. System Limitations
- **No Real-Time Web Search**: NuraVault does not have live internet scraping or real-time external web search capabilities.
- **File Upload Limits**: Supported document upload size is up to 25 MB per file.
- **Single-Tenant Local Vector Store**: The current vector database persists to local disk.

---

## 8. Security & System Protection
- **Delete Protection**: Built-in system knowledge is permanently protected against deletion. The backend API rejects any deletion requests targeting system documentation with `HTTP 403 Forbidden`.
- **Safe Calculator Execution**: The calculator tool uses AST (Abstract Syntax Tree) parsing rather than unsafe `eval()`, preventing arbitrary code execution.
