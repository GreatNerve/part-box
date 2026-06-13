# Frontend Architecture

How browser clients connect to the backend. Applies to both the **Next.js** dev app and the **Vite** production SPA.

## Key constraint

Browsers cannot call native gRPC. The frontend talks to the backend over **GraphQL over HTTP** only.

```
Browser (Vite or Next.js client)
        │
        │  POST /graphql
        │  Authorization: Bearer <JWT>
        ▼
backend-api :8000  (FastAPI + Strawberry)
        │
        ▼
   app/services/  →  PostgreSQL
```

gRPC (`backend-grpc :50051`) is **not** called from the frontend. It exists for service contracts and future integrations.

## Dev vs production UI

| | Dev (this repo) | Production (real project) |
|---|-----------------|---------------------------|
| Framework | Next.js | Vite SPA |
| Server | Next dev server for UI only | Static host / CDN |
| Backend calls | GraphQL from browser | GraphQL from browser (same) |

Next.js is used here for developer convenience. **Do not** rely on Next.js API routes or Server Actions for backend access — that pattern would not carry over to Vite.

## GraphQL client

Use any standard client from the browser:

- [graphql-request](https://github.com/grapql/graphql-request) — minimal
- [urql](https://urql.dev/) — lightweight with caching
- [Apollo Client](https://www.apollographql.com/docs/react/) — full-featured

Configuration:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
# Vite equivalent:
VITE_GRAPHQL_URL=http://localhost:8000/graphql
```

## Auth in the client

1. Call `login` / `register` mutation → receive JWT
2. Store token (in-memory, `localStorage`, or secure cookie — implementation choice)
3. Attach header on every request:

```
Authorization: Bearer <token>
```

4. On `401` / GraphQL auth error → redirect to login

## CORS

Backend `CORS_ORIGINS` must include frontend dev URLs:

- `http://localhost:3000` — Next.js
- `http://localhost:5173` — Vite

Configured in backend Pydantic Settings; see [`../backend/architecture.md`](../backend/architecture.md).

## Expected frontend structure

```
frontend/
├── README.md
├── app/                  # Next.js App Router — thin route pages
├── components/           # PascalCase — ComponentList.tsx
├── hooks/                # camelCase — useAuth.ts
├── lib/
│   ├── graphql/          # client, queries/, mutations/
│   └── auth/             # token storage helpers
└── package.json
```

Naming details: [`naming-conventions.md`](./naming-conventions.md)

When migrating to Vite, reuse `components/`, `hooks/`, and `lib/` — swap routing shell only.

## Screens → GraphQL mapping

| Screen | GraphQL |
|--------|---------|
| Login / register | `login`, `register` mutations |
| Component list | `components(filter, pagination)` — search, category, box, sort |
| Component detail | `component(id)` + `componentLogs(componentId, pagination)` |
| Add / edit component | `createComponent`, `updateComponent`, `deleteComponent` |
| All stock actions | `applyInventoryLog(input: { type, ... })` — see types below |
| Categories | `categories` query; `createCategory` mutation |

### `applyInventoryLog` types (one mutation for all stock changes)

| UI action | `type` value | Extra input |
|-----------|--------------|-------------|
| Add stock | `ADD_STOCK` | `quantity`, `box`, `reason` |
| Use parts | `USE` | `quantity`, `box`, `reason` |
| Return | `RETURN` | `relatedLogId` (USE log), `quantity`, `box` |
| Lost | `LOST` | `quantity`, `box`, `reason` |
| Burn | `BURN` | `quantity`, `box`, `reason` |
| Defective | `DEFECTIVE` | `quantity`, `box`, `reason` |

Handle response with union — `ApplyInventoryLogSuccess` or `ValidationError` (e.g. insufficient stock). See [`../backend/api-design.md`](../backend/api-design.md).

Product rules: [`../features/`](../features/)

## Related docs

- Backend design: [`../backend/architecture.md`](../backend/architecture.md)
- API schema: [`../backend/api-design.md`](../backend/api-design.md)
- Naming conventions: [`naming-conventions.md`](./naming-conventions.md)
- Docker / URLs: [`../backend/docker.md`](../backend/docker.md)
