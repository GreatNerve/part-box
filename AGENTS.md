# AGENTS — Parts Desk

Workflow. Domain: [CONTEXT.md](./CONTEXT.md). Detail: `docs/`.

## Before code
1. CONTEXT.md
2. graphify first (`.cursor/rules/graphify.mdc`): `graphify query "…"` → Read/Grep targets only
3. `docs/features/` + `docs/backend/api-design.md` | `docs/frontend/architecture.md`

## Tokens
graphify → fewer files read. Replies: **caveman** — terse, drop filler/articles; keep technical terms + code exact. User `/caveman` or caveman skill attached → use both graphify + caveman every response until "stop caveman" | "normal mode".

## Layout
| Path | Role |
|------|------|
| `backend/app/{models,services,api/graphql}/` | ORM→svc→GraphQL |
| `frontend/src/{app,components/modules,components/includes,lib/graphql/documents}/` | routes→pages→UI→ops |
| `docs/features/` | product what |
| `docs/{backend,frontend}/` | tech how |
| `graphify-out/` | gen map; query only |

## Rules
**BE:** UUID; GQL camelCase / Py snake_case; stock via inventory log svc only; validation=`ValidationErrorType`; mig=`aerich migrate`+`upgrade` — never edit `migrations/`

**FE:** pnpm; JWT=`session.accessToken`; shadcn `render={<Link />}` not `asChild`; never edit `components/ui/`; no `.env.local` commits; `useTheme` UI → `useMounted()` first (SSR mismatch)

**Gen (never edit):** `migrations/`, `components/ui/`, `grpc/gen/`, `graphify-out/*` — regen: Aerich / shadcn / protoc / `/graphify --update`

**Git:** commit/push/amend when user asks

## Cmds
```bash
docker compose -f docker/docker-compose.db.yml up -d
cd backend && uv run aerich migrate --name <desc> && uv run aerich upgrade && uv run inventory-api
cd backend && uv run pytest tests/integration/test_full_user_flow.py -v
cd frontend && pnpm dev && pnpm build
graphify query "…"   # /graphify --update after big changes
```

## Ambiguous product
1 Q → recommend → record CONTEXT.md + `docs/features/`
