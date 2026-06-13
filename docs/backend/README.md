# Backend Documentation

Technical docs for the Python backend: GraphQL API, gRPC contract, PostgreSQL, Docker.

## Docs

| Doc | Topic |
|-----|--------|
| [architecture.md](./architecture.md) | Stack, layout, auth, GraphQL/gRPC, tests, config |
| [api-design.md](./api-design.md) | GraphQL schema, mutations, errors, pagination, gRPC parity |
| [naming-conventions.md](./naming-conventions.md) | Folder and file naming rules |
| [docker.md](./docker.md) | `docker-compose.db.yml` and `docker-compose.yml` |

## Quick reference

| Piece | Choice |
|-------|--------|
| Database | PostgreSQL + Tortoise ORM + Aerich |
| Package manager | uv |
| Browser reads | Strawberry GraphQL on FastAPI (`:8000`) |
| Browser writes | gRPC-Web via Envoy (`:8080`) → gRPC (`:50051`) |
| Layout | Layered monolith — `services/` shared by GraphQL + gRPC |

Product rules (what the backend must enforce): [`../features/`](../features/)

Implementation README: [`../../backend/README.md`](../../backend/README.md)
