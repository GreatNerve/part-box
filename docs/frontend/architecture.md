# Frontend Architecture

Technical design for the Next.js app: shadcn/ui, NextAuth v5, TanStack Query, shared DataTable and form components.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (latest), App Router, `src/` directory |
| UI | shadcn/ui — **Vega** preset, **dark default** + light toggle |
| Styling | Tailwind CSS |
| UX quality | ui-ux-pro-max guidelines (accessibility, touch, semantic tokens) |
| Auth | **NextAuth v5 (beta)** — Credentials → gRPC login/register |
| Reads | **graphql-request** + TanStack Query |
| Writes | **grpc-web** + TanStack Query (`useGrpcMutation`) |
| Types | GraphQL Code Generator (queries) + committed proto stubs in `lib/grpc/gen/` |
| Package manager | **pnpm** |
| Forms | **react-hook-form** + **Zod** |
| Tables | **TanStack Table** via shared `DataTable` component |
| Future | Server Actions can call GraphQL with session token (optional v2+) |

Production target remains **Vite SPA** — reuse `src/components`, `src/hooks`, `src/lib`, `src/react-query`; swap routing/auth shell only.

---

## Backend connection

**Reads** use GraphQL. **Writes (mutations)** use gRPC-Web through an Envoy proxy — no Next.js API routes.

```
Browser — queries
   │  POST /graphql
   │  Authorization: Bearer <JWT>
   ▼
backend-api :8000

Browser — mutations (forms, stock actions, auth register)
   │  grpc-web
   ▼
Envoy :8080
   ▼
backend-grpc :50051
```

NextAuth `authorize()` (login) also calls gRPC-Web — server-side it uses `GRPC_WEB_URL` when set (Docker internal network).

```env
NEXT_PUBLIC_GRAPHQL_URL=http://127.0.0.1:8000/graphql
NEXT_PUBLIC_GRPC_WEB_URL=http://127.0.0.1:8080
AUTH_SECRET=...   # NextAuth

# Docker Compose only (Next.js server → Envoy inside the stack)
# GRAPHQL_URL=http://backend-api:8000/graphql
# GRPC_WEB_URL=http://grpc-web:8080
```

CORS on GraphQL must include `http://localhost:3000`. Envoy handles CORS for gRPC-Web. See [`../backend/docker.md`](../backend/docker.md).

---

## Authentication (NextAuth v5 + gRPC JWT)

### Flow

1. User submits login/register on `(public)/(auth)/` pages.
2. **Register** — browser calls gRPC `AuthService.Register` via grpc-web → Envoy.
3. **Login** — NextAuth `authorize()` calls gRPC `AuthService.Login` (same Envoy URL; `GRPC_WEB_URL` in Docker).
4. Backend returns JWT + user.
5. NextAuth stores JWT in session as **`session.accessToken`**.
6. GraphQL queries attach `Authorization: Bearer <accessToken>`.
7. gRPC mutations attach the same token in grpc-web metadata.
8. On auth failure → sign out + redirect to `/login`.

### Route protection

| Layer | Role |
|-------|------|
| **`middleware.ts`** | Blocks `(app)/*` for unauthenticated users |
| **`(app)/layout.tsx`** | Server `auth()` — load session for sidebar (email, etc.) |

Both layers used (defence in depth). Standard NextAuth v5 pattern.

### Server Actions (future)

Server Actions can read `auth()` session and call the same GraphQL client with `accessToken` — no separate auth path needed.

### Vite migration note

Replace NextAuth with a token helper; keep `react-query` + `graphql-request` for reads and grpc-web for writes.

---

## Data fetching

**Do not use Apollo Client** — TanStack Query handles caching.

### Layering

```
lib/graphql/client.ts              getGraphQLClient(token?) — queries only
lib/grpc/clients.ts                grpc-web service clients
lib/grpc/mutations.ts              register, CRUD, applyInventoryLog
hooks/graphql/useGraphQuery.ts     base query hook
hooks/grpc/useGrpcMutation.ts      base mutation hook
react-query/queries/               domain queries (GraphQL)
react-query/mutations/             domain mutations (gRPC)
```

### `useGraphQuery` (reads)

- Attach JWT from session
- GraphQL POST via `graphql-request`
- Map auth/network errors; redirect on failure

### `useGrpcMutation` (writes)

- Attach JWT in grpc-web metadata
- Call proto service clients via Envoy
- Map proto `oneof` validation errors to the same `{ code, message, fieldErrors? }` shape forms already use

Regenerate grpc-web stubs when `backend/proto/` changes:

```bash
pnpm grpc:codegen
```

GraphQL Code Generator — queries only:

Types and operation result types are **generated**, not hand-written.

```bash
# backend must be running on :8000
pnpm graphql:codegen
```

- Config: `codegen.ts` at frontend root
- Output: `src/lib/graphql/generated/` (types + typed document nodes)
- Documents live in `src/lib/graphql/documents/*.ts` — **queries only** (mutations removed from GraphQL client path)
- Re-run codegen when backend GraphQL **query** schema changes
- **Zod schemas** in `src/schema/` stay hand-written for forms only

Example pattern:

```typescript
// react-query/queries/useComponentsQuery.ts
export function useComponentsQuery(filter: ComponentFilterInput) {
  return useGraphQuery({
    queryKey: ["components", filter],
    document: COMPONENTS_QUERY,
    variables: { filter },
  });
}
```

---

## UI system (shadcn + shared components)

Follow shadcn skill rules: semantic colors, `FieldGroup`/`Field`, no `space-y-*`, `cn()`, etc.

**`components/ui/` is CLI-generated.** Do not patch Button, Dialog, etc. by hand — run `pnpm dlx shadcn@latest add <component>` and wrap or extend in `components/includes/` or `components/modules/` instead.

Apply **ui-ux-pro-max** for contrast, touch targets, loading states, and form feedback.

### Shared composed components (`components/includes/`)

| Component | Purpose |
|-----------|---------|
| **FormGenerator** | Renders fields from schema array + Zod validation |
| **DialogForm** | shadcn `Dialog` + FormGenerator for create/edit flows |
| **DataTable** | TanStack Table wrapper — desktop table, **mobile cards** |

All feature pages use these for **consistent UI**.

### FormGenerator schema

Field definitions (also storable in `src/schema/`):

```typescript
type FormFieldDef = {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "select" | "textarea" | "url";
  placeholder?: string;
  options?: { label: string; value: string }[];  // select
};

// Usage
const fields: FormFieldDef[] = [
  { name: "email", label: "Email", type: "email", placeholder: "Enter your email" },
];
```

- Validation: **Zod** schema (hand-written or derived from fields)
- Rendering: **react-hook-form** + shadcn `Field` / `FieldGroup`
- Errors: union `ValidationError` from API mapped to field-level messages

### DataTable

- Built on **TanStack Table**
- Column definitions live in `components/includes/DataTable/columns/` (one file per entity)
- **Desktop:** full table
- **Mobile:** card list — **same column defs**, driven by `column.meta`:

```typescript
{
  accessorKey: "name",
  header: "Name",
  meta: { cardPriority: 1, cardLabel: "Component" },
}
```

Columns with `meta.hideOnMobile: true` omitted from cards. One source of truth — no duplicate card config.

---

## App shell

- **shadcn Sidebar** in `(app)/layout.tsx`
- Nav: **Components**, **Activity**, **Settings** (Categories moved into Settings)
- Mobile: sidebar collapses to **Sheet**
- Theme toggle in Settings header or sidebar (Vega dark default)

---

## Route groups (v1.1 screens)

```
src/app/
  (public)/
    (auth)/
      login/page.tsx
      register/page.tsx
  (app)/
    layout.tsx          ← Sidebar + session
    components/
      page.tsx          ← list grouped by groupName (DataTable)
      [id]/page.tsx     ← detail + logs + reallocate
    activity/
      page.tsx          ← central inventoryLogs table
    settings/
      page.tsx          ← profile, theme, categories CRUD
```

### v1.1 screen scope

| Screen | Features |
|--------|----------|
| **Login / Register** | Credentials → NextAuth session |
| **Components** | Grouped list, category low-stock badges, detail, create/edit, logs, **reallocate** |
| **Activity** | All logs (`inventoryLogs`), filters, links to components |
| **Settings** | Profile, theme, **Categories** (list/create/edit threshold), logout |

**Removed:** top-level `/categories` route.

---

## Screens → API mapping

| Screen | Reads (GraphQL) | Writes (gRPC) |
|--------|-----------------|---------------|
| Login / register | — | `AuthService.Login`, `AuthService.Register` |
| Component list | `components(filter, pagination)` | `InventoryService.CreateComponent` |
| Component detail | `component(id)`, `componentLogs(...)` | `UpdateComponent`, `ApplyInventoryLog` |
| Activity log | `inventoryLogs(filter, pagination)` | — |
| Categories (Settings) | `categories` | `CategoryService.CreateCategory`, `UpdateCategory` |
| Me / settings | `me` | — |

GraphQL mutations remain on the backend for compatibility; the frontend uses gRPC for all writes.

### `applyInventoryLog` types

| UI action | `type` |
|-----------|--------|
| Add stock | `ADD_STOCK` |
| Use | `USE` |
| Return | `RETURN` (+ `relatedLogId`) |
| Lost / burn / defective | `LOST`, `BURN`, `DEFECTIVE` |
| **Move between boxes** | **`REALLOCATE`** (`fromBox` + `box`) |

### UI polish (v1.1)

| Item | Rule |
|------|------|
| Stat cards | Compact padding (`p-4`), no oversized empty cards |
| DataTable rows | `border-b`, hover bg, aligned columns — must read as table rows |
| Resource link | Label **Resource link**; external URL only |
| Low stock | Use `lowStockThreshold` from category / component field |

Handle union responses — `ApplyInventoryLogSuccess` vs `ValidationError`. See [`../backend/api-design.md`](../backend/api-design.md).

---

## Decisions summary

| # | Topic | Decision |
|---|-------|----------|
| 1 | Auth | NextAuth v5 → gRPC login; JWT in `session.accessToken` |
| 2 | Reads | `graphql-request` + TanStack Query; `useGraphQuery` |
| 3 | Writes | grpc-web + TanStack Query; `useGrpcMutation`; Envoy `:8080` |
| 4 | Forms | Zod + react-hook-form; FormGenerator schema array |
| 5 | Layout | shadcn Sidebar (+ mobile Sheet) |
| 6 | Routes | `(public)/(auth)/` + `(app)/` groups |
| 7 | Theme | shadcn Vega, dark default |
| 8 | DataTable mobile | Column `meta` drives cards (single column file) |
| 9 | Folders | `src/` tree — see [`folder-structure.md`](./folder-structure.md) |
| 10 | Protection | Middleware + `(app)/layout` session check |
| 11 | v1.1 scope | Auth, Components, **Activity**, Settings (+ categories) |
| 12 | Package manager | pnpm |
| 13 | GraphQL types | Codegen for queries → `src/lib/graphql/generated/` |
| 14 | gRPC stubs | Committed under `src/lib/grpc/gen/`; regen via `pnpm grpc:codegen` |
| 15 | Low stock | Per-category threshold (not global 5) |
| Grouping | **Deferred** — flat component list for now |
| 16 | Categories UI | Settings tab only |

---

## Related docs

- Folder layout: [`folder-structure.md`](./folder-structure.md)
- Naming: [`naming-conventions.md`](./naming-conventions.md)
- API schema: [`../backend/api-design.md`](../backend/api-design.md)
- Product rules: [`../features/`](../features/)
