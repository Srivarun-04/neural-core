import uuid
import json
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from backend.database.sqlite_db import DatabaseManager, db_manager
from backend.models.schemas import ChatSessionSchema, MessageSchema, SourceSchema

class ConversationService:
    """
    Manages SQLite CRUD operations for Chat sessions and Messages.
    """

    def __init__(self, db: DatabaseManager = db_manager):
        self.db = db

    def create_chat(self, title: Optional[str] = None) -> ChatSessionSchema:
        chat_id = str(uuid.uuid4())
        now_str = datetime.now(timezone.utc).isoformat()
        chat_title = title.strip() if title and title.strip() else "New Conversation"

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO chats (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
                (chat_id, chat_title, now_str, now_str)
            )
            conn.commit()

        return ChatSessionSchema(
            id=chat_id,
            title=chat_title,
            created_at=now_str,
            updated_at=now_str,
            messages=[]
        )

    def list_chats(self) -> List[ChatSessionSchema]:
        chats = []
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, title, created_at, updated_at FROM chats ORDER BY updated_at DESC")
            rows = cursor.fetchall()
            for row in rows:
                chats.append(ChatSessionSchema(
                    id=row["id"],
                    title=row["title"],
                    created_at=row["created_at"],
                    updated_at=row["updated_at"],
                    messages=[]
                ))
        return chats

    def get_chat(self, chat_id: str, include_messages: bool = True) -> Optional[ChatSessionSchema]:
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, title, created_at, updated_at FROM chats WHERE id = ?", (chat_id,))
            row = cursor.fetchone()
            if not row:
                return None

            messages = []
            if include_messages:
                messages = self.get_messages(chat_id)

            return ChatSessionSchema(
                id=row["id"],
                title=row["title"],
                created_at=row["created_at"],
                updated_at=row["updated_at"],
                messages=messages
            )

    def rename_chat(self, chat_id: str, new_title: str) -> Optional[ChatSessionSchema]:
        now_str = datetime.now(timezone.utc).isoformat()
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE chats SET title = ?, updated_at = ? WHERE id = ?",
                (new_title.strip(), now_str, chat_id)
            )
            if cursor.rowcount == 0:
                return None
            conn.commit()

        return self.get_chat(chat_id)

    def delete_chat(self, chat_id: str) -> bool:
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM chats WHERE id = ?", (chat_id,))
            deleted = cursor.rowcount > 0
            conn.commit()
            return deleted

    def add_message(
        self,
        chat_id: str,
        role: str,
        content: str,
        sources: Optional[List[Dict[str, Any]]] = None,
        model: Optional[str] = None,
        latency: Optional[float] = None
    ) -> MessageSchema:
        message_id = str(uuid.uuid4())
        now_str = datetime.now(timezone.utc).isoformat()
        sources_json = json.dumps(sources) if sources else None

        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            # Ensure chat exists; if not, create it
            cursor.execute("SELECT id FROM chats WHERE id = ?", (chat_id,))
            if not cursor.fetchone():
                cursor.execute(
                    "INSERT INTO chats (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)",
                    (chat_id, "New Conversation", now_str, now_str)
                )

            # Insert message
            cursor.execute(
                """
                INSERT INTO messages (id, chat_id, role, content, timestamp, sources, model, latency)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (message_id, chat_id, role, content, now_str, sources_json, model, latency)
            )

            # Touch chat updated_at
            cursor.execute(
                "UPDATE chats SET updated_at = ? WHERE id = ?",
                (now_str, chat_id)
            )
            conn.commit()

        parsed_sources = [SourceSchema(**s) for s in sources] if sources else []
        return MessageSchema(
            id=message_id,
            chat_id=chat_id,
            role=role,
            content=content,
            timestamp=now_str,
            sources=parsed_sources,
            model=model,
            latency=latency
        )

    def get_messages(self, chat_id: str, limit: Optional[int] = None) -> List[MessageSchema]:
        messages = []
        with self.db.get_connection() as conn:
            cursor = conn.cursor()
            if limit:
                query = """
                    SELECT * FROM (
                        SELECT id, chat_id, role, content, timestamp, sources, model, latency
                        FROM messages
                        WHERE chat_id = ?
                        ORDER BY timestamp DESC
                        LIMIT ?
                    ) ORDER BY timestamp ASC
                """
                cursor.execute(query, (chat_id, int(limit)))
            else:
                query = """
                    SELECT id, chat_id, role, content, timestamp, sources, model, latency
                    FROM messages
                    WHERE chat_id = ?
                    ORDER BY timestamp ASC
                """
                cursor.execute(query, (chat_id,))

            rows = cursor.fetchall()
            for row in rows:
                sources_raw = row["sources"]
                sources_list = []
                if sources_raw:
                    try:
                        sources_list = [SourceSchema(**s) for s in json.loads(sources_raw)]
                    except Exception:
                        sources_list = []

                messages.append(MessageSchema(
                    id=row["id"],
                    chat_id=row["chat_id"],
                    role=row["role"],
                    content=row["content"],
                    timestamp=row["timestamp"],
                    sources=sources_list,
                    model=row["model"],
                    latency=row["latency"]
                ))
        return messages
