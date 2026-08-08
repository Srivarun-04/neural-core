import os
from dotenv import load_dotenv

# Base Directory (Project Root)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load .env file
dotenv_path = os.path.join(BASE_DIR, '.env')
load_dotenv(dotenv_path=dotenv_path)

# API Keys & Credentials
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY") or ""

# Directory Paths
DATA_DIR = os.path.join(BASE_DIR, "data")
VECTORSTORE_DIR = os.path.join(BASE_DIR, "vectorstore")
MANIFEST_PATH = os.path.join(VECTORSTORE_DIR, "manifest.json")
SQLITE_DB_PATH = os.path.join(VECTORSTORE_DIR, "brain_memory.db")

# Ensure required directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(VECTORSTORE_DIR, exist_ok=True)

# RAG & Memory Settings
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
CHUNK_SIZE = 300
CHUNK_OVERLAP = 50
RETRIEVAL_K = 3
LLM_MODEL = "openrouter/free"
MEMORY_MAX_MESSAGES = 10

