"""Minimal task manager API (Flask, in-memory store)."""

from flask import Flask, jsonify, request

app = Flask(__name__)

_tasks = {}
_next_id = 1


@app.post("/api/tasks")
def create_task():
    data = request.get_json(silent=True) or {}
    title = data.get("title")
    if not isinstance(title, str) or not title.strip():
        return jsonify({"error": "title is required"}), 400

    global _next_id
    task = {"id": _next_id, "title": title, "done": False}
    _tasks[_next_id] = task
    _next_id += 1
    return jsonify(task), 201


@app.get("/api/tasks")
def list_tasks():
    return jsonify(list(_tasks.values()))


@app.get("/api/tasks/<int:task_id>")
def get_task(task_id: int):
    task = _tasks.get(task_id)
    if task is None:
        return jsonify({"error": "not found"}), 404
    return jsonify(task)


@app.patch("/api/tasks/<int:task_id>")
def update_task(task_id: int):
    task = _tasks.get(task_id)
    if task is None:
        return jsonify({"error": "not found"}), 404

    data = request.get_json(silent=True) or {}
    if "done" in data:
        if not isinstance(data["done"], bool):
            return jsonify({"error": "done must be a boolean"}), 400
        task["done"] = data["done"]

    return jsonify(task), 200


if __name__ == "__main__":
    app.run(debug=True)
