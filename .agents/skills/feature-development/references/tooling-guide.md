# Tooling Guide: MCPs & Skills

## Code Exploration (Serena MCP — prefer over grep/glob)

| Tool | When to Use |
|------|-------------|
| `mcp__serena__find_symbol` | Find function/component/class definition by name |
| `mcp__serena__get_symbols_overview` | Get file structure before reading (saves tokens) |
| `mcp__serena__find_referencing_symbols` | Find all usages of a symbol across codebase |
| `mcp__serena__search_for_pattern` | Regex search when symbol name is unknown |

**Strategy**: Always use `get_symbols_overview` before reading an entire file. Often the overview is sufficient. Use `find_symbol` with `include_body=True` only for symbols you need to understand fully.

## External Context MCPs

| Tool | When to Use |
|------|-------------|
| **Context7** (`resolve-library-id` + `query-docs`) | Need docs for SWR, Zustand, Radix, react-hook-form, Zod, Next.js, or any other library |
| **Atlassian** (`getJiraIssue`) | User references REL-xxx ticket — extract requirements and acceptance criteria |
| **Atlassian** (`addCommentToJiraIssue`) | Update ticket after implementation with summary of changes |
| **Sentry** (`search_issues`, `get_issue_details`) | Investigating production errors as part of a bug fix |
| **Chrome DevTools** (`take_screenshot`, `navigate_page`, `click`) | Visual testing and debugging in browser |
| **GitHub** (`create_pull_request`, `list_pull_requests`) | PR creation and management |

## Skill Delegation Matrix

Invoke the most specific skill for the task. Invoke at most ONE domain skill per implementation step to avoid context overload.

| Trigger | Skill | When |
|---------|-------|------|
| Ambiguous requirements, creative work | `/brainstorming` | Phase 1 |
| Next.js App Router, RSC boundaries, routing, metadata, route handlers | `/next-best-practices` | Phase 2-3 |
| Component API design, composition strategy, boolean prop refactoring | `/vercel-composition-patterns` | Phase 2-3 |
| React performance, memoization, suspense, re-render optimization | `/vercel-react-best-practices` | Phase 3 |
| Forms with react-hook-form + Zod validation | `/react-hook-form-zod` | Phase 3 |
| Design tokens, Tailwind patterns, responsive layouts | `/tailwind-design-system` | Phase 3 |
| Complex generics, conditional types, mapped types, template literals | `/typescript-advanced-types` | Phase 3 |
| New NX library setup, project boundaries, build configuration | `/nx-workspace-patterns` | Phase 2 |
| Sentry errors, production debugging | `/sentry-fix-issues` | Phase 1 |
| Post-implementation quality review (L tasks) | `/requesting-code-review` | Phase 4 |
| Staging and committing changes | `/commit` | Phase 3-4 |

**Rules**:
- Under-invoke rather than over-invoke. If uncertain whether a skill applies, skip it.
- Skills load their own references in their own context — they are token-efficient by design.
- Do NOT invoke a skill just because it's tangentially related. Only invoke when the skill directly addresses the current sub-task.

## Token Optimization Strategy

1. **Progressive reference loading**: Do NOT read `references/` files upfront. Load them only when entering the phase that needs them.
2. **Serena-first exploration**: Use `get_symbols_overview` before reading full files. Use `find_symbol` with `include_body=False` first, then `True` only for what you need.
3. **Targeted file reads**: Use `offset` and `limit` params when you only need a specific section of a large file.
4. **Size-based workflow**: S tasks skip most phases (saves ~60% of tokens). Only L tasks run all phases.
5. **Single skill per step**: Don't stack multiple skills in one implementation step.
6. **Avoid re-reading**: The architecture-rules.md reference is a condensed version of ~3000 lines of docs. Read it once per session; do not re-read the full docs unless the condensed version is insufficient for an edge case.
