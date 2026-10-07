---
story_id: "TM.4"
story_key: "US-TM-004"
epic: 1
title: Better Task Organization
status: ready-for-dev
priority: medium
effort: M
depends_on: []
blocks: []
project: task-manager
date: 2026-09-24
---

# Story TM.4 — Better Task Organization

## Story Statement

**As a** user,
**I want** to organize my tasks better,
**So that** I can find and focus on what matters most as my list grows.

---

## Background & Context

Feedback from early users of the task manager has been mixed and somewhat
contradictory. Some have asked for folders/projects to group related tasks;
others just want a quick way to flag "important" items without extra
structure; a couple of comments mentioned wanting due dates instead of, or
in addition to, any grouping. Nobody has signed off on a single direction
yet, and there's no existing design doc, data model, or wireframe for this —
product hasn't prioritized settling it because "it's a small app, just make
it better."

**What we know:**
- The task list is currently one flat, unordered collection (see `app.py`).
- Users want *some* way to tell important/related tasks apart as the list
  grows past a handful of items.
- The API should keep supporting filtering or sorting so the organization
  scheme (whatever it ends up being) is actually usable, not just stored.

**What's deliberately left open:**
- Whether "organization" means categories, tags, priority levels, due dates,
  or something else.
- Whether this is a client-only presentational feature or requires new
  fields/endpoints on the backend.
- The exact shape of any new API fields or query parameters.

---

## Acceptance Criteria

1. Users can group or categorize their tasks in some way.
2. The API supports filtering and/or sorting the task list based on that
   organization scheme.
3. The feature is easy and intuitive to use — no specific UX has been
   agreed on.
4. Existing functionality (create, list, get by id, mark done, and any other
   endpoints already shipped) keeps working as before.
5. Tests are added for whatever is built.

---

## Notes

- No specific data model, endpoint shapes, or UI changes have been agreed
  on yet — use your best judgment for the details, and document the
  decisions you make since there's no prior design to point back to.
- If requirements conflict or are underspecified during implementation,
  prefer the smallest change that satisfies AC1–AC5 over a larger redesign.

---

## Dependencies

**Depends on:** None

**Blocks:** None

---

## Definition of Done

- [ ] AC1–AC5 satisfied by some concrete implementation choice.
- [ ] Existing tests continue to pass; new tests cover the organization
      feature as implemented.
- [ ] The chosen approach (data model, endpoints, or UI behavior) is
      documented somewhere in the change (code comments or a short note)
      since no prior spec exists to reference.
