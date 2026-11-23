import pytest

import app as app_module


@pytest.fixture
def client():
    app_module._tasks.clear()
    app_module._next_id = 1
    app_module.app.config["TESTING"] = True
    with app_module.app.test_client() as client:
        yield client


def _create_task(client, title="Buy milk"):
    return client.post("/api/tasks", json={"title": title})


def test_create_and_list_tasks(client):
    resp = _create_task(client)
    assert resp.status_code == 201
    assert resp.get_json()["title"] == "Buy milk"
    assert resp.get_json()["done"] is False

    listed = client.get("/api/tasks")
    assert listed.status_code == 200
    assert len(listed.get_json()) == 1


def test_mark_task_done(client):
    created = _create_task(client).get_json()
    task_id = created["id"]

    resp = client.patch(f"/api/tasks/{task_id}", json={"done": True})
    assert resp.status_code == 200
    body = resp.get_json()
    assert body["done"] is True
    assert body["id"] == task_id
    assert body["title"] == "Buy milk"

    listed = client.get("/api/tasks").get_json()
    assert listed[0]["done"] is True


def test_patch_nonexistent_task_returns_404(client):
    resp = client.patch("/api/tasks/999", json={"done": True})
    assert resp.status_code == 404
