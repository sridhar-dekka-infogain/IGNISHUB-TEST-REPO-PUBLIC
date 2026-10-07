---
story_id: "val-01"
epic_id: "val"
title: "Add a health-check marker file"
status: "ready-for-dev"
priority: "P0"
estimate: "S"
depends_on: []
repo: "IGNISHUB-TEST-REPO"
---

# Story val-01: Add a health-check marker file

## User Story

**As a** Hub validation tester,
**I want** a small marker file in the repo,
**So that** a complete Compass/BMAD story can pass Hub validation and, if left running, the agent has a tiny implementable task.

## Background & Context

This story exists to prove Hub's pre-agent story gate. It is intentionally small. Do not refactor unrelated files.

## Acceptance Criteria

### AC1 — Marker file
- [ ] File `docs/VAL_HEALTH.txt` exists at the repo root-relative path `docs/VAL_HEALTH.txt`
- [ ] File contents are exactly `ok` (no extra lines)

### AC2 — Scope
- [ ] No other files are modified

## Technical Notes

- Create the file with a single write. Do not add tests, CI, or README changes.

## Definition of Done

- [ ] `docs/VAL_HEALTH.txt` exists with content `ok`
- [ ] No unrelated diffs
