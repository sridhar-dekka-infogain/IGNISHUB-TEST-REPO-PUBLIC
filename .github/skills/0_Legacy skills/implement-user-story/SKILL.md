---
name: implement-user-story
description: >
  Implement a user story from the workspace: read requirements, apply minimal
  focused changes following repository conventions, run tests when required,
  and complete without user interaction.
triggers:
  - implement
  - user story
  - implement-user-story
  - acceptance criteria
---

# implement-user-story

Use this skill when a task asks you to implement a user story or feature
specification provided as a file in the workspace (for example under `stories/`
or another path named in the job message).

## Purpose

Deliver exactly what the story's acceptance criteria require. Avoid unrelated
refactors, extra features, or structural changes not implied by the story.

## Workflow

1. **Read the story once** — Open the story path from the task with the file
   editor. Identify every acceptance criterion before modifying code.

2. **Understand the repository** — Inspect existing layout, patterns, and tests
   so your changes align with project conventions. Follow the structure and
   naming already in use; do not impose a different architecture.

3. **Implement acceptance criteria** — Apply the smallest set of edits needed
   to satisfy each criterion. Create or modify files only where the story and
   the existing codebase indicate. Do not refactor code outside the story scope.

4. **Add or update tests when required** — If the story specifies test
   expectations, extend the project's test suite using the same framework,
   assertion library, helpers, and style already present in the repository.
   Use only libraries already available in the repository; if a capability is
   not present, achieve it with what is available rather than introducing it.

5. **Verify before finishing** — Run the project's existing test command (the
   one defined by the repository). Ensure the command terminates on its own; if
   importing a module starts a long-running process (such as a server bound to a
   port), make that startup conditional on the module being run directly, or
   have tests use a self-managed instance, so tests do not hang. Do not call
   `finish` until required changes are saved and applicable tests pass.

6. **Stop cleanly** — Leave changed files in the workspace. Do not commit,
   push, or open pull requests unless the story explicitly requires it.

## Out of scope

If the story is not a code change for this repository (for example
documentation-only, marketing, operations, or work belonging to another
system), respond with **OUT_OF_SCOPE**, explain briefly why, and do not
modify application source or test files.

## Operating constraints

- **Non-interactive:** Do not ask the user for clarification or approval
  mid-task.
- **Minimal diff:** Prefer focused changes over broad rewrites.
- **Efficiency:** View each file at most once unless you edit it. Run the
  test suite once near the end rather than after every small edit.
- **New paths:** Create parent directories before writing nested files.

## Completion checklist

Before calling `finish`, confirm:

- [ ] Every acceptance criterion is addressed in code or tests
- [ ] Changes follow existing project conventions
- [ ] Required tests were run and passed (when the story requires tests)
- [ ] No unrelated files were changed
