# Graph Report - backend  (2026-06-14)

## Corpus Check
- 50 files · ~7,947 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 350 nodes · 1533 edges · 23 communities (18 shown, 5 thin omitted)
- Extraction: 47% EXTRACTED · 53% INFERRED · 0% AMBIGUOUS · INFERRED: 820 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5d6984dd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 18|Community 18]]

## God Nodes (most connected - your core abstractions)
1. `ValidationErrorDTO` - 90 edges
2. `GraphQLContext` - 70 edges
3. `ValidationErrorType` - 65 edges
4. `FieldErrorType` - 50 edges
5. `PaginationInput` - 48 edges
6. `ApplyInventoryLogInput` - 35 edges
7. `ComponentFilterInput` - 32 edges
8. `ComponentType` - 30 edges
9. `InventoryLogFilterInput` - 30 edges
10. `ComponentSortField` - 29 edges

## Surprising Connections (you probably didn't know these)
- `test_jwt_invalid_token_returns_none()` --calls--> `decode_access_token()`  [EXTRACTED]
  tests/unit/core/test_auth.py → app/core/auth.py
- `client()` --calls--> `init_db()`  [INFERRED]
  tests/integration/api/test_health.py → app/core/db.py
- `client()` --calls--> `close_db()`  [INFERRED]
  tests/integration/api/test_health.py → app/core/db.py
- `test_cors_origins_list_parses_csv()` --calls--> `Settings`  [EXTRACTED]
  tests/unit/core/test_settings.py → app/core/settings.py
- `RegisterInputGQL` --uses--> `FieldErrorType`  [INFERRED]
  app/api/graphql/auth_mutations.py → app/api/graphql/auth_types.py

## Import Cycles
- 1-file cycle: `app/api/main.py -> app/api/main.py`
- 1-file cycle: `app/core/auth.py -> app/core/auth.py`
- 1-file cycle: `app/grpc/servicers/inventory.py -> app/grpc/servicers/inventory.py`
- 1-file cycle: `app/services/category.py -> app/services/category.py`
- 1-file cycle: `app/services/component.py -> app/services/component.py`
- 1-file cycle: `app/services/inventory_log.py -> app/services/inventory_log.py`

## Communities (23 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (44): AuthTokenDTO, GraphQLContext, Info, ValidationErrorDTO, ValidationErrorType, UUID, AuthTokenDTO, ValidationErrorDTO (+36 more)

### Community 1 - "Community 1"
Cohesion: 0.16
Nodes (38): GraphQLContext, Info, GraphQLContext, ID, Info, ValidationErrorDTO, ValidationErrorType, GraphQLContext (+30 more)

### Community 2 - "Community 2"
Cohesion: 0.20
Nodes (44): ComponentFilterInput, PaginationInput, UUID, ValidationErrorDTO, InventoryLogFilterInput, PaginationInput, UUID, ValidationErrorDTO (+36 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (27): AbstractEventLoop, lifespan(), client(), test_health(), UUID, extract_bearer_token(), close_db(), init_db() (+19 more)

### Community 4 - "Community 4"
Cohesion: 0.32
Nodes (34): ComponentFilterInput, GraphQLContext, ID, Info, InventoryLogFilterInput, ComponentConnection, ComponentType, Enum (+26 more)

### Community 5 - "Community 5"
Cohesion: 0.25
Nodes (25): GraphQLContext, Info, ValidationErrorDTO, ValidationErrorType, UUID, ValidationErrorDTO, CategoryDTO, CategoryType (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (9): AuthService, AuthServiceServicer, AuthServiceStub, Missing associated documentation comment in .proto file., Constructor.          Args:             channel: A grpc.Channel., Missing associated documentation comment in .proto file., Missing associated documentation comment in .proto file., Missing associated documentation comment in .proto file. (+1 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (8): InventoryService, InventoryServiceServicer, InventoryServiceStub, Missing associated documentation comment in .proto file., Constructor.          Args:             channel: A grpc.Channel., Missing associated documentation comment in .proto file., Missing associated documentation comment in .proto file., Missing associated documentation comment in .proto file.

### Community 8 - "Community 8"
Cohesion: 0.25
Nodes (9): gql(), Full user lifecycle integration test.  Creates a user, exercises GraphQL API,, test_full_user_lifecycle(), Component, ComponentBoxQuantity, InventoryLog, Meta, User (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (7): Backend, Documentation, Frontend contract, Getting started, Project structure, Role, Stack

### Community 10 - "Community 10"
Cohesion: 0.38
Nodes (4): BaseSettings, get_settings(), Settings, test_cors_origins_list_parses_csv()

### Community 12 - "Community 12"
Cohesion: 0.67
Nodes (3): BaseDBAsyncClient, downgrade(), upgrade()

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (3): BaseDBAsyncClient, downgrade(), upgrade()

## Knowledge Gaps
- **10 isolated node(s):** `AbstractEventLoop`, `StatusCode`, `Meta`, `generate_proto.sh script`, `Role` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ValidationErrorDTO` connect `Community 0` to `Community 1`, `Community 2`, `Community 5`?**
  _High betweenness centrality (0.206) - this node is a cross-community bridge._
- **Why does `GraphQLContext` connect `Community 1` to `Community 0`, `Community 3`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `PaginationInput` connect `Community 2` to `Community 3`, `Community 4`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 73 inferred relationships involving `ValidationErrorDTO` (e.g. with `AuthTokenDTO` and `GraphQLContext`) actually correct?**
  _`ValidationErrorDTO` has 73 INFERRED edges - model-reasoned connections that need verification._
- **Are the 60 inferred relationships involving `GraphQLContext` (e.g. with `AuthTokenDTO` and `GraphQLContext`) actually correct?**
  _`GraphQLContext` has 60 INFERRED edges - model-reasoned connections that need verification._
- **Are the 55 inferred relationships involving `ValidationErrorType` (e.g. with `AuthTokenDTO` and `GraphQLContext`) actually correct?**
  _`ValidationErrorType` has 55 INFERRED edges - model-reasoned connections that need verification._
- **Are the 41 inferred relationships involving `FieldErrorType` (e.g. with `AuthTokenDTO` and `GraphQLContext`) actually correct?**
  _`FieldErrorType` has 41 INFERRED edges - model-reasoned connections that need verification._