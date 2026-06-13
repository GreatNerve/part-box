# Frontend

Next.js app for the electronics inventory system. Production target: **Vite SPA** reusing `src/components`, `src/hooks`, `src/lib`, and `src/react-query`.

## Stack

| Piece | Tool |
|-------|------|
| Framework | Next.js (latest), App Router, `src/` |
| UI | shadcn/ui (Vega preset), Tailwind, dark default |
| Auth | NextAuth v5 (beta) — Credentials → gRPC login |
| Reads | graphql-request + TanStack Query → `:8000/graphql` |
| Writes | grpc-web + TanStack Query → Envoy `:8080` → gRPC `:50051` |
| Forms | react-hook-form + Zod, FormGenerator |
| Tables | TanStack Table — shared DataTable (table / mobile cards) |

## Role

- Student UI: login, components, categories, settings
- **Queries** via GraphQL; **mutations** via gRPC-Web (Envoy proxy)

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
  lib/graphql/             queries (GraphQL documents)
  lib/grpc/                mutation clients + generated stubs
  hooks/graphql/           useGraphQuery
  hooks/grpc/              useGrpcMutation
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
# NEXT_PUBLIC_GRAPHQL_URL=http://127.0.0.1:8000/graphql
# NEXT_PUBLIC_GRPC_WEB_URL=http://127.0.0.1:8080
# AUTH_SECRET=<long random string>

pnpm dev
```

Requires backend GraphQL on `:8000`, gRPC on `:50051`, and Envoy on `:8080`:

```bash
docker compose -f docker/docker-compose.db.yml up -d
docker compose -f docker/docker-compose.envoy.yml up -d   # after inventory-grpc is running
```

Regenerate stubs when `backend/proto/` changes:

```bash
pnpm grpc:codegen
```

Optional — regenerate GraphQL types when the backend schema changes (backend must be up):

```bash
pnpm graphql:codegen
```

Hand-written GraphQL documents live in `src/lib/graphql/documents/` for **queries only**.

## Backend

GraphQL: `http://127.0.0.1:8000/graphql` — see [`../docs/backend/architecture.md`](../docs/backend/architecture.md)  
gRPC-Web: `http://127.0.0.1:8080` (Envoy → gRPC)
