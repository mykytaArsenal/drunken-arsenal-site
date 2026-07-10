# Naming Conventions

This document defines the naming standards for files, folders, and libraries in the Reelly codebase.

---

## File Naming

### Components

**Format**: `PascalCase.tsx`

Components use PascalCase with the first letter capitalized.

```
✅ Good:
SearchFeature.tsx
Filters.tsx
PriceRangeFilter.tsx
PropertyCard.tsx
Button.tsx

❌ Bad:
search-feature.tsx
searchFeature.tsx
SEARCH_FEATURE.tsx
```

### Hooks

**Format**: `camelCase.ts`

Hooks use camelCase starting with `use`.

```
✅ Good:
useFilters.ts
useProjects.ts
useProjectMarkers.ts
useDisclosure.ts

❌ Bad:
UseFilters.ts
use-filters.ts
USE_FILTERS.ts
```

### Utilities

**Format**: `camelCase.ts`

Utility files use camelCase.

```
✅ Good:
formatCurrency.ts
parseDate.ts
calculateArea.ts
apiClient.ts

❌ Bad:
FormatCurrency.ts
format_currency.ts
FORMAT_CURRENCY.ts
```

### Types

**Format**: `camelCase.ts`

Type definition files use camelCase.

```
✅ Good:
projectTypes.ts
filterTypes.ts
apiTypes.ts

❌ Bad:
ProjectTypes.ts
project_types.ts
types.ts              # Too generic
```

### Stores (Zustand)

**Format**: `camelCase.ts`

Store files use camelCase ending with `Store`.

```
✅ Good:
searchUIStore.ts
pdfBuilderStore.ts
toastStore.ts

❌ Bad:
SearchUIStore.ts
search_ui_store.ts
searchStore.tsx       # Should be .ts not .tsx
```

### Barrel Exports

**Format**: `index.ts` (always)

Every folder should have an `index.ts` that defines its public API.

```
✅ Good:
index.ts

❌ Bad:
Index.ts
INDEX.ts
exports.ts
```

---

## Folder Naming

### Library Folders

**Format**: `kebab-case`

Library folders use kebab-case.

```
✅ Good:
feature-search/
feature-map/
data-access-listings/
ui-business/
util-formatting/

❌ Bad:
FeatureSearch/
feature_search/
FEATURE_SEARCH/
```

### Component Folders

**Format**: `kebab-case`

Component folders use kebab-case to stay consistent with library folder naming.

```
✅ Good:
components/
├── search-feature/         # kebab-case folder
│   ├── SearchFeature.tsx   # PascalCase file
│   └── index.ts
├── filters/
│   ├── Filters.tsx
│   └── index.ts
└── project-list/
    ├── ProjectList.tsx
    └── index.ts

❌ Bad:
components/
├── SearchFeature/          # PascalCase folder
├── Filters/
└── ProjectList/
```

### Utility Folders

**Format**: `kebab-case`

```
✅ Good:
utils/
hooks/
types/
stores/

❌ Bad:
Utils/
HOOKS/
```

---

## Library Naming

### Feature Libraries

**Format**: `feature-[name]`

Feature libraries always start with `feature-`.

```
✅ Good:
feature-search
feature-map
feature-details
feature-units
feature-builder

❌ Bad:
search-feature
search
listings-search
```

### Data-Access Libraries

**Format**: `data-access-[name]`

Data-access libraries use descriptive names for what data they access. A domain can have multiple data-access libraries.

```
✅ Good:
data-access-projects        # Project data
data-access-units           # Unit data
data-access-payment-plans   # Payment plan data
data-access-developers      # Developer data
data-access-admin           # Admin operations

❌ Bad:
data-access (too generic!)
listings-data
api-listings
projects-api
```

**Note**: Don't limit to one data-access per domain. Name based on the specific data being accessed.

### UI Libraries

**Format**: `ui-primitives`, `ui-composed`, or `ui-business`

UI libraries use a `ui-` prefix followed by their tier.

```
✅ Good:
ui-primitives         # Primitive components (plural)
ui-composed           # Composed components
ui-business           # Business components

❌ Bad:
ui                    # Too generic
ui-primitive          # Should be plural: ui-primitives
components
shared-ui
ui-components
```

### Utility Libraries

**Format**: `util-[purpose]`

Utility libraries use `util-` prefix followed by the purpose.

```
✅ Good:
util-formatting
util-validation
util-analytics
util-ui

❌ Bad:
utils
helpers
formatting-utils
```

---

## Import Path Aliases

### Global Shared

**Format**: `@shared/[library]`

```typescript
✅ Good:
import { Button } from '@shared/ui-primitives';
import { formatCurrency } from '@shared/util-formatting';
import type { IProject } from '@shared/types';

❌ Bad:
import { Button } from '@libs/shared/ui-primitives';
import { formatCurrency } from 'shared/util-formatting';
```

### App-Scoped Shared

**Format**: `@[app]/shared/[library]`

```typescript
✅ Good:
import { api } from '@listing/shared/data-access';
import { PropertyCard } from '@listing/shared/ui-business';

❌ Bad:
import { api } from '@listing-app/shared/data-access';
import { PropertyCard } from '@shared/ui-business';
```

### Domain Libraries

**Format**: `@[app]/domain/[domain]/[library]`

```typescript
✅ Good:
import { SearchFeature } from '@listing/domain/listings/feature-search';
import { useProjects } from '@listing/domain/listings/data-access-listings';

❌ Bad:
import { SearchFeature } from '@listing/listings/feature-search';
import { useProjects } from '@domain/listings/data-access';
```

---

## Type Naming

### Type Definitions

**Format**: Types use `I` prefix, PascalCase

```typescript
✅ Good:
type IProject = { ... };
type IUnit = { ... };
type IFilter = { ... };
type IUser = { ... };

❌ Bad:
// Don't use interfaces
interface IProject { ... }

// Don't omit I prefix
type Project = { ... };

// Don't use other prefixes
type TProject = { ... };
```

### Enums

**Format**: `E` prefix, PascalCase

```typescript
✅ Good:
enum ESaleStatus {
  Available = 'available',
  Sold = 'sold',
}

enum EUnitType {
  Apartment = 'apartment',
  Villa = 'villa',
}

❌ Bad:
enum SaleStatus { ... }
enum SALE_STATUS { ... }
```

### Component Props

**Format**: `[ComponentName]Props`

```typescript
✅ Good:
type ISearchFeatureProps = {
  initialFilters?: IFilters;
};

type IFiltersProps = {
  value: IFilters;
  onChange: (filters: IFilters) => void;
};

❌ Bad:
type Props = { ... };  // Too generic
type SearchFeatureProperties = { ... };  // Too verbose
```

---

## Variable Naming

### Constants

**Format**: `SCREAMING_SNAKE_CASE`

```typescript
✅ Good:
const MAX_PRICE = 1000000;
const DEFAULT_PAGE_SIZE = 25;
const API_BASE_URL = 'https://api.example.com';

❌ Bad:
const maxPrice = 1000000;
const max_price = 1000000;
```

### Functions

**Format**: `camelCase`

```typescript
✅ Good:
const calculateTotal = () => { ... };
const formatCurrency = () => { ... };
const parseDate = () => { ... };

❌ Bad:
const CalculateTotal = () => { ... };
const calculate_total = () => { ... };
```

### React Components

**Format**: `PascalCase`

```typescript
✅ Good:
const SearchFeature = () => { ... };
const Filters = () => { ... };

❌ Bad:
const searchFeature = () => { ... };
const filters = () => { ... };
```

### Hooks

**Format**: `camelCase` starting with `use`

```typescript
✅ Good:
const useFilters = () => { ... };
const useProjects = () => { ... };

❌ Bad:
const UseFilters = () => { ... };
const filters = () => { ... };
const getFilters = () => { ... };
```

---

## Complete Examples

### Feature Library Structure

```
feature-search/
├── container/                     # Entry points (public)
│   ├── SearchFeature.tsx          # PascalCase component
│   └── index.ts
├── components/                    # Internal components (private)
│   ├── filters/                   # kebab-case folder
│   │   ├── Filters.tsx            # PascalCase component
│   │   ├── PriceRangeFilter.tsx
│   │   └── index.ts
│   ├── project-list/              # kebab-case folder
│   │   ├── ProjectList.tsx
│   │   └── index.ts
│   └── index.ts
├── hooks/
│   ├── useFilters.ts              # camelCase hook
│   ├── useSearch.ts
│   └── index.ts
├── stores/
│   ├── searchUIStore.ts           # camelCase store
│   └── index.ts
├── utils/
│   ├── filterHelpers.ts           # camelCase utility
│   └── index.ts
├── types/
│   ├── filterTypes.ts             # camelCase types
│   └── index.ts
└── index.ts                        # Exports from container/
```

### Data-Access Library Structure

```
data-access-listings/
├── api/
│   ├── projects.ts                # camelCase
│   ├── developers.ts
│   └── index.ts
├── hooks/
│   ├── useProjects.ts             # camelCase hook
│   ├── useDevelopers.ts
│   └── index.ts
├── types/
│   ├── apiTypes.ts                # camelCase types
│   └── index.ts
└── index.ts
```

### UI Library Structure

```
ui-business/
├── property-card/                 # kebab-case folder
│   ├── PropertyCard.tsx           # PascalCase component
│   └── index.ts
├── unit-card/                     # kebab-case folder
│   ├── UnitCard.tsx
│   └── index.ts
└── index.ts
```

---

## NX Generator Commands

When creating libraries, use these naming patterns:

### Feature Library

```bash
nx g @nx/react:library feature-search \
  --directory=libs/listing-app/domain/listings/feature-search \
  --tags=type:feature,scope:app:listing,domain:listings \
  --importPath=@listing/domain/listings/feature-search
```

### Data-Access Library

```bash
nx g @nx/react:library data-access-listings \
  --directory=libs/listing-app/domain/listings/data-access-listings \
  --tags=type:data-access,scope:app:listing,domain:listings \
  --importPath=@listing/domain/listings/data-access-listings
```

### UI Library

```bash
nx g @nx/react:library ui-business \
  --directory=libs/listing-app/shared/ui-business \
  --tags=type:ui,type:ui-business,scope:app:listing \
  --importPath=@listing/shared/ui-business
```

---

## Quick Reference

| Type             | Format                 | Example                                    |
| ---------------- | ---------------------- | ------------------------------------------ |
| Component file   | `PascalCase.tsx`       | `SearchFeature.tsx`                        |
| Hook             | `camelCase.ts`         | `useFilters.ts`                            |
| Utility          | `camelCase.ts`         | `formatCurrency.ts`                        |
| Type file        | `camelCase.ts`         | `projectTypes.ts`                          |
| Store            | `camelCase.ts`         | `searchUIStore.ts`                         |
| Component folder | `kebab-case/`          | `search-feature/`, `filters/`              |
| Library folder   | `kebab-case/`          | `feature-search/`, `data-access-listings/` |
| Type definition  | `I` + `PascalCase`     | `IProject`                                 |
| Enum             | `E` + `PascalCase`     | `ESaleStatus`                              |
| Constant         | `SCREAMING_SNAKE_CASE` | `MAX_PRICE`                                |

---

## Semantic Naming

> Adapted from [naming-cheatsheet](https://github.com/kettanaito/naming-cheatsheet)

The sections above cover **structural naming** (casing, file patterns, prefixes). This section covers **semantic naming** — choosing the right words for variables, functions, and parameters.

### Core Rule: S-I-D

Every name should be:

- **Short** — quick to type and remember
- **Intuitive** — reads naturally
- **Descriptive** — reflects purpose efficiently

```typescript
// ✅ Good
const projects = fetchProjects();
const isVisible = true;

// ❌ Bad — not intuitive
const p = fetchProjects();
const vis = true;

// ❌ Bad — too verbose
const listOfAllProjectsFromAPI = fetchProjects();
```

### No Contractions

Don't abbreviate words. Spell them out.

```typescript
// ✅ Good
onItemClick;
handleFormSubmit;
filterByBedrooms;

// ❌ Bad
onItmClk;
hndlFrmSbmt;
fltrByBdrms;
```

### Avoid Context Duplication

Don't repeat the surrounding context in a name.

```typescript
class MenuItem {
  // ✅ Good — context is already in the class name
  handleClick() {}

  // ❌ Bad — "MenuItem" is redundant
  handleMenuItemClick() {}
}
```

---

### Function Naming: A/HC/LC Pattern

Compose function names as: **prefix? + action (A) + high context (HC) + low context? (LC)**

| Part         | Description            | Example                       |
| ------------ | ---------------------- | ----------------------------- |
| Prefix       | Qualifies the meaning  | `is`, `has`, `should`         |
| Action       | What the function does | `get`, `set`, `handle`        |
| High context | Primary subject        | `User`, `Projects`, `Filter`  |
| Low context  | Additional detail      | `Messages`, `Outside`, `ById` |

| Name                     | Prefix   | Action (A) | High context (HC) | Low context (LC) |
| ------------------------ | -------- | ---------- | ----------------- | ---------------- |
| `getProject`             |          | `get`      | `Project`         |                  |
| `getProjectMessages`     |          | `get`      | `Project`         | `Messages`       |
| `handleClickOutside`     |          | `handle`   | `Click`           | `Outside`        |
| `shouldDisplayMessage`   | `should` | `Display`  | `Message`         |                  |
| `isValidPrice`           | `is`     | `Valid`    | `Price`           |                  |
| `formatCurrencyByLocale` |          | `format`   | `Currency`        | `ByLocale`       |
| `handleFilterChange`     |          | `handle`   | `Filter`          | `Change`         |

---

### Action Verbs

Use the right verb for the right operation:

| Action      | Meaning                                    | Example                         |
| ----------- | ------------------------------------------ | ------------------------------- |
| `get`       | Retrieve data                              | `getUser(id)`                   |
| `set`       | Assign a value                             | `setFilters(next)`              |
| `reset`     | Return to initial state                    | `resetFilters()`                |
| `remove`    | Take from a collection (item still exists) | `removeFilter(name, filters)`   |
| `delete`    | Erase permanently                          | `deleteProject(id)`             |
| `compose`   | Create new data from existing              | `composePageUrl(name, id)`      |
| `handle`    | Respond to an event/action                 | `handleSubmit()`                |
| `format`    | Transform for display                      | `formatCurrency(price)`         |
| `parse`     | Extract structured data                    | `parseQueryString(url)`         |
| `validate`  | Check correctness                          | `validateEmail(input)`          |
| `transform` | Convert from one shape to another          | `transformProjectForDisplay(p)` |

#### remove vs delete

These are **not interchangeable**:

- **remove / add** — collection operations. The item still exists, you're moving it.
- **delete / create** — permanent operations. The item ceases to exist.

```typescript
// ✅ remove — taking from a collection
const removeFilter = (name: string, filters: string[]) =>
  filters.filter((f) => f !== name);

// ✅ delete — permanent destruction
const deleteProject = (id: string) => api.delete(`/projects/${id}`);
```

---

### Boolean Prefixes

| Prefix   | Meaning                             | Example                               |
| -------- | ----------------------------------- | ------------------------------------- |
| `is`     | Describes a characteristic or state | `isActive`, `isVisible`, `isDisabled` |
| `has`    | Possesses a value or capability     | `hasProducts`, `hasPermission`        |
| `should` | Positive conditional + action       | `shouldUpdateUrl`, `shouldFetchData`  |
| `can`    | Capability or permission            | `canEdit`, `canDelete`                |

```typescript
// ✅ Good — clear boolean intent
const isLoading = status === 'loading';
const hasFilters = filters.length > 0;
const shouldRedirect = !isAuthenticated;
const canDelete = user.role === 'admin';

// ❌ Bad — ambiguous
const loading = status === 'loading'; // could be a noun
const filters = filters.length > 0; // shadows the array
const redirect = !isAuthenticated; // is this a function?
```

---

### Boundary Prefixes

Use `min` / `max` for limits and `prev` / `next` for state transitions:

```typescript
// ✅ Boundaries
function renderPosts(posts: IPost[], minPosts: number, maxPosts: number) {
  return posts.slice(0, clamp(posts.length, minPosts, maxPosts));
}

// ✅ State transitions
const prevFilters = filtersRef.current;
const nextFilters = { ...prevFilters, price: newPrice };
```

---

### Singular vs Plural

Use singular for single values, plural for collections:

```typescript
// ✅ Clear intent
const project = projects[0];
const selectedFilter = 'price';
const selectedFilters = ['price', 'bedrooms', 'area'];

// ❌ Ambiguous
const item = projects; // single name for a collection
```

---

### Quick Reference — Semantic Naming

| Pattern           | Example          | When to Use         |
| ----------------- | ---------------- | ------------------- |
| `get` + noun      | `getUser`        | Retrieving data     |
| `set` + noun      | `setFilters`     | Assigning a value   |
| `handle` + event  | `handleSubmit`   | Event callbacks     |
| `is` + adjective  | `isVisible`      | Boolean state       |
| `has` + noun      | `hasPermission`  | Boolean possession  |
| `should` + verb   | `shouldFetch`    | Boolean conditional |
| `format` + noun   | `formatPrice`    | Display formatting  |
| `parse` + noun    | `parseQuery`     | Data extraction     |
| `validate` + noun | `validateEmail`  | Input validation    |
| `on` + event      | `onFilterChange` | Callback props      |

---

[← Back to Coding Standards](./README.md)
