# Feature: Storage Locations (Boxes)

## Summary

Students store parts in **numbered or labeled boxes** (e.g. `Box 1`, `Grid 3 C1`). Each component can have quantity in **multiple boxes at once**.

## User story

> As a student, I want to record that I have 5 resistors in Box 1 and 5 in Box 2, and move stock between boxes when I reorganize my shelf.

## Requirements

### Box identifier

- Stored as **text** (free-form).
- No predefined box master list in v1.

### Quantity per box

- For each component, zero or more **(box, quantity)** pairs.
- **Total** on component = sum of box quantities.

### Updates via logs only

- Increasing or decreasing quantity in a specific box happens through [inventory logs](./inventory-logs.md):
  - Add stock → +qty in chosen box
  - Use / loss / damage → −qty in chosen box
  - Return → +qty (usually same box as original use)

### Constraints

- Quantity in a box cannot go below zero.
- When use/loss is logged, student **must pick which box** the pieces come from.

## Stock reallocation (v1.1)

**Moves qty from one box to another** for the same component in **one action** (replaces manual Use + Add stock pair).

| Field | Description |
|-------|-------------|
| `fromBox` | Source box (must have enough qty) |
| `toBox` | Destination box (created if new label) |
| `quantity` | Units moved |

- Log type: **`REALLOCATE`**
- Component **total qty unchanged**
- Implemented in `inventory_log` service as atomic transaction

### UI

- Component detail: **Move stock** dialog (from box, to box, qty) with box suggestions on both fields.
- Activity log shows `Grid 3 C1 → Box 2` style summary.

## Acceptance criteria

- [ ] One component can have quantities in multiple boxes.
- [ ] Total on component = sum of box quantities.
- [ ] Every quantity change names the affected box(s).
- [ ] UI prevents negative quantity in any box.
- [ ] **Reallocate** moves stock between boxes without changing total.

## Out of scope (v1.1)

- Predefined box registry with photos or shelf maps
- GPS / room-level location
- Moving stock **between different components** (transfer ownership — future)
