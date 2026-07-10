# Architecture Review Checklist

Project-specific rules the reviewer MUST verify. These are the most commonly violated rules.

## Diff Scope Policy

**CRITICAL**: Only review lines that were actually changed (the diff). Do NOT flag surrounding old code that predates `/docs/`. Old code follows its own conventions. Only new/modified lines must follow current rules.

## Dependency Rules

### By Type (Layered — most violated)
```
Feature   → can import: data-access, ui, util
Data-Access → can import: util ONLY (NEVER feature, NEVER ui)
UI          → can import: util ONLY (NEVER feature, NEVER data-access)
Util        → can import: util ONLY
```

**Red flag**: Any import from a lower layer to a higher layer. Especially `data-access → feature`.

### By Scope
```
Domain code → CANNOT import from different domain
App code    → CANNOT import from different app
Shared code → CANNOT import from app-scoped or domain code
```

### UI Tiers (one-way)
```
ui-business → ui-composed → ui-primitives → util only
```

## Data-Access Returns Raw Data

Data-access hooks MUST return raw API responses. NO transformation in hooks.

**Red flag**: `formatCurrency()`, `.map()`, `.filter()`, string concatenation, or any display logic inside a data-access hook or API function.

**Correct**: Features receive raw data and transform it for their display needs.

## Container Component Pattern

Features export ONLY from `container/` folder. Internal `components/`, `hooks/`, `stores/`, `utils/` are private.

**Red flag**: Feature's `index.ts` exporting internal components or hooks that should be private.

## Module Encapsulation

Every folder must have `index.ts` defining its public API. Imports must go through barrel exports.

**Red flags**:
- Deep imports: `import { X } from '@hooks/listing/internal/helper'`
- Missing `index.ts` in new folders
- Importing from a file directly when an `index.ts` exists at that level

## 80/20 Rule

Apps are thin orchestration. Business logic belongs in libs.

**Red flag**: More than ~20 lines of business logic in a `page.tsx` or `layout.tsx`. Should be extracted to a feature library or hook.

## State Management

- **Server state** → SWR via `useAPI`/`useAdminAPI`/`useCommonAPI`. NEVER Zustand.
- **Shared UI state** → Zustand stores in `@stores/`
- **Feature-local state** → `useState`/`useReducer` in the component
- **Form state** → react-hook-form

**Red flag**: API response data stored in Zustand. React Context used with large subtrees (prefer Zustand).

## Naming Conventions

| Item | Convention | Red Flag |
|------|-----------|----------|
| Component file | PascalCase.tsx | `myComponent.tsx` |
| Hook file | camelCase.ts | `UseFilter.ts` |
| Store file | camelCase ending with Store | `filters.ts` (no Store suffix) |
| Folder | kebab-case | `MyFeature/` or `my_feature/` |
| Type | `type` + `I` prefix | `interface ProjectData` |
| Enum | `E` prefix | `enum Status` (no E prefix) |
| Barrel | index.ts | Missing index.ts in folder |

## Current vs Target Structure

Existing flat libs (`libs/hooks`, `libs/components`, etc.) stay flat. Do NOT flag old structure for not matching the aspirational 3D structure from `/docs/`. New greenfield libraries CAN follow 3D if warranted.
