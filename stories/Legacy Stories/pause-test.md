# Story: Add a "priority" field to tickets

## Description
Add a `priority` field (low/medium/high) to the ticket data model and expose
it in the create/list API endpoints.

## Acceptance Criteria

1. **Given** a client submits `POST /api/tickets` with a `priority` field set to
   `"low"`, `"medium"`, or `"high"`,
   **When** the request is processed,
   **Then** the created ticket is persisted with that priority value and it is
   returned in the response.

2. **Given** a client submits `POST /api/tickets` without a `priority` field,
   **When** the request is processed,
   **Then** the ticket defaults to `"medium"` priority.

3. **Given** a client submits `POST /api/tickets` with an invalid priority value
   (e.g. `"urgent"`),
   **When** the request is processed,
   **Then** the API responds with HTTP 400 and a validation error message.

4. **Given** existing tickets in the system,
   **When** a client calls `GET /api/tickets`,
   **Then** each ticket in the response includes its `priority` field.

## Implementation Note
This story does not specify whether the `priority` field should be added via
a new database migration or by modifying the existing schema in place —
that decision is intentionally left open.