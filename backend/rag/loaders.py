import os
from typing import List
from langchain_core.documents import Document
from langchain_community.document_loaders import TextLoader

class DocumentLoaderFactory:
    """
    Extensible Document Loader Factory supporting TXT, Markdown, PDF, and DOCX.
    """

    @staticmethod
    def load_document(file_path: str) -> List[Document]:
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext in ['.txt', '.md']:
            loader = TextLoader(file_path, encoding='utf-8')
            return loader.load()

        elif ext == '.pdf':
            try:
                from langchain_community.document_loaders import PyPDFLoader
                loader = PyPDFLoader(file_path)
                return loader.load()
            except ImportError:
                print(f"[LOADER WARNING] pypdf not installed. Please install pypdf to load PDF files.")
                raise ImportError("pypdf is required for loading PDF files. Install via `pip install pypdf`.")

        elif ext == '.docx':
            try:
                from langchain_community.document_loaders import Docx2txtLoader
                loader = Docx2txtLoader(file_path)
                return loader.load()
            except ImportError:
                print(f"[LOADER WARNING] docx2txt not installed. Please install docx2txt to load DOCX files.")
                raise ImportError("docx2txt is required for loading DOCX files. Install via `pip install docx2txt`.")

        else:
            raise ValueError(f"Unsupported document format: {ext}")

    @staticmethod
    def is_supported(file_path: str) -> bool:
        ext = os.path.splitext(file_path)[1].lower()
        return ext in ['.txt', '.md', '.pdf', '.docx']
