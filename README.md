# Electronics Inventory Management

Personal inventory app for **solo students** to track electronic parts — ICs, Arduinos, sensors, modules, and more — across labeled storage boxes.

## Why

Students often forget what they own, buy duplicates, and cannot remember which box a part is in when a project is due. This project gives each student a private catalog with searchable components, per-box quantities, and a full log of stock changes.

## Repo layout

| Folder | Purpose |
|--------|---------|
| [`frontend/`](./frontend/) | Next.js web app (dev); Vite in production |
| [`backend/`](./backend/) | Python GraphQL + gRPC API |
| [`docs/`](./docs/) | Product and technical specifications |
| [`docker/`](./docker/) | Docker Compose files |

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | Next.js (dev) → Vite SPA (prod); GraphQL client |
| Backend API | FastAPI + Strawberry GraphQL (`:8000`) |
| Service contract | gRPC + Protocol Buffers (`:50051`) |
| Database | PostgreSQL + Tortoise ORM + Aerich |
| Package manager (Python) | uv |
| Runtime | Docker Compose |

## v1 features (summary)

- Per-student login and private inventory
- Components with name, category, optional datasheet link
- Quantities split across boxes (e.g. 5 in Box 1, 5 in Box 2)
- Inventory logs: add stock, use, return, lost, burn, defective
- Fixed + custom categories per user
- Search and filter by name, category, and box

## Documentation

| Section | Path |
|---------|------|
| Product features | [`docs/features/`](./docs/features/) |
| Backend architecture | [`docs/backend/`](./docs/backend/) |
| Frontend architecture | [`docs/frontend/`](./docs/frontend/) |
| Full index | [`docs/README.md`](./docs/README.md) |

## Getting started

Implementation in progress. When ready:

1. Postgres only: `docker compose -f docker/docker-compose.db.yml up -d`
2. Full stack: `docker compose -f docker/docker-compose.yml up --build`

See [`docs/backend/docker.md`](./docs/backend/docker.md) for details.
