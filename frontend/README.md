# Frontend

Next.js app for the electronics inventory system. Production target: **Vite SPA** reusing `src/components`, `src/hooks`, `src/lib`, and `src/react-query`.

## Stack

| Piece | Tool |
|-------|------|
| Framework | Next.js (latest), App Router, `src/` |
| UI | shadcn/ui (Vega preset), Tailwind, dark default |
| Auth | NextAuth v5 (beta) — Credentials → GraphQL JWT |
| Data | graphql-request + TanStack Query |
| Forms | react-hook-form + Zod, FormGenerator |
| Tables | TanStack Table — shared DataTable (table / mobile cards) |

## Role

- Student UI: login, components, categories, settings
- GraphQL to backend `:8000` — not gRPC

## Project structure (summary)

```
frontend/src/
  app/(public)/(auth)/     login, register
  app/(app)/               sidebar + features
  auth/                    NextAuth config
  components/ui/           shadcn
  components/includes/     DataTable, DialogForm, FormGenerator
  components/modules/      page compositions
  schema/                  zod + form field defs
  lib/graphql/
  hooks/graphql/           useGraphQuery, useGraphMutation
  react-query/queries|mutations/
```

Full tree: [`../docs/frontend/folder-structure.md`](../docs/frontend/folder-structure.md)

## Documentation

| Doc | Topic |
|-----|--------|
| [architecture.md](../docs/frontend/architecture.md) | Decisions, auth, data layer, shared components |
| [folder-structure.md](../docs/frontend/folder-structure.md) | Complete `src/` layout |
| [naming-conventions.md](../docs/frontend/naming-conventions.md) | File naming rules |

Product rules: [`../docs/features/`](../docs/features/)

## Getting started

```bash
cd frontend
pnpm install

# copy and edit env
cp .env.example .env.local
# NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
# AUTH_SECRET=<long random string>

pnpm dev
```

Requires backend on `:8000` and Postgres running.

Optional — regenerate types when the backend schema changes (backend must be up):

```bash
pnpm graphql:codegen
```

Hand-written documents live in `src/lib/graphql/documents/` until codegen output is adopted.

## Backend

GraphQL: `http://localhost:8000/graphql` — see [`../docs/backend/architecture.md`](../docs/backend/architecture.md)
