# Parts Desk

Personal **electronics inventory** for solo students — track parts (ICs, Arduinos, sensors) across labeled boxes, with per-user private stock and an audit trail of every change.

## Repo layout

```
RPC_Test/
├── README.md              ← you are here
├── CONTEXT.md             ← domain language + locked decisions (read first)
├── AGENTS.md              ← instructions for AI agents
├── backend/               ← Python API (GraphQL + gRPC)
├── frontend/              ← Next.js student UI
├── docs/                  ← product + technical specs
└── docker/                ← Postgres + full stack compose
```

## Quick start

### 1. Database

```bash
docker compose -f docker/docker-compose.db.yml up -d
```

### 2. gRPC-Web proxy (mutations)

With `uv run inventory-grpc` running on the host (`:50051`):

```bash
docker compose -f docker/docker-compose.envoy.yml up -d
```

Stop: `docker compose -f docker/docker-compose.envoy.yml down`

### 3. Backend

```bash
cd backend
cp .env.example .env
uv sync --extra dev
uv run aerich upgrade          # first time / after model changes
uv run inventory-api           # GraphQL :8000

# Optional — gRPC (:50051), separate terminal; run after proto gen
bash scripts/generate_proto.sh # first time / after backend/proto/ changes
uv run inventory-grpc

# gRPC tests (Postgres required)
uv run pytest tests/integration/grpc -v
```

### 4. Frontend

Requires gRPC on `:50051` and Envoy on `:8080` (see step 2):

```bash
cd backend && uv run inventory-grpc   # if not already running
```

```bash
cd frontend
cp .env.example .env.local     # set AUTH_SECRET, NEXT_PUBLIC_GRPC_WEB_URL
pnpm install
pnpm dev                       # :3000
```

GraphQL queries: `http://127.0.0.1:8000/graphql`  
Mutations (gRPC-Web): `http://127.0.0.1:8080`

**Windows:** use `127.0.0.1` not `localhost` in `DATABASE_URL` / `NEXT_PUBLIC_GRAPHQL_URL` — IPv6 stall adds ~21s per DB query.

### Full stack (Docker)

Runs Postgres, backend API, gRPC, **Envoy gRPC-Web proxy**, and frontend together:

```bash
docker compose -f docker/docker-compose.yml up --build
```

Open `http://localhost:3000`. Set `AUTH_SECRET` (and optionally `JWT_SECRET`) in a `.env` file next to the compose file or in your shell before `up`.

## Documentation

| Doc | Purpose |
|-----|---------|
| [CONTEXT.md](./CONTEXT.md) | Product vocabulary, architecture decisions, v1.1 grill outcomes |
| [docs/README.md](./docs/README.md) | Full documentation index |
| [docs/features/](./docs/features/) | Product rules |
| [docs/backend/](./docs/backend/) | API, architecture, Docker |
| [docs/frontend/](./docs/frontend/) | Next.js app design |
| [docs/backend/v1.1-changes.md](./docs/backend/v1.1-changes.md) | Current implementation slice |

## Stack (summary)

| Layer | Choice |
|-------|--------|
| Database | PostgreSQL + Tortoise + Aerich |
| Browser reads | Strawberry GraphQL on FastAPI `:8000` |
| Browser writes | gRPC-Web via Envoy `:8080` → gRPC `:50051` |
| Frontend | Next.js App Router, shadcn Vega, NextAuth v5, TanStack Query |
| Auth | JWT bearer (email + password) |

## Status

- **Backend:** Core CRUD, inventory logs, integration tests — v1.1 features in progress (see [v1.1-changes.md](./docs/backend/v1.1-changes.md))
- **Frontend:** Auth, components, categories, settings — UI polish + v1.1 screens in progress
