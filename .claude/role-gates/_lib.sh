# shellcheck shell=bash
# Shared helpers for role-gate PreToolUse hooks (sourced, not executed directly).
#
# Consumers: cpo-gate.sh, ceo-git-gate.sh, ceo-readonly-gate.sh
# Hard deps:  git, node (repo runtime). jq is intentionally NOT required —
#             the execs' machines may not have it, node always does.
#
# Contract: a gate sources this file, calls `read_payload`, inspects the
# exposed vars, and either falls through to `exit 0` (allow / no decision)
# or calls `deny "<reason>"` (which exits the process).
#
# Deliberately NO `set -e`: a gate MUST control its own exit code (0 = allow),
# and a stray non-zero from a helper would otherwise abort with a confusing
# non-blocking error. Helpers return status explicitly instead.

# Populated by read_payload:
PAYLOAD=""      # raw JSON from stdin
TOOL_NAME=""    # e.g. "Bash", "Edit", "Write", "NotebookEdit"
TOOL_CMD=""     # tool_input.command (Bash) — may contain newlines
TOOL_PATH=""    # tool_input.file_path | notebook_path | path (file tools)

# Read and parse the PreToolUse JSON payload from stdin.
# Uses NUL delimiters so commands/paths containing newlines or tabs survive.
read_payload() {
  PAYLOAD="$(cat)"
  {
    IFS= read -r -d '' TOOL_NAME
    IFS= read -r -d '' TOOL_CMD
    IFS= read -r -d '' TOOL_PATH
  } < <(printf '%s' "$PAYLOAD" | node -e '
    let s = "";
    process.stdin.on("data", d => (s += d)).on("end", () => {
      let j = {};
      try { j = JSON.parse(s); } catch { /* malformed → empty fields → allow */ }
      const ti = j.tool_input || {};
      const w = v => process.stdout.write(String(v == null ? "" : v) + "\0");
      w(j.tool_name);
      w(ti.command);
      w(ti.file_path || ti.notebook_path || ti.path);
    });
  ') || true
}

# Emit a PreToolUse "deny" decision and exit.
# Primary path: JSON on stdout + exit 0 (verified against Claude Code docs).
# The reason is also written to stderr so it is visible if the JSON schema
# ever changes under us; exit 2 would be the schema-independent fallback.
deny() {
  local reason="${1:-Blocked by role gate}"
  node -e '
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: process.argv[1],
      },
    }));
  ' "$reason"
  printf 'role-gate: %s\n' "$reason" >&2
  exit 0
}

# Current branch name (empty on detached HEAD / non-repo).
git_current_branch() {
  git rev-parse --abbrev-ref HEAD 2>/dev/null
}

# True if $1 is a `git reset --hard` in any form:
#   git reset --hard | git reset --hard HEAD~1 | FOO=bar git reset --hard | git reset HEAD~1 --hard
is_destructive_reset() {
  printf '%s' "${1:-}" | grep -Eq \
    'git([[:space:]]+[A-Za-z_][A-Za-z0-9_]*=[^[:space:]]+)*[[:space:]]+reset([[:space:]]+[^|;&]*)?[[:space:]]+--hard([[:space:]]|$)'
}

# True if $1 actually invokes `git <subcmd>` ($2, may be an ERE alternation) as
# a command — word-boundary match after `git` + optional global flags, so
# `git stash push` or `grep 'git commit'` do NOT trigger.
is_git_subcmd() {
  printf '%s' "${1:-}" | grep -Eq \
    "(^|[|;&[:space:]])git([[:space:]]+(-[A-Za-z-]+|--[A-Za-z-]+(=[^[:space:]]+)?|-C[[:space:]]+[^[:space:]|;&]+))*[[:space:]]+${2}([[:space:]]|\$)"
}

# Commit/push are the only policy-relevant git commands for the gates.
is_git_commit_or_push() { is_git_subcmd "${1:-}" '(commit|push)'; }

# True if $1 is a git commit/push that lands on (or deletes) `main`.
#   commit: HEAD is on main
#   push:   explicit main refspec (origin main | HEAD:main | x:main | :main —
#           the last one DELETES remote main), OR a bare
#           `git push [origin] [flags]` while HEAD is on main
git_targets_main() {
  local cmd="${1:-}"
  if is_git_subcmd "$cmd" commit; then
    [ "$(git_current_branch)" = "main" ]
    return $?
  fi
  if is_git_subcmd "$cmd" push; then
    # ([src]:)?main covers: main | HEAD:main | feature:main | :main (deletion)
    if printf '%s' "$cmd" | grep -Eq 'push([[:space:]]+[^|;&]*)?[[:space:]]([A-Za-z0-9_./-]*:)?main([[:space:]]|$)'; then
      return 0
    fi
    # bare push (no explicit refspec) → depends on current branch
    if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+push([[:space:]]+(origin|-[A-Za-z-]+|--[A-Za-z-]+(=[^[:space:]]+)?))*[[:space:]]*([|;&].*)?$'; then
      [ "$(git_current_branch)" = "main" ]
      return $?
    fi
    return 1
  fi
  return 1
}

# Run `nx show projects --affected` for an explicit comma-separated file list
# and normalize the output (JSON array or whitespace-separated) to one project
# per line. Returns NON-ZERO when the nx invocation itself fails — callers
# must treat that as "could not verify" and FAIL CLOSED, not as "no projects".
nx_affected_for_files() {
  local root="$1" files="$2" raw rc
  raw="$(cd "$root" && pnpm -s exec nx show projects --affected --files="$files" 2>/dev/null)"
  rc=$?
  if [ "$rc" -ne 0 ]; then
    printf 'role-gate: `nx show projects --affected` failed (rc=%s) — failing closed\n' "$rc" >&2
    return 1
  fi
  printf '%s' "$raw" | node -e '
    let s = "";
    process.stdin.on("data", d => (s += d)).on("end", () => {
      s = s.trim();
      let arr;
      try { arr = JSON.parse(s); } catch { arr = s ? s.split(/\s+/) : []; }
      if (!Array.isArray(arr)) arr = String(arr).split(/\s+/);
      process.stdout.write(arr.filter(Boolean).join("\n"));
    });
  '
}

# Print the set of nx projects affected by all local work, one per line.
# Changed files = (origin/main..HEAD committed) ∪ staged ∪ unstaged ∪ untracked.
# No fetch is performed — warns on stderr if origin/main is missing/stale.
# Propagates nx failure as a non-zero status (see nx_affected_for_files).
nx_affected_projects() {
  local root
  root="$(git rev-parse --show-toplevel 2>/dev/null)" || return 0

  if ! git -C "$root" rev-parse --verify --quiet origin/main >/dev/null 2>&1; then
    printf 'role-gate: warning — origin/main not found locally; affected calc may be incomplete (no fetch performed)\n' >&2
  fi

  local changed
  changed="$( {
    git -C "$root" diff origin/main HEAD --name-only 2>/dev/null
    git -C "$root" diff --name-only 2>/dev/null
    git -C "$root" diff --cached --name-only 2>/dev/null
    git -C "$root" ls-files --others --exclude-standard 2>/dev/null
  } | LC_ALL=C sort -u | grep -v '^[[:space:]]*$' )"

  [ -z "$changed" ] && return 0

  local files
  files="$(printf '%s' "$changed" | paste -sd, -)"

  nx_affected_for_files "$root" "$files"
}

# --- Pure policy filters (no git/nx) ---------------------------------------
# These take a newline-separated affected-project list (the output of
# nx_affected_projects) and return the offending projects, comma-separated.
# Empty output == the commit is permitted. Kept pure so they are unit-testable
# without a live nx run (the integration path is covered by --live).

# nx projects that may be touched by a CPO direct-to-main commit. Only the
# admin app is allowed; anything else (prod apps, shared libs) must go via PR.
CPO_DIRECT_MAIN_ALLOW='admin'

# CPO direct-to-main policy: print affected projects outside the allow-list.
cpo_main_offenders() {
  printf '%s\n' "${1:-}" | grep -v '^[[:space:]]*$' | grep -vx "$CPO_DIRECT_MAIN_ALLOW" | paste -sd, -
}

# CEO commit policy: commits must be spec-only (affect no nx project).
# Print every affected project; non-empty == blocked.
ceo_commit_offenders() {
  printf '%s\n' "${1:-}" | grep -v '^[[:space:]]*$' | paste -sd, -
}
