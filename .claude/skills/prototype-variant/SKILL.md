---
name: prototype-variant
description: Generate an alternative version of a feature's prototype for A/B comparison (e.g. "зроби варіант B цього екрана"). Reuses generate-prototype with a stated variation; writes a sibling file so both can be opened side by side.
---

# prototype-variant

Generate an alternative prototype of a feature for A/B comparison. **UI text in English**
(same rule as `generate-prototype` — see CONVENTIONS language table).

## Input
A feature folder with an existing `prototype.html` + the user's description of the variation
("variant B", "different filter layout", etc.).

## Steps
1. Follow `generate-prototype` (same tokens/components/controls), but apply the described variation.
2. Write it as a sibling `prototype.<label>.html` (e.g. `prototype.b.html`) — **do not overwrite** the base.
3. Use a clear `<label>` (`b`, `compact`, `map-first`).

## Verification
Both files (`prototype.html` and `prototype.<label>.html`) open independently and correctly;
the difference matches the described variation.
