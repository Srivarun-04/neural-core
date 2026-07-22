import type { Conversation } from "./types";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "Transformer architecture deep dive",
    lastMessage:
      "The attention mechanism computes a weighted sum of values...",
    timestamp: "2m ago",
    isPinned: true,
    messages: [
      {
        id: "m1-1",
        role: "user",
        content:
          "Can you explain how the transformer attention mechanism works at a low level?",
        timestamp: "10:42 AM",
      },
      {
        id: "m1-2",
        role: "assistant",
        content:
          "The attention mechanism is the core innovation behind transformers. At its heart, it answers the question: \"which parts of the input should I focus on to produce this output?\"\n\nHere's how it works:\n\n**Query, Key, Value**\nEvery token is projected into three vectors — a Query (Q), a Key (K), and a Value (V). The Query represents what the token is looking for. Keys represent what each token can offer. Values hold the actual content.\n\n**Attention Score**\nFor each token, we compute dot products between its Query and every other token's Key. These scores are scaled by √d_k to prevent vanishing gradients, then passed through a softmax to produce a probability distribution.\n\n**Weighted Sum**\nFinally, we take a weighted sum of all Value vectors using those probabilities. This lets each token gather contextual information from any other position — regardless of distance.\n\nThis is what makes transformers so powerful: full attention over the entire sequence in a single operation.",
        timestamp: "10:42 AM",
      },
      {
        id: "m1-3",
        role: "user",
        content:
          "What's the difference between self-attention and cross-attention?",
        timestamp: "10:45 AM",
      },
      {
        id: "m1-4",
        role: "assistant",
        content:
          "Great follow-up. The distinction is about where Q, K, and V come from:\n\n**Self-Attention** — Q, K, and V all come from the same sequence. Each token attends to every other token in the same sequence. This is used in the encoder to build rich contextual representations.\n\n**Cross-Attention** — Q comes from one sequence (e.g., the decoder's current state), while K and V come from a different sequence (e.g., the encoder's output). This is how the decoder learns to ground its generation in the source context — the bridge between encoder and decoder.\n\nIn practice: the encoder stack uses self-attention, the decoder uses both self-attention (on what's been generated so far) and cross-attention (to attend to the encoder output).",
        timestamp: "10:46 AM",
      },
    ],
  },
  {
    id: "conv-2",
    title: "Memory retrieval strategies",
    lastMessage: "Vector similarity search using cosine distance is...",
    timestamp: "1h ago",
    messages: [
      {
        id: "m2-1",
        role: "user",
        content:
          "What are the best strategies for long-term memory retrieval in AI systems?",
        timestamp: "9:15 AM",
      },
      {
        id: "m2-2",
        role: "assistant",
        content:
          "Long-term memory retrieval in AI systems typically combines several complementary strategies:\n\n**Vector Similarity Search**\nEncode memories as embeddings and retrieve by cosine similarity. This handles semantic search well — \"find things related to X\" — but requires a vector database like Pinecone, Weaviate, or pgvector.\n\n**Recency Weighting**\nScore memories by a combination of relevance and recency. More recent memories often carry more context, so a time-decay factor prevents the system from over-indexing on old information.\n\n**Graph-Based Retrieval**\nStore memories as nodes in a knowledge graph with typed relationships. Allows multi-hop reasoning: \"what did the user say about X, and how does that relate to Y?\"\n\n**Hierarchical Summarization**\nAs conversations grow, compress older exchanges into summary nodes. This preserves the gist while reducing retrieval load — similar to how humans remember the meaning of past conversations rather than verbatim transcripts.",
        timestamp: "9:16 AM",
      },
    ],
  },
  {
    id: "conv-3",
    title: "Agent orchestration patterns",
    lastMessage: "ReAct agents interleave reasoning traces with...",
    timestamp: "3h ago",
    messages: [
      {
        id: "m3-1",
        role: "user",
        content:
          "What orchestration patterns work best for autonomous AI agents?",
        timestamp: "7:20 AM",
      },
      {
        id: "m3-2",
        role: "assistant",
        content:
          "The most battle-tested patterns for autonomous agent orchestration are:\n\n**ReAct (Reason + Act)**\nThe agent interleaves reasoning traces (\"I need to look up X\") with tool invocations. This makes the agent's logic transparent and debuggable. Most production agents today use some variant of this.\n\n**Plan-and-Execute**\nSeparate planning from execution. A planner LLM generates a structured plan; an executor agent follows it step by step. Better for long, multi-step tasks where upfront planning reduces costly mid-execution replanning.\n\n**Hierarchical Agents**\nA supervisor agent decomposes tasks and delegates to specialist sub-agents (a researcher, a coder, a summarizer). Each sub-agent has a focused context and tool set. Reduces context bloat and enables parallelism.",
        timestamp: "7:21 AM",
      },
    ],
  },
  {
    id: "conv-4",
    title: "Knowledge graph schema design",
    lastMessage: "For entity-relationship modeling, I'd recommend...",
    timestamp: "Yesterday",
    messages: [
      {
        id: "m4-1",
        role: "user",
        content: "How should I design a schema for an AI knowledge graph?",
        timestamp: "Yesterday",
      },
      {
        id: "m4-2",
        role: "assistant",
        content:
          "For entity-relationship modeling in an AI knowledge graph, I'd recommend starting with three core node types: Entity (nouns — people, concepts, objects), Event (time-bounded occurrences), and Attribute (properties that describe entities). Connect them with typed, directed edges that carry confidence scores and provenance metadata. This gives you enough flexibility to represent most real-world knowledge while keeping the schema tractable.",
        timestamp: "Yesterday",
      },
    ],
  },
  {
    id: "conv-5",
    title: "Tool calling best practices",
    lastMessage: "Structured outputs with JSON schema validation...",
    timestamp: "2 days ago",
    messages: [
      {
        id: "m5-1",
        role: "user",
        content: "What are the best practices for LLM tool calling?",
        timestamp: "2 days ago",
      },
      {
        id: "m5-2",
        role: "assistant",
        content:
          "Structured outputs with JSON schema validation are the foundation. Beyond that: keep tool descriptions concise and action-oriented, limit each tool to a single responsibility, return structured errors rather than unstructured strings so the model can self-correct, and always include a confirmation step before irreversible actions.",
        timestamp: "2 days ago",
      },
    ],
  },
];
