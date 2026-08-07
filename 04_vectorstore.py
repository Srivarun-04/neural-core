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
    documents=chunks,
    embedding=embeddings,
)

query = input("Ask: ")

results = vector_store.similarity_search(
    query,
    k=3,
)

for i, doc in enumerate(results, start=1):
    print("=" * 60)
    print(f"Chunk {i}")
    print(doc.page_content)