---
name: spec-orchestrator
description: Entry point for the CEO/CPO spec workflow. Use whenever someone expresses intent to build, add, or change a product feature in Ukrainian (e.g. "хочу…", "додай…", "зміни…", "потрібно…"), or pastes a screenshot/competitor link as a reference. Routes through classify → generate-spec → generate-prototype → delivery, with confirmation checkpoints. The user just talks; this skill decides what runs.
---

# spec-orchestrator

The single entry point for the non-technical CEO/CPO. The user just says what they want — you
run the pipeline and call the sub-skills. **Converse in Ukrainian.** Artifacts are in Ukrainian;
the Jira ticket is in English (see `specs/CONVENTIONS.md`).

## When it triggers
- Feature intent in Ukrainian: "хочу…", "додай…", "зміни…", "потрібно…", "давай зробимо…".
- A pasted screenshot or competitor link (reference intake).

## Pipeline
1. **classify-request** → get `{ product, feature_slug, flow, existing_spec_path? }`.
   - If the input is a screenshot/link: first summarize the reference as an intent.
2. **Checkpoint 1:** show the classification in Ukrainian, ask the user to confirm (product/feature/flow).
3. **generate-spec** → create/update the spec under `specs/raw/`.
4. **Checkpoint 2:** briefly show what was generated, ask to confirm before the prototype.
5. **generate-prototype** → a clickable `prototype.html` (feature level).
6. **When the work looks done** (spec written, prototype generated), briefly remind the user they
   can say it's finished / ready to hand off ("готово", "завершено", "передавай далі") to trigger
   **deliver-spec** (Jira ticket → branch/commit/PR). Wait for that explicit go — never start
   delivery on your own.

## Rules
- Never guess silently — on ambiguity ask one short question at a time (via classify-request);
  guess only when genuinely confident of the intent.
- Changes to the canonical docs (GLOSSARY/CONVENTIONS) go only through `propose-highlevel-patch`.
- Respect roles: the CEO writes only under `specs/raw/` (the gate enforces it); zone moves and
  `contract.md` are the CPO's job.
- Other user actions have their own skills — don't duplicate them here: query/navigation →
  `query-specs`; digest → `pipeline-digest`; prototype variant → `prototype-variant`.
