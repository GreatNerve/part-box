# Graph Report - RPC_Test  (2026-06-14)

## Corpus Check
- 144 files · ~34,401 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1108 nodes · 2721 edges · 90 communities (72 shown, 18 thin omitted)
- Extraction: 69% EXTRACTED · 31% INFERRED · 0% AMBIGUOUS · INFERRED: 850 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `50cc4df6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_ApplyInventoryLogResult|ApplyInventoryLogResult]]
- [[_COMMUNITY_Backend README|Backend README]]
- [[_COMMUNITY_package json|package json]]
- [[_COMMUNITY_AppLayout|AppLayout]]
- [[_COMMUNITY_GraphQLContext|GraphQLContext]]
- [[_COMMUNITY_ComponentFilterInput|ComponentFilterInput]]
- [[_COMMUNITY_main py|main py]]
- [[_COMMUNITY_BoxSuggestionPicker tsx|BoxSuggestionPicker tsx]]
- [[_COMMUNITY_cn|cn]]
- [[_COMMUNITY_FormGenerator tsx|FormGenerator tsx]]
- [[_COMMUNITY_Category|Category]]
- [[_COMMUNITY_ApplyInventoryLogInput|ApplyInventoryLogInput]]
- [[_COMMUNITY_CategoriesPage tsx|CategoriesPage tsx]]
- [[_COMMUNITY_ComponentDetailPage tsx|ComponentDetailPage tsx]]
- [[_COMMUNITY_index ts|index ts]]
- [[_COMMUNITY_LoginForm tsx|LoginForm tsx]]
- [[_COMMUNITY_DataTable tsx|DataTable tsx]]
- [[_COMMUNITY_components json|components json]]
- [[_COMMUNITY_auth ts|auth ts]]
- [[_COMMUNITY_tsconfig json|tsconfig json]]
- [[_COMMUNITY_geistMono|geistMono]]
- [[_COMMUNITY_useMeQuery|useMeQuery]]
- [[_COMMUNITY_sheet tsx|sheet tsx]]
- [[_COMMUNITY___init__ py|__init__ py]]
- [[_COMMUNITY_BaseSettings|BaseSettings]]
- [[_COMMUNITY_User account|User account]]
- [[_COMMUNITY_AsyncClient|AsyncClient]]
- [[_COMMUNITY_BaseDBAsyncClient|BaseDBAsyncClient]]
- [[_COMMUNITY_BaseDBAsyncClient|BaseDBAsyncClient]]
- [[_COMMUNITY_next-auth d ts|next-auth d ts]]
- [[_COMMUNITY_Inventory log types|Inventory log types]]
- [[_COMMUNITY_DataTable shared component|DataTable shared component]]
- [[_COMMUNITY_GraphQL Code Generator|GraphQL Code Generator]]
- [[_COMMUNITY_Next js Logo Wordmark|Next js Logo Wordmark]]
- [[_COMMUNITY___init__ py|__init__ py]]
- [[_COMMUNITY_generate_proto sh script|generate_proto sh script]]
- [[_COMMUNITY_Route groups publicauthapp|Route groups public/auth/app]]
- [[_COMMUNITY_shadcnui Vega preset|shadcn/ui Vega preset]]
- [[_COMMUNITY_codegen ts|codegen ts]]
- [[_COMMUNITY_eslint config mjs|eslint config mjs]]
- [[_COMMUNITY_next config ts|next config ts]]
- [[_COMMUNITY_postcss config mjs|postcss config mjs]]
- [[_COMMUNITY___init__ py|__init__ py]]
- [[_COMMUNITY_Document file icon with|Document file icon with]]
- [[_COMMUNITY_Globe Icon|Globe Icon]]
- [[_COMMUNITY_AI Agent Workflow Instructions|AI Agent Workflow Instructions]]
- [[_COMMUNITY_Feature Component Groups|Feature: Component Groups]]
- [[_COMMUNITY_Out of Scope —|Out of Scope —]]
- [[_COMMUNITY_Feature Search and Filter|Feature: Search and Filter]]
- [[_COMMUNITY_Feature User Accounts|Feature: User Accounts]]
- [[_COMMUNITY_Vite SPA production target|Vite SPA production target]]
- [[_COMMUNITY_PascalCase React component files|PascalCase React component files]]
- [[_COMMUNITY_{ GET, POST }|{ GET, POST }]]
- [[_COMMUNITY_Vercel Triangle Logo|Vercel Triangle Logo]]
- [[_COMMUNITY_Window Icon|Window Icon]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 143 edges
2. `ValidationErrorDTO` - 73 edges
3. `GraphQLContext` - 64 edges
4. `ValidationErrorType` - 56 edges
5. `FieldErrorType` - 46 edges
6. `PaginationInput` - 35 edges
7. `ApplyInventoryLogInput` - 30 edges
8. `ComponentType` - 27 edges
9. `ComponentSortField` - 27 edges
10. `SortDirection` - 27 edges

## Surprising Connections (you probably didn't know these)
- `Layered Monolith Layout` --semantically_similar_to--> `app/services Business Logic Layer`  [EXTRACTED] [semantically similar]
  backend/README.md → docs/backend/architecture.md
- `Component Grouping` --conceptually_related_to--> `Component`  [AMBIGUOUS]
  docs/backend/v1.1-changes.md → CONTEXT.md
- `datasheetUrl / resourceUrl Field` --semantically_similar_to--> `Resource Link`  [EXTRACTED] [semantically similar]
  docs/backend/api-design.md → CONTEXT.md
- `ValidationError Union Type` --rationale_for--> `GraphQL API`  [EXTRACTED]
  docs/backend/api-design.md → CONTEXT.md
- `Backend` --conceptually_related_to--> `GraphQL API`  [EXTRACTED]
  backend/README.md → CONTEXT.md

## Import Cycles
- 1-file cycle: `backend/app/api/main.py -> backend/app/api/main.py`
- 1-file cycle: `backend/app/core/auth.py -> backend/app/core/auth.py`
- 1-file cycle: `backend/app/services/category.py -> backend/app/services/category.py`
- 1-file cycle: `backend/app/services/component.py -> backend/app/services/component.py`
- 1-file cycle: `backend/app/services/inventory_log.py -> backend/app/services/inventory_log.py`

## Hyperedges (group relationships)
- **v1.1 inventory domain model** — features_components_component, features_categories_category, features_storage_locations_component_box_quantity, features_inventory_logs_inventory_log, features_user_accounts_per_user_isolation [INFERRED 0.85]
- **Shared frontend UI composition stack** — frontend_architecture_shadcn_vega, frontend_architecture_data_table, frontend_architecture_form_generator, frontend_folder_structure_components_includes, frontend_folder_structure_components_modules [EXTRACTED 1.00]
- **Stock reallocation flow** — features_storage_locations_stock_reallocation, features_inventory_logs_reallocate, features_storage_locations_component_box_quantity [EXTRACTED 1.00]
- **Next.js Logo Composition** — public_next_nextjs_logo, public_next_triangle_mark, public_next_wordmark_typography [EXTRACTED 1.00]

## Communities (90 total, 18 thin omitted)

### Community 0 - "ApplyInventoryLogResult"
Cohesion: 0.08
Nodes (95): ApplyInventoryLogResult, ApplyInventoryLogSuccess, AuthPayload, AuthTokenDTO, GraphQLContext, Info, ValidationErrorDTO, ValidationErrorType (+87 more)

### Community 1 - "Backend README"
Cohesion: 0.21
Nodes (23): Layered Monolith Layout, Aerich Migrations, FastAPI, GraphQL API, gRPC Service Contract, JWT Bearer Authentication, Stock Changes Only Via Inventory Log Service, Next.js App Router Frontend (+15 more)

### Community 2 - "package json"
Cohesion: 0.05
Nodes (42): dependencies, @base-ui/react, class-variance-authority, clsx, graphql, graphql-request, @hookform/resolvers, lucide-react (+34 more)

### Community 3 - "AppLayout"
Cohesion: 0.07
Nodes (40): useIsMobile(), AppSidebar(), navItems, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader() (+32 more)

### Community 4 - "GraphQLContext"
Cohesion: 0.09
Nodes (21): `app/api/graphql/` — Strawberry, `app/core/`, `app/grpc/` — gRPC servicers, `app/models/` — Tortoise ORM, `app/schemas/` — DTOs, `app/services/` — Business logic, Authentication, Backend Architecture (+13 more)

### Community 5 - "ComponentFilterInput"
Cohesion: 0.13
Nodes (77): ApplyInventoryLogInput, ApplyInventoryLogSuccessDTO, ComponentFilterInput, GraphQLContext, ID, Info, InventoryLogFilterInput, ComponentFilterInput (+69 more)

### Community 6 - "main py"
Cohesion: 0.08
Nodes (23): lifespan(), client(), test_health(), UUID, AsyncClient, create_access_token(), decode_access_token(), extract_bearer_token() (+15 more)

### Community 7 - "BoxSuggestionPicker tsx"
Cohesion: 0.10
Nodes (36): BoxSuggestion, BoxSuggestionPicker(), BoxSuggestionPickerProps, InventoryLogDialog(), InventoryLogDialogProps, logTypeOptions, MoveStockDialog(), MoveStockDialogProps (+28 more)

### Community 8 - "cn"
Cohesion: 0.08
Nodes (32): cn(), AlertAction(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+24 more)

### Community 9 - "FormGenerator tsx"
Cohesion: 0.10
Nodes (19): API Design, Apply inventory log, Auth (public — no JWT required), Categories, Components, Decisions summary, Error handling, Example operations (+11 more)

### Community 10 - "Category"
Cohesion: 0.28
Nodes (9): Component, resourceUrl (Resource link), Central activity log view, Inventory log, Box filter, Component name search, Storage box, ComponentBoxQuantity (+1 more)

### Community 11 - "ApplyInventoryLogInput"
Cohesion: 0.18
Nodes (19): Box (Storage Label), BoxQuantity, Category, Component, ComponentBoxQuantity Model, Component Grouping, datasheetUrl / resourceUrl Field, Low Stock (+11 more)

### Community 12 - "CategoriesPage tsx"
Cohesion: 0.24
Nodes (8): ComponentsPage(), PageHeader(), PageHeaderProps, useCreateComponentMutation(), useCategoriesQuery(), useComponentsQuery(), ComponentFormValues, componentSchema

### Community 13 - "ComponentDetailPage tsx"
Cohesion: 0.10
Nodes (26): ComponentDetailPage(), ComponentDetailPageProps, useGraphMutation(), useGraphQuery(), ComponentDetailRouteProps, getStockLabel(), getStockTone(), StatCard() (+18 more)

### Community 14 - "index ts"
Cohesion: 0.13
Nodes (20): APPLY_INVENTORY_LOG_MUTATION, AuthPayload, BoxQuantity, CATEGORIES_QUERY, Component, COMPONENT_LOGS_QUERY, COMPONENT_QUERY, ComponentConnection (+12 more)

### Community 15 - "LoginForm tsx"
Cohesion: 0.19
Nodes (12): LoginForm(), RegisterForm(), getGraphQLErrorMessage(), ContentPanelProps, Card(), CardAction(), CardContent(), CardDescription() (+4 more)

### Community 16 - "DataTable tsx"
Cohesion: 0.13
Nodes (20): ColumnMeta, DataTableProps, useIsMobile(), useMediaQuery(), Empty(), EmptyContent(), EmptyDescription(), EmptyHeader() (+12 more)

### Community 17 - "components json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 18 - "auth ts"
Cohesion: 0.16
Nodes (10): authorize(), LOGIN_MUTATION, getGraphQLClient(), graphRequest(), RequestFn, isValidationError(), ValidationErrorPayload, UseGraphMutationOptions (+2 more)

### Community 19 - "tsconfig json"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 20 - "geistMono"
Cohesion: 0.18
Nodes (9): geistMono, geistSans, metadata, AppProviders(), useMounted(), ThemeToggle(), ReactQueryProvider(), Toaster() (+1 more)

### Community 21 - "useMeQuery"
Cohesion: 0.27
Nodes (7): PageShell(), useMeQuery(), SettingsPage(), Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 22 - "sheet tsx"
Cohesion: 0.19
Nodes (9): ActivityPage(), logTypeOptions, formatLogTypeLabel(), getLogTypeBadgeVariant(), InventoryLog, ContentPanel(), useInventoryLogsQuery(), Badge() (+1 more)

### Community 23 - "__init__ py"
Cohesion: 0.25
Nodes (7): Category, Component, ComponentBoxQuantity, InventoryLog, InventoryLogType, Meta, User

### Community 24 - "BaseSettings"
Cohesion: 0.33
Nodes (4): BaseSettings, get_settings(), Settings, test_cors_origins_list_parses_csv()

### Community 25 - "User account"
Cohesion: 0.17
Nodes (11): User account, App shell, Backend connection, Decisions summary, Frontend Architecture, NextAuth v5 Credentials, Related docs, Route groups (v1.1 screens) (+3 more)

### Community 26 - "AsyncClient"
Cohesion: 0.60
Nodes (4): AsyncClient, gql(), Full user lifecycle integration test.  Creates a user, exercises GraphQL API,, test_full_user_lifecycle()

### Community 27 - "BaseDBAsyncClient"
Cohesion: 0.67
Nodes (3): BaseDBAsyncClient, downgrade(), upgrade()

### Community 28 - "BaseDBAsyncClient"
Cohesion: 0.67
Nodes (3): BaseDBAsyncClient, downgrade(), upgrade()

### Community 29 - "next-auth d ts"
Cohesion: 0.50
Nodes (3): JWT, Session, User

### Community 30 - "Inventory log types"
Cohesion: 0.11
Nodes (17): Acceptance criteria, Add stock, Behaviors, Feature: Inventory Logs, Log history views, Inventory log types, Log types (v1.1), Lost / burn / defective (+9 more)

### Community 31 - "DataTable shared component"
Cohesion: 0.67
Nodes (3): DataTable shared component, FormGenerator, components/includes/

### Community 32 - "GraphQL Code Generator"
Cohesion: 0.33
Nodes (6): Data fetching (TanStack Query + graphql-request), GraphQL Code Generator, Layering, TanStack Query + graphql-request, `useGraphQuery` / `useGraphMutation` (shared), use{Domain}Query/Mutation hooks

### Community 33 - "Next js Logo Wordmark"
Cohesion: 0.67
Nodes (3): Next.js Logo Wordmark, Next.js Triangle Arrow Mark, NEXT.JS Wordmark Typography

### Community 49 - "Feature: Component Groups"
Cohesion: 0.15
Nodes (12): Acceptance criteria, Box identifier, Constraints, Feature: Storage Locations (Boxes), Out of scope (v1.1), Quantity per box, Requirements, Stock reallocation (v1.1) (+4 more)

### Community 50 - "Out of Scope —"
Cohesion: 0.17
Nodes (11): Backend Naming Conventions, Class naming (illustrative), Do not, Docker / config (repo root), General rules, GraphQL files, Layer layout — one file per domain, Migrations (+3 more)

### Community 51 - "Feature: Search and Filter"
Cohesion: 0.23
Nodes (9): DataTable(), DialogForm(), Category, useCreateCategoryMutation(), useUpdateCategoryMutation(), CategoryFormValues, categorySchema, CategoriesSettingsSection() (+1 more)

### Community 52 - "Feature: User Accounts"
Cohesion: 0.17
Nodes (11): Acceptance criteria, Components list, Create / edit component, Feature: Component Groups, Model (v1.1 — recommended), Out of scope, Rules (`groupName` approach), Settings (+3 more)

### Community 61 - "Community 61"
Cohesion: 0.17
Nodes (11): Acceptance criteria, By box, By category, By component name, Combined behavior, Feature: Search and Filter, Filters, Out of scope (v1) (+3 more)

### Community 62 - "Community 62"
Cohesion: 0.18
Nodes (10): Acceptance criteria, Custom categories, Default categories (v1), Feature: Categories, Filtering, Out of scope (v1.1), Related, Summary (+2 more)

### Community 63 - "Community 63"
Cohesion: 0.20
Nodes (9): Docker Setup, Environment, Files, Full stack, Postgres only (backend dev / tests), Related docs, Services (full stack), Startup order (+1 more)

### Community 64 - "Community 64"
Cohesion: 0.20
Nodes (9): Acceptance criteria, Data source, Feature: Activity Log (Central), Filters (v1.1), Related, Scope, Summary, Table columns (+1 more)

### Community 65 - "Community 65"
Cohesion: 0.20
Nodes (9): Acceptance criteria, Feature: Components, Fields, Low stock display, Out of scope (v1.1), Related, Resource link (renamed from "datasheet"), Summary (+1 more)

### Community 66 - "Community 66"
Cohesion: 0.20
Nodes (9): DataTable columns convention, Environment variables, Folder rules, Frontend Folder Structure, Providers (root layout), Related docs, Tree, Vite migration (+1 more)

### Community 67 - "Community 67"
Cohesion: 0.20
Nodes (9): App Router pages, `components/` naming, `DataTable/columns/` naming, Frontend Naming Conventions, General rules, Import aliases, `react-query/` naming, Related docs (+1 more)

### Community 68 - "Community 68"
Cohesion: 0.20
Nodes (9): 1. Database, 2. Backend, 3. Frontend, Documentation, Parts Desk, Quick start, Repo layout, Stack (summary) (+1 more)

### Community 69 - "Community 69"
Cohesion: 0.47
Nodes (9): Central Activity Log, InventoryLogFilterInput, inventoryLogs Query, Offset Pagination (limit + offset), /activity Route, ValidationError Union Type, API Design Specification, v1.1 Product Changes Summary (+1 more)

### Community 70 - "Community 70"
Cohesion: 0.25
Nodes (9): ADD_STOCK, applyInventoryLog Mutation, BURN, DEFECTIVE, Inventory Log, InventoryLogType Enum, LOST, RETURN (+1 more)

### Community 71 - "Community 71"
Cohesion: 0.22
Nodes (8): Backend, Documentation index, Electronics Inventory Management — Documentation, Frontend, Problem, Product features, Product scope (v1), Repo layout

### Community 72 - "Community 72"
Cohesion: 0.22
Nodes (9): Fields (v1.1), Low stock semantics, lowStockThreshold, ComponentGroup entity, groupName, totalQty, Deferred v1 features, Next.js App Router (+1 more)

### Community 73 - "Community 73"
Cohesion: 0.22
Nodes (8): Acceptance criteria, Feature: User Accounts, Must have (v1), Out of scope (v1), Per-user isolation, Requirements, Summary, User story

### Community 74 - "Community 74"
Cohesion: 0.25
Nodes (7): AGENTS — Parts Desk, Ambiguous product, Before code, Cmds, Layout, Rules, Tokens

### Community 75 - "Community 75"
Cohesion: 0.25
Nodes (7): Backend, Documentation, Frontend contract, Getting started, Project structure, Role, Stack

### Community 76 - "Community 76"
Cohesion: 0.25
Nodes (7): CONTEXT — Parts Desk, Docs, Grill (locked), Log types, Out of scope, Stack (locked), Terms

### Community 77 - "Community 77"
Cohesion: 0.25
Nodes (7): Backend, Documentation, Frontend, Getting started, Project structure (summary), Role, Stack

### Community 78 - "Community 78"
Cohesion: 0.29
Nodes (6): API reference, Features, Grill decisions (locked), Migration notes (backend), Open decisions, v1.1 Product Changes — Summary

### Community 79 - "Community 79"
Cohesion: 0.33
Nodes (3): { handlers, auth, signIn, signOut }, config, proxy

### Community 80 - "Community 80"
Cohesion: 0.40
Nodes (5): Category, Default category list, Settings → Categories, Category filter, Settings screen

### Community 81 - "Community 81"
Cohesion: 0.40
Nodes (5): Behaviors, Create, Delete, Read, Update

### Community 82 - "Community 82"
Cohesion: 0.40
Nodes (5): Authentication (NextAuth v5 + GraphQL JWT), Flow, Route protection, Server Actions (future), Vite migration note

### Community 83 - "Community 83"
Cohesion: 0.50
Nodes (3): Backend Documentation, Docs, Quick reference

### Community 84 - "Community 84"
Cohesion: 0.50
Nodes (3): Docs, Frontend Documentation, Quick reference

### Community 85 - "Community 85"
Cohesion: 0.50
Nodes (4): Add custom category, Behaviors, Delete custom category, Edit category (v1.1)

### Community 86 - "Community 86"
Cohesion: 0.50
Nodes (4): DataTable, FormGenerator schema, Shared composed components (`components/includes/`), UI system (shadcn + shared components)

### Community 87 - "Community 87"
Cohesion: 0.67
Nodes (3): `applyInventoryLog` types, Screens → GraphQL mapping, UI polish (v1.1)

### Community 88 - "Community 88"
Cohesion: 0.67
Nodes (3): `(app)/`, `(public)/(auth)/`, Route groups explained

## Ambiguous Edges - Review These
- `Component` → `Component Grouping`  [AMBIGUOUS]
  docs/backend/v1.1-changes.md · relation: conceptually_related_to
- `groupName` → `Next.js App Router`  [AMBIGUOUS]
  docs/frontend/architecture.md · relation: conceptually_related_to

## Knowledge Gaps
- **364 isolated node(s):** `User`, `Meta`, `Category`, `Component`, `ComponentBoxQuantity` (+359 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Component` and `Component Grouping`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `groupName` and `Next.js App Router`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `cn()` connect `cn` to `AppLayout`, `BoxSuggestionPicker tsx`, `CategoriesPage tsx`, `ComponentDetailPage tsx`, `LoginForm tsx`, `DataTable tsx`, `useMeQuery`, `sheet tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `ValidationErrorDTO` connect `ApplyInventoryLogResult` to `ComponentFilterInput`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `GraphQLContext` connect `ApplyInventoryLogResult` to `ComponentFilterInput`, `main py`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Are the 71 inferred relationships involving `ValidationErrorDTO` (e.g. with `ApplyInventoryLogInput` and `ApplyInventoryLogResult`) actually correct?**
  _`ValidationErrorDTO` has 71 INFERRED edges - model-reasoned connections that need verification._
- **Are the 60 inferred relationships involving `GraphQLContext` (e.g. with `ApplyInventoryLogResult` and `ApplyInventoryLogSuccess`) actually correct?**
  _`GraphQLContext` has 60 INFERRED edges - model-reasoned connections that need verification._