# Feature: Categories

## Summary

Every component belongs to a **category**. Students start from a **fixed default list** and can **add their own categories**. Categories are **per user**—custom categories do not appear for other accounts.

## User story

> As a student, I want to group parts as IC, Sensor, Arduino, etc., add my own labels when needed, and filter my list by category.

## Default categories (v1)

Ship a fixed starter set, for example:

- IC
- Arduino / MCU
- Sensor
- Module
- Wire / cable
- Tool
- Other

Exact labels can be adjusted during implementation; behavior matters more than exact spelling.

## Custom categories

- Student can **add new category names** to their account.
- Custom categories appear alongside defaults in dropdowns and filters.
- Categories are **not shared** between users.

## Filtering

- Component list can be **filtered by one or more categories** (see [search-and-filter.md](./search-and-filter.md)).
- Filter state should be obvious in the UI (active category chips or dropdown).

## Behaviors

### Add custom category

- Student enters a new category name.
- Name must be unique for that user (case handling TBD).
- New category is immediately available when creating/editing components.

### Edit / delete custom category

- v1 minimum: allow rename or delete if no components use it; if in use, block delete or require reassignment (implementation choice).

## Acceptance criteria

- [ ] New user receives default category list.
- [ ] User can add at least one custom category.
- [ ] Component create/edit requires a category from user's list.
- [ ] Filter by category reduces visible components correctly.
- [ ] User A's custom categories are invisible to User B.

## Out of scope (v1)

- Hierarchical categories (parent/child)
- Global/shared taxonomy across all students
- Category icons or colors (nice-to-have later)
