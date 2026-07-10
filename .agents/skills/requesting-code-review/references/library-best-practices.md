# Library Best Practices

Per-library anti-patterns and correct usage. Check these against the diff.

## SWR (`@hooks/useAPI`)

| Rule | Bad | Good |
|------|-----|------|
| Conditional fetch uses null key | `useAPI(id ? `/res/${id}` : '/res')` | `useAPI(id ? `/res/${id}` : null)` |
| One hook per endpoint | Two `useAPI(url)` with same key | Single hook, share via props/context |
| Error state handled | Ignoring `error` return | `if (error) return <Error />` |
| Heavy queries disable revalidateOnFocus | Default (true) on expensive calls | `{ revalidateOnFocus: false }` |
| Manual triggers use useLazySWR | `useAPI` with constantly changing key | `useLazySWR` for user-initiated fetches |

**Pattern reference**: `libs/hooks/src/useAPI.ts`

## Zustand (`@stores/*`)

| Rule | Bad | Good |
|------|-----|------|
| Select specific state | `const store = useStore()` (entire store) | `useStore(s => s.value)` (one field) |
| Object selectors use useShallow | `useStore(s => ({ a: s.a, b: s.b }))` | `useStore(useShallow(s => ({ a: s.a, b: s.b })))` |
| No server state in stores | `fetchUser().then(set)` | Use SWR for API data |
| Access current state via get() | Closures referencing stale state | `get().someValue` inside actions |
| Single responsibility | God-store with 15+ fields | Separate stores per concern |

**Pattern reference**: `libs/stores/src/toastStore.ts`, `libs/stores/src/buildingSelectionStore.ts`

## react-hook-form + Zod (`@components/form`)

| Rule | Bad | Good |
|------|-----|------|
| Schema matches form fields | Schema field ≠ form `name` prop | `type FormData = z.infer<typeof schema>` |
| Always use zodResolver | `useForm({ defaultValues })` only | `useForm({ resolver: zodResolver(schema) })` |
| watch() uses selector | `watch()` (watches ALL fields) | `watch('fieldName')` or `useWatch({ name })` |
| Use project Form components | Raw `<form>` + manual registration | `<Form context={form}>` + `<FormInput>` |
| Validation mode is intentional | Default `onSubmit` when real-time needed | Set `mode: 'onChange'` or `'onBlur'` explicitly |

**Pattern reference**: `libs/components/src/form/form.tsx`, `libs/components/src/form/formInput.tsx`

## Radix UI + shadcn (`@components/ui`)

| Rule | Bad | Good |
|------|-----|------|
| Use `asChild` for composition | `<Button><Link>text</Link></Button>` | `<Button asChild><Link>text</Link></Button>` |
| Keep forwardRef | Removing React.forwardRef | Keep it — Radix still requires it |
| Dialogs use Portal | Content renders inline | `<DialogPortal><DialogContent /></DialogPortal>` |
| CVA for variants | Inline conditional classes | `buttonVariants({ variant, size })` with `cn()` |
| Accessible triggers | Non-button triggers without ARIA | `<DialogTrigger asChild><element /></DialogTrigger>` |

**Pattern reference**: `libs/components/src/ui/button.tsx`, `libs/components/src/ui/dialog.tsx`

## Next.js 16 App Router

| Rule | Bad | Good |
|------|-----|------|
| Params are Promises | `const { id } = params` | `const { id } = use(params)` |
| 'use client' at lowest level | `'use client'` in page.tsx | Client boundary in child component |
| Server Components by default | Marking everything client | Only mark interactive components |
| Suspense around providers | Client providers without boundary | `<Suspense><Providers>{children}</Providers></Suspense>` |
| Error boundaries per segment | Only root error.tsx | `error.tsx` in each route folder |

**Pattern reference**: `apps/listing/src/app/projects/[id]/page.tsx`, `apps/listing/src/app/layout.tsx`

## Tailwind CSS

| Rule | Bad | Good |
|------|-----|------|
| Use cn() for conditional classes | `` className={`px-4 ${x ? 'px-2' : ''}`} `` | `className={cn('px-4', x && 'px-2')}` |
| Theme tokens over arbitrary values | `bg-[#abc123]`, `text-[14px]` | `bg-primary`, `text-sm` |
| Responsive via breakpoints | Inline @media queries | `sm:`, `md:`, `lg:` prefixes |
| No @apply in components | `@apply flex items-center` in component CSS | Inline utility classes |
| cn() resolves conflicts | `className="p-4 p-2"` order-dependent | `cn('p-4', override && 'p-2')` |

**Pattern reference**: `libs/utils/src/cn/cn.ts`, `libs/components/src/ui/button.tsx`

## React 19

| Rule | Bad | Good |
|------|-----|------|
| use() for Promises in components | Top-level await in client component | `const value = use(promise)` |
| Strategic memoization | Removing all useCallback/useMemo | Keep for props passed to memoized children |
| useTransition for async UI | `useState(isLoading)` + manual toggle | `const [isPending, startTransition] = useTransition()` |
| Context re-renders all consumers | Context with large subtree | Zustand for widely-consumed state |

## HTML Semantics

| Rule | Bad | Good |
|------|-----|------|
| Semantic landmark elements | `<div class="header">` | `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`, `<section>`, `<article>` |
| Heading hierarchy | Skipping levels: h1 → h3 | Sequential: h1 → h2 → h3 |
| Interactive elements | `<div onClick>` | `<button>` for actions, `<a>` for navigation |
| Lists for list content | `<div>` for each item | `<ul>`/`<ol>` + `<li>` |
| Form labels | Input without label | `<label htmlFor>` or FormField wrapper (which handles this) |
| Image alt text | `<img>` without alt | `alt="description"` (empty `alt=""` only for decorative) |
| Table structure | Divs styled as table | `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` |
| Dialog/modal | Custom div overlay | Radix Dialog (handles ARIA automatically) |
| Time values | Plain text dates | `<time dateTime="ISO">display</time>` |
