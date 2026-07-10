---
name: feature-development
description: "End-to-end feature development for the Reelly monorepo. Covers discovery, architecture, implementation, and review with project-specific rules, MCP integration, and skill orchestration. Use when building features, adding functionality, fixing bugs, or making multi-file changes. Replaces /feature-dev for this project."
---

# Feature Development

Structured workflow for implementing features in the Reelly Next.js/NX monorepo. Orchestrates Serena MCP for code navigation, specialized skills for domain expertise, and project architecture rules.

## Workflow Overview

```
Classify Size → Phase 1: Discovery → Phase 2: Architecture → Phase 3: Implementation → Phase 4: Review → Phase 5: Summary
     S: skip to Phase 3          M/L only
```

---

## Size Classification

Classify the task FIRST to determine which phases to run.

| Size | Criteria | Phases | Examples |
|------|----------|--------|---------|
| **S** | Single file, isolated change, clear scope | 3 → 4 (light) | Fix scroll bug, update text, adjust styling, add CSS class |
| **M** | 2-5 files, single domain, known pattern | 1 (light) → 3 → 4 | Add filter, new API hook, new component, modify existing feature |
| **L** | 5+ files, cross-domain, new library, architecture decisions | All phases | New feature library, cross-cutting concern, new domain area |

**Rule**: If it touches >3 files across >1 directory → at least M. If it requires a new NX library or crosses domain boundaries → L.

---

## Phase 1: Discovery & Scoping

**Goal**: Understand what needs to be built and where it fits.

**Skip for S tasks** — go directly to Phase 3.

### Steps

1. **Extract requirements**:
   - If ticket referenced (REL-xxx): fetch via Atlassian MCP (`getJiraIssue`) to get acceptance criteria and linked designs
   - Otherwise: extract from user description

2. **Explore affected code** using Serena MCP:
   - `find_symbol` — locate existing implementations that will be modified or reused
   - `get_symbols_overview` — understand file structure before reading
   - `find_referencing_symbols` — map impact of changes
   - `search_for_pattern` — find related patterns across codebase

3. **Check for existing implementations**: Before creating anything new, verify it doesn't already exist. Search `libs/hooks/`, `libs/components/`, `libs/utils/`, `libs/stores/`.

4. **Classify size** (S/M/L) based on scope assessment.

5. **Summarize understanding** to user: what will be built, which files are affected, any ambiguities. Confirm before proceeding.

6. **If requirements are ambiguous**: Invoke `/brainstorming` for design exploration before continuing.

---

## Phase 2: Architecture Decision

**Goal**: Determine WHERE new code lives and HOW it's structured.

**Only for M (lightweight) and L (full) tasks. Skip for S.**

### Steps

1. **Read** [references/architecture-rules.md](references/architecture-rules.md) to load condensed architecture rules.

2. **Determine: old code or new code?**

> **OLD CODE POLICY (CRITICAL)**
>
> When modifying features that predate `/docs/`, DO NOT refactor existing code to match docs.
> Apply doc patterns ONLY to new code you are writing, and ONLY where it does not break
> the surrounding style or existing functionality. Match the conventions of the file you're editing.
>
> Examples:
> - Adding a hook to `libs/hooks/src/`? Follow the existing flat structure, not the aspirational domain structure.
> - Creating a brand new feature library from scratch? CAN follow the target 3D structure.
> - Modifying `apps/listing/src/app/projects/`? Match existing patterns in that directory.

3. **For new code** — determine correct placement:
   - Use decision trees from architecture-rules.md (scope + type)
   - Check if existing flat libs are the right home vs creating new library

4. **Skill delegation** — decide which skills to invoke during implementation:
   - Read [references/tooling-guide.md](references/tooling-guide.md) for the delegation matrix
   - New NX library needed? → plan to invoke `/nx-workspace-patterns`
   - Form with validation? → plan to invoke `/react-hook-form-zod`
   - Component composition decisions? → plan to invoke `/vercel-composition-patterns`
   - Next.js routing/RSC decisions? → plan to invoke `/next-best-practices`

5. **For L tasks** — produce a file-by-file plan:
   - List files to create and modify
   - Specify implementation order
   - Identify dependencies between steps
   - Present to user for approval before implementing

---

## Phase 3: Implementation

**Goal**: Write the code.

### Pre-Implementation

1. **Read** [references/patterns.md](references/patterns.md) for the specific area you're working in (API, components, forms, state).

2. **Verify existing patterns**: Use Serena's `get_symbols_overview` on files you're about to modify to understand their current structure.

3. **For library docs**: If you need API reference for SWR, Zustand, react-hook-form, Zod, Radix, or other libraries, use Context7 MCP (`resolve-library-id` → `query-docs`).

### Implementation Order (for M/L tasks)

Build bottom-up to ensure dependencies are in place:

1. **Types** — if new types needed, add to `libs/types/src/lib/` or co-locate in feature
2. **Data-access / hooks** — SWR hooks for API integration (return raw data)
3. **UI components** — presentational components (no business logic)
4. **Feature / container** — orchestrates hooks, components, state, transformation
5. **Barrel exports** — `index.ts` at every folder level
6. **App integration** — route page (thin: just imports and renders feature)

### Code Conventions

Follow these conventions for ALL new code. For old code, match existing style.

- **Files**: PascalCase.tsx (components), camelCase.ts (hooks, utils, stores, types)
- **Folders**: kebab-case
- **Types**: `type` keyword (not `interface`), `I` prefix for types, `E` prefix for enums
- **Imports**: From barrel exports (`@hooks/useAPI`, `@components/ui`), never deep paths
- **Server state**: SWR via `useAPI`/`useAdminAPI`/`useCommonAPI` from `@hooks/useAPI`
- **UI state**: Zustand store in `@stores/` or feature-local `useState`/`useReducer`
- **Shared state**: Prefer Zustand over React Context. Context re-renders ALL consumers on any change, which causes performance issues when the subtree is large. Only use Context for small, isolated subtrees (e.g., a compound component with 2-3 direct children). For anything else, use Zustand.
- **Forms**: react-hook-form + Zod via `Form`/`FormInput` from `@components/form`
- **Styling**: Tailwind CSS, `cn()` from `@utils/cn` for merging
- **Components**: Radix primitives + CVA variants (shadcn pattern)
- **Client boundary**: `'use client'` directive at top of file when using hooks, state, or browser APIs

### Skill Invocation During Implementation

Invoke the relevant skill WHEN you reach that sub-task, not upfront:

- Writing a component with complex composition? → `/vercel-composition-patterns`
- Performance-sensitive rendering? → `/vercel-react-best-practices`
- Form with validation? → `/react-hook-form-zod`
- Tailwind layout/design decisions? → `/tailwind-design-system`
- Complex TypeScript types? → `/typescript-advanced-types`

### Committing

Commit after each logical unit using `/commit`. The commit skill auto-detects REL-xxx prefix from the branch.

---

## Phase 4: Quality Review

**Goal**: Verify correctness and catch issues.

### Automated Checks

```bash
nx run [project]:eslint:lint    # Lint
nx test [project]               # Tests (if exist)
pnpm build                      # Build check (L tasks only)
```

### Self-Review Checklist

Before declaring done, verify:

- [ ] **Barrel exports**: `index.ts` in place at every folder level?
- [ ] **Public API minimal**: Only container/entry-point exports for features?
- [ ] **Raw data**: Data-access hooks return raw API responses (no transformation)?
- [ ] **Dependency direction**: No reverse deps (data-access → feature, ui → data-access)?
- [ ] **Old code policy**: Did NOT accidentally refactor old code to match docs?
- [ ] **Naming**: Files and folders follow conventions?
- [ ] **Client boundary**: `'use client'` where needed, server components where possible?
- [ ] **Types**: Used proper `I`/`E` prefixes, `type` keyword?

### Code Review (L tasks)

For large features, invoke `/requesting-code-review` to dispatch a code-reviewer subagent for independent review.

---

## Phase 5: Summary & Handoff

**Goal**: Summarize and close the loop.

1. **Summarize changes**: files created, files modified, key decisions made
2. **List follow-ups**: known limitations, future improvements, related work
3. **Update Jira** (if ticket referenced): Add comment via Atlassian MCP (`addCommentToJiraIssue`) with summary
4. **Offer PR creation**: `gh pr create` if changes are ready for review
5. **Remind about uncommitted changes**: If any remain, offer to commit via `/commit`

---

## Quick Reference

| Situation | Action |
|-----------|--------|
| Modifying old flat-structure code | Match existing style. Do NOT refactor to docs. |
| Creating new standalone library | Follow docs: `libs/[app]/domain/[domain]/[type]-[name]` if scope warrants it |
| Adding to existing flat lib | Add to existing structure (`libs/hooks/src/`, `libs/components/src/`, etc.) |
| Need API data | SWR hook via `useAPI<T>(endpoint)` from `@hooks/useAPI`. Return raw data. |
| Component with business logic | Feature with `container/` pattern (or co-locate in app if small) |
| Presentational component | UI component, no data fetching, props only |
| Shared across domains | `libs/[app]/shared/` or existing flat lib |
| Form with validation | `/react-hook-form-zod` + `Form`/`FormInput` from `@components/form` |
| Performance concern | `/vercel-react-best-practices` |
| Need library docs | Context7 MCP: `resolve-library-id` → `query-docs` |
| Need to find existing code | Serena MCP: `find_symbol` or `search_for_pattern` |

---

## Reference Files

Load these on demand, not upfront:

- **[references/architecture-rules.md](references/architecture-rules.md)** — Condensed architecture rules, dependency hierarchy, naming conventions, decision trees. Load in Phase 2.
- **[references/patterns.md](references/patterns.md)** — Actual codebase patterns with file paths (API, components, state, forms). Load in Phase 3.
- **[references/tooling-guide.md](references/tooling-guide.md)** — MCP tools, skill delegation matrix, token optimization. Load in Phase 2.
