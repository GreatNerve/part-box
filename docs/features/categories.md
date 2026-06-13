# Feature: Categories

## Summary

Every component belongs to a **category**. Students start from a **fixed default list** and can **add their own categories**. Categories are **per user**—custom categories do not appear for other accounts.

**Management UI** lives under **Settings** (not a top-level nav item).

## User story

> As a student, I want to group parts as IC, Sensor, Arduino, etc., set how many count as "low stock" for each category, and filter my list by category.

## Default categories (v1)

Ship a fixed starter set with **default low-stock thresholds**:

| Default name | Suggested `lowStockThreshold` |
|--------------|-------------------------------|
| IC | 10 |
| Arduino / MCU | 1 |
| Sensor | 3 |
| Module | 2 |
| Wire / cable | 5 |
| Tool | 1 |
| Other | 5 |

Exact labels can be adjusted during implementation; behavior matters more than exact spelling.

## Fields (v1.1)

| Field | Type | Notes |
|-------|------|--------|
| `name` | string | Unique per user |
| `isDefault` | bool | Seeded defaults; custom = false |
| **`lowStockThreshold`** | int | Min qty before UI shows **low stock** for components in this category; must be ≥ 0 |

### Low stock semantics

- Compare **`component.totalQty`** against **`category.lowStockThreshold`**.
- **Low stock:** `0 < totalQty < lowStockThreshold`
- **Out of stock:** `totalQty == 0`
- **In stock:** `totalQty >= lowStockThreshold`

Replaces the previous hard-coded frontend rule (`totalQty < 5`).

## Custom categories

- Student can **add new category names** in **Settings → Categories**.
- Must set **low stock threshold** when creating (default suggestion: 5).
- Custom categories appear alongside defaults in dropdowns and filters.
- Categories are **not shared** between users.

## Filtering

- Component list can be **filtered by category** (see [search-and-filter.md](./search-and-filter.md)).
- Filter state should be obvious in the UI (active category chips or dropdown).

## Behaviors

### Add custom category

- Student enters name + low stock threshold.
- Name must be unique for that user (case handling TBD).
- New category is immediately available when creating/editing components.

### Edit category (v1.1)

- Student can update **name** and **`lowStockThreshold`** for custom categories.
- Default seeded categories: allow threshold edit; rename/delete blocked or limited (TBD).

### Delete custom category

- Block delete if components still reference it; prompt reassignment or cancel.

## UI placement

| Before | After (v1.1) |
|--------|----------------|
| Top-level `/categories` nav | **Settings → Categories** tab/section |
| Standalone categories page | Removed from sidebar |

## Acceptance criteria

- [ ] New user receives default category list with thresholds.
- [ ] User can add custom category with threshold in Settings.
- [ ] User can edit category threshold in Settings.
- [ ] Component create/edit requires a category from user's list.
- [ ] Low-stock badges use per-category threshold (not global 5).
- [ ] Filter by category reduces visible components correctly.
- [ ] User A's custom categories are invisible to User B.

## Out of scope (v1.1)

- Hierarchical categories (parent/child) — see [out-of-scope-v1.md](./out-of-scope-v1.md)
- Global/shared taxonomy across all students
- Category icons or colors (nice-to-have later)

## Related

- [components.md](./components.md)
- [component-groups.md](./component-groups.md) — optional visual grouping separate from category
