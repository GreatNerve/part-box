# Frontend Documentation

Technical docs for browser clients: Next.js (dev) and Vite (production).

## Docs

| Doc | Topic |
|-----|--------|
| [architecture.md](./architecture.md) | GraphQL client, auth, CORS, screen mapping |
| [naming-conventions.md](./naming-conventions.md) | Folder and file naming rules |

## Quick reference

| Topic | Choice |
|-------|--------|
| Dev UI | Next.js |
| Production UI | Vite SPA |
| Backend access | GraphQL over HTTP — **not** gRPC from browser |
| Auth | JWT in `Authorization: Bearer` header |

Product / UX requirements: [`../features/`](../features/)

Backend API design: [`../backend/architecture.md`](../backend/architecture.md)

Implementation README: [`../../frontend/README.md`](../../frontend/README.md)
