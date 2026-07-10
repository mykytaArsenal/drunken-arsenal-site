# Codebase Patterns (Actual)

Real patterns from the current codebase with file paths. These are how things ARE, not how docs say they should be.

## Path Aliases (tsconfig.json)

```
@api           → libs/api/src/index.ts
@components/*  → libs/components/src/*
@config        → libs/config/src/index.ts
@constants     → libs/constants/src/index.ts
@environment   → libs/environment/src/index.ts
@hooks/*       → libs/hooks/src/*
@monitoring    → libs/monitoring/src/index.ts
@stores/*      → libs/stores/src/*
@types         → libs/types/src/index.ts
@utils/*       → libs/utils/src/*
```

## API Integration

### API Instances (`libs/api/src/lib/api.ts`)
- `api` — Main authenticated API (Xano-Authorization header)
- `adminApi` — Admin API with JWT refresh
- `commonApi` — Supports both auth methods
- `noCodeApi` / `noCodeAuthApi` — No-code platform integration

### Endpoints (`libs/constants/src/lib/endpoints.ts`)
All API endpoint paths defined as constants.

### SWR Hooks (`libs/hooks/src/useAPI.ts`)
```typescript
import { useAPI, useAdminAPI, useCommonAPI } from '@hooks/useAPI';
import { endpoints } from '@constants';

// Standard fetch
const { data } = useAPI<ResponseType>(endpoints.projects);

// Conditional fetch (null = don't fetch)
const { data } = useAPI<ResponseType>(id ? `${endpoints.projects}/${id}` : null);

// Admin API
const { data } = useAdminAPI<ResponseType>(endpoints.adminResource);

// Lazy fetch (manual trigger)
import { useLazyAPI } from '@hooks/useAPI';
const { trigger } = useLazyAPI<Data>((id) => `${endpoints.resource}/${id}`);
```

### Mutations (direct Axios)
```typescript
import { api } from '@api';
const response = await api.post(endpoints.projects, payload);
const response = await api.patch(`${endpoints.projects}/${id}`, payload);
const response = await api.delete(`${endpoints.projects}/${id}`);
```

## Component Patterns

### UI Primitives (`libs/components/src/ui/`)
Radix + shadcn pattern with CVA variants:
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva('inline-flex items-center ...', {
  variants: { variant: { default: '...', primary: '...' }, size: { default: '...', sm: '...' } },
  defaultVariants: { variant: 'default', size: 'default' },
});

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
));
```

### className Merging
```typescript
import { cn } from '@utils/cn';
<div className={cn('base-classes', conditional && 'conditional-class', className)} />
```

### Form Components (`libs/components/src/form/`)
- `Form` — Wraps react-hook-form's FormProvider
- `FormField` — Base field wrapper with label, error display, validation
- `FormInput` — Text input with optional IMask, clearable, suffix
- `FormSelect` — Select dropdown
- `FormCheckbox`, `FormSwitch`, `FormTextarea`, etc.

```typescript
import { useForm } from 'react-hook-form';
import { Form, FormInput, FormSelect } from '@components/form';

const form = useForm({ defaultValues: { name: '', country: '' } });

<Form context={form} onSubmit={handleSubmit}>
  <FormInput name="name" label="Name" required />
  <FormSelect name="country" label="Country" options={countries} />
  <Button type="submit">Save</Button>
</Form>
```

### Shared Components (`libs/components/src/shared/`)
- `DeviceWrapper` — Responsive mobile/desktop conditional rendering
- Business-level components used across features

## Feature Organization (Current Reality)

Features live in the app with co-located components and hooks:
```
apps/listing/src/app/
├── listing/components/        # PLP (project listing page)
│   ├── filters/               # Filter components
│   ├── projects/              # Project list/grid
│   └── navbar/                # Navigation
├── projects/[id]/             # PDP (project detail page)
│   ├── components/            # Detail page components
│   │   ├── ProjectPageClient.tsx  # Client boundary
│   │   └── Root.tsx           # Main composition
│   └── hooks/                 # Page-specific hooks
├── admin/                     # Admin panel
│   ├── developers/components/
│   ├── countries/components/
│   └── components/            # Shared admin components
└── shared/                    # Shared app-level code
    ├── hooks/
    └── map/
```

### Server/Client Component Pattern
```typescript
// page.tsx (Server Component)
export default function ProjectPage({ params }: Props) {
  const { id } = use(params);  // Next.js 15+: params is a Promise
  return <ProjectPageClient projectId={id} />;
}

// components/ProjectPageClient.tsx (Client Component)
'use client';
export const ProjectPageClient = ({ projectId }: Props) => {
  return <Providers projectId={projectId}>{/* ... */}</Providers>;
};
```

## State Management

### Server State: SWR (via `@hooks/useAPI`)
All API data uses SWR hooks. No Zustand for server data.

### Global UI State: Zustand (`libs/stores/src/`)
```typescript
import { create } from 'zustand';

type IMyStore = { value: string; setValue: (v: string) => void };

export const useMyStore = create<IMyStore>((set) => ({
  value: '',
  setValue: (v) => set({ value: v }),
}));

// Standalone function for imperative use outside React
export const myAction = () => useMyStore.getState().setValue('new');
```

Existing stores: `buildingSelectionStore.ts`, `toastStore.ts`
URL sync middleware: `libs/stores/src/middlewares/`

### Context Hook Pattern (`libs/hooks/src/utils/createContextHook.tsx`)
Creates hooks that work both standalone and with a Provider:
```typescript
export const useFilters = createContextHook(function useFilters(initialFilters) {
  const [filters, dispatch] = useReducer(filtersReducer, initialFilters);
  return { filters, updateFilter, query };
});

// Usage as provider:
<useFilters.Provider>{children}</useFilters.Provider>

// Usage as consumer:
const { filters } = useFilters();
```

### Feature-Local State
For state scoped to a single feature: `useState`, `useReducer` inside the feature component.

### Form State
react-hook-form via `<Form context={form}>` — see Form Components above.

## NX Library Scaffolding

To create a new NX library, copy scaffolding from `libs/utils`:
- `project.json`, `package.json`, `tsconfig.json`, `tsconfig.lib.json`, `tsconfig.spec.json`, `eslint.config.mjs`, `jest.config.ts`
- Add path alias to root `tsconfig.json`
- NX auto-discovers projects via `project.json`
