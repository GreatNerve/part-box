# Feature: Component Groups

## Summary

Students can **visually and logically group** related components under a shared label (e.g. **Arduino** → Nano, Uno, Mega as separate catalog entries).

A group is **not** a separate stock bucket — each component still has its own quantities, boxes, and logs.

## User story

> As a student, I want my Arduino Nano, Uno, and Mega listed together under "Arduino" so my parts catalog is easier to scan.

## Model (v1.1 — recommended)

| Approach | Status |
|----------|--------|
| Optional `groupName` on `Component` | **Deferred** — skip for current slice |
| Separate `ComponentGroup` entity | **Deferred** |

Components list remains **flat** (sorted by name/category) until grouping is picked up later.

### Rules (`groupName` approach)

- Optional; `null` = ungrouped (shown in "Other" section or flat list).
- Same `groupName` may appear on many components for one user.
- Group name is free text; not tied to category (Nano can be category "Arduino / MCU" and group "Arduino").
- Uniqueness: component **name** remains unique per user; group name is **not** unique.

## UI behaviors

### Components list

- **Grouped view** (default): sections by `groupName` (A→Z), then ungrouped items.
- Within a section: sort by name.
- Section header shows group label + item count + optional aggregate stock (sum of member `totalQty`).

### Create / edit component

- Optional **Group** field (text input with suggestions from existing group names on account).

### Settings

- No separate group admin screen in v1.1 unless `ComponentGroup` entity is chosen.
- Renaming a group = bulk update `groupName` on affected components (future enhancement).

## Acceptance criteria

- [ ] Student can set optional group name when creating/editing a component.
- [ ] List view groups components by `groupName`.
- [ ] Ungrouped components still appear in list.
- [ ] Grouping does not merge stock or logs across components.

## Out of scope

- Nested groups (parent/child)
- Group-level low-stock threshold (use **category** threshold instead)
- Shared stock pool across grouped components
