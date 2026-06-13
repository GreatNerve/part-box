# Docker Setup

Local development and full-stack runtime using Docker Compose files in the `docker/` folder.

## Files

| File | Purpose |
|------|---------|
| [`docker/docker-compose.db.yml`](../../docker/docker-compose.db.yml) | **Postgres only** — backend dev/tests without full stack |
| [`docker/docker-compose.yml`](../../docker/docker-compose.yml) | **Full project** — Postgres + backend-api + backend-grpc (+ frontend when added) |

## Services (full stack)

```
docker-compose.yml
├── postgres          :5432
├── backend-api       :8000   FastAPI + GraphQL
├── backend-grpc      :50051  gRPC
└── frontend          :3000   Next.js (when added)
```

Both backend containers use the **same image** with different commands.

## Postgres only (backend dev / tests)

Use when working on backend locally or running integration tests:

```bash
docker compose -f docker/docker-compose.db.yml up -d
```

Typical `.env` for local backend (outside Docker):

```env
DATABASE_URL=postgres://inventory:inventory@localhost:5432/inventory
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
| GraphQL | `http://localhost:8000/graphql` |
| GraphQL playground | `http://localhost:8000/graphql` (if enabled) |
| Health | `http://localhost:8000/health` |
| gRPC | `localhost:50051` |
| Postgres | `localhost:5432` |
| Frontend | `http://localhost:3000` (when added) |

Stop:

```bash
docker compose -f docker/docker-compose.yml down
```

## Startup order

1. `postgres` starts and becomes healthy
2. `backend-api` and `backend-grpc` wait for Postgres
3. Backend containers run `aerich upgrade` then start their server
4. `frontend` waits for `backend-api` (when added)

## Environment

Secrets and config passed via environment variables or `.env` file next to compose files (not committed). See [`architecture.md`](./architecture.md) for variable list.

Minimum for local Docker:

```env
POSTGRES_USER=inventory
POSTGRES_PASSWORD=inventory
POSTGRES_DB=inventory
JWT_SECRET=change-me-in-production
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Volumes

- Named volume for Postgres data — persists between restarts
- `docker compose down -v` removes volumes (destroys DB data)

## Related docs

- Backend architecture: [`architecture.md`](./architecture.md)
- Frontend URLs: [`../frontend/architecture.md`](../frontend/architecture.md)
