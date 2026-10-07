---
name: pause-demo
description: Demo skill that deterministically stops for human input on an ambiguous database decision before implementing.
---
# STOP — READ THIS FIRST

Your very first action in this conversation, before reading any other file,
must be to check whether the story specifies a migration-vs-schema-modify
approach. It does not. Therefore your very first tool call — before
FileEditor, before Terminal, before anything else — must be:

request_human_input(question="Should I create a new migration file or modify the existing schema in place?")

Call this tool NOW as your first action. Do not read the story first. Do not
plan first. This is your first move.

# Pause Demo Skill

You are implementing the change described in the story file at
`.ignishub/intake/story.md`. Read it completely first.

## MANDATORY FIRST CHECK — before writing any code

Before you write, edit, or plan any code, check ONE thing first:

**Does the story explicitly say whether database/schema changes should be
made via a NEW MIGRATION FILE, or by MODIFYING THE EXISTING SCHEMA IN
PLACE?**

- If the story DOES say which approach to use → proceed normally with the
  rest of this skill.
- If the story does NOT say which approach to use → this is a HALT
  condition. You must stop immediately and follow the "HALT — mandatory
  tool call" section below, **before doing anything else**: before reading
  other files, before writing code, before running commands, before
  calling `finish`.

## HALT — mandatory tool call (read this carefully)

When the HALT condition above is true, you MUST call the tool named
`request_human_input`. This is a literal function/tool invocation that
you must execute — it is NOT something you describe in text, and it is NOT
something you put inside a `finish` message.

Call it exactly like this (this is a real tool call, not example text):

request_human_input(question="Should I create a new migration file or modify the existing schema in place?")

### Absolute rules — read every line

1. Calling `finish` is FORBIDDEN as your response to the HALT condition.
   Explaining the ambiguity inside a `finish` message does NOT satisfy this
   skill and is treated as a failure to follow instructions.
2. Writing a text explanation of the ambiguity without calling
   `request_human_input` is FORBIDDEN.
3. Proceeding with any database/schema code while the approach is
   undecided is FORBIDDEN.
4. The ONLY correct action when the HALT condition is true is to invoke
   the `request_human_input` tool with your question as its argument, and
   then stop. Do not call any other tool in the same turn.
5. If you notice yourself about to call `finish` while this question is
   still unanswered, STOP — that is the exact signal that you must call
   `request_human_input` instead, right now, in this turn.

There is no acceptable alternative to calling the tool. Narrating,
summarizing, or "asking" inside a finish message is always wrong for this
condition.

## Task (only after the HALT check above is cleared)

1. Read `.ignishub/intake/story.md` completely.
2. Implement the requested feature exactly as described.
3. Write and run tests to confirm the implementation works.
4. Once implementation and tests pass, call `finish` normally to complete
   the job.

## After a resume

If you are resuming after a human answered your `request_human_input`
question, use that answer to decide the database approach, then continue
with the Task section above.

---

This skill is located at `.github/skills/pause-demo`. Any files it
references (e.g. under `scripts/`, `references/`, `assets/`) are relative
to that directory.