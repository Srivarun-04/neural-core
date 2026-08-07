import unittest
from fastapi.testclient import TestClient
from main import app

class TestChatsEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_session_lifecycle(self):
        # 1. Create Session
        create_res = self.client.post("/chats", json={"title": "Test Suite Session"})
        self.assertEqual(create_res.status_code, 201)
        chat_data = create_res.json()
        chat_id = chat_data["id"]
        self.assertEqual(chat_data["title"], "Test Suite Session")

        # 2. Fetch Session List
        list_res = self.client.get("/chats")
        self.assertEqual(list_res.status_code, 200)
        chats = list_res.json()
        self.assertTrue(any(c["id"] == chat_id for c in chats))

        # 3. Rename Session
        rename_res = self.client.patch(f"/chats/{chat_id}", json={"title": "Renamed Session"})
        self.assertEqual(rename_res.status_code, 200)
        self.assertEqual(rename_res.json()["title"], "Renamed Session")

        # 4. Get Session Details
        get_res = self.client.get(f"/chats/{chat_id}")
        self.assertEqual(get_res.status_code, 200)
        self.assertEqual(get_res.json()["id"], chat_id)

        # 5. Delete Session
        del_res = self.client.delete(f"/chats/{chat_id}")
        self.assertEqual(del_res.status_code, 200)

        # 6. Verify Deletion
        get_after_del = self.client.get(f"/chats/{chat_id}")
        self.assertEqual(get_after_del.status_code, 404)

if __name__ == "__main__":
    unittest.main()
