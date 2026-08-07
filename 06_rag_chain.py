from dotenv import load_dotenv
import os

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

load_dotenv()

llm = ChatOpenAI(
    model="openrouter/free",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)

loader = TextLoader("notes.txt")
documents = loader.load()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=50,
)

chunks = splitter.split_documents(documents)

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

vector_store = FAISS.from_documents(
    chunks,
    embeddings,
)

retriever = vector_store.as_retriever(
    search_kwargs={"k": 3}
)

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

while True:

    question = input("\nYou: ")

    if question.lower() in ["exit", "quit", "bye"]:
        break

    docs = retriever.invoke(question)

    context = "\n\n".join(
        doc.page_content for doc in docs
    )

    chain = prompt | llm

    response = chain.invoke(
        {
            "context": context,
            "question": question,
        }
    )
    print(f"\n AI: {response.content}\n\n\n Context: {context}")
