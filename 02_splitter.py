from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

loader = TextLoader("notes.txt")
documents = loader.load()

splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=50,
)

chunks = splitter.split_documents(documents)

print(f"Total Chunks: {len(chunks)}")

for i, chunk in enumerate(chunks, start=1):
    print("=" * 60)
    print(f"Chunk {i}")
    print(chunk.page_content)