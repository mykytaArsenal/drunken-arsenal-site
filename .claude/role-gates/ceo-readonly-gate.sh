#!/usr/bin/env bash
# PreToolUse:Edit|Write|NotebookEdit gate for the CEO role.
#
# Policy: writes are allowed only inside the repo-root `specs/raw/` zone (CEO sandbox).
# Anything else (including paths that escape via `..`, or absolute paths
# outside the repo) is denied — CEO is read-only everywhere else.

ROLE_GATES_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=_lib.sh
. "$ROLE_GATES_DIR/_lib.sh"

read_payload

case "$TOOL_NAME" in
  Edit|Write|NotebookEdit) ;;
  *) exit 0 ;;
esac

# No path → nothing we can authorize; let the normal flow handle it.
[ -n "$TOOL_PATH" ] || exit 0

root="$(git rev-parse --show-toplevel 2>/dev/null)"
[ -n "$root" ] || root="${CLAUDE_PROJECT_DIR:-$PWD}"

# Resolve TOOL_PATH to a repo-relative path (handles absolute, relative, and `..`).
rel="$(node -e '
  const path = require("path");
  const root = process.argv[1];
  const p = process.argv[2];
  const abs = path.isAbsolute(p) ? p : path.resolve(root, p);
  process.stdout.write(path.relative(root, abs));
' "$root" "$TOOL_PATH")"

case "$rel" in
  ../*|/*|"")
    deny "CEO is read-only outside the repo's /specs/raw zone. Path: ${TOOL_PATH}"
    ;;
  specs/raw|specs/raw/*)
    exit 0
    ;;
  *)
    deny "CEO writes only under /specs/raw (drafts/ready and root docs are CPO-owned). Path: ${rel}"
    ;;
esac
