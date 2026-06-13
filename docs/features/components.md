# Feature: Components

## Summary

A **component** is one type of electronic part in the student's catalog (e.g. `LM358`, `DHT22`, `Arduino Uno`). Quantity is **not** stored as a single number on the component; it is split across **storage boxes** (see [storage-locations.md](./storage-locations.md)).

Optional **group name** clusters related parts in the list (see [component-groups.md](./component-groups.md)).

## User story

> As a student, I want to register each part type once with a name and category, optionally attach a resource link, optionally group variants (Arduino Nano / Uno), and see total quantity across all my boxes.

## Fields

| Field | Required | Notes |
|-------|----------|--------|
| Component name | Yes | Human-readable name (e.g. `Arduino Nano`, `100µF capacitor`) |
| Category | Yes | From user's category list (see [categories.md](./categories.md)) |
| **Group name** | No | Optional label to group list rows (e.g. `Arduino`) — [component-groups.md](./component-groups.md) |
| **Resource link** | No | URL to datasheet, PDF, or reference doc (stored as URL string; **no file upload** in v1.1) |
| Quantities per box | Yes (can be zero boxes at create) | Each row: box identifier + quantity |

### Resource link (renamed from "datasheet")

- Single optional URL field (`resourceUrl` in API; was `datasheetUrl`).
- UI label: **Resource link** — opens in new tab.
- No upload/storage service in v1.1.

## Behaviors

### Create

- Student adds name, category, optional group name, optional resource URL.
- Optionally assigns initial quantities to one or more boxes.

### Read

- List view: grouped by `groupName` when set; shows name, category, **total quantity**, low-stock badge using **category threshold**.
- Detail view: box breakdown, resource link, per-component log history.

### Update

- Student can edit name, category, group name, resource link.
- Quantity changes **must** go through [inventory logs](./inventory-logs.md) or [reallocation](./storage-locations.md#stock-reallocation).

### Delete

- Student can remove a component from the catalog (logs remain auditable).

## Low stock display

Uses **`category.lowStockThreshold`** — not a global constant.

| State | Condition |
|-------|-----------|
| Out of stock | `totalQty == 0` |
| Low stock | `0 < totalQty < category.lowStockThreshold` |
| In stock | `totalQty >= category.lowStockThreshold` |

## Acceptance criteria

- [ ] Component requires name and category.
- [ ] Resource link is optional URL only.
- [ ] Optional group name groups list UI.
- [ ] Total quantity equals sum of box quantities.
- [ ] Same component name once per user.
- [ ] Low-stock badge respects category threshold.

## Out of scope (v1.1)

- Photos
- Price or purchase vendor
- Serial numbers per unit
- Barcodes
- Uploaded files (URL link only)

## Related

- [categories.md](./categories.md)
- [component-groups.md](./component-groups.md)
- [activity-log.md](./activity-log.md)
