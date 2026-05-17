# Translations Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh all 4 currently configured locales (`en`, `es`, `de`, `fr`) with placeholder extraction for brand/product/threshold references and a full linguistic pass.

**Architecture:** Introduce `lib/i18n/brand.ts` as the single source of truth for non-localizable values (`BRAND`, `PRODUCT_NAME`, `FREE_SHIPPING_THRESHOLD`, `SUPPORT_EMAIL`). Replace hardcoded brand/product/currency references in `messages/*.json` with ICU placeholders (`{brand}`, `{productName}`, `{freeShippingThreshold}`, `{supportEmail}`). Update the only current consumer (`AboutUs.tsx`) to pass the brand constant. A one-off Node verification script enforces key parity and placeholder parity across locales.

**Tech Stack:** Next.js 16, next-intl, TypeScript, JSON message files, Node.js (for verification script).

**Reference spec:** `docs/superpowers/specs/2026-05-17-translations-refresh-design.md`

---

## File Structure

**Created:**
- `lib/i18n/brand.ts` — non-localizable constants module (single responsibility: brand/product/threshold values).
- `scripts/check-translations.mjs` — one-off verification script (key parity + placeholder parity).

**Modified:**
- `messages/en.json` — placeholders inserted, no copy edits.
- `messages/es.json` — full linguistic pass + placeholders.
- `messages/de.json` — full linguistic pass + placeholders + restored dropped fragments (Shot Wave mention in ctaSubtitle).
- `messages/fr.json` — full linguistic pass + placeholders + restored dropped fragments.
- `app/[locale]/main/AboutUs.tsx` — pass `{ brand: BRAND }` to `t('home.aboutUs1' | 'aboutUs3')`. (Not aboutUs2 — it doesn't reference the brand.)

**Not modified:**
- `i18n/routing.ts`, `i18n/request.ts`, `i18n/navigation.ts` — no infrastructure changes.
- `lib/i18n/config.ts`, `lib/i18n/get-locale.ts`, `lib/i18n/i18n.ts` — legacy parallel system, out of scope.
- Other components — no other consumers of placeholder-bearing keys.

---

## Task 1: Create brand constants module

**Files:**
- Create: `lib/i18n/brand.ts`

- [ ] **Step 1: Write the module**

Create `lib/i18n/brand.ts` with this exact content:

```ts
export const BRAND = 'Drunken Arsenal';
export const PRODUCT_NAME = 'Shot Wave';
export const FREE_SHIPPING_THRESHOLD = '$50';
export const SUPPORT_EMAIL = 'support@drunkenarsenal.com';
```

- [ ] **Step 2: Verify TS compiles**

Run: `pnpm exec tsc --noEmit`
Expected: completes without errors related to `lib/i18n/brand.ts`. (Pre-existing project errors unrelated to this file are not regressions.)

- [ ] **Step 3: Commit**

```bash
git add lib/i18n/brand.ts
git commit -m "feat(i18n): add brand constants module"
```

---

## Task 2: Create verification script

**Files:**
- Create: `scripts/check-translations.mjs`

- [ ] **Step 1: Write the script**

Create `scripts/check-translations.mjs` with this exact content:

```js
#!/usr/bin/env node
// Verifies key parity and placeholder parity across messages/*.json locales.
// Source of truth: en.json. Exits 1 on any mismatch.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MESSAGES_DIR = join(__dirname, '..', 'messages');
const SOURCE = 'en';
const TARGETS = ['es', 'de', 'fr'];

function load(locale) {
  const path = join(MESSAGES_DIR, `${locale}.json`);
  return JSON.parse(readFileSync(path, 'utf8'));
}

function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key));
    } else {
      out[key] = v;
    }
  }
  return out;
}

function placeholders(str) {
  if (typeof str !== 'string') return new Set();
  const matches = str.match(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g) || [];
  return new Set(matches);
}

function diffSets(a, b) {
  const onlyA = [...a].filter((x) => !b.has(x));
  const onlyB = [...b].filter((x) => !a.has(x));
  return { onlyA, onlyB };
}

const source = flatten(load(SOURCE));
const sourceKeys = new Set(Object.keys(source));

let failed = false;

for (const locale of TARGETS) {
  const target = flatten(load(locale));
  const targetKeys = new Set(Object.keys(target));

  // Key parity
  const { onlyA: missing, onlyB: extra } = diffSets(sourceKeys, targetKeys);
  if (missing.length || extra.length) {
    failed = true;
    console.error(`[${locale}] key parity mismatch:`);
    if (missing.length) console.error(`  missing: ${missing.join(', ')}`);
    if (extra.length) console.error(`  extra:   ${extra.join(', ')}`);
  }

  // Placeholder parity (only for keys present in both)
  for (const key of sourceKeys) {
    if (!targetKeys.has(key)) continue;
    const srcPh = placeholders(source[key]);
    const tgtPh = placeholders(target[key]);
    const { onlyA: srcOnly, onlyB: tgtOnly } = diffSets(srcPh, tgtPh);
    if (srcOnly.length || tgtOnly.length) {
      failed = true;
      console.error(`[${locale}] placeholder mismatch at "${key}":`);
      if (srcOnly.length) console.error(`  missing in target: ${srcOnly.join(', ')}`);
      if (tgtOnly.length) console.error(`  extra in target:   ${tgtOnly.join(', ')}`);
    }
  }
}

if (failed) {
  console.error('\nTranslation check FAILED');
  process.exit(1);
}
console.log('Translation check passed (key + placeholder parity across locales).');
```

- [ ] **Step 2: Run against current state — should PASS**

Run: `node scripts/check-translations.mjs`
Expected stdout: `Translation check passed (key + placeholder parity across locales).` and exit code 0.

Rationale: current state has key parity, and no locale has yet diverged on placeholders (the existing `{amount}` and `{email}` placeholders are present in every locale).

- [ ] **Step 3: Commit**

```bash
git add scripts/check-translations.mjs
git commit -m "chore(i18n): add translation parity check script"
```

---

## Task 3: Update en.json with placeholders + update AboutUs.tsx consumer

This task introduces the new placeholders into `en.json` AND updates the only consumer in the same commit, so the rendered UI never shows a stray `{brand}`. After this task, the verification script will FAIL until Tasks 4-6 are done (es/de/fr need matching placeholders).

**Files:**
- Modify: `messages/en.json`
- Modify: `app/[locale]/main/AboutUs.tsx`

- [ ] **Step 1: Update `messages/en.json`**

Apply these exact edits using the Edit tool (or write the file). Seven changes:

Edit 1 — `home.title`:
```
"title": "DRUNKEN ARSENAL",
```
→
```
"title": "{brand}",
```

Edit 2 — `home.ctaSubtitle`:
```
"ctaSubtitle": "Join thousands of party commanders who have deployed Shot Wave at their gatherings. Free shipping on orders over $50.",
```
→
```
"ctaSubtitle": "Join thousands of party commanders who have deployed {productName} at their gatherings. Free shipping on orders over {freeShippingThreshold}.",
```

Edit 3 — `home.aboutUs1` (only the `Drunken Arsenal` token at the start):
```
"aboutUs1": "Drunken Arsenal is a party brand for grown-ups
```
→
```
"aboutUs1": "{brand} is a party brand for grown-ups
```

Edit 4 — `home.aboutUs3` (only the `Drunken Arsenal` token):
```
"aboutUs3": "At the core of Drunken Arsenal is a simple philosophy:
```
→
```
"aboutUs3": "At the core of {brand} is a simple philosophy:
```

(Note: `home.aboutUs2` does NOT contain "Drunken Arsenal" in en.json — verified — leave it unchanged.)

Edit 5 — `product.freeShippingDesc`:
```
"freeShippingDesc": "On orders over $50",
```
→
```
"freeShippingDesc": "On orders over {freeShippingThreshold}",
```

Edit 6 — `order.questions`:
```
"questions": "Questions about your order? Contact us at support@drunkenarsenal.com"
```
→
```
"questions": "Questions about your order? Contact us at {supportEmail}"
```

Edit 7 — `howToPlay.title`:
```
"title": "How to Play Shot Wave",
```
→
```
"title": "How to Play {productName}",
```

- [ ] **Step 2: Update `app/[locale]/main/AboutUs.tsx`**

Add the import and update the two `t()` calls. Two edits:

Edit A — add import after the `useTranslations` import. Current top of file (around line 3):
```tsx
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
```
→
```tsx
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { BRAND } from '@/lib/i18n/brand';
```

Edit B — update the two affected paragraphs around lines 21-23. Current:
```tsx
            <p>{t('home.aboutUs1')}</p>
            <p>{t('home.aboutUs2')}</p>
            <p>{t('home.aboutUs3')}</p>
```
→
```tsx
            <p>{t('home.aboutUs1', { brand: BRAND })}</p>
            <p>{t('home.aboutUs2')}</p>
            <p>{t('home.aboutUs3', { brand: BRAND })}</p>
```

(`aboutUs2` intentionally left without the `{brand}` value because the string has no `{brand}` placeholder. Passing it would be harmless but is not required.)

- [ ] **Step 3: Verify build still works**

Run: `pnpm build`
Expected: exit code 0. The "Dynamic server usage" warnings about `/[locale]/sign-in` and `/[locale]/account` are pre-existing and unrelated.

- [ ] **Step 4: Run verification script — should FAIL on placeholder parity**

Run: `node scripts/check-translations.mjs`
Expected: exit code 1. Errors of the form:
```
[es] placeholder mismatch at "home.title":
  missing in target: {brand}
[es] placeholder mismatch at "home.ctaSubtitle":
  missing in target: {productName}, {freeShippingThreshold}
...
```
This is the expected red state — Tasks 4-6 will turn it green.

- [ ] **Step 5: Commit**

```bash
git add messages/en.json app/[locale]/main/AboutUs.tsx
git commit -m "feat(i18n): extract brand/product/threshold placeholders in en.json"
```

---

## Task 4: Update es.json — linguistic pass + placeholders

**Files:**
- Modify: `messages/es.json`

- [ ] **Step 1: Write the full updated file**

Write `messages/es.json` with this exact content (full file — overwrite):

```json
{
  "nav": {
    "products": "Productos",
    "howToPlay": "Cómo Jugar",
    "about": "Acerca de",
    "cart": "Carrito",
    "account": "Cuenta",
    "signIn": "Iniciar sesión"
  },
  "home": {
    "ageWarning": "Juega duro, bebe con cabeza, recuérdalo todo",
    "title": "{brand}",
    "subtitle": "Despliega. Bebe. Domina. El juego táctico de bebidas que convierte cada fiesta en un campo de batalla.",
    "browseArsenal": "Explorar Arsenal",
    "howToPlay": "Cómo Jugar",
    "featuredTitle": "Arsenal Destacado",
    "featuredSubtitle": "Equipo táctico premium diseñado para máximo impacto en fiestas",
    "completeArsenal": "Arsenal Completo",
    "ctaTitle": "¿Listo para la Batalla?",
    "ctaSubtitle": "Únete a miles de comandantes de fiesta que han desplegado {productName} en sus reuniones. Envío gratis en pedidos superiores a {freeShippingThreshold}.",
    "startShopping": "Empezar a Comprar",
    "bundle": "PAQUETE",
    "inStock": "en stock",
    "outOfStock": "Agotado",

    "aboutUs1": "{brand} es una marca de fiesta para adultos a los que les gusta la diversión un poco exagerada. Creamos juegos de bebidas y accesorios de bar de estilo táctico que parecen sacados de un arsenal, pero existen únicamente para entretener, hacer reír y crear noches inolvidables con amigos. Sin armas reales, sin violencia: solo una parodia divertida envuelta en un diseño premium perfecto para regalar.",
    "aboutUs2": "Queremos aportar algo nuevo al mundo de las fiestas: no solo otro juego de chupitos, sino una experiencia completa con su propio universo — comandantes, misiones, reglas de enfrentamiento y tradiciones que se convierten en parte de la historia de tu grupo. Nuestros productos están pensados para regalar: a amigos, compañeros de trabajo y a esa persona que ya lo tiene todo, excepto su propio arsenal de bar táctico.",
    "aboutUs3": "En el corazón de {brand} hay una filosofía sencilla: beber con responsabilidad, jugar con cabeza y no tomarse demasiado en serio. Defendemos una diversión que sigue siendo diversión — con límites claros, un conductor sobrio acordado de antemano y recuerdos que de verdad quieras recordar al día siguiente.",

    "whoWeAreTitle": "¿QUIÉNES SOMOS?",
    "missionTitle": "MISIÓN",
    "missionText": "Convertir cada reunión en una operación memorable, con historias que valga la pena contar y no lamentar.",
    "whatWeBringTitle": "QUÉ APORTAMOS",
    "whatWeBringText": "Regalos de estilo táctico, acabados premium y todo un universo de fiesta — con comandantes, misiones y reglas de la casa incluidas.",
    "ourPromiseTitle": "NUESTRA PROMESA",
    "ourPromiseText": "Diversión que sigue siendo diversión: límites claros, consumo responsable y un debrief al día siguiente que sí recuerdas.",
    "readyForSomeFun": "¿LISTO PARA DIVERTIRTE?",
    "yesCommander": "¡SÍ, COMANDANTE!",
    "designatedDriverNote": "Despliega la misión con un conductor sobrio y tu mejor escuadrón."
  },
  "product": {
    "backToShop": "Volver a la Tienda",
    "saveUpTo": "AHORRA HASTA 20%",
    "readyToShip": "Listo para enviar",
    "quantity": "Cantidad:",
    "addToCart": "Añadir al Carrito",
    "adding": "Añadiendo...",
    "freeShipping": "Envío Gratis",
    "freeShippingDesc": "En pedidos superiores a {freeShippingThreshold}",
    "quality": "Calidad Garantizada",
    "qualityDesc": "Materiales de grado táctico premium",
    "returns": "Devoluciones de 30 Días",
    "returnsDesc": "¿No estás satisfecho? Reembolso completo garantizado",
    "ageWarningFull": "SOLO +18 - BEBE RESPONSABLEMENTE - NO APTO PARA MENORES",
    "youMayLike": "También te Puede Gustar"
  },
  "cart": {
    "title": "Carrito de Compras",
    "empty": "Tu Arsenal está Vacío",
    "emptyDesc": "Es hora de abastecerte de equipo táctico para tu próxima misión.",
    "continueShopping": "Continuar Comprando",
    "orderSummary": "Resumen del Pedido",
    "subtotal": "Subtotal",
    "shipping": "Envío",
    "free": "GRATIS",
    "addForFreeShipping": "Añade {amount} más para envío gratis",
    "total": "Total",
    "proceedToCheckout": "Proceder al Pago",
    "each": "cada uno"
  },
  "checkout": {
    "title": "Pago",
    "ageConfirm": "Al continuar, confirmas que tienes 18 años o más y beberás responsablemente"
  },
  "order": {
    "missionAccomplished": "¡Misión Cumplida!",
    "confirmed": "Tu pedido ha sido confirmado y se está preparando para el despliegue.",
    "orderDetails": "Detalles del Pedido",
    "orderId": "ID del Pedido:",
    "email": "Email:",
    "total": "Total:",
    "whatNext": "¿Qué sigue?",
    "step1": "Recibirás un email de confirmación en {email}",
    "step2": "Tu equipo táctico será preparado y empaquetado",
    "step3": "Te enviaremos información de seguimiento una vez enviado",
    "step4": "Entrega estimada: 3-5 días hábiles",
    "questions": "¿Preguntas sobre tu pedido? Contáctanos en {supportEmail}"
  },
  "auth": {
    "welcomeBack": "Bienvenido de Nuevo",
    "signInDesc": "Inicia sesión para acceder a tu cuenta",
    "email": "Email",
    "password": "Contraseña",
    "signIn": "Iniciar Sesión",
    "signingIn": "Iniciando sesión...",
    "noAccount": "¿No tienes cuenta?",
    "signUp": "Regístrate",
    "joinArsenal": "Únete al Arsenal",
    "signUpDesc": "Crea una cuenta para hacer seguimiento de tus pedidos y más",
    "mustBe18": "Debes ser mayor de 18 para crear una cuenta",
    "name": "Nombre (Opcional)",
    "passwordRequirement": "Debe tener al menos 8 caracteres",
    "createAccount": "Crear Cuenta",
    "creatingAccount": "Creando cuenta...",
    "haveAccount": "¿Ya tienes cuenta?",
    "signOut": "Cerrar Sesión"
  },
  "account": {
    "title": "Mi Cuenta",
    "profile": "Perfil",
    "profileDesc": "Información de tu cuenta",
    "orders": "Pedidos",
    "ordersDesc": "Ver historial de pedidos",
    "ordersInfo": "Sigue las entregas de tu equipo táctico y consulta pedidos anteriores.",
    "viewOrders": "Ver Pedidos (Próximamente)",
    "notSet": "Sin definir"
  },
  "howToPlay": {
    "title": "Cómo Jugar a {productName}",
    "subtitle": "Domina el campo de batalla táctico en 3 sencillos pasos",
    "step1Title": "1. Despliega tus Fuerzas",
    "step1Desc": "Coloca tus proyectiles de artillería (vasos de chupito) en formación sobre el campo de batalla. Cada jugador posiciona sus minas tácticas de forma estratégica para crear obstáculos.",
    "step2Title": "2. Enfréntate al Enemigo",
    "step2Desc": "Lanzad vuestros disparos por turnos. Cuando alcanzas el proyectil de un oponente, bebe. ¿Has alcanzado una mina? Todo el escuadrón se toma un chupito. La estrategia es clave para la victoria.",
    "step3Title": "3. Reclama la Victoria",
    "step3Desc": "El último jugador en pie gana la batalla. Los derrotados deben saludar al vencedor y aceptar su destino como mezclador oficial de bebidas de la fiesta.",
    "importantRules": "Reglas Importantes",
    "rule1": "Los jugadores deben ser mayores de 18 para participar",
    "rule2": "Bebe siempre con responsabilidad y conoce tus límites",
    "rule3": "Designa un conductor sobrio antes de que comience la misión",
    "rule4": "Dejad de jugar si alguien se siente incómodo o indispuesto",
    "getArsenal": "Consigue tu Arsenal"
  },
  "notFound": {
    "title": "404",
    "missionFailed": "Misión Fallida",
    "description": "El objetivo que buscas ha sido neutralizado o nunca existió.",
    "returnToBase": "Volver a la Base"
  },
  "footer": {
    "tagline": "El juego táctico de bebidas para comandantes de fiesta.",
    "shop": "Tienda",
    "allProducts": "Todos los Productos",
    "bundles": "Paquetes",
    "accessories": "Accesorios",
    "support": "Soporte",
    "faq": "Preguntas Frecuentes",
    "contact": "Contáctanos",
    "shipping": "Información de Envío",
    "legal": "Legal",
    "privacy": "Política de Privacidad",
    "terms": "Términos de Servicio",
    "returns": "Devoluciones y Reembolsos",
    "rights": "Todos los derechos reservados."
  }
}
```

Linguistic improvements applied (rationale, not required to verify line by line):
- `home.title` → `{brand}` (was "ARSENAL BORRACHO" — brand should not be translated)
- `home.ctaSubtitle` → uses `{productName}` and `{freeShippingThreshold}`; "sobre $50" → "superiores a {freeShippingThreshold}" (better Spanish for "over $50")
- `home.aboutUs1/3` → `{brand}` instead of literal "Drunken Arsenal"
- `product.freeShippingDesc` → "En pedidos superiores a {freeShippingThreshold}" (same idiomatic fix)
- `order.questions` → `{supportEmail}`
- `howToPlay.title` → "Cómo Jugar a {productName}" (Spanish requires "jugar a X" for games)
- `howToPlay.step1Desc/step2Desc/step3Desc/rule*` → restored fragments dropped from the original translation (obstacles clause, strategy clause, drink-mixer line, etc.)
- `auth.signUpDesc` → "Crea una cuenta para hacer seguimiento de tus pedidos y más" (slight naturalness improvement over "rastrear pedidos")
- `product.ageWarningFull` → "NO APTO PARA MENORES" (more idiomatic than "NO PARA MENORES")
- `checkout.ageConfirm` → idiomatic rephrasing
- `home.aboutUs3` → "que de verdad quieras recordar" (slight flow improvement)

- [ ] **Step 2: Run verification script — es should now pass; de and fr still fail**

Run: `node scripts/check-translations.mjs`
Expected: still exits 1, but es-specific errors are gone. Remaining errors only mention `[de]` and `[fr]`.

- [ ] **Step 3: Commit**

```bash
git add messages/es.json
git commit -m "i18n(es): linguistic refresh and placeholder extraction"
```

---

## Task 5: Update de.json — linguistic pass + placeholders

**Files:**
- Modify: `messages/de.json`

- [ ] **Step 1: Write the full updated file**

Write `messages/de.json` with this exact content:

```json
{
  "nav": {
    "products": "Produkte",
    "howToPlay": "Spielanleitung",
    "about": "Über uns",
    "cart": "Warenkorb",
    "account": "Konto",
    "signIn": "Anmelden"
  },
  "home": {
    "ageWarning": "Spiel hart, trink mit Verstand, erinnere dich an alles",
    "title": "{brand}",
    "subtitle": "Einsetzen. Trinken. Dominieren. Das taktische Trinkspiel, das jede Party zum Schlachtfeld macht.",
    "browseArsenal": "Arsenal durchsuchen",
    "howToPlay": "Spielanleitung",
    "featuredTitle": "Ausgewähltes Arsenal",
    "featuredSubtitle": "Premium taktische Trinkausrüstung für maximale Party-Wirkung",
    "completeArsenal": "Komplettes Arsenal",
    "ctaTitle": "Bereit für den Kampf?",
    "ctaSubtitle": "Schließe dich Tausenden von Party-Kommandanten an, die {productName} bei ihren Treffen eingesetzt haben. Kostenloser Versand ab {freeShippingThreshold}.",
    "startShopping": "Jetzt einkaufen",
    "bundle": "PAKET",
    "inStock": "auf Lager",
    "outOfStock": "Ausverkauft",

    "aboutUs1": "{brand} ist eine Party-Marke für Erwachsene, die ihren Spaß gerne eine Spur übertrieben mögen. Wir entwickeln Trinkspiele und Bar-Accessoires im taktischen Look, die aussehen, als kämen sie aus einem Arsenal, aber ausschließlich für Unterhaltung, Lacher und unvergessliche Abende mit Freunden gedacht sind. Keine echten Waffen, keine Gewalt – nur eine spielerische Parodie in hochwertigem, geschenkfertigem Design.",
    "aboutUs2": "Wir wollen etwas Neues in die Partywelt bringen: nicht nur ein weiteres Trinkspiel, sondern ein komplettes Erlebnis mit einem eigenen Universum – Kommandanten, Missionen, Einsatzregeln und Traditionen, die Teil der Geschichte deiner Gruppe werden. Unsere Produkte sind zum Verschenken gemacht – für Freunde, Kollegen und die eine Person, die schon alles hat, außer einer eigenen taktischen Bar-Ausrüstung.",
    "aboutUs3": "Im Kern folgt {brand} einer einfachen Philosophie: verantwortungsvoll trinken, smart spielen und sich selbst nicht zu ernst nehmen. Wir stehen für Spaß, der Spaß bleibt – mit Respekt vor Grenzen, einem vorher festgelegten Fahrer und Erinnerungen, an die du dich am nächsten Tag gern erinnerst.",

    "whoWeAreTitle": "WER SIND WIR?",
    "missionTitle": "MISSION",
    "missionText": "Jede Zusammenkunft in eine unvergessliche Operation verwandeln – mit Geschichten, die man weitererzählen möchte, statt sie zu bereuen.",
    "whatWeBringTitle": "WAS WIR MITBRINGEN",
    "whatWeBringText": "Taktische Geschenkartikel, hochwertige Verarbeitung und ein komplettes Party-Universum – inklusive Kommandanten, Missionen und Hausregeln.",
    "ourPromiseTitle": "UNSER VERSPRECHEN",
    "ourPromiseText": "Spaß, der Spaß bleibt: klare Grenzen, verantwortungsvolles Trinken und ein Debrief am nächsten Tag, an den du dich wirklich erinnerst.",
    "readyForSomeFun": "BEREIT FÜR EINEN EINSATZ?",
    "yesCommander": "JAWOHL, KOMMANDANT!",
    "designatedDriverNote": "Starte die Mission nur mit nüchternem Fahrer und deiner besten Einheit."
  },
  "product": {
    "backToShop": "Zurück zum Shop",
    "saveUpTo": "SPARE BIS ZU 20%",
    "readyToShip": "Versandbereit",
    "quantity": "Menge:",
    "addToCart": "In den Warenkorb",
    "adding": "Wird hinzugefügt...",
    "freeShipping": "Kostenloser Versand",
    "freeShippingDesc": "Bei Bestellungen ab {freeShippingThreshold}",
    "quality": "Qualitätsgarantie",
    "qualityDesc": "Hochwertige Materialien in taktischer Qualität",
    "returns": "30-Tage-Rückgabe",
    "returnsDesc": "Nicht zufrieden? Volle Rückerstattung garantiert",
    "ageWarningFull": "NUR AB 18 – TRINKE VERANTWORTUNGSVOLL – NICHT FÜR MINDERJÄHRIGE",
    "youMayLike": "Das könnte dir auch gefallen"
  },
  "cart": {
    "title": "Warenkorb",
    "empty": "Dein Arsenal ist leer",
    "emptyDesc": "Zeit, dich für deine nächste Mission mit taktischer Trinkausrüstung einzudecken.",
    "continueShopping": "Weiter einkaufen",
    "orderSummary": "Bestellübersicht",
    "subtotal": "Zwischensumme",
    "shipping": "Versand",
    "free": "KOSTENLOS",
    "addForFreeShipping": "Füge {amount} hinzu für kostenlosen Versand",
    "total": "Gesamt",
    "proceedToCheckout": "Zur Kasse",
    "each": "je"
  },
  "checkout": {
    "title": "Kasse",
    "ageConfirm": "Mit dem Fortfahren bestätigst du, dass du 18 oder älter bist und verantwortungsvoll trinkst"
  },
  "order": {
    "missionAccomplished": "Mission erfüllt!",
    "confirmed": "Deine Bestellung wurde bestätigt und wird für den Einsatz vorbereitet.",
    "orderDetails": "Bestelldetails",
    "orderId": "Bestell-ID:",
    "email": "E-Mail:",
    "total": "Gesamt:",
    "whatNext": "Was passiert als Nächstes?",
    "step1": "Du erhältst eine Bestätigungs-E-Mail an {email}",
    "step2": "Deine taktische Ausrüstung wird vorbereitet und verpackt",
    "step3": "Nach dem Versand erhältst du die Sendungsverfolgung",
    "step4": "Voraussichtliche Lieferung: 3-5 Werktage",
    "questions": "Fragen zu deiner Bestellung? Kontaktiere uns unter {supportEmail}"
  },
  "auth": {
    "welcomeBack": "Willkommen zurück",
    "signInDesc": "Melde dich an, um auf dein Konto zuzugreifen",
    "email": "E-Mail",
    "password": "Passwort",
    "signIn": "Anmelden",
    "signingIn": "Wird angemeldet...",
    "noAccount": "Noch kein Konto?",
    "signUp": "Registrieren",
    "joinArsenal": "Tritt dem Arsenal bei",
    "signUpDesc": "Erstelle ein Konto, um Bestellungen zu verfolgen und mehr",
    "mustBe18": "Du musst 18 oder älter sein, um ein Konto zu erstellen",
    "name": "Name (Optional)",
    "passwordRequirement": "Mindestens 8 Zeichen",
    "createAccount": "Konto erstellen",
    "creatingAccount": "Konto wird erstellt...",
    "haveAccount": "Bereits ein Konto?",
    "signOut": "Abmelden"
  },
  "account": {
    "title": "Mein Konto",
    "profile": "Profil",
    "profileDesc": "Deine Kontoinformationen",
    "orders": "Bestellungen",
    "ordersDesc": "Bestellverlauf anzeigen",
    "ordersInfo": "Verfolge die Lieferungen deiner taktischen Ausrüstung und sieh frühere Bestellungen ein.",
    "viewOrders": "Bestellungen anzeigen (Demnächst)",
    "notSet": "Nicht festgelegt"
  },
  "howToPlay": {
    "title": "So spielst du {productName}",
    "subtitle": "Beherrsche das taktische Trink-Schlachtfeld in 3 einfachen Schritten",
    "step1Title": "1. Setze deine Truppen ein",
    "step1Desc": "Stelle deine Artilleriegranaten (Schnapsgläser) in Formation auf dem Schlachtfeld auf. Jeder Spieler positioniert seine taktischen Minen strategisch, um Hindernisse zu errichten.",
    "step2Title": "2. Bekämpfe den Feind",
    "step2Desc": "Schießt der Reihe nach. Wenn du die Granate eines Gegners triffst, muss er trinken. Eine Mine getroffen? Der ganze Trupp nimmt einen Shot. Strategie ist der Schlüssel zum Sieg.",
    "step3Title": "3. Erringe den Sieg",
    "step3Desc": "Der letzte stehende Spieler gewinnt die Schlacht. Die Besiegten müssen dem Sieger salutieren und ihr Schicksal als offizieller Cocktail-Mixer der Party annehmen.",
    "importantRules": "Wichtige Regeln",
    "rule1": "Spieler müssen 18 oder älter sein, um teilzunehmen",
    "rule2": "Trinke immer verantwortungsvoll und kenne deine Grenzen",
    "rule3": "Bestimmt einen nüchternen Fahrer, bevor die Mission beginnt",
    "rule4": "Hört auf zu spielen, wenn sich jemand unwohl oder unpässlich fühlt",
    "getArsenal": "Hol dir dein Arsenal"
  },
  "notFound": {
    "title": "404",
    "missionFailed": "Mission gescheitert",
    "description": "Das Ziel, das du suchst, wurde neutralisiert oder existierte nie.",
    "returnToBase": "Zurück zur Basis"
  },
  "footer": {
    "tagline": "Das taktische Trinkspiel für Party-Kommandanten.",
    "shop": "Shop",
    "allProducts": "Alle Produkte",
    "bundles": "Pakete",
    "accessories": "Zubehör",
    "support": "Support",
    "faq": "FAQ",
    "contact": "Kontakt",
    "shipping": "Versandinfo",
    "legal": "Rechtliches",
    "privacy": "Datenschutz",
    "terms": "Nutzungsbedingungen",
    "returns": "Rückgabe & Rückerstattung",
    "rights": "Alle Rechte vorbehalten."
  }
}
```

Linguistic improvements applied:
- `home.title` → `{brand}` (was "BETRUNKENES ARSENAL")
- `home.ctaSubtitle` → restored dropped Shot Wave reference (now `{productName}`); added "die ... eingesetzt haben" subordinate clause matching English semantics
- `home.aboutUs1/3` → `{brand}` instead of literal
- `home.yesCommander` → "JAWOHL, KOMMANDANT!" (consistent German "Kommandant", not English "Commander" mixed in)
- `product.freeShippingDesc` → uses `{freeShippingThreshold}`; "ab" is idiomatic for thresholds
- `product.ageWarningFull` → en-dash spacing per German typographic convention
- `product.youMayLike` / `product.qualityDesc` / `product.returns` — minor naturalness tweaks
- `order.confirmed` → "für den Einsatz vorbereitet" (keeps military metaphor consistent with "Mission erfüllt")
- `order.step2/3` → restored fuller phrasing
- `order.questions` → `{supportEmail}`
- `howToPlay.title` → "So spielst du {productName}" (more idiomatic than "Wie man X spielt")
- `howToPlay.subtitle` / `step1Desc` / `step2Desc` / `step3Desc` → restored dropped fragments (obstacles clause, strategy clause, drink-mixer line)
- `howToPlay.rule2/3/4` → restored fuller phrasing matching English source
- `account.ordersInfo` → restored "taktischen Ausrüstung" specificity

- [ ] **Step 2: Run verification script — only fr should still fail**

Run: `node scripts/check-translations.mjs`
Expected: still exits 1, but only `[fr]` errors remain.

- [ ] **Step 3: Commit**

```bash
git add messages/de.json
git commit -m "i18n(de): linguistic refresh and placeholder extraction"
```

---

## Task 6: Update fr.json — linguistic pass + placeholders

**Files:**
- Modify: `messages/fr.json`

- [ ] **Step 1: Write the full updated file**

Write `messages/fr.json` with this exact content:

```json
{
  "nav": {
    "products": "Produits",
    "howToPlay": "Comment Jouer",
    "about": "À Propos",
    "cart": "Panier",
    "account": "Compte",
    "signIn": "Se connecter"
  },
  "home": {
    "ageWarning": "Joue à fond, bois avec raison, souviens-toi de tout",
    "title": "{brand}",
    "subtitle": "Déployer. Boire. Dominer. Le jeu tactique qui transforme chaque fête en champ de bataille.",
    "browseArsenal": "Parcourir l'Arsenal",
    "howToPlay": "Comment Jouer",
    "featuredTitle": "Arsenal en Vedette",
    "featuredSubtitle": "Équipement tactique premium conçu pour un impact maximal en soirée",
    "completeArsenal": "Arsenal Complet",
    "ctaTitle": "Prêt pour la Bataille ?",
    "ctaSubtitle": "Rejoignez des milliers de commandants de fête qui ont déployé {productName} lors de leurs soirées. Livraison gratuite à partir de {freeShippingThreshold}.",
    "startShopping": "Commencer les Achats",
    "bundle": "PACK",
    "inStock": "en stock",
    "outOfStock": "Rupture de stock",

    "aboutUs1": "{brand} est une marque de fête pour adultes qui aiment quand le fun va un peu trop loin. Nous créons des jeux de boisson et des accessoires de bar au look tactique qui semblent sortis d’un arsenal, mais existent uniquement pour le divertissement, les rires et des soirées inoubliables entre amis. Aucune vraie arme, aucune violence – juste une parodie ludique enveloppée dans un design premium prêt à offrir.",
    "aboutUs2": "Nous voulons apporter quelque chose de nouveau au monde des soirées : pas seulement un énième jeu de shots, mais une expérience complète avec son propre univers – commandants, missions, règles d’engagement et traditions qui deviennent une partie de l’histoire de votre groupe. Nos produits sont faits pour être offerts : à des amis, des collègues et à cette personne qui a déjà tout, sauf son propre arsenal de bar tactique.",
    "aboutUs3": "Au cœur de {brand}, il y a une philosophie simple : boire avec responsabilité, jouer intelligemment et ne jamais se prendre trop au sérieux. Nous défendons un fun qui reste fun – avec des limites claires, un conducteur sobre prévu à l’avance et des souvenirs que vous serez heureux de vous rappeler le lendemain.",

    "whoWeAreTitle": "QUI SOMMES-NOUS ?",
    "missionTitle": "MISSION",
    "missionText": "Transformer chaque soirée en opération mémorable – avec des histoires que l’on a envie de raconter, pas de regretter.",
    "whatWeBringTitle": "CE QUE NOUS APPORTONS",
    "whatWeBringText": "Des cadeaux au style tactique, une qualité premium et tout un univers de fête – avec commandants, missions et règles de la maison inclus.",
    "ourPromiseTitle": "NOTRE PROMESSE",
    "ourPromiseText": "Un fun qui reste fun : des limites claires, une consommation responsable et un débrief du lendemain dont vous vous souviendrez vraiment.",
    "readyForSomeFun": "PRÊT POUR UN PEU DE FUN ?",
    "yesCommander": "OUI, COMMANDANT !",
    "designatedDriverNote": "Lancez la mission avec un conducteur sobre et votre meilleure escouade."
  },
  "product": {
    "backToShop": "Retour à la Boutique",
    "saveUpTo": "ÉCONOMISEZ JUSQU'À 20%",
    "readyToShip": "Prêt à expédier",
    "quantity": "Quantité :",
    "addToCart": "Ajouter au Panier",
    "adding": "Ajout en cours...",
    "freeShipping": "Livraison Gratuite",
    "freeShippingDesc": "Sur les commandes de plus de {freeShippingThreshold}",
    "quality": "Qualité Garantie",
    "qualityDesc": "Matériaux de qualité tactique premium",
    "returns": "Retours sous 30 Jours",
    "returnsDesc": "Pas satisfait ? Remboursement complet garanti",
    "ageWarningFull": "RÉSERVÉ AUX 18+ – BUVEZ RESPONSABLEMENT – INTERDIT AUX MINEURS",
    "youMayLike": "Vous Aimerez Aussi"
  },
  "cart": {
    "title": "Panier",
    "empty": "Votre Arsenal est Vide",
    "emptyDesc": "Il est temps de vous approvisionner en équipement tactique pour votre prochaine mission.",
    "continueShopping": "Continuer les Achats",
    "orderSummary": "Résumé de la Commande",
    "subtotal": "Sous-total",
    "shipping": "Livraison",
    "free": "GRATUIT",
    "addForFreeShipping": "Ajoutez {amount} pour bénéficier de la livraison gratuite",
    "total": "Total",
    "proceedToCheckout": "Procéder au Paiement",
    "each": "chacun"
  },
  "checkout": {
    "title": "Paiement",
    "ageConfirm": "En continuant, vous confirmez avoir 18 ans ou plus et boire de manière responsable"
  },
  "order": {
    "missionAccomplished": "Mission Accomplie !",
    "confirmed": "Votre commande a été confirmée et est en cours de préparation pour le déploiement.",
    "orderDetails": "Détails de la Commande",
    "orderId": "ID Commande :",
    "email": "Email :",
    "total": "Total :",
    "whatNext": "Que se passe-t-il ensuite ?",
    "step1": "Vous recevrez un email de confirmation à {email}",
    "step2": "Votre équipement tactique sera préparé et emballé",
    "step3": "Nous vous enverrons les informations de suivi dès l’expédition",
    "step4": "Livraison estimée : 3 à 5 jours ouvrables",
    "questions": "Questions sur votre commande ? Contactez-nous à {supportEmail}"
  },
  "auth": {
    "welcomeBack": "Bon retour parmi nous",
    "signInDesc": "Connectez-vous pour accéder à votre compte",
    "email": "Email",
    "password": "Mot de passe",
    "signIn": "Se Connecter",
    "signingIn": "Connexion en cours...",
    "noAccount": "Pas encore de compte ?",
    "signUp": "S'inscrire",
    "joinArsenal": "Rejoindre l'Arsenal",
    "signUpDesc": "Créez un compte pour suivre vos commandes et plus encore",
    "mustBe18": "Vous devez avoir 18 ans ou plus pour créer un compte",
    "name": "Nom (Optionnel)",
    "passwordRequirement": "Au moins 8 caractères",
    "createAccount": "Créer un Compte",
    "creatingAccount": "Création du compte...",
    "haveAccount": "Déjà un compte ?",
    "signOut": "Se Déconnecter"
  },
  "account": {
    "title": "Mon Compte",
    "profile": "Profil",
    "profileDesc": "Informations de votre compte",
    "orders": "Commandes",
    "ordersDesc": "Voir l'historique des commandes",
    "ordersInfo": "Suivez les livraisons de votre équipement tactique et consultez vos commandes précédentes.",
    "viewOrders": "Voir les Commandes (Prochainement)",
    "notSet": "Non défini"
  },
  "howToPlay": {
    "title": "Comment Jouer à {productName}",
    "subtitle": "Maîtrisez le champ de bataille tactique en 3 étapes simples",
    "step1Title": "1. Déployez vos Forces",
    "step1Desc": "Installez vos obus d'artillerie (verres à shot) en formation sur le champ de bataille. Chaque joueur positionne ses mines tactiques de manière stratégique pour créer des obstacles.",
    "step2Title": "2. Affrontez l'Ennemi",
    "step2Desc": "Tirez à tour de rôle. Quand vous touchez l'obus d'un adversaire, il boit. Vous avez touché une mine ? Toute l'escouade prend un shot. La stratégie est la clé de la victoire.",
    "step3Title": "3. Réclamez la Victoire",
    "step3Desc": "Le dernier joueur debout remporte la bataille. Les vaincus doivent saluer le vainqueur et accepter leur sort en tant que mixeur de cocktails attitré de la soirée.",
    "importantRules": "Règles Importantes",
    "rule1": "Les joueurs doivent avoir 18 ans ou plus pour participer",
    "rule2": "Buvez toujours de manière responsable et connaissez vos limites",
    "rule3": "Désignez un conducteur sobre avant que la mission ne commence",
    "rule4": "Arrêtez de jouer si quelqu'un se sent mal à l'aise ou indisposé",
    "getArsenal": "Obtenez votre Arsenal"
  },
  "notFound": {
    "title": "404",
    "missionFailed": "Mission Échouée",
    "description": "La cible que vous cherchez a été neutralisée ou n'a jamais existé.",
    "returnToBase": "Retour à la Base"
  },
  "footer": {
    "tagline": "Le jeu tactique de boisson pour commandants de fête.",
    "shop": "Boutique",
    "allProducts": "Tous les Produits",
    "bundles": "Packs",
    "accessories": "Accessoires",
    "support": "Support",
    "faq": "FAQ",
    "contact": "Contactez-nous",
    "shipping": "Info Livraison",
    "legal": "Légal",
    "privacy": "Politique de Confidentialité",
    "terms": "Conditions d'Utilisation",
    "returns": "Retours et Remboursements",
    "rights": "Tous droits réservés."
  }
}
```

Linguistic improvements applied:
- `home.title` → `{brand}` (was "ARSENAL IVRE")
- `home.ctaSubtitle` → restored dropped Shot Wave reference (now `{productName}`); added "qui ont déployé ... lors de leurs soirées" clause matching English semantics
- `home.aboutUs1/3` → `{brand}` instead of literal
- `home.ctaTitle`, `home.whoWeAreTitle`, `home.readyForSomeFun`, `order.*Title/Question`, `quantity`, etc. — applied French typographic spacing (`?`, `:` preceded by a non-breaking space — represented as a regular space here for JSON simplicity; consistent with existing style)
- `product.freeShippingDesc` → uses `{freeShippingThreshold}`
- `product.returns` → "Retours sous 30 Jours" (idiomatic)
- `product.ageWarningFull` → "RÉSERVÉ AUX 18+" (more idiomatic than "SEULEMENT 18+")
- `order.confirmed` → restored "en cours de préparation pour le déploiement" (keeps military metaphor)
- `order.step2/3` → restored "et emballé" / "dès l'expédition"
- `order.questions` → `{supportEmail}`
- `howToPlay.title` → uses `{productName}` (kept "Comment Jouer à")
- `howToPlay.subtitle/step1Desc/step2Desc/step3Desc/rule2/3/4` → restored dropped fragments (obstacles clause, strategy clause, drink-mixer line, full rule phrasing)
- `auth.welcomeBack` → "Bon retour parmi nous" (more idiomatic than "Bienvenue")
- `auth.noAccount` → "Pas encore de compte ?" (more natural)
- `footer.tagline` → "jeu tactique de boisson" (restored "de boisson" matching en source)

- [ ] **Step 2: Run verification script — should now PASS**

Run: `node scripts/check-translations.mjs`
Expected stdout: `Translation check passed (key + placeholder parity across locales).` and exit code 0.

- [ ] **Step 3: Commit**

```bash
git add messages/fr.json
git commit -m "i18n(fr): linguistic refresh and placeholder extraction"
```

---

## Task 7: End-to-end verification

**Files:** none modified.

- [ ] **Step 1: Full build**

Run: `pnpm build`
Expected: exit code 0. Pre-existing "Dynamic server usage" warnings unrelated.

- [ ] **Step 2: Re-run parity check**

Run: `node scripts/check-translations.mjs`
Expected: `Translation check passed (key + placeholder parity across locales).` exit 0.

- [ ] **Step 3: Start dev server in background**

Run: `pnpm dev` (in background or separate terminal)
Wait for: `Ready in <time>` on stdout.

- [ ] **Step 4: Manual smoke for each locale**

For each locale `en`, `es`, `de`, `fr`:

1. Open `http://localhost:3000/` in a browser.
2. Open DevTools → Application → Cookies and set/replace cookie `locale` with the locale code.
3. Reload the page.
4. Scroll to the About section. Verify:
   - The text "Drunken Arsenal" appears literally in the paragraphs (NOT `{brand}`, NOT empty).
   - The "Shot Wave" product name appears in the CTA subtitle and in the howToPlay context (when navigating to `/how-to-play`).
   - `$50` appears in the free-shipping copy.
   - No raw placeholder strings (`{xxx}`) leak into the UI.
5. Navigate to `/about` (or the equivalent route in this locale) and repeat the visual check.

If any locale shows a raw placeholder or an empty span where text should be, that's a regression. Go back to the relevant message file and fix.

- [ ] **Step 5: Stop dev server**

Stop `pnpm dev` (Ctrl+C or kill the background job).

- [ ] **Step 6: Verify clean tree and final summary**

Run: `git status`
Expected: clean. All edits already committed in Tasks 1-6.

Run: `git log --oneline -8`
Expected to include (in order):
```
feat(i18n): add brand constants module
chore(i18n): add translation parity check script
feat(i18n): extract brand/product/threshold placeholders in en.json
i18n(es): linguistic refresh and placeholder extraction
i18n(de): linguistic refresh and placeholder extraction
i18n(fr): linguistic refresh and placeholder extraction
```

No additional commit needed in this task.

---

## Post-conditions

- All 4 locale JSON files have identical key structure and matching ICU placeholders for every leaf string.
- `lib/i18n/brand.ts` is the single source of truth for `BRAND`, `PRODUCT_NAME`, `FREE_SHIPPING_THRESHOLD`, `SUPPORT_EMAIL`.
- `AboutUs.tsx` passes `{ brand: BRAND }` to the two relevant `t()` calls.
- `scripts/check-translations.mjs` exits 0; can be wired into CI or a pre-commit hook later (out of scope).
- For customer-facing launch, recommend a native-speaker review of `home.aboutUs1/2/3` and `howToPlay.*` in es/de/fr (noted in spec).