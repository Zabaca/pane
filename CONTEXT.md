# Pane — Project Context

Entry-point every Worker reads before touching code. Keep it true to the repo.

## What this is

Pane is a visual communication channel for AI agents: instead of text-only
replies, an agent can show diagrams, request structured input via forms, and
maintain visual state throughout a conversation. It ships as an MCP server the
agent drives over stdio, backed by an XState state machine, with a Vue frontend
the human watches in the browser (WebSocket-connected).

## Stack

- **Language:** TypeScript
- **Runtime / package manager:** [Bun](https://bun.sh) (required for TS execution)
- **Frontend:** Vue 3 + Vite, markdown-it, Mermaid
- **Server:** `@modelcontextprotocol/sdk`, XState, `ws` (WebSocket)

## Layout

- `mcp-server/` — the MCP server (`@zabaca/pane`): tools, XState machine, WebSocket bridge
- `frontend/` — the Vue 3 + Vite UI the human views at http://localhost:3000
- `assets/` — static assets (demo GIF)
- `package.json` — root scripts that delegate into the two workspaces

Dependencies live in `frontend/` and `mcp-server/` (each has its own `bun.lock`),
not at the repo root.

## Commands

Root (`package.json`):

- `bun run dev:server` — run the MCP server
- `bun run dev:frontend` — run the Vue frontend (Vite dev server)
- `bun run build:frontend` — build the frontend

Per package:

- Frontend (`cd frontend`): `bun run dev`, `bun run build`, `bun run preview`
- MCP server (`cd mcp-server`): `bun run dev`, `bun run build`

There is no repo-wide test or lint command defined.
