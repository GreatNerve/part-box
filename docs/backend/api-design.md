# API Design

GraphQL schema conventions and operation shapes for v1. gRPC proto mirrors these capabilities where practical.

**Conventions:** camelCase field and argument names. Entity IDs are **UUID strings** (`ID!` in GraphQL), stored as **UUID primary keys** in PostgreSQL.

## Decisions summary

| Topic | Choice |
|-------|--------|
| Inventory log mutations | Single `applyInventoryLog` with `InventoryLogType` enum (+ **`REALLOCATE`** v1.1) |
| Errors | Union payload for expected business failures; GraphQL `errors` for auth/server faults |
| Pagination | Offset — `limit` + `offset` |
| List filters | Input objects — `ComponentFilterInput`, `InventoryLogFilterInput`, `PaginationInput` |
| Sort | `ComponentSortInput` nested inside filter |
| IDs | UUID in API and as Postgres primary keys on all tables |
| Auth identity | Email + password (unique email) |
| Naming | camelCase throughout GraphQL |
| Low stock | Per-category `lowStockThreshold` on `Category` (v1.1) |
| Grouping | Optional `groupName` on `Component` (v1.1) |
| Resource link | `resourceUrl` (alias `datasheetUrl` until migration) — URL only |

---

## GraphQL types (core)

```graphql
enum InventoryLogType {
  ADD_STOCK
  USE
  RETURN
  LOST
  BURN
  DEFECTIVE
  REALLOCATE          # v1.1 — move qty between boxes, total unchanged
}

enum ComponentSortField {
  NAME
  CATEGORY
  TOTAL_QTY
  UPDATED_AT
}

enum SortDirection {
  ASC
  DESC
}

type Component {
  id: ID!
  name: String!
  categoryId: ID!
  categoryName: String!
  groupName: String              # v1.1 — optional list grouping
  resourceUrl: String            # v1.1 — was datasheetUrl; URL only
  lowStockThreshold: Int!        # v1.1 — from category, denormalized for list UI
  totalQty: Int!
  boxQuantities: [BoxQuantity!]!
  updatedAt: DateTime!
}

type BoxQuantity {
  box: String!
  quantity: Int!
}

type InventoryLog {
  id: ID!
  componentId: ID!
  componentName: String          # v1.1 — populated on central log query
  type: InventoryLogType!
  quantity: Int!
  box: String!                   # primary box; for REALLOCATE = toBox
  fromBox: String                # v1.1 — REALLOCATE only
  reason: String
  relatedLogId: ID               # set on RETURN → links USE log
  createdAt: DateTime!
}

type Category {
  id: ID!
  name: String!
  isDefault: Boolean!
  lowStockThreshold: Int!        # v1.1 — low stock when 0 < totalQty < threshold
}

type User {
  id: ID!
  email: String!
  displayName: String
  createdAt: DateTime!
}
```

---

## Pagination

Shared input and response wrapper:

```graphql
input PaginationInput {
  limit: Int = 20
  offset: Int = 0
}

type ComponentConnection {
  items: [Component!]!
  totalCount: Int!
  limit: Int!
  offset: Int!
}

type InventoryLogConnection {
  items: [InventoryLog!]!
  totalCount: Int!
  limit: Int!
  offset: Int!
}
```

Used on `components` and `component { logs(...) }`.

---

## Filter and sort

```graphql
input ComponentSortInput {
  field: ComponentSortField!
  direction: SortDirection = ASC
}

input ComponentFilterInput {
  search: String              # substring on component name
  categoryId: ID
  box: String                 # components with qty > 0 in this box
  sort: ComponentSortInput
}
```

**Query:**

```graphql
components(
  filter: ComponentFilterInput
  pagination: PaginationInput
): ComponentConnection!
```

All filter fields optional. Combined with AND semantics (search + category + box together).

---

## Queries

| Query | Args | Returns |
|-------|------|---------|
| `me` | — | Current user (requires auth) |
| `categories` | — | `[Category!]!` |
| `components` | `filter`, `pagination` | `ComponentConnection!` |
| `component` | `id: ID!` | `Component` (nullable if not found / not owned) |
| `componentLogs` | `componentId: ID!`, `pagination` | `InventoryLogConnection!` |
| **`inventoryLogs`** | **`filter`, `pagination`** | **`InventoryLogConnection!`** (v1.1 — all user logs) |

```graphql
input InventoryLogFilterInput {
  search: String                 # component name substring
  type: InventoryLogType
  box: String
  componentId: ID
}
```

Query:

```graphql
inventoryLogs(
  filter: InventoryLogFilterInput
  pagination: PaginationInput
): InventoryLogConnection!
```

`component` includes nested `boxQuantities`. Logs fetched via `componentLogs` or nested field on detail — pick one in implementation; both may expose same data.

---

## Mutations

### Auth (public — no JWT required)

```graphql
input RegisterInput {
  email: String!
  password: String!
  displayName: String
}

input LoginInput {
  email: String!
  password: String!
}

type AuthPayload {
  token: String!
  user: User!
}

type Mutation {
  register(input: RegisterInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
}
```

Auth mutations return payload directly or use union — implementation may use simple payload; business validation (duplicate email) uses union pattern below.

### Components

```graphql
input CreateComponentInput {
  name: String!
  categoryId: ID!
  groupName: String              # v1.1 optional
  resourceUrl: String            # v1.1 optional (alias datasheetUrl)
  initialBoxQuantities: [BoxQuantityInput!]
}

input UpdateComponentInput {
  id: ID!
  name: String
  categoryId: ID
  groupName: String
  resourceUrl: String
}

input BoxQuantityInput {
  box: String!
  quantity: Int!
}

type Mutation {
  createComponent(input: CreateComponentInput!): CreateComponentResult!
  updateComponent(input: UpdateComponentInput!): UpdateComponentResult!
  deleteComponent(id: ID!): DeleteComponentResult!
}
```

Initial box quantities at create still produce **ADD_STOCK** logs internally (or batch log — service layer enforces log-only qty changes).

### Categories

```graphql
input CreateCategoryInput {
  name: String!
  lowStockThreshold: Int = 5
}

input UpdateCategoryInput {
  id: ID!
  name: String
  lowStockThreshold: Int
}

type Mutation {
  createCategory(input: CreateCategoryInput!): CreateCategoryResult!
  updateCategory(input: UpdateCategoryInput!): UpdateCategoryResult!
}
```

### Inventory logs — unified mutation

Single entry point for all stock movements:

```graphql
input ApplyInventoryLogInput {
  componentId: ID!
  type: InventoryLogType!
  quantity: Int!                # always positive; direction implied by type
  box: String!                    # destination box; for most types the only box
  fromBox: String                 # required when type = REALLOCATE
  reason: String
  relatedLogId: ID                # required when type = RETURN (USE log id)
}

type ApplyInventoryLogSuccess {
  log: InventoryLog!
  component: Component!         # updated totals + box breakdown
}

type Mutation {
  applyInventoryLog(input: ApplyInventoryLogInput!): ApplyInventoryLogResult!
}
```

**Rules by type:**

| Type | Qty effect | Extra rules |
|------|------------|-------------|
| `ADD_STOCK` | +qty in box | — |
| `USE` | −qty in box | must not go negative |
| `RETURN` | +qty in box | `relatedLogId` required; must reference USE log; return qty ≤ remaining unreturned qty on that USE |
| `LOST` | −qty in box | must not go negative |
| `BURN` | −qty in box | must not go negative |
| `DEFECTIVE` | −qty in box | must not go negative |
| **`REALLOCATE`** | **−qty in `fromBox`, +qty in `box` (toBox)** | **`fromBox` required; total qty unchanged; atomic** |

Frontend "Return" button on a USE log calls:

```graphql
applyInventoryLog(input: {
  componentId: "..."
  type: RETURN
  quantity: 2
  box: "Box 1"
  relatedLogId: "<use-log-id>"
  reason: "Unused for lab"
})
```

---

## Error handling

### Expected business failures → union result types

Mutations that can fail validation return a **union**, not thrown GraphQL errors:

```graphql
enum ErrorCode {
  INSUFFICIENT_STOCK
  INVALID_RETURN_LINK
  RETURN_QTY_EXCEEDED
  DUPLICATE_COMPONENT_NAME
  DUPLICATE_CATEGORY_NAME
  CATEGORY_IN_USE
  NOT_FOUND
  VALIDATION_ERROR
}

type FieldError {
  field: String!
  message: String!
}

type ValidationError {
  code: ErrorCode!
  message: String!
  fieldErrors: [FieldError!]
}

union ApplyInventoryLogResult =
  ApplyInventoryLogSuccess
  | ValidationError

union CreateComponentResult =
  Component
  | ValidationError

# same pattern for updateComponent, deleteComponent, createCategory, etc.
```

Client pattern:

```typescript
if (result.__typename === 'ValidationError') {
  showError(result.message, result.code);
} else {
  updateUI(result.component);
}
```

### Unexpected failures → GraphQL `errors`

Use standard GraphQL `errors` array for:

- Missing or invalid JWT (except public `login` / `register`)
- Internal server errors (500)
- Malformed requests

Include `extensions.code` when helpful (`UNAUTHENTICATED`, `FORBIDDEN`, `INTERNAL`).

**Do not** use GraphQL errors for insufficient stock or bad return links — those belong in the union.

---

## gRPC parity

Proto mirrors GraphQL capabilities. **Frontend uses gRPC for all writes**; GraphQL mutations remain on the server for compatibility.

| GraphQL | gRPC | Status |
|---------|------|--------|
| `register` / `login` | `AuthService.Register`, `Login` | Implemented |
| `createCategory` / `updateCategory` | `CategoryService.CreateCategory`, `UpdateCategory` | Implemented |
| `components(filter, pagination)` | `InventoryService.ListComponents` | Implemented |
| `createComponent` / `updateComponent` | `InventoryService.CreateComponent`, `UpdateComponent` | Implemented |
| `applyInventoryLog(input)` | `InventoryService.ApplyInventoryLog` | Implemented |
| `component(id)` | `GetComponent` | Not yet |
| `deleteComponent` | `DeleteComponent` | Not yet |

- Request messages use the same fields as GraphQL inputs (optional fields use `has_*` flags in proto3).
- Form mutation responses use `oneof` success vs `ValidationErrorMessage` (with `field_errors`).
- Auth errors use gRPC status codes (`INVALID_ARGUMENT`, `UNAUTHENTICATED`).
- Entity IDs are UUID strings in proto (`string id = 1`).
- Browser path: grpc-web → Envoy `:8080` → gRPC `:50051`.

---

## Example operations

### List components with filter, sort, pagination

```graphql
query ListComponents {
  components(
    filter: {
      search: "DHT"
      categoryId: "550e8400-e29b-41d4-a716-446655440000"
      box: "Box 2"
      sort: { field: NAME, direction: ASC }
    }
    pagination: { limit: 20, offset: 0 }
  ) {
    totalCount
    items {
      id
      name
      totalQty
      categoryName
    }
  }
}
```

### Apply inventory log

```graphql
mutation UseParts {
  applyInventoryLog(input: {
    componentId: "550e8400-e29b-41d4-a716-446655440001"
    type: USE
    quantity: 3
    box: "Box 1"
    reason: "IoT assignment"
  }) {
    ... on ApplyInventoryLogSuccess {
      log { id type quantity box createdAt }
      component { id totalQty boxQuantities { box quantity } }
    }
    ... on ValidationError {
      code
      message
    }
  }
}
```

---

## Related docs

- Product rules: [`../features/`](../features/)
- Backend stack: [`architecture.md`](./architecture.md)
- Frontend client usage: [`../frontend/architecture.md`](../frontend/architecture.md)
