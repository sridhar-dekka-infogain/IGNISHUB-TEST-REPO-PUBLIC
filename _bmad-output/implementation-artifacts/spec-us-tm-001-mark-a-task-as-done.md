---
title: 'Mark a task as done'
type: 'feature'
created: '2026-11-23'
status: 'done'
route: 'one-shot'
---

# Mark a task as done

## Intent

**Problem:** The task manager API (`POST /api/tasks`, `GET /api/tasks`) had no
way to mark a task as complete without deleting it.

**Approach:** Add a minimal in-memory Flask task API (`app.py`) plus a
`PATCH /api/tasks/{id}` endpoint that toggles the `done` flag, returning the
updated task or `404` for unknown ids, backed by pytest coverage.

## Suggested Review Order

**Mark-done endpoint**

- Entry point: validates id, accepts `{"done": bool}`, returns updated task or 404.
  [`app.py:38`](../../app.py#L38)

- Underlying task creation/listing the PATCH endpoint builds on.
  [`app.py:11`](../../app.py#L11)

**Tests**

- Covers marking a task done and seeing it reflected in `GET /api/tasks`.
  [`test_app.py:30`](../../tests/test_app.py#L30)

- Covers `PATCH` on a non-existent id returning `404`.
  [`test_app.py:45`](../../tests/test_app.py#L45)
