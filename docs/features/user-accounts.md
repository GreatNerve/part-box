# Feature: User Accounts

## Summary

Each student has their own account and a **private inventory**. No other user can view or edit another student's data.

## User story

> As a student, I want my parts list to belong only to me so my inventory stays personal.

## Requirements

### Must have (v1)

- **Registration** — student creates account with **email + password** (unique email).
- **Login / logout** — student signs in with **email + password**; receives JWT.
- **Private data** — all components, categories, boxes, and logs are scoped to the logged-in user.
- **Session** — app shows only the current user's inventory after login.

### Per-user isolation

Everything below is **per user**:

- Components and quantities per box
- Custom categories
- Inventory logs
- Datasheet links

Two students may both have a component named `ATmega328P` in `Box 1`; those are separate records under separate accounts.

## Acceptance criteria

- [ ] Student A cannot see Student B's components, logs, or categories.
- [ ] After logout, inventory data is not visible until login again.
- [ ] New account starts with an empty inventory and default category list.

## Out of scope (v1)

- Shared lab inventory
- Admin roles
- Password reset flows (may be added later)
- Social / team features
