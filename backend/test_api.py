import os
import tempfile
import unittest

from app import create_app

GOOD_POST = {"title": "Hello", "author": "Ann", "content": "First post body."}


class PostApiTests(unittest.TestCase):
    def setUp(self):
        fd, self.db_path = tempfile.mkstemp()
        os.close(fd)
        self.app = create_app({"TESTING": True, "DATABASE": self.db_path})
        self.client = self.app.test_client()

    def tearDown(self):
        if os.path.exists(self.db_path):
            os.remove(self.db_path)

    def create(self, **overrides):
        payload = dict(GOOD_POST)
        payload.update(overrides)
        return self.client.post("/api/posts", json=payload)

    def test_create_and_list(self):
        res = self.create()
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.get_json()["title"], "Hello")
        listing = self.client.get("/api/posts").get_json()
        self.assertEqual(len(listing), 1)

    def test_create_requires_fields(self):
        res = self.client.post("/api/posts", json={"title": "Only a title"})
        self.assertEqual(res.status_code, 400)
        errors = res.get_json()["errors"]
        self.assertIn("author", errors)
        self.assertIn("content", errors)

    def test_title_length_limit(self):
        res = self.create(title="x" * 121)
        self.assertEqual(res.status_code, 400)

    def test_get_one_and_missing(self):
        post_id = self.create().get_json()["id"]
        self.assertEqual(self.client.get(f"/api/posts/{post_id}").status_code, 200)
        missing = self.client.get("/api/posts/999")
        self.assertEqual(missing.status_code, 404)
