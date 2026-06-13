# Docker Setup

Local development and full-stack runtime using Docker Compose files in the `docker/` folder.

## Files

| File | Purpose |
|------|---------|
| [`docker/docker-compose.db.yml`](../../docker/docker-compose.db.yml) | **Postgres only** — backend dev/tests without full stack |
| [`docker/docker-compose.envoy.yml`](../../docker/docker-compose.envoy.yml) | **gRPC-Web proxy only** — `:8080` → host gRPC `:50051` (local dev) |
| [`docker/docker-compose.yml`](../../docker/docker-compose.yml) | **Full project** — Postgres + backend-api + backend-grpc + grpc-web + frontend |
| [`docker/envoy.yaml`](../../docker/envoy.yaml) | Envoy config for full stack (`backend-grpc` hostname) |
| [`docker/envoy.dev.yaml`](../../docker/envoy.dev.yaml) | Envoy config for local dev (`host.docker.internal:50051`) |

## Services (full stack)

```
docker-compose.yml
├── postgres          :5432
├── backend-api       :8000   FastAPI + GraphQL (reads)
├── backend-grpc      :50051  gRPC (writes)
├── grpc-web          :8080   Envoy — browser grpc-web entry
└── frontend          :3000   Next.js
```

`backend-api` and `backend-grpc` use the **same image** with different commands.

## Postgres only (backend dev / tests)

Use when working on backend locally or running integration tests:

```bash
docker compose -f docker/docker-compose.db.yml up -d
```

Typical `.env` for local backend (outside Docker):

```env
DATABASE_URL=postgres://box:box@localhost:5432/box
```

Stop:

```bash
docker compose -f docker/docker-compose.db.yml down
```

## Full stack

```bash
docker compose -f docker/docker-compose.yml up --build
```

Endpoints (defaults):

| Service | URL |
|---------|-----|
| GraphQL (queries) | `http://localhost:8000/graphql` |
| Health | `http://localhost:8000/health` |
| gRPC (native) | `localhost:50051` |
| gRPC-Web (mutations) | `http://localhost:8080` |
| Postgres | `localhost:5432` |
| Frontend | `http://localhost:3000` |

Stop:

```bash
docker compose -f docker/docker-compose.yml down
```

## gRPC-Web only (local dev)

Use when running `inventory-api` / `inventory-grpc` on the host but mutations need Envoy:

```bash
# host terminal — gRPC server
cd backend && uv run inventory-grpc

# repo root — Envoy proxy
docker compose -f docker/docker-compose.envoy.yml up -d
```

Forwards `http://127.0.0.1:8080` → `host.docker.internal:50051`.

Stop:

```bash
docker compose -f docker/docker-compose.envoy.yml down
```

## Startup order (full stack)

1. `postgres` starts and becomes healthy
2. `backend-api` and `backend-grpc` wait for Postgres
3. Backend containers run `aerich upgrade` then start their server
4. `grpc-web` (Envoy) starts after `backend-grpc`
5. `frontend` waits for healthy `backend-api`, then serves on `:3000`

## Environment

Secrets and config passed via environment variables or `.env` file next to compose files (not committed). See [`architecture.md`](./architecture.md) for variable list.

Minimum for local Docker:

```env
POSTGRES_USER=box
POSTGRES_PASSWORD=box
POSTGRES_DB=box
JWT_SECRET=change-me-in-production
AUTH_SECRET=change-me-in-production
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
NEXT_PUBLIC_GRPC_WEB_URL=http://localhost:8080
```

Inside the frontend container:

```env
GRAPHQL_URL=http://backend-api:8000/graphql
GRPC_WEB_URL=http://grpc-web:8080
```

## Volumes

- Named volume for Postgres data — persists between restarts
- `docker compose down -v` removes volumes (destroys DB data)

## Related docs

- Backend architecture: [`architecture.md`](./architecture.md)
- Frontend URLs: [`../frontend/architecture.md`](../frontend/architecture.md)
