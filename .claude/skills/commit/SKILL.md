---
name: commit
description: "Stage and commit changes following the project's REL-/TT: commit conventions. Use when the user wants to commit code, stage files, or create a git commit."
---

# Commit

Create a git commit following the project's commit message conventions.

## Commit Message Rules

The project enforces commit messages via a `commit-msg` hook. Every commit **must** start with one of:

- **`REL-<number>`** — Work linked to a Jira ticket (features, bugs, refactors)
- **`TT:`** — Tooling, tech debt, or quick fixes not tied to a ticket

Preferred format:
```
REL-123: Short description of the change
```
```
TT: Short description of the change
```

**NEVER add Co-Authored-By lines.**

---

## Step 1: Understand current state

Run these in parallel:

```bash
git status
```

```bash
git diff --stat
```

```bash
git diff --cached --stat
```

```bash
git log --oneline -5
```

Review what's staged, unstaged, and untracked. Understand the recent commit style.

---

## Step 2: Determine what to commit

If nothing is staged (`git diff --cached` is empty), decide what should be included.

Ask the user with AskUserQuestion:
- **All changes** — Stage everything (modified + untracked)
- **Only modified** — Stage modified files only (no new untracked files)
- **Let me pick** — Show the file list and let the user choose

If user picks "Let me pick", show the changed files and ask which to include.

**Important:**
- Never stage files that look like secrets (`.env`, `credentials.json`, private keys)
- If such files appear in the diff, warn the user explicitly
- Prefer `git add <specific-files>` over `git add -A` or `git add .`

---

## Step 3: Determine commit prefix

Check the current branch name:

```bash
git branch --show-current
```

- If the branch name contains `REL-<number>` (e.g., `REL-847`, `feature/REL-123`), extract it and use it as the prefix.
- If no ticket number is found in the branch name, ask the user:

Ask the user with AskUserQuestion:
- **REL ticket** — Link to a Jira ticket (will ask for the number)
- **TT** — Tooling / tech debt / quick fix

If the user picks REL, ask for the ticket number (e.g., "847").

---

## Step 4: Draft the commit message

Analyze the staged changes:

```bash
git diff --cached
```

Write a clear, concise commit message:

1. **Subject line**: `<PREFIX>: <description>` (under 72 characters)
   - Use imperative mood ("Add", "Fix", "Update", "Remove", "Refactor")
   - Focus on **why** or **what changed**, not implementation details
   - Don't end with a period
2. **Body** (optional, only for complex changes): Blank line after subject, then explain context or reasoning. Wrap at 72 characters.

Examples of good messages:
```
REL-847: Extract monitoring module from sentry interceptors
REL-728: Fix scroll behavior in FavouritesDialog and Drawer
TT: Update pnpm lockfile after dependency bump
REL-692: Add promo overlay for PDF presentation
```

Present the drafted message to the user and ask for approval:

Ask the user with AskUserQuestion:
- **Commit** — Use this message as-is
- **Edit** — I want to modify the message

If the user wants to edit, ask them what to change and redraft.

---

## Step 5: Create the commit

Stage the files (if not already staged) and commit:

```bash
git add <files>
git commit -m "$(cat <<'EOF'
<commit message here>
EOF
)"
```

Then verify:

```bash
git status
```

---

## Step 6: Report

Tell the user:
- What was committed (file count, summary of changes)
- The full commit message used
- Remind them to push when ready: `git push`

If the commit failed due to the pre-commit hook (lint-staged), fix the linting issues and retry with a **new** commit (never amend).

If the commit failed due to the commit-msg hook, fix the message format and retry.
