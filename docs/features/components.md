# Feature: Components

## Summary

A **component** is one type of electronic part in the student's catalog (e.g. `LM358`, `DHT22`, `Arduino Uno`). Quantity is **not** stored as a single number on the component; it is split across **storage boxes** (see [storage-locations.md](./storage-locations.md)).

## User story

> As a student, I want to register each part type once with a name and category, optionally attach a datasheet link, and see total quantity across all my boxes.

## Fields

| Field | Required | Notes |
|-------|----------|--------|
| Component name | Yes | Human-readable name (e.g. `1kΩ resistor`, `ESP32-WROOM`) |
| Category | Yes | From user's category list (see [categories.md](./categories.md)) |
| Datasheet link | No | URL to datasheet or reference doc; optional |
| Quantities per box | Yes (can be zero boxes at create) | Each row: box identifier + quantity |

## Behaviors

### Create

- Student adds a new component with name and category.
- Optionally adds a datasheet URL.
- Optionally assigns initial quantities to one or more boxes (e.g. 5 in Box 1, 5 in Box 2).

### Read

- List view shows component name, category, **total quantity** (sum of all boxes), and optionally primary box hint.
- Detail view shows all box breakdowns, datasheet link, and link to log history.

### Update

- Student can edit name, category, and datasheet link.
- Quantity changes **must** go through [inventory logs](./inventory-logs.md) (add stock, use, return, loss/damage)—not silent edits.

### Delete

- Student can remove a component from the catalog (behavior for existing logs TBD during implementation; logs should remain auditable).

## Acceptance criteria

- [ ] Component requires name and category.
- [ ] Datasheet link is optional and opens/stores as a URL.
- [ ] Total quantity equals sum of quantities in all boxes for that component.
- [ ] Same component name allowed only once per user (duplicate names rejected or merged—pick one rule at implementation).

## Out of scope (v1)

- Photos
- Price or purchase vendor
- Serial numbers per unit
- Barcodes
