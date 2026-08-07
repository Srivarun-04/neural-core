from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

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

query = input("Ask: ")

docs = retriever.invoke(query)

for i, doc in enumerate(docs, start=1):
    print("=" * 60)
    print(f"Retrieved Chunk {i}")
    print(doc.page_content)