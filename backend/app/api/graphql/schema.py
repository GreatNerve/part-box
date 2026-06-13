import strawberry

from app.api.graphql.auth_mutations import AuthMutation
from app.api.graphql.category_queries import Query as CategoryQuery
from app.api.graphql.component_mutations import ComponentMutation
from app.api.graphql.component_queries import ComponentQuery
from app.api.graphql.category_mutations import CategoryMutation
from app.api.graphql.health_queries import HealthQuery
from app.api.graphql.inventory_log_mutations import InventoryLogMutation


@strawberry.type
class Query(CategoryQuery, ComponentQuery, HealthQuery):
    pass


@strawberry.type
class Mutation(AuthMutation, CategoryMutation, ComponentMutation, InventoryLogMutation):
    pass


schema = strawberry.Schema(query=Query, mutation=Mutation)
