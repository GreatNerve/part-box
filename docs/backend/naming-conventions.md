# Backend Naming Conventions

Folder and file naming rules for the Python backend. Applies once code is scaffolded under `backend/`.

## General rules

| Rule | Convention |
|------|------------|
| Python modules | `snake_case` |
| Python classes | `PascalCase` |
| Python functions / variables | `snake_case` |
| Package root | `app/` |
| Tests | mirror source path; filename prefix `test_` |

## Layer layout — one file per domain

Each domain gets its own file inside each layer. Use the **same domain stem** across layers.

```
app/
├── models/
│   ├── user.py
│   ├── category.py
│   ├── component.py
│   └── inventory_log.py
├── schemas/
│   ├── user.py
│   ├── category.py
│   ├── component.py
│   └── inventory_log.py
├── services/
│   ├── auth.py
│   ├── category.py
│   ├── component.py
│   └── inventory_log.py
├── core/
│   ├── settings.py
│   ├── db.py
│   ├── auth.py
│   └── dependencies.py
├── api/
│   └── graphql/
│       ├── schema.py              # merges all types, queries, mutations
│       ├── auth_mutations.py
│       ├── category_queries.py
│       ├── category_mutations.py
│       ├── component_queries.py
│       ├── component_mutations.py
│       ├── component_types.py
│       ├── inventory_log_mutations.py
│       └── inventory_log_types.py
└── grpc/
    ├── server.py                  # gRPC bootstrap
    ├── servicers/
    │   ├── auth.py
    │   ├── component.py
    │   └── inventory_log.py
    └── gen/
        └── v1/                    # generated stubs — do not edit
```

### Do not

- Put all models in one `models.py` (grows unmaintainable)
- Use domain subfolders under `app/` for v1 (e.g. `app/components/service.py`) — keep flat layers

## GraphQL files

Organize **by domain**, not by operation kind alone.

| File pattern | Contents |
|--------------|----------|
| `*_types.py` | Strawberry GraphQL types for that domain |
| `*_queries.py` | Query resolvers |
| `*_mutations.py` | Mutation resolvers |
| `schema.py` | Imports and registers everything into one `Schema` |

Example: `inventory_log_mutations.py` holds `applyInventoryLog` resolver.

## Protocol Buffers

Versioned folder layout:

```
proto/
└── v1/
    ├── auth.proto
    └── inventory.proto
```

| Rule | Convention |
|------|------------|
| Folder | `proto/v{major}/` |
| Files | `snake_case.proto`, split by domain |
| Generated Python | `app/grpc/gen/v1/` — committed or generated at build (team choice at scaffold) |
| gRPC servicers | `app/grpc/servicers/{domain}.py` — hand-written, maps proto ↔ services |

## Tests

Mirror the source tree under `tests/`:

| Source | Test |
|--------|------|
| `app/services/inventory_log.py` | `tests/unit/services/test_inventory_log.py` |
| `app/services/component.py` | `tests/unit/services/test_component.py` |
| GraphQL integration | `tests/integration/graphql/test_component_queries.py` |
| gRPC integration | `tests/integration/grpc/test_inventory_log.py` |

```
tests/
├── unit/
│   ├── services/
│   │   ├── test_auth.py
│   │   ├── test_component.py
│   │   └── test_inventory_log.py
│   └── ...
└── integration/
    ├── graphql/
    └── grpc/
```

Run with pytest from `backend/` root.

## Class naming (illustrative)

| Layer | Pattern | Example |
|-------|---------|---------|
| Tortoise model | `{Entity}` | `Component`, `InventoryLog` |
| Pydantic DTO | `{Entity}DTO` or `{Action}Input` | `ComponentDTO`, `ApplyInventoryLogInput` |
| Service | `{Domain}Service` or module-level functions | `ComponentService` |
| gRPC servicer | `{Domain}Servicer` | `ComponentServicer` |

## Migrations

Aerich default — do not rename manually:

```
migrations/
└── models/
    └── {timestamp}_{description}.py
```

## Docker / config (repo root)

| Path | Purpose |
|------|---------|
| `docker/docker-compose.db.yml` | Postgres only |
| `docker/docker-compose.yml` | Full stack |
| `backend/.env.example` | Documented env vars (no secrets) |

## Related docs

- Project layout overview: [`architecture.md`](./architecture.md)
- API names (GraphQL camelCase, UUID IDs): [`api-design.md`](./api-design.md)
