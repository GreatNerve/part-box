# Feature: Search and Filter

## Summary

Students need to **find parts quickly** by name, **filter by category**, and **narrow by box** so they can locate stock before a deadline.

## User stories

> As a student, I want to search by component name so I don't buy a duplicate.

> As a student, I want to filter by category and box so I know what's in Box 2 or all my sensors.

## Search

### By component name

- Text search over component names (substring match).
- Case-insensitive preferred.
- Results update the component list (live or on submit—UX choice).

## Filters

### By category

- Filter list to one or more categories from the user's category list.
- Works with default and custom categories.
- Clear "all categories" reset.

### By box

- Filter to components that have **quantity > 0** in the selected box.
- Box filter uses the same free-text box identifiers as [storage-locations.md](./storage-locations.md).
- Optional: show qty in that box in the list row when box filter is active.

## Combined behavior

- Search and filters can apply together (e.g. category = Sensor AND box = Box 1 AND name contains `DHT`).

## Acceptance criteria

- [ ] Search by name returns matching components for current user only.
- [ ] Category filter limits list correctly.
- [ ] Box filter shows only components with stock in that box.
- [ ] Filters can be cleared to show full inventory.
- [ ] Empty state message when no matches (not a blank screen).

## Out of scope (v1)

- Full-text search in log reasons
- Saved filter presets
- Sort by last used or low stock
