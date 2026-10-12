"""Tests for the task manager API (US-TM-001: mark a task as done)."""

import pytest

from main import _reset_state, app


@pytest.fixture
def client():
    _reset_state()
    with app.test_client() as test_client:
        yield test_client
    _reset_state()


def _create_task(client, title="Buy milk"):
    response = client.post("/api/tasks", json={"title": title})
    assert response.status_code == 201
    return response.get_json()


def test_create_task(client):
    task = _create_task(client, "Write report")
    assert task["title"] == "Write report"
    assert task["done"] is False
    assert "id" in task


def test_list_tasks(client):
    _create_task(client, "Task A")
    _create_task(client, "Task B")

    response = client.get("/api/tasks")
    assert response.status_code == 200
    titles = [task["title"] for task in response.get_json()]
    assert titles == ["Task A", "Task B"]


def test_mark_task_done(client):
    task = _create_task(client)

    response = client.patch(f"/api/tasks/{task['id']}", json={"done": True})

    assert response.status_code == 200
    body = response.get_json()
    assert body["done"] is True
    assert body["id"] == task["id"]
    assert body["title"] == task["title"]


def test_mark_task_not_done(client):
    task = _create_task(client)
    client.patch(f"/api/tasks/{task['id']}", json={"done": True})

    response = client.patch(f"/api/tasks/{task['id']}", json={"done": False})

    assert response.status_code == 200
    assert response.get_json()["done"] is False


def test_patch_nonexistent_task_returns_404(client):
    response = client.patch("/api/tasks/999", json={"done": True})

    assert response.status_code == 404
    assert response.get_json() == {"error": "not found"}


def test_get_tasks_reflects_updated_done_flag(client):
    task = _create_task(client)
    client.patch(f"/api/tasks/{task['id']}", json={"done": True})

    response = client.get("/api/tasks")

    assert response.status_code == 200
    tasks = response.get_json()
    updated = next(t for t in tasks if t["id"] == task["id"])
    assert updated["done"] is True
