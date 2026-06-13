# Graph Report - .  (2026-06-14)

## Corpus Check
- Corpus is ~32,640 words - fits in a single context window. You may not need a graph.

## Summary
- 820 nodes · 2360 edges · 61 communities (40 shown, 21 thin omitted)
- Extraction: 64% EXTRACTED · 36% INFERRED · 0% AMBIGUOUS · INFERRED: 850 edges (avg confidence: 0.52)
- Token cost: 14,200 input · 4,200 output

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
- `backend-api Service Container` --conceptually_related_to--> `FastAPI`  [INFERRED]
  docker/docker-compose.yml → docs/backend/architecture.md
- `User` --rationale_for--> `Per-User Data Isolation`  [INFERRED]
  CONTEXT.md → docs/backend/architecture.md

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

## Communities (61 total, 21 thin omitted)

### Community 0 - "ApplyInventoryLogResult"
Cohesion: 0.09
Nodes (78): ApplyInventoryLogResult, ApplyInventoryLogSuccess, AuthPayload, AuthTokenDTO, GraphQLContext, Info, ValidationErrorDTO, ValidationErrorType (+70 more)

### Community 1 - "Backend README"
Cohesion: 0.08
Nodes (63): Backend README, Layered Monolith Layout, Central Activity Log, ADD_STOCK, Aerich Migrations, applyInventoryLog Mutation, Box (Storage Label), BoxQuantity (+55 more)

### Community 2 - "package json"
Cohesion: 0.05
Nodes (42): dependencies, @base-ui/react, class-variance-authority, clsx, graphql, graphql-request, @hookform/resolvers, lucide-react (+34 more)

### Community 3 - "AppLayout"
Cohesion: 0.08
Nodes (34): useIsMobile(), AppSidebar(), navItems, Separator(), Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps (+26 more)

### Community 4 - "GraphQLContext"
Cohesion: 0.19
Nodes (36): GraphQLContext, ID, Info, ValidationErrorDTO, ValidationErrorType, ComponentFilterInput, PaginationInput, UUID (+28 more)

### Community 5 - "ComponentFilterInput"
Cohesion: 0.32
Nodes (34): ComponentFilterInput, GraphQLContext, ID, Info, InventoryLogFilterInput, ComponentConnection, ComponentType, Enum (+26 more)

### Community 6 - "main py"
Cohesion: 0.08
Nodes (23): lifespan(), client(), test_health(), UUID, AsyncClient, create_access_token(), decode_access_token(), extract_bearer_token() (+15 more)

### Community 7 - "BoxSuggestionPicker tsx"
Cohesion: 0.13
Nodes (19): BoxSuggestion, BoxSuggestionPicker(), BoxSuggestionPickerProps, getLogTypeBadgeVariant(), InventoryLogDialogProps, logTypeOptions, DialogFormProps, ThemeToggle() (+11 more)

### Community 8 - "cn"
Cohesion: 0.11
Nodes (22): cn(), AlertAction(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage() (+14 more)

### Community 9 - "FormGenerator tsx"
Cohesion: 0.10
Nodes (25): FormFieldConfig, FormFieldOption, FormGenerator(), FormGeneratorProps, Field(), FieldContent(), FieldDescription(), FieldError() (+17 more)

### Community 10 - "Category"
Cohesion: 0.09
Nodes (27): Category, Default category list, Feature: Categories, Low stock display semantics, lowStockThreshold, Settings → Categories, ComponentGroup entity, groupName (+19 more)

### Community 11 - "ApplyInventoryLogInput"
Cohesion: 0.29
Nodes (24): ApplyInventoryLogInput, ApplyInventoryLogSuccessDTO, InventoryLogFilterInput, PaginationInput, UUID, ValidationErrorDTO, BaseModel, ComponentBoxQuantity (+16 more)

### Community 12 - "CategoriesPage tsx"
Cohesion: 0.15
Nodes (14): CategoriesPage(), ComponentsPage(), DataTable(), DialogForm(), getGraphQLErrorMessage(), isValidationError(), ValidationErrorPayload, PageHeader() (+6 more)

### Community 13 - "ComponentDetailPage tsx"
Cohesion: 0.14
Nodes (20): ComponentDetailPage(), ComponentDetailPageProps, formatLogTypeLabel(), InventoryLogDialog(), useGraphQuery(), ComponentDetailRouteProps, ContentPanel(), ContentPanelProps (+12 more)

### Community 14 - "index ts"
Cohesion: 0.11
Nodes (22): APPLY_INVENTORY_LOG_MUTATION, AuthPayload, BoxQuantity, CATEGORIES_QUERY, Category, Component, COMPONENT_LOGS_QUERY, COMPONENT_QUERY (+14 more)

### Community 15 - "LoginForm tsx"
Cohesion: 0.12
Nodes (16): LoginForm(), RegisterForm(), REGISTER_MUTATION, CategoryFormValues, categorySchema, ComponentFormValues, componentSchema, InventoryLogFormValues (+8 more)

### Community 16 - "DataTable tsx"
Cohesion: 0.14
Nodes (19): ColumnMeta, DataTableProps, useIsMobile(), useMediaQuery(), Empty(), EmptyContent(), EmptyDescription(), EmptyHeader() (+11 more)

### Community 17 - "components json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 18 - "auth ts"
Cohesion: 0.13
Nodes (10): authorize(), { handlers, auth, signIn, signOut }, LOGIN_MUTATION, getGraphQLClient(), graphRequest(), RequestFn, UseGraphMutationOptions, UseGraphQueryOptions (+2 more)

### Community 19 - "tsconfig json"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 20 - "geistMono"
Cohesion: 0.21
Nodes (7): geistMono, geistSans, metadata, AppProviders(), ReactQueryProvider(), Toaster(), TooltipProvider()

### Community 21 - "useMeQuery"
Cohesion: 0.27
Nodes (7): useMeQuery(), SettingsPage(), Alert(), AlertDescription(), AlertTitle(), alertVariants, Skeleton()

### Community 22 - "sheet tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 23 - "__init__ py"
Cohesion: 0.25
Nodes (7): Category, Component, ComponentBoxQuantity, InventoryLog, InventoryLogType, Meta, User

### Community 24 - "BaseSettings"
Cohesion: 0.33
Nodes (4): BaseSettings, get_settings(), Settings, test_cors_origins_list_parses_csv()

### Community 25 - "User account"
Cohesion: 0.29
Nodes (7): User account, Frontend Architecture, NextAuth v5 Credentials, Frontend Folder Structure, Frontend Naming Conventions, Frontend app README, Frontend Documentation index

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
Cohesion: 0.67
Nodes (3): Inventory log types, REALLOCATE log type, Stock reallocation

### Community 31 - "DataTable shared component"
Cohesion: 0.67
Nodes (3): DataTable shared component, FormGenerator, components/includes/

### Community 32 - "GraphQL Code Generator"
Cohesion: 0.67
Nodes (3): GraphQL Code Generator, TanStack Query + graphql-request, use{Domain}Query/Mutation hooks

### Community 33 - "Next js Logo Wordmark"
Cohesion: 0.67
Nodes (3): Next.js Logo Wordmark, Next.js Triangle Arrow Mark, NEXT.JS Wordmark Typography

## Ambiguous Edges - Review These
- `Component` → `Component Grouping`  [AMBIGUOUS]
  docs/backend/v1.1-changes.md · relation: conceptually_related_to
- `groupName` → `Next.js App Router`  [AMBIGUOUS]
  docs/frontend/architecture.md · relation: conceptually_related_to

## Knowledge Gaps
- **167 isolated node(s):** `User`, `Meta`, `Category`, `Component`, `ComponentBoxQuantity` (+162 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Component` and `Component Grouping`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `groupName` and `Next.js App Router`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `cn()` connect `cn` to `AppLayout`, `BoxSuggestionPicker tsx`, `FormGenerator tsx`, `CategoriesPage tsx`, `ComponentDetailPage tsx`, `LoginForm tsx`, `DataTable tsx`, `useMeQuery`, `sheet tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `GraphQLContext` connect `ApplyInventoryLogResult` to `GraphQLContext`, `ComponentFilterInput`, `main py`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `ValidationErrorDTO` connect `ApplyInventoryLogResult` to `ApplyInventoryLogInput`, `GraphQLContext`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Are the 71 inferred relationships involving `ValidationErrorDTO` (e.g. with `ApplyInventoryLogInput` and `ApplyInventoryLogResult`) actually correct?**
  _`ValidationErrorDTO` has 71 INFERRED edges - model-reasoned connections that need verification._
- **Are the 60 inferred relationships involving `GraphQLContext` (e.g. with `ApplyInventoryLogResult` and `ApplyInventoryLogSuccess`) actually correct?**
  _`GraphQLContext` has 60 INFERRED edges - model-reasoned connections that need verification._