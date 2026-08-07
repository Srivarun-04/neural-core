from langchain_community.document_loaders import TextLoader

loader = TextLoader("notes.txt")

documents = loader.load()

print(documents)

print("\nPage Content:\n")
print(documents[0].page_content)

print("\nMetadata:\n")
print(documents[0].metadata)