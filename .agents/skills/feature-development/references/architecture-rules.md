# Architecture Rules (Condensed)

Condensed from `/docs/architecture/` and `/docs/standards/`. For deep-dive details, read the original docs.

## Current vs Target Structure

**CURRENT reality** (flat, legacy — existing libs):
```
libs/api, libs/components, libs/hooks, libs/stores, libs/types, libs/utils,
libs/config, libs/constants, libs/environment, libs/monitoring
```

**TARGET structure** (3D organization — for new greenfield libraries):
```
libs/
├── shared/                    # Global (all apps)
│   ├── ui-primitives/         # Button, Input, Dialog
│   ├── ui-composed/           # FormField, SearchBar
│   ├── types/                 # IProject, IUnit
│   └── util-*/                # formatCurrency, cn()
├── listing-app/               # Listing app namespace
│   ├── shared/                # Shared within listing app
│   │   ├── data-access/       # API client
│   │   ├── ui-business/       # PropertyCard, UnitCard
│   │   └── util-*/            # App-specific utilities
│   └── domain/                # Business domains
│       ├── listings/          # feature-search, data-access-listings
│       ├── projects/          # feature-details, data-access-projects
│       ├── admin/             # feature-dashboard, data-access-admin
│       └── user/              # feature-profile, data-access-users
└── pdf-service-app/           # PDF service namespace
```

**Rule**: Existing flat libs (`libs/hooks`, `libs/components`, etc.) stay flat. New greenfield libraries CAN follow the target 3D structure if it makes sense for the scope. Do not force-migrate.

## 80/20 Rule

80% of logic in `/libs`, 20% in `/apps`. Apps are thin orchestration: routing, layout, providers, global config. All business logic, components, hooks, utilities live in libraries.

## Library Types

| Type | Contains | Can Import | Cannot Import |
|------|----------|-----------|--------------|
| **feature** | Smart components, business logic | data-access, ui, util | Other features |
| **data-access** | SWR hooks, API calls, raw data | util ONLY | feature, ui |
| **ui** | Presentational components | util ONLY | feature, data-access |
| **util** | Pure functions, helpers | util ONLY | feature, data-access, ui |

**Naming**: `feature-[name]`, `data-access-[name]`, `ui-[tier]`, `util-[purpose]`

## Dependency Rules

### By Scope
```
Global Shared → Global Shared only
App-Scoped   → Global Shared + Same App
Domain       → Global Shared + App-Scoped + Same Domain

FORBIDDEN: Domain → Different Domain, App → Different App, Shared → App-Scoped
```

### By Type (Layered Hierarchy)
```
Feature (top) → Data-Access, UI, Util
Data-Access   → Util ONLY
UI            → Util ONLY
Util          → Util ONLY

CRITICAL: Data-access NEVER imports Feature or UI
```

### UI Tiers (one-way dependency)
```
ui-business  → ui-composed, ui-primitives, util
ui-composed  → ui-primitives, util
ui-primitives → util ONLY
```

## Container Component Pattern

Features export from `container/` folder only. Everything else is private.

```
feature-[name]/src/
├── container/          # Public entry points (exported via index.ts)
│   └── FeatureName.tsx
├── components/         # Private internal components
├── hooks/              # Private hooks
├── stores/             # Private Zustand stores
├── utils/              # Private utilities
├── types/              # Private types (unless needed by consumers)
└── index.ts            # Exports ONLY from container/
```

## State: Zustand Over React Context

Prefer Zustand for shared state. React Context re-renders every consumer when any value changes — this causes cascading re-renders in large subtrees.

**Use Zustand when**: State is shared across many components, the subtree is large, or performance matters.
**Context is acceptable ONLY when**: The subtree is small and isolated (e.g., a compound component with 2-3 direct children where re-render cost is negligible).

## Data-Access Returns Raw Data

Data-access hooks return raw API responses. Features handle transformation. If multiple features need the same transformation, create a shared utility.

```typescript
// data-access: return raw
export function useProjects(filters) {
  return useSWR(['/projects', filters], () => api.get('/projects', { params: filters }).then(r => r.data));
}

// feature: transform for display
const displayProjects = rawData?.map(p => ({ ...p, formattedPrice: formatCurrency(p.price) }));
```

## Module Encapsulation

Every folder has `index.ts` that defines its public API. If it's not in `index.ts`, it's private. Applied at every level: library, folder, sub-folder.

## Naming Conventions

| Item | Format | Example |
|------|--------|---------|
| Component file | PascalCase.tsx | `SearchFeature.tsx` |
| Hook file | camelCase.ts | `useFilters.ts` |
| Utility file | camelCase.ts | `formatCurrency.ts` |
| Store file | camelCase.ts (ending with Store) | `searchUIStore.ts` |
| Type file | camelCase.ts | `projectTypes.ts` |
| Folder | kebab-case | `feature-search/` |
| Type name | I + PascalCase | `IProject` |
| Enum name | E + PascalCase | `ESaleStatus` |
| Barrel export | index.ts (always) | `index.ts` |

## Decision Trees

### Where to put new code
```
Used by multiple apps?           → libs/shared/
Used by multiple domains?        → libs/[app]/shared/
Domain-specific?                 → libs/[app]/domain/[domain]/
Feature-specific (not shared)?   → Co-locate within the feature
```

### What type of library
```
Fetches data from API?                      → data-access
React components with business logic?       → feature
Presentational React components (no logic)? → ui
Pure functions, helpers?                    → util
```

### Where to add code in EXISTING flat libs
```
New API hook?         → libs/hooks/src/[domain]/
New shared component? → libs/components/src/ui/ or /shared/ or /form/
New type?             → libs/types/src/lib/
New utility?          → libs/utils/src/[purpose]/
New store?            → libs/stores/src/
New constant?         → libs/constants/src/lib/
```
