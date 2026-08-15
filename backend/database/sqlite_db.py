import sqlite3
import os
from contextlib import contextmanager
from backend.config.settings import SQLITE_DB_PATH

class DatabaseManager:
    """
    SQLite Database Manager for persisting Neural Core chats and message histories.
    """

    def __init__(self, db_path: str = SQLITE_DB_PATH):
        self.db_path = db_path
        self._ensure_db_dir()

    def _ensure_db_dir(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)

    @contextmanager
    def get_connection(self):
        """Context manager for SQLite database connection that automatically closes on exit."""
        conn = sqlite3.connect(self.db_path, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        try:
            yield conn
        finally:
            conn.close()

    def init_db(self):
        """Creates tables for chats and messages if they do not exist, and ensures schema columns."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # Create Chats Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS chats (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
            """)

            # Create Messages Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    id TEXT PRIMARY KEY,
                    chat_id TEXT NOT NULL,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    sources TEXT,
                    tools_used TEXT,
                    model TEXT,
                    latency REAL,
                    FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
                );
            """)

            # Migration check: Ensure tools_used column exists for pre-existing tables
            try:
                cursor.execute("SELECT tools_used FROM messages LIMIT 1;")
            except sqlite3.OperationalError:
                try:
                    cursor.execute("ALTER TABLE messages ADD COLUMN tools_used TEXT;")
                except Exception:
                    pass

            conn.commit()
            print(f"[DATABASE] SQLite database initialized at {self.db_path}")

db_manager = DatabaseManager()
