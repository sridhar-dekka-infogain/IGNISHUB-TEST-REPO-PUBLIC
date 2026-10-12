"""Minimal in-memory task manager API.

Endpoints:
    POST   /api/tasks           -- create a task
    GET    /api/tasks           -- list all tasks
    PATCH  /api/tasks/<id>      -- update the `done` flag on a task
"""

from flask import Flask, jsonify, request

app = Flask(__name__)

# In-memory store: task_id -> task dict. No persistence (by design, see
# US-TM-001 "Out of scope").
_tasks: dict[int, dict] = {}
_next_id = 1


def _reset_state() -> None:
    """Test helper: reset the in-memory store to a clean slate."""
    global _next_id
    _tasks.clear()
    _next_id = 1


@app.post("/api/tasks")
def create_task():
    global _next_id

    payload = request.get_json(silent=True) or {}
    title = payload.get("title")
    if not isinstance(title, str) or not title.strip():
        return jsonify({"error": "title is required"}), 400

    task = {"id": _next_id, "title": title, "done": False}
    _tasks[_next_id] = task
    _next_id += 1
    return jsonify(task), 201


@app.get("/api/tasks")
def list_tasks():
    return jsonify(list(_tasks.values())), 200


@app.patch("/api/tasks/<int:task_id>")
def update_task(task_id: int):
    task = _tasks.get(task_id)
    if task is None:
        return jsonify({"error": "not found"}), 404

    payload = request.get_json(silent=True) or {}
    if "done" not in payload or not isinstance(payload["done"], bool):
        return jsonify({"error": "done (bool) is required"}), 400

    task["done"] = payload["done"]
    return jsonify(task), 200


if __name__ == "__main__":
    app.run(debug=True)
