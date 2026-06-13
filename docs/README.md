# Electronics Inventory Management — Documentation

Personal inventory app for **solo students** to track electronic parts (ICs, Arduinos, sensors, modules, etc.) across labeled storage boxes.

## Problem

Students often:

- Forget what parts they own and buy duplicates
- Cannot find parts when a project is due
- Forget which box a component is stored in

## Product scope (v1)

| In scope | Out of scope (later) |
|----------|----------------------|
| Per-student login and private inventory | Low-stock alerts |
| Components with multi-box quantities | Photos |
| Usage and stock movement logs | Price tracking |
| Return, lost, burn, defective log types | Export / backup |
| Fixed + custom categories (per user) | Barcode scanning |
| Search and filter | Shared / lab inventory |

## Documentation index

### Product features

| Doc | Topic |
|-----|--------|
| [user-accounts.md](./features/user-accounts.md) | Login, privacy, one inventory per student |
| [components.md](./features/components.md) | Component records and datasheet links |
| [storage-locations.md](./features/storage-locations.md) | Box-based quantity tracking |
| [categories.md](./features/categories.md) | Fixed categories, custom additions, filters |
| [inventory-logs.md](./features/inventory-logs.md) | Add stock, use, return, loss/damage logs |
| [search-and-filter.md](./features/search-and-filter.md) | Finding parts in the catalog |
| [out-of-scope-v1.md](./features/out-of-scope-v1.md) | Deferred features |

### Backend

| Doc | Topic |
|-----|--------|
| [backend/README.md](./backend/README.md) | Backend docs index |
| [backend/architecture.md](./backend/architecture.md) | GraphQL, gRPC, Tortoise, auth, tests |
| [backend/api-design.md](./backend/api-design.md) | Schema, mutations, errors, pagination, sort |
| [backend/naming-conventions.md](./backend/naming-conventions.md) | Backend folder and file naming |
| [backend/docker.md](./backend/docker.md) | Docker Compose setup |

### Frontend

| Doc | Topic |
|-----|--------|
| [frontend/README.md](./frontend/README.md) | Frontend docs index |
| [frontend/architecture.md](./frontend/architecture.md) | GraphQL client, Vite vs Next.js, auth |
| [frontend/naming-conventions.md](./frontend/naming-conventions.md) | Frontend folder and file naming |

## Repo layout

| Folder | README |
|--------|--------|
| Project root | [`../README.md`](../README.md) |
| Backend code | [`../backend/README.md`](../backend/README.md) |
| Frontend code | [`../frontend/README.md`](../frontend/README.md) |
| Docs (this folder) | [`README.md`](./README.md) |
| Docker compose files | [`../docker/`](../docker/) |
