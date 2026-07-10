---
name: deliver-spec
description: End-of-session delivery for the spec workflow — create an English Jira ticket (assignee + interactive priority), then branch + commit + PR to staging. Use when the user is ready to ship a spec/prototype (CEO or CPO stage). Ticket-first so commit/branch/PR carry the Jira key.
---

# deliver-spec

End-of-session delivery. Offer it to **both roles** when work on a spec/prototype is done.
Converse in Ukrainian; **the Jira ticket is in English.** Order: **ticket → branch/commit/PR**
(so the commit carries the Jira key).

## Fixed facts (Reelly Jira)
- cloudId: `697d4345-cb4d-447d-90e5-58fd79a39e20` (reelly-team.atlassian.net)
- Jira project: **REL** (id `10134`, software) — matches the repo's `REL-` commit prefix.
- Assignee accountIds (by role; if people/roles change, refresh via
  `mcp__atlassian__lookupJiraAccountId` and update this table):
  - **CPO** — `712020:ed48ee2f-e6ed-4fc8-b285-e082a4eec308`
  - **CTO** — `712020:dba4cd86-f09e-4721-9cae-136d0aa5c317`

## Steps
1. **Offer to commit.** If yes:
2. **Create the Jira ticket** in project `REL` (`mcp__atlassian__createJiraIssue`) — **English**
   summary + description (concise: what the feature/change is).
   - **Assignee by stage:** end of CEO stage → CPO; end of CPO stage → CTO.
   - **Priority (interactive):** ask the user for priority; fetch the project's In-Progress issues
     (`mcp__atlassian__searchJiraIssuesUsingJql`, e.g. `project = REL AND statusCategory = "In Progress"`)
     and ask whether this one is more urgent than them, to inform the choice; set the Jira
     **Priority** field accordingly. (Do not add a relative-order note to the description.)
3. **Sync → branch → commit → PR** — never commit/push onto a stale base; applies to **both the CEO and CPO flow**:
   - **Sync the base first.** `git fetch origin`, then branch off the *fresh* remote base so the
     commit lands on top of current staging: `git switch -c <jira-key>-<slug> origin/staging`
     (this carries the still-uncommitted `specs/raw/` changes onto the new branch). Do **not**
     `git commit` on a stale local `staging`.
   - commit message follows the repo `REL-`/`TT:` convention **with the key** (see project CLAUDE.md);
   - before pushing, fold in anything newer: `git pull --rebase origin staging` (the tree is clean
     post-commit, so rebase runs); resolve conflicts, then push.
   - open the PR with base **`staging`** (NOT `main`) — `gh pr create` or `mcp__github__create_pull_request`.
   - `git fetch`/`pull`/`rebase` are never gated; the role gates act only on `git reset --hard` and
     `git commit`/`git push` (and CEO commits must additionally be spec-only).
4. **PR↔ticket link is automatic** via the key (Jira↔GitHub dev panel) — no manual step.

## Important
- Spec delivery always goes branch → PR to `staging`, never directly to `main`. (For the CEO the
  gates block `main` outright; the CPO's admin-only direct-to-main exception is for admin-app
  code work, not for this delivery flow.)
- Create the real ticket only after the user confirms. For a dry-run, compose the ticket body and
  the branch/PR commands without executing them.
