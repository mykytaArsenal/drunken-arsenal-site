---
name: propose-highlevel-patch
description: Propose a change to the canonical high-level docs (GLOSSARY, rarely CONVENTIONS) as a patch, without writing the canon directly. Use when a feature flow needs a new product/status/name. The CPO applies it later. INDEX is exempt (auto-generated).
---

# propose-highlevel-patch

When a flow needs a change to the canonical docs (a new product/status/name in `GLOSSARY.md`,
rarely a rule in `CONVENTIONS.md`) — **do not write the canon directly** (CPO's zone + the gate
blocks the CEO). Instead, propose a patch. Converse in Ukrainian.

## Steps
1. Identify the target canonical file (`specs/GLOSSARY.md` or `specs/CONVENTIONS.md`) and the
   concrete change (a new product row, a new status value, etc.).
2. Put the patch into the relevant feature's `raw/` folder as an entry in its `CHANGES.md`
   (or a separate `glossary-patch.md`), stating: target file/§ + the exact proposed delta + reason.
3. The CPO applies the delta to the canon during enrich/promote.

## Important
- `INDEX.md` is out of scope — it is auto-generated (`node .claude/spec-tools/regen-index.mjs`).
- Never edit `specs/GLOSSARY.md` / `specs/CONVENTIONS.md` directly from the CEO flow.
