---
story_id: "val-01"
epic_id: "val"
title: "Add a health note to README"
status: "ready-for-dev"
priority: "P0"
estimate: "S"
depends_on: []
repo: "IGNISHUB-TEST-REPO"
---

# Story val-01: Add a health note to README

## User Story

**As a** Hub validation tester,
**I want** a one-line health note in the repository README,
**So that** a complete Compass/BMAD story can pass Hub validation and reach the agent.

## Background & Context

This file is a **complete** Compass story: YAML frontmatter, User Story, and testable acceptance criteria. Hub must queue it even if the LLM wrongly says the description is missing.

Do not refactor unrelated files.

## Acceptance Criteria

### AC1 — README note
- [ ] `README.md` exists at the repo root (create it if missing)
- [ ] README contains the exact line: `IgnisHub validation story val-01: health note.`
- [ ] No other product files are changed

### AC2 — Scope
- [ ] Change is additive text only
- [ ] No new dependencies, CI, or schema changes

## Technical Notes

- Keep the edit to README.md only.
- If README.md already has other content, append the required line at the end.

## Definition of Done

- [ ] AC1 and AC2 checked
- [ ] Hub `criteria_validation` is `completed` and job reaches `queued` or later
