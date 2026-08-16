# NuraVault 🛡️✨

> **Intelligent AI Knowledge Vault & Conversational Workspace powered by Agent Tool Calling, Hybrid RAG, and Persistent Memory**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React-19.2.0-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![LangChain](https://img.shields.io/badge/LangChain-LCEL-1C3C3C.svg?style=flat)](https://www.langchain.com/)
[![FAISS](https://img.shields.io/badge/FAISS-Persistent_Vector_Store-00599C.svg?style=flat)](https://github.com/facebookresearch/faiss)
[![SQLite](https://img.shields.io/badge/SQLite-Session_Memory-003B57.svg?style=flat&logo=sqlite)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Overview

**NuraVault** is a full-stack AI-powered knowledge and conversation workspace. It seamlessly combines **Retrieval-Augmented Generation (RAG)**, **autonomous tool calling**, **multi-session conversational memory**, and **real-time token streaming** into an elegant, decoupled React + FastAPI application.

Unlike simple chatbot wrappers that hallucinate calculations or answer queries without context, NuraVault connects an advanced Large Language Model to:
1. **Private Document Storage**: Ingest, chunk, embed, and semantically retrieve context from PDFs, Word docs, Markdown, and text files.
2. **Built-in System Knowledge**: Canonical internal documentation describing NuraVault's own architecture that is always indexed and protected.
3. **Safe Mathematical Tool**: An AST-based, injection-safe mathematical evaluator for precision arithmetic, percentages, and conversions.
4. **Relational Conversation Memory**: Multi-session SQLite database tracking chats, messages, citations, tool executions, and user feedback across restarts.

> [!NOTE]
> **Project Scope**: NuraVault is designed as a clean, self-hosted, open-source AI portfolio application. It demonstrates solid engineering practices for local RAG, tool calling, and streaming UX without requiring paid enterprise infrastructure.

---

## ✨ Key Features

### 🧠 AI Engine & Backend Architecture
- **Autonomous Tool-Calling Agent**: Evaluates user prompts to determine whether to answer directly, perform semantic knowledge search, or execute mathematical computations.
- **Hybrid RAG Pipeline**: Ingests documents with LangChain text splitters, generates 384-dimensional dense vectors using local Hugging Face `sentence-transformers/all-MiniLM-L6-v2`, and retrieves top-$k$ matches with Meta FAISS.
- **Canonical System Knowledge**: Global, immutable, read-only documentation (`backend/knowledge/system_knowledge.md`) automatically indexed on startup.
- **Safe Calculator Tool (`calculator_tool`)**: AST-based evaluation engine supporting arithmetic, percentages, powers, factorial, square roots, and unit conversions without unsafe `eval()` execution.
- **Multi-Turn SQLite Memory**: Persistent session tracking storing full conversation history, citations, tool badges, and latency metrics in `vectorstore/brain_memory.db`.
- **Server-Sent Events (SSE) Streaming**: Low-latency token-by-token streaming with real-time tool status badges (`"Searching knowledge base..."`, `"Calculating..."`).
- **Complete Document Lifecycle**: Dynamic document upload, instant chunk indexing, SHA-256 change detection, and clean FAISS index reconstruction upon document deletion.

### 🎨 Frontend & User Experience
- **Modern React 19 Workspace**: Built with TypeScript, Vite 8, Tailwind CSS v4, Lucide React, and React-Markdown.
- **Dual Theme Support (Dark & Light)**: Curated dark mode and off-white/light-gray surface hierarchy with zero-flash localStorage theme persistence.
- **Interactive Sidebar Session Manager**: Create new conversations, search chats, inline rename, and delete sessions.
- **Knowledge Base Dashboard**: Real-time vault metrics (document counts, indexed chunks, embedding status), drag-and-drop file uploader, and individual document deletion.
- **Rich Message Cards & Code Blocks**: Clean GitHub-flavored Markdown rendering, syntax-highlighted code containers with one-click copy, and expandable source citation snippets.
- **AI Response Actions**: One-click response copying and 👍 / 👎 user feedback controls with persistent state.

---

## 🏗️ System Architecture

```
                                      CLIENT LAYER
                   ┌─────────────────────────────────────────────────┐
                   │         React 19 + TypeScript + Vite            │
                   │  ├── Chat Workspace (SSE Streaming + Badges)    │
                   │  ├── Knowledge Base (File Uploads & Stats)      │
                   │  └── Sidebar Session Manager (Multi-Chat)       │
                   └────────────────────────┬────────────────────────┘
                                            │ HTTP / SSE (/chat/stream)
                                            ▼
                                     BACKEND LAYER
                   ┌─────────────────────────────────────────────────┐
                   │             FastAPI Asynchronous API            │
                   │  ├── /chat & /chat/stream (Agent & LLM)         │
                   │  ├── /chats (SQLite Session CRUD)               │
                   │  ├── /documents & /upload (Document Lifecycle)  │
                   │  └── /health & /stats (System Diagnostics)      │
                   └───────┬─────────────────┬────────────────┬──────┘
                           │                 │                │
            ┌──────────────┴────────┐        │                │
            ▼                       ▼        ▼                ▼
   ┌─────────────────┐    ┌───────────┐ ┌──────────┐ ┌─────────────────┐
   │ OpenRouter LLM  │    │ Safe Calc │ │  FAISS   │ │ SQLite Database │
   │ (ChatOpenAI)    │    │  (AST)    │ │ Vectors  │ │ brain_memory.db │
   └─────────────────┘    └───────────┘ └──────────┘ └─────────────────┘
```

---

## 🔄 End-to-End RAG & Tool Execution Flow

```
User Prompt
    │
    ▼
FastAPI SSE Endpoint (/chat/stream)
    │
    ▼
NeuralAgent Orchestrator
    ├──> Direct Reasoning (Greetings, Conceptual Qs, Memory Recall) ──> Stream LLM
    │
    ├──> Math Expression Detected ──> Calculator Tool (AST Evaluator) ──> Stream LLM
    │
    └──> Knowledge / Vault Query Detected
             │
             ├──> Embed Query (sentence-transformers/all-MiniLM-L6-v2)
             ├──> FAISS Vector Retrieval (Top-k Similarity Search)
             ├──> Context Assembly (System Knowledge + User Documents)
             └──> Augmented Prompt Synthesis ──> Stream LLM Token Delivery
```

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Backend Framework** | FastAPI + Uvicorn | Asynchronous REST and Server-Sent Events API |
| **Agent & RAG** | LangChain (LCEL) | Agent tool orchestration and RAG chain assembly |
| **Embeddings** | Hugging Face `all-MiniLM-L6-v2` | Local, fast 384-dimensional dense embeddings |
| **Vector Store** | Meta FAISS (CPU) | Persistent local vector index for similarity search |
| **Relational Database** | SQLite3 | Multi-session chat history and feedback persistence |
| **LLM Gateway** | OpenRouter (`ChatOpenAI`) | Multi-model streaming LLM inference |
| **Frontend Framework** | React 19 + TypeScript + Vite | Type-safe, fast single-page application |
| **Styling & Icons** | Tailwind CSS v4 + Lucide React | Modern glassmorphic theme system & icons |
| **Markdown & Code** | React-Markdown + Remark-GFM | Formatted tables, quotes, lists, and code blocks |

---

## 📁 Project Structure

```
rag/
├── backend/
│   ├── agents/               # Autonomous agent & system prompts
│   │   ├── neural_agent.py   # Tool-calling agent orchestrator
│   │   └── prompts.py        # System prompts and tool routing rules
│   ├── api/                  # FastAPI router endpoints
│   │   ├── chat.py           # Synchronous & SSE streaming chat routes
│   │   ├── chats.py          # Session management CRUD routes
│   │   ├── documents.py      # Document listing, stats, and delete routes
│   │   ├── health.py         # Diagnostic health-check route
│   │   └── upload.py         # File ingestion & upload route
│   ├── config/
│   │   └── settings.py       # Central environment & path configuration
│   ├── database/
│   │   ├── sqlite_db.py      # SQLite connection manager & schema migrations
│   │   └── vector_store.py   # FAISS persistence & retriever interface
│   ├── knowledge/
│   │   └── system_knowledge.md # Canonical NuraVault internal documentation
│   ├── models/
│   │   └── schemas.py        # Pydantic request/response schemas
│   ├── rag/                  # RAG components
│   │   ├── chain.py          # Streaming LCEL prompt & LLM chain
│   │   ├── embeddings.py     # Hugging Face embeddings loader
│   │   ├── loaders.py        # PDF, DOCX, TXT, and Markdown file loaders
│   │   └── splitter.py       # RecursiveCharacterTextSplitter with metadata
│   ├── services/             # Core business logic services
│   │   ├── conversation_service.py # SQLite chat & message operations
│   │   ├── document_manager.py     # Ingestion lifecycle & manifest tracker
│   │   └── memory_service.py       # Sliding-window context memory formatting
│   └── tools/                # Tool implementations
│       ├── base.py           # ToolRegistry & ExecutionContext
│       ├── calculator_tool.py# AST-based safe mathematical evaluator
│       └── rag_tool.py       # Knowledge base semantic search tool
│
├── data/                     # Local document storage directory
│   └── notes.txt             # Sample document (Acme Remote Work Policy)
│
├── frontend/                 # React 19 + TypeScript SPA
│   ├── public/               # Branding assets (favicon.svg, logo.svg)
│   ├── src/
│   │   ├── components/       # UI Components (Chat, Sidebar, KnowledgeBase, Header, Message)
│   │   ├── hooks/            # Custom React hooks (useChat)
│   │   ├── services/         # API Service (REST & SSE parser)
│   │   ├── types/            # TypeScript interfaces & types
│   │   └── utils/            # Local storage & helper utilities
│   ├── index.html            # Main HTML shell with zero-flash theme script
│   ├── package.json          # Frontend dependencies
│   └── vite.config.ts        # Vite configuration
│
├── tests/                    # Backend automated unit test suite (29 tests)
│   ├── test_agent.py         # Agent tool registry & health tests
│   ├── test_calculator.py    # Calculator arithmetic & AST injection security tests
│   ├── test_chats.py         # Session management CRUD tests
│   ├── test_documents.py     # Document upload, listing, and delete tests
│   ├── test_health.py        # Health endpoint diagnostics tests
│   ├── test_memory.py        # Sliding-window memory tests
│   ├── test_rag_tool.py      # RAG retriever tool invocation tests
│   └── test_system_knowledge.py # Canonical system knowledge lifecycle tests
│
├── .env.example              # Template environment variable configuration
├── .gitignore                # Git ignore rules for secrets, DBs, and indexes
├── main.py                   # FastAPI application root entrypoint
├── requirements.txt          # Python runtime dependencies
└── README.md                 # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+** (Python 3.11 / 3.12 recommended)
- **Node.js 18+** & **npm**
- **OpenRouter API Key** (Free key available at [OpenRouter.ai](https://openrouter.ai/keys))

---

### Step 1: Clone Repository & Setup Backend

```bash
# 1. Clone the repository
git clone https://github.com/Srivarun-04/neural-core.git
cd neural-core

# 2. (Optional) Create and activate a virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 3. Install backend dependencies
pip install -r requirements.txt

# 4. Configure environment variables
cp .env.example .env
```

Open `.env` in your editor and add your OpenRouter API Key:
```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

### Step 2: Start Backend Server

```bash
python -m uvicorn main:app --reload --port 8000
```
- **Backend API**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

### Step 3: Setup & Start Frontend

Open a new terminal window:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install frontend dependencies
npm install

# 3. Configure environment variables (optional, defaults to http://localhost:8000)
cp .env.example .env

# 4. Start the development server
npm run dev
```

Open your browser at:
👉 **`http://localhost:5173`**

---

## 🧪 Testing

NuraVault includes a comprehensive automated test suite covering all services, tools, RAG retrievers, and security boundaries.

Run the test suite:
```bash
python -u -m unittest discover -s tests -p "test_*.py"
```

Verify frontend build:
```bash
cd frontend
npm run build
```

---

## 🛡️ Design & Engineering Decisions

1. **Why Local Embeddings (`sentence-transformers/all-MiniLM-L6-v2`)?**
   Embeddings run locally on CPU with zero per-vector cost, low latency, and no API rate-limit bottlenecks.
2. **Why FAISS?**
   Meta FAISS provides fast, memory-efficient in-process vector similarity search that serializes easily to disk for standalone development.
3. **Why AST for Calculator?**
   Evaluating math expressions via Python `eval()` poses severe Remote Code Execution (RCE) risks. NuraVault uses Python's Abstract Syntax Tree (`ast.parse`) with strict node whitelisting to guarantee mathematical safety.
4. **Why Server-Sent Events (SSE)?**
   SSE provides unidirectional HTTP streaming that works natively with standard HTTP/HTTPS firewalls, supports event typed payloads (`init`, `status`, `token`, `done`, `error`), and requires less connection overhead than WebSockets.

---

## ⚠️ Known Limitations

- **Single-Tenant Local Storage**: Documents and SQLite sessions are stored locally on disk; horizontal multi-instance scaling requires cloud object storage (S3) and an external vector database (Qdrant/Pinecone).
- **No Live Web Browsing**: NuraVault answers queries based on conversational history, built-in system knowledge, and uploaded documents. It does not perform live internet scraping.

---

## 📜 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.
