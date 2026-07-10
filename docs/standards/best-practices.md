# Best Practices

This document outlines recommended patterns and anti-patterns for working with the Reelly architecture.

---

## Table of Contents

- [General Principles](#general-principles)
- [Feature Development](#feature-development)
- [Data Access](#data-access)
- [UI Components](#ui-components)
- [State Management](#state-management)
- [Next.js (App Router)](#nextjs-app-router)
- [React 19 & Performance](#react-19--performance)
- [Data Fetching (SWR)](#data-fetching-swr)
- [Forms (React Hook Form + Zod)](#forms-react-hook-form--zod)
- [Styling (Tailwind)](#styling-tailwind)
- [Error Reporting](#error-reporting)
- [Accessibility](#accessibility)
- [Common Anti-Patterns](#common-anti-patterns)
- [Code Quality](#code-quality)

---

## General Principles

### ✅ DO: Start with the Simplest Solution

Don't over-engineer. Start simple and refactor as needs emerge.

```typescript
// ✅ Good - Simple component
export function SearchFeature() {
  const { data: projects } = useProjects();
  return <ProjectList projects={projects} />;
}

// ❌ Bad - Over-engineered from the start
export function SearchFeature() {
  const strategy = useSearchStrategy();
  const adapter = useDataAdapter();
  const transformer = useTransformer();
  const presenter = usePresenter();
  // ... 50 more lines of abstraction
}
```

### ✅ DO: Follow the Dependency Rules

Always respect scope and type boundaries.

```typescript
// ✅ Good - Feature depends on data-access
import { useProjects } from '@listing/domain/listings/data-access-listings';

// ❌ Bad - Data-access depends on feature
import { transformProject } from '@listing/domain/listings/feature-search';
```

### ✅ DO: Use Barrel Exports

Always import from `index.ts`, never deep import.

```typescript
// ✅ Good
import { Filters } from '../components';
import { useFilters } from '../hooks';

// ❌ Bad
import { Filters } from '../components/filters/Filters';
import { useFilters } from '../hooks/useFilters';
```

### ✅ DO: Keep Apps Thin

Apps should only handle routing and orchestration.

```typescript
// ✅ Good - App just renders feature
// apps/listing/src/app/page.tsx
import { SearchFeature } from '@listing/domain/listings/feature-search';

export default function HomePage() {
  return <SearchFeature />;
}

// ❌ Bad - Business logic in app
export default function HomePage() {
  const [filters, setFilters] = useState({});
  const projects = useProjects(filters);
  // ... 50 lines of logic
  return <div>{/* ... */}</div>;
}
```

---

## Feature Development

### ✅ DO: Export from Container Folder

Features export entry points from the `container/` folder. Typically one, but can be multiple.

```typescript
// ✅ Good - Single entry point
// libs/listing-app/domain/listings/feature-search/index.ts
export { SearchFeature } from './container/SearchFeature';

// ✅ Good - Multiple entry points
// libs/listing-app/domain/projects/feature-projects/index.ts
export { ProjectDetails } from './container/ProjectDetails';
export { ProjectGallery } from './container/ProjectGallery';
export { ProjectMap } from './container/ProjectMap';

// ❌ Bad - Exporting internal components
export { SearchFeature } from './container/SearchFeature';
export { Filters } from './components/filters/Filters'; // NO! Internal component
export { ProjectList } from './components/project-list/ProjectList'; // NO! Internal component
```

### ✅ DO: Transform Data in Features

Data transformation happens in features, not data-access.

```typescript
// ✅ Good - Feature transforms data
export function SearchFeature() {
  const { data: rawProjects } = useProjects(filters);

  const displayProjects = rawProjects?.map(p => ({
    ...p,
    formattedPrice: formatCurrency(p.price),
    displayName: `${p.name} - ${p.location}`,
  }));

  return <ProjectList projects={displayProjects} />;
}

// ❌ Bad - Transformation in data-access
export function useProjects(filters: IFilters) {
  const { data } = useSWR('/projects', fetcher);
  return {
    ...data,
    projects: data?.projects.map(p => ({
      ...p,
      formattedPrice: formatCurrency(p.price), // NO!
    }))
  };
}
```

### ✅ DO: Colocate Related Code

Keep related code close together within the feature.

```typescript
// ✅ Good - Filter logic lives with Filters component
components/
├── Filters/
│   ├── Filters.tsx
│   ├── PriceFilter.tsx
│   ├── BedroomFilter.tsx
│   ├── useFilterState.ts      # Colocated hook
│   └── index.ts

// ❌ Bad - Scattered organization
components/filters/Filters.tsx
hooks/filters/useFilterState.ts
utils/filters/filterHelpers.ts
types/filters/filterTypes.ts
```

### ✅ DO: Use Feature-Scoped State

Use Zustand stores scoped to the feature, not global state.

```typescript
// ✅ Good - Feature-scoped store
// libs/listing-app/domain/listings/feature-search/stores/searchUIStore.ts
import { create } from 'zustand';

type ISearchUIStore = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

export const useSearchUIStore = create<ISearchUIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// ❌ Bad - Global store for feature-specific state
// libs/shared/stores/global-store.ts
type IGlobalStore = {
  searchSidebarOpen: boolean;
  mapZoomLevel: number;
  // ... mixing concerns
};
```

---

## Data Access

### ✅ DO: Return Raw Data

Data-access should return exactly what the API returns.

```typescript
// ✅ Good - Return raw data
export function useProjects(filters: IFilters) {
  return useSWR(['/projects', filters], () =>
    api.get('/projects', { params: filters }).then((r) => r.data)
  );
}

// ❌ Bad - Transforming in data-access
export function useProjects(filters: IFilters) {
  const { data } = useSWR('/projects', fetcher);
  return {
    ...data,
    projects: data?.projects.map(transformProject), // NO!
  };
}
```

### ✅ DO: Keep API Functions Private

Export hooks, not API functions.

```typescript
// ✅ Good
// api/projects.ts (private)
export const projectsApi = {
  list: (filters: IFilters) => api.get('/projects', { params: filters }),
};

// hooks/useProjects.ts (public)
export function useProjects(filters: IFilters) {
  return useSWR(['/projects', filters], () =>
    projectsApi.list(filters).then((r) => r.data)
  );
}

// index.ts
export { useProjects } from './hooks/useProjects';
// Don't export projectsApi

// ❌ Bad - Exporting API functions
export { projectsApi } from './api/projects';
```

### ✅ DO: Name Data-Access Explicitly

Always include the domain name in data-access libraries.

```
✅ Good:
data-access-listings
data-access-projects
data-access-admin

❌ Bad:
data-access          # Too generic!
listings-data
api-listings
```

---

## UI Components

### ✅ DO: Make UI Components Presentational

UI components should receive data via props, not fetch it.

```typescript
// ✅ Good - Presentational
type IPropertyCardProps = {
  project: IProject;
  onViewDetails?: (id: string) => void;
};

export function PropertyCard({ project, onViewDetails }: IPropertyCardProps) {
  return (
    <Card>
      <h3>{project.name}</h3>
      <p>{formatCurrency(project.price)}</p>
      <Button onClick={() => onViewDetails?.(project.id)}>Details</Button>
    </Card>
  );
}

// ❌ Bad - Fetching data in UI
export function PropertyCard({ projectId }: { projectId: string }) {
  const { data: project } = useProject(projectId); // NO!
  return <Card>{/* ... */}</Card>;
}
```

### ✅ DO: Use Three Tiers of UI

- `ui-primitives` - Primitives (Button, Input)
- `ui-composed` - Generic compositions (FormField)
- `ui-business` - Business components (PropertyCard)

```typescript
// ✅ Good - Clear separation
import { Button } from '@shared/ui-primitives'; // Primitive
import { FormField } from '@shared/ui-composed'; // Generic composition
import { PropertyCard } from '@listing/shared/ui-business'; // Business

// ❌ Bad - All in one library
import { Button, FormField, PropertyCard } from '@shared/ui-primitives';
```

### ✅ DO: Compose UI Components

Build complex UIs by composing simple components.

```typescript
// ✅ Good - Composition
export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid">
      {projects.map(project => (
        <PropertyCard
          key={project.id}
          project={project}
          onViewDetails={handleViewDetails}
        />
      ))}
    </div>
  );
}

// ❌ Bad - Monolithic component
export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid">
      {projects.map(project => (
        <div key={project.id} className="card">
          {/* 100 lines of inline JSX */}
        </div>
      ))}
    </div>
  );
}
```

---

## State Management

### ✅ DO: Use the Right State Solution

- **Server state** → SWR
- **UI state** → React Context or Zustand (feature-scoped)
- **Form state** → React Hook Form

```typescript
// ✅ Good - Server state with SWR
const { data: projects } = useProjects(filters);

// ✅ Good - UI state with Zustand (feature-scoped)
const { sidebarOpen, toggleSidebar } = useSearchUIStore();

// ✅ Good - Form state with React Hook Form
const { register, handleSubmit } = useForm<FilterFormData>();
```

### ✅ DO: Keep State as Local as Possible

Don't lift state unless necessary.

```typescript
// ✅ Good - Local state
export function Filters() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button onClick={() => setExpanded(!expanded)}>Toggle</button>
      {expanded && <FilterDetails />}
    </div>
  );
}

// ❌ Bad - Unnecessarily global
const useGlobalStore = create(set => ({
  filtersExpanded: false,
  toggleFilters: () => set(s => ({ filtersExpanded: !s.filtersExpanded })),
}));
```

### ✅ DO: Scope Zustand Stores to Features

Each feature can have its own store.

```typescript
// ✅ Good - Feature-scoped
// libs/listing-app/domain/listings/feature-search/stores/searchUIStore.ts
export const useSearchUIStore = create<SearchUIStore>(/* ... */);

// libs/listing-app/domain/listings/feature-map/stores/mapUIStore.ts
export const useMapUIStore = create<MapUIStore>(/* ... */);

// ❌ Bad - One giant store
// libs/shared/stores/global-store.ts
export const useGlobalStore = create({
  searchSidebarOpen: false,
  mapZoomLevel: 10,
  filtersPanelOpen: true,
  // ... everything mixed together
});
```

---

## Next.js (App Router)

### ✅ DO: Keep `page.tsx` a Thin Server Entry

Pages stay Server Components; interactivity lives in a client root rendered by the page. Push `'use client'` as deep as possible — a client boundary makes every import below it client-side.

```typescript
// ✅ Good - server page renders a client root
// apps/listing/src/app/settings/profile-edit/page.tsx
import { ProfileEditRoot } from './components/ProfileEditRoot';

export default function ProfileEditPage() {
  return <ProfileEditRoot />; // 'use client' lives inside ProfileEditRoot
}

// ❌ Bad - 'use client' on the page makes the whole route client-side
'use client';
export default function ProfileEditPage() { /* ... */ }
```

### ✅ DO: Treat `params` / `searchParams` as Async

Since Next.js 15 these are Promises in Server Components. In client components, `useSearchParams`/`usePathname` must be wrapped in a `<Suspense>` boundary or the route bails out to CSR.

```typescript
// ✅ Good
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
}
```

### ❌ DON'T: Make Client Components Async

An `async` function component with `'use client'` is invalid — data comes from SWR hooks (client) or is fetched in a Server Component and passed down as serializable props.

### ✅ DO: Use `next/image` and `next/link`

`<Image>` over `<img>` (add domains to `next.config` for remote sources; `priority` for the LCP image), `<Link>` over `<a>` for internal navigation. Anchor-only navigation (e.g. section nav in `ProfileEditRoot`) is fine with `<a href="#...">`.

---

## React 19 & Performance

### ✅ DO: Let the React Compiler Do the Memoization

The repo has the React Compiler enabled — do **not** wrap everything in `useMemo`/`useCallback`/`memo` by default. Write plain code; add manual memoization only where the compiler bails out and a profile shows a problem.

```typescript
// ✅ Good - plain derived value; compiler memoizes
const options = countries.map((c) => ({ value: c.id, label: c.name }));

// ❌ Bad - hand-rolled memo noise the compiler already covers
const options = useMemo(
  () => countries.map((c) => ({ value: c.id, label: c.name })),
  [countries]
);
```

Watch ESLint for `Compilation Skipped: Use of incompatible library` — that component lost compiler optimization. Known repo case: `form.watch(callback)` subscriptions; use `useWatch({ control, name })` instead.

### ✅ DO: Parallelize Independent Async Work

```typescript
// ✅ Good
const [profile, countries] = await Promise.all([getProfile(), getCountries()]);

// ❌ Bad - sequential waterfall
const profile = await getProfile();
const countries = await getCountries();
```

### ✅ DO: Import Heavy Libraries Directly / Dynamically

Barrel files (`index.ts`) re-exporting a heavy dependency pull it into every consumer's bundle (and break Jest). Known repo case: `@components/form` re-exports `FormTextarea` → `@uiw/react-md-editor`.

```typescript
// ✅ Good - direct module import
import { FormInput } from '@components/form/formInput';

// ✅ Good - heavy component loaded on demand
const MdEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

// ❌ Bad - barrel import drags the markdown editor into the login page
import { FormInput } from '@components/form';
```

### ✅ DO: Derive State in Render, Not in Effects

```typescript
// ✅ Good
const isComplete = otp.length === OTP_LENGTH;

// ❌ Bad - extra render + drift risk
useEffect(() => setIsComplete(otp.length === OTP_LENGTH), [otp]);
```

Also: use functional `setState` for stable callbacks (`set((s) => !s)`), refs for transient values that shouldn't re-render, and ternaries over `&&` when the left side can be `0`.

---

## Data Fetching (SWR)

### ✅ DO: Use the Typed API Hooks with Endpoint Constants

```typescript
import { useAPI } from '@hooks/useAPI';
import { endpoints } from '@constants';

const { data } = useAPI<ProjectType>(endpoints.projects);
```

### ✅ DO: Mutate the Cache After Writes

After a successful write, update the SWR cache — optimistically when the response is known, otherwise revalidate.

```typescript
// ✅ Good - optimistic cache update (profile photo upload)
mutate((current) => ({ ...current, profile_picture: { url } }), {
  revalidate: false,
});

// ❌ Bad - full page reload or window.location tricks to "refresh" data
```

### ❌ DON'T: Refetch What SWR Already Deduplicates

Multiple components may call the same `useAPI(key)` — SWR dedups by key. Don't lift the data into a store or context "to avoid double fetching".

---

## Forms (React Hook Form + Zod)

### ✅ DO: Centralize Validation in a Zod Schema for Multi-Field Forms

One schema + `zodResolver`, types inferred via `z.infer`. Reference implementation: `apps/listing/src/app/settings/profile-edit/` (`schema.ts` + `useProfileForm.ts`).

```typescript
const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company_website: z.url('Enter a valid URL').or(z.literal('')).nullable(),
});
type IProfileFormValues = z.infer<typeof profileSchema>;

const form = useForm<IProfileFormValues>({
  resolver: zodResolver(profileSchema),
  values, // seed from SWR
  resetOptions: { keepDirtyValues: true }, // don't clobber user edits
});
```

Always provide `defaultValues`/`values` for every field — otherwise inputs flip from uncontrolled to controlled.

### ✅ DO: Use Zod v4 Top-Level Validators

`z.email()`, `z.url()` — the `z.string().email()` form is deprecated in v4. For RHF `rules.validate`, reuse shared validators from `@utils/validation` (e.g. `emailValidator` delegates to `z.email()`).

### ❌ DON'T: Register the Same Field Name from Two Controllers

**One field name = one source of rules.** A second `useController` on the same name overwrites rule keys — registration order changes across re-renders, so the winner is unstable. This silently disabled `required` on the login form (empty email reached the API; fixed in `FormField`).

```typescript
// ❌ Bad - FormField registering rules for a name FormInput already owns
useController({ name, rules: { required: false } }); // stomps the real rule

// ✅ Good - display-only consumers read state, they don't register rules
useController({ name }); // or useFormState({ name })
```

Corollary for shared validators: `validate` functions must return `true` for empty values — emptiness is `required`'s job. Otherwise optional fields break.

### ✅ DO: Add `noValidate` to Forms That Own Their Validation

Native browser bubbles (from `type="email"` etc.) are unstyled, browser-localized, and fire before RHF. `<Form noValidate>` keeps all errors in one consistent system.

### ✅ DO: Map Server Errors onto Fields

HTTP 4xx with field details → `setError(field, { message })` + scroll to the first error (`onInvalid`); everything else → toast with a human message. Reference: `mapProfileError.ts`, `parseAuthError.ts`.

### ✅ DO: Split Wizards into Per-Step Forms

Each step owns its `useForm`; the wizard lifts only committed values (see `SignupWizard` → `StepEmail`/`StepPhone`/`StepProfile`). Validate a step with `trigger([...fields])` before advancing.

---

## Styling (Tailwind)

### ✅ DO: Compose Classes with `cn()`

```typescript
import { cn } from '@utils/cn';

<span className={cn('rounded-md border', error && 'border-red-500', className)} />
```

### ✅ DO: Use Design Tokens, Not Raw Values

Prefer semantic tokens (`bg-background`, `text-muted-foreground`, `border-input`, `text-destructive`) over hard-coded colors (`bg-white`, `text-gray-500`) — they keep theming consistent. Arbitrary values (`w-[123px]`) are a last resort.

### ✅ DO: Write Mobile-First and Hover-Safe

Base styles for mobile, scale up with `sm:`/`md:`/`lg:`. For hover styles use the repo's `media-hover:hover:*` variant so touch devices don't get sticky hover states.

---

## Error Reporting

### ✅ DO: Route Errors Through `Logger`

```typescript
import { Logger } from '@utils/logger';

Logger.error('Photo upload failed', error);
```

Never call `Sentry.captureException`/`captureMessage` directly in feature code — `Logger` dedups Axios errors already handled by interceptors and attaches context. Show users a parsed, human message (`parseAuthError` pattern), not raw error text.

---

## Accessibility

### ✅ DO: Keep Interactive Patterns Keyboard-Complete

Custom inputs must handle keys, not just clicks — e.g. `OtpInput` supports typing, paste, and Backspace/Delete (clears right-to-left). Radix primitives cover focus traps/ARIA for dialogs, selects, tooltips — don't rebuild them by hand.

```tsx
// ✅ Good - icon-only / composite controls stay labeled
<div role="group" aria-label="Verification code input">
  <input aria-label={`Digit ${index + 1}`} inputMode="numeric" />
</div>
```

Error messages belong next to the field (with `role="alert"` where they appear dynamically); after a failed submit, move focus/scroll to the first invalid field.

---

## Common Anti-Patterns

### ❌ DON'T: Create Circular Dependencies

```typescript
// ❌ Bad - Circular dependency
// feature-search → data-access-listings
// data-access-listings → feature-search  // NO!

// ✅ Good - One-way dependency
// feature-search → data-access-listings
// data-access-listings → util-projects
```

### ❌ DON'T: Deep Import

```typescript
// ❌ Bad
import { PriceFilter } from '../components/filters/price-filter/PriceFilter';

// ✅ Good
import { PriceFilter } from '../components/filters/price-filter';
```

### ❌ DON'T: Export Everything

```typescript
// ❌ Bad - Re-exporting everything
export * from './SearchFeature';
export * from './Filters';
export * from './ProjectList';

// ✅ Good - Explicit exports
export { SearchFeature } from './SearchFeature';
// Filters and ProjectList are private
```

### ❌ DON'T: Use Interfaces

```typescript
// ❌ Bad - Using interface
interface IProject {
  id: string;
  name: string;
}

// ✅ Good - Using type
type IProject = {
  id: string;
  name: string;
};
```

### ❌ DON'T: Mix Business Logic in UI Components

```typescript
// ❌ Bad - Business logic in UI
export function PropertyCard({ project }: PropertyCardProps) {
  const discountedPrice = useMemo(() => {
    // 20 lines of discount calculation logic
  }, [project]);

  return <Card>{/* ... */}</Card>;
}

// ✅ Good - Logic in feature or utility
// utils/calculate-discount.ts
export const calculateDiscountedPrice = (project: IProject) => {
  // 20 lines of logic
};

// PropertyCard.tsx
export function PropertyCard({ project }: PropertyCardProps) {
  return <Card>{formatCurrency(project.price)}</Card>;
}
```

### ❌ DON'T: Create Generic "Helpers" or "Utils" Libraries

```
❌ Bad:
libs/shared/helpers/
libs/shared/utils/

✅ Good:
libs/shared/util-formatting/
libs/shared/util-validation/
libs/shared/util-api/
```

---

## Code Quality

### ✅ DO: Use TypeScript Strictly

Enable strict mode and avoid `any`.

```typescript
// ✅ Good
type IProjectListProps = {
  projects: IProject[];
  onViewDetails: (id: string) => void;
};

// ❌ Bad
type IProjectListProps = {
  projects: any; // NO!
  onViewDetails: any; // NO!
};
```

### ✅ DO: Use Meaningful Names

Names should clearly indicate purpose.

```typescript
// ✅ Good
const displayProjects = rawProjects?.map(transformProjectForDisplay);
const formattedPrice = formatCurrency(project.price);

// ❌ Bad
const data = rawProjects?.map(transform);
const x = formatCurrency(project.price);
```

### ✅ DO: Keep Functions Small

Functions should do one thing well.

```typescript
// ✅ Good - Small, focused functions
const filterByPrice = (projects: IProject[], range: IPriceRange) =>
  projects.filter((p) => p.price >= range.min && p.price <= range.max);

const filterByBedrooms = (projects: IProject[], bedrooms: number) =>
  projects.filter((p) => p.bedrooms === bedrooms);

const applyFilters = (projects: IProject[], filters: IFilters) => {
  let filtered = projects;
  if (filters.priceRange)
    filtered = filterByPrice(filtered, filters.priceRange);
  if (filters.bedrooms) filtered = filterByBedrooms(filtered, filters.bedrooms);
  return filtered;
};

// ❌ Bad - One giant function
const applyFilters = (projects: IProject[], filters: IFilters) => {
  // 100 lines of filtering logic
};
```

### ✅ DO: Use Constants for Magic Values

```typescript
// ✅ Good
const MAX_PRICE = 10000000;
const MIN_BEDROOMS = 1;
const DEFAULT_PAGE_SIZE = 25;

const isValidPrice = (price: number) => price <= MAX_PRICE;

// ❌ Bad
const isValidPrice = (price: number) => price <= 10000000;
```

### ✅ DO: Document Complex Logic

Add JSDoc for complex functions and public APIs.

```typescript
// ✅ Good
/**
 * Calculates the payment plan for a project based on installments
 * @param project - The project to calculate payment for
 * @param installments - Number of installment periods
 * @returns Payment breakdown by period
 */
export const calculatePaymentPlan = (
  project: IProject,
  installments: number
): IPaymentPlan => {
  // Complex calculation logic
};

// ❌ Bad - No documentation for complex logic
export const calculatePaymentPlan = (
  project: IProject,
  installments: number
) => {
  // 50 lines of complex logic with no explanation
};
```

---

## Quick Reference

### DO ✅

- Follow dependency rules
- Use barrel exports (index.ts)
- Keep apps thin
- Export entry points from `container/` folder
- Transform data in features
- Return raw data from data-access
- Make UI components presentational
- Use feature-scoped state
- Name libraries explicitly
- Use types (not interfaces)
- Use kebab-case for component folders
- Keep `page.tsx` a server entry; push `'use client'` down
- Let the React Compiler memoize; fix its ESLint bailout warnings
- Centralize form validation in a Zod schema (`zodResolver`)
- Add `noValidate` to forms that own their validation
- Mutate the SWR cache after writes
- Route errors through `Logger`
- Compose classes with `cn()` and semantic tokens

### DON'T ❌

- Create circular dependencies
- Deep import
- Export everything
- Transform data in data-access
- Fetch data in UI components
- Use global state for feature state
- Use generic library names
- Use interfaces
- Mix business logic in UI
- Use `any` type
- Make client components `async`
- Register the same field name from two controllers
- Import heavy libraries through barrels (e.g. md-editor)
- Call `Sentry.capture*` directly in feature code
- Hand-roll `useMemo`/`useCallback` without a measured need

---

## Summary

Following these best practices will help you:

- Maintain clean architecture
- Avoid common pitfalls
- Write maintainable code
- Scale the codebase effectively

**When in doubt:**

1. Check [Dependency Rules](../architecture/dependency-rules.md)
2. Review [Developer Guides](../guides/README.md)
3. Ask the team

---

[← Back to Coding Standards](./README.md)
