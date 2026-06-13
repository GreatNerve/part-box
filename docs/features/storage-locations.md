# Feature: Storage Locations (Boxes)

## Summary

Students store parts in **numbered or labeled boxes** (e.g. `Box 1`, `Box 2`, `Red toolbox`). Each component can have quantity in **multiple boxes at once**.

## User story

> As a student, I want to record that I have 5 resistors in Box 1 and 5 in Box 2 so I know exactly where to look.

## Requirements

### Box identifier

- Stored as **text** (free-form).
- Typical use: box numbers (`Box 1`, `Box 2`) or short labels (`Drawer A`).
- No requirement for a predefined box master list in v1—student types the box name when assigning stock.

### Quantity per box

- For each component, zero or more **(box, quantity)** pairs.
- Example:

  | Component | Box | Qty |
  |-----------|-----|-----|
  | 1kΩ resistor | Box 1 | 5 |
  | 1kΩ resistor | Box 2 | 5 |
  | **Total** | | **10** |

### Updates via logs only

- Increasing or decreasing quantity in a specific box happens through [inventory logs](./inventory-logs.md):
  - Add stock → increases qty in chosen box
  - Use / loss / damage → decreases qty in chosen box
  - Return → increases qty (usually same box as original use)

### Constraints

- Quantity in a box cannot go below zero.
- When use/loss is logged, student **must pick which box** the pieces come from.

## Acceptance criteria

- [ ] One component can have quantities in multiple boxes.
- [ ] Total on component = sum of box quantities.
- [ ] Every quantity change names the affected box.
- [ ] UI prevents negative quantity in any box.

## Out of scope (v1)

- Predefined box registry with photos or shelf maps
- GPS / room-level location
- Moving all stock from Box 1 to Box 2 in one action (can be done as use + add stock logs)
