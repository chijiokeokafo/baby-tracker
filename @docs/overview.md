# MCP Manager — Overview

MCP Manager is a local-first UI for viewing and managing Claude Code MCP servers across scopes (project, user, enterprise), with health checks, profiles, and an audit trail.

It’s designed as a **Next.js + shadcn/ui** app with a small **local companion** (Node daemon) that can safely access:
- the filesystem (`.mcp.json`, `~/.claude.json`, `managed-mcp.json`)
- the `claude mcp ...` CLI (optional but recommended)
- local process/network checks for MCP servers (stdio/http)

Neon (via Vercel Postgres) provides persistence for profiles, “disabled” toggles, audit logs, and health history.

---

## Goals

- **Single pane of glass** for MCP servers and their effective configuration
- **Safe workflows**: preview diffs before apply, scoped changes, audit logging
- **Local-first correctness**: reflects what Claude Code actually uses on your machine
- **Great developer UX**: fast iteration, tests (Vitest + Playwright), clear architecture

Non-goals (initially):
- Hosting as a remote multi-user SaaS that manages other peoples’ local configs
- Full MCP server marketplace/registry (can be added later)

---

## Scaffolding

### Repo init
- `pnpm` workspace (recommended) with a small monorepo layout
- Next.js App Router + TypeScript

### UI stack
- Next.js
- Tailwind CSS
- shadcn/ui
- Motion (Framer Motion) for subtle transitions
- React Query (TanStack Query) for client-side caching + invalidation

### Persistence
- Neon Postgres (through Vercel Postgres integration)
- DB access via a lightweight ORM (recommended: Drizzle or Prisma). This project assumes Drizzle by default, but you can swap.

### Testing
- Unit/component tests: Vitest (+ React Testing Library)
- E2E tests: Playwright

---

## Project structure

```txt
mcp-manager/
  apps/
    web/                       # Next.js UI (shadcn + tailwind + motion + react-query)
      app/
        (routes)/
          servers/
          profiles/
          audit/
          settings/
        api/
          companion/           # Optional: proxy routes (web -> local companion)
      components/
        servers/
        profiles/
        audit/
        ui/                    # shadcn components
      lib/
        query/
        mcp/
          merge.ts             # precedence + effective config computation
          schema.ts           # types + zod validation
          parse-cli.ts        # parse `claude mcp` output
        db/
          client.ts
          schema.ts
          migrations/
      tests/
        unit/
        component/
      playwright/
        e2e/
      vitest.config.ts
      playwright.config.ts

    companion/                 # Local companion daemon (Node/TS)
      src/
        index.ts               # starts localhost server (e.g., 127.0.0.1:PORT)
        routes/
          servers.ts           # list/get/add/edit/remove/import
          health.ts            # ping/check endpoints
          files.ts             # read/write configs safely
        lib/
          claudeCli.ts         # wrapper to run `claude mcp ...` (optional)
          configFiles.ts       # read/write .mcp.json and ~/.claude.json
          merge.ts             # shared merging logic (or import from package)
          validate.ts
      tests/
        unit/
      tsconfig.json

  packages/
    shared/                    # shared types + validators between web & companion
      src/
        types.ts
        validators.ts
        merge.ts

  .env.example
  package.json
  pnpm-workspace.yaml
```
Notes:

Keeping companion separate prevents the web UI from needing privileged file access.

packages/shared ensures config parsing/merging stays consistent across the stack.

Core functionality
1) Server inventory
List all known MCP servers, grouped by:

scope: project / user / enterprise

transport: http / stdio

status: healthy / degraded / unknown

Show “effective config” when names collide (precedence rules).

2) Effective configuration + precedence
Present a per-server view:

raw configs by scope

computed “winner”

explanation of why it wins

Diff view between scopes (useful for debugging collisions).

3) CRUD workflows
Add server:

HTTP: name + URL (+ optional headers)

Stdio: name + command + args (+ env)

Edit server (scope-aware): edit within chosen scope and preview diff

Remove server (with confirmation)

4) Disable/enable (UX feature)
If the underlying config format does not support enabled: false reliably:

store disabled state in Neon as an overlay:

(projectId, serverName) -> disabled

UI uses overlay to grey out servers and exclude them from “effective set” when launching via companion.

5) Profiles
Profile is a named set of:

disabled servers

env overrides (optional)

“active scope preferences” (optional)

Switch profiles quickly (great for demos / work vs personal).

6) Health checks + history
Manual “Ping” and periodic checks

Record:

latency

last success

last error

Display time series and recent incidents.

7) Audit log
Track changes with:

who/what initiated it (local user, automation)

before/after config snapshots

command used (if CLI wrapper)

timestamps

Requirements
Functional requirements
Must display servers from:

project .mcp.json

user config (e.g., ~/.claude.json)

enterprise managed-mcp.json (read-only)

Must compute a deterministic effective config set

Must support safe edits with validation and diff preview

Must operate locally (companion) without sending secrets off-machine

Non-functional requirements
No plaintext secrets in logs

Strict input validation (Zod recommended)

Clear error handling (toasts + inline error states)

“Read-only” mode if enterprise config disallows edits

Environment requirements
Node 20+

pnpm 9+

claude CLI available on PATH (optional but recommended)

Vercel Postgres / Neon DATABASE_URL configured

Data model (Neon)
Recommended tables:

profiles — id, name, created_at

profile_disabled_servers — profile_id, server_name, disabled

server_health_checks — server_name, scope, status, latency_ms, error, checked_at

audit_events — type, scope, server_name, before_json, after_json, actor, created_at

Optional:

server_notes — freeform notes/tags per server (nice UX add)

API surface (companion)
Local companion (localhost) endpoints (example):

GET /servers — list all scopes + effective set

GET /servers/:name — scoped configs + effective config

POST /servers — add server (scope + config)

PUT /servers/:name — edit server

DELETE /servers/:name — remove server

POST /servers/:name/ping — health check

The web UI calls the companion via:

direct fetch to localhost (when wrapped in Tauri/Electron), OR

Next.js API proxy (/api/companion/*) to simplify CORS/dev.

Test coverage strategy
Vitest (unit + component)
Focus:

config parsing + normalization

precedence and effective merge rules

CLI output parsing (if using claude mcp ...)

React Query hooks (mock fetch)

Suggested targets:

90%+ coverage for packages/shared and parsing/merge logic

component tests for critical forms and diff views

Examples:

merge.ts:

resolves collisions deterministically

preserves env/args correctly

handles missing/invalid configs gracefully

parse-cli.ts:

robust against whitespace/format changes

Playwright (E2E)
Run against dev server with a test companion instance.

Critical flows:

List servers and view detail page

Add HTTP server -> appears in list -> ping shows status

Add stdio server -> validation -> ping

Disable server in profile -> excluded from effective set

Edit server -> diff preview -> apply -> audit event created

Remove server -> disappears -> audit event created

Test isolation:

Use a dedicated test DATABASE_URL (separate Neon branch / schema)

Reset DB between runs (truncate tables)

Use fixture configs in a temporary directory for filesystem reads

Definition of done (MVP)
Can list scoped servers + show effective config

Can add/remove a server via companion

Can ping servers and store health history

Can create/switch profiles with disable toggles

Has audit log entries for modifications

CI passes: Vitest + Playwright

