---
story_id: "val-06"
epic_id: "val"
title: "Add CONTRIBUTING one-liner"
status: "ready-for-dev"
priority: "P2"
estimate: "S"
depends_on: []
repo: "IGNISHUB-TEST-REPO"
---

# Story val-06: Add CONTRIBUTING one-liner

## Description

Add a single documented contribution note so Hub accepts a story that uses `## Description` instead of `## User Story` (Jira-rendered shape in a Compass file).

**As a** contributor,
**I want** a CONTRIBUTING.md with one rule,
**So that** the validation gate treats Description + AC as sufficient intent.

## Acceptance Criteria

### AC1 — File
- [ ] `CONTRIBUTING.md` exists at the repo root (create it if missing)
- [ ] File contains the exact line: `Open a pull request against main.`
- [ ] No other files are changed

## Technical Notes

This story proves the shape check does not require a `## User Story` heading.

## Definition of Done

- [ ] AC1 checked
- [ ] Hub queues the job
