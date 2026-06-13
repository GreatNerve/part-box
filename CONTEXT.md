# CONTEXT — Parts Desk

Domain + locked decisions. Workflow: [AGENTS.md](./AGENTS.md).

## Terms
| Term | Meaning |
|------|---------|
| User | Private inventory per account |
| Component | One catalog part type |
| Category | One label per component |
| Box | Free-text storage; qty per box |
| Inventory log | Immutable stock change row |
| Resource link | Optional URL (`datasheetUrl` API); UI label "Resource link" |
| Low stock | `0 < totalQty < category.lowStockThreshold` |
| Reallocate | Box→box move; total unchanged (`REALLOCATE`) |

## Stack (locked)
PG · Tortoise+Aerich · uv · GraphQL+JWT · gRPC · Next App Router · pnpm · shadcn Vega · TanStack Query · NextAuth v5 → `session.accessToken`

Layer: `models/`→`services/`→`api/graphql/`+`grpc/`

## Grill (locked)
| # | Decision |
|---|----------|
| 1 | No grouping until asked |
| 2 | Move stock = separate dialog |
| 3 | Edit all category thresholds; block rename seeded defaults |
| 4 | Central logs: Activity → `/activity` |
| 5 | UI "Resource link"; keep `datasheetUrl` in API/DB |

Seed thresholds: IC 10 · MCU 1 · Sensor 3 · Module 2 · Wire 5 · Tool 1 · Other 5 · custom 5

## Log types
`ADD_STOCK` `USE` `RETURN` `LOST` `BURN` `DEFECTIVE` `REALLOCATE` — no qty change without log

## Out of scope
Photos, prices, export, barcodes, shared inventory, log edit/delete, uploads, grouping → [out-of-scope-v1.md](./docs/features/out-of-scope-v1.md)

## Docs
`docs/features/` · `docs/backend/api-design.md` · `docs/frontend/architecture.md` · [v1.1](./docs/backend/v1.1-changes.md)
