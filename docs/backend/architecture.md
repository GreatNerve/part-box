# Backend Architecture

Technical design for the Python backend: GraphQL for browser clients, gRPC for service contract, shared business logic, PostgreSQL persistence.

## Overview

```
┌─────────────────┐     GraphQL/HTTP      ┌──────────────────┐
│  Vite / Next.js │ ────────────────────► │  backend-api     │
│  (browser SPA)  │   Authorization:      │  FastAPI :8000   │
└─────────────────┘   Bearer <JWT>        │  Strawberry GQL  │
                                          └────────┬─────────┘
                                                   │
                                          app/services/ (shared)
                                                   │
                     ┌─────────────────────────────┼─────────────────────────────┐
                     │                             │                             │
                     ▼                             ▼                             ▼
            ┌────────────────┐           ┌────────────────┐           ┌────────────────┐
            │  Tortoise ORM  │           │ backend-grpc   │           │  app/schemas/  │
            │  app/models/   │           │ gRPC :50051    │           │  Pydantic DTOs │
            └───────┬────────┘           └────────────────┘           └────────────────┘
                    │
                    ▼
            ┌────────────────┐
            │   PostgreSQL   │
            └────────────────┘
```

Browsers cannot call native gRPC. The **GraphQL API** is the frontend entry point. **gRPC** runs in parallel with the same service layer for contract tests, integrations, and future service splits.

## Decisions

| Topic | Choice | Rationale |
|-------|--------|-----------|
| Database | PostgreSQL | Relational fit for users, components, box rows, logs |
| ORM | Tortoise ORM | Async-native, fits FastAPI |
| Migrations | Aerich | Official Tortoise migration tool |
| Package manager | uv | Fast dependency and venv management |
| Browser API | Strawberry GraphQL on FastAPI | Works with Vite SPA and Next.js client; no server-side BFF required |
| Service contract | gRPC + Protocol Buffers | Shared proto definitions; servicers call same services as GraphQL |
| HTTP framework | FastAPI | ASGI host for Strawberry, health checks, CORS |
| Auth | JWT bearer token | `Authorization: Bearer <token>` on GraphQL; same token in gRPC metadata |
| Config | Pydantic Settings | `.env` / environment variables; `.env.example` in repo |
| Processes | Two containers, one image | `backend-api` and `backend-grpc` scale independently |
| Code layout | Layered monolith | Services hold business logic; GraphQL and gRPC are thin adapters |
| Domain mapping | Pydantic/dataclass DTOs | Services return plain objects; no Tortoise models at API boundary |
| Tests | pytest + pytest-asyncio | Unit tests mock DB; integration tests use Docker Postgres |

## Project layout

```
backend/
├── README.md
├── pyproject.toml          # uv-managed dependencies
├── proto/
│   └── v1/                 # versioned .proto files
├── app/
│   ├── core/               # settings, db init, auth/JWT, dependencies
│   ├── models/             # Tortoise models (one file per domain)
│   ├── schemas/            # Pydantic DTOs (one file per domain)
│   ├── services/           # Business logic (one file per domain)
│   ├── api/
│   │   └── graphql/        # Strawberry — by domain + schema.py
│   └── grpc/
│       ├── servicers/
│       └── gen/v1/         # generated stubs
├── migrations/             # Aerich migration files
└── tests/
    ├── unit/               # mirrors app/ tree
    └── integration/
```

File naming details: [`naming-conventions.md`](./naming-conventions.md)

## Layer responsibilities

### `app/models/` — Tortoise ORM

Database tables only. No API or business rules beyond field constraints.

Expected entities (v1):

- `User` — UUID pk; unique `email`; `password_hash`; optional `display_name`
- `Category` (default + per-user custom)
- `Component`
- `ComponentBoxQuantity` (component + box label + qty)
- `InventoryLog` (type, qty, box, reason, optional link to parent Use log for Returns)

**Primary keys:** UUID on every table. GraphQL `ID` = database `id` (no separate public id column).

**Auth identity:** Register and login use **email + password**. Email is unique across all users.

### `app/schemas/` — DTOs

Pydantic models or dataclasses returned by services. Examples: `ComponentDTO`, `LogEntryDTO`, `AuthTokenDTO`.

### `app/services/` — Business logic

All rules from [`../features/`](../features/) enforced here:

- Per-user data isolation
- Quantity changes only via logs
- No negative box quantities
- Return logs linked to Use logs
- Category defaults on user registration

GraphQL resolvers and gRPC servicers **must not** duplicate this logic.

### `app/api/graphql/` — Strawberry

- Queries: list/filter components, categories, logs
- Mutations: register, login, CRUD components, log actions
- Context: current user from JWT
- Maps DTOs → GraphQL types

### `app/grpc/` — gRPC servicers

- Implements services defined in `proto/`
- Validates JWT from gRPC metadata (`authorization` key)
- Maps DTOs → protobuf messages
- Used for contract tests and future non-browser clients

### `app/core/`

- `Settings` via Pydantic Settings (`DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRY`, `CORS_ORIGINS`, ports)
- Tortoise init / teardown
- JWT encode/decode, password hashing
- FastAPI CORS middleware

## Authentication

### Flow

1. `register` / `login` mutation → service validates credentials → returns JWT
2. Client stores token (memory or secure storage; HttpOnly cookie optional later)
3. Every GraphQL request sends `Authorization: Bearer <token>`
4. FastAPI/Strawberry dependency decodes JWT → loads `user_id` into context
5. All service calls receive `user_id`; queries filter by owner

### gRPC

Same JWT passed in metadata:

```
authorization: Bearer <token>
```

Servicer rejects unauthenticated or invalid tokens before calling services.

## GraphQL API (frontend contract)

Endpoint: `POST /graphql` on `backend-api` (port `8000`).

Frontend (Vite or Next.js client components) uses any GraphQL client (e.g. urql, Apollo, graphql-request). No gRPC in the browser.

Full schema design — mutations, filters, pagination, errors, UUID IDs: **[`api-design.md`](./api-design.md)**

Summary:

| Operation | Type | Purpose |
|-----------|------|---------|
| `register` / `login` | Mutation | Auth → JWT |
| `components` | Query | List with filter, sort, offset pagination |
| `component` | Query | Detail + box breakdown |
| `componentLogs` | Query | Paginated log history |
| `createComponent` / `updateComponent` / `deleteComponent` | Mutation | Component CRUD |
| `createCategory` | Mutation | Custom category |
| `applyInventoryLog` | Mutation | All stock changes (ADD, USE, RETURN, LOST, BURN, DEFECTIVE) |

## gRPC API (service contract)

Defined in `backend/proto/`. Python stubs generated at build/dev time (`grpc_tools.protoc` or Buf).

Mirrors the same capabilities as GraphQL where practical. Proto is the source of truth for cross-service contracts.

## Database migrations

Tool: **Aerich**.

```bash
# one-time init (during scaffold)
aerich init -t app.core.db.TORTOISE_ORM
aerich init-db

# after model changes
aerich migrate --name <description>
aerich upgrade
```

Migration files live in `backend/migrations/` and are committed to git.

## Configuration

Environment variables (see `.env.example` when scaffolded):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Signing key (required, not committed) |
| `JWT_EXPIRY_MINUTES` | Token lifetime |
| `CORS_ORIGINS` | Comma-separated origins (e.g. `http://localhost:5173,http://localhost:3000`) |
| `API_HOST` / `API_PORT` | FastAPI bind (default `0.0.0.0:8000`) |
| `GRPC_HOST` / `GRPC_PORT` | gRPC bind (default `0.0.0.0:50051`) |

## Testing

```
tests/
├── unit/           # services with mocked repositories
└── integration/    # GraphQL + gRPC against real Postgres
```

- **pytest** + **pytest-asyncio**
- Integration tests: start Postgres via [`docker.md`](./docker.md) or test fixture
- Priority coverage: auth isolation, log qty rules, return linking, filter queries

## Runtime (Docker)

See [`docker.md`](./docker.md).

- `backend-api` — `uvicorn app.api.main:app`
- `backend-grpc` — gRPC server entrypoint
- Both share one Docker image; different `CMD`
- Both run `aerich upgrade` before start (or via init container)

## Related docs

- Product features: [`../features/`](../features/)
- API schema design: [`api-design.md`](./api-design.md)
- Naming conventions: [`naming-conventions.md`](./naming-conventions.md)
- Docker setup: [`docker.md`](./docker.md)
- Frontend integration: [`../frontend/architecture.md`](../frontend/architecture.md)
