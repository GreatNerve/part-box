# Backend

Python backend for the electronics inventory app: **GraphQL** for browser clients, **gRPC** for service contract, shared business logic, PostgreSQL.

## Role

- Authenticate students (JWT) and scope all data per user
- Store components, categories, box quantities, and inventory logs
- Expose **GraphQL** at `:8000` for Vite / Next.js clients
- Expose **gRPC** at `:50051` for contract tests and future integrations

## Stack

| Piece | Tool |
|-------|------|
| HTTP / GraphQL | FastAPI + Strawberry |
| gRPC | grpcio + protobuf |
| ORM | Tortoise ORM |
| Migrations | Aerich |
| Package manager | uv |
| Database | PostgreSQL |
| Tests | pytest + pytest-asyncio |

## Project structure

```
backend/
├── README.md
├── pyproject.toml
├── proto/
│   └── v1/
├── app/
│   ├── core/               # config, auth, db
│   ├── models/             # Tortoise — snake_case per domain
│   ├── schemas/            # Pydantic DTOs
│   ├── services/           # business logic (shared)
│   ├── api/graphql/        # Strawberry — by domain + schema.py
│   └── grpc/
│       ├── servicers/
│       └── gen/v1/
├── migrations/
└── tests/
    ├── unit/               # mirrors app/ — test_*.py
    └── integration/
```

Naming conventions: [`../docs/backend/naming-conventions.md`](../docs/backend/naming-conventions.md)

## Documentation

Full technical design: [`../docs/backend/`](../docs/backend/)

| Doc | Topic |
|-----|--------|
| [architecture.md](../docs/backend/architecture.md) | Layers, auth, GraphQL/gRPC, config, tests |
| [api-design.md](../docs/backend/api-design.md) | GraphQL schema, errors, pagination, sort |
| [naming-conventions.md](../docs/backend/naming-conventions.md) | Folder and file naming |
| [docker.md](../docs/backend/docker.md) | Compose files and local dev |

Product rules: [`../docs/features/`](../docs/features/)

## Getting started

```bash
# 1. Postgres
docker compose -f docker/docker-compose.db.yml up -d

# 2. Backend deps
cd backend
cp .env.example .env
uv sync --extra dev

# 3. Migrations (first time)
uv run aerich init-db

# 4. Run API + gRPC (separate terminals)
uv run inventory-api
uv run inventory-grpc

# 5. Tests
uv run pytest tests/unit -q
uv run pytest tests/integration/test_full_user_flow.py -v   # requires Postgres

# Or script wrapper
uv run python scripts/test_user_flow.py
```

Generate gRPC stubs: `bash scripts/generate_proto.sh`

## Frontend contract

Browser clients call **GraphQL only** (`POST /graphql`). See [`../docs/frontend/architecture.md`](../docs/frontend/architecture.md).
