---
title: 'US-TM-001 — Mark a Task as Done'
type: 'feature'
created: '2026-10-12'
status: 'done'
route: 'one-shot'
---

# US-TM-001 — Mark a Task as Done

## Intent

**Problem:** The task manager API had no way to mark a task complete without
deleting it, and no backend code existed yet to create/list/update tasks.

**Approach:** Added a minimal Flask app (`main.py`) with an in-memory task
store exposing `POST /api/tasks`, `GET /api/tasks`, and
`PATCH /api/tasks/{id}` (the latter toggling the `done` flag, returning
`404` for unknown ids), plus pytest coverage for the new behavior.

## Suggested Review Order

- Entry point: the API surface and in-memory store.
  [`main.py:26`](../../main.py#L26)

- `PATCH` handler: validates the `done` flag and returns `404` for missing
  tasks — the core of this story.
  [`main.py:46`](../../main.py#L46)

- `GET /api/tasks`: confirms the list reflects updated `done` state.
  [`main.py:41`](../../main.py#L41)

- Tests covering mark-done and 404-on-missing-task, per acceptance
  criteria.
  [`test_tasks.py:44`](../../tests/test_tasks.py#L44)
  [`test_tasks.py:60`](../../tests/test_tasks.py#L60)

- Dependency pin for Flask/pytest.
  [`requirements.txt:1`](../../requirements.txt#L1)
