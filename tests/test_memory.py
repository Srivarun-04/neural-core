import unittest
import tempfile
import os
from backend.database.sqlite_db import DatabaseManager
from backend.services.conversation_service import ConversationService
from backend.services.memory_service import MemoryService

class TestMemoryService(unittest.TestCase):
    def test_sliding_window_memory(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            db_path = os.path.join(tmpdir, "test_memory.db")
            db = DatabaseManager(db_path=db_path)
            db.init_db()

            conv_service = ConversationService(db)
            memory_service = MemoryService(conv_service, max_messages=4)

            # Create session
            session = conv_service.create_chat("Memory Unit Test")
            chat_id = session.id

            # Add 6 messages
            for i in range(1, 7):
                role = "user" if i % 2 != 0 else "assistant"
                conv_service.add_message(chat_id, role, f"Message {i}")

            # Test sliding window limit (should return only last 4 messages)
            history = memory_service.get_sliding_history(chat_id)
            self.assertEqual(len(history), 4)
            self.assertEqual(history[0]["content"], "Message 3")
            self.assertEqual(history[-1]["content"], "Message 6")

            formatted_text = memory_service.get_formatted_history_text(chat_id)
            self.assertIn("User: Message 3", formatted_text)
            self.assertIn("Assistant: Message 6", formatted_text)

if __name__ == "__main__":
    unittest.main()
