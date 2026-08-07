# Neural Core 🧠⚡

> **Production-Grade Personal AI Operating System & Conversational RAG Engine**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![LangChain](https://img.shields.io/badge/LangChain-LCEL-1C3C3C.svg?style=flat)](https://www.langchain.com/)
[![FAISS](https://img.shields.io/badge/FAISS-Persistent_Vector_Store-00599C.svg?style=flat)](https://github.com/facebookresearch/faiss)
[![SQLite](https://img.shields.io/badge/SQLite-Session_Memory-003B57.svg?style=flat&logo=sqlite)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Project Overview

**Neural Core** is a production-ready, open-source personal AI Operating System designed to seamlessly synthesize **Retrieval-Augmented Generation (RAG)** across custom documents with **sliding-window conversational memory** and **real-time token streaming**. 

Unlike simple RAG prototypes that answer queries in isolation, Neural Core features persistent multi-session conversation tracking powered by SQLite, event-driven SSE streaming token delivery, persistent FAISS vector database indexing, and an intuitive ChatGPT-inspired React workspace.

---

## ✨ Key Features

### 🧠 Backend & AI Pipeline
- **Multi-Document RAG Engine**: Indexes `.pdf`, `.txt`, `.md`, `.doc`, and `.csv` files using local HuggingFace embeddings (`sentence-transformers/all-MiniLM-L6-v2`) and persistent FAISS.
- **SQLite Conversational Memory**: Full multi-session persistence for chat threads and message history that survives backend restarts.
- **Sliding-Window Memory Strategy**: Maintains a configurable window ($N=10$) of recent turns to give the LLM natural conversational recall without context window exhaustion.
- **Server-Sent Events (SSE) Token Streaming**: Real-time token streaming (`POST /chat/stream`) yielding continuous response tokens for low-latency ChatGPT-like UX.
- **Hybrid RAG & General Knowledge Synthesis**: Upgraded prompt engineering that prioritizes document context when available while gracefully answering general conversational queries.
- **Dynamic File Ingestion & Metadata Manifest**: Live file sync, duplicate hashing (SHA-256), chunk tracking, and instant document status REST endpoints.

### 🎨 Frontend & User Interface
- **ChatGPT-Style Workspace**: Modern dark-themed interface built with React 18, TypeScript, Tailwind CSS, and Lucide Icons.
- **Multi-Session Sidebar**: Create, select, rename, and delete conversation threads directly from the sidebar.
- **Streaming Response Render**: Token-by-token live stream rendering with real-time *"Neural Core is thinking..."* typing indicators.
- **Knowledge Base Dashboard**: System status panel showing document counts, total index chunks, vector store health, and uploaded files.
- **Optimized Connection Management**: Visibility-aware passive health status management (60s background ping, auto-pause on tab hide, focus refresh).

---

## 🏗️ System Architecture

```
+-----------------------------------------------------------------------------------+
|                                 React Frontend                                    |
|  +-------------------------+  +------------------------------------------------+  |
|  |  Sidebar Session Mgr    |  |  Chat Workspace (SSE Streaming UI)             |  |
|  | (Create/Rename/Delete)  |  |  - Token-by-token live rendering               |  |
|  | (Active Chat Highlight) |  |  - "Neural Core is thinking..." Indicator     |  |
|  +-------------------------+  +------------------------------------------------+  |
+--------------------------------------|--------------------------------------------+
                                       | REST APIs & SSE Stream (/chat/stream)
+--------------------------------------v--------------------------------------------+
|                               FastAPI Backend                                     |
|  +---------------------+  +----------------------+  +--------------------------+  |
|  |  Chat API Router    |  |  Chats API Router    |  | Health & Upload Routers  |  |
|  +----------|----------+  +----------|-----------+  +--------------------------+  |
|             |                        |                                            |
|  +----------v------------------------v-----------------------------------------+  |
|  |                    Services Layer (Clean Architecture)                      |  |
|  |  +-----------------------+  +-------------------+  +---------------------+  |  |
|  |  |  ConversationService  |  |   MemoryService   |  |      RAGChain       |  |  |
|  |  |  (SQLite DB Manager)  |  | (Sliding Window N)|  | (Streaming LLM LCEL)|  |  |
|  |  +-----------|-----------+  +---------|---------+  +----------|----------+  |  |
|  +--------------|------------------------|-----------------------|-------------+  |
+-----------------|------------------------|-----------------------|----------------+
                  |                        |                       |
                  v                        v                       v
         +-----------------+      +-----------------+     +-----------------+
         | SQLite Database |      | Conversation H. |     | FAISS Vector DB |
         | (chats/messages)|      | Formatted Text  |     | & OpenRouter    |
         +-----------------+      +-----------------+     +-----------------+
```

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend Framework** | FastAPI (Python 3.10+) | High-performance asynchronous REST API server |
| **LLM Orchestration** | LangChain (LCEL) | Prompt templates, output parsing, and model pipelines |
| **Embeddings** | HuggingFace `all-MiniLM-L6-v2` | Fast, high-quality local dense vector embeddings |
| **LLM Gateway** | OpenRouter API (`ChatOpenAI`) | Multi-model streaming LLM inference |
| **Vector Database** | FAISS | Persistent local similarity search index |
| **Database** | SQLite3 | Session and message history persistence |
| **Frontend Framework**| React 18 + TypeScript + Vite | Type-safe, fast interactive user interface |
| **Styling & UI** | Tailwind CSS + Lucide Icons | Premium glassmorphic dark-theme aesthetics |

---

## 📁 Repository Structure

```
rag/
├── backend/
│   ├── api/                  # FastAPI router endpoints
│   │   ├── chat.py           # Synchronous & SSE streaming chat routes
│   │   ├── chats.py          # Session management CRUD routes
│   │   ├── documents.py      # Indexed documents list API
│   │   ├── health.py         # System health endpoint
│   │   └── upload.py         # File upload & live indexing endpoint
│   ├── config/               # Configuration settings & environment variables
│   │   └── settings.py
│   ├── database/             # Database managers
│   │   ├── sqlite_db.py      # SQLite connection & table schemas
│   │   └── vector_store.py   # FAISS persistence & retrieval manager
│   ├── models/               # Pydantic request/response schemas
│   │   └── schemas.py
│   ├── rag/                  # RAG components
│   │   ├── chain.py          # LCEL RAG chain with streaming support
│   │   ├── embeddings.py     # HuggingFace embeddings loader
│   │   ├── loaders.py        # Multi-format document loader factory
│   │   └── splitter.py       # Text chunker & metadata enricher
│   └── services/             # Core business logic services
│       ├── conversation_service.py # SQLite session & message CRUD
│       ├── document_manager.py     # Directory scanner & indexing pipeline
│       └── memory_service.py       # Sliding-window conversation context
├── data/                     # Raw document storage directory
├── vectorstore/              # FAISS index files & SQLite database
│   ├── brain_memory.db
│   ├── index.faiss
│   ├── index.pkl
│   └── manifest.json
├── frontend/                 # Vite + React + TypeScript workspace
│   ├── src/
│   │   ├── components/       # UI Components (ChatArea, Sidebar, Navbar, etc.)
│   │   ├── hooks/            # Custom React hooks (useChat.ts)
│   │   ├── services/         # API Service client (api.ts)
│   │   ├── types/            # TypeScript interfaces (chat.ts)
│   │   └── utils/            # Local storage utilities (storage.ts)
│   ├── package.json
│   └── vite.config.ts
├── .env.example              # Environment variables template
├── .gitignore                # Production ignore patterns
├── main.py                   # FastAPI server entry point
└── README.md                 # Project documentation
```

---

## 🔄 RAG & Conversational Memory Workflow

1. **Document Ingestion**: Files uploaded via the `/upload` API or placed in `data/` are loaded, chunked ($300$ chars, $50$ overlap), enriched with metadata, and embedded using `all-MiniLM-L6-v2`.
2. **Vector Indexing**: Chunks are stored in FAISS and saved to disk alongside `manifest.json`.
3. **Session Querying**: When a user submits a prompt, `ConversationService` saves the message to SQLite and retrieves the last $N=10$ turns via `MemoryService`.
4. **Vector Retrieval**: FAISS retrieves top-$k$ ($k=3$) relevant document chunks.
5. **Streaming Generation**: Prompt template synthesizes history + context + question and streams tokens to the client over Server-Sent Events (SSE).
6. **Persistence**: The full assistant response, citations, model metadata, and latency are committed to SQLite.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health status and vector DB readiness check |
| `GET` | `/chats` | List all conversation sessions |
| `POST` | `/chats` | Create a new conversation session |
| `GET` | `/chats/{chat_id}` | Fetch session details and complete message history |
| `PATCH` | `/chats/{chat_id}` | Rename a conversation session |
| `DELETE` | `/chats/{chat_id}` | Delete a conversation session |
| `POST` | `/chat` | Synchronous RAG query endpoint |
| `POST` | `/chat/stream` | **SSE Streaming** token response endpoint |
| `GET` | `/documents` | List indexed document metadata and chunk stats |
| `POST` | `/upload` | Upload new document for instant indexing |
| `GET` | `/stats` | System metrics for Knowledge Base dashboard |

---

## 🚀 Installation & Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ and `npm`

### 1. Backend Setup
```bash
# Clone repository
git clone https://github.com/Srivarun-04/neural-core.git
cd neural-core

# Create virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn langchain langchain-openai langchain-community sentence-transformers faiss-cpu python-dotenv pydantic requests

# Create .env file from template
cp .env.example .env
```

Configure your `.env` file:
```ini
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=8000
HOST=127.0.0.1
```

Start the backend server:
```bash
python main.py
```
The backend API will be live at `http://localhost:8000` (API Docs at `http://localhost:8000/docs`).

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔮 Future Roadmap

- 🛠️ **Tool Calling & Agents**: Expand RAG into autonomous agentic workflows using LangChain / LangGraph.
- 🌐 **Web Search Integration**: Fallback web search for queries outside indexed documents.
- 💻 **Code Execution Sandbox**: Isolated Python runtime execution for computational queries.
- 🖼️ **Multimodal Vision**: Support for image understanding and document OCR.
- 💾 **Long-Term Memory Engine**: Hierarchical memory summarization across historical sessions.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
