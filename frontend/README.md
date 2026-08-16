# NuraVault Frontend 🎨⚡

> **React 19 + TypeScript Single-Page Application for NuraVault**

NuraVault's frontend is a responsive, type-safe workspace interface designed for AI conversations, multi-document retrieval (RAG), tool execution badges, and knowledge management.

---

## 🚀 Features

- **React 19 & Vite 8**: Fast HMR development and optimized production bundling.
- **Real-Time Token Streaming**: Server-Sent Events (SSE) streaming with live tool-calling state transitions (`"Searching knowledge base..."`, `"Calculating..."`, `"Generating response..."`).
- **Knowledge Vault Dashboard**: Upload documents (PDF, TXT, DOCX, Markdown), view indexed chunk stats, and manage file lifecycles with instant re-indexing.
- **Persistent Multi-Chat Workspace**: SQLite-backed session management with create, select, inline rename, and delete capabilities.
- **Aesthetic Dual-Theme Engine**: Dark mode and off-white light mode with zero-flash persistence.
- **Rich Message Presentation**: Markdown formatting, syntax-highlighted code blocks with copy-to-clipboard, source citations with direct snippet previews, and 👍 / 👎 response feedback.

---

## 🛠️ Development & Build

### Prerequisites
- Node.js 18+
- npm (or yarn / pnpm)

### Install Dependencies
```bash
npm install
```

### Run Locally
```bash
npm run dev
```
The app will start at `http://localhost:5173`.

### Build for Production
```bash
npm run build
```

---

## 📁 Structure

```
frontend/src/
├── components/
│   ├── Chat/          # ChatArea and welcome screen
│   ├── Header/        # Navbar, status indicator & theme toggle
│   ├── Input/         # MessageInput textarea with auto-resize
│   ├── KnowledgeBase/ # Document vault dashboard & drag-and-drop uploader
│   ├── Message/       # MessageItem, MarkdownRenderer & CodeBlock
│   ├── Sidebar/       # Multi-conversation drawer & search
│   └── common/        # NuraVaultLogo SVG brand icon
├── hooks/             # useChat state & streaming lifecycle hook
├── services/          # api.ts (REST endpoints & SSE stream parser)
├── types/             # TypeScript data contracts & schemas
└── utils/             # storage.ts (localStorage helpers)
```
