# Feature: Activity Log (Central)

## Summary

A **single workspace view** of all inventory log entries across every component — not only per-component history on the detail page.

## User story

> As a student, I want one place to see everything I added, used, moved, or lost recently, without opening each part individually.

## Scope

| View | Location |
|------|----------|
| Per-component history | Component detail page (existing) |
| **Central activity log** | New nav item **Activity** (`/activity`) |

## Data source

Same `InventoryLog` rows as component detail — user-wide query with filters.

## Filters (v1.1)

| Filter | Notes |
|--------|--------|
| Search | Component name (partial match) |
| Log type | ADD_STOCK, USE, RETURN, LOST, BURN, DEFECTIVE, REALLOCATE |
| Box | Text match on log.box |
| Date range | Optional v1.1+ |

Pagination: offset/limit, newest first.

## Table columns

| Column | Content |
|--------|---------|
| When | `createdAt` |
| Component | Name (link to detail) |
| Event | Log type badge |
| Qty | Quantity (+/− styling by type) |
| Box | Primary box; for REALLOCATE show `from → to` |
| Reason | Note text or — |

## Acceptance criteria

- [ ] `/activity` lists logs for authenticated user only.
- [ ] Rows link to component detail.
- [ ] Sorted newest first.
- [ ] Filters reduce result set correctly.
- [ ] Mobile: DataTable card layout via column `meta`.

## Related

- [inventory-logs.md](./inventory-logs.md) — log types and rules
- [../backend/api-design.md](../backend/api-design.md) — `inventoryLogs` query
