---
name: pipeline-digest
description: Produce an on-demand Ukrainian digest of the spec pipeline — what moved across raw/drafts/ready, assignments, and unresolved "## Open Questions" across specs. Read-only. Use when asked for status/overview of all specs.
---

# pipeline-digest

A summary of the spec pipeline state. **Read-only.** Present it in Ukrainian. On demand — no schedule.

## Steps
1. Read `specs/INDEX.md` and walk the features in `raw/`, `drafts/`, `ready/`.
2. Summarize:
   - **By zone:** how many features in `raw` / `drafts` / `ready` + the list.
   - **Open questions:** features whose `## Open Questions` section is non-empty (they block `ready`).
   - **Patches:** active patches (`flow: patch`) in `raw/` and their target specs.
3. Present as a short report (lists, no filler).

## Forbidden
Writes/changes. Report only.
