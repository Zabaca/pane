#!/bin/sh
# Fredrin bootstrap script.
# Fredrin runs this (via `sh`, cwd = repo root) after cutting a fresh ticket
# worktree, so a Worker starts from a runnable checkout. Advisory and
# idempotent — safe to re-run; a failure warns but never blocks a run.
#
# This is a Bun monorepo: dependencies live in frontend/ and mcp-server/
# (each has its own bun.lock), so install in both. Skip cleanly if Bun
# isn't installed.
set -e

command -v bun >/dev/null 2>&1 || {
  echo "bun not found on PATH — skipping dependency install (see README.md)."
  exit 0
}

if [ -d frontend ]; then
  echo "Installing frontend dependencies with bun..."
  (cd frontend && bun install)
fi

if [ -d mcp-server ]; then
  echo "Installing mcp-server dependencies with bun..."
  (cd mcp-server && bun install)
fi

echo "Fredrin setup complete."
