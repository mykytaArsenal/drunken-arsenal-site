#!/usr/bin/env bash
# PreToolUse:Bash gate for the CEO role.
#
# Policy:
#   1. `git reset --hard` is always denied (destructive).
#   2. commit/push that affects ANY nx project → denied (CEO commits are
#      spec-only; specs belong to no project, so the affected set must be empty).
#   3. commit/push targeting main → denied (CEO works on branches only).
#   4. everything else (spec-only branch commit/push, dev server, build, render) → allowed.
#
# NOTE: by design CEO Bash is otherwise open, so file writes via shell
# redirection are NOT intercepted here (accepted trade-off — see design §8).

ROLE_GATES_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=_lib.sh
. "$ROLE_GATES_DIR/_lib.sh"

read_payload

[ "$TOOL_NAME" = "Bash" ] || exit 0

cmd="$TOOL_CMD"

if is_destructive_reset "$cmd"; then
  deny '`git reset --hard` is blocked — destructive. Use `git restore` / `git revert` instead.'
fi

# Only commit/push are policy-relevant (word-boundary match — `git stash push`
# or a quoted "git commit" inside another command do not trigger).
is_git_commit_or_push "$cmd" || exit 0

# Spec-only rule: a CEO commit/push must not touch any nx project.
# nx failure → fail closed: without a verified affected set the gate cannot
# confirm the commit is spec-only.
if ! affected="$(nx_affected_projects)"; then
  deny "Could not verify the affected nx projects (nx failed) — commit/push is blocked. Retry, or show this to a developer."
fi
offenders="$(ceo_commit_offenders "$affected")"
if [ -n "$offenders" ]; then
  deny "CEO commits must be spec-only; this change affects nx project(s): ${offenders}. Specs belong to no project — drop the code changes or hand off to the CPO."
fi

if git_targets_main "$cmd"; then
  deny "CEO can't commit/push to main — create a branch and open a PR for dev approval."
fi

exit 0
