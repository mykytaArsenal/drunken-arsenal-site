# Translations Refresh — Design

**Date:** 2026-05-17
**Scope:** Full linguistic review of the 4 currently configured locales (`en`, `es`, `de`, `fr`) and extraction of brand/product/threshold references into placeholders.

## Goal

Bring `messages/en|es|de|fr.json` to a consistent, high-quality state:

- Brand name `Drunken Arsenal` and product name `Shot Wave` are **never** translated — they live in placeholders backed by a single source of truth.
- The free-shipping threshold (`$50`) and support email also become placeholders so they can be changed in one place.
- All four locales pass a full linguistic pass: grammar, naturalness, consistent terminology, brand voice (playful tactical-military, 18+).
- Missing semantic fragments are restored (e.g., the `Shot Wave` reference dropped from `fr.home.ctaSubtitle`).

## Out of scope

- Adding new locales beyond the existing four.
- Multi-currency support (localizing `$` → `€`/`£`). Currency stays `$50` everywhere; price formatting from the database is unaffected.
- Translating product content stored in the database.
- Unifying the parallel `lib/i18n/` helper module with the `next-intl` setup in `i18n/`. Noted as tech debt; out of scope here.
- Scanning components for hardcoded English strings not yet in `messages/*.json`. Tracked separately.

## Architecture

### New module: `lib/i18n/brand.ts`

Single source of truth for non-localizable values:

```ts
export const BRAND = 'Drunken Arsenal';
export const PRODUCT_NAME = 'Shot Wave';
export const FREE_SHIPPING_THRESHOLD = '$50';
export const SUPPORT_EMAIL = 'support@drunkenarsenal.com';
```

### Placeholder convention

Uses standard `next-intl` / ICU `{name}` syntax. New placeholders introduced:

- `{brand}` — the brand name
- `{productName}` — the game/product name
- `{freeShippingThreshold}` — formatted threshold string (e.g. `$50`)
- `{supportEmail}` — support contact email

Existing placeholders (`{amount}`, `{email}`) remain unchanged.

### Keys receiving new placeholders

| Key | Before | After |
|---|---|---|
| `home.title` | `"DRUNKEN ARSENAL"` | `"{brand}"` — casing decision deferred to the future consumer (CSS `text-transform` or pass an uppercased variant); the key has no consumer today |
| `home.ctaSubtitle` | `"...have deployed Shot Wave... over $50."` | uses `{productName}`, `{freeShippingThreshold}` |
| `home.aboutUs1` / `aboutUs2` / `aboutUs3` | brand inlined 3-5× per paragraph | `{brand}` used in each occurrence |
| `product.freeShippingDesc` | `"On orders over $50"` | uses `{freeShippingThreshold}` |
| `order.questions` | hardcoded `support@drunkenarsenal.com` | uses `{supportEmail}` |
| `howToPlay.title` | `"How to Play Shot Wave"` | uses `{productName}` |

### Data flow

Unchanged. Components call `useTranslations()` / `getTranslations()` from `next-intl` and pass placeholder values explicitly. The runtime substitution is performed by `next-intl`'s ICU formatter.

### Component changes

Only one component currently consumes a key receiving a new placeholder:

- `app/[locale]/main/AboutUs.tsx` — pass `{ brand: BRAND }` to `t('home.aboutUs1' | 'aboutUs2' | 'aboutUs3')`.

The other modified keys (`home.title`, `home.ctaSubtitle`, `product.freeShippingDesc`, `order.questions`, `howToPlay.title`) are not consumed by any component today. Their placeholders are added preemptively so the convention is established when those keys are eventually used.

**Convention to record in the spec:** whenever a future component starts consuming one of these placeholder-bearing keys, it must pass the corresponding constant from `lib/i18n/brand.ts`.

## Quality bar — linguistic review

For each of `en/es/de/fr.json`:

1. **Grammar and spelling** — standard rules of the target language.
2. **Naturalness** — reads as native-written prose, not as a machine translation. Particular care for long copy in `home.aboutUs1/2/3`.
3. **Meaning fidelity** — every key idea from the English source survives translation. Restore the `Shot Wave` reference in `fr.home.ctaSubtitle` and verify equivalent restorations across locales.
4. **Terminology consistency** within each language. Working glossary (EN → ES / DE / FR):
   - `deploy` → desplegar / einsetzen / déployer
   - `mission` → misión / Mission / mission
   - `commander` → comandante / Kommandant / commandant
   - `arsenal` (generic, "gear") → arsenal / Arsenal / arsenal
   - `tactical` → táctico / taktisch / tactique
   - `squad` → escuadrón / Trupp / escouade
   - `battlefield` → campo de batalla / Schlachtfeld / champ de bataille
5. **Brand voice** — playful tactical-military, 18+, lightly sarcastic. Don't strip the humor.
6. **Placeholder integrity** — `{brand}`, `{productName}`, `{amount}` etc. are preserved verbatim, never translated or dropped, and sit in a grammatically valid position in the sentence.
7. **Key parity** — JSON structure remains identical across all four locales (it already is; preserve this).
8. **Length** — translations should not be dramatically longer than the English source for short UI strings (CTA buttons, nav items) where UI space is tight.

## Verification

1. **Build:** `pnpm build` — must succeed without new errors.
2. **Key parity:** structural diff of `en.json` vs each of `es/de/fr.json` returns empty. (Already true; re-verify after edits.)
3. **Placeholder parity:** for each leaf string in `en.json`, every `{xxx}` placeholder must appear in the corresponding leaf of `es/de/fr.json`. Implemented as a one-off Node script run during the implementation phase.
4. **Manual smoke:** `pnpm dev` and visit `/` and `/about` under each locale (set the `locale` cookie to `en` / `es` / `de` / `fr`). Confirm:
   - `Drunken Arsenal` appears literally in the AboutUs paragraphs in all four locales.
   - No stray `{brand}` / `{productName}` placeholders leak into the rendered UI.
   - No empty strings where text used to be.

## Test plan (for the PR description)

- `pnpm build` — pass.
- `pnpm lint` — no worse than the pre-existing baseline (existing prettier/no-unused-vars errors are not introduced by this change).
- Key-parity script — empty diff.
- Placeholder-parity script — empty diff.
- Manual locale walk-through of `/` and `/about` in en/es/de/fr.

## Known risks

1. **Translator is not a native speaker.** Translations are produced by an LLM with strong multilingual coverage, not a human native speaker. For customer-facing marketing copy (especially `home.aboutUs1/2/3`), a native-speaker pass before production launch is recommended. **Post-condition, not a blocker for this work.**
2. **`vaul 0.9.9` peer-dep warning** with React 19 — unrelated to translations; pre-existing.
3. **Parallel `lib/i18n/` helper module** has its own `t()` and imports JSON directly. It is only consumed by `components/language-switcher.tsx` for `localeNames` / `localeFlags` (not for text rendering), so placeholder-bearing strings are not at risk through that path. The two i18n setups should eventually be unified — tracked as tech debt outside this spec.

## Deliverables

- `lib/i18n/brand.ts` — new constants module.
- `messages/en.json` — placeholders inserted. No copy edits to existing wording (English is the source of truth and is assumed correct).
- `messages/es.json`, `messages/de.json`, `messages/fr.json` — full linguistic pass + placeholders applied + restored fragments.
- `app/[locale]/main/AboutUs.tsx` — pass `{ brand: BRAND }` to the three `aboutUsN` translations.
- One-off verification script (kept under `scripts/` or run inline during implementation, author's choice in plan phase).