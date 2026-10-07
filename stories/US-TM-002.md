---
story_id: "TM.2"
story_key: "US-TM-002"
epic: 1
title: Web UI for Managing Tasks
status: ready-for-dev
priority: high
effort: M
depends_on: ["US-TM-001"]
blocks: []
project: task-manager
date: 2026-09-24
---

# Story TM.2 — Web UI for Managing Tasks

## Story Statement

**As a** user,
**I want** a web page that lists my tasks and lets me add new ones and mark
them done,
**So that** I don't need to call the API manually (curl/Postman) to manage
my tasks.

---

## Background & Context

The task manager currently only exposes a JSON API — `GET /api/tasks`,
`POST /api/tasks`, `GET /api/tasks/{id}`, and `PATCH /api/tasks/{id}` (added
in US-TM-001 for the `done` flag). There is no browser-facing surface at
all; the only way to use the app today is direct HTTP calls.

This story adds a single-page HTML UI, served by the same Flask app, that
consumes the existing JSON API from client-side JavaScript (no new backend
frameworks, no server-side templating logic beyond serving one page).

**What this story covers:**
- A root page (`GET /`) that renders the current task list.
- Adding a task and toggling its `done` state from the browser.

**What this story does NOT cover:**
- Deleting tasks from the UI (no delete endpoint exists yet — see US-TM-003).
- Any visual design system, CSS framework, or theming.
- Authentication, multi-user separation, or persistent storage.

**Architecture note:** Keep the frontend static and dependency-free (plain
HTML/CSS/`fetch`) — do not introduce a JS build step, bundler, or frontend
framework for a single page backed by an in-memory Flask app.

---

## Acceptance Criteria

### AC1 — Serve the Page
- [ ] `GET /` returns an HTML page with status `200`.
- [ ] The page is served via Flask (e.g. `render_template` from a
      `templates/` folder, with static assets in `static/`).
- [ ] The page includes a container element the tests can assert against
      (e.g. `<div id="tasks">`).

### AC2 — List Tasks
- [ ] On page load, client-side JS calls `GET /api/tasks` and renders each
      task's `title` with a checkbox reflecting its `done` state.
- [ ] An empty task list renders a friendly "No tasks yet" state instead of
      a blank container.

### AC3 — Toggle Done State
- [ ] Checking/unchecking a task's checkbox calls
      `PATCH /api/tasks/{id}` with `{"done": <bool>}`.
- [ ] On success, the UI reflects the updated state without a full page
      reload.
- [ ] On failure (e.g. network error), the checkbox reverts to its previous
      state and an inline error is shown.

### AC4 — Add a Task
- [ ] A text input plus "Add" button calls `POST /api/tasks` with the
      entered title.
- [ ] On success, the input is cleared and the new task appears in the list
      without a full page reload.
- [ ] Submitting an empty/whitespace-only title is blocked client-side
      (button disabled or no-op) — the browser never sends a request for an
      empty title.

### AC5 — Error Handling
- [ ] If `POST /api/tasks` returns a `400` (e.g. race condition), the page
      shows an inline error message instead of a blank/broken state.
- [ ] Errors do not clear the rest of the already-rendered task list.

### AC6 — Tests
- [ ] All existing tests continue to pass.
- [ ] At least one new test verifies `GET /` returns `200` and the response
      body contains the expected root element/container.

---

## Technical Notes

**Suggested new files:**
```
templates/
└── index.html          # Root page markup + container for the task list
static/
├── app.js               # fetch() calls to /api/tasks, render + event wiring
└── style.css            # Minimal styling (optional)
```

**Flask route addition (`app.py`):**
```python
from flask import render_template

@app.get("/")
def index():
    return render_template("index.html")
```

No changes to existing API endpoints are required — this story is purely
additive.

---

## Dependencies

**Depends on:**
- US-TM-001 — `PATCH /api/tasks/{id}` must exist for the "mark done"
  checkbox to work.

**Blocks:** None

---

## Definition of Done

- [ ] All 6 acceptance criteria implemented and passing.
- [ ] `GET /` serves the page and existing API endpoints are untouched.
- [ ] Add/toggle flows work end-to-end against the running Flask app.
- [ ] New and existing tests pass (`pytest tests/ -v`).
- [ ] No new dependencies added beyond what's in `requirements.txt` unless
      strictly necessary (e.g. Flask's built-in `render_template`/Jinja2
      already available — no extra install needed).
