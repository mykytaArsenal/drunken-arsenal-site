# Parallel & Intercepting Routes

Parallel routes render multiple pages in the same layout. Intercepting routes show a different UI when navigating from within your app vs direct URL access. Together they enable modal patterns.

## File Structure

```
app/
├── @modal/                    # Parallel route slot
│   ├── default.tsx            # null — hard-nav fallback (required)
│   ├── page.tsx               # null — matches layout URL on soft nav
│   ├── [...catchAll]/         # null — matches any other sub-URL on soft nav
│   │   └── page.tsx
│   └── (.)photos/             # Intercepts /photos/* on soft nav
│       └── [id]/
│           └── page.tsx       # Modal content
├── photos/
│   └── [id]/
│       └── page.tsx           # Full page (direct access)
├── layout.tsx                 # Renders both children and @modal
└── page.tsx
```

`default.tsx`, `page.tsx`, `[...catchAll]/page.tsx` are all needed together — each fires on a different scenario. See [Closing on client-side nav](#closing-on-client-side-nav-requires-explicit-slot-matches--not-defaulttsx).

## Step 1: Root Layout with Slot

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
```

## Step 2: Default File (Critical!)

**Every parallel route slot MUST have a `default.tsx`** to prevent 404s on hard navigation.

```tsx
// app/@modal/default.tsx
export default function Default() {
  return null;
}
```

Without this file, refreshing any page will 404 because Next.js can't determine what to render in the `@modal` slot.

## Step 3: Intercepting Route (Modal)

The `(.)` prefix intercepts routes at the same level.

```tsx
// app/@modal/(.)photos/[id]/page.tsx
import { Modal } from '@/components/modal';

export default async function PhotoModal({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const photo = await getPhoto(id);

  return (
    <Modal>
      <img src={photo.url} alt={photo.title} />
    </Modal>
  );
}
```

## Step 4: Full Page (Direct Access)

```tsx
// app/photos/[id]/page.tsx
export default async function PhotoPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const photo = await getPhoto(id);

  return (
    <div className="full-page">
      <img src={photo.url} alt={photo.title} />
      <h1>{photo.title}</h1>
    </div>
  );
}
```

## Step 5: Modal Component with Correct Closing

**Closing strategy depends on how the modal can be opened:**

| User entry point | Safe close method |
|---|---|
| Only via in-app Link/`router.push` (soft nav) | `router.back()` |
| Also via direct URL, refresh, shared link (hard nav) | `<Link href="/parent">` or `router.push('/parent')` |

`router.back()` walks the history stack. On hard nav (direct URL paste, new tab, refresh) there is **no in-app entry before the modal** — `router.back()` exits the site or goes to an external page. Per [Next.js docs](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes#modals), the recommended close is `<Link href="/parent">` — it works for both cases.

```tsx
// components/modal.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

export function Modal({ children, parentHref }: { children: React.ReactNode; parentHref: string }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Dismiss triggers (ESC, overlay) need imperative nav — push to parent,
  // same destination as the close Link.
  const close = useCallback(() => {
    router.push(parentHref);
  }, [router, parentHref]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) close(); }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <Link href={parentHref} className="absolute top-4 right-4">
          Close
        </Link>
        {children}
      </div>
    </div>
  );
}
```

### Closing on client-side nav requires explicit slot matches — NOT `default.tsx`

**Critical, not-obvious Next.js behavior:** `default.tsx` only fires on **hard navigation** fallback. On **client-side navigation** away from the modal URL, Next.js keeps the slot's previous content visible until it finds an explicit match. So a close-via-push only works if the destination URL has a matching `page.tsx` inside the slot.

Minimum files needed for a `@modal` slot that closes cleanly on soft nav:

```
app/
├── @modal/
│   ├── default.tsx              # null — hard-nav fallback
│   ├── page.tsx                 # null — matches the layout URL itself
│   ├── [...catchAll]/page.tsx   # null — matches any unrelated sub-URL
│   └── (.)photos/[id]/page.tsx  # modal content (intercept)
├── photos/[id]/page.tsx
├── layout.tsx
└── page.tsx
```

Omit any of `default.tsx` / `page.tsx` / `[...catchAll]` and the modal will "stick" — URL changes, old modal stays mounted.

## Route Matcher Reference

Matchers match **route segments**, not filesystem paths:

| Matcher | Matches | Example |
|---------|---------|---------|
| `(.)` | Same level | `@modal/(.)photos` intercepts `/photos` |
| `(..)` | One level up | `@modal/(..)settings` from `/dashboard/@modal` intercepts `/settings` |
| `(..)(..)` | Two levels up | Rarely used |
| `(...)` | From root | `@modal/(...)photos` intercepts `/photos` from anywhere |

**Common mistake**: Thinking `(..)` means "parent folder" - it means "parent route segment".

## Handling Hard Navigation

When users directly visit `/photos/123` (bookmark, refresh, shared link):
- The intercepting route is bypassed (`(.)` only runs on soft nav)
- The full `photos/[id]/page.tsx` renders
- `@modal` slot falls back to `default.tsx` → `null`

### Pattern A: Full-page on direct access (Nextgram-style)

Leave `app/photos/[id]/page.tsx` as a standalone full page. Direct URL → full page, no modal. Simple, canonical.

### Pattern B: Base page + modal overlay on direct access too

Use this when the underlying page should stay visible behind the modal even on refresh (e.g. a details modal on top of a listing detail page).

**Do NOT render the modal inside the main-slot fallback page.** That double-renders: main slot has the modal AND `@modal` also renders it via intercept on the next client nav, producing two modal instances + duplicate API calls.

Correct structure — modal lives **only** inside `@modal` slot, with both intercept and non-intercept routes:

```
app/parent/[id]/
├── layout.tsx                              # renders {children}{modal}
├── page.tsx                                # base page
├── @modal/
│   ├── default.tsx                         # null
│   ├── page.tsx                            # null
│   ├── [...catchAll]/page.tsx              # null
│   ├── (.)photos/[photoId]/page.tsx        # modal (soft nav)
│   └── photos/[photoId]/page.tsx           # modal (hard nav, non-intercept)
└── photos/[photoId]/page.tsx               # re-renders the base page ONLY (no modal)
```

On hard nav, Next.js matches the non-intercept `@modal/photos/[photoId]/page.tsx` for the slot and the main slot's `photos/[photoId]/page.tsx` for the base page — one modal, one base page. On soft nav, intercept takes precedence in the slot; main slot stays on the parent's `page.tsx`.

Extract the modal rendering into a shared client component so both `@modal` pages delegate to it.

## Common Gotchas

### 1. Missing `default.tsx` → 404 on Refresh

Every `@slot` folder needs a `default.tsx` that returns `null` (or appropriate content).

### 2. Modal Persists After Navigation

The destination URL has no explicit match inside the `@modal` slot. `default.tsx` does NOT fire on client-side nav. Add `@slot/page.tsx` (matches the layout URL itself) and `@slot/[...catchAll]/page.tsx` (matches any other URL), both returning `null`.

### 3. Nested Parallel Routes Need Defaults Too

If you have `@modal` inside a route group, each level needs its own `default.tsx`:

```
app/
├── (marketing)/
│   ├── @modal/
│   │   └── default.tsx     # Needed!
│   └── layout.tsx
└── layout.tsx
```

### 4. Intercepted Route Shows Wrong Content

Check your matcher:
- `(.)photos` intercepts `/photos` from the same route level
- If your `@modal` is in `app/dashboard/@modal`, use `(.)photos` to intercept `/dashboard/photos`, not `/photos`

### 5. TypeScript Errors with `params`

In Next.js 15+, `params` is a Promise:

```tsx
// Correct
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

## Complete Example: Photo Gallery Modal

```
app/
├── @modal/
│   ├── default.tsx
│   └── (.)photos/
│       └── [id]/
│           └── page.tsx
├── photos/
│   ├── page.tsx           # Gallery grid
│   └── [id]/
│       └── page.tsx       # Full photo page
├── layout.tsx
└── page.tsx
```

Links in the gallery:

```tsx
// app/photos/page.tsx
import Link from 'next/link';

export default async function Gallery() {
  const photos = await getPhotos();

  return (
    <div className="grid grid-cols-3 gap-4">
      {photos.map(photo => (
        <Link key={photo.id} href={`/photos/${photo.id}`}>
          <img src={photo.thumbnail} alt={photo.title} />
        </Link>
      ))}
    </div>
  );
}
```

Clicking a photo → Modal opens (intercepted)
Direct URL → Full page renders
Refresh while modal open → Full page renders
