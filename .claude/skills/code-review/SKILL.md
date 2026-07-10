---
name: code-review
description: "Comprehensive AI code review using the unified methodology. Reviews code through 9 sections (Correctness, Security, Architecture, Library Usage, Reinventing the Wheel, Performance, Naming, Accessibility, Jira Requirements). Supports GitHub PR, committed range, or staged files. Includes Jira requirements verification via MCP. Use after completing features, before merging, or as a pre-commit check."
---

# Code Review

Dispatch a code-reviewer subagent that reviews code through 9 structured sections using the unified methodology.

## When to Use

**Mandatory:**
- After completing a feature (M/L tasks)
- Before merging to main or prelive
- After cross-domain changes (touching multiple libs)

**Recommended:**
- After fixing complex bugs
- After refactoring
- When uncertain about architecture decisions

**Skip for:** Single-line fixes, text/copy changes, styling-only tweaks.

---

## Phase 1: Determine Review Mode

**Before running any commands**, determine which mode applies based on what the user said.

### Mode A — GitHub PR

**Triggers:** User mentions a PR number, a GitHub URL, or phrases like "review this PR", "review PR 123".

```bash
gh pr view <PR_NUMBER> --json number,title,body,baseRefName,headRefName
gh pr diff <PR_NUMBER>
```

Use the PR title and body as context for what was implemented.

### Mode B — Committed Range

**Triggers:** User mentions a branch comparison ("vs staging", "vs main"), a specific commit SHA, or phrases like "review my last commit", "review the last N commits".

```bash
BASE_SHA=$(git merge-base HEAD <base-branch>)
git diff --stat $BASE_SHA..HEAD
git diff $BASE_SHA..HEAD
```

**If the base is ambiguous** — ask before proceeding:
> "Which branch should I compare against? (e.g. `origin/staging`, `origin/main`, `HEAD~1`)"

### Mode C — Staged (pre-commit)

**Triggers:** User mentions "staged files", "before I commit", "my changes", or no specific commit/PR reference and there are staged changes.

```bash
git diff --cached --stat
git diff --cached
```

If both `git diff --cached` and `git diff` return nothing, inform the user there is nothing to review.

### When Ambiguous

If the user's request doesn't clearly match any trigger above, **ask before running anything**:

> "What would you like me to review?
> - A GitHub PR (share the PR number or URL)
> - Committed changes (I'll need a base branch or commit range)
> - Staged files (changes ready to commit)"

Never guess the mode. Running the wrong diff command leads to reviewing the wrong code entirely.

---

## Phase 2: Gather Context

Once the mode is confirmed and the diff is collected:

### 2.1 Read Methodology

Read these files:
1. `docs/review/code-review-methodology.md` — the review rules, sections, and output format
2. `docs/standards/naming-conventions.md` — naming rules reference
3. `docs/standards/best-practices.md` — architecture rules reference

### 2.2 Jira Requirements (if available)

1. Extract ticket ID from branch name or PR title (pattern: `REL-\d+` or `TT-\d+`)
2. If no ticket ID found — Section 9 = "Skipped: no ticket ID in branch name"
3. If ticket ID found:
   a. Fetch ticket via `mcp__plugin_atlassian_atlassian__getJiraIssue`
   b. Read the description — extract requirements and acceptance criteria (free text, no custom field)
   c. If no requirements found in the ticket — check parent ticket (follow `parent` field)
   d. If parent also has no requirements — check grandparent (max 2 levels up)
   e. If still no requirements — Section 9 = "No criteria found in REL-XXXX or parent tickets. Manual verification needed."

### 2.3 Determine Severity Context

Based on the target branch:
- `main` — PRODUCTION: strict
- `prelive` — PRE-RELEASE: moderate
- `staging` / `REL-*` / other — DEVELOPMENT: standard

---

## Phase 3: Dispatch Subagent

Launch a code-reviewer subagent with the following context:

1. **Role**: "You are a meticulous senior frontend engineer reviewing code for Reelly, a real estate monorepo."
2. **Methodology**: Full content of `docs/review/code-review-methodology.md`
3. **Standards**: Full content of `naming-conventions.md` and `best-practices.md`
4. **Environment**: `JIRA_ACCESS=true`, severity context, target branch
5. **Diff**: The complete diff (inlined in the prompt)
6. **Jira requirements** (if found): The acceptance criteria extracted in Phase 2.2
7. **What was implemented**: PR body (Mode A) / your summary (Modes B, C)
8. **Diff stat**: The `--stat` output showing files changed

**Always inline the full diff** in the subagent prompt. Do not ask the subagent to run git commands — it will compute the wrong range. You own the diff collection; the subagent owns the review.

The subagent MUST:
- Follow the methodology document exactly
- Use Read, Glob, Grep to verify findings against full file context
- Apply the Review Principles (especially Verify Before Flagging)
- Output in the exact format specified in the methodology

---

## Phase 4: Deep Review Mode (optional)

**Trigger**: User runs `/code-review --deep` or explicitly asks for a deep review.

**Conditions**: Only effective for small PRs (diff < 50KB). For larger diffs, inform the user that deep review may reduce quality due to context pressure.

In deep review mode, the subagent additionally:
- Performs extended React performance analysis: checks for waterfall data fetching patterns, unnecessary client-side computation that could be server-side, Suspense boundary placement
- Performs extended composition analysis: checks for boolean prop proliferation, missing compound component patterns, Context re-render risks
- Checks Next.js 16 specific patterns: RSC vs client boundary optimization, Server Actions vs Route Handler choice, cache strategy

This uses Claude's built-in knowledge — no external skill dependencies required.

---

## Phase 5: Act on Feedback

Present the review output to the user. If they ask to fix issues:

| Severity | Action |
|----------|--------|
| **Critical** | Fix immediately. Do not proceed until resolved. |
| **Important** | Fix before considering the task done. |
| **Minor** | Fix if quick (<2 min), otherwise note for follow-up. |

If Critical or multiple Important issues were found, offer to re-run the review after fixes to verify resolution.

---

## Integration with Workflows

**With `/commit`:**
- Use Mode C (staged) to review BEFORE the final commit
- If already committed, use Mode B (committed range)

**Standalone:**
- Can be invoked independently at any time
- Useful as a second opinion on architecture decisions
