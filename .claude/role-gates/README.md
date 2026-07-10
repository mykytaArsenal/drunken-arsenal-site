# Role Gates — CPO / CEO

Claude Code **PreToolUse hooks** that constrain what two non-technical execs can
do in this repo *through Claude Code*. Design:
[`docs/superpowers/specs/2026-06-08-role-gates-cpo-ceo-design.md`](../../docs/superpowers/specs/2026-06-08-role-gates-cpo-ceo-design.md).

The gate **logic lives in the repo** (versioned, reviewable). Only the **role
selection** is local: each person's gitignored `.claude/settings.local.json`
wires the hooks for their role.

## What each role can do

| | CPO | CEO |
|---|---|---|
| Edit/Write files | anywhere | only under `specs/raw/` (repo root) |
| Bash | open | open (dev server, build, render) |
| Commit/push on a **branch** | allowed (→ PR) | allowed **only if spec-only** (no nx project affected) |
| Commit/push to **`main`** | allowed **only if** the affected set is **admin-only** (`{admin}` or empty) | denied |
| `git reset --hard` | denied | denied |

"Affected" is computed with `nx show projects --affected` over committed-but-unpushed
∪ staged ∪ unstaged ∪ untracked files. A shared lib that `listing` imports makes
`listing` affected — so touching shared code is *not* admin-only.

Two invariants this depends on:

- **`specs` and `docs` are in `.nxignore`.** Otherwise they map into the root `reelly`
  nx project and a spec-only commit would affect `reelly`, blocking the CEO entirely.
  `test-gates.sh` has a regression check for this.
- **nx failure → fail closed.** If `nx show projects --affected` itself errors, the
  gate denies the commit/push ("could not verify") instead of silently allowing it.

- **CPO direct-to-main** is for admin-app work: if `nx affected` is `{admin}` (or
  empty) it's allowed; anything else (prod apps, shared libs) must go via a branch + PR.
- **CEO commits are spec-only**: specs belong to no nx project, so any affected
  project at all blocks the commit/push (on any branch). To change `main` the
  CEO must also be on a branch — `main` is denied outright.

## Files

| File | Role |
|---|---|
| `_lib.sh` | shared: stdin parse (node, no `jq`), `deny`, `is_destructive_reset`, `is_git_commit_or_push` (word-boundary — `git stash push` doesn't trigger), `git_targets_main` (incl. `:main` deletion refspec), `nx_affected_for_files` / `nx_affected_projects` (fail-closed on nx error), pure filters `cpo_main_offenders` / `ceo_commit_offenders` |
| `cpo-gate.sh` | PreToolUse:Bash — reset block + admin-only gate on direct-to-main |
| `ceo-readonly-gate.sh` | PreToolUse:Edit\|Write\|NotebookEdit — writes only under `specs/raw/` |
| `ceo-git-gate.sh` | PreToolUse:Bash — reset block + spec-only commit gate + no commit/push to main |
| `settings.cpo.local.json.example` / `settings.ceo.local.json.example` | per-role wiring templates |
| `test-gates.sh` | verification harness (`./.claude/role-gates/test-gates.sh`) |

## Install (per person)

1. Copy the template for your role to the local (gitignored) settings file:
   ```bash
   # CPO
   cp .claude/role-gates/settings.cpo.local.json.example .claude/settings.local.json
   # CEO
   cp .claude/role-gates/settings.ceo.local.json.example .claude/settings.local.json
   ```
2. Edit `enabledMcpjsonServers` in that file to your own MCP server list.
3. Restart Claude Code (hooks load at session start).

> Developers do nothing — they never copy a template, so no hook is wired for them.

## Trust model / limits (accepted)

- **Claude-only enforcement.** Manual `git` in a raw terminal bypasses the gates.
- **MCP not gated.** Write-capable MCP tools (`github`, `serena`) are *not*
  intercepted — keep the exec's `enabledMcpjsonServers` honest.
- **CEO Bash is open** → file writes via shell redirection (`>`, `sed -i`) are not
  blocked. Read-only is enforced for the Edit/Write/NotebookEdit tools only.
- **`origin/main` staleness:** no auto-fetch; a stale ref can pass a check it
  shouldn't. The helper warns on stderr. Mitigation: the deliver-spec flow runs
  `git fetch` + rebase onto the current base before committing (see
  `.claude/skills/deliver-spec/SKILL.md` step 3).
- **MCP templates auto-enable all `.mcp.json` servers** (`enableAllProjectMcpServers`),
  including write-capable ones (github). Accepted: the operator is Claude driven by
  the skills, not an adversary.
- No GitHub branch protection, no git/husky hooks for these roles.

## Verify the gates

```bash
./.claude/role-gates/test-gates.sh
```

Drives each gate with sample PreToolUse payloads and asserts allow vs deny.
The prod-affected branch of `cpo-gate` is validated against real `nx` output.
