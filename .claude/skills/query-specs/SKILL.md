---
name: query-specs
description: Answer natural-language (Ukrainian) questions about existing specs by reading specs/INDEX.md and the spec files. Read-only navigation — "що в platform?", "статус фічі X?", "що зараз у drafts?". Never writes.
---

# query-specs

Answer questions about existing specs. **Read-only — write nothing.** Converse in Ukrainian.

## Steps
1. Read `specs/INDEX.md` (the product→feature→zone map).
2. If needed, open specific spec files (`README.md`, `ui.md`, `data.md`, `CHANGES.md`).
3. Answer concisely: where it lives, which zone, status, open questions, relations.

## Example questions
- "Що в platform?" → list of platform features with their zones.
- "Статус price-filter?" → zone + whether it has open questions + link.
- "Що зараз у drafts?" → all features in `drafts/`.

## Forbidden
Any file write/change. This is a navigation skill.
