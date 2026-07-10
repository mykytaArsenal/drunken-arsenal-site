#!/usr/bin/env bash
# PreToolUse:Bash gate for the CPO role.
#
# Policy (see docs/superpowers/specs/2026-06-08-role-gates-cpo-ceo-design.md):
#   1. `git reset --hard` is always denied (destructive).
#   2. Non commit/push commands are allowed.
#   3. commit/push that does NOT target main → allowed (branch → PR escape hatch).
#   4. commit/push that targets main → allowed ONLY when the affected set is
#      admin-only ({admin} or empty); any other project (prod apps, shared libs)
#      → denied. The CPO may freely affect the admin app direct-to-main, but
#      everything else must go through a branch + PR.

ROLE_GATES_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=_lib.sh
. "$ROLE_GATES_DIR/_lib.sh"

read_payload

# Only Bash is gated here.
[ "$TOOL_NAME" = "Bash" ] || exit 0

cmd="$TOOL_CMD"

if is_destructive_reset "$cmd"; then
  deny '`git reset --hard` is blocked — destructive. Use `git restore` / `git revert` instead.'
fi

# Only commit/push are policy-relevant (word-boundary match — `git stash push`
# or a quoted "git commit" inside another command do not trigger).
is_git_commit_or_push "$cmd" || exit 0

# Branch work goes through PR — always allowed.
git_targets_main "$cmd" || exit 0

# Targets main: allowed only when the affected set is admin-only.
# nx failure → fail closed: without a verified affected set the gate cannot
# authorize a direct-to-main commit.
if ! affected="$(nx_affected_projects)"; then
  deny "Could not verify the affected nx projects (nx failed) — direct-to-main is blocked. Retry, or show this to a developer; a branch + PR still works."
fi
offenders="$(cpo_main_offenders "$affected")"

if [ -n "$offenders" ]; then
  deny "Direct-to-main is admin-only for the CPO; this change also affects: ${offenders}. Keep it to the admin app, or create a branch + open a PR for dev approval."
fi

exit 0
