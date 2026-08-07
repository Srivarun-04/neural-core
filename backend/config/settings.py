import os
from dotenv import load_dotenv

# Base Directory (Project Root)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load .env file
dotenv_path = os.path.join(BASE_DIR, '.env')
load_dotenv(dotenv_path=dotenv_path)

# API Keys & Credentials
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

# Directory Paths
DATA_DIR = os.path.join(BASE_DIR, "data")
VECTORSTORE_DIR = os.path.join(BASE_DIR, "vectorstore")
MANIFEST_PATH = os.path.join(VECTORSTORE_DIR, "manifest.json")

# Ensure required directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(VECTORSTORE_DIR, exist_ok=True)

# RAG Settings
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
CHUNK_SIZE = 300
CHUNK_OVERLAP = 50
RETRIEVAL_K = 3
LLM_MODEL = "openrouter/free"
