import strawberry
from graphql import GraphQLError

from app.api.graphql.auth_types import UserType
from app.api.graphql.context import GraphQLContext
from app.services import auth as auth_service
from app.services import category as category_service


@strawberry.type
class CategoryType:
    id: strawberry.ID
    name: str
    is_default: bool


@strawberry.type
class Query:
    @strawberry.field
    async def me(self, info: strawberry.Info[GraphQLContext]) -> UserType | None:
        if info.context.user_id is None:
            return None
        user = await auth_service.get_user_by_id(info.context.user_id)
        if user is None:
            return None
        return UserType(
            id=user.id,
            email=str(user.email),
            display_name=user.display_name,
            created_at=user.created_at,
        )

    @strawberry.field
    async def categories(self, info: strawberry.Info[GraphQLContext]) -> list[CategoryType]:
        if info.context.user_id is None:
            raise GraphQLError("Authentication required.", extensions={"code": "UNAUTHENTICATED"})
        items = await category_service.list_categories(info.context.user_id)
        return [
            CategoryType(id=strawberry.ID(str(item.id)), name=item.name, is_default=item.is_default)
            for item in items
        ]
