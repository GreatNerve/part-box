# Feature: Inventory Logs

## Summary

All stock changes are **logged**. Students never silently edit quantities—every add, use, return, loss, or **box move** creates a **log entry** with date, quantity, box context, and notes.

## User story

> As a student, I want a history of when I used parts, returned them, moved them between boxes, or lost/burned them, so I can trust my inventory counts.

## Log types (v1.1)

| Type | Effect on qty | Required fields |
|------|----------------|-----------------|
| **Add stock** | +qty in chosen box | Component, box, qty, note |
| **Use** | −qty in chosen box | Component, box, qty, reason |
| **Return** | +qty in box | Linked to prior **Use** via `relatedLogId` |
| **Lost** | −qty in chosen box | Component, box, qty, reason |
| **Burn / defective** | −qty in chosen box | Component, box, qty, reason |
| **Reallocate** | −qty in `fromBox`, +qty in `toBox` (same component, atomic) | Component, fromBox, toBox, qty, optional reason |

**Date** is set automatically at log creation.

### Reallocate (new)

Moves quantity between boxes **without changing component total**.

- One atomic service operation → one log row (type `REALLOCATE`).
- Fails if `fromBox` has insufficient qty.
- Creates/adjusts `ComponentBoxQuantity` for both boxes.
- See [storage-locations.md](./storage-locations.md#stock-reallocation).

## Behaviors

### Add stock

- Student selects component, box, quantity, optional note.
- Box quantity and component total increase.

### Use

- Student selects component, box, quantity, reason.
- Cannot exceed available qty in that box.

### Return

- From a **Use** log entry (or dialog with `relatedLogId`).
- Partial returns supported.

### Lost / burn / defective

- Decreases quantity; no link to Use required.

### Reallocate

- Student picks **from box**, **to box**, quantity.
- UI on component detail (and optional quick action).
- Box suggestions show known boxes for the component.

## Log history views

| View | Scope |
|------|--------|
| Component detail | `componentLogs(componentId)` — existing |
| **Activity log** | `inventoryLogs` — all components — [activity-log.md](./activity-log.md) |

Both show: date, type, qty, box(es), reason, component name (central only), link to related Use for Returns.

## Acceptance criteria

- [ ] Adding stock creates log and increases box qty.
- [ ] Use decreases box qty; fails if insufficient stock.
- [ ] Return references Use log (full or partial).
- [ ] Lost/burn/defective decrease qty with reason.
- [ ] **Reallocate** moves qty between boxes atomically with one log row.
- [ ] Central activity log lists all user logs.
- [ ] No quantity change without a corresponding log row.

## Out of scope (v1.1)

- Edit or delete historical logs (immutable audit trail)
- Bulk import of logs
- Export log CSV

## Related

- [activity-log.md](./activity-log.md)
- [storage-locations.md](./storage-locations.md)
- [../backend/api-design.md](../backend/api-design.md)
