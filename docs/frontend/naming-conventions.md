# Frontend Naming Conventions

File and folder naming for the Next.js app under `frontend/src/`. Shared paths carry over to the Vite production SPA.

## General rules

| Rule | Convention | Example |
|------|------------|---------|
| Route folders | `kebab-case` | `(app)/components/[id]/page.tsx` |
| React components | `PascalCase` filename | `ComponentListPage.tsx` |
| Hooks | `camelCase`, `use` prefix | `useAuth.ts`, `useGraphQuery.ts` |
| React Query domain hooks | `use{Domain}Query.ts` / `use{Domain}Mutation.ts` | `useAuthQuery.ts` |
| GraphQL documents | domain noun, camelCase | `lib/graphql/documents/components.ts` |
| Zod / form schemas | domain noun | `schema/component.ts` |
| Column defs | `{entity}Columns.tsx` | `componentsColumns.tsx` |

**Not** kebab-case for hooks — use `useAuth.ts`, not `use-auth.ts`.

---

## `components/` naming

| Subfolder | Contents | Extension |
|-----------|----------|-----------|
| `ui/` | shadcn primitives | `.tsx` — match shadcn CLI output |
| `includes/` | Reused composed widgets | `.tsx` — `DataTable.tsx`, `FormGenerator.tsx` |
| `modules/{feature}/` | Page-level UI | `.tsx` — `{Feature}Page.tsx` |

- File name = default export name
- shadcn files: do not rename CLI output casually (updates via `npx shadcn@latest add`)

---

## `schema/` naming

| File | Contains |
|------|----------|
| `auth.ts` | `loginSchema`, `registerSchema`, `loginFields: FormFieldDef[]` |
| `component.ts` | `createComponentSchema`, field defs |
| `category.ts` | `createCategorySchema`, field defs |
| `inventoryLog.ts` | log form schemas per `InventoryLogType` |

---

## `react-query/` naming

```
react-query/
  queries/
    useAuthQuery.ts
    useComponentsQuery.ts
  mutations/
    useAuthMutation.ts
    useComponentsMutation.ts
    useInventoryLogMutation.ts
```

One file per domain per operation kind. All use base hooks from `hooks/graphql/`.

---

## `DataTable/columns/` naming

| File | Entity |
|------|--------|
| `componentsColumns.tsx` | Component list |
| `categoriesColumns.tsx` | Category list |

Export: `{entity}Columns` constant (e.g. `componentsColumns`).

---

## App Router pages

- **`page.tsx`** stays thin — delegate to `components/modules/`
- Dynamic segments: `[id]` for UUID routes
- Route groups use parentheses only: `(public)`, `(auth)`, `(app)` — not in URL

---

## Import aliases

Use `@/` prefix (Next.js default with `src/`):

```typescript
import { DataTable } from "@/components/includes/DataTable/DataTable";
import { useComponentsQuery } from "@/react-query/queries/useComponentsQuery";
import { loginSchema } from "@/schema/auth";
```

---

## Related docs

- Full tree: [`folder-structure.md`](./folder-structure.md)
- Architecture: [`architecture.md`](./architecture.md)
