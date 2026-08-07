from typing import Generator
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from backend.config.settings import OPENROUTER_API_KEY, LLM_MODEL

class RAGChain:
    """
    Encapsulates the LCEL chain (Prompt Template + OpenRouter Chat LLM)
    with conversational memory support and token streaming capabilities.
    """
    def __init__(self):
        self.llm = ChatOpenAI(
            model=LLM_MODEL,
            api_key=OPENROUTER_API_KEY,
            base_url="https://openrouter.ai/api/v1",
            streaming=True,
            temperature=0.7,
        )
        
        self.prompt = ChatPromptTemplate.from_template(
            """
You are AI Brain, an intelligent, helpful, and articulate AI Operating System assistant.

Your goal is to provide precise, natural, and insightful responses by combining conversational history, general knowledge, and retrieved document context.

Guidelines:
1. Conversational Continuity: Remember previous details mentioned in the Conversation History (e.g., user names, prior questions, context).
2. Document Context: When Relevant Document Context is present, utilize it to give grounded, accurate answers regarding stored documents and data.
3. Flexibility: If the question is conversational or general (e.g., "My name is Varun", "What is my name?", "How are you?"), answer naturally using conversation history and general knowledge.
4. Structure & Clarity: Keep your answers clear, elegant, and well-structured with GitHub-style markdown formatting.

Conversation History:
{chat_history}

Relevant Document Context:
{context}

Current User Question:
{question}
"""
        )
        self.chain = self.prompt | self.llm

    def generate_response(self, context: str, question: str, chat_history: str = "") -> str:
        """
        Executes the chain synchronously and returns complete string response.
        """
        response = self.chain.invoke({
            "chat_history": chat_history or "No previous conversation history.",
            "context": context or "No relevant documents found.",
            "question": question
        })
        return response.content

    def stream_response(self, context: str, question: str, chat_history: str = "") -> Generator[str, None, None]:
        """
        Executes the chain in streaming mode, yielding token strings sequentially.
        """
        for chunk in self.chain.stream({
            "chat_history": chat_history or "No previous conversation history.",
            "context": context or "No relevant documents found.",
            "question": question
        }):
            if chunk.content:
                yield chunk.content
