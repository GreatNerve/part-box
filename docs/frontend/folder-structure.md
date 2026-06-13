# Frontend Folder Structure

Full `src/` layout for the Next.js app. All paths relative to `frontend/`.

## Tree

```
frontend/
├── README.md
├── components.json              # shadcn config (Vega preset)
├── package.json
├── next.config.ts
├── tsconfig.json
├── middleware.ts                # NextAuth — protect (app)/*
├── .env.local                   # not committed
└── src/
    ├── app/
    │   ├── layout.tsx           # root: providers, theme, fonts
    │   ├── page.tsx             # redirect → /components or /login
    │   ├── (public)/
    │   │   ├── layout.tsx       # centered auth layout (no sidebar)
    │   │   └── (auth)/
    │   │       ├── login/
    │   │       │   └── page.tsx
    │   │       └── register/
    │   │           └── page.tsx
    │   └── (app)/
    │       ├── layout.tsx       # Sidebar shell + session
    │       ├── components/
    │       │   ├── page.tsx
    │       │   └── [id]/
    │       │       └── page.tsx
    │       ├── activity/              # v1.1 — central logs
    │       │   └── page.tsx
    │       └── settings/
    │           └── page.tsx           # includes Categories section
    │
    ├── auth/
    │   ├── auth.ts              # NextAuth exports (auth, signIn, signOut)
    │   └── auth.config.ts       # providers, callbacks, pages config
    │
    ├── components/
    │   ├── ui/                  # shadcn primitives ONLY (Button, Dialog, …)
    │   ├── includes/            # reused composed widgets (multi-page)
    │   │   ├── DataTable/
    │   │   │   ├── DataTable.tsx
    │   │   │   ├── DataTableCard.tsx
    │   │   │   └── columns/
    │   │   │       ├── componentsColumns.tsx
    │   │   │       └── categoriesColumns.tsx
    │   │   ├── DialogForm/
    │   │   │   └── DialogForm.tsx
    │   │   └── FormGenerator/
    │   │       ├── FormGenerator.tsx
    │   │       └── fieldTypes.ts
    │   └── modules/             # feature-specific UI (single page/flow)
    │       ├── components/
    │       │   ├── ComponentListPage.tsx
    │       │   └── ComponentDetailPage.tsx
    │       ├── categories/
    │       │   └── CategoriesPage.tsx
    │       └── settings/
    │           └── SettingsPage.tsx
    │
    ├── schema/
    │   ├── auth.ts              # login/register zod + form field defs
    │   ├── component.ts
    │   ├── category.ts
    │   └── inventoryLog.ts
    │
    ├── lib/
    │   ├── graphql/
    │   │   ├── client.ts
    │   │   ├── generated/       # GraphQL Codegen output — do not edit
    │   │   ├── documents/
    │   │   │   ├── auth.ts
    │   │   │   ├── components.ts
    │   │   │   └── categories.ts
    │   │   └── errors.ts        # parse ValidationError unions
    │   ├── config.ts            # env helpers (GRAPHQL_URL)
    │   └── utils.ts             # cn() — shadcn
    │
    ├── hooks/
    │   ├── useAuth.ts           # session helpers (client)
    │   ├── useMediaQuery.ts     # mobile breakpoint for DataTable
    │   └── graphql/
    │       ├── useGraphQuery.ts
    │       └── useGraphMutation.ts
    │
    └── react-query/
        ├── provider.tsx         # QueryClientProvider
        ├── queries/
        │   ├── useAuthQuery.ts
        │   ├── useComponentsQuery.ts
        │   └── useCategoriesQuery.ts
        └── mutations/
            ├── useAuthMutation.ts
            ├── useComponentsMutation.ts
            ├── useCategoriesMutation.ts
            └── useInventoryLogMutation.ts
```

---

## Folder rules

| Path | Put here | Do not put here |
|------|----------|-----------------|
| `components/ui/` | shadcn CLI output — **do not hand-edit** | business logic, GraphQL |
| `components/includes/` | DataTable, DialogForm, FormGenerator — **used 2+ times** | page-only markup |
| `components/modules/` | Page-level compositions | generic primitives |
| `schema/` | Zod schemas + `FormFieldDef[]` arrays | React components |
| `auth/` | NextAuth config only | UI components |
| `react-query/` | Domain query/mutation hooks | base GraphQL wiring (→ `hooks/graphql/`) |
| `app/**/page.tsx` | Thin route entry — import from `modules/` | heavy logic |

---

## Route groups explained

### `(public)/(auth)/`

- No sidebar
- Login + register only
- Redirect to `(app)/components` if already authenticated

### `(app)/`

- Requires session (middleware + layout)
- Sidebar navigation
- All inventory features

---

## DataTable columns convention

File: `components/includes/DataTable/columns/componentsColumns.tsx`

```typescript
export const componentsColumns: ColumnDef<ComponentRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
    meta: { cardPriority: 1 },
  },
  {
    accessorKey: "totalQty",
    header: "Qty",
    meta: { cardPriority: 2, cardLabel: "Total" },
  },
  {
    id: "actions",
    meta: { hideOnMobile: true },
  },
];
```

`DataTable` reads `meta` for mobile card rendering — **no second config file**.

---

## Providers (root layout)

Wrap in `src/app/layout.tsx`:

1. `ThemeProvider` (dark default, Vega tokens)
2. `SessionProvider` (NextAuth client)
3. `QueryClientProvider` (`react-query/provider.tsx`)
4. `Toaster` (sonner)

---

## Environment variables

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
AUTH_SECRET=generate-with-openssl
AUTH_TRUST_HOST=true
```

---

## Vite migration

Copy unchanged:

- `src/components/`
- `src/hooks/`
- `src/lib/`
- `src/react-query/`
- `src/schema/`

Replace:

- `src/app/` → Vite router
- `src/auth/` → token storage + route guards
- `middleware.ts` → client-side auth check

---

## Related docs

- Architecture decisions: [`architecture.md`](./architecture.md)
- File naming: [`naming-conventions.md`](./naming-conventions.md)
