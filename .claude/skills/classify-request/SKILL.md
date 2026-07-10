---
name: classify-request
description: Determine product + feature + flow-type for a CEO/CPO feature request before generating a spec. Use when a feature intent is expressed (build/change/add a feature), including from a screenshot or competitor link. Returns a classification object for the orchestrator.
---

# classify-request

Classify a CEO/CPO intent — figure out **what** it is about — before any spec is generated.
Converse with the user in **Ukrainian**. Do not write any files; only classify.

## Input
- Free-form Ukrainian intent (text), and/or a screenshot / link (a reference).

## Steps
1. Read `specs/GLOSSARY.md` (products) and `specs/INDEX.md` (existing features).
2. **Product:** pick a product slug from the `specs/GLOSSARY.md` Products table (the single
   source of product names). If new/unclear — ask.
3. **Feature:** match an existing feature in INDEX, or treat as new. Propose a `feature-slug`
   (lower-case, hyphens).
4. **Flow type (`flow`):**
   - `new` — not in code or specs;
   - `full-gen` — exists in code but has no spec (→ generate a full spec);
   - `patch` — a spec already exists (in `drafts/` or `ready/`) → delta.
   To tell them apart: search INDEX for an existing spec; if needed inspect the code directly (Read/Grep).
5. If the input is a screenshot/link: first summarize the reference as an intent
   ("хочу так само, але під нас"), then classify.

## Ambiguity
If product / feature / flow is unclear — ask **one** clarifying question at a time (in Ukrainian).
**Never guess silently.**

## Output (return to the orchestrator)
```
{ product, feature_slug, flow, existing_spec_path? }
```
where `existing_spec_path` is present only for `patch`.
