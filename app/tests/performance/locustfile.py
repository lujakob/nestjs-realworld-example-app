import time
import json
from locust import HttpUser, task, between


class QuickstartUser(HttpUser):
    wait_time = between(1, 2.5)

    def __init__(self, parent):
        super(QuickstartUser, self).__init__(parent)

        self.headers = {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
        self.token = ""

    @task(3)
    def get_articles(self):
        self.client.get("/api/articles", headers=self.headers)

    @task
    def create_article(self):

        payload = json.dumps({
            "article": {
                "title": "How to train your dragon",
                "description": "Ever wonder how?",
                "body": "Very carefully.",
                "tagList": [
                    "dragons",
                    "training"
                ]
            }
        })
        self.client.post("/api/articles", payload, headers=self.headers)

    def on_start(self):
        # Register a new user
        response = self.client.post("/api/users", json={
            "user": {
                "email": "test@example.com",
                "password": "testpassword",
                "username": "testuser"
            }
        }, headers=self.headers)

        # Login with the new user
        response = self.client.post("/api/users/login", json={"user": {
            "email": "test@example.com",
            "password": "testpassword"}}, headers=self.headers)
        # Set the token in the headers for all the runs
        self.token = json.loads(response.content)['user']['token']
        self.headers['Authorization'] = 'Token ' + self.token
