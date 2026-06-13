# Frontend Naming Conventions

Folder and file naming rules for the Next.js dev app. Shared `components/`, `hooks/`, and `lib/` carry over to the Vite production SPA.

## General rules

| Rule | Convention |
|------|------------|
| Route segments (App Router) | `kebab-case` folders | `app/components/[id]/page.tsx` |
| React components | `PascalCase` filename | `ComponentList.tsx` |
| Hooks | `camelCase` filename, `use` prefix | `useAuth.ts` |
| Non-UI utilities | `camelCase` or domain name | `lib/graphql/client.ts` |
| GraphQL documents | `camelCase` or domain noun | `lib/graphql/queries/components.ts` |

## Folder layout

```
frontend/
├── README.md
├── app/                          # Next.js App Router — routes only, thin pages
│   ├── layout.tsx
│   ├── page.tsx                  # dashboard / redirect
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── components/
│       ├── page.tsx              # list
│       └── [id]/
│           └── page.tsx          # detail
├── components/                   # shared UI — PascalCase files
│   ├── ComponentList.tsx
│   ├── ComponentDetail.tsx
│   ├── InventoryLogForm.tsx
│   └── ui/                       # generic primitives (optional)
│       └── Button.tsx
├── hooks/                        # camelCase files
│   ├── useAuth.ts
│   ├── useComponents.ts
│   └── useInventoryLog.ts
├── lib/
│   ├── graphql/
│   │   ├── client.ts
│   │   ├── queries/
│   │   │   ├── components.ts
│   │   │   └── categories.ts
│   │   └── mutations/
│   │       ├── auth.ts
│   │       ├── components.ts
│   │       └── inventoryLog.ts
│   └── auth/
│       └── tokenStorage.ts
├── package.json
└── ...
```

## App Router (`app/`)

- **Pages stay thin** — import from `components/` and `hooks/`; minimal logic in `page.tsx`.
- **Route folders** use `kebab-case`: `app/inventory-logs/` not `app/InventoryLogs/`.
- **Dynamic segments**: `[id]`, `[componentId]` — camelCase inside brackets is fine.

## Components (`components/`)

| Rule | Example |
|------|---------|
| File name = default export name | `ComponentList.tsx` → `export function ComponentList` |
| One main component per file | Split large files when a screen grows |
| Co-locate small helpers | `ComponentList.utils.ts` next to `ComponentList.tsx` if needed |
| Shared primitives | `components/ui/Button.tsx` |

## Hooks (`hooks/`)

| Rule | Example |
|------|---------|
| File name camelCase with `use` prefix | `useAuth.ts`, `useComponents.ts` |
| One hook per file (primary) | `useAuth.ts` exports `useAuth` |
| Hook returns typed object | `{ user, login, logout, loading, error }` |

**Not** kebab-case (`use-auth.ts`) — use **`useAuth.ts`**.

## GraphQL client (`lib/graphql/`)

| Path | Contents |
|------|----------|
| `client.ts` | GraphQL HTTP client, auth header injection |
| `queries/*.ts` | Query strings + typed helpers |
| `mutations/*.ts` | Mutation strings + typed helpers |

File names by domain: `components.ts`, `inventoryLog.ts`, `auth.ts`.

Operation names match backend API (camelCase): `applyInventoryLog`, `components`.

## Vite migration

When moving to Vite, reuse unchanged:

- `components/`
- `hooks/`
- `lib/`

Replace only the routing shell (`app/` → Vite router config + page components).

## Environment variables

| Framework | Prefix | Example |
|-----------|--------|---------|
| Next.js (dev) | `NEXT_PUBLIC_` | `NEXT_PUBLIC_GRAPHQL_URL` |
| Vite (prod) | `VITE_` | `VITE_GRAPHQL_URL` |

Access via thin wrapper in `lib/config.ts` so the key name differs in one place only.

## Related docs

- Architecture and GraphQL usage: [`architecture.md`](./architecture.md)
- API operation names: [`../backend/api-design.md`](../backend/api-design.md)
- Backend file naming: [`../backend/naming-conventions.md`](../backend/naming-conventions.md)
