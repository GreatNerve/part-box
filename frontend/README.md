# Frontend

Next.js web app for the electronics inventory system (dev). Production target: **Vite SPA** with the same GraphQL client code.

## Role

- Student-facing UI for login, inventory, and logs
- Calls backend **GraphQL API** from the browser — not gRPC

## Stack

| Piece | Tool |
|-------|------|
| Dev UI | Next.js (App Router) |
| Production UI | Vite SPA (same components/lib) |
| Backend access | GraphQL client (graphql-request, urql, or Apollo) |
| Auth | JWT in `Authorization: Bearer` header |

## Why not gRPC from the browser?

Browsers cannot call native gRPC. Backend exposes GraphQL on FastAPI. Do **not** use Next.js API routes as a gRPC bridge — that pattern does not carry over to Vite.

## Project structure

```
frontend/
├── README.md
├── app/                  # Next.js App Router pages
├── components/           # PascalCase — ComponentList.tsx
├── hooks/                # camelCase — useAuth.ts
├── lib/
│   ├── graphql/          # client, queries, mutations
│   └── auth/             # token helpers
└── package.json
```

Naming conventions: [`../docs/frontend/naming-conventions.md`](../docs/frontend/naming-conventions.md)

## Documentation

Full technical design: [`../docs/frontend/`](../docs/frontend/)

| Doc | Topic |
|-----|--------|
| [architecture.md](../docs/frontend/architecture.md) | GraphQL client, auth, CORS, screen mapping |
| [naming-conventions.md](../docs/frontend/naming-conventions.md) | Folder and file naming |

Product / UX rules: [`../docs/features/`](../docs/features/)

## Getting started

Not scaffolded yet. Typical dev flow:

```bash
cd frontend
npm install

# .env.local
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql

npm run dev
```

App runs at `http://localhost:3000` by default. Backend must be running on `:8000`.

## Backend

GraphQL endpoint: `http://localhost:8000/graphql`

Backend design: [`../docs/backend/architecture.md`](../docs/backend/architecture.md)
