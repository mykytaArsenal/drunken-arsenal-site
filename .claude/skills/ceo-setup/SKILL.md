---
name: ceo-setup
description: First-time bootstrap of a CEO (or CPO) machine for the spec workflow — install the toolchain (nvm, latest Node, pnpm), install repo deps, connect every MCP server, and wire the role gates. Use on a fresh machine, or when the toolchain / MCP servers / role gates are not ready.
---

# ceo-setup

Bring an executive's machine from zero to a working spec workflow. Run once per machine, in a
plain Claude session **before** the role gates are wired.

## Two operating principles (apply at EVERY step)

1. **Do it yourself when you can.** Run the commands, check the results, move on.
2. **When you hit a wall, hand it to the user — in plain language, in Ukrainian.** A wall =
   anything you cannot do: `sudo`/admin rights, a secret only they have, an interactive
   browser login (OAuth), or a system tool that needs a GUI installer. STOP, output a short
   numbered instruction ("зроби 1, 2, 3; встав сюди результат"), and wait. The user is
   **non-technical** — no jargon, exact clicks/commands, say what to paste back.
3. **Never run `sudo` yourself** (global rule) — always write the command out for the user.
4. Never print or commit secrets.

## Phase 1 — Toolchain

1. **nvm.** `command -v nvm || true`. If missing, try the official installer
   (`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash`), then
   `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"`. If network/curl is blocked → give the
   user the one-line command to run themselves, then continue once `nvm -v` works.
2. **Node (latest LTS).** `nvm install --lts && nvm use --lts && nvm alias default 'lts/*'`.
   Verify `node -v`.
3. **pnpm.** `corepack enable && corepack prepare pnpm@latest --activate` (fallback
   `npm i -g pnpm`). Verify `pnpm -v`.
4. **git.** Verify `git --version`. If missing, this usually needs a system installer → instruct
   the user (e.g. macOS: `xcode-select --install`).

## Phase 2 — Repo

1. Expected location `~/workspace/reelly/search-listings-frontend`.
2. `pnpm install` at the repo root.
3. `chmod +x .claude/role-gates/*.sh`.

## Phase 3 — MCP connections (connect EVERY server)

Copy the template if needed: `cp .claude/role-gates/mcp.json.example .mcp.json` (`.mcp.json` is
gitignored). Then make each server connect. Auth per server:

| Server | Needs | How |
|---|---|---|
| `context7` | nothing | works once node is present |
| `reelly-knowledge` | a bearer token | the **CTO** provides it → put into `${REELLY_KNOWLEDGE_TOKEN}` (env or fill `.mcp.json`) |
| `chrome-devtools` | Google Chrome installed | if absent → instruct the user to install Chrome |
| `playwright` | browser binaries | run `npx playwright install` (you can do this) |
| `github` | a GitHub token | the **CTO** provides it → put into `${GITHUB_TOKEN}` (env or fill `.mcp.json`) |
| `figma` | a Figma API key | get from Figma → Settings → Security → Personal access tokens; → `${FIGMA_API_KEY}` |
| `db-prelive`, `db-staging` | a Postgres DSN each | the **CTO** provides → `${DB_PRELIVE_DSN}` / `${DB_STAGING_DSN}` |
| `atlassian` | interactive OAuth login | no secret in the file; on first use Claude opens a browser — the user logs into Atlassian and approves |

For each secret: either set the env var in the user's shell profile, or replace the `${...}`
placeholder in `.mcp.json` with the real value (local file only). For anything the user must
fetch (a Figma token) or approve (Atlassian login) → give the plain-language Ukrainian steps and wait.

## Phase 4 — Role wiring

Copy the matching template to the gitignored local settings (auto-approves all `.mcp.json`
servers + wires the role's PreToolUse gates):
- CEO: `cp .claude/role-gates/settings.ceo.local.json.example .claude/settings.local.json`
- CPO: `cp .claude/role-gates/settings.cpo.local.json.example .claude/settings.local.json`

## Phase 5 — Restart & verify

1. Tell the user to **restart Claude Code** (so hooks + MCP load).
2. After restart:
   - `/mcp` → every server from `.mcp.json` shows **connected** (resolve any that failed: re-check
     its secret/login from the table above).
   - `./.claude/role-gates/test-gates.sh` → `PASS=… FAIL=0`. For the CEO, a write outside
     `specs/raw/` is denied.
3. Done — the user can now just describe a feature (spec-orchestrator takes over).

## Phase 6 — Final double-check (readiness report)

After Phase 5, run an explicit end-to-end health check and present a clear ✅/❌ report. Only
declare the machine ready when **every** line is ✅. If any line is ❌, fix it (or hand the user
the plain-language Ukrainian instruction) and re-run this phase.

Checklist:
1. **Toolchain** — `node -v`, `pnpm -v`, `git --version` all print a version.
2. **Repo deps** — `pnpm install` reports up to date (no errors).
3. **MCP connected** — `/mcp` shows **every** server from `.mcp.json` as connected (none failed).
   Spot-check one of each kind: a no-auth one (context7), a secret one (github), and the OAuth one
   (atlassian, e.g. `mcp__atlassian__atlassianUserInfo` returns the user).
4. **Role wired** — `.claude/settings.local.json` exists and matches the person's role.
5. **Gates pass** — `./.claude/role-gates/test-gates.sh` → `PASS=… FAIL=0`.
6. **Gate behavior (CEO)** — a Write to a path outside `specs/raw/` is denied; a Write under
   `specs/raw/` is allowed.
7. **Spec tooling** — `node .claude/spec-tools/regen-index.test.mjs` and
   `node .claude/spec-tools/build-prototype-css.test.mjs` both pass.

Then tell the user, in plain Ukrainian: **"Усе встановлено й готово до роботи — просто опиши, що
хочеш"**, or list exactly what is still ❌ and what they must do.
