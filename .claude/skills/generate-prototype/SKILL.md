---
name: generate-prototype
description: Generate a self-contained clickable HTML prototype for a feature from its ui.md and the real components/icons. Tailwind v4 browser CDN + the app's @theme tokens + lucide; navigation and live controls work with no build/server. Use after a feature's ui.md exists. Feature-level only.
---

# generate-prototype

Generate a self-contained clickable prototype for a feature. It opens with a double-click (only
needs internet for the CDN — no build/server). **UI text is in English.** **Feature level
only** (never per sub-feature).

## Input
A feature folder (`specs/<zone>/<product>/<feature>/`) containing `ui.md`.

## Steps
1. Start from `specs/_templates/prototype.html`.
2. Extract tokens from the relevant app (`admin` → `apps/admin/...`, otherwise → `apps/listing/...`):
   ```
   node .claude/spec-tools/build-prototype-css.mjs apps/<app>/src/app/globals.css
   ```
   The output has the `@theme` block(s), then a `/* === ROOT VARS ... === */` marker, then `:root`/`.dark`.
   - `@theme` → inject into `<style type="text/tailwindcss">`.
   - `:root`/`.dark` → inject into `<style id="root-vars">`.
3. For each screen in `ui.md`, add a `<section data-screen="...">` using the markup of the **real**
   components: open the relevant `libs/components/src/ui/*.tsx` and reproduce their structure +
   Tailwind classes as static HTML (do not run React). Mock data inline, in English.
4. Icons — lucide: `<i data-lucide="name"></i>` (the template already calls `lucide.createIcons()`).
5. Navigation/controls — via the `data-*` attributes the template already handles:
   `data-goto`, `data-state-set`/`data-state-target`, `data-tab`/`data-tab-group`/`data-tab-panel`,
   `data-toggle`. Add buttons to `#screen-nav` (`data-goto`) for screen-to-screen navigation.
6. Write to `specs/<zone>/<product>/<feature>/prototype.html`.

## Verification
Open the file in a browser: styles applied (tokens match the app), screen navigation works,
tabs/toggles/inputs are live, icons render, no console errors.
