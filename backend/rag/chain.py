from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from backend.config.settings import OPENROUTER_API_KEY, LLM_MODEL

class RAGChain:
    """
    Encapsulates the LCEL chain (Prompt Template + OpenRouter Chat LLM).
    """
    def __init__(self):
        self.llm = ChatOpenAI(
            model=LLM_MODEL,
            api_key=OPENROUTER_API_KEY,
            base_url="https://openrouter.ai/api/v1",
        )
        self.prompt = ChatPromptTemplate.from_template(
            """
You are an Advisor. Answer based on Token Optimization.

Answer ONLY using the provided context. If the answer is not contained within the context, state that clearly.

Context:
{context}

Question:
{question}
"""
        )
        self.chain = self.prompt | self.llm

    def generate_response(self, context: str, question: str) -> str:
        """
        Executes the chain with context and user question.
        """
        response = self.chain.invoke({
            "context": context,
            "question": question
        })
        return response.content
