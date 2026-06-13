# Feature: Inventory Logs

## Summary

All stock changes are **logged**. Students never silently edit quantities—every add, use, return, or loss creates a **log entry** with date, quantity, box, and context.

## User story

> As a student, I want a history of when I used parts, returned them, or lost/burned them, so I can trust my inventory counts.

## Log types (v1)

| Type | Effect on qty | Required fields |
|------|----------------|-----------------|
| **Add stock** | +qty in chosen box | Component, box, qty, note (e.g. "Amazon order", "Lab kit") |
| **Use** | −qty in chosen box | Component, box, qty, reason (e.g. "Lab 3", "Robot wheel") |
| **Return** | +qty in box (typically same as original use) | Linked to a prior **Use** log; marked as **Return** |
| **Lost** | −qty in chosen box | Component, box, qty, reason |
| **Burn / defective** | −qty in chosen box | Component, box, qty, reason (burn, defective, damaged, etc.) |

**Date** is set automatically at log creation (server or client clock—implementation detail).

## Behaviors

### Add stock

- Student selects component, box, quantity to add, and optional short note.
- Box quantity and component total increase.
- Log appears in component history as **Add stock**.

### Use

- Student selects component, box, quantity used, and short reason.
- Box quantity decreases; cannot exceed available qty in that box.
- Log appears as **Use**.

### Return

- From a **Use** log entry, student clicks **Return**.
- Creates a new log entry:
  - Type: **Return**
  - References the original Use log
  - Restores quantity (full return or partial—see below)
- Marked clearly as **Return** in history.

**Partial return:** student may return fewer pieces than were used (e.g. used 5, return 2). Implementation must keep Use and Return quantities consistent.

### Lost / burn / defective

- Same flow as Use (pick box, qty, reason) but log type distinguishes **Lost**, **Burn**, or **Defective** (or single "Loss/damage" type with reason enum—implementation choice).
- Decreases quantity; does not require linking to a prior Use log.

## Log history view

- Per component: chronological list of all log entries.
- Shows: date, type, qty (+/−), box, reason/note, link to related Use for Returns.

## Acceptance criteria

- [ ] Adding stock creates an Add stock log and increases box qty.
- [ ] Use creates a log and decreases box qty; fails if insufficient stock.
- [ ] Return button on a Use log creates a Return entry and increases qty.
- [ ] Return entries reference the Use they undo (full or partial).
- [ ] Lost/burn/defective entries decrease qty with typed reason.
- [ ] No quantity change without a corresponding log row.

## Out of scope (v1)

- Edit or delete historical logs (immutable audit trail preferred)
- Bulk import of logs
- Export log CSV
