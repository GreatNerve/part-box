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

Browsers call **gRPC-Web** (via Envoy) for mutations; **GraphQL** for reads. Both hit the same `app/services/` layer.

```
Browser — queries          Browser — mutations
   │ GraphQL HTTP              │ grpc-web
   ▼                           ▼
backend-api :8000          Envoy :8080
                               ▼
                           backend-grpc :50051
            │                      │
            └──────────┬───────────┘
                       ▼
                 app/services/
```

## Decisions

| Topic | Choice | Rationale |
|-------|--------|-----------|
| Database | PostgreSQL | Relational fit for users, components, box rows, logs |
| ORM | Tortoise ORM | Async-native, fits FastAPI |
| Migrations | Aerich | Official Tortoise migration tool |
| Package manager | uv | Fast dependency and venv management |
| Browser reads | Strawberry GraphQL on FastAPI | Lists, detail, activity, `me` |
| Browser writes | gRPC-Web → Envoy → gRPC | Auth, CRUD, inventory log mutations |
| Service contract | gRPC + Protocol Buffers | Shared proto; servicers call same services as GraphQL |
| HTTP framework | FastAPI | ASGI host for Strawberry, health checks, CORS |
| Auth | JWT bearer token | `Authorization: Bearer <token>` on GraphQL; same token in gRPC metadata |
| Config | Pydantic Settings | `.env` / environment variables; `.env.example` in repo |
| Processes | Three backend-facing containers | `backend-api`, `backend-grpc`, `grpc-web` (Envoy) + frontend |
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

## GraphQL API (read contract)

Endpoint: `POST /graphql` on `backend-api` (port `8000`).

Frontend uses `graphql-request` for **queries only**. Mutations are served via gRPC-Web (see frontend architecture).

Full schema — queries, legacy mutations (still on server), filters, pagination: **[`api-design.md`](./api-design.md)**

Summary:

| Operation | Type | Frontend uses |
|-----------|------|---------------|
| `register` / `login` | Mutation | gRPC (GraphQL kept on server) |
| `components` | Query | GraphQL |
| `component` | Query | GraphQL |
| `componentLogs` / `inventoryLogs` | Query | GraphQL |
| `categories` / `me` | Query | GraphQL |
| `createComponent` / `updateComponent` | Mutation | gRPC |
| `createCategory` / `updateCategory` | Mutation | gRPC |
| `applyInventoryLog` | Mutation | gRPC |

## gRPC API (write contract + service boundary)

Defined in `backend/proto/`. Python stubs: `bash scripts/generate_proto.sh` → `app/grpc/gen/`.

Implemented services:

| Service | RPCs |
|---------|------|
| `AuthService` | `Register`, `Login` |
| `CategoryService` | `CreateCategory`, `UpdateCategory` |
| `InventoryService` | `ListComponents`, `CreateComponent`, `UpdateComponent`, `ApplyInventoryLog` |
| `HealthService` | `Check` |

Form mutations return proto `oneof` success vs `ValidationErrorMessage` (with `field_errors`). Auth uses gRPC status codes.

Browser path: **grpc-web → Envoy `:8080` → backend-grpc `:50051`**. Config: `docker/envoy.yaml`.

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

**Do not create or edit migration files by hand.** After changing Tortoise models in `app/models/`, generate the migration:

```bash
cd backend
uv run aerich migrate --name <short_description>
uv run aerich upgrade
```

Aerich compares models to the last migration state and writes the SQL. Editing generated files breaks the migration chain and can desync production databases.

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
