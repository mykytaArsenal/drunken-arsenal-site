---
name: requesting-code-review
description: "Dispatch a meticulous code-reviewer subagent that acts as a senior team lead quality gate. Checks architecture decisions, DRY/SOLID/YAGNI compliance, library best practices (SWR, Zustand, Radix, RHF+Zod, Next.js 16, Tailwind, React 19), performance (re-renders, memoization, bundle size), HTML semantics, and project-specific conventions. Use after completing tasks, implementing features, fixing bugs, or before merging. Reviews only the diff — never flags old code."
---

# Requesting Code Review

Dispatch a code-reviewer subagent that acts as a meticulous senior team lead — the quality gate between implementation and the codebase.

## When to Request

**Mandatory:**
- After completing a feature (M/L tasks from `/feature-development`)
- Before merging to main
- After cross-domain changes (touching multiple libs)

**Recommended:**
- After fixing complex bugs
- After refactoring
- When uncertain about architecture decisions

**Skip for:** Single-line fixes, text/copy changes, styling-only tweaks.

---

## Step 1: Detect the Review Mode

**Before running any commands**, determine which of the three modes applies based on what the user said.

### Mode A — GitHub PR

**Triggers:** User mentions a PR number, a GitHub URL, or phrases like "review this PR", "review PR #123".

```bash
# Get PR description and metadata
gh pr view <PR_NUMBER> --json number,title,body,baseRefName,headRefName

# Get the diff
gh pr diff <PR_NUMBER>
```

Use the PR title and body as `{WHAT_WAS_IMPLEMENTED}` and `{REQUIREMENTS}`.

### Mode B — Committed range

**Triggers:** User mentions a branch comparison ("vs staging", "vs main"), a specific commit SHA, or phrases like "review my last commit", "review the last N commits".

```bash
# Detect base: ask the user if not clear from context
# Common bases: origin/staging, origin/main, HEAD~1, HEAD~N

BASE_SHA=$(git merge-base HEAD <base-branch>)
HEAD_SHA=$(git rev-parse HEAD)

git diff --stat $BASE_SHA..$HEAD_SHA
git diff $BASE_SHA..$HEAD_SHA
```

**If the base is ambiguous** — the user said "review my commits" without specifying a base — **ask before proceeding**:

> "Which branch should I compare against? (e.g. `origin/staging`, `origin/main`, `HEAD~1`)"

### Mode C — Staged (pre-commit)

**Triggers:** User mentions "staged files", "before I commit", "my changes", or no specific commit/PR reference and there are staged changes in the index.

```bash
# Check what is staged
git diff --cached --stat

# Get the full staged diff
git diff --cached
```

If `git diff --cached` returns nothing, check for unstaged changes with `git diff --stat`. If both are empty, inform the user there is nothing to review.

### When the mode is ambiguous

If the user's request doesn't clearly match any trigger above, **ask before running anything**:

> "What would you like me to review?
> - A GitHub PR (share the PR number or URL)
> - Committed changes (I'll need a base branch or commit range)
> - Staged files (changes ready to commit but not yet committed)"

Never guess the mode. Running the wrong diff command is the most common failure — it leads to reviewing the wrong code entirely.

---

## Step 2: Gather context

Once the mode is confirmed and the diff is collected:

1. Note the list of changed files from `--stat` output.
2. For Mode A: use the PR title/body as the description of what was implemented.
3. For Modes B/C: summarise what was implemented based on file names and the diff itself if no description was provided.

---

## Step 3: Dispatch the subagent

Read `code-reviewer.md` and substitute all placeholders. The subagent prompt must include:
1. The filled template from `code-reviewer.md`
2. The full text of `references/architecture-checklist.md`
3. The full text of `references/library-best-practices.md`

| Placeholder | Source |
|-------------|--------|
| `{WHAT_WAS_IMPLEMENTED}` | PR body (Mode A) / your summary (Modes B, C) |
| `{REQUIREMENTS}` | PR description / Jira ticket / user request |
| `{DIFF_COMMAND}` | The exact command used to produce the diff |
| `{DIFF_STAT}` | Output of `--stat` |
| `{FULL_DIFF}` | Full diff output — inline in the prompt |

**Always inline the full diff** in the subagent prompt. Do not ask the subagent to run git commands itself — it will compute the wrong range. You own the diff collection; the subagent owns the review.

---

## Step 4: Act on feedback

| Severity | Action |
|----------|--------|
| **Critical** | Fix immediately. Do not proceed until resolved. |
| **Important** | Fix before considering the task done. |
| **Minor** | Fix if quick (<2 min), otherwise note for follow-up. |
| **Architecture Suggestions** | Evaluate honestly. Implement if the reviewer makes a strong case. Push back with reasoning if you disagree. |

## Step 5: Re-review if needed

If Critical or multiple Important issues were found, re-run the review after fixes to verify resolution.

---

## Integration with Workflows

**With `/feature-development`:**
- Phase 4 (Quality Review) invokes this skill for L tasks
- Self-review checklist runs first, then this skill catches what self-review misses

**With `/commit`:**
- Use Mode C (staged) to review BEFORE the final commit
- If already committed, use Mode B (committed range)

**Standalone:**
- Can be invoked independently at any time
- Useful as a second opinion on architecture decisions
