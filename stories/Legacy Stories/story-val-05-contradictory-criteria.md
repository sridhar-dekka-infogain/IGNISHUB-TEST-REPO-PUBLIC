---
story_id: "val-05"
epic_id: "val"
title: "Create and do not create VALIDATION.txt"
status: "ready-for-dev"
priority: "P1"
estimate: "S"
depends_on: []
repo: "IGNISHUB-TEST-REPO"
---

# Story val-05: Create and do not create VALIDATION.txt

## User Story

**As a** Hub validation tester,
**I want** a `VALIDATION.txt` file at the repo root,
**So that** we can prove contradictory acceptance criteria are rejected before the agent starts.

## Background & Context

AC1 and AC2 cannot both be true. Hub should **fail** with `VALIDATION_CONTRADICTORY_CRITERIA`. The agent must not start.

## Acceptance Criteria

### AC1 — File must exist
- [ ] Create `VALIDATION.txt` at the repository root
- [ ] The file contains exactly `created-by-val-05`

### AC2 — File must not exist
- [ ] Do not create `VALIDATION.txt`
- [ ] `VALIDATION.txt` must be absent from the repository after this story

## Technical Notes

Do not resolve the contradiction. The gate should stop the job.

## Definition of Done

- [ ] Both AC1 and AC2 are satisfied
