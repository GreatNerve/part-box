# Frontend Architecture

Technical design for the Next.js app: shadcn/ui, NextAuth v5, TanStack Query, shared DataTable and form components.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (latest), App Router, `src/` directory |
| UI | shadcn/ui — **Vega** preset, **dark default** + light toggle |
| Styling | Tailwind CSS |
| UX quality | ui-ux-pro-max guidelines (accessibility, touch, semantic tokens) |
| Auth | **NextAuth v5 (beta)** — Credentials provider |
| API | **graphql-request** + **TanStack Query** (not Apollo) |
| Types | **GraphQL Code Generator** → `src/lib/graphql/generated/` |
| Package manager | **pnpm** |
| Forms | **react-hook-form** + **Zod** |
| Tables | **TanStack Table** via shared `DataTable` component |
| Future | Server Actions can call GraphQL with session token (optional v2+) |

Production target remains **Vite SPA** — reuse `src/components`, `src/hooks`, `src/lib`, `src/react-query`; swap routing/auth shell only.

---

## Backend connection

Browsers do **not** call gRPC. All data goes to GraphQL on the Python API.

```
Browser
   │  POST /graphql
   │  Authorization: Bearer <JWT>
   ▼
backend-api :8000
```

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
AUTH_SECRET=...   # NextAuth
```

CORS must include `http://localhost:3000`. See [`../backend/docker.md`](../backend/docker.md).

---

## Authentication (NextAuth v5 + GraphQL JWT)

### Flow

1. User submits login/register on `(public)/(auth)/` pages.
2. **Credentials provider** `authorize()` calls GraphQL `login` / `register`.
3. Backend returns JWT + user.
4. NextAuth stores JWT in session as **`session.accessToken`** (via JWT/session callbacks).
5. Client hooks attach `Authorization: Bearer <accessToken>` on every GraphQL request.
6. On `UNAUTHENTICATED` / invalid token → sign out + redirect to `/login`.

### Route protection

| Layer | Role |
|-------|------|
| **`middleware.ts`** | Blocks `(app)/*` for unauthenticated users |
| **`(app)/layout.tsx`** | Server `auth()` — load session for sidebar (email, etc.) |

Both layers used (defence in depth). Standard NextAuth v5 pattern.

### Server Actions (future)

Server Actions can read `auth()` session and call the same GraphQL client with `accessToken` — no separate auth path needed.

### Vite migration note

Replace NextAuth with a token helper; keep `react-query` + `graphql-request` unchanged.

---

## Data fetching (TanStack Query + graphql-request)

**Do not use Apollo Client** — TanStack Query already provides caching (`queryKey`, `staleTime`, `gcTime`).

### Layering

```
lib/graphql/client.ts              getGraphQLClient(token?)
hooks/graphql/useGraphQuery.ts     base query hook
hooks/graphql/useGraphMutation.ts  base mutation hook
react-query/queries/useAuthQuery.ts     domain queries
react-query/mutations/useAuthMutation.ts domain mutations
```

### `useGraphQuery` / `useGraphMutation` (shared)

Single place for:

- Attach JWT from session
- GraphQL POST via `graphql-request`
- Map GraphQL union errors vs network errors
- Redirect on auth failure
- Consistent loading/error types

Domain files (`useAuthQuery.ts`, `useComponentsQuery.ts`, etc.) call the base hooks — **no repeated boilerplate**.

### GraphQL Code Generator

Types and operation result types are **generated**, not hand-written.

```bash
# backend must be running on :8000
pnpm graphql:codegen
```

- Config: `codegen.ts` at frontend root
- Output: `src/lib/graphql/generated/` (types + typed document nodes)
- Documents live in `src/lib/graphql/documents/*.ts`
- Re-run codegen when backend GraphQL schema changes
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

## Screens → GraphQL mapping

| Screen | GraphQL |
|--------|---------|
| Login / register | `login`, `register` |
| Component list | `components(filter, pagination)` — group client-side by `groupName` |
| Component detail | `component(id)`, `componentLogs(...)` |
| CRUD component | `createComponent`, `updateComponent`, `deleteComponent` |
| Stock actions | `applyInventoryLog` (incl. `REALLOCATE`) |
| **Activity log** | **`inventoryLogs(filter, pagination)`** |
| Categories (Settings) | `categories`, `createCategory`, **`updateCategory`** |
| Me / settings | `me` query |

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
| 1 | Auth | NextAuth v5 Credentials → GraphQL JWT in `session.accessToken` |
| 2 | GraphQL + cache | `graphql-request` + TanStack Query; base `useGraphQuery` / `useGraphMutation` |
| 3 | Forms | Zod + react-hook-form; FormGenerator schema array |
| 4 | Layout | shadcn Sidebar (+ mobile Sheet) |
| 5 | Routes | `(public)/(auth)/` + `(app)/` groups |
| 6 | Theme | shadcn Vega, dark default |
| 7 | DataTable mobile | Column `meta` drives cards (single column file) |
| 8 | Folders | `src/` tree — see [`folder-structure.md`](./folder-structure.md) |
| 9 | Protection | Middleware + `(app)/layout` session check |
| 10 | v1.1 scope | Auth, Components, **Activity**, Settings (+ categories) |
| 11 | Package manager | pnpm |
| 12 | GraphQL types | GraphQL Code Generator → `src/lib/graphql/generated/` |
| 13 | Low stock | Per-category threshold (not global 5) |
| Grouping | **Deferred** — flat component list for now |
| 15 | Categories UI | Settings tab only |

---

## Related docs

- Folder layout: [`folder-structure.md`](./folder-structure.md)
- Naming: [`naming-conventions.md`](./naming-conventions.md)
- API schema: [`../backend/api-design.md`](../backend/api-design.md)
- Product rules: [`../features/`](../features/)
