# NuraVault — Master Technical Architecture & System Documentation
**Document Version:** 1.0.0 (NuraVault Release)  
**Classification:** Internal Technical Architecture & Engineering Reference  
**Last Updated:** August 2026  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Evolution](#2-project-evolution)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Complete Repository Structure](#5-complete-repository-structure)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Backend Architecture](#7-backend-architecture)
8. [LLM Architecture & OpenRouter Integration](#8-llm-architecture--openrouter-integration)
9. [Prompt Engineering & System Prompt Architecture](#9-prompt-engineering--system-prompt-architecture)
10. [RAG Pipeline Architecture](#10-rag-pipeline-architecture)
11. [Document Loading System](#11-document-loading-system)
12. [Chunking Strategy & Optimization](#12-chunking-strategy--optimization)
13. [Embeddings & Vector Representations](#13-embeddings--vector-representations)
14. [FAISS Vector Store & Persistence](#14-faiss-vector-store--persistence)
15. [Retriever Architecture & Similarity Search](#15-retriever-architecture--similarity-search)
16. [RAG Context Synthesis & Hallucination Defense](#16-rag-context-synthesis--hallucination-defense)
17. [Agent & Tool Architecture](#17-agent--tool-architecture)
18. [Safe AST-Based Calculator Tool](#18-safe-ast-based-calculator-tool)
19. [Conversational Memory & Sliding Window Context](#19-conversational-memory--sliding-window-context)
20. [Database Architecture & SQLite Persistence](#20-database-architecture--sqlite-persistence)
21. [File Storage & Vector Invalidation Lifecycle](#21-file-storage--vector-invalidation-lifecycle)
22. [Comprehensive API Reference](#22-comprehensive-api-reference)
23. [End-to-End Chat Request Flow (RAG Query)](#23-end-to-end-chat-request-flow-rag-query)
24. [General Direct Conversation Flow](#24-general-direct-conversation-flow)
25. [Mathematical Computation Flow](#25-mathematical-computation-flow)
26. [Document Upload & Indexing Flow](#26-document-upload--indexing-flow)
27. [Complete Document Deletion & Purge Flow](#27-complete-document-deletion--purge-flow)
28. [AI Response Action & Quality Control System](#28-ai-response-action--quality-control-system)
29. [ChatGPT-Style Code Block & Markdown Rendering System](#29-chatgpt-style-code-block--markdown-rendering-system)
30. [Server-Sent Events (SSE) Streaming Architecture](#30-server-sent-events-sse-streaming-architecture)
31. [Error Handling & Resiliency Strategy](#31-error-handling--resiliency-strategy)
32. [Security, CORS & Environment Configuration](#32-security-cors--environment-configuration)
33. [Testing Architecture & Verification](#33-testing-architecture--verification)
34. [Production Deployment Architecture (Vercel + Cloud FastAPI)](#34-production-deployment-architecture-vercel--cloud-fastapi)
35. [Local Development & Environment Setup](#35-local-development--environment-setup)
36. [Troubleshooting Guide](#36-troubleshooting-guide)
37. [Architectural Design Decisions](#37-architectural-design-decisions)
38. [Technical Trade-Offs](#38-technical-trade-offs)
39. [Current Limitations](#39-current-limitations)
40. [Future Roadmap](#40-future-roadmap)
41. [Technical Interview Preparation Guide](#41-technical-interview-preparation-guide)
42. [Project Elevator Pitch (30 Seconds)](#42-project-elevator-pitch-30-seconds)
43. [Standard Project Walkthrough (2 Minutes)](#43-standard-project-walkthrough-2-minutes)
44. [Deep Architectural Walkthrough (5 Minutes)](#44-deep-architectural-walkthrough-5-minutes)
45. [Key Terms Glossary](#45-key-terms-glossary)
46. [Master System Diagram](#46-master-system-diagram)
47. [How Everything Connects: The Complete Story](#47-how-everything-connects-the-complete-story)

---

## 1. Project Overview

### Non-Technical Explanation
**NuraVault** is an intelligent, full-stack AI Assistant and Knowledge Engine. Unlike basic chatbots that only possess static knowledge and can guess numbers inaccurately or hallucinate when asked about personal files, NuraVault connects an advanced Large Language Model to your private documents and specialized tools. Users can upload PDFs, text documents, Word files, or Markdown notes, converse naturally with conversational memory across multiple distinct chat sessions, perform complex exact mathematical computations via a safe execution engine, and stream responses in real time with visual citations and code formatting.

### Technical Explanation
NuraVault is a production-oriented, decoupled AI application combining a modern **React 19 + TypeScript + Vite + Tailwind CSS** single-page application with a high-performance **FastAPI (Python 3.10+)** asynchronous backend. 

The core intelligence layer implements an autonomous **Tool-Calling Agent** powered by LangChain and OpenRouter. It integrates:
1. **Multi-Document Retrieval-Augmented Generation (RAG)** using local HuggingFace embeddings (`sentence-transformers/all-MiniLM-L6-v2`, 384-dimensional dense vectors) and a persisted **FAISS** vector store.
2. **Safe AST Mathematical Evaluator** preventing LLM calculation hallucinations via abstract syntax tree parsing.
3. **Conversational Memory Service** with SQLite session persistence and sliding-window context injection.
4. **Real-time Server-Sent Events (SSE)** protocol streaming intermediate agent thought statuses (`"Searching knowledge base..."`, `"Calculating..."`, `"Generating response..."`), chunked text tokens, and metadata payloads.

### Current Version & Capabilities (v0.4 Feature Freeze)
- **Version:** v0.4
- **Capabilities:**
  - Multi-chat conversational sessions persisted in SQLite.
  - Asynchronous SSE streaming with incremental client-side rendering.
  - Autonomous LangChain tool calling between direct LLM response, RAG vector retrieval, and AST math evaluation.
  - Multi-document RAG supporting `.pdf`, `.txt`, `.docx`, and `.md`.
  - Incremental indexing with SHA-256 hash tracking in `manifest.json`.
  - Complete document deletion with full vector database re-synchronization.
  - ChatGPT-style code blocks with syntax styling, horizontal scrolling, and raw code copying.
  - Full automated test suite (22 unit & integration test cases).
- **Current Limitations:**
  - No real-time web search (intentionally removed to eliminate third-party API dependencies, rate limits, and network latency).
  - Single-node file-based vector storage (FAISS local index) suitable for single-instance or persistent-volume cloud deployments.

---

## 2. Project Evolution

NuraVault was engineered iteratively through distinct phases to bridge foundational AI concepts into a production-grade application:

```
[Phase 0: Raw LLM Script]
       â”‚
       â–¼
[Phase 1: Prompt Templates & Input Validation]
       â”‚
       â–¼
[Phase 2: RAG Pipeline with Embeddings & FAISS]
       â”‚
       â–¼
[Phase 3: Multi-Document Management & SQLite Memory]
       â”‚
       â–¼
[Phase 4: Tool-Calling Agent Layer & Full-Stack SSE UI]
```

1. **Raw LLM Scripting**: Began with basic OpenRouter API calls using standard HTTP requests. Highlighted the need for structured message hierarchies (`SystemMessage`, `HumanMessage`, `AIMessage`).
2. **Prompt Engineering & LangChain Chains**: Transitioned to LangChain unified abstractions. Created structured prompt templates to constrain output behavior, reduce system hallucinations, and enforce markdown formatting.
3. **Retrieval-Augmented Generation (RAG)**: Solved the context boundary problem by implementing document loading, recursive character chunking, local dense embeddings (`all-MiniLM-L6-v2`), and a FAISS vector index.
4. **Persistent Multi-Chat & Memory**: Replaced in-memory dictionaries with an ACID-compliant SQLite relational database (`brain_memory.db`) implementing a sliding-window memory retriever to retain conversation history across restarts.
5. **FastAPI Modular API Architecture**: Wrapped services into RESTful endpoints with Pydantic v2 data validation schemas, lifespan startup sync, and CORS middleware.
6. **Agent & Tool Routing Architecture**: Transformed static RAG into an autonomous Tool-Calling Agent. The LLM evaluates user intent dynamicallyâ€”routing math to an AST calculator, document queries to the FAISS RAG retriever, and general conversational greetings directly to generation without invoking tools.
7. **Production Frontend & Real-Time SSE**: Built a modern React UI with Tailwind CSS, Server-Sent Events (SSE) parsing, live status thinking indicators, tool badges, and ChatGPT-style syntax code blocks.

---

## 3. High-Level Architecture

```
                                  +---------------------------------------+
                                  |            React 19 Frontend          |
                                  | (Vite, TypeScript, Tailwind, Lucide) |
                                  +---------------------------------------+
                                           â”‚                     â–²
                      POST /chat/stream    â”‚                     â”‚  SSE Tokens & Statuses
                      POST /upload         â”‚                     â”‚  JSON Metadata
                      DELETE /documents    â”‚                     â”‚
                                           â–¼                     â”‚
                     +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
                     |                 FastAPI Application Server              |
                     |  (Lifespan Management, CORS Middleware, Error Handling) |
                     +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
                                           â”‚                     â”‚
                â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                â–¼                                                                            â–¼
+â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+                                            +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
|   Conversation / Memory API  |                                            |    Document / Knowledge API    |
| (SQLite: chats & messages)   |                                            | (Upload, Index, Purge, Stats)  |
+â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+                                            +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
                â”‚                                                                            â”‚
                â–¼                                                                            â–¼
+â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+                                            +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
|     Memory Service Layer     |                                            |    Document Manager Service    |
|   (Sliding Window k=10)      |                                            | (SHA-256 Hash, Manifest, Load) |
+â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+                                            +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
                â”‚                                                                            â”‚
                â”‚                                                                            â”‚
                â–¼                                                                            â–¼
+â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
|                                           Neural Agent Layer                                               |
|                    (LangChain ChatOpenAI + Tool Binding + Stream Event Generator)                          |
+â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
                         â”‚                                           â”‚
                         â–¼                                           â–¼
          +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+           +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
          |      Safe Calculator Tool    |           |     Knowledge Base RAG Tool   |
          |  (AST Syntax Tree Evaluator) |           |  (Vector Store Retriever k=3) |
          +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+           +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
                                                                     â”‚
                                                                     â–¼
                                                     +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
                                                     |    FAISS Vector Store Manager |
                                                     | (index.faiss + index.pkl on disk)
                                                     +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
                                                                     â”‚
                                                                     â–¼
                                                     +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
                                                     |  HuggingFace Embedding Model  |
                                                     | (sentence-transformers MiniLM)|
                                                     +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+
```

---

## 4. Technology Stack

| Layer | Technology | Version | Purpose | Architectural Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | 19.2 | Core UI rendering | Declarative component model with fine-grained state management and DOM rendering efficiency. |
| **Language (Client)** | TypeScript | ~6.0 | Static Typing | Eliminates runtime interface bugs across API payloads and SSE chunk models. |
| **Build Tool** | Vite | 8.2 | Bundler & Dev Server | Ultra-fast Hot Module Replacement (HMR) and optimized Rollup production bundling. |
| **Styling** | Tailwind CSS | 4.3 | Utility-first styling | Glassmorphism, responsive grid layouts, and zero runtime CSS overhead. |
| **Icons** | Lucide React | 1.29 | UI Visual Elements | Lightweight, tree-shakeable SVG icon components. |
| **Markdown / Code** | `react-markdown` + `remark-gfm` | 10.1 / 4.0 | Markdown Parser | GitHub-Flavored Markdown AST parsing with custom code block component injection. |
| **Backend Framework**| FastAPI | 0.115+ | Asynchronous REST & SSE API | High throughput with ASGI (`uvicorn`), auto OpenAPI docs, and native async generator support. |
| **Language (Server)** | Python | 3.10+ | Core Backend Logic | Standard runtime for LangChain, scientific numerical libraries (FAISS), and ML models. |
| **AI / LLM Orchestration** | LangChain | 0.3+ | Agent & Tool Routing | Abstracted tool binding (`bind_tools`), prompt templating, and model interchangeability. |
| **LLM Gateway** | OpenRouter | REST API | Multi-model Inference Gateway | Unified access to state-of-the-art models (`openrouter/free`, `meta-llama`, etc.) via standard OpenAI API format. |
| **Vector Index** | FAISS | 1.9+ (`faiss-cpu`) | Dense Vector Search | High-performance C++ implementation of similarity search (L2 distance & inner product) with local disk persistence. |
| **Embeddings** | HuggingFace / PyTorch | `all-MiniLM-L6-v2` | Dense Text Embeddings | Fast, 384-dimensional dense vectors running locally on CPU with zero per-query API costs or network latency. |
| **Relational Database**| SQLite | 3.x (Built-in) | Chat History Storage | Serverless, zero-configuration ACID relational storage stored in `brain_memory.db`. |
| **Document Loaders** | `pypdf`, `docx2txt` | Latest | Document Text Extraction | Multi-format document parsing for PDF, DOCX, TXT, and Markdown files. |

---

## 5. Complete Repository Structure

```
nuravault/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ agents/
â”‚   â”‚   â”œâ”€â”€ __init__.py           # Agent module exports
â”‚   â”‚   â”œâ”€â”€ neural_agent.py       # NeuralAgent class, tool binding, and stream event generator
â”‚   â”‚   â””â”€â”€ prompts.py            # SYSTEM_AGENT_PROMPT and routing instructions
â”‚   â”œâ”€â”€ api/
â”‚   â”‚   â”œâ”€â”€ __init__.py           # API package initialization
â”‚   â”‚   â”œâ”€â”€ chat.py               # POST /chat and POST /chat/stream endpoints
â”‚   â”‚   â”œâ”€â”€ chats.py              # CRUD endpoints for /chats and /chats/{id}/messages
â”‚   â”‚   â”œâ”€â”€ documents.py          # GET /documents, GET /stats, and DELETE /documents/{filename}
â”‚   â”‚   â”œâ”€â”€ health.py             # GET /health and GET / endpoints
â”‚   â”‚   â””â”€â”€ upload.py             # POST /upload multipart document file endpoint
â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â”œâ”€â”€ __init__.py           # Config package initialization
â”‚   â”‚   â””â”€â”€ settings.py           # Environment variables, directory paths, and default hyperparameters
â”‚   â”œâ”€â”€ database/
â”‚   â”‚   â”œâ”€â”€ __init__.py           # Database package initialization
â”‚   â”‚   â”œâ”€â”€ sqlite_db.py          # DatabaseManager class for SQLite initialization & migrations
â”‚   â”‚   â””â”€â”€ vector_store.py       # VectorStoreManager class for FAISS load/save/clear/search
â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â”œâ”€â”€ __init__.py           # Models package initialization
â”‚   â”‚   â””â”€â”€ schemas.py            # Pydantic v2 schemas (Message, Chat, DocumentInfo, Source, Stats)
â”‚   â”œâ”€â”€ rag/
â”‚   â”‚   â”œâ”€â”€ __init__.py           # RAG package initialization
â”‚   â”‚   â”œâ”€â”€ embeddings.py         # HuggingFaceEmbeddings singleton factory
â”‚   â”‚   â”œâ”€â”€ loaders.py            # DocumentLoaderFactory for PDF, DOCX, TXT, MD
â”‚   â”‚   â””â”€â”€ splitter.py           # DocumentSplitter using RecursiveCharacterTextSplitter
â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”œâ”€â”€ __init__.py           # Services package initialization
â”‚   â”‚   â”œâ”€â”€ conversation_service.py # SQLite CRUD operations for chats and messages
â”‚   â”‚   â”œâ”€â”€ document_manager.py   # DocumentManager lifecycle (manifest tracking, indexing, purging)
â”‚   â”‚   â””â”€â”€ memory_service.py     # Sliding window conversation memory provider
â”‚   â””â”€â”€ tools/
â”‚       â”œâ”€â”€ __init__.py           # Tool exports
â”‚       â”œâ”€â”€ base.py               # ToolRegistry, ToolExecutionContext, ToolExecutionRecord, metadata
â”‚       â”œâ”€â”€ calculator_tool.py    # Safe AST calculator tool and mathematical evaluator
â”‚       â””â”€â”€ rag_tool.py           # RAGSearchTool wrapping FAISS vector retriever
â”œâ”€â”€ data/                         # Uploaded documents directory (.txt, .pdf, .docx, .md)
â”œâ”€â”€ docs/                         # Master technical documentation
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ public/                   # Static browser assets
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”‚   â”œâ”€â”€ Chat/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ ChatArea.tsx  # Message stream container, welcome screen, tool status banner
â”‚   â”‚   â”‚   â”œâ”€â”€ Header/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ Navbar.tsx    # Header, view switchers, health indicator, backend settings
â”‚   â”‚   â”‚   â”œâ”€â”€ Input/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ MessageInput.tsx # Auto-resizing textarea with keyboard submission
â”‚   â”‚   â”‚   â”œâ”€â”€ KnowledgeBase/
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ KnowledgeBase.tsx # Vector stats cards, document table, upload & delete UI
â”‚   â”‚   â”‚   â”œâ”€â”€ Message/
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ CodeBlock.tsx # ChatGPT-style code blocks with header & copy button
â”‚   â”‚   â”‚   â”‚   â”œâ”€â”€ MarkdownRenderer.tsx # ReactMarkdown with remark-gfm parser
â”‚   â”‚   â”‚   â”‚   â””â”€â”€ MessageItem.tsx # Chat bubble with tools badges, citations, copy action
â”‚   â”‚   â”‚   â””â”€â”€ Sidebar/
â”‚   â”‚   â”‚       â””â”€â”€ Sidebar.tsx   # Chat sessions sidebar, rename/delete/create controls
â”‚   â”‚   â”œâ”€â”€ hooks/
â”‚   â”‚   â”‚   â””â”€â”€ useChat.ts        # Primary conversation lifecycle & SSE streaming hook
â”‚   â”‚   â”œâ”€â”€ services/
â”‚   â”‚   â”‚   â””â”€â”€ api.ts            # Client HTTP & SSE streaming service
â”‚   â”‚   â”œâ”€â”€ types/
â”‚   â”‚   â”‚   â””â”€â”€ chat.ts           # TypeScript interfaces (Message, RAGSource, Conversation)
â”‚   â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â”‚   â””â”€â”€ storage.ts        # LocalStorage helpers for backend configuration
â”‚   â”‚   â”œâ”€â”€ App.tsx               # Root view router, modal manager, connection heartbeat
â”‚   â”‚   â”œâ”€â”€ index.css             # Tailwind CSS tokens, scrollbar styling, animations
â”‚   â”‚   â””â”€â”€ main.tsx              # React DOM root entrypoint
â”‚   â”œâ”€â”€ package.json              # Frontend dependencies and scripts
â”‚   â”œâ”€â”€ tsconfig.json             # TypeScript compiler settings
â”‚   â””â”€â”€ vite.config.ts            # Vite bundler configuration with Tailwind plugin
â”œâ”€â”€ tests/
â”‚   â”œâ”€â”€ test_agent.py             # Agent tool registry, health tools, clean output tests
â”‚   â”œâ”€â”€ test_calculator.py        # Safe math evaluator, AST injection defense, conversions
â”‚   â”œâ”€â”€ test_chats.py             # SQLite chat session creation, rename, delete, message retrieval
â”‚   â”œâ”€â”€ test_documents.py         # Document list, stats, upload, and deletion lifecycle tests
â”‚   â”œâ”€â”€ test_health.py            # API root and health check endpoints
â”‚   â”œâ”€â”€ test_memory.py            # Sliding window context truncation tests
â”‚   â””â”€â”€ test_rag_tool.py          # Vector retrieval execution and citation metadata tests
â”œâ”€â”€ vectorstore/                  # Vector database files (`index.faiss`, `index.pkl`, `manifest.json`, `brain_memory.db`)
â”œâ”€â”€ .env.example                  # Template configuration file
â”œâ”€â”€ main.py                       # FastAPI application entrypoint and router registration
â”œâ”€â”€ notes.txt                     # Default seeded knowledge base text document
â””â”€â”€ requirements.txt              # Python server package dependencies
```

---

## 6. Frontend Architecture

The frontend is constructed with React 19 and TypeScript, following a clean unidirectional data flow.

```
[App.tsx]
   â”‚
   â”œâ”€â”€ [Navbar.tsx] (Health Status, View Switcher: 'chat' | 'knowledge', Settings Modal)
   â”œâ”€â”€ [Sidebar.tsx] (Chat Session Selection, Create Chat, Rename Chat, Delete Chat)
   â”‚
   â””â”€â”€ View Switcher
          â”‚
          â”œâ”€â”€ (View === 'chat') â”€â”€â–º [ChatArea.tsx]
          â”‚                               â”‚
          â”‚                               â”œâ”€â”€ [MessageItem.tsx] (x N)
          â”‚                               â”‚         â”œâ”€â”€ [MarkdownRenderer.tsx]
          â”‚                               â”‚         â”‚         â””â”€â”€ [CodeBlock.tsx]
          â”‚                               â”‚         â”œâ”€â”€ Tool Badges ('Used: Calculator', 'Used: Knowledge Base')
          â”‚                               â”‚         â”œâ”€â”€ Sources Citations Cards (Title, Snippet, URL)
          â”‚                               â”‚         â””â”€â”€ Action Bar (Copy message)
          â”‚                               â”‚
          â”‚                               â”œâ”€â”€ [Thinking Status Banner] (Live SSE status message)
          â”‚                               â””â”€â”€ [MessageInput.tsx] (Textarea input & submit)
          â”‚
          â””â”€â”€ (View === 'knowledge') â”€â”€â–º [KnowledgeBase.tsx]
                                                â”œâ”€â”€ System Metric Cards (Doc Count, Vectors, Model, Store)
                                                â”œâ”€â”€ Upload Document Button & Dropzone
                                                â””â”€â”€ Document Table (Filename, Chunks, Size, Date, Delete Action)
```

### Component Breakdown
1. **`App.tsx`**: Orchestrates state between sidebar, navbar, and active view (`'chat'` vs `'knowledge'`). Maintains a connection heartbeat checking `GET /health` on initial load, every 60 seconds, and whenever the browser tab regains focus.
2. **`useChat.ts`**: The central state manager. Handles optimistic message rendering, updates active session IDs, listens to Server-Sent Events from `ApiService.streamChatMessage`, accumulates incoming text tokens, and attaches reference sources.
3. **`ChatArea.tsx`**: Manages auto-scrolling to bottom on new tokens, renders the welcome screen when conversations are empty, and displays the thinking status indicator during tool execution.
4. **`MessageItem.tsx`**: Formats individual chat bubbles. Renders tool badges with distinct icons, parses markdown via `MarkdownRenderer`, renders source citations, and provides a message copy action.
5. **`MarkdownRenderer.tsx` & `CodeBlock.tsx`**: Uses `react-markdown` and `remark-gfm` to transform standard Markdown into styled HTML elements, identifying fenced code blocks and rendering them inside code editor boxes with language headers and raw copy buttons.
6. **`KnowledgeBase.tsx`**: Dedicated management console for vector assets. Queries `GET /stats` and `GET /documents`, handles multipart file uploads to `POST /upload`, and dispatches `DELETE /documents/{filename}` calls with automatic table refresh.

---

## 7. Backend Architecture

FastAPI serves as the asynchronous backend framework.

### Request Pipeline

```
HTTP Client Request (e.g. POST /chat/stream)
    â”‚
    â–¼
[CORS Middleware] â”€â”€ (Validates Origin against settings.CORS_ORIGINS)
    â”‚
    â–¼
[FastAPI Router Routing] â”€â”€ (Routes to backend/api/chat.py)
    â”‚
    â–¼
[Pydantic Request Validation] â”€â”€ (Validates ChatRequest schema: message, chat_id)
    â”‚
    â–¼
[Conversation Retrieval & Context Injection] â”€â”€ (MemoryService gets last k=10 messages)
    â”‚
    â–¼
[NeuralAgent Execution] â”€â”€ (Prepares SystemMessage, binds tools, queries OpenRouter)
    â”‚
    â”œâ”€â”€ (If tool call emitted: executes tool in ToolRegistry, appends ToolMessage)
    â”‚
    â–¼
[SSE Generator Stream] â”€â”€ (Yields 'status', 'token', 'done' events over HTTP)
    â”‚
    â–¼
[SQLite Message Persistence] â”€â”€ (ConversationService records final assistant message)
```

### Key Modules:
- **`main.py`**: Initializes the FastAPI app with lifespan event handlers (`initialize_and_sync` for DocumentManager and `init_db` for DatabaseManager). Sets dynamic CORS middleware.
- **`backend/config/settings.py`**: Loads environment variables from `.env`. Sets critical paths and hyperparameter defaults (`CHUNK_SIZE=300`, `CHUNK_OVERLAP=50`, `RETRIEVAL_K=3`, `MEMORY_MAX_MESSAGES=10`).
- **`backend/models/schemas.py`**: Defines strict Pydantic v2 schemas ensuring contract validation across all endpoints.

---

## 8. LLM Architecture & OpenRouter Integration

NuraVault leverages **OpenRouter** as its LLM inference provider through LangChain's `ChatOpenAI` client interface.

### Client Configuration
```python
self.llm = ChatOpenAI(
    model=LLM_MODEL,                         # Defaults to "openrouter/free"
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
    temperature=0.3,
    streaming=True
)
```

### Message Structure:
LangChain message abstractions represent conversation turns:
- `SystemMessage`: Injects `SYSTEM_AGENT_PROMPT` containing identity, tool definitions, and routing instructions, followed by past conversation history.
- `HumanMessage`: Represents user input.
- `AIMessage`: Represents the LLM output (either final text content or an array of `tool_calls`).
- `ToolMessage`: Contains the raw output of an executed tool returned to the LLM for final synthesis.

### Streaming vs Synchronous Invocation:
- **Synchronous (`llm.invoke(messages)` / `POST /chat`)**: The model runs sequentially until completion, returning a complete `ChatResponse` payload.
- **Streaming (`stream_agent_events` / `POST /chat/stream`)**: Generates an async stream yielding intermediate SSE status updates as tools execute, followed by incremental text chunks as they arrive from OpenRouter.

---

## 9. Prompt Engineering & System Prompt Architecture

The system prompt in `backend/agents/prompts.py` governs agent decision-making:

```text
You are NuraVault, an advanced, articulate AI Agent powered by intelligent tool calling, conversational memory, and multi-source reasoning.

Available Tools:
1. `knowledge_base_search(query)`: Search user-uploaded documents, files, resumes, and stored knowledge in the vector store. Always use this tool whenever the user asks questions about their uploaded files, documents, organization policies (e.g. leave, remote work), resumes, or stored internal data.
2. `calculator_tool(expression)`: Perform safe, exact arithmetic, percentage calculations, powers, and unit conversions. Always use this tool for any mathematical calculations, arithmetic operations, or unit conversions.

Core Decision Rules:
- Direct Answers & No Unnecessary Tool Calls: For greetings, pleasantries, user identity recall, coding explanations, conceptual discussions, or general static reasoning, respond directly without calling any tools.
- Document Questions: For queries referencing files, documents, resumes, policies, or internal data, call `knowledge_base_search`.
- Calculations: For any calculation or math query, call `calculator_tool`.

Real-Time Information & Internet Queries:
- No Real-Time Internet Access: NuraVault does NOT currently have live web search or real-time internet access.
- When the user asks for real-time external data (e.g. today's weather, live stock prices, latest news), NEVER hallucinate or make up current facts.
- Instead, respond in a friendly, transparent, and slightly playful manner (e.g. "I don't have real-time internet access just yet ðŸ˜„ â€” my live-web-search brain is still under construction. But I can help you with AI concepts, your Knowledge Base, uploaded documents, calculations, and everything in our conversation history!").
- Do NOT block conceptual questions that happen to use words like "modern" or "current".

Output & Formatting Rules:
- Clean Output: NEVER prefix or annotate your response with internal meta-tags or system labels.
- Tone: Be articulate, direct, concise, and helpful.
- Markdown: Use clean GitHub-flavored markdown formatting.
```

### Prompt Engineering Defenses:
1. **Zero Meta-Tags Rule**: Strictly bans internal thinking prefixes (e.g., `- **Direct reply**`).
2. **Intent Guardrails**: Differentiates between real-time requests (which trigger polite capability disclosures) and conceptual questions (which are answered directly).
3. **Tool Specialization**: Clear tool descriptions ensure the LLM generates proper arguments for tool invocation.

---

## 10. RAG Pipeline Architecture

```
[Raw Document (.pdf, .txt, .docx, .md)]
                â”‚
                â–¼
      [DocumentLoaderFactory]  (Loads raw text)
                â”‚
                â–¼
       [DocumentSplitter]      (Splits text into chunks of 300 chars, 50 overlap)
                â”‚
                â–¼
    [HuggingFaceEmbeddings]    (Transforms text chunks into 384-dim dense vectors)
                â”‚
                â–¼
      [FAISS Vector Store]     (Stores vectors and serialized document chunks)
                â”‚
         (User Query)
                â”‚
                â–¼
      [Similarity Search]      (Computes L2 distance; retrieves Top-K=3 chunks)
                â”‚
                â–¼
    [RAG Context Injection]    (Passes retrieved snippets into LLM Prompt)
                â”‚
                â–¼
       [Grounded Answer]       (Generated answer with cited reference sources)
```

---

## 11. Document Loading System

Document ingestion is handled by `DocumentLoaderFactory` in `backend/rag/loaders.py`:

- **`.txt` / `.md`**: Loaded via LangChain `TextLoader` using UTF-8 decoding.
- **`.pdf`**: Loaded via `PyPDFLoader`, extracting page-by-page text streams.
- **`.docx`**: Loaded via `Docx2txtLoader`, extracting XML text paragraphs.
- **Metadata Tagging**: Every loaded document is tagged with metadata including `source` (filename), `file_path`, and `document_type`.

---

## 12. Chunking Strategy & Optimization

Text chunking is executed by `DocumentSplitter` in `backend/rag/splitter.py` using `RecursiveCharacterTextSplitter`:

- **Chunk Size (`CHUNK_SIZE = 300`)**: Keeps chunk passages compact and semantically focused.
- **Chunk Overlap (`CHUNK_OVERLAP = 50`)**: Preserves context across chunk boundaries, ensuring sentences split across boundaries do not lose semantic meaning.
- **Separators**: Uses `["\n\n", "\n", " ", ""]` in recursive order to break text naturally along paragraphs and sentences.
- **Metadata Enrichment**: Each chunk is enriched with `chunk_id` (e.g., `resume.pdf_chunk_0`), `source`, and `char_length`.

---

## 13. Embeddings & Vector Representations

- **Model:** `sentence-transformers/all-MiniLM-L6-v2` via HuggingFace.
- **Dimensionality:** 384 dimensions.
- **Execution:** Runs locally on CPU via PyTorch, eliminating third-party embedding API costs and network latency.
- **Semantic Representation:** Maps natural language sentences into a continuous vector space where semantically similar concepts (e.g., *"remote work reimbursement"* and *"internet stipend allowance"*) have high cosine similarity (low Euclidean distance).

---

## 14. FAISS Vector Store & Persistence

Managed by `VectorStoreManager` in `backend/database/vector_store.py`:

- **Storage Format**: Persisted locally in `vectorstore/index.faiss` (binary FAISS index) and `vectorstore/index.pkl` (serialized document chunks and metadata).
- **Index Management**:
  - `load_index()`: Deserializes the local FAISS index on application startup.
  - `create_and_save(documents)`: Constructs a new FAISS vector database from document chunks and writes to disk.
  - `clear_index()`: Removes index files from disk and sets internal pointer to `None`.
  - `add_documents(documents)`: Appends new vectors to the existing index and re-saves to disk.

---

## 15. Retriever Architecture & Similarity Search

- **Retriever Strategy:** `vector_store.as_retriever(search_kwargs={"k": 3})`.
- **Top-K (k=3):** Returns the 3 most relevant document chunks based on vector similarity.
- **Citation Construction:** Extracted chunks format source citations including `title` (filename), `snippet` (chunk text), and `chunk_id`, passed directly to the frontend for UI citation cards.

---

## 16. RAG Context Synthesis & Hallucination Defense

When the `knowledge_base_search` tool executes:
1. It queries the FAISS retriever with the user query.
2. If relevant chunks are found, it structures them with document titles and chunk IDs.
3. If no matching chunks exist in the vector store, it returns: `"No relevant information found in the knowledge base."`
4. The LLM receives this structured context and generates a grounded response, preventing hallucinated answers when document data is absent.

---

## 17. Agent & Tool Architecture

The agent layer in `backend/agents/neural_agent.py` coordinates autonomous tool invocation:

```
[User Input] â”€â”€â–º [NeuralAgent + ChatOpenAI]
                         â”‚
        â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
        â–¼                                 â–¼
[tool_calls emitted]              [No tool calls]
        â”‚                                 â”‚
        â–¼                                 â–¼
[Execute Registered Tool]         [Direct Answer Stream]
        â”‚
        â–¼
[Append ToolMessage]
        â”‚
        â–¼
[Final Model Synthesis Stream]
```

### Tool Registry (`backend/tools/base.py`):
- `knowledge_base_search`: Performs dense vector retrieval across uploaded files.
- `calculator_tool`: Evaluates arithmetic expressions and unit conversions via Python's AST parser.

---

## 18. Safe AST-Based Calculator Tool

Located in `backend/tools/calculator_tool.py`:
- **Why It Exists:** LLMs are statistical language models that frequently make errors on large-number arithmetic, percentage calculations, and multi-step math.
- **Safe Parsing (`safe_calculate`):** Uses Python's `ast.parse(expr, mode='eval')` to parse expressions into an abstract syntax tree and recursively evaluate only allowed mathematical nodes (`ast.BinOp`, `ast.UnaryOp`, `ast.Constant`, `ast.Call` for whitelisted functions like `sin`, `cos`, `sqrt`, `log`).
- **Security:** Arbitrary code execution (`eval`, `exec`, `os.system`, `__import__`) is strictly blocked.
- **Preprocessing:** Safely converts natural percentage syntax (`18% of 75000` -> `(18/100)*75000`) and time units (`5 hours into minutes` -> `5 * 60`).

---

## 19. Conversational Memory & Sliding Window Context

Managed by `MemoryService` in `backend/services/memory_service.py`:
- **Sliding Window:** Fetches the most recent `k=10` messages (`MEMORY_MAX_MESSAGES`) from SQLite for the active `chat_id`.
- **Context Injection:** Formats history into a clean dialogue string:
  ```text
  Conversation Context & Past History:
  User: My name is Varun.
  Assistant: Hello Varun! How can I assist you today?
  ```
- **Context Boundary:** Restricting memory to the last 10 messages ensures the LLM stays within token limits while preserving immediate context across turns.

---

## 20. Database Architecture & SQLite Persistence

Relational data is stored in SQLite at `vectorstore/brain_memory.db` via `DatabaseManager` (`backend/database/sqlite_db.py`):

### Entity-Relationship Diagram

```
+------------------------------------+
|               chats                |
+------------------------------------+
| id (TEXT, PK)                      |
| title (TEXT)                       |
| created_at (TEXT, ISO-8601)        |
| updated_at (TEXT, ISO-8601)        |
+------------------------------------+
                  â”‚ 1
                  â”‚
                  â”‚ N (ON DELETE CASCADE)
                  â–¼
+------------------------------------+
|              messages              |
+------------------------------------+
| id (TEXT, PK)                      |
| chat_id (TEXT, FK -> chats.id)     |
| role (TEXT: 'user' | 'assistant')  |
| content (TEXT)                     |
| timestamp (TEXT, ISO-8601)         |
| sources (TEXT, JSON array)         |
| tools_used (TEXT, JSON array)      |
| model (TEXT)                       |
| latency (REAL)                     |
+------------------------------------+
```

---

## 21. File Storage & Vector Invalidation Lifecycle

1. **Raw Files (`data/`)**: Uploaded documents are saved under `data/{filename}`.
2. **Manifest (`vectorstore/manifest.json`)**: Tracks indexed documents, file hashes (SHA-256), chunk counts, and byte sizes.
3. **Vector Database (`vectorstore/index.faiss`)**: Contains embedded vector chunks.
4. **Purge Lifecycle:** When a document is deleted:
   - Physical file in `data/` is unlinked.
   - Entry is removed from `manifest.json`.
   - FAISS vector store is completely rebuilt from all remaining documents in `data/` (or cleared if 0 documents remain), ensuring deleted data cannot be retrieved.

---

## 22. Comprehensive API Reference

### Health & Diagnostics
- **`GET /`**: Returns API root health information.
- **`GET /health`**: Returns system health, version (`0.4`), and active tool list (`["calculator_tool", "knowledge_base_search"]`).

### Conversations (`/chats`)
- **`GET /chats`**: List all conversation sessions ordered by `updated_at DESC`.
- **`POST /chats`**: Create a new conversation session (`{"title": "..."}`).
- **`GET /chats/{chat_id}`**: Get conversation details including message history.
- **`PATCH /chats/{chat_id}`**: Rename a conversation session (`{"title": "..."}`).
- **`DELETE /chats/{chat_id}`**: Delete a conversation session and all its messages.
- **`GET /chats/{chat_id}/messages`**: Get all messages for a specific session.

### Chat & Streaming
- **`POST /chat`**: Synchronous chat endpoint. Returns full `ChatResponse`.
- **`POST /chat/stream`**: Real-time Server-Sent Events (SSE) streaming endpoint.

### Knowledge Base & Documents
- **`GET /documents`**: Returns metadata for all indexed documents.
- **`GET /stats`**: Returns Knowledge Base system metrics (document count, total chunks, embedding model).
- **`POST /upload`**: Multipart file upload (`.txt`, `.pdf`, `.docx`, `.md`).
- **`DELETE /documents/{filename}`**: Purges document from disk, manifest, and FAISS vector index.

---

## 23. End-to-End Chat Request Flow (RAG Query)

```
1. User enters: "What is the remote work stipend policy in my files?"
2. Frontend sends: POST /chat/stream {"message": "...", "chat_id": "..."}
3. Backend MemoryService loads last 10 messages from SQLite for chat_id.
4. NeuralAgent binds tools and sends prompt + history to OpenRouter.
5. Model returns tool_call: `knowledge_base_search(query="remote work stipend policy")`.
6. Backend emits SSE: `{"type": "status", "message": "Searching knowledge base..."}`.
7. RAGSearchTool queries FAISS index and retrieves Top-3 chunks.
8. Backend appends ToolMessage with retrieved snippets and re-queries OpenRouter.
9. Backend emits SSE: `{"type": "status", "message": "Generating response..."}`.
10. Model streams response tokens; backend forwards SSE `{"type": "token", "token": "..."}`.
11. Backend emits final SSE: `{"type": "done", "tools_used": ["Knowledge Base"], "sources": [...]}`.
12. Frontend renders response text, tool badges, and reference citation cards.
13. Backend persists user message and assistant response to SQLite.
```

---

## 24. General Direct Conversation Flow

```
1. User enters: "Hello, can you explain recursion in Python?"
2. NeuralAgent analyzes prompt and detects no document or calculation tools are required.
3. Model streams explanation directly without invoking tools.
4. Frontend renders response with syntax-highlighted Python CodeBlock.
```

---

## 25. Mathematical Computation Flow

```
1. User enters: "Calculate 18% of 75000"
2. NeuralAgent emits tool_call: `calculator_tool(expression="18% of 75000")`.
3. Backend emits SSE: `{"type": "status", "message": "Calculating..."}`.
4. AST Calculator computes: `13500.0` with exact precision.
5. Model formats answer: "18% of 75,000 is 13,500."
6. Frontend displays `Used: Calculator` badge.
```

---

## 26. Document Upload & Indexing Flow

```
1. User uploads `company_policy.pdf` via Knowledge Base UI.
2. Frontend sends: POST /upload (multipart/form-data).
3. Backend saves file to `data/company_policy.pdf`.
4. DocumentLoaderFactory parses PDF text streams.
5. DocumentSplitter chunks text into 300-character segments.
6. HuggingFaceEmbeddings generates 384-dimensional dense vectors.
7. VectorStoreManager adds vectors to FAISS and saves `index.faiss` to disk.
8. DocumentManager updates `manifest.json` with file hash and chunk count.
9. Knowledge Base UI immediately displays updated document stats.
```

---

## 27. Complete Document Deletion & Purge Flow

```
1. User clicks Delete on `company_policy.pdf`.
2. Frontend sends: DELETE /documents/company_policy.pdf.
3. DocumentManager deletes physical file `data/company_policy.pdf`.
4. DocumentManager removes `company_policy.pdf` from `manifest.json`.
5. DocumentManager rebuilds FAISS index from all remaining files in `data/`.
6. FAISS saves updated index to disk.
7. Subsequent RAG queries can no longer retrieve chunks from deleted file.
```

---

## 28. AI Response Action & Quality Control System

- **Copy Response Action:** Integrated at the bottom-right of every assistant message in `MessageItem.tsx`.
- **Behavior:** Copies plain text response content to the system clipboard and toggles a green `Copied âœ“` indicator for 2 seconds.

---

## 29. ChatGPT-Style Code Block & Markdown Rendering System

- **Markdown Parser:** `MarkdownRenderer.tsx` using `react-markdown` and `remark-gfm`.
- **Code Block Component (`CodeBlock.tsx`):**
  - Detects fenced language blocks (e.g. ````python`).
  - Top header bar displays lowercase language badge on left and a `Copy` button on right.
  - Clicking `Copy` extracts raw code text only (omitting backticks) and changes to `Copied âœ“` for 2 seconds.
  - Enclosed in a dark theme container (`bg-[#060913]`) with horizontal scrolling for long lines.

---

## 30. Server-Sent Events (SSE) Streaming Architecture

The SSE protocol in `backend/api/chat.py` uses chunked HTTP streaming (`text/event-stream`):

```
data: {"type": "init", "chat_id": "...", "sources": []}

data: {"type": "status", "message": "Searching knowledge base..."}

data: {"type": "token", "token": "According "}
data: {"type": "token", "token": "to "}
data: {"type": "token", "token": "your "}
data: {"type": "token", "token": "files..."}

data: {"type": "done", "chat_id": "...", "latency": 1.42, "sources": [...], "tools_used": ["Knowledge Base"]}
```

The frontend `ApiService.streamChatMessage` parses lines starting with `data: `, dispatches typed callbacks (`onInit`, `onStatus`, `onToken`, `onDone`), and renders tokens incrementally without waiting for complete generation.

---

## 31. Error Handling & Resiliency Strategy

- **Missing OpenRouter API Key:** Displays placeholder warning in logs and returns friendly client error without crashing the server.
- **Division by Zero / Malformed Math:** AST calculator catches `ZeroDivisionError` and syntax errors, returning safe descriptive strings back to the LLM.
- **Corrupted Document Uploads:** `DocumentLoaderFactory` catches parse errors and raises `HTTP 400 Bad Request` with diagnostic details.
- **Network / SSE Disconnect:** Frontend `useChat` marks message with an `isError: true` flag and renders a recovery indicator.

---

## 32. Security, CORS & Environment Configuration

- **API Keys:** Loaded strictly from `.env` via `backend/config/settings.py`. Never sent to the client browser.
- **Dynamic CORS:** Configured via `CORS_ORIGINS` in `.env` (supports comma-separated origins for production domains like `https://nuravault.vercel.app`).
- **AST Execution Sandbox:** Disallows arbitrary Python execution in the calculator tool.

---

## 33. Testing Architecture & Verification

The test suite in `tests/` uses Python's standard `unittest` framework and `fastapi.testclient.TestClient`:

- **`test_health.py`**: Validates root and `/health` endpoints.
- **`test_calculator.py`**: Tests arithmetic, division by zero, percentage conversions, power operations, and AST code injection defense.
- **`test_chats.py`**: Tests complete session lifecycle (create, list, rename, delete, message retrieval).
- **`test_documents.py`**: Tests document listing, stats endpoint, and the complete upload-delete-purge lifecycle.
- **`test_memory.py`**: Tests sliding-window memory truncation.
- **`test_rag_tool.py`**: Tests vector retrieval and citation construction.
- **`test_agent.py`**: Tests tool registry, display names, and output cleaner.

### Running Tests:
```bash
python -m unittest discover -s tests -v
```

---

## 34. Production Deployment Architecture (Vercel + Cloud FastAPI)

```
[Vercel Edge Network]                          [Cloud FastAPI Service]
(React Single-Page App)                      (Render / Railway / Fly.io / AWS)
          â”‚                                                  â”‚
          â”‚  HTTPS / REST / SSE                              â”‚
          â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                      VITE_API_URL=https://api.yourdomain.com
```

- **Frontend Deployment (Vercel):** Build command `npm run build`, output directory `dist/`. Environment variable `VITE_API_URL` set to production backend URL.
- **Backend Deployment (Cloud Service):** Start command `uvicorn main:app --host 0.0.0.0 --port $PORT`. Environment variables `OPENROUTER_API_KEY` and `CORS_ORIGINS` configured. Persistent disk attached for `vectorstore/` and `data/`.

---

## 35. Local Development & Environment Setup

### Backend Setup:
```bash
# 1. Navigate to project root
cd rag_app/rag

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Add OPENROUTER_API_KEY in .env

# 5. Start FastAPI server
python -m uvicorn main:app --reload --port 8000
```

### Frontend Setup:
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install packages
npm install

# 3. Start Vite development server
npm run dev
```

---

## 36. Troubleshooting Guide

| Issue | Root Cause | Resolution |
| :--- | :--- | :--- |
| **`CORS Error` in Browser** | Backend `CORS_ORIGINS` does not match frontend origin. | Add frontend URL (e.g. `http://localhost:5173`) to `CORS_ORIGINS` in `.env`. |
| **`404 Not Found` on API Calls** | Frontend pointing to wrong backend URL. | Set backend URL in Settings modal or configure `VITE_API_URL` in `frontend/.env`. |
| **FAISS Deserialization Warning** | Loading pickle files from disk. | Handled via `allow_dangerous_deserialization=True` in `VectorStoreManager`. |
| **Embedding Download Hangs** | HuggingFace Hub network rate limits. | Set optional `HF_TOKEN` in `.env` or pre-cache `all-MiniLM-L6-v2`. |

---

## 37. Architectural Design Decisions

1. **FastAPI over Flask/Django:** Native async generator support for SSE streaming, automatic OpenAPI schemas, and Pydantic validation.
2. **FAISS over Pinecone/Weaviate:** Self-contained, zero-cost, runs locally on disk with zero external network dependencies.
3. **Local Embeddings (`all-MiniLM-L6-v2`) over OpenAI Embeddings:** 384-dimensional dense embeddings run fast on CPU with zero per-token costs.
4. **AST Calculator over `eval()`:** Complete security sandbox preventing code injection while guaranteeing exact mathematical precision.

---

## 38. Technical Trade-Offs

| Component | Advantages | Limitations / Trade-Offs |
| :--- | :--- | :--- |
| **FAISS (Local Disk)** | Fast, zero cost, no external dependency. | Limited to single-server persistent disk; horizontal scaling requires migrating to a distributed vector DB (e.g. Qdrant/Pinecone). |
| **SQLite** | Zero setup, embedded, ACID compliant. | File-locked on high-concurrency multi-instance writes; requires PostgreSQL for distributed server clusters. |
| **Local CPU Embeddings** | Free, zero latency, offline capable. | Uses host CPU/RAM; slightly lower semantic capacity than 1536-dim cloud models. |

---

## 39. Current Limitations

- **Single-Node Storage:** Vector index and SQLite database are stored on local disk.
- **No Real-Time Internet:** Queries about live current events or stock prices return transparent capability notices.
- **Single-User Workspace:** Multi-user authentication is not implemented in v0.4.

---

## 40. Future Roadmap

- [ ] **Cloud Vector DB Migration:** Support for Qdrant/Pinecone for multi-instance scaling.
- [ ] **User Authentication:** JWT-based user authentication and multi-tenant document isolation.
- [ ] **Advanced Agent Orchestration:** Migration to LangGraph for multi-agent workflows.

---

## 41. Technical Interview Preparation Guide

### Beginner Level
- **Q: What is NuraVault?**  
  *Strong Answer:* NuraVault is a full-stack AI platform combining an autonomous tool-calling agent with a multi-document RAG pipeline, SQLite conversational memory, and real-time SSE streaming.
- **Q: What is RAG?**  
  *Strong Answer:* Retrieval-Augmented Generation enhances LLM responses by retrieving relevant document snippets from a vector store and injecting them into the prompt as factual ground truth.

### Intermediate Level
- **Q: Why use FAISS instead of traditional SQL full-text search?**  
  *Strong Answer:* SQL search matches keywords, failing on synonyms. FAISS performs dense vector similarity search in semantic embedding space, finding conceptually relevant content even when exact keywords differ.
- **Q: How does Server-Sent Events (SSE) streaming work in NuraVault?**  
  *Strong Answer:* FastAPI uses an ASGI async generator streaming chunked event data (`data: {...}\n\n`). The client reads the stream via `ReadableStreamDefaultReader`, rendering text tokens incrementally.

### Advanced Level
- **Q: How does NuraVault prevent code injection in the calculator?**  
  *Strong Answer:* It uses Python's Abstract Syntax Tree (`ast.parse`) to recursively evaluate only whitelisted mathematical operations (`BinOp`, `UnaryOp`, `Constant`), completely bypassing unsafe `eval()`.
- **Q: How is document deletion handled in the vector store?**  
  *Strong Answer:* FAISS does not support arbitrary row deletions cleanly. NuraVault purges the source file from disk and manifest, then re-synchronizes a clean FAISS index from the remaining documents.

---

## 42. Project Elevator Pitch (30 Seconds)

> "NuraVault is a production-oriented AI Agent and Knowledge Engine built with React, FastAPI, and LangChain. It combines multi-document RAG using local dense embeddings and FAISS, a secure AST-based mathematical tool, and multi-chat SQLite memory. Responses stream in real time via Server-Sent Events with live tool status visibility and formatted code blocks."

---

## 43. Standard Project Walkthrough (2 Minutes)

> "NuraVault was designed to bridge the gap between basic LLM wrappers and robust, production-ready AI applications.
>
> On the frontend, we built a modern React 19 single-page application with TypeScript and Tailwind CSS that supports multiple chat sessions, real-time SSE streaming, live tool usage badges, and ChatGPT-style code blocks with copy functionality.
>
> On the backend, FastAPI coordinates a LangChain Tool-Calling Agent connected to OpenRouter. When a user submits a query, the agent dynamically decides whether to respond directly, evaluate math using a safe AST parser, or retrieve relevant knowledge from our FAISS vector store.
>
> The RAG pipeline processes PDFs, DOCX, TXT, and Markdown files using recursive chunking and local HuggingFace embeddings. All conversations and metadata persist in an ACID-compliant SQLite database with automatic schema migrations."

---

## 44. Deep Architectural Walkthrough (5 Minutes)

> "Let's walk through the end-to-end architecture of NuraVault.
>
> 1. **Client Layer:** The React 19 frontend uses a custom `useChat` hook to manage optimistic UI updates and listen to Server-Sent Events from FastAPI.
> 2. **API & Middleware Layer:** FastAPI validates incoming requests using Pydantic v2 schemas and applies dynamic CORS policies configured via environment variables.
> 3. **Memory & Context Assembly:** The `MemoryService` retrieves the last 10 messages from SQLite (`brain_memory.db`) to provide conversational memory without exceeding context limits.
> 4. **Agent Orchestration:** The `NeuralAgent` binds LangChain tools with OpenRouter's `ChatOpenAI`. The LLM decides whether to invoke tools based on structured schemas.
> 5. **Tool Execution:** If a document query is detected, `RAGSearchTool` queries the FAISS vector database using 384-dimensional dense vectors generated by `sentence-transformers/all-MiniLM-L6-v2`. If math is detected, `SafeCalculatorTool` evaluates the expression using Python's AST parser.
> 6. **Streaming & Synthesis:** Intermediate tool execution statuses (`Searching knowledge base...`, `Calculating...`) stream to the client via SSE, followed by incremental response tokens.
> 7. **Storage & Purging:** When files are uploaded or deleted, `DocumentManager` synchronizes `manifest.json` and reconstructs the FAISS vector index, guaranteeing vector consistency."

---

## 45. Key Terms Glossary

- **LLM (Large Language Model):** Deep learning transformer model trained on massive text corpora to generate natural language.
- **RAG (Retrieval-Augmented Generation):** Architecture combining information retrieval with LLM generation to answer queries grounded in private data.
- **Embedding:** Dense numerical vector representation capturing the semantic meaning of text.
- **FAISS (Facebook AI Similarity Search):** C++ library optimized for efficient dense vector similarity search.
- **AST (Abstract Syntax Tree):** Tree representation of source code structure used by NuraVault to safely evaluate mathematical operations.
- **SSE (Server-Sent Events):** Unidirectional HTTP streaming protocol enabling servers to push real-time events to browsers.

---

## 46. Master System Diagram

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER                                     |
|                                                                                       |
|  +---------------------+   +-----------------------+   +---------------------------+  |
|  |  Chat Workspace UI  |   |  Knowledge Base UI    |   |  ChatGPT Code Blocks      |  |
|  |  (Live Tool Badges) |   |  (Upload & Deletion)  |   |  (Syntax & Copy Action)   |  |
|  +---------------------+   +-----------------------+   +---------------------------+  |
+---------------------------------------------------------------------------------------+
                                        â”‚               â–²
          HTTP POST /chat/stream        â”‚               â”‚ SSE Event Stream
          HTTP POST /upload             â”‚               â”‚ (Status, Tokens, Citations)
          HTTP DELETE /documents        â–¼               â”‚
+---------------------------------------------------------------------------------------+
|                                  FASTAPI SERVER                                       |
|                                                                                       |
|  +---------------------------------------------------------------------------------+  |
|  |                      CORS Middleware & Pydantic Validation                      |  |
|  +---------------------------------------------------------------------------------+  |
|                                           â”‚                                           |
|       â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”       |
|       â–¼                                   â–¼                                   â–¼       |
| +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+           +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+           +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+ |
| |  Conversation API |           |  Chat Stream API  |           |   Documents API   | |
| +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+           +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+           +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+ |
|       â”‚                                   â”‚                                   â”‚       |
|       â–¼                                   â–¼                                   â–¼       |
| +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+           +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+           +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+ |
| | ConversationSvc   |           |    Neural Agent   |           |  DocumentManager  | |
| | (SQLite DB CRUD)  |           |  (Tool Router)    |           | (Manifest & Sync) | |
| +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+           +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+           +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+ |
|       â”‚                                   â”‚                                   â”‚       |
|       â–¼                            â”Œâ”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”                            â–¼       |
| +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+              â–¼             â–¼                      +-----------+ |
| |  SQLite Database  |     +--------------+ +---------------+            | Raw Files | |
| | (brain_memory.db) |     |  Calculator  | |   RAG Tool    |            |  (data/)  | |
| +â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€+     |  (Safe AST)  | | (Retriever)   |            +-----------+ |
|                           +--------------+ +---------------+                  â”‚       |
|                                                    â”‚                          â”‚       |
|                                                    â–¼                          â–¼       |
|                                            +---------------+            +-----------+ |
|                                            | FAISS Vector  |â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€| Embeddings| |
|                                            | (index.faiss) |            | (MiniLM)  | |
|                                            +---------------+            +-----------+ |
+---------------------------------------------------------------------------------------+
```

---

## 47. How Everything Connects: The Complete Story

From the moment a user opens **NuraVault**, every component functions as part of a unified, production-ready system:

1. **Initialization:** The React frontend checks backend connectivity via `GET /health`. The FastAPI backend initializes SQLite tables in `vectorstore/brain_memory.db` and loads the FAISS index from disk.
2. **Conversation Selection:** The user selects or creates a conversation session. `ConversationService` loads previous messages from SQLite into the chat window.
3. **User Query:** The user submits a question. The frontend immediately updates the UI optimistically and opens an SSE stream to `POST /chat/stream`.
4. **Memory Injection:** `MemoryService` retrieves the last 10 messages from SQLite and formats them into conversational context.
5. **Intelligent Routing:** `NeuralAgent` evaluates the input. If the user asks a mathematical question, it routes to `SafeCalculatorTool`. If the user asks about uploaded files, it routes to `RAGSearchTool`. If it is a general greeting, it generates a direct response.
6. **Real-time Feedback:** As tools execute, the backend pushes SSE `status` messages (`"Searching knowledge base..."`, `"Calculating..."`), displaying animated thinking badges in the UI.
7. **Streaming Generation:** The LLM streams answer tokens over the SSE connection. The React frontend renders markdown formatting and syntax-highlighted code blocks in real time.
8. **Persistence:** Once streaming finishes, the backend commits the complete interaction, reference citations, and tool usage metadata to SQLite, preserving state across server restarts.

