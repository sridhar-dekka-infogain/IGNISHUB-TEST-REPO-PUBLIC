# US-TM-001 — Mark a task as done

## Context

The task manager API already supports creating and listing tasks (`POST /api/tasks`,
`GET /api/tasks`). Users need a way to mark a task as complete without deleting it.

## Story

**As a** user,
**I want** to mark a task as done via the API,
**so that** I can track which tasks I have completed.

## Acceptance Criteria

1. `PATCH /api/tasks/{id}` accepts `{"done": true}` or `{"done": false}`.
2. On success the endpoint returns `200 OK` with the updated task JSON
   (`id`, `title`, `done`).
3. `PATCH /api/tasks/999` (non-existent id) returns `404`.
4. The existing `GET /api/tasks` list reflects the updated `done` flag.
5. All existing tests continue to pass.
6. At least two new pytest tests cover:
   - Marking a task done → response has `done: true`.
   - Patching a non-existent task → `404`.

## Out of scope

- Persistent storage (in-memory is fine).
- Authentication.
- Deleting tasks.
