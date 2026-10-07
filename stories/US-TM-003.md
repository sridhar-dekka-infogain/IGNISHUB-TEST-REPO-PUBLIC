---
story_id: "TM.3"
story_key: "US-TM-003"
epic: 1
title: Delete a Task via the API
status: ready-for-dev
priority: medium
effort: S
depends_on: []
blocks: []
project: task-manager
date: 2026-09-24
---

# Story TM.3 — Delete a Task via the API

## Story Statement

**As a** user,
**I want** to delete a task via the API,
**So that** I can remove tasks I no longer need instead of leaving them in
the list forever.

---

## Background & Context

The task manager API currently supports creating (`POST /api/tasks`),
listing (`GET /api/tasks`), fetching by id (`GET /api/tasks/{id}`), and
updating the `done` flag (`PATCH /api/tasks/{id}`, from US-TM-001). There is
no way to permanently remove a task — once created, it stays in the
in-memory store forever.

**What this story covers:**
- A single `DELETE /api/tasks/{id}` endpoint with standard REST semantics.

**What this story does NOT cover:**
- Any frontend/UI changes (US-TM-002's UI does not need a delete button as
  part of this story).
- Soft-delete, undo, or archival — deletion is permanent and immediate.
- Authentication/authorization — anyone who can call the API can delete any
  task, consistent with the rest of the current API.

This is a backend-only, self-contained change — no dependency on the other
in-flight stories.

---

## Acceptance Criteria

### AC1 — Delete an Existing Task
- [ ] `DELETE /api/tasks/{id}` removes the task with that id from the store.
- [ ] Returns `204 No Content` with an empty body on success.

### AC2 — Delete a Non-Existent Task
- [ ] `DELETE /api/tasks/999` (or any id not present in the store) returns
      `404` with `{"error": "not found"}`.
- [ ] No task is removed as a side effect of a 404 response.

### AC3 — Consistency After Delete
- [ ] After a successful delete, `GET /api/tasks` no longer includes the
      deleted task.
- [ ] `GET /api/tasks/{id}` for the deleted id returns `404`.
- [ ] Deleting one task does not affect other tasks' ids or `done` state.

### AC4 — Regression Safety
- [ ] All existing tests continue to pass.

### AC5 — New Tests
- [ ] At least two new pytest tests cover:
  - Deleting an existing task → `204` response, task absent from a
    subsequent `GET /api/tasks`.
  - Deleting a non-existent task → `404` with the expected error body.

---

## Technical Notes

**Flask route addition (`app.py`):**
```python
@app.delete("/api/tasks/<int:task_id>")
def delete_task(task_id: int):
    if task_id not in _tasks:
        return jsonify({"error": "not found"}), 404
    del _tasks[task_id]
    return "", 204
```

No changes to `_tasks`'s shape or `_next_id` allocation are required —
deleting a task must not reuse or renumber ids.

---

## Dependencies

**Depends on:** None — builds directly on the existing `app.py` API surface.

**Blocks:** None

---

## Definition of Done

- [ ] All 5 acceptance criteria implemented and passing.
- [ ] `DELETE /api/tasks/{id}` behaves per AC1–AC3 for both existing and
      missing ids.
- [ ] Unit tests passing (`pytest tests/ -v`), including the two new cases.
- [ ] No changes to unrelated endpoints' behavior.
