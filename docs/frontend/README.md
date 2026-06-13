# Frontend Documentation

Technical docs for the Next.js app (dev) and future Vite SPA (production).

## Docs

| Doc | Topic |
|-----|--------|
| [architecture.md](./architecture.md) | Stack, NextAuth, TanStack Query, gRPC-Web writes, shared UI |
| [folder-structure.md](./folder-structure.md) | Full `src/` tree and folder rules |
| [naming-conventions.md](./naming-conventions.md) | File and folder naming |

## Quick reference

| Topic | Choice |
|-------|--------|
| Framework | Next.js latest, App Router, `src/` |
| UI | shadcn Vega, dark default, Tailwind |
| Auth | NextAuth v5 → gRPC login/register; JWT in session |
| Reads | graphql-request + TanStack Query + `useGraphQuery` |
| Writes | grpc-web + TanStack Query + `useGrpcMutation` |
| Forms | react-hook-form + Zod + FormGenerator |
| Tables | TanStack Table — desktop table / mobile cards |
| Package manager | pnpm |
| Types | GraphQL Codegen (queries); proto stubs in `lib/grpc/gen/` |
| Layout | Sidebar; `(public)/(auth)/` + `(app)/` |
| v1 screens | Auth, Components, Activity, Settings |

Product / UX requirements: [`../features/`](../features/)

Backend API: [`../backend/api-design.md`](../backend/api-design.md)

Implementation README: [`../../frontend/README.md`](../../frontend/README.md)
