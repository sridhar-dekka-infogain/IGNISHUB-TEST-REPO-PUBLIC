# TT-2: Bootstrap ticket intake API — submit and list tickets for triage

| Field | Value |
| --- | --- |
| Issue Type | Story |
| Priority | High |
| Epic | TT-100 — Ticket Triaging Solution (MVP) |
| Component | API / Ticket Intake |
| Story Points | 3 |
| Labels | `agent-eval`, `ticket-triaging`, `rest-api`, `express`, `mvp` |

## Summary

Bootstrap a minimal REST API for the Ticket Triaging Solution: health check, submit support tickets, and list the intake queue.

## User story

**As a** support engineer,  
**I want to** submit support tickets and view the intake queue via a REST API,  
**So that** incoming issues can be collected before automated triage (classification comes in a later story).

## Background / context

This is the first slice of the Ticket Triaging Solution (`ticket-triaging-solution`). The repository may be empty — scaffold a minimal Node.js + Express service from scratch.

Future stories will add:

- Automated classification (defect / configuration / enhancement)
- Priority scoring
- Jira integration

**Stack:** Node.js 20+, Express, built-in `node:test` — no new npm dependencies beyond Express.

## Acceptance criteria

### AC1 — Health check

**Given** the API server is running  
**When** a client sends `GET /health`  
**Then** the response status is `200 OK`  
**And** the body is JSON:

```json
{ "status": "ok" }
```

### AC2 — List tickets (empty initially)

**Given** no tickets have been submitted  
**When** a client sends `GET /api/tickets`  
**Then** the response status is `200 OK`  
**And** the body is a JSON array: `[]`

### AC3 — Submit a ticket

**Given** the API is running  
**When** a client sends `POST /api/tickets` with body:

```json
{
  "title": "Login fails after password reset",
  "description": "Users cannot log in after resetting password via email link.",
  "source": "email"
}
```

**Then** the response status is `201 Created`  
**And** the body is a JSON object:

```json
{
  "id": 1,
  "title": "Login fails after password reset",
  "description": "Users cannot log in after resetting password via email link.",
  "source": "email",
  "status": "new",
  "createdAt": "<ISO-8601 timestamp>"
}
```

**And** `id` is auto-incremented starting from 1.

### AC4 — List tickets after submit

**Given** at least one ticket was created via `POST /api/tickets`  
**When** a client sends `GET /api/tickets`  
**Then** the response status is `200 OK`  
**And** the body is a JSON array containing all tickets with fields: `id`, `title`, `description`, `source`, `status`, `createdAt`.

### AC5 — Validation on submit

**Given** the API is running  
**When** a client sends `POST /api/tickets` with any of:

- missing or empty `title`
- missing or empty `description`
- missing `source`
- `source` not one of: `email`, `portal`, `chat`

**Then** the response status is `400 Bad Request`  
**And** the body is JSON: `{ "error": "<descriptive message>" }`

### AC6 — Project scaffold and automated tests

**Given** the implementation is complete  
**When** `npm test` is run from the repository root  
**Then** all tests pass, including:

| File | Coverage |
| --- | --- |
| `test/health.test.js` | Health endpoint |
| `test/tickets.test.js` | List, create, and validation scenarios |

**And** the repository contains at minimum:

| File | Purpose |
| --- | --- |
| `package.json` | `"test": "node --test test/*.test.js"` |
| `src/index.js` | Express app entry (listen on `PORT` env or `3000`) |
| `src/routes/tickets.js` | Ticket routes |
| `src/store.js` | In-memory ticket store |
| `README.md` | Install, run, and test instructions |

### AC7 — Scope and conventions

**Given** the story is implemented  
**When** the diff is reviewed  
**Then** ticket logic lives under `src/`  
**And** storage is in-memory only (no database or file persistence)  
**And** no authentication, RBAC, or UI is added  
**And** no new npm dependencies beyond `express`.

## Definition of done

- [ ] All acceptance criteria (AC1–AC7) are met
- [ ] `npm install` and `npm test` pass locally
- [ ] `README.md` documents setup and API endpoints
- [ ] In-memory storage only (resets on server restart)
- [ ] No out-of-scope features included

## Out of scope

- Ticket classification / triage rules
- Priority or severity scoring
- Jira or GitHub integration
- Authentication or RBAC
- Database or file persistence
- Frontend UI
- `PUT` / `PATCH` / `DELETE` ticket endpoints

## Technical notes

| Item | Detail |
| --- | --- |
| Entry point | `src/index.js` — enable `express.json()` middleware |
| Storage | In-memory array in `src/store.js` |
| `status` field | Always `"new"` on create for this story |
| `createdAt` | Use `new Date().toISOString()` |
| Tests | Use `app.listen(0)` for ephemeral port; follow `node:test` conventions |
| Allowed `source` values | `email`, `portal`, `chat` |

## Verification

```bash
npm install
npm test
npm start
```

### Manual smoke test

```text
GET  /health
POST /api/tickets  {"title":"API timeout","description":"502 on checkout","source":"portal"}
GET  /api/tickets
```
