# Frontend Documentation

Technical docs for the Next.js app (dev) and future Vite SPA (production).

## Docs

| Doc | Topic |
|-----|--------|
| [architecture.md](./architecture.md) | Stack, NextAuth, TanStack Query, shared UI components |
| [folder-structure.md](./folder-structure.md) | Full `src/` tree and folder rules |
| [naming-conventions.md](./naming-conventions.md) | File and folder naming |

## Quick reference

| Topic | Choice |
|-------|--------|
| Framework | Next.js latest, App Router, `src/` |
| UI | shadcn Vega, dark default, Tailwind |
| Auth | NextAuth v5 beta → GraphQL JWT in session |
| Data | graphql-request + TanStack Query + `useGraphQuery` |
| Forms | react-hook-form + Zod + FormGenerator |
| Tables | TanStack Table — desktop table / mobile cards |
| Package manager | pnpm |
| Types | GraphQL Code Generator |
| Layout | Sidebar; `(public)/(auth)/` + `(app)/` |
| v1 screens | Auth, Components, Categories, Settings |

Product / UX requirements: [`../features/`](../features/)

Backend API: [`../backend/api-design.md`](../backend/api-design.md)

Implementation README: [`../../frontend/README.md`](../../frontend/README.md)
