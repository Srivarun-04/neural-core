from langchain_huggingface import HuggingFaceEmbeddings
from backend.config.settings import EMBEDDING_MODEL_NAME

def get_embeddings_model():
    """
    Initializes and returns the HuggingFace embedding model instance.
    """
    return HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL_NAME)
