#!/usr/bin/env bash
# Verification harness for the role gates. Run: ./.claude/role-gates/test-gates.sh
# Exercises the shared helpers and drives each gate with sample PreToolUse
# payloads, asserting allow (empty stdout) vs deny (permissionDecision:"deny").
#
# Network-free: the prod-affected branch of cpo-gate is covered separately by
# `--live` (runs real `nx show projects`), the rest is deterministic.

set -uo pipefail
DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=_lib.sh
. "$DIR/_lib.sh"

PASS=0
FAIL=0
ok()   { PASS=$((PASS+1)); printf '  \033[32mok\033[0m   %s\n' "$1"; }
bad()  { FAIL=$((FAIL+1)); printf '  \033[31mFAIL\033[0m %s\n' "$1"; }

# assert_func <expect 0|1> <label> ; runs the *next* command, compares status
assert_status() { local exp="$1" label="$2"; shift 2; "$@"; local rc=$?; [ "$rc" -eq "$exp" ] && ok "$label" || bad "$label (rc=$rc, want=$exp)"; }

# payload <tool> <command> <path> -> emits JSON
payload() { node -e '
  const [tool, cmd, p] = process.argv.slice(1);
  const ti = {};
  if (cmd) ti.command = cmd;
  if (p) ti.file_path = p;
  process.stdout.write(JSON.stringify({ hook_event_name:"PreToolUse", tool_name: tool, tool_input: ti }));
' "$1" "$2" "$3"; }

# run_gate <gate.sh> <tool> <command> <path> -> "deny" | "allow"
run_gate() {
  local out
  out="$(payload "$2" "$3" "$4" | "$DIR/$1" 2>/dev/null)"
  case "$out" in
    *'"permissionDecision":"deny"'*) echo deny ;;
    *) echo allow ;;
  esac
}
expect_gate() { # <gate> <tool> <cmd> <path> <expect deny|allow> <label>
  local got; got="$(run_gate "$1" "$2" "$3" "$4")"
  [ "$got" = "$5" ] && ok "$6" || bad "$6 (got=$got want=$5)"
}

echo "== _lib: read_payload =="
{ IFS= read -r -d '' a; IFS= read -r -d '' b; } < <(printf '%s' '{"tool_name":"Bash","tool_input":{"command":"line1\nline2"}}' | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);const w=v=>process.stdout.write(String(v||"")+"\0");w(j.tool_name);w(j.tool_input.command)})')
[ "$a" = "Bash" ] && ok "tool_name parsed" || bad "tool_name parsed (got '$a')"
[ "$b" = $'line1\nline2' ] && ok "multiline command survives NUL parse" || bad "multiline command (got '$b')"

echo "== _lib: is_destructive_reset =="
for c in "git reset --hard" "git reset --hard HEAD~1" "FOO=bar git reset --hard" "git reset HEAD~2 --hard"; do
  assert_status 0 "deny: $c" is_destructive_reset "$c"
done
for c in "git reset --soft HEAD~1" "git reset HEAD" "git status" "echo git reset --hardly"; do
  assert_status 1 "allow: $c" is_destructive_reset "$c"
done

echo "== _lib: is_git_commit_or_push (word boundaries) =="
for c in "git commit -m wip" "git push origin feat" "git -C /tmp/x push" "cd a && git push" "git --no-pager commit -m x"; do
  assert_status 0 "match: $c" is_git_commit_or_push "$c"
done
for c in "git stash push" "grep 'git commit' README.md" "git status" "pnpm dev" "git push-to-deploy"; do
  assert_status 1 "no match: $c" is_git_commit_or_push "$c"
done

echo "== _lib: git_targets_main (refspec, branch-independent) =="
assert_status 0 "push origin main"      git_targets_main "git push origin main"
assert_status 0 "push origin HEAD:main" git_targets_main "git push origin HEAD:main"
assert_status 0 "push -f origin main"   git_targets_main "git push --force origin main"
assert_status 0 "push x:main"           git_targets_main "git push origin feature:main"
assert_status 0 "push :main (deletion)" git_targets_main "git push origin :main"
assert_status 1 "push origin feature"   git_targets_main "git push origin feature"
assert_status 1 "push main:feature"     git_targets_main "git push origin main:feature"
assert_status 1 "ls"                    git_targets_main "ls -la"
# commit/bare-push depend on the current branch:
cur="$(git_current_branch)"
if [ "$cur" = "main" ]; then exp_commit=0; else exp_commit=1; fi
assert_status "$exp_commit" "commit on '$cur'" git_targets_main "git commit -m wip"

echo "== _lib: deny emits valid JSON =="
( deny "boom" >/tmp/_rg_deny.json 2>/dev/null ); node -e 'const j=require("/tmp/_rg_deny.json");if(j.hookSpecificOutput.permissionDecision==="deny"&&j.hookSpecificOutput.permissionDecisionReason==="boom")process.exit(0);process.exit(1)' \
  && ok "deny JSON shape" || bad "deny JSON shape"

echo "== _lib: cpo_main_offenders (admin-only direct-to-main) =="
eq() { [ "$1" = "$2" ] && ok "$3" || bad "$3 (got '$1' want '$2')"; }
eq "$(cpo_main_offenders '')"                ""                  "nothing affected → no offenders"
eq "$(cpo_main_offenders 'admin')"           ""                  "admin-only → no offenders"
eq "$(cpo_main_offenders $'admin\nlisting')" "listing"           "admin+prod → prod offends"
eq "$(cpo_main_offenders $'components\nlisting')" "components,listing" "libs+prod → both offend"
eq "$(cpo_main_offenders $'\n  \nadmin\n')"  ""                  "blank lines ignored"

echo "== _lib: ceo_commit_offenders (spec-only) =="
eq "$(ceo_commit_offenders '')"              ""                  "nothing affected → no offenders"
eq "$(ceo_commit_offenders 'admin')"         "admin"             "any project (admin) → offends"
eq "$(ceo_commit_offenders $'utils\nlisting')" "utils,listing"   "multiple projects → all offend"

echo "== nx: specs/docs are not nx inputs (.nxignore regression) =="
# The CEO spec-only rule relies on spec/doc files affecting NO nx project. Without
# the .nxignore entries they fall into the root "reelly" project and block everything.
repo_root="$(git rev-parse --show-toplevel)"
probe_aff="$(nx_affected_for_files "$repo_root" "specs/raw/_probe/README.md,docs/_probe.md")" \
  || bad "nx probe invocation failed"
[ -z "$probe_aff" ] && ok "specs/docs affect no nx project" || bad "specs/docs affect: $probe_aff (add specs+docs to .nxignore)"

echo "== _lib: nx failure → fail-closed status =="
fake_bin="$(mktemp -d)"; printf '#!/bin/sh\nexit 1\n' > "$fake_bin/pnpm"; chmod +x "$fake_bin/pnpm"
( PATH="$fake_bin:$PATH" nx_affected_for_files "$repo_root" "apps/listing/x.ts" >/dev/null 2>&1 )
rc=$?
[ "$rc" -ne 0 ] && ok "nx error propagates as non-zero (rc=$rc)" || bad "nx error swallowed (rc=0 → would fail open)"
rm -rf "$fake_bin"

echo "== ceo-readonly-gate (specs/raw only) =="
expect_gate ceo-readonly-gate.sh Write "" "specs/raw/p/f/README.md"  allow "Write specs/raw allowed"
expect_gate ceo-readonly-gate.sh Edit  "" "specs/raw/p/f/ui.md"      allow "Edit specs/raw allowed"
expect_gate ceo-readonly-gate.sh Write "" "specs/drafts/p/f/README.md" deny "Write specs/drafts denied (CPO zone)"
expect_gate ceo-readonly-gate.sh Write "" "specs/GLOSSARY.md"        deny  "Write specs root doc denied"
expect_gate ceo-readonly-gate.sh Write "" "apps/listing/x.ts"        deny  "Write outside specs denied"
expect_gate ceo-readonly-gate.sh Edit  "" "specs/raw/../drafts/x.md" deny  "path escaping raw denied"
expect_gate ceo-readonly-gate.sh Bash  "rm -rf /" ""                 allow "non-file tool ignored"

echo "== ceo-git-gate =="
expect_gate ceo-git-gate.sh Bash "git push origin main" "" deny  "CEO push main denied"
expect_gate ceo-git-gate.sh Bash "git reset --hard"     "" deny  "CEO reset --hard denied"
expect_gate ceo-git-gate.sh Bash "pnpm dev"             "" allow "CEO dev server allowed"
# Branch push is allowed ONLY when spec-only — the real nx state decides here:
# a clean/spec-only tree ⇒ allow, otherwise the spec-only rule denies first.
if [ -n "$(nx_affected_projects)" ]; then ceo_branch_exp=deny; else ceo_branch_exp=allow; fi
expect_gate ceo-git-gate.sh Bash "git push origin feat" "" "$ceo_branch_exp" "CEO branch push ($ceo_branch_exp; nx-state-dependent)"

echo "== cpo-gate (non-nx branches) =="
expect_gate cpo-gate.sh Bash "git reset --hard"      "" deny  "CPO reset --hard denied"
expect_gate cpo-gate.sh Bash "git push origin feat"  "" allow "CPO branch push allowed (→PR)"
expect_gate cpo-gate.sh Bash "ls -la"                "" allow "CPO non-git allowed"
expect_gate cpo-gate.sh Edit "" "apps/listing/x.ts"  allow "CPO Edit anywhere allowed (not Bash)"

if [ "${1:-}" = "--live" ]; then
  echo "== gates --live (real nx affected; requires a staged change on main) =="
  echo "  CPO: stage a non-admin change (e.g. apps/listing or a shared lib) on main, then:"
  echo "   echo '{\"tool_name\":\"Bash\",\"tool_input\":{\"command\":\"git commit -m x\"}}' | ./.claude/role-gates/cpo-gate.sh   # → deny"
  echo "  CPO: stage an admin-only change (apps/admin) on main → same command should allow."
  echo "  CEO: stage ANY code change, then the same command via ceo-git-gate.sh → deny (spec-only)."
fi

echo
echo "PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
